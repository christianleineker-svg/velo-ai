'use client'

import { Agent } from '@/types'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

type AgentDraft = Omit<Agent, 'id' | 'squadId'> & { id?: string }

interface AgentEditorProps {
  agent: AgentDraft
  index: number
  onChange: (agent: AgentDraft) => void
  onRemove: () => void
  canRemove: boolean
}

export default function AgentEditor({ agent, index, onChange, onRemove, canRemove }: AgentEditorProps) {
  const update = (field: keyof AgentDraft, value: string | number) => {
    onChange({ ...agent, [field]: value })
  }

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-600/20 rounded-lg flex items-center justify-center text-sm font-bold text-purple-400">
            {index + 1}
          </div>
          <span className="text-sm font-medium text-[#888888]">Agente {index + 1}</span>
        </div>
        {canRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-400 hover:text-red-300">
            Remover
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Nome"
          placeholder="Ex: Pesquisador"
          value={agent.name}
          onChange={(e) => update('name', e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#888888]">Modelo</label>
          <select
            value={agent.model}
            onChange={(e) => update('model', e.target.value)}
            className="w-full bg-[#111111] border border-[#222222] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-600 transition-colors"
          >
            <option value="claude">Claude (Anthropic)</option>
            <option value="gpt4o">GPT-4o (OpenAI)</option>
          </select>
        </div>
      </div>

      <Input
        label="Papel"
        placeholder="Ex: Especialista em pesquisa e análise"
        value={agent.role}
        onChange={(e) => update('role', e.target.value)}
      />

      <Textarea
        label="Instruções"
        placeholder="Descreva como este agente deve agir, quais são suas responsabilidades e como ele deve entregar seus resultados..."
        value={agent.instructions}
        onChange={(e) => update('instructions', e.target.value)}
        rows={4}
      />
    </div>
  )
}
