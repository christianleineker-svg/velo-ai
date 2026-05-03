'use client'

import { useEffect, useState } from 'react'
import { ExecutionLog as LogEntry } from '@/types'
import { getAvatarByName, AvatarStatus } from '@/lib/agent-avatars'

interface ExecutionLogProps {
  logs: LogEntry[]
  status: 'idle' | 'running' | 'completed' | 'failed'
  output: string | null
  error: string | null
}

/* Terminal line-by-line text with typing effect */
function TerminalOutput({ text, active }: { text: string; active: boolean }) {
  const lines = text ? text.split('\n').filter(Boolean) : []
  const [visibleLines, setVisibleLines] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    if (!text) { setVisibleLines(0); setCharIdx(0); return }
    setVisibleLines(0); setCharIdx(0)
  }, [text])

  useEffect(() => {
    if (visibleLines >= lines.length) return
    const t = setTimeout(() => {
      if (charIdx >= lines[visibleLines].length) {
        setVisibleLines((v) => v + 1)
        setCharIdx(0)
      } else {
        setCharIdx((c) => c + 1)
      }
    }, 10)
    return () => clearTimeout(t)
  }, [visibleLines, charIdx, lines])

  if (!text) return null

  return (
    <div className="space-y-0.5 max-h-40 overflow-y-auto">
      {lines.slice(0, visibleLines).map((line, i) => (
        <p key={i} className="typewriter-text text-[11px]">
          <span className="text-[#44445a] mr-1">{'>'}</span>
          {line}
        </p>
      ))}
      {visibleLines < lines.length && (
        <p className="typewriter-text text-[11px]">
          <span className="text-[#44445a] mr-1">{'>'}</span>
          {lines[visibleLines].slice(0, charIdx)}
          <span className="animate-cursor"> </span>
        </p>
      )}
      {active && visibleLines >= lines.length && lines.length > 0 && (
        <p className="typewriter-text text-[11px]">
          <span className="animate-cursor"> </span>
        </p>
      )}
    </div>
  )
}

function AgentPanel({ log, totalDone, total }: { log: LogEntry; totalDone: number; total: number }) {
  const char = getAvatarByName(log.agentName)
  const AvatarComp = char.AvatarComponent
  const avatarStatus: AvatarStatus = log.status === 'thinking' ? 'thinking'
    : log.status === 'writing' ? 'writing'
    : log.status === 'done'    ? 'done'
    : 'error'

  const progress = log.status === 'thinking' ? 25
    : log.status === 'writing' ? 65
    : log.status === 'done'    ? 100
    : 0

  const borderCls = log.status === 'done'    ? 'border-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.1)]'
    : log.status === 'writing'               ? 'border-[#00f5ff] shadow-[0_0_10px_rgba(0,245,255,0.1)]'
    : log.status === 'thinking'              ? 'border-[#ffd700]'
    : 'border-[#ff3366] animate-error-flash'

  const statusLabel = log.status === 'thinking' ? 'PROCESSING' : log.status === 'writing' ? 'EXECUTING'
    : log.status === 'done' ? 'COMPLETE ✓' : 'ERROR ✗'

  const statusColor = log.status === 'done' ? 'text-[#00ff88]' : log.status === 'writing' ? 'text-[#00f5ff]'
    : log.status === 'thinking' ? 'text-[#ffd700]' : 'text-[#ff3366]'

  return (
    <div className={`border-2 bg-[#0a0a12] p-3 transition-all duration-300 ${borderCls}`}>
      {/* Panel header */}
      <div className="flex items-center gap-2 mb-2">
        <AvatarComp size={32} animated={false} status={avatarStatus} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span
              className="text-[9px] font-['Press_Start_2P']"
              style={{ color: char.color }}
            >
              {log.agentName.toUpperCase()}
            </span>
            <span className={`text-[7px] font-['Press_Start_2P'] ${statusColor}`}>
              [{statusLabel}]
            </span>
          </div>
          <p className="text-[7px] text-[#44445a] font-['Press_Start_2P'] mt-0.5 truncate">
            {log.role.slice(0, 35).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="pixel-progress-bar mb-2">
        <div
          className="pixel-progress-fill transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Output */}
      {log.content
        ? <TerminalOutput text={log.content} active={log.status === 'writing'} />
        : log.status === 'thinking' && (
          <p className="typewriter-text text-[10px] text-[#ffd70088]">
            {'> '}<span className="animate-blink">PROCESSANDO...</span>
          </p>
        )
      }
    </div>
  )
}

export default function ExecutionLog({ logs, status, output, error }: ExecutionLogProps) {
  const [missionBanner, setMissionBanner] = useState(false)

  useEffect(() => {
    if (status === 'completed') {
      setMissionBanner(true)
      const t = setTimeout(() => setMissionBanner(false), 2500)
      return () => clearTimeout(t)
    }
  }, [status])

  const doneCount = logs.filter((l) => l.status === 'done').length
  const totalCount = logs.length || 1
  const overallProgress = Math.round((doneCount / totalCount) * 100)

  /* Empty state */
  if (logs.length === 0 && status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <div className="text-5xl mb-6 animate-idle" style={{ display: 'inline-block' }}>⚡</div>
        <p className="text-[9px] font-['Press_Start_2P'] text-[#44445a] leading-loose">
          AGUARDANDO<br />MISSÃO...
        </p>
        <p className="text-[7px] text-[#1e1e3a] font-['Press_Start_2P'] mt-3">
          CONFIGURE O INPUT E PRESSIONE<br />▶ INICIAR MISSÃO
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Overall progress */}
      {logs.length > 0 && (
        <div className="bg-[#0a0a12] border border-[#1e1e3a] p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[7px] font-['Press_Start_2P'] text-[#8888aa]">PROGRESSO GERAL</span>
            <span className="text-[7px] font-['Press_Start_2P'] text-[#00f5ff]">
              {doneCount}/{logs.length} AGENTES
            </span>
          </div>
          <div className="pixel-progress-bar">
            <div
              className="pixel-progress-fill pixel-progress-fill-purple transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Mission complete banner */}
      {missionBanner && (
        <div className="border-2 border-[#00ff88] bg-[#001a0a] p-4 text-center animate-mission-complete">
          <p
            className="text-[12px] font-['Press_Start_2P'] text-[#00ff88]"
            style={{ textShadow: '0 0 15px rgba(0,255,136,0.8), 2px 2px 0 #000' }}
          >
            ✓ MISSÃO COMPLETA!
          </p>
        </div>
      )}

      {/* Agent panels */}
      {logs.map((log, i) => (
        <AgentPanel key={`${log.agentName}-${i}`} log={log} totalDone={doneCount} total={logs.length} />
      ))}

      {/* Final output */}
      {status === 'completed' && output && !missionBanner && (
        <div className="border-2 border-purple-600 bg-[#0d0a1a] p-4 shadow-[0_0_20px_rgba(124,58,237,0.3)] animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[8px] font-['Press_Start_2P'] text-purple-400"
              style={{ textShadow: '0 0 8px rgba(124,58,237,0.6)' }}>
              ▶ OUTPUT FINAL
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-[7px] font-['Press_Start_2P'] text-[#44445a] hover:text-[#00f5ff] border border-[#1e1e3a] hover:border-[#00f5ff] px-2 py-1 transition-all"
            >
              COPIAR
            </button>
          </div>
          <div className="typewriter-text text-[11px]">{output}</div>
        </div>
      )}

      {/* Error */}
      {status === 'failed' && error && (
        <div className="border-2 border-[#ff3366] bg-[#1a000a] p-4 animate-error-flash">
          <p className="text-[8px] font-['Press_Start_2P'] text-[#ff3366] mb-2">✗ ERRO NA EXECUÇÃO</p>
          <p className="text-[11px] font-mono text-[#ff6688]">{error}</p>
        </div>
      )}
    </div>
  )
}
