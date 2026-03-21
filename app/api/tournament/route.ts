import { NextResponse } from 'next/server'
import { getTournamentData, withTournamentData } from '@/lib/db'

export async function GET() {
  const data = await getTournamentData()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json()
    
    // withTournamentData handles locking and reading/writing the latest data
    const updatedData = await withTournamentData(async (data) => {
      switch (action) {
        case 'ADD_PLAYER':
          data.players.push({
            id: Math.random().toString(36).substr(2, 9),
            name: payload.name
          })
          break
          
        case 'REMOVE_PLAYER':
          data.players = data.players.filter((p: any) => p.id !== payload.id)
          break
          
        case 'UPDATE_MATCH':
          const round = data.rounds.find((r: any) => r.roundNumber === payload.roundNumber)
          if (round) {
            const match = round.matches.find((m: any) => m.id === payload.matchId)
            if (match) {
              Object.assign(match, payload.updates)
            }
          }
          break
          
        case 'ADD_MATCH':
          const rToUpdate = data.rounds.find((r: any) => r.roundNumber === payload.roundNumber)
          if (rToUpdate) {
              rToUpdate.matches.push({
                  id: String(rToUpdate.matches.length + 1),
                  playerAId: '',
                  playerBId: '',
                  winnerId: null,
                  pointsA: '',
                  pointsB: '',
              })
          } else {
              data.rounds.unshift({
                  roundNumber: payload.roundNumber,
                  matches: [{
                      id: '1',
                      playerAId: '',
                      playerBId: '',
                      winnerId: null,
                      pointsA: '',
                      pointsB: '',
                  }]
              })
          }
          break

        case 'DELETE_MATCH':
          const rDelete = data.rounds.find((r: any) => r.roundNumber === payload.roundNumber)
          if (rDelete) {
            rDelete.matches = rDelete.matches.filter((m: any) => m.id !== payload.matchId)
          }
          break

        case 'GENERATE_ROUND':
          data.rounds.unshift({
            roundNumber: payload.roundNumber,
            matches: payload.matches
          })
          break
          
        case 'DELETE_ROUND':
          data.rounds = data.rounds.filter((r: any) => r.roundNumber !== payload.roundNumber)
          break
          
        case 'RESET_ROUNDS':
          data.rounds = []
          break
          
        case 'FULL_SYNC': // Keeping as fallback but generally avoid
          Object.assign(data, payload)
          break
          
        default:
          throw new Error('Unknown action')
      }
      return data
    })
    
    return NextResponse.json({ success: true, data: updatedData })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to process action' }, { status: 500 })
  }
}
