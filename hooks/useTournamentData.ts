'use client'

import { useState, useEffect, useCallback } from 'react'

export type Player = {
  id: string
  name: string
}

export type Match = {
  id: string
  playerAId: string
  playerBId: string
  winnerId: string | 'draw' | null // ID of the winner, 'draw', or null if not played
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

const STORAGE_KEYS = {
  PLAYERS: 'mbg_tournament_players',
  ROUNDS: 'mbg_tournament_rounds',
}

export function useTournamentData() {
  const [players, setPlayers] = useState<Player[]>([])
  const [rounds, setRounds] = useState<Round[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const savedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS)
    const savedRounds = localStorage.getItem(STORAGE_KEYS.ROUNDS)

    if (savedPlayers) setPlayers(JSON.parse(savedPlayers))
    if (savedRounds) setRounds(JSON.parse(savedRounds))
    
    setIsLoaded(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players))
    }
  }, [players, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(rounds))
    }
  }, [rounds, isLoaded])

  const addPlayer = useCallback((name: string) => {
    setPlayers(prev => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), name }
    ])
  }, [])

  const removePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id))
  }, [])

  const updateMatchResult = useCallback((roundNumber: number, matchId: string, updates: Partial<Match>) => {
    setRounds(prev => prev.map(r => {
      if (r.roundNumber !== roundNumber) return r
      return {
        ...r,
        matches: r.matches.map(m => {
          if (m.id !== matchId) return m
          return { ...m, ...updates }
        })
      }
    }))
  }, [])

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

    setRounds(prev => [{ roundNumber: nextRoundNum, matches: nextMatches }, ...prev])
  }, [players, rounds])

  const deleteLastRound = useCallback(() => {
    setRounds(prev => prev.slice(1))
  }, [])

  const resetTournament = useCallback(() => {
    setRounds([])
  }, [])

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
    isLoaded
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
        // Draws could be handled here if needed
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

