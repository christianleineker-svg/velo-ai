'use client'

import { useState } from 'react'
import { useSSE } from './useSSE'

export function useExecution(squadId: string) {
  const [executionId, setExecutionId] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)

  const sseState = useSSE(executionId)

  async function startExecution(input: string): Promise<void> {
    setIsStarting(true)
    setStartError(null)
    setExecutionId(null)

    try {
      const res = await fetch(`/api/squads/${squadId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      const json = (await res.json()) as { data?: { executionId: string }; error?: string }

      if (!res.ok || !json.data) {
        throw new Error(json.error ?? 'Falha ao iniciar execução')
      }

      setExecutionId(json.data.executionId)
    } catch (err) {
      setStartError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsStarting(false)
    }
  }

  return {
    executionId,
    isStarting,
    startError,
    startExecution,
    ...sseState,
  }
}
