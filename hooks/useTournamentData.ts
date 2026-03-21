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
  
  const isUpdatingRef = useRef(false)

  const fetchData = useCallback(async () => {
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

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  const performAction = useCallback(async (action: string, payload: any) => {
    isUpdatingRef.current = true
    setIsSaving(true)
    try {
      const res = await fetch('/api/tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      })
      if (res.ok) {
        const { data } = await res.json()
        if (data) {
          setPlayers(data.players || [])
          setRounds(data.rounds || [])
        }
      }
    } catch (error) {
      console.error(`Action ${action} failed:`, error)
    } finally {
      setIsSaving(false)
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 1000)
    }
  }, [])

  const addPlayer = useCallback((name: string) => {
    performAction('ADD_PLAYER', { name })
  }, [performAction])

  const removePlayer = useCallback((id: string) => {
    performAction('REMOVE_PLAYER', { id })
  }, [performAction])

  const updateMatchResult = useCallback((roundNumber: number, matchId: string, updates: Partial<Match>) => {
    performAction('UPDATE_MATCH', { roundNumber, matchId, updates })
  }, [performAction])

  const addManualMatch = useCallback((roundNumber: number) => {
    performAction('ADD_MATCH', { roundNumber })
  }, [performAction])

  const deleteMatch = useCallback((roundNumber: number, matchId: string) => {
    performAction('DELETE_MATCH', { roundNumber, matchId })
  }, [performAction])

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

    performAction('GENERATE_ROUND', { roundNumber: nextRoundNum, matches: nextMatches })
  }, [players, rounds, performAction])

  const deleteLastRound = useCallback(() => {
    if (rounds.length > 0) {
      performAction('DELETE_ROUND', { roundNumber: rounds[0].roundNumber })
    }
  }, [rounds, performAction])

  const resetTournament = useCallback(() => {
    performAction('RESET_ROUNDS', {})
  }, [performAction])

  return {
    players,
    rounds,
    addPlayer,
    removePlayer,
    updateMatchResult,
    addManualMatch,
    deleteMatch,
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
    const stats = statsMap[p.id] || { wins: 0, losses: 0, opponents: [] }
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
