'use client'

import { motion } from 'framer-motion'

/* ── ZZZ ao dormir ─────────────────────────────────────────────────────────── */
export function ZZZParticles() {
  return (
    <div style={{ position: 'absolute', top: -10, right: -14, pointerEvents: 'none' }}>
      {([
        { char: 'Z', size: 9,  delay: 0,    x: 0  },
        { char: 'Z', size: 12, delay: 0.65, x: 8  },
        { char: 'Z', size: 15, delay: 1.3,  x: 18 },
      ] as const).map(({ char, size, delay, x }, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            right: x,
            top: 0,
            color: '#00d4ff',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: size,
            fontWeight: 'bold',
            textShadow: '0 0 6px #00d4ff',
            opacity: 0,
          }}
          animate={{ y: [0, -28], opacity: [0, 1, 1, 0], scale: [0.6, 1.1] }}
          transition={{ duration: 2, delay, repeat: Infinity, ease: 'easeOut' }}
        >
          {char}
        </motion.div>
      ))}
    </div>
  )
}

/* ── Notas musicais ao dançar ──────────────────────────────────────────────── */
export function MusicNotes() {
  const notes = [
    { char: '♪', color: '#ffd700', x: -24, delay: 0    },
    { char: '♫', color: '#ff88ff', x: 18,  delay: 0.5  },
    { char: '♩', color: '#ffd700', x: -10, delay: 1.0  },
    { char: '♬', color: '#ff88ff', x: 26,  delay: 1.5  },
  ]
  return (
    <>
      {notes.map(({ char, color, x, delay }, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            marginLeft: x,
            color,
            fontSize: 18,
            textShadow: `0 0 8px ${color}`,
            opacity: 0,
            pointerEvents: 'none',
          }}
          animate={{
            y: [0, -50],
            opacity: [0, 1, 1, 0],
            rotate: [i % 2 === 0 ? -12 : 12, i % 2 === 0 ? 12 : -12],
          }}
          transition={{ duration: 1.6, delay, repeat: Infinity, ease: 'easeOut' }}
        >
          {char}
        </motion.div>
      ))}
    </>
  )
}

/* ── Estrelas ao cair ──────────────────────────────────────────────────────── */
export function StarsBurst() {
  const stars = ['⭐', '✨', '💫', '⭐', '✨']
  return (
    <>
      {stars.map((star, i) => {
        const angle = (i / stars.length) * 360
        const rad = angle * (Math.PI / 180)
        const tx = Math.cos(rad) * 30
        const ty = Math.sin(rad) * 20
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: -10,
              left: '50%',
              fontSize: 14,
              pointerEvents: 'none',
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: tx, y: ty, scale: [0, 1.2, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.9, delay: i * 0.06, ease: 'easeOut' }}
          >
            {star}
          </motion.div>
        )
      })}
    </>
  )
}

/* ── Bug perseguindo ───────────────────────────────────────────────────────── */
export function BugEnemy({ startLeft }: { startLeft: boolean }) {
  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: 48,
        fontSize: 30,
        zIndex: 9,
        pointerEvents: 'none',
      }}
      initial={{ x: startLeft ? -60 : (typeof window !== 'undefined' ? window.innerWidth + 60 : 1400) }}
      animate={{ x: startLeft
        ? (typeof window !== 'undefined' ? window.innerWidth * 0.5 : 600)
        : (typeof window !== 'undefined' ? window.innerWidth * 0.4 : 500)
      }}
      transition={{ duration: 3, ease: 'linear' }}
    >
      🐛
    </motion.div>
  )
}
