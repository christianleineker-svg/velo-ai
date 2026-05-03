'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SQUAD_TEMPLATES } from '@/lib/templates'
import Button from '@/components/ui/Button'

export default function TemplatesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function useTemplate(templateId: string) {
    setLoading(templateId)
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })
      const json = (await res.json()) as { data?: { id: string }; error?: string }
      if (res.ok && json.data) {
        router.push(`/squads/${json.data.id}`)
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Templates</h1>
        <p className="text-sm text-[#888888] mt-1">Squads pré-configurados prontos para usar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SQUAD_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="bg-[#111111] border border-[#222222] hover:border-purple-600/40 rounded-xl p-5 transition-colors flex flex-col"
          >
            <div className="mb-3">
              <div className="text-xs text-purple-400 font-medium mb-1">{template.category}</div>
              <h3 className="text-base font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-sm text-[#888888]">{template.description}</p>
            </div>

            <div className="flex-1 space-y-2 mb-4">
              <p className="text-xs text-[#555555] font-medium uppercase tracking-wide">Agentes</p>
              {template.agents.map((agent) => (
                <div key={agent.order} className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-purple-600/10 rounded flex items-center justify-center text-xs text-purple-400 font-bold flex-shrink-0 mt-0.5">
                    {agent.order}
                  </div>
                  <div>
                    <p className="text-xs text-white font-medium">{agent.name}</p>
                    <p className="text-xs text-[#555555]">{agent.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => useTemplate(template.id)}
              loading={loading === template.id}
              className="w-full justify-center"
              size="sm"
            >
              Usar Template
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
