'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AgentEditor from './AgentEditor'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

type AgentDraft = {
  id?: string
  name: string
  role: string
  instructions: string
  model: string
  order: number
}

interface SquadBuilderProps {
  initialData?: {
    id?: string
    name: string
    description?: string | null
    category: string
    agents: AgentDraft[]
  }
}

const CATEGORIES = ['Conteúdo', 'Desenvolvimento', 'Análise', 'Marketing', 'Custom']

export default function SquadBuilder({ initialData }: SquadBuilderProps) {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [category, setCategory] = useState(initialData?.category ?? 'Custom')
  const [agents, setAgents] = useState<AgentDraft[]>(
    initialData?.agents ?? [{ name: '', role: '', instructions: '', model: 'claude', order: 1 }]
  )
  const [saving, setSaving] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addAgent = () => {
    setAgents((prev) => [
      ...prev,
      { name: '', role: '', instructions: '', model: 'claude', order: prev.length + 1 },
    ])
  }

  const removeAgent = (index: number) => {
    setAgents((prev) =>
      prev.filter((_, i) => i !== index).map((a, i) => ({ ...a, order: i + 1 }))
    )
  }

  const updateAgent = (index: number, agent: AgentDraft) => {
    setAgents((prev) => prev.map((a, i) => (i === index ? agent : a)))
  }

  const suggestAgents = async () => {
    if (!name || !description) {
      setError('Preencha nome e descrição para sugerir agentes')
      return
    }
    setSuggesting(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })
      const json = (await res.json()) as { data?: Array<{ name: string; role: string; instructions: string }>; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Erro ao sugerir agentes')
      const suggested = (json.data ?? []).map((a, i) => ({
        name: a.name,
        role: a.role,
        instructions: a.instructions,
        model: 'claude',
        order: i + 1,
      }))
      if (suggested.length > 0) setAgents(suggested)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao sugerir agentes')
    } finally {
      setSuggesting(false)
    }
  }

  const handleSave = async () => {
    if (!name) { setError('Nome é obrigatório'); return }
    if (agents.some((a) => !a.name || !a.role)) {
      setError('Preencha nome e papel de todos os agentes')
      return
    }
    setSaving(true)
    setError(null)

    const method = initialData?.id ? 'PUT' : 'POST'
    const url = initialData?.id ? `/api/squads/${initialData.id}` : '/api/squads'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, category, agents }),
      })
      const json = (await res.json()) as { data?: { id: string }; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Erro ao salvar squad')
      router.push(`/squads/${json.data!.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-4">
        <Input
          label="Nome do Squad"
          placeholder="Ex: Squad de Marketing Digital"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          label="Descrição"
          placeholder="Descreva o objetivo do squad..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#888888]">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#111111] border border-[#222222] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-600 transition-colors"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Agentes</h3>
          <Button variant="secondary" size="sm" onClick={suggestAgents} loading={suggesting}>
            ✨ Sugerir com IA
          </Button>
        </div>

        {agents.map((agent, i) => (
          <AgentEditor
            key={i}
            agent={agent}
            index={i}
            onChange={(a) => updateAgent(i, a)}
            onRemove={() => removeAgent(i)}
            canRemove={agents.length > 1}
          />
        ))}

        <Button variant="ghost" size="sm" onClick={addAgent} className="w-full border border-dashed border-[#333333] hover:border-purple-600/50">
          + Adicionar Agente
        </Button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={() => router.back()}>Cancelar</Button>
        <Button onClick={handleSave} loading={saving}>
          {initialData?.id ? 'Salvar Alterações' : 'Criar Squad'}
        </Button>
      </div>
    </div>
  )
}
