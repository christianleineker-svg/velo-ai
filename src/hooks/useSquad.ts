'use client'

import { useState, useEffect } from 'react'
import { Squad } from '@/types'

export function useSquads() {
  const [squads, setSquads] = useState<Squad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSquads() {
      try {
        const res = await fetch('/api/squads')
        const json = (await res.json()) as { data?: Squad[]; error?: string }
        if (!res.ok) throw new Error(json.error ?? 'Erro ao buscar squads')
        setSquads(json.data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }
    fetchSquads()
  }, [])

  return { squads, loading, error }
}
