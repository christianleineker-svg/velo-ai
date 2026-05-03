'use client'

import { useEffect, useState, useRef } from 'react'
import { SSEEvent, ExecutionLog } from '@/types'

interface SSEState {
  logs: ExecutionLog[]
  status: 'idle' | 'running' | 'completed' | 'failed'
  output: string | null
  error: string | null
}

export function useSSE(executionId: string | null) {
  const [state, setState] = useState<SSEState>({
    logs: [],
    status: 'idle',
    output: null,
    error: null,
  })
  const agentOutputs = useRef<Record<string, string>>({})

  useEffect(() => {
    if (!executionId) return

    setState({ logs: [], status: 'running', output: null, error: null })
    agentOutputs.current = {}

    const eventSource = new EventSource(`/api/stream/${executionId}`)

    eventSource.onmessage = (e: MessageEvent) => {
      const event = JSON.parse(e.data as string) as SSEEvent

      if (event.type === 'agent_start') {
        setState((prev) => ({
          ...prev,
          logs: [
            ...prev.logs,
            {
              agentName: event.agentName ?? '',
              role: event.role ?? '',
              status: 'thinking',
              content: '',
              timestamp: Date.now(),
            },
          ],
        }))
      } else if (event.type === 'agent_output') {
        const name = event.agentName ?? ''
        agentOutputs.current[name] = event.content ?? ''

        setState((prev) => ({
          ...prev,
          logs: prev.logs.map((log) =>
            log.agentName === name
              ? { ...log, status: 'writing', content: event.content ?? '' }
              : log
          ),
        }))
      } else if (event.type === 'agent_done') {
        const name = event.agentName ?? ''
        setState((prev) => ({
          ...prev,
          logs: prev.logs.map((log) =>
            log.agentName === name ? { ...log, status: 'done' } : log
          ),
        }))
      } else if (event.type === 'squad_done') {
        setState((prev) => ({
          ...prev,
          status: 'completed',
          output: event.output ?? null,
        }))
        eventSource.close()
      } else if (event.type === 'error') {
        setState((prev) => ({
          ...prev,
          status: 'failed',
          error: event.error ?? 'Erro desconhecido',
          logs: prev.logs.map((log) =>
            log.status === 'thinking' || log.status === 'writing'
              ? { ...log, status: 'error' }
              : log
          ),
        }))
        eventSource.close()
      }
    }

    eventSource.onerror = () => {
      setState((prev) => ({
        ...prev,
        status: 'failed',
        error: 'Conexão perdida com o servidor',
      }))
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [executionId])

  return state
}
