'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface RobotCharacterProps {
  modalRef?: React.RefObject<HTMLDivElement | null>
}

interface RobotEvent {
  id: string
  weight: number
  duration: number
  minIdleAfter: number
}

const EVENTS: RobotEvent[] = [
  { id: 'walk',          weight: 60, duration: 10000, minIdleAfter: 0     },
  { id: 'wave',          weight: 15, duration: 3000,  minIdleAfter: 8000  },
  { id: 'jumping_jacks', weight: 5,  duration: 4000,  minIdleAfter: 10000 },
  { id: 'run_from_bug',  weight: 5,  duration: 5000,  minIdleAfter: 15000 },
  { id: 'spaceship',     weight: 3,  duration: 6000,  minIdleAfter: 20000 },
  { id: 'steal_cursor',  weight: 3,  duration: 4000,  minIdleAfter: 20000 },
  { id: 'sleep',         weight: 4,  duration: 7000,  minIdleAfter: 15000 },
  { id: 'dance',         weight: 4,  duration: 5000,  minIdleAfter: 12000 },
  { id: 'push_modal',    weight: 3,  duration: 4000,  minIdleAfter: 20000 },
  { id: 'trip',          weight: 4,  duration: 4000,  minIdleAfter: 10000 },
  { id: 'telescope',     weight: 3,  duration: 4000,  minIdleAfter: 15000 },
  { id: 'ghost_scare',   weight: 3,  duration: 5000,  minIdleAfter: 20000 },
  { id: 'rocket',        weight: 2,  duration: 8000,  minIdleAfter: 25000 },
  { id: 'butterfly',     weight: 3,  duration: 6000,  minIdleAfter: 15000 },
  { id: 'mirror_cursor', weight: 2,  duration: 6000,  minIdleAfter: 20000 },
]

function pickRandomEvent(): RobotEvent {
  const total = EVENTS.reduce((s, e) => s + e.weight, 0)
  let r = Math.random() * total
  for (const ev of EVENTS) {
    r -= ev.weight
    if (r <= 0) return ev
  }
  return EVENTS[0]
}

// ─── Robot SVG (unused — kept as reference) ───────────────────────────────────
// Active implementation is RobotSVGInline below.

function _RobotSVGRef({ eventId, face, width: _w, height: _h }: { eventId: string; face: string; width: number; height: number }) {
  const cls = (base: string) => `${base} robot-${eventId}`

  const eyesNormal = (
    <>
      <rect x="28" y="27" width="10" height="7" rx="1" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }} />
      <rect x="44" y="27" width="10" height="7" rx="1" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }} />
    </>
  )
  const eyesSurprised = (
    <>
      <ellipse cx="33" cy="31" rx="7" ry="7" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
      <ellipse cx="49" cy="31" rx="7" ry="7" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
    </>
  )
  const eyesSleepy = (
    <>
      <rect x="28" y="30" width="10" height="3" rx="1" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
      <rect x="44" y="30" width="10" height="3" rx="1" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
    </>
  )
  const eyesExcited = (
    <>
      {/* Star eyes */}
      <text x="26" y="34" fontSize="12" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)', fontWeight: 'bold' }}>✦</text>
      <text x="42" y="34" fontSize="12" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)', fontWeight: 'bold' }}>✦</text>
    </>
  )
  const eyesScared = (
    <>
      <rect x="30" y="28" width="6" height="6" rx="1" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
      <rect x="46" y="28" width="6" height="6" rx="1" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
    </>
  )

  const mouthHappy = <path d="M32 40 Q41 47 50 40" stroke="#00d4ff" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
  const mouthSurprised = <ellipse cx="41" cy="42" rx="5" ry="6" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }} />
  const mouthSleepy = <path d="M34 42 Q41 40 48 42" stroke="#00d4ff" strokeWidth="2" fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
  const mouthExcited = <path d="M30 39 Q41 50 52 39" stroke="#00d4ff" strokeWidth="3" fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }} />
  const mouthScared = <ellipse cx="41" cy="43" rx="6" ry="4" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />

  type FaceKey = 'happy' | 'surprised' | 'sleepy' | 'excited' | 'scared'
  const faces: Record<FaceKey, { eyes: React.ReactNode; mouth: React.ReactNode }> = {
    happy:     { eyes: eyesNormal,    mouth: mouthHappy    },
    surprised: { eyes: eyesSurprised, mouth: mouthSurprised },
    sleepy:    { eyes: eyesSleepy,    mouth: mouthSleepy   },
    excited:   { eyes: eyesExcited,   mouth: mouthExcited  },
    scared:    { eyes: eyesScared,    mouth: mouthScared   },
  }
  const currentFace = faces[(face as FaceKey)] ?? faces.happy

  const walkClass    = eventId === 'walk' || eventId === 'run_from_bug' || eventId === 'butterfly' ? 'robot-walk' : ''
  const waveClass    = eventId === 'wave' ? 'robot-wave' : ''
  const jumpClass    = eventId === 'jumping_jacks' ? 'robot-jumping' : ''
  const danceClass   = eventId === 'dance' ? 'robot-dancing' : ''
  const tripClass    = eventId === 'trip' ? 'robot-tripping' : ''
  const scaredClass  = eventId === 'ghost_scare' && face === 'scared' ? 'robot-scared' : ''
  const sleepClass   = eventId === 'sleep' ? 'robot-sleeping' : ''
  const idleClass    = !walkClass && !waveClass && !jumpClass && !danceClass && !tripClass && !scaredClass && eventId !== 'sleep' ? 'robot-idle' : ''
  const bodyClass    = [walkClass, waveClass, jumpClass, danceClass, tripClass, scaredClass, sleepClass, idleClass].filter(Boolean).join(' ')

  return (
    <svg
      viewBox="0 0 82 120"
      width={_w}
      height={_h}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <g className={bodyClass} style={{ transformOrigin: '41px 60px' }}>
        {/* ── Antenna ── */}
        <line x1="41" y1="2" x2="41" y2="12" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" />
        <circle cx="41" cy="2" r="3.5" fill="#00d4ff" className="antenna-glow" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />

        {/* ── Ears ── */}
        <circle cx="14" cy="30" r="5" fill="#c8d4dc" stroke="#1a9fe0" strokeWidth="1.5" />
        <circle cx="14" cy="30" r="2.5" fill="#1a9fe0" />
        <circle cx="68" cy="30" r="5" fill="#c8d4dc" stroke="#1a9fe0" strokeWidth="1.5" />
        <circle cx="68" cy="30" r="2.5" fill="#1a9fe0" />

        {/* ── Head ── */}
        <rect x="16" y="12" width="50" height="46" rx="12" fill="#e8edf2" stroke="#1a9fe0" strokeWidth="1.5" />

        {/* ── Visor ── */}
        <rect x="22" y="20" width="38" height="30" rx="6" fill="#0a0a1a" stroke="#1a9fe0" strokeWidth="1.5" style={{ filter: 'drop-shadow(inset 0 0 4px #00d4ff)' }} />

        {/* ── Face expression ── */}
        {currentFace.eyes}
        {currentFace.mouth}

        {/* ── Neck ── */}
        <rect x="33" y="57" width="16" height="7" rx="3" fill="#b0bec5" />

        {/* ── Body ── */}
        <rect x="10" y="63" width="62" height="42" rx="10" fill="#e8edf2" stroke="#1a9fe0" strokeWidth="1.5" />

        {/* ── Body detail lines ── */}
        <rect x="20" y="70" width="42" height="2" rx="1" fill="#b0bec5" opacity="0.5" />
        <rect x="20" y="75" width="30" height="2" rx="1" fill="#b0bec5" opacity="0.3" />

        {/* ── Chest emblem ── */}
        <circle cx="41" cy="87" r="9" fill="#1a9fe0" stroke="#00d4ff" strokeWidth="1" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
        <text x="41" y="91" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">A</text>

        {/* ── Left arm ── */}
        <g className="arm-left" style={{ transformOrigin: '14px 67px' }}>
          <rect x="4" y="64" width="10" height="28" rx="5" fill="#e8edf2" stroke="#1a9fe0" strokeWidth="1.2" />
          <circle cx="9" cy="95" r="5.5" fill="#c8d4dc" stroke="#1a9fe0" strokeWidth="1" />
        </g>

        {/* ── Right arm ── */}
        <g className={`arm-right ${eventId === 'telescope' ? 'arm-telescope' : ''}`} style={{ transformOrigin: '68px 67px' }}>
          <rect x="68" y="64" width="10" height="28" rx="5" fill="#e8edf2" stroke="#1a9fe0" strokeWidth="1.2" />
          <circle cx="73" cy="95" r="5.5" fill="#c8d4dc" stroke="#1a9fe0" strokeWidth="1" />
          {/* Telescope attachment */}
          {eventId === 'telescope' && (
            <g className="telescope-extend" style={{ transformOrigin: 'left center' }}>
              <rect x="73" y="90" width="22" height="8" rx="3" fill="#b0bec5" stroke="#1a9fe0" strokeWidth="1" />
              <circle cx="95" cy="94" r="5" fill="#0a0a1a" stroke="#1a9fe0" strokeWidth="1" />
              <circle cx="95" cy="94" r="2" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
            </g>
          )}
        </g>

        {/* ── Legs ── */}
        <rect x="22" y="104" width="14" height="16" rx="5" fill="#c8d4dc" stroke="#1a9fe0" strokeWidth="1.2" />
        <rect x="46" y="104" width="14" height="16" rx="5" fill="#c8d4dc" stroke="#1a9fe0" strokeWidth="1.2" />

        {/* ── Feet ── */}
        <ellipse cx="29" cy="119" rx="10" ry="5" fill="#b0bec5" stroke="#1a9fe0" strokeWidth="1" />
        <ellipse cx="53" cy="119" rx="10" ry="5" fill="#b0bec5" stroke="#1a9fe0" strokeWidth="1" />

        {/* ── Joint highlights ── */}
        <circle cx="9"  cy="64" r="3" fill="#1a9fe0" opacity="0.7" />
        <circle cx="73" cy="64" r="3" fill="#1a9fe0" opacity="0.7" />
      </g>
    </svg>
  )
}

// ─── Overlay SVGs ─────────────────────────────────────────────────────────────

function ZzzOverlay() {
  return (
    <g>
      <text x="55" y="5" fontSize="10" fill="#00d4ff" className="zzz-1" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }}>Z</text>
      <text x="62" y="-5" fontSize="13" fill="#00d4ff" className="zzz-2" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }}>Z</text>
      <text x="72" y="-15" fontSize="16" fill="#00d4ff" className="zzz-3" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }}>Z</text>
    </g>
  )
}

function MusicNotesOverlay() {
  return (
    <g>
      <text x="0" y="-10" fontSize="14" fill="#ff88ff" className="note-1" style={{ filter: 'drop-shadow(0 0 3px #ff88ff)' }}>♪</text>
      <text x="70" y="-5" fontSize="12" fill="#ffff00" className="note-2" style={{ filter: 'drop-shadow(0 0 3px #ffff00)' }}>♫</text>
      <text x="35" y="-20" fontSize="16" fill="#ff88ff" className="note-3" style={{ filter: 'drop-shadow(0 0 3px #ff88ff)' }}>♪</text>
    </g>
  )
}

function GhostElement({ posX }: { posX: number }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '60px',
        left: `${posX + 12}%`,
        zIndex: 9,
        pointerEvents: 'none',
      }}
      className="ghost-anim"
    >
      <svg viewBox="0 0 50 60" width="50" height="60">
        <ellipse cx="25" cy="22" rx="18" ry="18" fill="rgba(255,255,255,0.85)" />
        <rect x="7" y="22" width="36" height="22" fill="rgba(255,255,255,0.85)" />
        <path d="M7 44 Q13 38 19 44 Q25 50 31 44 Q37 38 43 44" fill="rgba(255,255,255,0.85)" />
        <ellipse cx="18" cy="22" rx="4" ry="5" fill="#333" />
        <ellipse cx="32" cy="22" rx="4" ry="5" fill="#333" />
        <text x="25" y="15" textAnchor="middle" fontSize="9" fill="#555" fontWeight="bold">BOO!</text>
      </svg>
    </div>
  )
}

function SpaceshipElement({ posX }: { posX: number }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: `${posX}%`,
        zIndex: 15,
        pointerEvents: 'none',
      }}
      className="spaceship-anim"
    >
      <svg viewBox="0 0 100 60" width="100" height="60">
        {/* Ship body */}
        <ellipse cx="50" cy="30" rx="40" ry="16" fill="#c8d4dc" stroke="#1a9fe0" strokeWidth="2" />
        {/* Dome */}
        <ellipse cx="50" cy="20" rx="20" ry="14" fill="#0a0a1a" stroke="#00d4ff" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
        {/* Window with robot waving */}
        <ellipse cx="50" cy="19" rx="13" ry="10" fill="#0d1a2a" />
        <text x="50" y="23" textAnchor="middle" fontSize="12">🤖</text>
        {/* Lights */}
        <circle cx="20" cy="32" r="3" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
        <circle cx="50" cy="44" r="3" fill="#ff4488" style={{ filter: 'drop-shadow(0 0 4px #ff4488)' }} />
        <circle cx="80" cy="32" r="3" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
        {/* Glow underneath */}
        <ellipse cx="50" cy="46" rx="30" ry="6" fill="rgba(0,212,255,0.15)" />
      </svg>
    </div>
  )
}

function BugElement({ posX }: { posX: number }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '25px',
        left: `${posX + 15}%`,
        fontSize: '28px',
        zIndex: 9,
        pointerEvents: 'none',
        animation: 'bugChase 3s linear forwards',
      }}
    >
      🐛
    </div>
  )
}

function ButterflyElement({ posX }: { posX: number }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: `${posX}%`,
        zIndex: 9,
        pointerEvents: 'none',
      }}
      className="butterfly-path"
    >
      <svg viewBox="0 0 40 30" width="40" height="30">
        <g className="butterfly-wing-l">
          <ellipse cx="12" cy="12" rx="12" ry="8" fill="rgba(255,120,200,0.8)" stroke="#ff44aa" strokeWidth="1" />
          <ellipse cx="10" cy="20" rx="8" ry="5" fill="rgba(255,200,50,0.8)" stroke="#ffaa00" strokeWidth="1" />
        </g>
        <g className="butterfly-wing-r">
          <ellipse cx="28" cy="12" rx="12" ry="8" fill="rgba(255,120,200,0.8)" stroke="#ff44aa" strokeWidth="1" />
          <ellipse cx="30" cy="20" rx="8" ry="5" fill="rgba(255,200,50,0.8)" stroke="#ffaa00" strokeWidth="1" />
        </g>
        <line x1="20" y1="5" x2="20" y2="26" stroke="#333" strokeWidth="1.5" />
        <line x1="17" y1="7" x2="20" y2="5" stroke="#333" strokeWidth="1" />
        <line x1="23" y1="7" x2="20" y2="5" stroke="#333" strokeWidth="1" />
      </svg>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

const ROBOT_CSS = `
  @keyframes robot-float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes antenna-pulse {
    0%,100% { opacity: 1;   filter: drop-shadow(0 0 4px #00d4ff); }
    50%     { opacity: 0.3; filter: drop-shadow(0 0 1px #00d4ff); }
  }
  @keyframes robot-walk-bob {
    0%,100% { transform: translateY(0px)  rotate(0deg); }
    25%     { transform: translateY(-2px) rotate(0.5deg); }
    75%     { transform: translateY(-2px) rotate(-0.5deg); }
  }
  @keyframes arm-swing-l {
    0%,100% { transform: rotate(-12deg); }
    50%     { transform: rotate(12deg); }
  }
  @keyframes arm-swing-r {
    0%,100% { transform: rotate(12deg); }
    50%     { transform: rotate(-12deg); }
  }
  @keyframes wave-arm {
    0%,100% { transform: rotate(0deg); }
    25%     { transform: rotate(-50deg); }
    75%     { transform: rotate(10deg); }
  }
  @keyframes jacks-arm {
    0%,100% { transform: rotate(0deg); }
    50%     { transform: rotate(-70deg); }
  }
  @keyframes jacks-body {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-10px); }
  }
  @keyframes dance-body {
    0%,100% { transform: rotate(0deg); }
    25%     { transform: rotate(-15deg); }
    75%     { transform: rotate(15deg); }
  }
  @keyframes dance-arm-l {
    0%,100% { transform: rotate(-35deg); }
    50%     { transform: rotate(35deg); }
  }
  @keyframes dance-arm-r {
    0%,100% { transform: rotate(35deg); }
    50%     { transform: rotate(-35deg); }
  }
  @keyframes trip-body {
    0%      { transform: rotate(0deg) translateY(0px); }
    30%     { transform: rotate(50deg) translateY(6px); }
    65%     { transform: rotate(88deg) translateY(12px); }
    80%     { transform: rotate(88deg) translateY(12px); }
    92%     { transform: rotate(20deg) translateY(3px); }
    100%    { transform: rotate(0deg) translateY(0px); }
  }
  @keyframes scared-shake {
    0%,100% { transform: translateX(0px); }
    20%     { transform: translateX(-2px) rotate(-1deg); }
    40%     { transform: translateX(2px) rotate(1deg); }
    60%     { transform: translateX(-2px) rotate(-1deg); }
    80%     { transform: translateX(2px) rotate(1deg); }
  }
  @keyframes zzz-rise-1 {
    0%  { transform: translateY(0px)  scale(0.5); opacity: 0; }
    20% { opacity: 1; }
    100%{ transform: translateY(-35px) scale(1.3); opacity: 0; }
  }
  @keyframes zzz-rise-2 {
    0%  { transform: translateY(0px)  scale(0.5); opacity: 0; }
    20% { opacity: 1; }
    100%{ transform: translateY(-35px) scale(1.3); opacity: 0; }
  }
  @keyframes zzz-rise-3 {
    0%  { transform: translateY(0px)  scale(0.5); opacity: 0; }
    20% { opacity: 1; }
    100%{ transform: translateY(-35px) scale(1.3); opacity: 0; }
  }
  @keyframes note-rise-1 {
    0%  { transform: translateY(0px)  rotate(-10deg) scale(0.5); opacity: 0; }
    15% { opacity: 1; }
    100%{ transform: translateY(-45px) rotate(20deg) scale(1.1); opacity: 0; }
  }
  @keyframes note-rise-2 {
    0%  { transform: translateY(0px)  rotate(10deg) scale(0.5); opacity: 0; }
    15% { opacity: 1; }
    100%{ transform: translateY(-45px) rotate(-20deg) scale(1.1); opacity: 0; }
  }
  @keyframes note-rise-3 {
    0%  { transform: translateY(0px)  scale(0.5); opacity: 0; }
    15% { opacity: 1; }
    100%{ transform: translateY(-45px) scale(1.1); opacity: 0; }
  }
  @keyframes ghost-float {
    0%,100%{ transform: translateY(0px); }
    50%    { transform: translateY(-8px); }
  }
  @keyframes ghost-approach {
    0%  { transform: translateX(80px); opacity: 0; }
    10% { opacity: 0.9; }
    80% { transform: translateX(5px); opacity: 0.9; }
    100%{ transform: translateX(0px); opacity: 0; }
  }
  @keyframes spaceship-fly {
    0%  { transform: translate(-250px, 20px); opacity: 0; }
    10% { opacity: 1; }
    50% { transform: translate(0px, -10px); }
    90% { opacity: 1; }
    100%{ transform: translate(350px, 20px); opacity: 0; }
  }
  @keyframes bug-chase {
    0%  { transform: translateX(0px); }
    100%{ transform: translateX(-150px); }
  }
  @keyframes butterfly-wings {
    0%,100%{ transform: scaleX(1); }
    50%    { transform: scaleX(0.25); }
  }
  @keyframes butterfly-fly {
    0%  { transform: translate(-60px, 15px); }
    25% { transform: translate(15px, -15px); }
    50% { transform: translate(55px, 25px); }
    75% { transform: translate(25px, -25px); }
    100%{ transform: translate(90px, 5px); }
  }
  @keyframes telescope-extend {
    0%,100%{ transform: scaleX(0.3); opacity: 0.5; }
    40%,60%{ transform: scaleX(1);   opacity: 1;   }
  }
  @keyframes push-lean {
    0%,100%{ transform: rotate(0deg)  translateX(0px); }
    40%    { transform: rotate(-12deg) translateX(6px); }
    70%    { transform: rotate(-12deg) translateX(6px); }
  }
  @keyframes modal-shake {
    0%,100%{ transform: translateX(0px); }
    20%,60%{ transform: translateX(-5px); }
    40%,80%{ transform: translateX(5px); }
  }
  @keyframes rocket-rise {
    0%  { transform: translateY(0px);    opacity: 1; }
    40% { transform: translateY(-120px); opacity: 1; }
    60% { transform: translateY(-120px); opacity: 0; }
    80% { transform: translateY(-120px); opacity: 0; }
    100%{ transform: translateY(0px);    opacity: 1; }
  }
  @keyframes parachute-drop {
    0%  { transform: translateY(-80px); opacity: 0; }
    20% { opacity: 1; }
    100%{ transform: translateY(0px);   opacity: 1; }
  }
  @keyframes steal-run {
    0%,100%{ transform: translateY(0px); }
    50%    { transform: translateY(-4px); }
  }

  .robot-idle   { animation: robot-float 3s ease-in-out infinite; }
  .robot-walk   { animation: robot-walk-bob 0.45s ease-in-out infinite; }
  .robot-walk   .arm-left  { animation: arm-swing-l 0.45s ease-in-out infinite; transform-origin: 9px 64px; }
  .robot-walk   .arm-right { animation: arm-swing-r 0.45s ease-in-out infinite; transform-origin: 73px 64px; }
  .robot-run_from_bug { animation: robot-walk-bob 0.25s ease-in-out infinite; }
  .robot-run_from_bug .arm-left  { animation: arm-swing-l 0.25s ease-in-out infinite; transform-origin: 9px 64px; }
  .robot-run_from_bug .arm-right { animation: arm-swing-r 0.25s ease-in-out infinite; transform-origin: 73px 64px; }
  .robot-steal_cursor { animation: steal-run 0.2s ease-in-out infinite; }
  .robot-wave   .arm-right { animation: wave-arm 0.55s ease-in-out 3; transform-origin: 73px 64px; }
  .robot-jumping_jacks { animation: jacks-body 0.4s ease-in-out infinite; }
  .robot-jumping_jacks .arm-left  { animation: jacks-arm 0.4s ease-in-out infinite; transform-origin: 9px 64px; }
  .robot-jumping_jacks .arm-right { animation: jacks-arm 0.4s ease-in-out infinite reverse; transform-origin: 73px 64px; }
  .robot-dance  { animation: dance-body 0.5s ease-in-out infinite; transform-origin: 41px 90px; }
  .robot-dance  .arm-left  { animation: dance-arm-l 0.5s ease-in-out infinite; transform-origin: 9px 64px; }
  .robot-dance  .arm-right { animation: dance-arm-r 0.5s ease-in-out infinite; transform-origin: 73px 64px; }
  .robot-trip   { animation: trip-body 1.2s ease-in-out forwards; transform-origin: 41px 110px; }
  .robot-ghost_scare.scared { animation: scared-shake 0.12s linear infinite; }
  .robot-push_modal { animation: push-lean 1s ease-in-out infinite; transform-origin: 41px 90px; }
  .robot-sleep  { transform: scaleY(0.82); transform-origin: 41px 110px; }
  .robot-rocket { animation: rocket-rise 8s ease-in-out forwards; }
  .robot-butterfly { animation: robot-walk-bob 0.4s ease-in-out infinite; }
  .robot-butterfly .arm-left  { animation: arm-swing-l 0.4s ease-in-out infinite; transform-origin: 9px 64px; }
  .robot-butterfly .arm-right { animation: arm-swing-r 0.4s ease-in-out infinite; transform-origin: 73px 64px; }
  .robot-mirror_cursor { animation: robot-float 2s ease-in-out infinite; }

  .antenna-glow { animation: antenna-pulse 2s ease-in-out infinite; }
  .zzz-1 { animation: zzz-rise-1 2s ease-in-out infinite; }
  .zzz-2 { animation: zzz-rise-2 2s ease-in-out 0.67s infinite; }
  .zzz-3 { animation: zzz-rise-3 2s ease-in-out 1.33s infinite; }
  .note-1 { animation: note-rise-1 1.6s ease-out infinite; }
  .note-2 { animation: note-rise-2 1.6s ease-out 0.53s infinite; }
  .note-3 { animation: note-rise-3 1.6s ease-out 1.07s infinite; }
  .ghost-anim { animation: ghost-approach 5s ease-in-out forwards; }
  .ghost-float { animation: ghost-float 2s ease-in-out infinite; }
  .spaceship-anim { animation: spaceship-fly 6s ease-in-out forwards; }
  .bug-anim { animation: bug-chase 3s linear forwards; }
  .butterfly-wing-l { animation: butterfly-wings 0.18s ease-in-out infinite; transform-origin: right center; }
  .butterfly-wing-r { animation: butterfly-wings 0.18s ease-in-out infinite reverse; transform-origin: left center; }
  .butterfly-path   { animation: butterfly-fly 4s ease-in-out forwards; }
  .telescope-extend { animation: telescope-extend 2.5s ease-in-out infinite; transform-origin: left center; }
`

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

export default function RobotCharacter({ modalRef }: RobotCharacterProps) {
  const [eventId,   setEventId]   = useState('walk')
  const [face,      setFace]      = useState('happy')
  const [posX,      setPosX]      = useState(() => 8 + Math.random() * 20)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [showBug,      setShowBug]      = useState(false)
  const [showZzz,      setShowZzz]      = useState(false)
  const [showNotes,    setShowNotes]    = useState(false)
  const [showGhost,    setShowGhost]    = useState(false)
  const [showShip,     setShowShip]     = useState(false)
  const [showButterfly,setShowButterfly]= useState(false)
  const [robotHidden,  setRobotHidden]  = useState(false)
  const [isMobile,     setIsMobile]     = useState(false)

  const mountedRef   = useRef(true)
  const posXRef      = useRef(posX)
  const dirRef       = useRef<1 | -1>(1)
  const walkTimer    = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    return () => { mountedRef.current = false }
  }, [])

  const stopWalk = useCallback(() => {
    if (walkTimer.current) { clearInterval(walkTimer.current); walkTimer.current = null }
  }, [])

  const startWalk = useCallback((speed = 1) => {
    stopWalk()
    walkTimer.current = setInterval(() => {
      posXRef.current += dirRef.current * 0.28 * speed
      if (posXRef.current >= 86) { posXRef.current = 85; dirRef.current = -1; setDirection(-1) }
      if (posXRef.current <= 3)  { posXRef.current = 4;  dirRef.current =  1; setDirection(1)  }
      setPosX(posXRef.current)
    }, 50)
  }, [stopWalk])

  const safeSlp = useCallback(async (ms: number) => {
    if (!mountedRef.current) return
    await sleep(ms)
  }, [])

  const runEvent = useCallback(async (ev: RobotEvent) => {
    if (!mountedRef.current) return

    setEventId(ev.id)

    switch (ev.id) {
      case 'walk':
        setFace('happy')
        startWalk(1)
        await safeSlp(ev.duration)
        stopWalk()
        break

      case 'wave':
        stopWalk()
        setFace('happy')
        await safeSlp(ev.duration)
        break

      case 'jumping_jacks':
        stopWalk()
        setFace('excited')
        await safeSlp(ev.duration)
        break

      case 'run_from_bug':
        stopWalk()
        setFace('scared')
        setShowBug(true)
        startWalk(2.2)
        await safeSlp(2800)
        setShowBug(false)
        stopWalk()
        setFace('happy')
        await safeSlp(1200)
        break

      case 'spaceship':
        stopWalk()
        setShowShip(true)
        setRobotHidden(true)
        await safeSlp(ev.duration - 500)
        setShowShip(false)
        setRobotHidden(false)
        setFace('happy')
        break

      case 'steal_cursor':
        stopWalk()
        setFace('excited')
        if (typeof document !== 'undefined') document.body.style.cursor = 'none'
        startWalk(1.5)
        await safeSlp(ev.duration - 500)
        stopWalk()
        if (typeof document !== 'undefined') document.body.style.cursor = ''
        setFace('happy')
        break

      case 'sleep':
        stopWalk()
        setFace('sleepy')
        setShowZzz(true)
        await safeSlp(5000)
        setShowZzz(false)
        setFace('surprised')
        await safeSlp(800)
        setFace('happy')
        break

      case 'dance':
        stopWalk()
        setFace('excited')
        setShowNotes(true)
        await safeSlp(ev.duration)
        setShowNotes(false)
        break

      case 'push_modal':
        stopWalk()
        setFace('surprised')
        if (modalRef?.current) {
          modalRef.current.style.animation = 'modal-shake 0.35s ease-in-out'
          await safeSlp(400)
          if (modalRef.current) modalRef.current.style.animation = ''
        }
        await safeSlp(ev.duration - 500)
        setFace('happy')
        break

      case 'trip':
        stopWalk()
        setFace('surprised')
        await safeSlp(ev.duration)
        setFace('happy')
        break

      case 'telescope':
        stopWalk()
        setFace('happy')
        await safeSlp(ev.duration)
        break

      case 'ghost_scare':
        stopWalk()
        setFace('happy')
        setShowGhost(true)
        await safeSlp(2200)
        setFace('scared')
        await safeSlp(2000)
        setShowGhost(false)
        setFace('surprised')
        await safeSlp(500)
        setFace('happy')
        break

      case 'rocket':
        stopWalk()
        await safeSlp(ev.duration)
        setRobotHidden(false)
        setFace('happy')
        break

      case 'butterfly':
        stopWalk()
        setFace('surprised')
        setShowButterfly(true)
        startWalk(1.4)
        await safeSlp(ev.duration - 500)
        setShowButterfly(false)
        stopWalk()
        setFace('happy')
        break

      case 'mirror_cursor':
        stopWalk()
        setFace('happy')
        await safeSlp(ev.duration)
        setFace('happy')
        break

      default:
        await safeSlp(3000)
    }
  }, [startWalk, stopWalk, safeSlp, modalRef])

  // Main loop
  useEffect(() => {
    let active = true

    const loop = async () => {
      // Start walking immediately
      const first: RobotEvent = { id: 'walk', weight: 60, duration: 5000, minIdleAfter: 0 }
      await runEvent(first)

      while (active && mountedRef.current) {
        const ev = pickRandomEvent()
        await runEvent(ev)
        if (!active || !mountedRef.current) break

        const idleMs = ev.minIdleAfter > 0
          ? ev.minIdleAfter + Math.random() * 4000
          : 3000 + Math.random() * 7000

        if (ev.id !== 'walk') {
          setEventId('walk')
          setFace('happy')
          startWalk(1)
          await sleep(idleMs)
          stopWalk()
        }
      }
    }

    loop()

    return () => {
      active = false
      stopWalk()
      if (typeof document !== 'undefined') document.body.style.cursor = ''
    }
  }, [runEvent, startWalk, stopWalk])

  const size = isMobile ? { w: 80, h: 106 } : { w: 120, h: 160 }

  return (
    <>
      <style>{ROBOT_CSS}</style>

      {/* ── Robot ── */}
      {!robotHidden && (
        <div
          style={{
            position: 'fixed',
            bottom: '16px',
            left: `${posX}%`,
            zIndex: 10,
            transform: `scaleX(${direction})`,
            transition: 'left 0.08s linear',
            pointerEvents: 'none',
            userSelect: 'none',
            width: size.w,
            height: size.h,
          }}
        >
          <svg
            viewBox="0 0 82 130"
            width={size.w}
            height={size.h}
            style={{ overflow: 'visible' }}
          >
            {/* ZZZ overlay */}
            {showZzz && <ZzzOverlay />}
            {/* Music notes overlay */}
            {showNotes && <MusicNotesOverlay />}

            {/* Robot body */}
            <RobotSVGInline eventId={eventId} face={face} />
          </svg>
        </div>
      )}

      {/* ── Overlays ── */}
      {showBug      && <BugElement posX={posX} />}
      {showGhost    && <GhostElement posX={posX} />}
      {showShip     && <SpaceshipElement posX={posX} />}
      {showButterfly&& <ButterflyElement posX={posX} />}
    </>
  )
}

// ─── Inline SVG robot (no wrapper div, renders inside outer <svg>) ─────────────

interface InlineRobotProps { eventId: string; face: string }

function RobotSVGInline({ eventId, face }: InlineRobotProps) {
  type FaceKey = 'happy' | 'surprised' | 'sleepy' | 'excited' | 'scared'

  const faces: Record<FaceKey, React.ReactNode> = {
    happy: <>
      <rect x="27" y="27" width="10" height="7" rx="1.5" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }} />
      <rect x="45" y="27" width="10" height="7" rx="1.5" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }} />
      <path d="M31 40 Q41 48 51 40" stroke="#00d4ff" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
    </>,
    surprised: <>
      <ellipse cx="32" cy="31" rx="7" ry="7" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 5px #00d4ff)' }} />
      <ellipse cx="50" cy="31" rx="7" ry="7" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 5px #00d4ff)' }} />
      <ellipse cx="41" cy="42" rx="5" ry="6" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }} />
    </>,
    sleepy: <>
      <rect x="27" y="30" width="10" height="3" rx="1.5" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
      <rect x="45" y="30" width="10" height="3" rx="1.5" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
      <path d="M33 42 Q41 39 49 42" stroke="#00d4ff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>,
    excited: <>
      <text x="25" y="35" fontSize="13" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)', fontWeight: 'bold' }}>✦</text>
      <text x="43" y="35" fontSize="13" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)', fontWeight: 'bold' }}>✦</text>
      <path d="M29 39 Q41 51 53 39" stroke="#00d4ff" strokeWidth="3" fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }} />
    </>,
    scared: <>
      <rect x="29" y="28" width="7" height="7" rx="1" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
      <rect x="46" y="28" width="7" height="7" rx="1" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
      <ellipse cx="41" cy="43" rx="6" ry="4" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 2px #00d4ff)' }} />
    </>,
  }

  const currentFace = faces[(face as FaceKey)] ?? faces.happy

  // Determine CSS class for body group
  const bodyClass = `robot-${eventId}${face === 'scared' && eventId === 'ghost_scare' ? ' scared' : ''}`

  return (
    <g className={bodyClass} style={{ transformOrigin: '41px 65px' }}>
      {/* Antenna */}
      <line x1="41" y1="2" x2="41" y2="12" stroke="#90a4ae" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="41" cy="2" r="4" fill="#00d4ff" className="antenna-glow" />

      {/* Ears */}
      <circle cx="13" cy="32" r="5.5" fill="#cfd8dc" stroke="#1a9fe0" strokeWidth="1.5" />
      <circle cx="13" cy="32" r="2.5" fill="#1a9fe0" opacity="0.8" />
      <circle cx="69" cy="32" r="5.5" fill="#cfd8dc" stroke="#1a9fe0" strokeWidth="1.5" />
      <circle cx="69" cy="32" r="2.5" fill="#1a9fe0" opacity="0.8" />

      {/* Head */}
      <rect x="17" y="12" width="48" height="48" rx="13" fill="#e8edf2" stroke="#1a9fe0" strokeWidth="1.8" />

      {/* Visor */}
      <rect x="23" y="20" width="36" height="32" rx="7" fill="#080816" stroke="#1a9fe0" strokeWidth="1.5" />
      {/* Visor inner glow */}
      <rect x="24" y="21" width="34" height="30" rx="6" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.4" />

      {/* Face */}
      {currentFace}

      {/* Neck */}
      <rect x="34" y="59" width="14" height="8" rx="3.5" fill="#90a4ae" />
      <rect x="36" y="61" width="10" height="4" rx="2" fill="#78909c" />

      {/* Body */}
      <rect x="9" y="66" width="64" height="44" rx="11" fill="#e8edf2" stroke="#1a9fe0" strokeWidth="1.8" />
      {/* Body shading */}
      <rect x="9" y="66" width="64" height="22" rx="11" fill="rgba(255,255,255,0.25)" />

      {/* Body stripes */}
      <rect x="18" y="73" width="46" height="2" rx="1" fill="#b0bec5" opacity="0.6" />
      <rect x="18" y="78" width="34" height="1.5" rx="0.75" fill="#b0bec5" opacity="0.35" />

      {/* Chest emblem */}
      <circle cx="41" cy="90" r="10" fill="#0d47a1" stroke="#1a9fe0" strokeWidth="1.2" />
      <circle cx="41" cy="90" r="10" fill="none" stroke="#00d4ff" strokeWidth="0.8" opacity="0.6" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
      <text x="41" y="94" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold" fontFamily="monospace">A</text>

      {/* Left arm */}
      <g className="arm-left" style={{ transformOrigin: '11px 68px' }}>
        <rect x="4"  y="66" width="11" height="30" rx="5.5" fill="#dde4ea" stroke="#1a9fe0" strokeWidth="1.2" />
        <rect x="5"  y="67" width="5"  height="28" rx="2.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="9.5" cy="98" r="6" fill="#cfd8dc" stroke="#1a9fe0" strokeWidth="1" />
      </g>

      {/* Right arm */}
      <g className="arm-right" style={{ transformOrigin: '71px 68px' }}>
        <rect x="67" y="66" width="11" height="30" rx="5.5" fill="#dde4ea" stroke="#1a9fe0" strokeWidth="1.2" />
        <rect x="69" y="67" width="5"  height="28" rx="2.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="72.5" cy="98" r="6" fill="#cfd8dc" stroke="#1a9fe0" strokeWidth="1" />
        {/* Telescope */}
        {eventId === 'telescope' && (
          <g className="telescope-extend" style={{ transformOrigin: '72px 95px' }}>
            <rect x="72" y="91" width="24" height="9" rx="4" fill="#90a4ae" stroke="#1a9fe0" strokeWidth="1" />
            <circle cx="96" cy="95.5" r="6" fill="#0a0a1a" stroke="#00d4ff" strokeWidth="1.2" />
            <circle cx="96" cy="95.5" r="2.5" fill="#00d4ff" opacity="0.8" style={{ filter: 'drop-shadow(0 0 3px #00d4ff)' }} />
          </g>
        )}
      </g>

      {/* Legs */}
      <rect x="22" y="108" width="15" height="18" rx="6" fill="#cfd8dc" stroke="#1a9fe0" strokeWidth="1.2" />
      <rect x="45" y="108" width="15" height="18" rx="6" fill="#cfd8dc" stroke="#1a9fe0" strokeWidth="1.2" />
      {/* Leg shine */}
      <rect x="24" y="110" width="5" height="14" rx="2.5" fill="rgba(255,255,255,0.35)" />
      <rect x="47" y="110" width="5" height="14" rx="2.5" fill="rgba(255,255,255,0.35)" />

      {/* Feet */}
      <ellipse cx="29.5" cy="125" rx="11" ry="5.5" fill="#b0bec5" stroke="#90a4ae" strokeWidth="1" />
      <ellipse cx="52.5" cy="125" rx="11" ry="5.5" fill="#b0bec5" stroke="#90a4ae" strokeWidth="1" />

      {/* Joint dots */}
      <circle cx="9.5"  cy="67" r="3" fill="#1a9fe0" opacity="0.8" />
      <circle cx="72.5" cy="67" r="3" fill="#1a9fe0" opacity="0.8" />
      <circle cx="29.5" cy="108" r="3" fill="#78909c" opacity="0.7" />
      <circle cx="52.5" cy="108" r="3" fill="#78909c" opacity="0.7" />
    </g>
  )
}
