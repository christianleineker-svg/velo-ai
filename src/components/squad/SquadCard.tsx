'use client'

import Link from 'next/link'
import { Squad } from '@/types'
import { formatDate } from '@/lib/utils'
import { getAvatarByName } from '@/lib/agent-avatars'

interface SquadCardProps {
  squad: Squad
}

const categoryColors: Record<string, string> = {
  'Conteúdo':      '#00f5ff',
  'Desenvolvimento': '#ffd700',
  'Marketing':     '#ff006e',
  'Análise':       '#00ff88',
  'custom':        '#7c3aed',
}

export default function SquadCard({ squad }: SquadCardProps) {
  const color = categoryColors[squad.category] ?? '#7c3aed'

  return (
    <Link href={`/squads/${squad.id}`} className="block group">
      <div
        className="border-2 border-[#1e1e3a] bg-[#0f0f1a] p-4 h-full transition-all duration-150 group-hover:border-purple-500"
        style={{ boxShadow: '3px 3px 0 #000', transition: 'border-color 0.15s, box-shadow 0.15s' }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = `0 0 15px ${color}44, 3px 3px 0 #000`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = '3px 3px 0 #000'
        }}
      >
        {/* Category tag + name */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3
            className="font-['Press_Start_2P'] text-[8px] text-white group-hover:text-[#00f5ff] transition-colors leading-5 line-clamp-2"
          >
            {squad.name.toUpperCase()}
          </h3>
          <span
            className="font-['Press_Start_2P'] text-[6px] px-2 py-1 border flex-shrink-0"
            style={{ color, borderColor: color, background: `${color}11` }}
          >
            {squad.category.toUpperCase()}
          </span>
        </div>

        {squad.description && (
          <p className="text-[#8888aa] text-xs mb-4 line-clamp-2 leading-relaxed">{squad.description}</p>
        )}

        {/* Agent avatars */}
        <div className="flex items-center gap-2 mb-3">
          {squad.agents.slice(0, 5).map((agent) => {
            const char = getAvatarByName(agent.name)
            const AvatarComp = char.AvatarComponent
            return (
              <div
                key={agent.id}
                title={agent.name}
                className="border"
                style={{ borderColor: char.color, boxShadow: `0 0 6px ${char.color}44` }}
              >
                <AvatarComp size={28} />
              </div>
            )
          })}
          {squad.agents.length > 5 && (
            <span className="font-['Press_Start_2P'] text-[6px] text-[#44445a]">
              +{squad.agents.length - 5}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1e1e3a] pt-2 mt-2">
          <span className="font-['Press_Start_2P'] text-[6px] text-[#44445a]">
            {squad.agents.length} AGENTES
          </span>
          <span className="font-['Press_Start_2P'] text-[6px] text-[#44445a]">
            {formatDate(squad.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}
