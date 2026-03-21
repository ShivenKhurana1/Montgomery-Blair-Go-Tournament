'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export type Player = {
  id: string
  name: string
}

export type Match = {
  id: string
  playerAId: string
  playerBId: string
  winnerId: string | 'draw' | null
  pointsA?: string
  pointsB?: string
}

export type Round = {
  roundNumber: number
  matches: Match[]
}

export type Standing = {
  rank: number
  name: string
  wins: number
  losses: number
  sos: number
  playerId: string
}

export function useTournamentData() {
  const [players, setPlayers] = useState<Player[]>([])
  const [rounds, setRounds] = useState<Round[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Use a ref to track if the current process is the one saving to avoid race conditions with polling
  const isUpdatingRef = useRef(false)

  const fetchData = useCallback(async () => {
    // If we're currently in the middle of a local update/save, don't fetch yet
    if (isUpdatingRef.current) return

    try {
      const res = await fetch('/api/tournament')
      if (res.ok) {
        const data = await res.json()
        setPlayers(data.players || [])
        setRounds(data.rounds || [])
        setIsLoaded(true)
      }
    } catch (error) {
      console.error('Failed to fetch tournament data:', error)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Polling every 5 seconds for cross-user updates
  useEffect(() => {
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  const saveData = useCallback(async (newPlayers: Player[], newRounds: Round[]) => {
    isUpdatingRef.current = true
    setIsSaving(true)
    try {
      await fetch('/api/tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ players: newPlayers, rounds: newRounds }),
      })
    } catch (error) {
      console.error('Failed to save tournament data:', error)
    } finally {
      setIsSaving(false)
      // Allow polling to resume after a short delay to ensure the server has processed the update
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 1000)
    }
  }, [])

  const addPlayer = useCallback((name: string) => {
    const newPlayers = [
      ...players,
      { id: Math.random().toString(36).substr(2, 9), name }
    ]
    setPlayers(newPlayers)
    saveData(newPlayers, rounds)
  }, [players, rounds, saveData])

  const removePlayer = useCallback((id: string) => {
    const newPlayers = players.filter(p => p.id !== id)
    setPlayers(newPlayers)
    saveData(newPlayers, rounds)
  }, [players, rounds, saveData])

  const updateMatchResult = useCallback((roundNumber: number, matchId: string, updates: Partial<Match>) => {
    const newRounds = rounds.map(r => {
      if (r.roundNumber !== roundNumber) return r
      return {
        ...r,
        matches: r.matches.map(m => {
          if (m.id !== matchId) return m
          return { ...m, ...updates }
        })
      }
    })
    setRounds(newRounds)
    saveData(players, newRounds)
  }, [players, rounds, saveData])

  const generateNextRound = useCallback(() => {
    const nextRoundNum = rounds.length + 1
    const currentStandings = calculateStandings(players, rounds)
    const sortedPlayerIds = currentStandings.map(s => s.playerId)
    
    const nextMatches: Match[] = []
    for (let i = 0; i < sortedPlayerIds.length; i += 2) {
      if (sortedPlayerIds[i + 1]) {
        nextMatches.push({
          id: String(nextMatches.length + 1),
          playerAId: sortedPlayerIds[i],
          playerBId: sortedPlayerIds[i + 1],
          winnerId: null,
          pointsA: '',
          pointsB: '',
        })
      }
    }

    const newRounds = [{ roundNumber: nextRoundNum, matches: nextMatches }, ...rounds]
    setRounds(newRounds)
    saveData(players, newRounds)
  }, [players, rounds, saveData])

  const deleteLastRound = useCallback(() => {
    const newRounds = rounds.slice(1)
    setRounds(newRounds)
    saveData(players, newRounds)
  }, [players, rounds, saveData])

  const resetTournament = useCallback(() => {
    setRounds([])
    saveData(players, [])
  }, [players, saveData])

  return {
    players,
    rounds,
    addPlayer,
    removePlayer,
    updateMatchResult,
    generateNextRound,
    deleteLastRound,
    resetTournament,
    standings: calculateStandings(players, rounds),
    isLoaded,
    isSaving,
    refresh: fetchData,
  }
}

function calculateStandings(players: Player[], rounds: Round[]): Standing[] {
  const statsMap: Record<string, { wins: number, losses: number, opponents: string[] }> = {}
  
  players.forEach(p => {
    statsMap[p.id] = { wins: 0, losses: 0, opponents: [] }
  })

  rounds.forEach(round => {
    round.matches.forEach(match => {
      if (!match.winnerId) return

      if (statsMap[match.playerAId]) {
        statsMap[match.playerAId].opponents.push(match.playerBId)
        if (match.winnerId === match.playerAId) statsMap[match.playerAId].wins++
        else if (match.winnerId === match.playerBId) statsMap[match.playerAId].losses++
      }
      
      if (statsMap[match.playerBId]) {
        statsMap[match.playerBId].opponents.push(match.playerAId)
        if (match.winnerId === match.playerBId) statsMap[match.playerBId].wins++
        else if (match.winnerId === match.playerAId) statsMap[match.playerBId].losses++
      }
    })
  })

  const standings: Standing[] = players.map(p => {
    const stats = statsMap[p.id]
    const sos = stats.opponents.reduce((acc, oppId) => acc + (statsMap[oppId]?.wins || 0), 0)
    
    return {
      playerId: p.id,
      name: p.name,
      wins: stats.wins,
      losses: stats.losses,
      sos,
      rank: 0,
    }
  })

  standings.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    return b.sos - a.sos
  })

  standings.forEach((s, idx) => {
    s.rank = idx + 1
  })

  return standings
}
