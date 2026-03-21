'use client'

import { useState, useMemo } from 'react'
import { useTournamentData, Match } from '@/hooks/useTournamentData'

export default function StaffPage() {
  const { players, rounds, addPlayer, removePlayer, updateMatchResult, addManualMatch, deleteMatch, generateNextRound, deleteLastRound, resetTournament, isLoaded, isSaving } = useTournamentData()
  const [activeTab, setActiveTab] = useState<'players' | 'pairings' | 'results'>('players')
  const [newPlayerName, setNewPlayerName] = useState('')

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlayerName.trim()) return
    addPlayer(newPlayerName.trim())
    setNewPlayerName('')
  }

  const handleDeleteLastRound = () => {
    if (window.confirm(`Are you sure you want to delete Round ${rounds[0].roundNumber}? This cannot be undone.`)) {
      deleteLastRound()
    }
  }

  const handleResetTournament = () => {
    if (window.confirm('Are you sure you want to RESET ALL PAIRINGS? This will clear all rounds. Players will remain registered.')) {
      resetTournament()
      setActiveTab('players')
    }
  }

  // Helper to get players not already in the current round
  const getAvailablePlayers = (currentRound: number, excludeMatchId?: string, currentPlayerId?: string) => {
    const round = rounds.find(r => r.roundNumber === currentRound)
    if (!round) return players

    const pairedPlayerIds = new Set<string>()
    round.matches.forEach(m => {
      if (m.id !== excludeMatchId) {
        if (m.playerAId) pairedPlayerIds.add(m.playerAId)
        if (m.playerBId) pairedPlayerIds.add(m.playerBId)
      }
    })

    return players.filter(p => !pairedPlayerIds.has(p.id) || p.id === currentPlayerId)
  }

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading tournament data...</div>
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8 rounded-3xl border border-navy-300 bg-gradient-to-br from-red-900 via-red-800 to-red-700 p-8 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded bg-white/20 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Admin Area
          </div>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isSaving ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span className="text-xs font-medium text-red-100">
              {isSaving ? 'Saving...' : 'Synced'}
            </span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white sm:text-5xl">Tournament Director Dashboard</h1>
        <p className="mt-4 max-w-2xl text-base text-red-100 sm:text-lg">
          Control the Swiss tournament, manage players, generate pairings, and enter results.
        </p>
      </div>

      <div className="mb-8 flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('players')}
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'players'
              ? 'border-navy-600 text-navy-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Manage Players
        </button>
        <button
          onClick={() => setActiveTab('pairings')}
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'pairings'
              ? 'border-navy-600 text-navy-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Manage Pairings
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'results'
              ? 'border-navy-600 text-navy-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Enter Results
        </button>
      </div>

      {activeTab === 'players' && (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Registered Players ({players.length})</h2>
          
          <form onSubmit={handleAddPlayer} className="mb-8 flex max-w-md space-x-3">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="New Player Name"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-navy-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
            >
              Add Player
            </button>
          </form>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{player.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pairings' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Round {rounds.length > 0 ? rounds[0].roundNumber : 1} Pairings</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => generateNextRound()}
                  className="rounded-xl bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-700"
                >
                  Auto-Generate
                </button>
                <button
                  onClick={() => {
                    if (rounds.length === 0) {
                       // First create the round if it doesn't exist
                       // Actually useTournamentData doesn't have createEmptyRound yet, but 
                       // we'll assume for simplicity directors can auto-gen then edit, or we add one manual match.
                    }
                    addManualMatch(rounds.length > 0 ? rounds[0].roundNumber : 1)
                  }}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-200"
                >
                  Add Table
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {(rounds.length > 0 ? rounds[0].matches : []).map((match) => (
                <div key={match.id} className="flex flex-col space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Table {match.id}</span>
                    <button
                      onClick={() => deleteMatch(rounds[0].roundNumber, match.id)}
                      className="text-[10px] font-bold text-red-400 hover:text-red-600"
                    >
                      REMOVE
                    </button>
                  </div>
                  <div className="grid gap-2">
                    <select
                      value={match.playerAId}
                      onChange={(e) => updateMatchResult(rounds[0].roundNumber, match.id, { playerAId: e.target.value })}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-navy-500 focus:outline-none"
                    >
                      <option value="">Select Player A</option>
                      {getAvailablePlayers(rounds[0].roundNumber, match.id, match.playerAId).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <div className="text-center text-[10px] font-bold text-gray-300">VS</div>
                    <select
                      value={match.playerBId}
                      onChange={(e) => updateMatchResult(rounds[0].roundNumber, match.id, { playerBId: e.target.value })}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-navy-500 focus:outline-none"
                    >
                      <option value="">Select Player B</option>
                      {getAvailablePlayers(rounds[0].roundNumber, match.id, match.playerBId).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {(rounds.length === 0 || rounds[0].matches.length === 0) && (
                <div className="col-span-full py-12 text-center text-sm text-gray-500">
                  No pairings yet for this round. Use "Auto-Generate" or "Add Table".
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-red-900">Danger Zone</h2>
            <div className="flex flex-wrap gap-4">
              {rounds.length > 0 && (
                <button
                  onClick={handleDeleteLastRound}
                  className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50"
                >
                  Delete Round {rounds[0].roundNumber}
                </button>
              )}
              <button
                onClick={handleResetTournament}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
              >
                Reset All Pairings
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-8">
          {rounds.map((round) => (
            <div key={round.roundNumber} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Round {round.roundNumber} Results</h2>
                {round.roundNumber === rounds[0].roundNumber && (
                   <button
                    onClick={handleDeleteLastRound}
                    className="text-xs font-semibold text-red-600 hover:text-red-800"
                  >
                    Delete Round
                  </button>
                )}
              </div>
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {round.matches.map((match) => (
                    <div key={match.id} className="rounded-xl border border-gray-200 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Table {match.id}</span>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Player A Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-1 items-center space-x-3">
                            <span className="text-sm font-medium text-gray-900 text-truncate max-w-[120px]">
                              {players.find(p => p.id === match.playerAId)?.name || 'Select Player'}
                            </span>
                            {match.playerAId && match.playerBId && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => updateMatchResult(round.roundNumber, match.id, { winnerId: match.playerAId })}
                                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                    match.winnerId === match.playerAId
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  WIN
                                </button>
                                <button
                                  onClick={() => updateMatchResult(round.roundNumber, match.id, { winnerId: match.playerBId })}
                                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                    match.winnerId === match.playerBId
                                      ? 'bg-red-600 text-white'
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  LOSS
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase text-gray-400">Points</span>
                            <input
                              type="text"
                              value={match.pointsA || ''}
                              onChange={(e) => updateMatchResult(round.roundNumber, match.id, { pointsA: e.target.value })}
                              placeholder="0"
                              className="w-12 rounded border border-gray-200 px-1.5 py-1 text-center text-xs focus:border-navy-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="my-1 border-t border-gray-100"></div>

                        {/* Player B Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-1 items-center space-x-3">
                            <span className="text-sm font-medium text-gray-900 text-truncate max-w-[120px]">
                              {players.find(p => p.id === match.playerBId)?.name || 'Select Player'}
                            </span>
                            {match.playerAId && match.playerBId && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => updateMatchResult(round.roundNumber, match.id, { winnerId: match.playerBId })}
                                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                    match.winnerId === match.playerBId
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  WIN
                                </button>
                                <button
                                  onClick={() => updateMatchResult(round.roundNumber, match.id, { winnerId: match.playerAId })}
                                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                    match.winnerId === match.playerAId
                                      ? 'bg-red-600 text-white'
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  LOSS
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase text-gray-400">Points</span>
                            <input
                              type="text"
                              value={match.pointsB || ''}
                              onChange={(e) => updateMatchResult(round.roundNumber, match.id, { pointsB: e.target.value })}
                              placeholder="0"
                              className="w-12 rounded border border-gray-200 px-1.5 py-1 text-center text-xs focus:border-navy-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => updateMatchResult(round.roundNumber, match.id, { winnerId: null })}
                          className="w-full rounded border border-gray-100 py-1 text-[10px] font-medium text-gray-400 hover:bg-gray-50"
                        >
                          Clear Result
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {rounds.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No rounds generated yet. Go to "Manage Pairings" to start.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
