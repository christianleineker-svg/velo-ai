'use client'

import Link from 'next/link'
import { Squad } from '@/types'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface SquadCardProps {
  squad: Squad
}

const categoryColors: Record<string, 'default' | 'purple' | 'info' | 'success' | 'warning'> = {
  Conteúdo: 'purple',
  Desenvolvimento: 'info',
  Marketing: 'success',
  Análise: 'warning',
  custom: 'default',
}

export default function SquadCard({ squad }: SquadCardProps) {
  const color = categoryColors[squad.category] ?? 'default'

  return (
    <Link href={`/squads/${squad.id}`}>
      <Card className="hover:border-purple-600/40 transition-all duration-200 group h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
            {squad.name}
          </h3>
          <Badge variant={color}>{squad.category}</Badge>
        </div>

        {squad.description && (
          <p className="text-xs text-[#888888] mb-3 line-clamp-2">{squad.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {squad.agents.slice(0, 4).map((agent, i) => (
              <div
                key={agent.id}
                title={agent.name}
                className="w-6 h-6 bg-[#1a1a1a] border border-[#333333] rounded-full flex items-center justify-center text-xs text-purple-400 font-bold"
              >
                {i + 1}
              </div>
            ))}
            {squad.agents.length > 4 && (
              <div className="w-6 h-6 bg-[#1a1a1a] border border-[#333333] rounded-full flex items-center justify-center text-xs text-[#555555]">
                +{squad.agents.length - 4}
              </div>
            )}
          </div>
          <span className="text-xs text-[#555555]">{formatDate(squad.updatedAt)}</span>
        </div>
      </Card>
    </Link>
  )
}
