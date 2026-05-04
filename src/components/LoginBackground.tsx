'use client'

import { useEffect, useState, useRef } from 'react'

type Scene =
  | 'walking'
  | 'coding'
  | 'drop'
  | 'bug-chase'
  | 'hiding'
  | 'eureka'
  | 'bug-return'

interface CharState {
  scene: Scene
  x: number
  facing: 1 | -1
  bodySquash: number
  bodyLean: number
  legPhase: number
  eyeOffsetX: number
  eyeOffsetY: number
  mouth: 'smile' | 'open' | 'worry' | 'think' | 'big-o'
  armRAngle: number
  armLAngle: number
  legRAngle: number
  legLAngle: number
  shadowScale: number
  antennaGlow: boolean
  blinkTimer: number
  eyeScale: number
  bodyY: number
  laptopVisible: boolean
  laptopAngle: number
  laptopY: number
  bugX: number
  bugVisible: boolean
  bugFacing: 1 | -1
  boxVisible: boolean
  peekOnly: boolean
  thoughtBubble: '' | '...' | '💡'
  celebrating: boolean
  fourthWallLook: boolean
}

const STAGE_W = 520
const STAGE_H = 180
const GROUND_Y = 148
const CHAR_CX = 50
const BODY_R = 22
const HEAD_R = 25

const initState = (): CharState => ({
  scene: 'walking',
  x: -60,
  facing: 1,
  bodySquash: 1,
  bodyLean: 0,
  legPhase: 0,
  eyeOffsetX: 0,
  eyeOffsetY: 0,
  mouth: 'smile',
  armRAngle: 0,
  armLAngle: 0,
  legRAngle: 0,
  legLAngle: 0,
  shadowScale: 1,
  antennaGlow: false,
  blinkTimer: 0,
  eyeScale: 1,
  bodyY: 0,
  laptopVisible: false,
  laptopAngle: 0,
  laptopY: 0,
  bugX: STAGE_W + 40,
  bugVisible: false,
  bugFacing: -1,
  boxVisible: false,
  peekOnly: false,
  thoughtBubble: '',
  celebrating: false,
  fourthWallLook: false,
})

export default function LoginBackground() {
  const [s, setS] = useState<CharState>(initState)
  const startRef = useRef<number>(0)
  const sceneStartRef = useRef<number>(0)
  const stateRef = useRef<CharState>(initState())

  const set = (patch: Partial<CharState>) => {
    const next = { ...stateRef.current, ...patch }
    stateRef.current = next
    setS(next)
  }

  useEffect(() => {
    let raf: number
    let lastT = 0

    const runScene = (scene: Scene, t: number) => {
      const dt = t - sceneStartRef.current

      if (scene === 'walking') {
        const targetX = STAGE_W / 2 - 20
        const speed = 0.06
        const nx = Math.min(stateRef.current.x + speed * 16, targetX)
        const phase = (t * 0.006) % (Math.PI * 2)
        const bobY = Math.sin(phase * 2) * 2
        const legR = Math.sin(phase) * 30
        const legL = Math.sin(phase + Math.PI) * 30
        const armR = Math.sin(phase + Math.PI) * 20
        const armL = Math.sin(phase) * 20
        set({
          x: nx,
          bodyY: bobY,
          legRAngle: legR,
          legLAngle: legL,
          armRAngle: armR,
          armLAngle: armL,
          shadowScale: 1 - Math.abs(bobY) * 0.02,
          antennaGlow: Math.sin(t * 0.003) > 0.5,
        })
        if (nx >= targetX && dt > 800) nextScene('coding', t)
      }

      if (scene === 'coding') {
        const phase = (t * 0.004) % (Math.PI * 2)
        const typingR = Math.sin(phase) * 15 + 10
        const typingL = Math.sin(phase + Math.PI) * 15 + 10
        set({
          laptopVisible: true,
          laptopAngle: 0,
          laptopY: 0,
          armRAngle: typingR,
          armLAngle: typingL,
          legRAngle: -20,
          legLAngle: 20,
          bodyY: 8,
          mouth: 'think',
          eyeOffsetX: 0,
          eyeOffsetY: 3,
          eyeScale: 0.85,
        })
        if (dt > 3500) nextScene('drop', t)
      }

      if (scene === 'drop') {
        if (dt < 400) {
          const shake = Math.sin(dt * 0.08) * 4
          set({ laptopAngle: shake, mouth: 'big-o', eyeScale: 1.4, eyeOffsetX: 0, eyeOffsetY: -3 })
        } else if (dt < 800) {
          const fall = Math.min((dt - 400) / 400, 1)
          set({
            laptopAngle: fall * 180,
            laptopY: fall * 40,
            armRAngle: 60,
            armLAngle: 60,
          })
        } else if (dt < 1200) {
          const bounce = Math.sin((dt - 800) * 0.01) * 5 * (1 - (dt - 800) / 400)
          set({ laptopY: 40 + bounce, laptopAngle: 180 })
        } else {
          if (dt > 2200) nextScene('bug-chase', t)
        }
      }

      if (scene === 'bug-chase') {
        if (dt < 300) {
          set({
            facing: 1,
            mouth: 'big-o',
            eyeOffsetX: 3,
            eyeOffsetY: -2,
            eyeScale: 1.5,
            bugVisible: true,
            bugX: stateRef.current.x + 120,
            bugFacing: -1,
          })
        } else {
          const spd = 0.09
          const bspd = 0.055
          const phase = (t * 0.012) % (Math.PI * 2)
          const nx = stateRef.current.x + spd * 16
          const nbx = stateRef.current.bugX - bspd * 16
          set({
            x: nx,
            bugX: nbx,
            bodyLean: -15,
            bodyY: Math.sin(phase * 2) * 2,
            legRAngle: Math.sin(phase) * 40,
            legLAngle: Math.sin(phase + Math.PI) * 40,
            armRAngle: Math.sin(phase + Math.PI) * 25 - 10,
            armLAngle: Math.sin(phase) * 25 - 10,
            eyeOffsetX: -4,
            eyeOffsetY: 0,
            mouth: 'worry',
            eyeScale: 1.2,
          })
          if (nx > STAGE_W - 80 || dt > 4000) nextScene('hiding', t)
        }
      }

      if (scene === 'hiding') {
        if (dt < 400) {
          set({
            boxVisible: true,
            peekOnly: false,
            x: STAGE_W - 100,
            bodyLean: 0,
            bodyY: 12,
            legRAngle: -25,
            legLAngle: 25,
          })
        } else if (dt < 600) {
          set({ peekOnly: true, bodyY: 20 })
        } else {
          const nervous = Math.sin(dt * 0.004) * 6
          const nbx = stateRef.current.bugX - 0.02 * 16
          set({
            eyeOffsetX: nervous,
            bugX: Math.max(nbx, STAGE_W / 2 - 20),
            bugFacing: Math.sin(dt * 0.002) > 0 ? 1 : -1,
          })
          if (dt > 3500) nextScene('eureka', t)
        }
      }

      if (scene === 'eureka') {
        if (dt < 600) {
          set({
            peekOnly: false,
            bodyY: 8,
            bugX: stateRef.current.bugX + 0.04 * 16,
            bugVisible: stateRef.current.bugX < STAGE_W + 60,
            mouth: 'smile',
            eyeOffsetX: 3,
            eyeOffsetY: 0,
            eyeScale: 1,
          })
        } else if (dt < 1000) {
          set({ armRAngle: -60, mouth: 'smile', thoughtBubble: '...' })
        } else if (dt < 1800) {
          set({ thoughtBubble: '💡', armRAngle: -80 })
        } else if (dt < 2200) {
          const jumpProg = (dt - 1800) / 400
          const jy = -Math.sin(jumpProg * Math.PI) * 35
          const sqsh = jumpProg > 0.85 ? 0.8 + (jumpProg - 0.85) / 0.15 * 0.2 : 1
          set({
            bodyY: jy,
            bodySquash: sqsh,
            shadowScale: 1 - Math.abs(jy) / 70,
            celebrating: true,
            thoughtBubble: '',
            armRAngle: -140,
            armLAngle: -140,
            mouth: 'big-o',
          })
        } else if (dt < 2400) {
          set({ bodyY: 0, bodySquash: 0.75, shadowScale: 1, celebrating: false })
        } else if (dt < 2700) {
          set({ bodySquash: 1.1 })
        } else if (dt < 3000) {
          set({ bodySquash: 1, mouth: 'smile', armRAngle: 0, armLAngle: 0 })
        } else {
          if (dt > 3500) nextScene('bug-return', t)
        }
      }

      if (scene === 'bug-return') {
        if (dt < 200) {
          set({
            bugX: STAGE_W + 40,
            bugVisible: true,
            bugFacing: -1,
            boxVisible: false,
          })
        } else if (dt < 800) {
          const nbx = stateRef.current.bugX - 0.07 * 16
          set({ bugX: nbx })
        } else if (dt < 1000) {
          set({ fourthWallLook: true, eyeOffsetX: 0, eyeOffsetY: -2, eyeScale: 1.3, mouth: 'worry' })
        } else if (dt < 2000) {
          set({ fourthWallLook: true })
        } else if (dt < 2300) {
          set({ fourthWallLook: false, mouth: 'worry', facing: -1 })
        } else {
          const phase = (t * 0.012) % (Math.PI * 2)
          const nx = stateRef.current.x - 0.085 * 16
          set({
            x: nx,
            facing: -1,
            bodyLean: 15,
            bodyY: Math.sin(phase * 2) * 2,
            legRAngle: Math.sin(phase) * 40,
            legLAngle: Math.sin(phase + Math.PI) * 40,
          })
          if (nx < -80 || dt > 5500) {
            stateRef.current = { ...initState(), scene: 'walking', x: -60 }
            sceneStartRef.current = t
            setS(stateRef.current)
          }
        }
      }
    }

    const nextScene = (scene: Scene, t: number) => {
      sceneStartRef.current = t
      const base: Partial<CharState> = {
        scene,
        bodySquash: 1,
        bodyLean: 0,
        eyeOffsetX: 0,
        eyeOffsetY: 0,
        mouth: 'smile',
        armRAngle: 0,
        armLAngle: 0,
        legRAngle: 0,
        legLAngle: 0,
        bodyY: 0,
        eyeScale: 1,
        fourthWallLook: false,
        celebrating: false,
        thoughtBubble: '',
      }
      if (scene === 'bug-chase') base.laptopVisible = false
      if (scene === 'bug-chase') base.facing = 1
      set(base)
    }

    const loop = (t: number) => {
      if (!startRef.current) {
        startRef.current = t
        sceneStartRef.current = t
      }
      const dt16 = Math.min(t - lastT, 32)
      lastT = t
      void dt16
      runScene(stateRef.current.scene, t)
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const charX = s.x
  const charY = GROUND_Y - BODY_R * 2 - HEAD_R + s.bodyY
  const cx = CHAR_CX
  const bodyTop = charY + HEAD_R * 0.6
  const legBase = bodyTop + BODY_R * 2 * s.bodySquash

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: 0.65,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes antennaPulse {
          0%,100% { opacity:1; filter: drop-shadow(0 0 4px #00f5ff); }
          50% { opacity:0.3; filter: none; }
        }
        @keyframes codeFloat {
          0% { transform: translateY(0) translateX(0); opacity:0.9; }
          100% { transform: translateY(-38px) translateX(8px); opacity:0; }
        }
        @keyframes bugWiggle {
          0%,100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes thoughtPop {
          0% { transform: scale(0); opacity:0; }
          100% { transform: scale(1); opacity:1; }
        }
      `}</style>

      <svg
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Ground line */}
        <line x1="0" y1={GROUND_Y + 2} x2={STAGE_W} y2={GROUND_Y + 2} stroke="#1e1e3a" strokeWidth="1" />

        {/* Shadow */}
        <ellipse
          cx={charX + cx}
          cy={GROUND_Y + 4}
          rx={28 * s.shadowScale}
          ry={5 * s.shadowScale}
          fill="rgba(0,0,0,0.5)"
        />

        {/* Laptop on ground (dropped) */}
        {s.scene === 'drop' && s.laptopVisible && s.laptopAngle > 90 && (
          <g transform={`translate(${charX + cx - 10}, ${GROUND_Y - 8})`}>
            <rect x="0" y="0" width="24" height="16" rx="2" fill="#1a1a2e" stroke="#7c3aed" strokeWidth="1.5" transform={`rotate(${s.laptopAngle > 170 ? 180 : s.laptopAngle - 90}, 12, 8)`} />
            <rect x="2" y="1" width="20" height="12" fill="#0a0a1f" transform={`rotate(${s.laptopAngle > 170 ? 180 : s.laptopAngle - 90}, 12, 8)`} />
          </g>
        )}

        {/* Box */}
        {s.boxVisible && (
          <g transform={`translate(${STAGE_W - 115}, ${GROUND_Y - 38})`}>
            <rect x="0" y="0" width="44" height="40" fill="#5c3317" stroke="#8b4513" strokeWidth="2" />
            <rect x="0" y="0" width="44" height="8" fill="#7a4520" stroke="#8b4513" strokeWidth="1" />
            <line x1="22" y1="0" x2="22" y2="40" stroke="#8b4513" strokeWidth="1" strokeDasharray="3,3" />
          </g>
        )}

        {/* Bug */}
        {s.bugVisible && (
          <g
            transform={`translate(${s.bugX}, ${GROUND_Y - 14}) scale(${s.bugFacing}, 1)`}
            style={{ animation: 'bugWiggle 0.4s ease-in-out infinite' }}
          >
            <ellipse cx="0" cy="0" rx="14" ry="10" fill="#22c55e" />
            <circle cx="-6" cy="-3" r="3" fill="white" />
            <circle cx="6" cy="-3" r="3" fill="white" />
            <circle cx="-5" cy="-3" r="1.5" fill="#ef4444" />
            <circle cx="7" cy="-3" r="1.5" fill="#ef4444" />
            <line x1="-8" y1="-8" x2="-14" y2="-16" stroke="#22c55e" strokeWidth="1.5" />
            <line x1="8" y1="-8" x2="14" y2="-16" stroke="#22c55e" strokeWidth="1.5" />
            <line x1="-10" y1="2" x2="-16" y2="6" stroke="#22c55e" strokeWidth="1.2" />
            <line x1="10" y1="2" x2="16" y2="6" stroke="#22c55e" strokeWidth="1.2" />
            <line x1="-10" y1="6" x2="-16" y2="12" stroke="#22c55e" strokeWidth="1.2" />
            <line x1="10" y1="6" x2="16" y2="12" stroke="#22c55e" strokeWidth="1.2" />
          </g>
        )}

        {/* Character group */}
        <g
          transform={`translate(${charX}, 0) scale(${s.facing}, 1) translate(${s.facing === -1 ? -cx * 2 : 0}, 0)`}
        >
          {/* Legs */}
          {!s.peekOnly && (
            <>
              <g transform={`translate(${cx - 8}, ${legBase}) rotate(${s.legLAngle}, 0, 0)`} style={{ transformOrigin: '0 0' }}>
                <rect x="-4" y="0" width="8" height="14" rx="4" fill="#6d28d9" />
                <rect x="-5" y="11" width="10" height="6" rx="2" fill="#4c1d95" />
              </g>
              <g transform={`translate(${cx + 8}, ${legBase}) rotate(${s.legRAngle}, 0, 0)`} style={{ transformOrigin: '0 0' }}>
                <rect x="-4" y="0" width="8" height="14" rx="4" fill="#6d28d9" />
                <rect x="-5" y="11" width="10" height="6" rx="2" fill="#4c1d95" />
              </g>
            </>
          )}

          {/* Body */}
          {!s.peekOnly && (
            <ellipse
              cx={cx}
              cy={bodyTop + BODY_R * s.bodySquash}
              rx={BODY_R + (1 - s.bodySquash) * 8}
              ry={BODY_R * s.bodySquash}
              fill="#7c3aed"
              transform={`rotate(${s.bodyLean}, ${cx}, ${bodyTop + BODY_R})`}
            />
          )}

          {/* Arms */}
          {!s.peekOnly && (
            <>
              <g transform={`translate(${cx - BODY_R + 4}, ${bodyTop + 10}) rotate(${s.armLAngle - 20}, 0, 0)`} style={{ transformOrigin: '0 0' }}>
                <rect x="-4" y="0" width="8" height="16" rx="4" fill="#6d28d9" />
                <circle cx="0" cy="17" r="4" fill="#8b5cf6" />
              </g>
              <g transform={`translate(${cx + BODY_R - 4}, ${bodyTop + 10}) rotate(${s.armRAngle + 20}, 0, 0)`} style={{ transformOrigin: '0 0' }}>
                <rect x="-4" y="0" width="8" height="16" rx="4" fill="#6d28d9" />
                <circle cx="0" cy="17" r="4" fill="#8b5cf6" />
              </g>
            </>
          )}

          {/* Laptop (coding scene) */}
          {s.laptopVisible && s.scene === 'coding' && (
            <g transform={`translate(${cx - 18}, ${bodyTop + BODY_R * 2 - 10})`}>
              <rect x="0" y="-10" width="36" height="24" rx="2" fill="#1a1a2e" stroke="#7c3aed" strokeWidth="1.5" />
              <rect x="2" y="-8" width="32" height="18" rx="1" fill="#0d0d1f" />
              {[0,4,8,12].map(i => (
                <rect key={i} x={4 + (i % 3) * 8} y={-6 + Math.floor(i/3) * 5} width={5 + (i % 2) * 3} height="2" rx="1" fill="#00f5ff" opacity="0.7" />
              ))}
              <rect x="8" y="14" width="20" height="4" rx="1" fill="#2d2d4e" />
            </g>
          )}

          {/* Laptop dropping */}
          {s.laptopVisible && s.scene === 'drop' && s.laptopAngle <= 90 && (
            <g transform={`translate(${cx - 18}, ${bodyTop + BODY_R * 2 - 10 + s.laptopY}) rotate(${s.laptopAngle}, 18, 10)`}>
              <rect x="0" y="-10" width="36" height="24" rx="2" fill="#1a1a2e" stroke="#7c3aed" strokeWidth="1.5" />
              <rect x="2" y="-8" width="32" height="18" fill="#0d0d1f" />
              <rect x="8" y="14" width="20" height="4" rx="1" fill="#2d2d4e" />
            </g>
          )}

          {/* Head */}
          <circle
            cx={cx}
            cy={charY + HEAD_R}
            r={HEAD_R}
            fill="#9333ea"
          />

          {/* Eyes */}
          {/* Left eye */}
          <g transform={`translate(${cx - 10 + s.eyeOffsetX}, ${charY + HEAD_R - 2 + s.eyeOffsetY}) scale(${s.eyeScale})`}>
            <circle cx="0" cy="0" r="7" fill="white" />
            <circle cx={s.fourthWallLook ? 0 : 1} cy={s.fourthWallLook ? 0 : 1} r="3.5" fill="#1a1a2e" />
            <circle cx={s.fourthWallLook ? 1 : 2} cy={s.fourthWallLook ? -1 : -1} r="1" fill="white" />
          </g>
          {/* Right eye */}
          <g transform={`translate(${cx + 10 + s.eyeOffsetX}, ${charY + HEAD_R - 2 + s.eyeOffsetY}) scale(${s.eyeScale})`}>
            <circle cx="0" cy="0" r="7" fill="white" />
            <circle cx={s.fourthWallLook ? 0 : 1} cy={s.fourthWallLook ? 0 : 1} r="3.5" fill="#1a1a2e" />
            <circle cx={s.fourthWallLook ? 1 : 2} cy={s.fourthWallLook ? -1 : -1} r="1" fill="white" />
          </g>

          {/* Mouth */}
          {s.mouth === 'smile' && (
            <path d={`M ${cx - 7} ${charY + HEAD_R + 8} Q ${cx} ${charY + HEAD_R + 14} ${cx + 7} ${charY + HEAD_R + 8}`} fill="none" stroke="#581c87" strokeWidth="2" strokeLinecap="round" />
          )}
          {s.mouth === 'big-o' && (
            <ellipse cx={cx} cy={charY + HEAD_R + 9} rx="6" ry="7" fill="#581c87" />
          )}
          {s.mouth === 'worry' && (
            <path d={`M ${cx - 7} ${charY + HEAD_R + 11} Q ${cx} ${charY + HEAD_R + 7} ${cx + 7} ${charY + HEAD_R + 11}`} fill="none" stroke="#581c87" strokeWidth="2" strokeLinecap="round" />
          )}
          {s.mouth === 'think' && (
            <path d={`M ${cx - 5} ${charY + HEAD_R + 9} L ${cx + 5} ${charY + HEAD_R + 9}`} stroke="#581c87" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Antenna */}
          <line
            x1={cx}
            y1={charY}
            x2={cx + 4}
            y2={charY - 14}
            stroke="#9333ea"
            strokeWidth="2.5"
          />
          <circle
            cx={cx + 4}
            cy={charY - 14}
            r="4"
            fill={s.antennaGlow ? '#00f5ff' : '#67e8f9'}
            style={{ animation: 'antennaPulse 1.2s ease-in-out infinite' }}
          />

          {/* Cheeks blush */}
          <ellipse cx={cx - 16} cy={charY + HEAD_R + 4} rx="5" ry="3" fill="#ec4899" opacity="0.35" />
          <ellipse cx={cx + 16} cy={charY + HEAD_R + 4} rx="5" ry="3" fill="#ec4899" opacity="0.35" />
        </g>

        {/* Thought bubble (not flipped with character) */}
        {s.thoughtBubble && (
          <g
            transform={`translate(${charX + cx + 20}, ${charY - 20})`}
            style={{ animation: 'thoughtPop 0.3s ease-out forwards' }}
          >
            <circle cx="-4" cy="10" r="3" fill="rgba(255,255,255,0.15)" stroke="#9333ea" strokeWidth="1" />
            <circle cx="4" cy="4" r="5" fill="rgba(255,255,255,0.15)" stroke="#9333ea" strokeWidth="1" />
            <ellipse cx="16" cy="-6" rx="18" ry="14" fill="rgba(20,10,40,0.85)" stroke="#9333ea" strokeWidth="1.5" />
            <text x="16" y="-2" textAnchor="middle" fontSize="12" fill="white">{s.thoughtBubble}</text>
          </g>
        )}

        {/* Code particles (coding scene) */}
        {s.scene === 'coding' && [0, 1, 2].map(i => (
          <text
            key={i}
            x={charX + cx - 30 + i * 22}
            y={charY - 10}
            fontSize="8"
            fill="#00f5ff"
            opacity="0.7"
            fontFamily="monospace"
            style={{
              animation: `codeFloat ${1.2 + i * 0.4}s ease-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {['{}', '//', '=>'][i]}
          </text>
        ))}
      </svg>
    </div>
  )
}
