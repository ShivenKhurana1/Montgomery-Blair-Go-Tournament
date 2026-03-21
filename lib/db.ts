import { createClient } from '@supabase/supabase-js'
import fs from 'fs/promises'
import path from 'path'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const DATA_FILE = path.join(process.cwd(), 'data', 'tournament.json')

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null

// Simple mutex implementation to prevent concurrent file access issues
class Mutex {
  private queue: Promise<void> = Promise.resolve()

  async lock(): Promise<() => void> {
    let release: () => void
    const next = new Promise<void>((resolve) => {
      release = resolve
    })
    const wait = this.queue
    this.queue = this.queue.then(() => next)
    await wait
    return release!
  }
}

const dbMutex = new Mutex()

// --- Local File Storage Helpers ---
async function getLocalData() {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return { players: [], rounds: [] }
  }
}

async function saveLocalData(data: { players: any[]; rounds: any[] }) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// --- Supabase Cloud Storage Helpers ---
// TABLE EXPECTED: tournament (id int primary key, data jsonb)
async function getCloudData() {
  if (!supabase) return getLocalData()
  
  const { data, error } = await supabase
    .from('tournament')
    .select('data')
    .eq('id', 1)
    .single()
    
  if (error || !data) return { players: [], rounds: [] }
  return data.data
}

async function saveCloudData(data: { players: any[]; rounds: any[] }) {
  if (!supabase) return saveLocalData(data)
  
  const { error } = await supabase
    .from('tournament')
    .upsert({ id: 1, data })
    
  if (error) {
    console.error('Supabase Save Error:', error)
    throw error
  }
}

// --- Main API Surface ---
export async function getTournamentData() {
  return getCloudData()
}

export async function saveTournamentData(data: { players: any[]; rounds: any[] }) {
  return saveCloudData(data)
}

// Helper to perform an atomic operation on the data
export async function withTournamentData<T>(op: (data: any) => Promise<T>): Promise<T> {
  const release = await dbMutex.lock()
  try {
    const data = await getTournamentData()
    const result = await op(data)
    await saveTournamentData(data)
    return result
  } finally {
    release()
  }
}
