import { prisma } from './prisma'
import { runAgentWithClaude } from './anthropic'
import { SSEEvent, ExecutionLog } from '@/types'

type SSECallback = (event: SSEEvent) => void

const executionStreams = new Map<string, SSECallback[]>()

export function subscribeToExecution(executionId: string, callback: SSECallback): () => void {
  const subscribers = executionStreams.get(executionId) ?? []
  subscribers.push(callback)
  executionStreams.set(executionId, subscribers)

  return () => {
    const current = executionStreams.get(executionId) ?? []
    executionStreams.set(
      executionId,
      current.filter((cb) => cb !== callback)
    )
  }
}

function emit(executionId: string, event: SSEEvent) {
  const subscribers = executionStreams.get(executionId) ?? []
  for (const cb of subscribers) {
    cb(event)
  }
}

export async function runSquad(executionId: string, squadId: string, input: string): Promise<void> {
  try {
    await prisma.execution.update({
      where: { id: executionId },
      data: { status: 'running' },
    })

    const agents = await prisma.agent.findMany({
      where: { squadId },
      orderBy: { order: 'asc' },
    })

    const logs: ExecutionLog[] = []
    const previousOutputs: string[] = []
    let finalOutput = ''

    for (const agent of agents) {
      const startLog: ExecutionLog = {
        agentName: agent.name,
        role: agent.role,
        status: 'thinking',
        content: '',
        timestamp: Date.now(),
      }
      logs.push(startLog)

      emit(executionId, {
        type: 'agent_start',
        agentName: agent.name,
        role: agent.role,
        status: 'thinking',
      })

      await prisma.execution.update({
        where: { id: executionId },
        data: { logs: JSON.stringify(logs) },
      })

      const contextText = previousOutputs
        .map((out, i) => `Agente ${i + 1}:\n${out}`)
        .join('\n\n')

      const output = await runAgentWithClaude(
        agent.name,
        agent.role,
        agent.instructions,
        input,
        contextText
      )

      emit(executionId, {
        type: 'agent_output',
        agentName: agent.name,
        content: output,
      })

      const doneLog: ExecutionLog = {
        agentName: agent.name,
        role: agent.role,
        status: 'done',
        content: output,
        timestamp: Date.now(),
      }
      logs.push(doneLog)
      previousOutputs.push(`${agent.name} (${agent.role}):\n${output}`)
      finalOutput = output

      emit(executionId, {
        type: 'agent_done',
        agentName: agent.name,
        status: 'done',
      })

      await prisma.execution.update({
        where: { id: executionId },
        data: { logs: JSON.stringify(logs) },
      })
    }

    await prisma.execution.update({
      where: { id: executionId },
      data: {
        status: 'completed',
        output: finalOutput,
        logs: JSON.stringify(logs),
      },
    })

    emit(executionId, { type: 'squad_done', output: finalOutput })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    await prisma.execution.update({
      where: { id: executionId },
      data: { status: 'failed' },
    })

    emit(executionId, { type: 'error', error: errorMessage })
  } finally {
    executionStreams.delete(executionId)
  }
}
