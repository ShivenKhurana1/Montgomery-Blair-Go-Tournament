import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'tournament.json')

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

export async function getTournamentData() {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return { players: [], rounds: [] }
  }
}

export async function saveTournamentData(data: { players: any[]; rounds: any[] }) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
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
