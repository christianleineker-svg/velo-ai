'use client'

import { useEffect, useState } from 'react'
import { Agent } from '@/types'
import { getAvatarByName, AvatarStatus } from '@/lib/agent-avatars'

interface AgentCardProps {
  agent: Agent
  index: number
  status?: 'idle' | 'thinking' | 'writing' | 'done' | 'error'
  content?: string
}

const statusCfg = {
  idle: {
    label: 'STANDBY',
    border: 'border-[#1e1e3a]',
    labelColor: 'text-[#44445a]',
    labelBorder: 'border-[#44445a]',
    progress: 0,
    blink: false,
  },
  thinking: {
    label: 'PROCESSING',
    border: 'border-[#ffd700] animate-error-flash',
    labelColor: 'text-[#ffd700]',
    labelBorder: 'border-[#ffd700]',
    progress: 35,
    blink: true,
  },
  writing: {
    label: 'EXECUTING',
    border: 'border-[#00f5ff]',
    labelColor: 'text-[#00f5ff]',
    labelBorder: 'border-[#00f5ff]',
    progress: 70,
    blink: false,
  },
  done: {
    label: 'COMPLETE',
    border: 'border-[#00ff88]',
    labelColor: 'text-[#00ff88]',
    labelBorder: 'border-[#00ff88]',
    progress: 100,
    blink: false,
  },
  error: {
    label: 'ERROR',
    border: 'border-[#ff3366] animate-error-flash',
    labelColor: 'text-[#ff3366]',
    labelBorder: 'border-[#ff3366]',
    progress: 0,
    blink: true,
  },
}

function TypewriterText({ text, active }: { text: string; active: boolean }) {
  const [displayed, setDisplayed] = useState('')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!text) { setDisplayed(''); setIdx(0); return }
    if (idx >= text.length) return
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, idx + 1))
      setIdx((i) => i + 1)
    }, 12)
    return () => clearTimeout(t)
  }, [text, idx])

  if (!displayed && !active) return null

  return (
    <div className="mt-2 max-h-28 overflow-y-auto">
      <p className="typewriter-text text-[11px]">
        {displayed}
        {active && idx < text.length && (
          <span className="animate-cursor inline-block w-0 overflow-hidden"> </span>
        )}
        {active && idx >= text.length && (
          <span className="animate-cursor"> </span>
        )}
      </p>
    </div>
  )
}

export default function AgentCard({ agent, index, status = 'idle', content = '' }: AgentCardProps) {
  const cfg = statusCfg[status]
  const char = getAvatarByName(agent.name)
  const AvatarComp = char.AvatarComponent
  const avatarStatus: AvatarStatus = status === 'idle' ? 'idle' : status

  const [dotsCount, setDotsCount] = useState(1)
  useEffect(() => {
    if (status !== 'thinking') return
    const t = setInterval(() => setDotsCount((d) => (d % 3) + 1), 400)
    return () => clearInterval(t)
  }, [status])

  return (
    <div
      className={[
        'bg-[#0d0d18] border-2 p-3 transition-all duration-300 animate-slide-up',
        cfg.border,
        status === 'writing' ? 'shadow-[0_0_12px_rgba(0,245,255,0.15)]' : '',
        status === 'done'    ? 'shadow-[0_0_12px_rgba(0,255,136,0.15)]' : '',
      ].join(' ')}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <AvatarComp size={56} animated={status === 'idle'} status={avatarStatus} />
          {/* Index badge */}
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center text-[7px] font-['Press_Start_2P'] bg-[#0a0a0f] border border-[#1e1e3a]"
            style={{ color: char.color }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[9px] font-['Press_Start_2P'] truncate"
            style={{ color: char.color, textShadow: `0 0 8px ${char.color}66` }}
          >
            {agent.name.toUpperCase()}
          </p>
          <p className="text-[7px] text-[#44445a] font-['Press_Start_2P'] mt-1 truncate">
            #{String(index + 1).padStart(2, '0')} {agent.role.slice(0, 28).toUpperCase()}
          </p>

          {/* Status badge */}
          <div className={[
            'inline-flex items-center gap-1 mt-2 px-2 py-0.5 border text-[7px] font-["Press_Start_2P"]',
            cfg.labelColor, cfg.labelBorder,
          ].join(' ')}>
            <div className={[
              'w-1.5 h-1.5',
              status === 'thinking' ? 'bg-[#ffd700] animate-blink' :
              status === 'writing'  ? 'bg-[#00f5ff]' :
              status === 'done'     ? 'bg-[#00ff88]' :
              status === 'error'    ? 'bg-[#ff3366] animate-blink' :
              'bg-[#44445a]'
            ].join(' ')} />
            {status === 'thinking'
              ? `PROCESSING${'.'.repeat(dotsCount)}`
              : cfg.label
            }
            {status === 'done' && ' ✓'}
            {status === 'error' && ' ✗'}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 pixel-progress-bar">
        <div
          className={[
            'pixel-progress-fill',
            status === 'done' ? '' : status === 'idle' ? 'pixel-progress-fill-purple' : '',
          ].join(' ')}
          style={{ width: `${cfg.progress}%` }}
        />
      </div>

      {/* Typewriter output */}
      <TypewriterText
        text={content}
        active={status === 'writing'}
      />
    </div>
  )
}
