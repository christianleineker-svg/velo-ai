'use client'

import { useState, useEffect } from 'react'
import { BoltAvatar } from '@/lib/agent-avatars'

/* ── Types ──────────────────────────────────────── */
type Scene = 'walk' | 'code' | 'crash' | 'run' | 'hide' | 'think' | 'bugback'

const DURATIONS: Record<Scene, number> = {
  walk:    8000,
  code:   10000,
  crash:   2000,
  run:     6000,
  hide:    5000,
  think:   6000,
  bugback: 3000,
}

const NEXT: Record<Scene, Scene> = {
  walk:    'code',
  code:    'crash',
  crash:   'run',
  run:     'hide',
  hide:    'think',
  think:   'bugback',
  bugback: 'run',  // inner loop: run → hide → think → bugback → run
}

/* ── Shared style ───────────────────────────────── */
const pixelSvg: React.CSSProperties = {
  imageRendering: 'pixelated',
  display: 'block',
}

/* ── Pixel art computer ─────────────────────────── */
function PixelComputer({ crashing }: { crashing?: boolean }) {
  return (
    <svg
      width="52" height="52"
      viewBox="0 0 16 16"
      style={{
        ...pixelSvg,
        transformOrigin: 'bottom right',
        animation: crashing ? 'lb-pc-crash 1.8s ease-in-out forwards' : undefined,
      }}
    >
      {/* Frame */}
      <rect x="1" y="1" width="14" height="1"  fill="#334155" />
      <rect x="1" y="10" width="14" height="1" fill="#334155" />
      <rect x="1" y="1" width="1"  height="10" fill="#334155" />
      <rect x="14" y="1" width="1" height="10" fill="#334155" />
      {/* Screen */}
      <rect x="2" y="2" width="12" height="8" fill="#050520" />
      <rect x="2" y="2" width="12" height="8" fill="#00aacc" opacity="0.15" />
      {/* Code lines */}
      <rect x="3" y="3" width="6" height="1" fill="#00ff88" />
      <rect x="3" y="5" width="4" height="1" fill="#ffd700" />
      <rect x="3" y="7" width="8" height="1" fill="#ff006e" />
      {/* Cursor blink */}
      <rect x="9" y="3" width="1" height="1" fill="#00f5ff" className="animate-blink" />
      {/* Stand */}
      <rect x="6" y="11" width="4" height="2" fill="#334155" />
      {/* Base */}
      <rect x="4" y="13" width="8" height="1" fill="#334155" />
    </svg>
  )
}

/* ── Pixel art bush ─────────────────────────────── */
function PixelBush() {
  return (
    <svg width="80" height="52" viewBox="0 0 24 16" style={pixelSvg}>
      <rect x="0"  y="7"  width="24" height="9"  fill="#1b4332" />
      <rect x="2"  y="4"  width="20" height="5"  fill="#2d6a4f" />
      <rect x="5"  y="1"  width="14" height="5"  fill="#40916c" />
      <rect x="2"  y="4"  width="3"  height="2"  fill="#52b788" />
      <rect x="14" y="2"  width="3"  height="2"  fill="#52b788" />
      <rect x="8"  y="1"  width="2"  height="1"  fill="#74c69d" />
      {/* Dark spots for depth */}
      <rect x="6"  y="8"  width="2"  height="2"  fill="#0d2118" />
      <rect x="16" y="9"  width="2"  height="2"  fill="#0d2118" />
    </svg>
  )
}

/* ── Floating code particle ─────────────────────── */
function CodeParticle({ label, delay, dx }: { label: string; delay: string; dx: string }) {
  return (
    <span
      style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#00f5ff',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        animation: 'lb-particle 2.2s ease-out infinite',
        animationDelay: delay,
        opacity: 0,
        '--px': dx,
      } as React.CSSProperties}
    >
      {label}
    </span>
  )
}

/* ── Thought bubble ─────────────────────────────── */
function ThoughtBubble({ phase }: { phase: 'dots' | 'bulb' }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '6px',
      textAlign: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        background: '#0f0f1a',
        border: '2px solid #334155',
        padding: '5px 10px',
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#00f5ff',
        whiteSpace: 'nowrap',
        marginBottom: '3px',
      }}>
        {phase === 'dots' ? (
          <>
            <span style={{ animation: 'lb-thought-dot 0.9s ease-in-out infinite', animationDelay: '0ms',   display: 'inline-block' }}>.</span>
            <span style={{ animation: 'lb-thought-dot 0.9s ease-in-out infinite', animationDelay: '300ms', display: 'inline-block' }}>.</span>
            <span style={{ animation: 'lb-thought-dot 0.9s ease-in-out infinite', animationDelay: '600ms', display: 'inline-block' }}>.</span>
          </>
        ) : (
          <span style={{ animation: 'lb-joy-jump 0.5s ease-in-out', display: 'inline-block' }}>💡</span>
        )}
      </div>
      {/* Bubble tail */}
      <div style={{ width: '5px', height: '5px', background: '#334155', margin: '0 auto 2px' }} />
      <div style={{ width: '3px', height: '3px', background: '#334155', margin: '0 auto' }} />
    </div>
  )
}

/* ── Scene 1: Walk in ───────────────────────────── */
function SceneWalk() {
  return (
    <div
      className="absolute bottom-[22%] left-0"
      style={{ animation: 'lb-walk-in 8s linear forwards' }}
    >
      <div style={{ animation: 'lb-walk-bob 0.65s ease-in-out infinite' }}>
        <BoltAvatar size={80} />
      </div>
    </div>
  )
}

/* ── Scene 2: Coding ────────────────────────────── */
function SceneCode() {
  return (
    <div
      className="absolute bottom-[22%]"
      style={{ left: '25vw' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
        {/* Character typing */}
        <div style={{ animation: 'lb-type-rock 0.55s ease-in-out infinite' }}>
          <BoltAvatar size={80} />
        </div>
        {/* Computer with floating code */}
        <div style={{ position: 'relative', marginBottom: '4px' }}>
          <PixelComputer />
          <CodeParticle label="</>"  delay="0s"    dx="5px"  />
          <CodeParticle label="{}"   delay="0.75s"  dx="-8px" />
          <CodeParticle label="//"   delay="1.5s"  dx="10px" />
          <CodeParticle label="=>"   delay="2.1s"  dx="-4px" />
        </div>
      </div>
    </div>
  )
}

/* ── Scene 3: Crash ─────────────────────────────── */
function SceneCrash() {
  return (
    <div
      className="absolute bottom-[22%]"
      style={{ left: '25vw' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
        {/* Character steps back startled */}
        <div style={{ animation: 'lb-startled 0.5s ease-out forwards' }}>
          <BoltAvatar size={80} />
        </div>
        {/* Computer falling */}
        <div style={{ position: 'relative', marginBottom: '4px' }}>
          <PixelComputer crashing />
          <span style={{
            position: 'absolute',
            top: '-22px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '22px',
            animation: 'lb-explosion 1.2s ease-out 0.4s forwards',
            opacity: 0,
            display: 'block',
          }}>
            💥
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Scene 4: Running away from bug ─────────────── */
function SceneRun() {
  return (
    <>
      {/* Character running right (flipped) */}
      <div
        className="absolute bottom-[22%] left-0"
        style={{ animation: 'lb-run-across 6s linear forwards' }}
      >
        <div style={{ transform: 'scaleX(-1)' }}>
          <div style={{ animation: 'lb-run-bob 0.26s ease-in-out infinite' }}>
            <BoltAvatar size={80} />
          </div>
        </div>
      </div>
      {/* Bug chasing — slightly behind */}
      <div
        className="absolute bottom-[26%] left-0"
        style={{
          fontSize: '28px',
          animation: 'lb-bug-follow 6s linear forwards',
          lineHeight: 1,
        }}
      >
        🐛
      </div>
    </>
  )
}

/* ── Scene 5: Hiding behind bush ────────────────── */
function SceneHide() {
  return (
    <>
      {/* Bug looking around center stage */}
      <div
        className="absolute bottom-[26%]"
        style={{
          left: '35vw',
          fontSize: '28px',
          animation: 'lb-bug-look 1.6s ease-in-out infinite',
          display: 'inline-block',
          transformOrigin: 'center bottom',
          lineHeight: 1,
        }}
      >
        🐛
      </div>

      {/* Bush + peeking head */}
      <div
        className="absolute"
        style={{ right: '18%', bottom: 'calc(22% + 4px)', display: 'inline-block' }}
      >
        {/* Head peek — overflow clips body */}
        <div style={{
          overflow: 'hidden',
          height: '28px',
          width: '80px',
          animation: 'lb-peek-head 1.2s ease-in-out infinite',
        }}>
          <BoltAvatar size={80} />
        </div>
        <PixelBush />
      </div>
    </>
  )
}

/* ── Scene 6: Thinking / idea ───────────────────── */
function SceneThink({ phase }: { phase: 'dots' | 'bulb' }) {
  return (
    <div
      className="absolute bottom-[22%]"
      style={{ right: '18%' }}
    >
      <div style={{
        position: 'relative',
        display: 'inline-block',
        animation: phase === 'bulb' ? 'lb-joy-jump 0.45s ease-in-out 3' : undefined,
      }}>
        <BoltAvatar size={80} />
        <ThoughtBubble phase={phase} />
      </div>
    </div>
  )
}

/* ── Scene 7: Bug came back (dramatic pause) ────── */
function SceneBugBack() {
  return (
    <>
      {/* Bug appears from left toward center */}
      <div
        className="absolute bottom-[26%] left-0"
        style={{
          fontSize: '28px',
          animation: 'lb-bug-from-left 3s ease-out forwards',
          lineHeight: 1,
        }}
      >
        🐛
      </div>
      {/* Character at right — dramatic look */}
      <div
        className="absolute bottom-[22%]"
        style={{
          right: '18%',
          animation: 'lb-dramatic 0.6s ease-in-out infinite',
          display: 'inline-block',
          transformOrigin: 'center bottom',
        }}
      >
        <BoltAvatar size={80} />
      </div>
    </>
  )
}

/* ── Main component ─────────────────────────────── */
export default function LoginBackground() {
  const [scene, setScene]           = useState<Scene>('walk')
  const [fade, setFade]             = useState(true)
  const [thinkPhase, setThinkPhase] = useState<'dots' | 'bulb'>('dots')

  // Advance scene with fade transition
  useEffect(() => {
    const dur = DURATIONS[scene]
    const t = setTimeout(() => {
      setFade(false)
      setTimeout(() => {
        setScene(NEXT[scene])
        setFade(true)
        setThinkPhase('dots')
      }, 320)
    }, dur - 320)
    return () => clearTimeout(t)
  }, [scene])

  // Think sub-phase: dots → bulb after 4s
  useEffect(() => {
    if (scene !== 'think') return
    const t = setTimeout(() => setThinkPhase('bulb'), 4000)
    return () => clearTimeout(t)
  }, [scene])

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: 0, opacity: 0.5 }}
    >
      {/* Depth ground lines */}
      <div className="absolute bottom-[22%] left-0 right-0 h-px" style={{ background: '#1e1e3a' }} />
      <div className="absolute bottom-[38%] left-0 right-0 h-px" style={{ background: '#1e1e3a', opacity: 0.4 }} />

      {/* Scene with fade transition */}
      <div style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.32s ease-in-out' }}>
        {scene === 'walk'    && <SceneWalk />}
        {scene === 'code'    && <SceneCode />}
        {scene === 'crash'   && <SceneCrash />}
        {scene === 'run'     && <SceneRun />}
        {scene === 'hide'    && <SceneHide />}
        {scene === 'think'   && <SceneThink phase={thinkPhase} />}
        {scene === 'bugback' && <SceneBugBack />}
      </div>
    </div>
  )
}
