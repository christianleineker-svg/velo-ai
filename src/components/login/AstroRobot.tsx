'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
  animate as motionAnimate,
} from 'framer-motion'
import { ZZZParticles, MusicNotes, StarsBurst, BugEnemy } from './EventProps'

// ─── Types ────────────────────────────────────────────────────────────────────

type RobotState =
  | 'idle' | 'walking' | 'running' | 'waving' | 'jumping'
  | 'sleeping' | 'dancing' | 'scared' | 'excited' | 'falling'

type Expression = 'happy' | 'surprised' | 'sleepy' | 'excited' | 'scared' | 'wink'

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  white:    '#e8edf5',
  whiteDim: '#cfd8e8',
  blue:     '#1a9fe0',
  blueDk:   '#1278b5',
  glow:     '#00d4ff',
  visor:    '#04040f',
  led:      '#00e5ff',
  joint:    '#b0c4d8',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const slp = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

// ─── Component ────────────────────────────────────────────────────────────────

export default function AstroRobot() {
  // ── React state (for re-renders) ──
  const [expression,    setExpression]    = useState<Expression>('happy')
  const [direction,     setDirection]     = useState<1 | -1>(1)
  const [showZzz,       setShowZzz]       = useState(false)
  const [showNotes,     setShowNotes]     = useState(false)
  const [showStars,     setShowStars]     = useState(false)
  const [showBug,       setShowBug]       = useState(false)
  const [isJumping,     setIsJumping]     = useState(false)

  // ── Framer Motion physics ──
  const posX       = useMotionValue(0)
  const springX    = useSpring(posX,  { stiffness: 72, damping: 16, mass: 1.4 })

  const sqX        = useMotionValue(1)   // squash x
  const sqY        = useMotionValue(1)   // squash y
  const sprSqX     = useSpring(sqX, { stiffness: 280, damping: 18 })
  const sprSqY     = useSpring(sqY, { stiffness: 280, damping: 18 })

  const liftY      = useMotionValue(0)   // vertical lift (jump)
  const sprLiftY   = useSpring(liftY, { stiffness: 320, damping: 22, mass: 0.9 })

  // ── Animation controls (stable across renders) ──
  const bodyCtrl     = useAnimation()
  const headCtrl     = useAnimation()
  const lArmCtrl     = useAnimation()
  const rArmCtrl     = useAnimation()
  const lLegCtrl     = useAnimation()
  const rLegCtrl     = useAnimation()

  // ── Mutable refs (no re-render needed) ──
  const mountedRef   = useRef(true)
  const stateRef     = useRef<RobotState>('idle')
  const dirRef       = useRef<1 | -1>(1)
  const posXRef      = useRef(0)
  const walkingRef   = useRef(false)

  // ── Init position ──
  useEffect(() => {
    const startX = typeof window !== 'undefined' ? window.innerWidth * 0.08 : 80
    posX.set(startX)
    posXRef.current = startX
  }, [posX])

  // ══════════════════════════════════════════════════════════════════════════
  // IDLE BREATHING — micro-movements so character is never static
  // ══════════════════════════════════════════════════════════════════════════
  const startBreathing = useCallback(() => {
    bodyCtrl.start({
      y: [0, -3, 0],
      transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
    })
    headCtrl.start({
      rotate: [-0.8, 0.8, -0.8],
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
    })
  }, [bodyCtrl, headCtrl])

  // ══════════════════════════════════════════════════════════════════════════
  // WALK CYCLE — full alternating legs + arms + body bob
  // ══════════════════════════════════════════════════════════════════════════
  const startWalkCycle = useCallback(() => {
    walkingRef.current = true
    const run = async () => {
      while (walkingRef.current && mountedRef.current) {
        // — Step A —
        lLegCtrl.start({ rotate: -22, transition: { duration: 0.32, ease: 'easeInOut' } })
        rLegCtrl.start({ rotate:  18, transition: { duration: 0.32, ease: 'easeInOut' } })
        lArmCtrl.start({ rotate:  18, transition: { duration: 0.32, ease: 'easeInOut' } })
        rArmCtrl.start({ rotate: -18, transition: { duration: 0.32, ease: 'easeInOut' } })
        bodyCtrl.start({ y: -4, scaleY: 1.04, transition: { duration: 0.16 } })
        await slp(160)
        bodyCtrl.start({ y:  0, scaleY: 1,    transition: { duration: 0.16 } })
        await slp(170)
        if (!walkingRef.current) break
        // — Step B —
        lLegCtrl.start({ rotate:  18, transition: { duration: 0.32, ease: 'easeInOut' } })
        rLegCtrl.start({ rotate: -22, transition: { duration: 0.32, ease: 'easeInOut' } })
        lArmCtrl.start({ rotate: -18, transition: { duration: 0.32, ease: 'easeInOut' } })
        rArmCtrl.start({ rotate:  18, transition: { duration: 0.32, ease: 'easeInOut' } })
        bodyCtrl.start({ y: -4, scaleY: 1.04, transition: { duration: 0.16 } })
        await slp(160)
        bodyCtrl.start({ y:  0, scaleY: 1,    transition: { duration: 0.16 } })
        await slp(170)
      }
      // Reset parts
      lLegCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      rLegCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      lArmCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      rArmCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
    }
    run()
  }, [bodyCtrl, lLegCtrl, rLegCtrl, lArmCtrl, rArmCtrl])

  const stopWalkCycle = useCallback(() => {
    walkingRef.current = false
  }, [])

  // ══════════════════════════════════════════════════════════════════════════
  // MOVE TO — spring physics with inertia, direction twist, lean & stop squash
  // ══════════════════════════════════════════════════════════════════════════
  const moveTo = useCallback(async (targetX: number, durationMs: number) => {
    if (!mountedRef.current) return

    const newDir: 1 | -1 = targetX >= posXRef.current ? 1 : -1

    // Direction change: body twists before feet follow
    if (newDir !== dirRef.current) {
      dirRef.current = newDir
      setDirection(newDir)
      sqX.set(0.82)
      sqY.set(1.14)
      await slp(160)
      sqX.set(1)
      sqY.set(1)
    }

    // Lean forward
    headCtrl.start({ rotate: newDir * 4, transition: { duration: 0.25 } })

    // Move with spring (using imperative animate so spring follows)
    await motionAnimate(posX, targetX, {
      duration: durationMs / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => { posXRef.current = v },
    })

    if (!mountedRef.current) return

    // Land / stop: squash then spring back
    sqX.set(1.14)
    sqY.set(0.88)
    headCtrl.start({ rotate: 0, transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] } })
    await slp(110)
    sqX.set(1)
    sqY.set(1)
  }, [posX, sqX, sqY, headCtrl])

  // ══════════════════════════════════════════════════════════════════════════
  // EVENTS
  // ══════════════════════════════════════════════════════════════════════════

  /* WALK */
  const doWalk = useCallback(async () => {
    if (!mountedRef.current) return
    stateRef.current = 'walking'
    setExpression('happy')
    bodyCtrl.stop()
    headCtrl.stop()
    startWalkCycle()

    const W = typeof window !== 'undefined' ? window.innerWidth : 1200
    const margin = 140
    const target = dirRef.current === 1
      ? Math.min(W - margin, posXRef.current + 180 + Math.random() * 240)
      : Math.max(margin, posXRef.current - 180 - Math.random() * 240)

    const dist = Math.abs(target - posXRef.current)
    const dur  = Math.max(2000, Math.min(7000, (dist / 110) * 1000))

    await moveTo(target, dur)
    stopWalkCycle()
    await slp(150)
    stateRef.current = 'idle'
  }, [bodyCtrl, headCtrl, startWalkCycle, stopWalkCycle, moveTo])

  /* WAVE — arm raises with backOut spring */
  const doWave = useCallback(async () => {
    if (!mountedRef.current) return
    stateRef.current = 'waving'
    setExpression('happy')

    await rArmCtrl.start({ rotate: -80, transition: { duration: 0.38, ease: [0.34, 1.56, 0.64, 1] } })
    for (let i = 0; i < 3; i++) {
      await rArmCtrl.start({ rotate: -55, transition: { duration: 0.16, ease: 'easeOut' } })
      await rArmCtrl.start({ rotate: -82, transition: { duration: 0.16, ease: 'easeIn' } })
    }
    await rArmCtrl.start({ rotate: 0, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } })

    stateRef.current = 'idle'
  }, [rArmCtrl])

  /* JUMP — full squash & stretch cycle ×3 */
  const doJump = useCallback(async () => {
    if (!mountedRef.current) return
    stateRef.current = 'jumping'
    setExpression('excited')
    bodyCtrl.stop()

    for (let i = 0; i < 3; i++) {
      // Crouch (squash)
      sqX.set(1.22); sqY.set(0.80); liftY.set(6)
      lLegCtrl.start({ rotate:  15, transition: { duration: 0.12 } })
      rLegCtrl.start({ rotate: -15, transition: { duration: 0.12 } })
      await slp(130)

      // Stretch up
      sqX.set(0.82); sqY.set(1.28)
      setIsJumping(true)
      motionAnimate(liftY, -70, { duration: 0.3, ease: 'easeOut' })
      lArmCtrl.start({ rotate: -55, transition: { duration: 0.3 } })
      rArmCtrl.start({ rotate: -55, transition: { duration: 0.3 } })
      lLegCtrl.start({ rotate: -10, transition: { duration: 0.3 } })
      rLegCtrl.start({ rotate:  10, transition: { duration: 0.3 } })
      await slp(310)

      // Fall
      sqX.set(1); sqY.set(1)
      motionAnimate(liftY, 0, { duration: 0.24, ease: [0.23, 1, 0.32, 1] })
      lArmCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      rArmCtrl.start({ rotate: 0, transition: { duration: 0.2 } })
      await slp(250)

      // Land squash
      setIsJumping(false)
      sqX.set(1.18); sqY.set(0.82)
      lLegCtrl.start({ rotate: 0, transition: { duration: 0.15 } })
      rLegCtrl.start({ rotate: 0, transition: { duration: 0.15 } })
      await slp(100)
      sqX.set(1); sqY.set(1)
      await slp(420)
    }

    setExpression('happy')
    stateRef.current = 'idle'
  }, [bodyCtrl, sqX, sqY, liftY, lArmCtrl, rArmCtrl, lLegCtrl, rLegCtrl])

  /* SLEEP — sit down, ZZZ, wake startled */
  const doSleep = useCallback(async () => {
    if (!mountedRef.current) return
    stateRef.current = 'sleeping'
    setExpression('sleepy')
    bodyCtrl.stop()

    await bodyCtrl.start({ y: 20, scaleY: 0.84, transition: { duration: 0.55, ease: 'easeOut' } })
    await headCtrl.start({ rotate: 16, transition: { duration: 0.5 } })
    setShowZzz(true)
    await slp(5600)

    setShowZzz(false)
    setExpression('surprised')
    await bodyCtrl.start({
      y: [20, -18, 0], scaleY: [0.84, 1.12, 1],
      transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
    })
    await headCtrl.start({ rotate: 0, transition: { duration: 0.3 } })
    await slp(500)
    setExpression('happy')
    stateRef.current = 'idle'
  }, [bodyCtrl, headCtrl])

  /* DANCE — side sway with arms + legs + notes */
  const doDance = useCallback(async () => {
    if (!mountedRef.current) return
    stateRef.current = 'dancing'
    setExpression('excited')
    setShowNotes(true)
    bodyCtrl.stop()

    for (let i = 0; i < 7; i++) {
      const s = i % 2 === 0 ? 1 : -1
      bodyCtrl.start({ rotate: s * 16, y: -9, transition: { duration: 0.38, ease: 'easeInOut' } })
      lArmCtrl.start({ rotate: s * -45, transition: { duration: 0.38, ease: 'easeInOut' } })
      rArmCtrl.start({ rotate: s *  45, transition: { duration: 0.38, ease: 'easeInOut' } })
      lLegCtrl.start({ rotate: s *  14, transition: { duration: 0.38, ease: 'easeInOut' } })
      rLegCtrl.start({ rotate: s * -14, transition: { duration: 0.38, ease: 'easeInOut' } })
      await slp(380)
    }
    await Promise.all([
      bodyCtrl.start({ rotate: 0, y: 0, transition: { duration: 0.28 } }),
      lArmCtrl.start({ rotate: 0, transition: { duration: 0.28 } }),
      rArmCtrl.start({ rotate: 0, transition: { duration: 0.28 } }),
      lLegCtrl.start({ rotate: 0, transition: { duration: 0.28 } }),
      rLegCtrl.start({ rotate: 0, transition: { duration: 0.28 } }),
    ])
    setShowNotes(false)
    setExpression('happy')
    stateRef.current = 'idle'
  }, [bodyCtrl, lArmCtrl, rArmCtrl, lLegCtrl, rLegCtrl])

  /* SCARED — shake + run away fast */
  const doScared = useCallback(async () => {
    if (!mountedRef.current) return
    stateRef.current = 'scared'
    setExpression('scared')
    setShowBug(true)
    bodyCtrl.stop()

    // Shiver in place
    for (let i = 0; i < 7; i++) {
      await bodyCtrl.start({ x: i % 2 === 0 ? 6 : -6, transition: { duration: 0.07 } })
    }
    await bodyCtrl.start({ x: 0, transition: { duration: 0.1 } })
    await slp(300)

    setShowBug(false)
    // Sprint away
    stateRef.current = 'running'
    startWalkCycle()
    const W  = typeof window !== 'undefined' ? window.innerWidth : 1200
    const ex = dirRef.current === 1
      ? Math.min(W - 140, posXRef.current + 380)
      : Math.max(140, posXRef.current - 380)
    await moveTo(ex, 1600)
    stopWalkCycle()
    setExpression('happy')
    stateRef.current = 'idle'
  }, [bodyCtrl, startWalkCycle, stopWalkCycle, moveTo])

  /* TRIP — stumble, fall, shake head, get up */
  const doTrip = useCallback(async () => {
    if (!mountedRef.current) return
    stateRef.current = 'falling'
    setExpression('surprised')
    bodyCtrl.stop()

    // Stumble
    headCtrl.start({ rotate: -12, transition: { duration: 0.14 } })
    sqX.set(1.06)
    await slp(160)

    // Fall
    await bodyCtrl.start({
      rotate: dirRef.current * 84, y: 26,
      transition: { duration: 0.38, ease: 'easeIn' },
    })
    sqX.set(1)
    setShowStars(true)
    headCtrl.start({ rotate: 0, transition: { duration: 0.1 } })
    await slp(1800)

    setShowStars(false)

    // Get up with wobbly bounce
    await bodyCtrl.start({
      rotate: [dirRef.current * 84, dirRef.current * -12, dirRef.current * 5, 0],
      y: [26, -12, 3, 0],
      transition: { duration: 0.65, ease: [0.34, 1.56, 0.64, 1] },
    })
    setExpression('happy')
    stateRef.current = 'idle'
  }, [bodyCtrl, headCtrl, sqX])

  /* LOOK AT CAMERA — wink + head bounce */
  const doLookAtCamera = useCallback(async () => {
    if (!mountedRef.current) return
    stateRef.current = 'excited'
    setExpression('wink')

    await headCtrl.start({
      scale: 1.12, rotate: -4,
      transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
    })
    await slp(2200)
    await headCtrl.start({ scale: 1, rotate: 0, transition: { duration: 0.3 } })
    setExpression('happy')
    stateRef.current = 'idle'
  }, [headCtrl])

  /* EXCITED HOPS — repeated jump-in-place */
  const doExcited = useCallback(async () => {
    if (!mountedRef.current) return
    stateRef.current = 'excited'
    setExpression('excited')
    bodyCtrl.stop()

    for (let i = 0; i < 5; i++) {
      sqX.set(0.88); sqY.set(1.18)
      motionAnimate(liftY, -20, { duration: 0.2, ease: 'easeOut' })
      await slp(210)
      sqX.set(1.14); sqY.set(0.88)
      motionAnimate(liftY,   0, { duration: 0.16, ease: 'easeIn' })
      await slp(170)
      sqX.set(1); sqY.set(1)
      await slp(100)
    }

    setExpression('happy')
    stateRef.current = 'idle'
  }, [bodyCtrl, sqX, sqY, liftY])

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT TABLE + LOOP
  // ══════════════════════════════════════════════════════════════════════════

  const eventFnsRef = useRef({
    doWalk, doWave, doJump, doSleep, doDance,
    doScared, doTrip, doLookAtCamera, doExcited,
  })
  // Keep ref current every render
  useEffect(() => {
    eventFnsRef.current = {
      doWalk, doWave, doJump, doSleep, doDance,
      doScared, doTrip, doLookAtCamera, doExcited,
    }
  })

  useEffect(() => {
    mountedRef.current = true

    const EVENTS = [
      { weight: 38, key: 'doWalk'         },
      { weight: 22, key: 'doWalk'         }, // walk twice as likely
      { weight: 12, key: 'doWave'         },
      { weight: 6,  key: 'doJump'         },
      { weight: 5,  key: 'doSleep'        },
      { weight: 5,  key: 'doDance'        },
      { weight: 4,  key: 'doScared'       },
      { weight: 4,  key: 'doTrip'         },
      { weight: 3,  key: 'doLookAtCamera' },
      { weight: 3,  key: 'doExcited'      },
    ] as const

    const pick = () => {
      const total = EVENTS.reduce((s, e) => s + e.weight, 0)
      let r = Math.random() * total
      for (const e of EVENTS) {
        r -= e.weight
        if (r <= 0) return e.key
      }
      return 'doWalk' as const
    }

    const loop = async () => {
      startBreathing()
      await slp(1200)
      while (mountedRef.current) {
        const key = pick()
        await (eventFnsRef.current[key] as () => Promise<void>)()
        if (!mountedRef.current) break
        stateRef.current = 'idle'
        startBreathing()
        await slp(2800 + Math.random() * 4800)
      }
    }

    loop()

    return () => {
      mountedRef.current = false
      walkingRef.current = false
    }
  }, [startBreathing]) // startBreathing is stable (useCallback with stable deps)

  // ══════════════════════════════════════════════════════════════════════════
  // EYE RENDERER
  // ══════════════════════════════════════════════════════════════════════════

  const eyeBase: React.CSSProperties = {
    background: C.led,
    boxShadow: `0 0 7px ${C.led}, 0 0 14px ${C.led}88`,
    borderRadius: 4,
  }

  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            <motion.div style={{ ...eyeBase, width: 16, height: 16 }}
              animate={{ scaleY: [1, 1, 1, 0.08, 1] }}
              transition={{ duration: 0.22, repeat: Infinity, repeatDelay: 3.8 }}
            />
            <motion.div style={{ ...eyeBase, width: 16, height: 16 }}
              animate={{ scaleY: [1, 1, 1, 0.08, 1] }}
              transition={{ duration: 0.22, repeat: Infinity, repeatDelay: 4.4, delay: 0.07 }}
            />
          </>
        )
      case 'surprised':
        return (
          <>
            <motion.div style={{ ...eyeBase, width: 21, height: 21, borderRadius: '50%' }}
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 0.38, repeat: Infinity }}
            />
            <motion.div style={{ ...eyeBase, width: 21, height: 21, borderRadius: '50%' }}
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 0.38, repeat: Infinity, delay: 0.1 }}
            />
          </>
        )
      case 'sleepy':
        return (
          <>
            <div style={{ ...eyeBase, width: 16, height: 4, borderRadius: 2 }} />
            <div style={{ ...eyeBase, width: 16, height: 4, borderRadius: 2 }} />
          </>
        )
      case 'excited':
        return (
          <>
            <motion.div style={{
              ...eyeBase, width: 17, height: 17,
              clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
            }}
              animate={{ rotate: 360 }} transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div style={{
              ...eyeBase, width: 17, height: 17,
              clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
            }}
              animate={{ rotate: -360 }} transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )
      case 'scared':
        return (
          <>
            <motion.div style={{ ...eyeBase, width: 19, height: 19, borderRadius: '50%' }}
              animate={{ x: [-2, 2] }} transition={{ duration: 0.08, repeat: Infinity, repeatType: 'mirror' }}
            />
            <motion.div style={{ ...eyeBase, width: 19, height: 19, borderRadius: '50%' }}
              animate={{ x: [2, -2] }} transition={{ duration: 0.08, repeat: Infinity, repeatType: 'mirror' }}
            />
          </>
        )
      case 'wink':
        return (
          <>
            <div style={{ ...eyeBase, width: 16, height: 3, borderRadius: 2 }} />
            <motion.div style={{ ...eyeBase, width: 18, height: 18, borderRadius: '50%' }}
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 0.5, repeat: 4 }}
            />
          </>
        )
      default:
        return (
          <>
            <div style={{ ...eyeBase, width: 16, height: 16 }} />
            <div style={{ ...eyeBase, width: 16, height: 16 }} />
          </>
        )
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════

  const ARM: React.CSSProperties = {
    width: 13, height: 34,
    background: `linear-gradient(180deg, ${C.white} 0%, ${C.whiteDim} 100%)`,
    borderRadius: 7,
    boxShadow: `0 3px 10px rgba(0,0,0,0.28), 0 0 0 1.5px ${C.joint}`,
  }
  const HAND: React.CSSProperties = {
    width: 17, height: 17, borderRadius: '50%',
    background: C.white, marginTop: -2,
    boxShadow: `0 2px 8px rgba(0,0,0,0.25), 0 0 0 2px ${C.joint}`,
  }
  const LEG: React.CSSProperties = {
    width: 17, height: 26,
    background: `linear-gradient(180deg, ${C.blue} 0%, ${C.blueDk} 100%)`,
    borderRadius: 8,
    boxShadow: `0 3px 10px rgba(0,0,0,0.32), 0 0 0 1.5px ${C.blueDk}`,
  }
  const FOOT: React.CSSProperties = {
    width: 24, height: 11, borderRadius: 6,
    background: `linear-gradient(180deg, ${C.blue} 0%, ${C.blueDk} 100%)`,
    marginTop: -2, marginLeft: -4,
    boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
  }

  return (
    <>
      {/* Bug enemy overlay (outside robot wrapper) */}
      {showBug && <BugEnemy startLeft={dirRef.current === 1} />}

      {/* Main robot anchor — horizontal spring position */}
      <motion.div
        style={{
          position: 'fixed',
          bottom: 32,
          left: 0,
          x: springX,
          y: sprLiftY,
          zIndex: 10,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {/* Ground shadow — shrinks when jumping */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: -8,
            left: 5,
            width: 78,
            height: 14,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(0,180,255,0.28) 0%, transparent 70%)`,
          }}
          animate={{
            scaleX: isJumping ? 0.45 : 1,
            opacity: isJumping ? 0.25 : 0.9,
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Direction flip wrapper */}
        <motion.div style={{ scaleX: direction }}>

          {/* Squash & stretch physics wrapper */}
          <motion.div
            style={{
              scaleX: sprSqX,
              scaleY: sprSqY,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Particle overlays */}
            <div style={{ position: 'relative', width: 0, height: 0 }}>
              {showZzz   && <ZZZParticles />}
              {showNotes && <MusicNotes />}
              {showStars && <StarsBurst />}
            </div>

            {/* ── ANTENNA ── */}
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 3, height: 22, background: C.blue, borderRadius: 2, position: 'relative', marginBottom: -3, zIndex: 2 }}
            >
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.55, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{
                  width: 11, height: 11, borderRadius: '50%',
                  background: C.glow,
                  position: 'absolute', top: -5.5, left: -4,
                  boxShadow: `0 0 8px ${C.glow}, 0 0 18px ${C.glow}`,
                }}
              />
            </motion.div>

            {/* ── HEAD ── */}
            <motion.div
              animate={headCtrl}
              style={{
                width: 74, height: 64,
                background: `linear-gradient(140deg, ${C.white} 0%, ${C.whiteDim} 100%)`,
                borderRadius: 22,
                position: 'relative',
                boxShadow: `0 5px 16px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.85), 0 0 0 2px ${C.joint}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}
            >
              {/* Left ear */}
              <div style={{
                width: 11, height: 19, background: C.blue, borderRadius: 6,
                position: 'absolute', top: 22, left: -9,
                boxShadow: `0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 ${C.glow}44`,
              }} />
              {/* Right ear */}
              <div style={{
                width: 11, height: 19, background: C.blue, borderRadius: 6,
                position: 'absolute', top: 22, right: -9,
                boxShadow: `0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 ${C.glow}44`,
              }} />

              {/* Visor */}
              <div style={{
                width: 56, height: 44,
                background: C.visor,
                borderRadius: 13,
                border: `2px solid ${C.blue}`,
                boxShadow: `0 0 12px ${C.glow}44, inset 0 0 18px rgba(0,180,255,0.08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
                overflow: 'hidden', position: 'relative',
              }}>
                {/* Visor shine */}
                <div style={{
                  position: 'absolute', top: 5, left: 7,
                  width: 16, height: 6, borderRadius: 3,
                  background: 'rgba(255,255,255,0.11)',
                }} />
                {renderEyes()}
              </div>
            </motion.div>

            {/* ── NECK ── */}
            <div style={{
              width: 23, height: 8,
              background: C.joint,
              borderRadius: 4,
              marginTop: -1,
              boxShadow: '0 2px 5px rgba(0,0,0,0.22)',
            }} />

            {/* ── BODY ── */}
            <motion.div
              animate={bodyCtrl}
              style={{
                width: 78, height: 60,
                background: `linear-gradient(140deg, ${C.white} 0%, ${C.whiteDim} 55%, ${C.joint} 100%)`,
                borderRadius: 24,
                position: 'relative',
                boxShadow: `0 7px 22px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.92), 0 0 0 2px ${C.joint}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {/* Body highlight */}
              <div style={{
                position: 'absolute', top: 7, left: 9,
                width: 22, height: 8, borderRadius: 4,
                background: 'rgba(255,255,255,0.48)',
              }} />

              {/* Chest emblem */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `radial-gradient(circle, ${C.blue} 0%, ${C.blueDk} 100%)`,
                boxShadow: `0 0 12px ${C.glow}66, 0 2px 8px rgba(0,0,0,0.3)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: 'white', fontWeight: 'bold',
              }}>⚡</div>

              {/* ── LEFT ARM ── */}
              <motion.div
                animate={lArmCtrl}
                style={{ position: 'absolute', left: -19, top: 3, transformOrigin: 'top center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={ARM} />
                <div style={HAND} />
              </motion.div>

              {/* ── RIGHT ARM ── */}
              <motion.div
                animate={rArmCtrl}
                style={{ position: 'absolute', right: -19, top: 3, transformOrigin: 'top center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={ARM} />
                <div style={HAND} />
              </motion.div>
            </motion.div>

            {/* ── LEGS ── */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <motion.div
                animate={lLegCtrl}
                style={{ transformOrigin: 'top center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={LEG} />
                <div style={FOOT} />
              </motion.div>
              <motion.div
                animate={rLegCtrl}
                style={{ transformOrigin: 'top center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={LEG} />
                <div style={FOOT} />
              </motion.div>
            </div>

          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}
