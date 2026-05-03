'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Squad } from '@/types'
import { useExecution } from '@/hooks/useExecution'
import AgentCard from '@/components/squad/AgentCard'
import ExecutionLogComponent from '@/components/squad/ExecutionLog'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Textarea from '@/components/ui/Textarea'

interface SquadRunnerProps {
  squad: Squad
}

export default function SquadRunner({ squad }: SquadRunnerProps) {
  const [input, setInput] = useState('')
  const { isStarting, startError, startExecution, logs, status, output, error } = useExecution(squad.id)

  const agentStatusMap: Record<string, 'idle' | 'thinking' | 'writing' | 'done' | 'error'> = {}
  for (const log of logs) {
    agentStatusMap[log.agentName] = log.status as 'thinking' | 'writing' | 'done' | 'error'
  }

  const handleRun = () => {
    if (!input.trim() || isStarting || status === 'running') return
    startExecution(input)
  }

  const isRunning = status === 'running' || isStarting

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/squads" className="text-[#555555] hover:text-white text-sm transition-colors">
              Squads
            </Link>
            <span className="text-[#333333]">/</span>
            <span className="text-sm text-white">{squad.name}</span>
          </div>
          {squad.description && <p className="text-sm text-[#888888]">{squad.description}</p>}
        </div>
        <div className="flex gap-2">
          <Link href={`/squads/${squad.id}/edit`}>
            <Button variant="ghost" size="sm">Editar</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6 h-[calc(100vh-14rem)]">
        {/* Left column */}
        <div className="col-span-2 flex flex-col gap-4 overflow-y-auto">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Agentes</h3>
              <Badge variant="purple">{squad.agents.length} agentes</Badge>
            </div>
            <div className="space-y-2">
              {squad.agents.map((agent, i) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  index={i}
                  status={agentStatusMap[agent.name] ?? 'idle'}
                />
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-xl p-4 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white">Input do Squad</h3>
            <Textarea
              placeholder="Descreva o que os agentes devem fazer... Quanto mais detalhado, melhor o resultado."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              disabled={isRunning}
            />
            {(startError ?? error) && (
              <p className="text-sm text-red-400">{startError ?? error}</p>
            )}
            <Button
              onClick={handleRun}
              loading={isRunning}
              disabled={!input.trim() || isRunning}
              className="w-full justify-center"
              size="lg"
            >
              {isRunning ? 'Executando...' : '⚡ Executar Squad'}
            </Button>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-3 bg-[#111111] border border-[#222222] rounded-xl p-5 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Execução em Tempo Real</h3>
            {status !== 'idle' && (
              <Badge
                variant={
                  status === 'completed' ? 'success' :
                  status === 'failed' ? 'error' :
                  status === 'running' ? 'info' : 'default'
                }
              >
                {status === 'completed' ? 'Concluído' :
                 status === 'failed' ? 'Falhou' :
                 status === 'running' ? 'Executando' : 'Aguardando'}
              </Badge>
            )}
          </div>
          <ExecutionLogComponent
            logs={logs}
            status={status}
            output={output}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}
