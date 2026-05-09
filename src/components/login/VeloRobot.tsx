'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  useAnimation,
  animate,
} from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'

type Expression = 'happy' | 'surprised' | 'sleepy' | 'excited' | 'scared' | 'wink'
type RobotState = 'walking' | 'idle' | 'waving' | 'jumping' | 'sleeping' | 'dancing' | 'scared' | 'falling'

const MODAL_W = 360
const MODAL_H = 480

function getModalRect() {
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  return {
    left: cx - MODAL_W / 2,
    right: cx + MODAL_W / 2,
    top: cy - MODAL_H / 2,
    bottom: cy + MODAL_H / 2,
  }
}

export default function VeloRobot() {
  const mountedRef = useRef(false)
  const [expression, setExpression] = useState<Expression>('happy')
  const [robotState, setRobotState] = useState<RobotState>('idle')
  const [facingRight, setFacingRight] = useState(true)
  const [showZZZ, setShowZZZ] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showStars, setShowStars] = useState(false)
  const [opacity, setOpacity] = useState(1)

  const posX = useMotionValue(100)
  const posY = useMotionValue(300)

  const springX = useSpring(posX, { stiffness: 60, damping: 15, mass: 2.5 })
  const springY = useSpring(posY, { stiffness: 60, damping: 15, mass: 2.5 })

  const velX = useVelocity(springX)
  const autoTilt = useTransform(velX, [-300, 0, 300], [12, 0, -12])
  const springTilt = useSpring(autoTilt, { stiffness: 150, damping: 25 })

  const scaleXVal = useMotionValue(1)
  const scaleYVal = useMotionValue(1)
  const springSX = useSpring(scaleXVal, { stiffness: 400, damping: 25 })
  const springSY = useSpring(scaleYVal, { stiffness: 400, damping: 25 })

  const bodyAnim = useAnimation()
  const headAnim = useAnimation()
  const leftArmAnim = useAnimation()
  const rightArmAnim = useAnimation()
  const leftLegAnim = useAnimation()
  const rightLegAnim = useAnimation()

  const currentPos = useRef({ x: 100, y: 300 })
  const stateRef = useRef<RobotState>('idle')
  const isRunning = useRef(false)
  const facingRef = useRef(true)

  const getWaypoint = useCallback(() => {
    const margin = 80
    const w = window.innerWidth
    const h = window.innerHeight
    const modal = getModalRect()

    let x = 0, y = 0, tries = 0
    do {
      x = margin + Math.random() * (w - margin * 2)
      y = margin + Math.random() * (h - margin * 2)
      tries++
    } while (
      tries < 30 &&
      x > modal.left - 60 && x < modal.right + 60 &&
      y > modal.top - 60 && y < modal.bottom + 60
    )
    return { x, y }
  }, [])

  const doIdleMicro = useCallback(() => {
    bodyAnim.start({
      y: [0, -3, 0],
      transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
    })
    headAnim.start({
      rotate: [-1.5, 1.5, -1.5],
      transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
    })
  }, [bodyAnim, headAnim])

  const doWalkCycle = useCallback(() => {
    let running = true
    const cycle = async () => {
      while (running && stateRef.current === 'walking') {
        leftLegAnim.start({ rotate: -18, transition: { duration: 0.35, ease: 'easeInOut' } })
        rightLegAnim.start({ rotate: 18, transition: { duration: 0.35, ease: 'easeInOut' } })
        leftArmAnim.start({ rotate: 15, transition: { duration: 0.35, ease: 'easeInOut' } })
        rightArmAnim.start({ rotate: -15, transition: { duration: 0.35, ease: 'easeInOut' } })
        bodyAnim.start({ y: [0, -3, 0], transition: { duration: 0.35 } })
        await new Promise(r => setTimeout(r, 350))

        if (!running || stateRef.current !== 'walking') break

        leftLegAnim.start({ rotate: 18, transition: { duration: 0.35, ease: 'easeInOut' } })
        rightLegAnim.start({ rotate: -18, transition: { duration: 0.35, ease: 'easeInOut' } })
        leftArmAnim.start({ rotate: -15, transition: { duration: 0.35, ease: 'easeInOut' } })
        rightArmAnim.start({ rotate: 15, transition: { duration: 0.35, ease: 'easeInOut' } })
        bodyAnim.start({ y: [0, -3, 0], transition: { duration: 0.35 } })
        await new Promise(r => setTimeout(r, 350))
      }
      // Reset limbs
      leftLegAnim.start({ rotate: 0, transition: { duration: 0.2 } })
      rightLegAnim.start({ rotate: 0, transition: { duration: 0.2 } })
      leftArmAnim.start({ rotate: 0, transition: { duration: 0.2 } })
      rightArmAnim.start({ rotate: 0, transition: { duration: 0.2 } })
    }
    cycle()
    return () => { running = false }
  }, [bodyAnim, leftLegAnim, rightLegAnim, leftArmAnim, rightArmAnim])

  const moveTo = useCallback(async (targetX: number, targetY: number) => {
    const dx = targetX - currentPos.current.x
    const dy = targetY - currentPos.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const duration = Math.max(1.5, dist / 120)

    const goRight = dx >= 0
    setFacingRight(goRight)
    facingRef.current = goRight
    stateRef.current = 'walking'
    setRobotState('walking')
    const stopWalk = doWalkCycle()

    scaleXVal.set(0.88)
    scaleYVal.set(1.12)
    setTimeout(() => { scaleXVal.set(1); scaleYVal.set(1) }, 150)

    await Promise.all([
      animate(posX, targetX, {
        duration,
        ease: 'linear',
        onUpdate: v => { currentPos.current.x = v },
      }),
      animate(posY, targetY, {
        duration,
        ease: 'linear',
        onUpdate: v => { currentPos.current.y = v },
      }),
    ])

    stopWalk()
    scaleXVal.set(1.12)
    scaleYVal.set(0.88)
    setTimeout(() => { scaleXVal.set(1); scaleYVal.set(1) }, 120)

    stateRef.current = 'idle'
    setRobotState('idle')
  }, [posX, posY, scaleXVal, scaleYVal, doWalkCycle])

  const doWrap = useCallback(async () => {
    const sides = ['left', 'right', 'top', 'bottom']
    const exitSide = sides[Math.floor(Math.random() * sides.length)]
    const w = window.innerWidth
    const h = window.innerHeight

    let exitX = currentPos.current.x
    let exitY = currentPos.current.y
    let enterX = currentPos.current.x
    let enterY = currentPos.current.y

    switch (exitSide) {
      case 'left':   exitX = -80; enterX = w + 80; enterY = exitY; break
      case 'right':  exitX = w + 80; enterX = -80; enterY = exitY; break
      case 'top':    exitY = -80; enterY = h + 80; enterX = exitX; break
      case 'bottom': exitY = h + 80; enterY = -80; enterX = exitX; break
    }

    const goRight = exitX > currentPos.current.x || exitSide === 'right'
    setFacingRight(goRight)
    facingRef.current = goRight
    stateRef.current = 'walking'
    setRobotState('walking')
    const stopWalk = doWalkCycle()

    await Promise.all([
      animate(posX, exitX, { duration: 1.5, ease: 'linear', onUpdate: v => { currentPos.current.x = v } }),
      animate(posY, exitY, { duration: 1.5, ease: 'linear', onUpdate: v => { currentPos.current.y = v } }),
    ])

    stopWalk()
    setOpacity(0)
    posX.set(enterX)
    posY.set(enterY)
    currentPos.current = { x: enterX, y: enterY }
    await new Promise(r => setTimeout(r, 80))
    setOpacity(1)

    stateRef.current = 'idle'
    setRobotState('idle')
  }, [posX, posY, doWalkCycle])

  const doWave = useCallback(async () => {
    stateRef.current = 'waving'
    setRobotState('waving')
    setExpression('happy')
    for (let i = 0; i < 3; i++) {
      await rightArmAnim.start({ rotate: -75, transition: { duration: 0.25, ease: 'backOut' } })
      await rightArmAnim.start({ rotate: -45, transition: { duration: 0.2 } })
    }
    await rightArmAnim.start({ rotate: 0, transition: { duration: 0.3, ease: 'backOut' } })
    stateRef.current = 'idle'
    setRobotState('idle')
  }, [rightArmAnim])

  const doJump = useCallback(async () => {
    stateRef.current = 'jumping'
    setRobotState('jumping')
    setExpression('excited')
    for (let i = 0; i < 2; i++) {
      scaleXVal.set(1.15); scaleYVal.set(0.85)
      await new Promise(r => setTimeout(r, 80))
      scaleXVal.set(0.88); scaleYVal.set(1.2)
      const startY = currentPos.current.y
      await animate(posY, startY - 50, {
        duration: 0.3,
        ease: 'easeOut',
        onUpdate: v => { currentPos.current.y = v },
      })
      await animate(posY, startY, {
        duration: 0.25,
        ease: 'easeIn',
        onUpdate: v => { currentPos.current.y = v },
      })
      scaleXVal.set(1.15); scaleYVal.set(0.85)
      await new Promise(r => setTimeout(r, 80))
      scaleXVal.set(1); scaleYVal.set(1)
      await new Promise(r => setTimeout(r, 200))
    }
    setExpression('happy')
    stateRef.current = 'idle'
    setRobotState('idle')
  }, [posY, scaleXVal, scaleYVal])

  const doSleep = useCallback(async () => {
    stateRef.current = 'sleeping'
    setRobotState('sleeping')
    setExpression('sleepy')
    setShowZZZ(true)
    await bodyAnim.start({ y: 12, scaleY: 0.88, transition: { duration: 0.6, ease: 'easeOut' } })
    await headAnim.start({ rotate: 12, transition: { duration: 0.5 } })
    await new Promise(r => setTimeout(r, 4000))
    setShowZZZ(false)
    setExpression('surprised')
    await bodyAnim.start({ y: [12, -8, 0], scaleY: [0.88, 1.1, 1], transition: { duration: 0.4 } })
    await headAnim.start({ rotate: [-5, 3, 0], transition: { duration: 0.3 } })
    stateRef.current = 'idle'
    setRobotState('idle')
    setExpression('happy')
  }, [bodyAnim, headAnim])

  const doDance = useCallback(async () => {
    stateRef.current = 'dancing'
    setRobotState('dancing')
    setExpression('excited')
    setShowNotes(true)
    for (let i = 0; i < 6; i++) {
      await bodyAnim.start({ rotate: 10, scaleX: 1.05, transition: { duration: 0.2 } })
      leftArmAnim.start({ rotate: -40, transition: { duration: 0.2 } })
      rightArmAnim.start({ rotate: 40, transition: { duration: 0.2 } })
      await bodyAnim.start({ rotate: -10, scaleX: 0.95, transition: { duration: 0.2 } })
      leftArmAnim.start({ rotate: 20, transition: { duration: 0.2 } })
      rightArmAnim.start({ rotate: -20, transition: { duration: 0.2 } })
    }
    await Promise.all([
      bodyAnim.start({ rotate: 0, scaleX: 1, transition: { duration: 0.3 } }),
      leftArmAnim.start({ rotate: 0, transition: { duration: 0.3 } }),
      rightArmAnim.start({ rotate: 0, transition: { duration: 0.3 } }),
    ])
    setShowNotes(false)
    setExpression('happy')
    stateRef.current = 'idle'
    setRobotState('idle')
  }, [bodyAnim, leftArmAnim, rightArmAnim])

  const doTrip = useCallback(async () => {
    stateRef.current = 'falling'
    setRobotState('falling')
    setExpression('surprised')
    setShowStars(true)
    await bodyAnim.start({
      rotate: facingRef.current ? 80 : -80,
      y: 20,
      transition: { duration: 0.25, ease: 'easeIn' },
    })
    await new Promise(r => setTimeout(r, 1200))
    setShowStars(false)
    await bodyAnim.start({
      rotate: [facingRef.current ? 80 : -80, facingRef.current ? -8 : 8, 0],
      y: [20, -8, 0],
      transition: { duration: 0.5, ease: 'backOut' },
    })
    setExpression('happy')
    stateRef.current = 'idle'
    setRobotState('idle')
  }, [bodyAnim])

  // Main loop — runs once on mount (client-only, no SSR concern due to 'use client')
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    isRunning.current = true

    const startX = 100
    const startY = window.innerHeight * 0.65
    posX.set(startX)
    posY.set(startY)
    currentPos.current = { x: startX, y: startY }

    doIdleMicro()

    const EVENTS = [
      { weight: 48, fn: async () => { const wp = getWaypoint(); await moveTo(wp.x, wp.y) } },
      { weight: 14, fn: async () => { const wp = getWaypoint(); await moveTo(wp.x, wp.y); await doWave() } },
      { weight: 9, fn: doWave },
      { weight: 5, fn: doJump },
      { weight: 5, fn: doSleep },
      { weight: 5, fn: doDance },
      { weight: 5, fn: doTrip },
      { weight: 9, fn: doWrap },
    ]

    const pick = () => {
      const total = EVENTS.reduce((s, e) => s + e.weight, 0)
      let r = Math.random() * total
      for (const e of EVENTS) { r -= e.weight; if (r <= 0) return e }
      return EVENTS[0]
    }

    const loop = async () => {
      while (isRunning.current) {
        if (stateRef.current === 'idle') {
          const event = pick()
          await event.fn()
          stateRef.current = 'idle'
          setRobotState('idle')
          doIdleMicro()
        }
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 2500))
      }
    }

    const t = setTimeout(() => loop(), 1000)
    return () => {
      isRunning.current = false
      clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderEyes = () => {
    const base: React.CSSProperties = {
      width: 11,
      height: 11,
      borderRadius: 3,
      background: 'radial-gradient(circle at 40% 35%, #ddd6fe, #a78bfa 60%, #7c3aed)',
      boxShadow: '0 0 6px #a78bfa, 0 0 12px rgba(124,58,237,0.5)',
    }
    switch (expression) {
      case 'happy':
        return (
          <>
            <motion.div style={base}
              animate={{ scaleY: [1, 0.08, 1] }}
              transition={{ duration: 0.12, repeat: Infinity, repeatDelay: 3.5 }} />
            <motion.div style={base}
              animate={{ scaleY: [1, 0.08, 1] }}
              transition={{ duration: 0.12, repeat: Infinity, repeatDelay: 3.5, delay: 0.06 }} />
          </>
        )
      case 'surprised':
        return (
          <>
            <motion.div style={{ ...base, width: 14, height: 14, borderRadius: '50%' }}
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.4, repeat: Infinity }} />
            <motion.div style={{ ...base, width: 14, height: 14, borderRadius: '50%' }}
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.4, repeat: Infinity }} />
          </>
        )
      case 'sleepy':
        return (
          <>
            <div style={{ ...base, height: 3, borderRadius: 2 }} />
            <div style={{ ...base, height: 3, borderRadius: 2 }} />
          </>
        )
      case 'excited':
        return (
          <>
            <motion.div style={{ ...base, background: '#ffd700', boxShadow: '0 0 8px #ffd700' }}
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.3, repeat: Infinity }} />
            <motion.div style={{ ...base, background: '#ffd700', boxShadow: '0 0 8px #ffd700' }}
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }} />
          </>
        )
      case 'scared':
        return (
          <>
            <motion.div style={{ ...base, width: 14, height: 14 }}
              animate={{ x: [-2, 2, -2] }} transition={{ duration: 0.08, repeat: Infinity }} />
            <motion.div style={{ ...base, width: 14, height: 14 }}
              animate={{ x: [2, -2, 2] }} transition={{ duration: 0.08, repeat: Infinity }} />
          </>
        )
      case 'wink':
        return (
          <>
            <div style={{ ...base, height: 2.5, borderRadius: 2 }} />
            <motion.div style={{ ...base, width: 14, height: 14 }}
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: 3 }} />
          </>
        )
    }
  }

  return (
    <motion.div
      style={{
        position: 'fixed',
        x: springX,
        y: springY,
        zIndex: 10,
        opacity,
        pointerEvents: 'none',
        translateX: '-50%',
        translateY: '-50%',
        filter: 'drop-shadow(0 8px 16px rgba(124,58,237,0.35))',
      }}
    >
      {/* Flip container for direction */}
      <motion.div
        animate={{ scaleX: facingRight ? 1 : -1 }}
        transition={{ duration: 0.15 }}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        {/* Body system with squash/stretch + tilt */}
        <motion.div
          animate={bodyAnim}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            scaleX: springSX,
            scaleY: springSY,
            rotateZ: springTilt,
          }}
        >
          {/* ZZZ */}
          {showZZZ && (
            <div style={{ position: 'absolute', top: -40, right: -8, pointerEvents: 'none' }}>
              {(['z', 'z', 'Z'] as const).map((z, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    color: '#a78bfa',
                    fontWeight: 700,
                    fontSize: 8 + i * 4,
                    right: i * 8,
                    top: i * -13,
                    fontFamily: 'monospace',
                  }}
                  animate={{ y: [-5, -28], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.8, delay: i * 0.5, repeat: Infinity }}
                >
                  {z}
                </motion.div>
              ))}
            </div>
          )}

          {/* Musical notes */}
          {showNotes && (['♪', '♫', '♩'] as const).map((n, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                color: '#ffd700',
                fontSize: 14,
                top: -18,
                left: i % 2 === 0 ? -20 : 20,
                pointerEvents: 'none',
              }}
              animate={{ y: -38, opacity: [0, 1, 0], rotate: [-8, 8] }}
              transition={{ duration: 1.2, delay: i * 0.35, repeat: Infinity }}
            >
              {n}
            </motion.div>
          ))}

          {/* Stars */}
          {showStars && (['⭐', '✨', '💫'] as const).map((s, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                fontSize: 12,
                top: -10,
                left: -10 + i * 13,
                pointerEvents: 'none',
              }}
              animate={{ rotate: 360, scale: [1, 1.4, 0] }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              {s}
            </motion.div>
          ))}

          {/* ANTENNA */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #ddd6fe, #a78bfa)',
                boxShadow: '0 0 6px #a78bfa, 0 0 14px #7c3aed',
              }}
              animate={{ scale: [1, 1.35, 1], opacity: [1, 0.65, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <div style={{
              width: 2, height: 16,
              background: 'linear-gradient(180deg, #a78bfa, #7c3aed)',
              borderRadius: 2,
              marginTop: -4,
            }} />
          </div>

          {/* HEAD */}
          <motion.div
            animate={headAnim}
            style={{
              width: 52, height: 46,
              background: 'linear-gradient(145deg, #f5f7ff 0%, #e8ecf8 35%, #c8d0e8 100%)',
              borderRadius: '18px 18px 14px 14px',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.08), 0 0 0 1.5px #b8c4d8',
              zIndex: 2,
            }}
          >
            {/* Head highlight */}
            <div style={{
              position: 'absolute', top: 6, left: 8, width: 36, height: 12,
              background: 'rgba(255,255,255,0.5)', borderRadius: '50%', filter: 'blur(3px)',
            }} />
            {/* Ears */}
            <div style={{
              position: 'absolute', top: 14, left: -5,
              width: 8, height: 16,
              background: 'linear-gradient(180deg, #d0d8f0, #b0b8d0)',
              borderRadius: 4,
              boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
            }} />
            <div style={{
              position: 'absolute', top: 14, right: -5,
              width: 8, height: 16,
              background: 'linear-gradient(180deg, #d0d8f0, #b0b8d0)',
              borderRadius: 4,
              boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
            }} />
            {/* Visor */}
            <div style={{
              position: 'absolute', top: 10, left: 8, width: 36, height: 28,
              background: 'radial-gradient(ellipse at 50% 40%, #0a0818, #060612)',
              borderRadius: 10,
              border: '1.5px solid #7c3aed',
              boxShadow: '0 0 8px rgba(124,58,237,0.6), inset 0 0 10px rgba(124,58,237,0.15), inset 0 1px 0 rgba(124,58,237,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
              overflow: 'hidden',
            }}>
              {/* Visor glare */}
              <div style={{
                position: 'absolute', top: 3, left: 5, width: 12, height: 5,
                background: 'rgba(255,255,255,0.12)', borderRadius: '50%', filter: 'blur(1px)',
              }} />
              {renderEyes()}
            </div>
          </motion.div>

          {/* NECK */}
          <div style={{
            width: 18, height: 6,
            background: 'linear-gradient(180deg, #c8d0e8, #b0b8cc)',
            borderRadius: 3,
            boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
            marginTop: -1,
          }} />

          {/* BODY */}
          <div style={{
            width: 58, height: 46,
            background: 'linear-gradient(145deg, #f0f4ff 0%, #dce4f8 40%, #b8c4d8 100%)',
            borderRadius: 20,
            position: 'relative',
            boxShadow: '0 5px 15px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,0,0,0.08), 0 0 0 1.5px #b8c4d8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'visible',
          }}>
            {/* Body highlight */}
            <div style={{
              position: 'absolute', top: 6, left: 10, width: 38, height: 10,
              background: 'rgba(255,255,255,0.45)', borderRadius: '50%', filter: 'blur(2px)',
            }} />

            {/* LEFT ARM — inside body, extends naturally */}
            <motion.div
              animate={leftArmAnim}
              style={{
                position: 'absolute', left: -18, top: 4,
                transformOrigin: 'top center',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              {/* Shoulder ball */}
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                background: 'linear-gradient(135deg, #e0e8f8, #c0c8e0)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.8)',
              }} />
              {/* Upper arm */}
              <div style={{
                width: 12, height: 18,
                background: 'linear-gradient(180deg, #d8e0f0, #b8c0d8)',
                borderRadius: 6, marginTop: -4,
                boxShadow: '0 3px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
              }} />
              {/* Hand */}
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #f0f4ff, #c8d0e8)',
                marginTop: -2,
                boxShadow: '0 3px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
              }} />
            </motion.div>

            {/* RIGHT ARM */}
            <motion.div
              animate={rightArmAnim}
              style={{
                position: 'absolute', right: -18, top: 4,
                transformOrigin: 'top center',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                background: 'linear-gradient(135deg, #e0e8f8, #c0c8e0)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.8)',
              }} />
              <div style={{
                width: 12, height: 18,
                background: 'linear-gradient(180deg, #d8e0f0, #b8c0d8)',
                borderRadius: 6, marginTop: -4,
                boxShadow: '0 3px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
              }} />
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #f0f4ff, #c8d0e8)',
                marginTop: -2,
                boxShadow: '0 3px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
              }} />
            </motion.div>

            {/* Chest emblem */}
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'radial-gradient(circle, #7c3aed, #5b21b6)',
              boxShadow: '0 0 8px rgba(124,58,237,0.7), 0 2px 6px rgba(0,0,0,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, zIndex: 2,
            }}>⚡</div>
          </div>

          {/* HIPS */}
          <div style={{
            width: 44, height: 8,
            background: 'linear-gradient(180deg, #7c3aed, #5b21b6)',
            borderRadius: 4, marginTop: -2,
            boxShadow: '0 2px 6px rgba(124,58,237,0.4)',
          }} />

          {/* LEGS */}
          <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
            {/* Left leg */}
            <motion.div
              animate={leftLegAnim}
              style={{ transformOrigin: 'top center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{
                width: 16, height: 16,
                background: 'linear-gradient(180deg, #7c3aed, #5b21b6)',
                borderRadius: '8px 8px 4px 4px',
                boxShadow: '0 3px 8px rgba(124,58,237,0.4)',
              }} />
              <div style={{
                width: 13, height: 14,
                background: 'linear-gradient(180deg, #d0d8f0, #b0b8d0)',
                borderRadius: 4, marginTop: -1,
                boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
              }} />
              <div style={{
                width: 18, height: 9,
                background: 'linear-gradient(180deg, #7c3aed, #5b21b6)',
                borderRadius: '5px 5px 4px 4px',
                marginTop: -1, marginLeft: -2,
                boxShadow: '0 3px 8px rgba(124,58,237,0.4)',
              }} />
            </motion.div>

            {/* Right leg */}
            <motion.div
              animate={rightLegAnim}
              style={{ transformOrigin: 'top center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{
                width: 16, height: 16,
                background: 'linear-gradient(180deg, #7c3aed, #5b21b6)',
                borderRadius: '8px 8px 4px 4px',
                boxShadow: '0 3px 8px rgba(124,58,237,0.4)',
              }} />
              <div style={{
                width: 13, height: 14,
                background: 'linear-gradient(180deg, #d0d8f0, #b0b8d0)',
                borderRadius: 4, marginTop: -1,
                boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
              }} />
              <div style={{
                width: 18, height: 9,
                background: 'linear-gradient(180deg, #7c3aed, #5b21b6)',
                borderRadius: '5px 5px 4px 4px',
                marginTop: -1, marginLeft: -2,
                boxShadow: '0 3px 8px rgba(124,58,237,0.4)',
              }} />
            </motion.div>
          </div>

          {/* Ground shadow */}
          <motion.div
            style={{
              width: 50, height: 8, borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(124,58,237,0.32) 0%, transparent 70%)',
              marginTop: 4,
            }}
            animate={{
              scaleX: robotState === 'jumping' ? 0.4 : 1,
              opacity: robotState === 'jumping' ? 0.2 : 0.85,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
