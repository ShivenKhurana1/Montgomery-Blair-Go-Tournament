'use client'

import { useTournamentData } from '@/hooks/useTournamentData'

type MatchProps = {
  id: string
  playerAId: string
  playerBId: string
  winnerId: string | 'draw' | null
  pointsA?: string
  pointsB?: string
  playerAName: string
  playerBName: string
  highlight?: boolean
}

function MatchCard({ id, playerAId, playerBId, winnerId, pointsA, pointsB, playerAName, playerBName, highlight = false }: MatchProps) {
  const getResultBadge = (pid: string) => {
    if (!winnerId) return null
    if (winnerId === 'draw') return <span className="text-[10px] font-bold text-gray-400">(D)</span>
    return winnerId === pid ? (
      <span className="text-[10px] font-bold text-green-600">(W)</span>
    ) : (
      <span className="text-[10px] font-bold text-red-600">(L)</span>
    )
  }

  return (
    <div
      className={`w-full rounded-2xl border p-4 transition-all duration-200 ${
        highlight
          ? 'border-navy-300 bg-navy-50 shadow-lg'
          : 'border-gray-200 bg-white shadow-sm hover:shadow-md'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Table {id}
        </span>
        <span className="h-2 w-2 rounded-full bg-navy-400"></span>
      </div>

      <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
        <div className="flex items-center space-x-1.5">
          <span>{playerAName}</span>
          {getResultBadge(playerAId)}
        </div>
        <span className="inline-flex h-8 w-11 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-600">
          {pointsA || '\u00A0'}
        </span>
      </div>

      <div className="my-2 border-t border-gray-200"></div>

      <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
        <div className="flex items-center space-x-1.5">
          <span>{playerBName}</span>
          {getResultBadge(playerBId)}
        </div>
        <span className="inline-flex h-8 w-11 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-600">
          {pointsB || '\u00A0'}
        </span>
      </div>
    </div>
  )
}

export default function RankingsPage() {
  const { players, rounds, standings, isLoaded } = useTournamentData()

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading rankings...</div>
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8 rounded-3xl border border-navy-300 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-8 shadow-lg">
        <div className="mb-4 flex items-center space-x-2">
          <div className="go-stone-black h-6 w-6"></div>
          <div className="go-stone-white h-6 w-6"></div>
        </div>

        <h1 className="text-4xl font-bold text-white sm:text-5xl">Tournament Pairings & Standings</h1>
        <p className="mt-4 max-w-2xl text-base text-navy-100 sm:text-lg">
          Current standings and pairings for the Swiss-system tournament.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {players.length} Players
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {rounds.length} Rounds Swiss
          </span>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900">Current Standings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                  SOS
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {standings.map((player, index) => (
                <tr
                  key={player.playerId}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'} transition-colors hover:bg-navy-50/50`}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      {player.rank === 1 && (
                        <div className="go-stone-yellow flex h-7 w-7 items-center justify-center text-xs font-bold text-navy-900">
                          1
                        </div>
                      )}
                      {player.rank === 2 && (
                        <div className="go-stone-gray flex h-7 w-7 items-center justify-center text-xs font-bold text-white">
                          2
                        </div>
                      )}
                      {player.rank === 3 && (
                        <div className="go-stone-bronze flex h-7 w-7 items-center justify-center text-xs font-bold text-white">
                          3
                        </div>
                      )}
                      {player.rank > 3 && (
                        <span className="text-sm font-semibold text-gray-900">{player.rank}</span>
                      )}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                    {player.name}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex h-7 w-11 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                      {player.sos || '0'}
                    </span>
                  </td>
                </tr>
              ))}
              {standings.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-gray-500">
                    No players registered. Navigate to the staff page to add players.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8 space-y-8">
        {rounds.map((round) => (
          <div key={round.roundNumber} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-2xl font-semibold text-gray-900">Round {round.roundNumber} {round.roundNumber === rounds[0].roundNumber ? 'Pairings' : 'Results'}</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {round.matches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    id={match.id}
                    playerAId={match.playerAId}
                    playerBId={match.playerBId}
                    playerAName={players.find(p => p.id === match.playerAId)?.name || 'TBD'}
                    playerBName={players.find(p => p.id === match.playerBId)?.name || 'TBD'}
                    winnerId={match.winnerId}
                    pointsA={match.pointsA}
                    pointsB={match.pointsB}
                    highlight={round.roundNumber === rounds[0].roundNumber} 
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
        {rounds.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-gray-500">
            Tournament has not started yet.
          </div>
        )}
      </div>
    </div>
  )
}
