'use client'

import { useEffect, useRef, useState } from 'react'

const SW = 800
const SH = 460
const BR = 13  // body radius
const HR = 15  // head radius

type Mouth = 'smile' | 'big-o' | 'worry' | 'think'
type Anim =
  | 'walk'
  | 'idle-bounce'
  | 'idle-look'
  | 'idle-scratch'
  | 'idle-jump'
  | 'coding'
  | 'bug-chase'
  | 'eureka'

interface CS {
  x: number; y: number
  tx: number; ty: number
  facing: 1 | -1
  anim: Anim; at: number
  sqX: number; sqY: number
  lean: number; bY: number
  lR: number; lL: number
  aR: number; aL: number
  eX: number; eY: number; eS: number
  mouth: Mouth
  shadow: number
  antGlow: boolean
  bugX: number; bugY: number; bugVis: boolean; bugDir: 1 | -1
  laptop: boolean
  thought: '' | '...' | '💡'
  fw: boolean
}

const rnd = (a: number, b: number) => Math.random() * (b - a) + a
const newPos = (): [number, number] => [rnd(50, SW - 50), rnd(60, SH - 70)]

const RESET: Omit<CS, 'x' | 'y' | 'tx' | 'ty' | 'facing' | 'anim' | 'at' | 'antGlow' | 'bugX' | 'bugY' | 'bugVis' | 'bugDir'> = {
  sqX: 1, sqY: 1, lean: 0, bY: 0,
  lR: 0, lL: 0, aR: 0, aL: 0,
  eX: 0, eY: 0, eS: 1,
  mouth: 'smile', shadow: 1,
  laptop: false, thought: '', fw: false,
}

const mkInit = (): CS => {
  const [x, y] = newPos()
  const [tx, ty] = newPos()
  return { x, y, tx, ty, facing: 1, anim: 'walk', at: 0, ...RESET, antGlow: false, bugX: SW + 60, bugY: SH / 2, bugVis: false, bugDir: -1 }
}

export default function LoginBackground() {
  const [s, setS] = useState<CS>(mkInit)
  const stRef = useRef<CS>(mkInit())

  const apply = (p: Partial<CS>) => {
    stRef.current = { ...stRef.current, ...p }
    setS({ ...stRef.current })
  }

  useEffect(() => {
    let raf: number
    let last = 0

    const tick = (t: number) => {
      const dt = Math.min(t - last, 40)
      last = t
      const c = stRef.current
      const at = c.at + dt
      const ant = Math.sin(t * 0.003) > 0.4

      // jump to new activity when reaching destination
      const go = (anim: Anim, extra?: Partial<CS>) => {
        const isRoaming = anim === 'walk' || anim === 'bug-chase'
        const [ntx, nty] = isRoaming ? newPos() : [c.x, c.y]
        apply({ ...RESET, ...extra, anim, at: 0, tx: ntx, ty: nty, antGlow: ant } as CS)
      }

      switch (c.anim) {

        // ─── FREE ROAMING ───────────────────────────────────────────
        case 'walk': {
          const dx = c.tx - c.x
          const dy = c.ty - c.y
          const dist = Math.hypot(dx, dy)

          if (dist < 12) {
            // arrived — weighted random pick
            const pick = Math.random()
            if      (pick < 0.42) go('walk')
            else if (pick < 0.57) go('idle-bounce', { x: c.x, y: c.y })
            else if (pick < 0.69) go('idle-look',   { x: c.x, y: c.y })
            else if (pick < 0.79) go('idle-scratch', { x: c.x, y: c.y })
            else if (pick < 0.87) go('idle-jump',    { x: c.x, y: c.y })
            else if (pick < 0.94) go('coding',       { x: c.x, y: c.y })
            else                  go('bug-chase',    {
              x: c.x, y: c.y, bugVis: true,
              bugX: c.x + (Math.random() > 0.5 ? 90 : -90),
              bugY: c.y,
            })
            break
          }

          const speed = 85
          const nx = c.x + (dx / dist) * speed * dt / 1000
          const ny = c.y + (dy / dist) * speed * dt / 1000
          const facing: 1 | -1 = dx > 0 ? 1 : -1
          const ph = (t * 0.008) % (Math.PI * 2)

          apply({
            x: nx, y: ny, at, facing,
            lean: facing * -7,
            bY: Math.sin(ph * 2) * 1.5,
            lR: Math.sin(ph) * 28, lL: Math.sin(ph + Math.PI) * 28,
            aR: Math.sin(ph + Math.PI) * 16, aL: Math.sin(ph) * 16,
            shadow: 1, antGlow: ant, mouth: 'smile',
          })
          break
        }

        // ─── IDLE ANIMATIONS ────────────────────────────────────────
        case 'idle-bounce': {
          const ph = (t * 0.005) % (Math.PI * 2)
          const by = Math.abs(Math.sin(ph)) * -9
          apply({
            at, bY: by,
            sqY: by < -4 ? 0.87 : 1.06,
            shadow: Math.max(0.4, 1 + by * 0.025),
            lR: 6, lL: -6,
            aR: Math.sin(ph) * 8, aL: Math.sin(ph + Math.PI) * 8,
            antGlow: ant,
          })
          if (at > 2600) go('walk')
          break
        }

        case 'idle-look': {
          // pupils sweep left → right → center
          const eX = at < 700  ? Math.sin((at / 700) * Math.PI) * -5
                   : at < 1500 ? Math.sin(((at - 700) / 800) * Math.PI) * 5
                   : 0
          apply({
            at, eX, mouth: 'think', antGlow: ant,
            aR: Math.sin(at * 0.0018) * 5,
            aL: Math.sin(at * 0.0018 + 1.0) * 5,
          })
          if (at > 3000) go('walk', { mouth: 'smile', eX: 0 })
          break
        }

        case 'idle-scratch': {
          // right arm rises to scratch head, eyes look up
          const scrY = -54 - Math.sin(at * 0.012) * 5
          apply({
            at, aR: scrY, aL: 14,
            mouth: 'think', eY: -2,
            eX: Math.sin(at * 0.006) * 2,
            antGlow: ant,
          })
          if (at > 2800) go('walk', { mouth: 'smile', eY: 0, eX: 0 })
          break
        }

        case 'idle-jump': {
          // squash → launch → peak → land → settle
          if      (at < 160)  apply({ at, sqY: 1.22, sqX: 0.80, bY: 0 })
          else if (at < 460)  { const p = (at - 160) / 300; apply({ at, bY: -Math.sin(p * Math.PI) * 32, sqY: 1, sqX: 1, shadow: Math.max(0.25, 1 - Math.sin(p * Math.PI) * 0.55) }) }
          else if (at < 610)  { const p = (at - 460) / 150; apply({ at, sqY: 0.72 + p * 0.28, sqX: 1.28 - p * 0.28, bY: 0, shadow: 1, mouth: 'big-o' }) }
          else if (at < 900)  apply({ at, sqY: 1.12, sqX: 0.90, bY: 0, mouth: 'smile' })
          else if (at < 1100) apply({ at, sqY: 1, sqX: 1 })
          else go('walk')
          break
        }

        // ─── SCENES ─────────────────────────────────────────────────
        case 'coding': {
          if      (at < 280)  apply({ at, lR: -22, lL: 22, bY: 6, aR: 18, aL: -18, mouth: 'think' })
          else if (at < 4800) {
            const ph = (t * 0.005) % (Math.PI * 2)
            apply({ at, laptop: true, antGlow: ant,
              aR: Math.sin(ph) * 12 + 16,
              aL: Math.sin(ph + Math.PI) * 12 + 16,
              eX: 0, eY: 3, eS: 0.84, mouth: 'think',
            })
          }
          else if (at < 5300) apply({ at, laptop: false, aR: 0, aL: 0, bY: 0, lR: 0, lL: 0, eS: 1, eY: 0 })
          else go('walk', { mouth: 'smile' })
          break
        }

        case 'bug-chase': {
          if (at < 5200) {
            const ph = (t * 0.014) % (Math.PI * 2)
            const dx = c.tx - c.x
            const dy = c.ty - c.y
            const dist = Math.hypot(dx, dy)
            let nx = c.x, ny = c.y, ntx = c.tx, nty = c.ty

            if (dist > 14) {
              const sp = 118
              nx = c.x + (dx / dist) * sp * dt / 1000
              ny = c.y + (dy / dist) * sp * dt / 1000
            } else {
              // reached flee point — pick another
              ;[ntx, nty] = newPos()
            }

            const facing: 1 | -1 = dx === 0 ? c.facing : (dx > 0 ? 1 : -1)
            const bdx = nx - c.bugX
            const bdy = ny - c.bugY
            const bdist = Math.hypot(bdx, bdy) || 1

            apply({
              at, x: nx, y: ny, tx: ntx, ty: nty, facing,
              lean: facing * -14,
              lR: Math.sin(ph) * 36, lL: Math.sin(ph + Math.PI) * 36,
              aR: Math.sin(ph + Math.PI) * 18 - 10, aL: Math.sin(ph) * 18 - 10,
              eX: -facing * 3, mouth: 'worry', eS: 1.2, antGlow: ant,
              bugX: c.bugX + (bdx / bdist) * 44 * dt / 1000,
              bugY: c.bugY + (bdy / bdist) * 44 * dt / 1000,
              bugDir: bdx > 0 ? 1 : -1,
            })
          } else if (at < 6200) {
            // bug retreats
            apply({
              at, lean: 0, eX: 0, mouth: 'smile',
              bugX: c.bugX + c.bugDir * 2.5,
              bugVis: c.bugX > -50 && c.bugX < SW + 50,
            })
          } else {
            go('eureka', { x: c.x, y: c.y, bugVis: false })
          }
          break
        }

        case 'eureka': {
          if      (at < 600)  apply({ at, thought: '...', aR: -62 })
          else if (at < 1500) apply({ at, thought: '💡', aR: -82 })
          else if (at < 1900) {
            const p = (at - 1500) / 400
            apply({ at, thought: '',
              bY: -Math.sin(p * Math.PI) * 30,
              shadow: Math.max(0.25, 1 - Math.sin(p * Math.PI) * 0.55),
              aR: -128, aL: -128, mouth: 'big-o', sqY: p > 0.82 ? 0.76 : 1,
            })
          }
          else if (at < 2100) apply({ at, bY: 0, sqY: 0.73, shadow: 1 })
          else if (at < 2360) apply({ at, sqY: 1.14 })
          else if (at < 2600) apply({ at, sqY: 1, aR: 0, aL: 0, mouth: 'smile' })
          else if (at > 3400) go('walk')
          else apply({ at })
          break
        }
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(t => { last = t; raf = requestAnimationFrame(tick) })
    return () => cancelAnimationFrame(raf)
  }, [])

  // ─── RENDER ───────────────────────────────────────────────────────
  const c = s
  const headY = c.y + c.bY - BR - HR + 4
  const bodyY = c.y + c.bY
  const legBase = c.y + c.bY + BR
  const armBaseY = bodyY - BR * c.sqY * 0.3

  // mirror transform: flip around c.x so character faces direction of travel
  const flip = c.facing === -1
    ? `translate(${c.x * 2},0) scale(-1,1)`
    : ''

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      pointerEvents: 'none', userSelect: 'none',
      opacity: 0.65, overflow: 'hidden',
    }}>
      <style>{`
        @keyframes antPulse {
          0%,100%{opacity:1;filter:drop-shadow(0 0 5px #00f5ff)}
          50%{opacity:0.25;filter:none}
        }
        @keyframes codeFloat {
          0%{transform:translateY(0);opacity:.9}
          100%{transform:translateY(-26px);opacity:0}
        }
        @keyframes bugWiggle {
          0%,100%{transform:rotate(-8deg)}
          50%{transform:rotate(8deg)}
        }
      `}</style>

      <svg
        viewBox={`0 0 ${SW} ${SH}`}
        width="100%" height="100%"
        style={{ position: 'absolute', inset: 0 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Bug SVG */}
        {c.bugVis && (
          <g
            transform={`translate(${c.bugX},${c.bugY}) scale(${c.bugDir},1)`}
            style={{ animation: 'bugWiggle 0.4s ease-in-out infinite' }}
          >
            <ellipse cx="0" cy="0" rx="10" ry="7" fill="#22c55e" />
            <circle cx="-4" cy="-2" r="2.5" fill="white" />
            <circle cx="4" cy="-2" r="2.5" fill="white" />
            <circle cx="-3.5" cy="-2" r="1.2" fill="#ef4444" />
            <circle cx="4.5" cy="-2" r="1.2" fill="#ef4444" />
            <line x1="-6" y1="-5" x2="-10" y2="-11" stroke="#22c55e" strokeWidth="1.2" />
            <line x1="6" y1="-5" x2="10" y2="-11" stroke="#22c55e" strokeWidth="1.2" />
            <line x1="-7" y1="2" x2="-11" y2="5" stroke="#22c55e" strokeWidth="1" />
            <line x1="7" y1="2" x2="11" y2="5" stroke="#22c55e" strokeWidth="1" />
          </g>
        )}

        {/* Shadow — stays at character base, not affected by jump */}
        <ellipse
          cx={c.x}
          cy={c.y + BR + 5}
          rx={16 * c.shadow * (2 - c.sqY)}
          ry={3.5 * c.shadow}
          fill="rgba(0,0,0,0.38)"
        />

        {/* ── Character (all body parts in one flippable group) ─── */}
        <g transform={flip}>

          {/* Legs */}
          <g transform={`translate(${c.x - 6},${legBase}) rotate(${c.lL},0,0)`}>
            <rect x="-3" y="0" width="6" height="10" rx="3" fill="#6d28d9" />
            <rect x="-3.5" y="8.5" width="7" height="4.5" rx="2" fill="#4c1d95" />
          </g>
          <g transform={`translate(${c.x + 6},${legBase}) rotate(${c.lR},0,0)`}>
            <rect x="-3" y="0" width="6" height="10" rx="3" fill="#6d28d9" />
            <rect x="-3.5" y="8.5" width="7" height="4.5" rx="2" fill="#4c1d95" />
          </g>

          {/* Body */}
          <ellipse
            cx={c.x} cy={bodyY}
            rx={BR * c.sqX} ry={BR * c.sqY}
            fill="#7c3aed"
            transform={`rotate(${c.lean},${c.x},${bodyY})`}
          />

          {/* Left arm */}
          <g transform={`translate(${c.x - BR + 2},${armBaseY}) rotate(${c.aL - 12},0,0)`}>
            <rect x="-3" y="0" width="5.5" height="11" rx="2.75" fill="#6d28d9" />
            <circle cx="0" cy="12" r="2.7" fill="#8b5cf6" />
          </g>

          {/* Right arm */}
          <g transform={`translate(${c.x + BR - 2},${armBaseY}) rotate(${c.aR + 12},0,0)`}>
            <rect x="-3" y="0" width="5.5" height="11" rx="2.75" fill="#6d28d9" />
            <circle cx="0" cy="12" r="2.7" fill="#8b5cf6" />
          </g>

          {/* Laptop (coding) */}
          {c.laptop && (
            <g transform={`translate(${c.x - 13},${bodyY + BR * c.sqY - 5})`}>
              <rect x="0" y="-7" width="26" height="17" rx="2" fill="#1a1a2e" stroke="#7c3aed" strokeWidth="1.2" />
              <rect x="1.5" y="-5.5" width="23" height="12" fill="#0a0a1f" />
              {[0, 1, 2, 3].map(i => (
                <rect key={i} x={3 + (i % 2) * 9} y={-3.5 + Math.floor(i / 2) * 4.5}
                  width={5 + (i % 2) * 3} height="1.8" rx="0.5" fill="#00f5ff" opacity="0.6" />
              ))}
              <rect x="6" y="9.5" width="14" height="2.5" rx="1" fill="#2d2d4e" />
            </g>
          )}

          {/* Head */}
          <circle cx={c.x} cy={headY} r={HR} fill="#9333ea" />

          {/* Left eye */}
          <g transform={`translate(${c.x - 6.5 + c.eX},${headY - 1 + c.eY}) scale(${c.eS})`}>
            <circle cx="0" cy="0" r="5" fill="white" />
            <circle cx={c.fw ? 0 : 0.8} cy={c.fw ? 0 : 0.8} r="2.5" fill="#1a1a2e" />
            <circle cx={c.fw ? 0.4 : 1.7} cy={c.fw ? -0.4 : -0.7} r="0.8" fill="white" />
          </g>

          {/* Right eye */}
          <g transform={`translate(${c.x + 6.5 + c.eX},${headY - 1 + c.eY}) scale(${c.eS})`}>
            <circle cx="0" cy="0" r="5" fill="white" />
            <circle cx={c.fw ? 0 : 0.8} cy={c.fw ? 0 : 0.8} r="2.5" fill="#1a1a2e" />
            <circle cx={c.fw ? 0.4 : 1.7} cy={c.fw ? -0.4 : -0.7} r="0.8" fill="white" />
          </g>

          {/* Mouth */}
          {c.mouth === 'smile' && (
            <path d={`M${c.x - 4.5},${headY + 5.5} Q${c.x},${headY + 9} ${c.x + 4.5},${headY + 5.5}`}
              fill="none" stroke="#581c87" strokeWidth="1.5" strokeLinecap="round" />
          )}
          {c.mouth === 'big-o' && (
            <ellipse cx={c.x} cy={headY + 6.5} rx="4" ry="5" fill="#581c87" />
          )}
          {c.mouth === 'worry' && (
            <path d={`M${c.x - 4.5},${headY + 8} Q${c.x},${headY + 4.5} ${c.x + 4.5},${headY + 8}`}
              fill="none" stroke="#581c87" strokeWidth="1.5" strokeLinecap="round" />
          )}
          {c.mouth === 'think' && (
            <line x1={c.x - 3.5} y1={headY + 6.5} x2={c.x + 3.5} y2={headY + 6.5}
              stroke="#581c87" strokeWidth="1.5" strokeLinecap="round" />
          )}

          {/* Cheeks blush */}
          <ellipse cx={c.x - 12} cy={headY + 3} rx="3.5" ry="2" fill="#ec4899" opacity="0.28" />
          <ellipse cx={c.x + 12} cy={headY + 3} rx="3.5" ry="2" fill="#ec4899" opacity="0.28" />

          {/* Antenna */}
          <line x1={c.x} y1={headY - HR + 2} x2={c.x + 3} y2={headY - HR - 9}
            stroke="#9333ea" strokeWidth="1.8" />
          <circle cx={c.x + 3} cy={headY - HR - 9} r="2.8"
            fill={c.antGlow ? '#00f5ff' : '#67e8f9'}
            style={{ animation: 'antPulse 1.2s ease-in-out infinite' }}
          />
        </g>

        {/* Thought bubble — outside flip group so it always appears on the right */}
        {c.thought && (
          <g transform={`translate(${c.x + 16},${headY - 16})`}>
            <circle cx="-3" cy="7" r="2" fill="rgba(255,255,255,0.1)" stroke="#9333ea" strokeWidth="0.8" />
            <circle cx="3" cy="2" r="3.5" fill="rgba(255,255,255,0.1)" stroke="#9333ea" strokeWidth="0.8" />
            <ellipse cx="14" cy="-5" rx="13" ry="10" fill="rgba(18,8,38,0.9)" stroke="#9333ea" strokeWidth="1.2" />
            <text x="14" y="-1" textAnchor="middle" fontSize="10" fill="white">{c.thought}</text>
          </g>
        )}

        {/* Code particles floating up during coding */}
        {c.anim === 'coding' && c.laptop && [0, 1, 2].map(i => (
          <text key={i}
            x={c.x - 18 + i * 16} y={headY - 18}
            fontSize="6.5" fill="#00f5ff" opacity="0.7" fontFamily="monospace"
            style={{ animation: `codeFloat ${1 + i * 0.3}s ease-out infinite`, animationDelay: `${i * 0.45}s` }}
          >
            {['{}', '//', ';;'][i]}
          </text>
        ))}
      </svg>
    </div>
  )
}
