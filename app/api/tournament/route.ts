import { NextResponse } from 'next/server'
import { getTournamentData, saveTournamentData } from '@/lib/db'

export async function GET() {
  const data = await getTournamentData()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await saveTournamentData(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
