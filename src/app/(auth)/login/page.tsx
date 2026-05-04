'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CipherAvatar, BoltAvatar, SageAvatar } from '@/lib/agent-avatars'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) {
      setError('EMAIL OU SENHA INVÁLIDOS')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background scene */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Depth grid lines */}
        <div className="absolute bottom-[16%] left-0 right-0 h-px bg-[#1e1e3a] opacity-25" />
        <div className="absolute bottom-[32%] left-0 right-0 h-px bg-[#1e1e3a] opacity-15" />
        <div className="absolute bottom-[52%] left-0 right-0 h-px bg-[#1e1e3a] opacity-10" />

        {/* Coder (BoltAvatar) — L→R, pauses to type */}
        <div
          className="absolute left-0 bottom-[18%]"
          style={{ animation: 'scene-walk-lr 22s linear infinite', opacity: 0.48 }}
        >
          <div style={{ animation: 'idle-bounce 0.85s ease-in-out infinite' }}>
            <BoltAvatar size={76} />
          </div>
        </div>

        {/* Analyst (SageAvatar) — R→L, pauses to write */}
        <div
          className="absolute left-0 bottom-[53%]"
          style={{ animation: 'scene-walk-rl 28s linear infinite', animationDelay: '-11s', opacity: 0.32 }}
        >
          <div style={{ transform: 'scaleX(-1)', animation: 'idle-bounce 1s ease-in-out infinite' }}>
            <SageAvatar size={58} />
          </div>
        </div>

        {/* Debugger (CipherAvatar) — runs R→L, frantic */}
        <div
          className="absolute left-0 bottom-[34%]"
          style={{ animation: 'scene-run-rl 11s linear infinite', animationDelay: '-4s', opacity: 0.52 }}
        >
          <div style={{ transform: 'scaleX(-1)', animation: 'run-bob 0.24s ease-in-out infinite' }}>
            <CipherAvatar size={68} />
          </div>
        </div>

        {/* Bug chasing debugger */}
        <div
          className="absolute left-0 text-2xl"
          style={{ bottom: 'calc(34% + 20px)', animation: 'scene-bug-chase 11s linear infinite', animationDelay: '-3.4s', opacity: 0.65 }}
        >
          🐛
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-700 border-2 border-purple-500 flex items-center justify-center shadow-[0_0_16px_rgba(124,58,237,0.7)]">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span
              className="font-['Press_Start_2P'] text-base text-white"
              style={{ textShadow: '0 0 10px rgba(124,58,237,0.8), 2px 2px 0 #000' }}
            >
              VELO
            </span>
          </Link>
          <div className="font-['Press_Start_2P'] text-[9px] text-[#00f5ff] tracking-widest">
            PLAYER LOGIN
          </div>
        </div>

        {/* Form box */}
        <div
          className="border-2 border-[#1e1e3a] bg-[#0f0f1a] p-6"
          style={{ boxShadow: '4px 4px 0 #000' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-['Press_Start_2P'] text-[7px] text-[#8888aa] mb-2 tracking-widest">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full terminal-input px-3 py-2.5 text-sm font-mono rounded-none"
              />
            </div>

            <div>
              <label className="block font-['Press_Start_2P'] text-[7px] text-[#8888aa] mb-2 tracking-widest">
                SENHA
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full terminal-input px-3 py-2.5 text-sm font-mono rounded-none"
              />
            </div>

            {error && (
              <div className="border border-[#ff3366] bg-[#1a000a] px-3 py-2">
                <p className="font-['Press_Start_2P'] text-[7px] text-[#ff3366] text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-['Press_Start_2P'] text-[8px] bg-purple-700 border-2 border-purple-500 text-white py-3 hover:bg-purple-600 hover:shadow-[0_0_12px_rgba(124,58,237,0.6)] transition-all shadow-[3px_3px_0_#000] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '► ENTRANDO...' : '► ENTRAR'}
            </button>
          </form>
        </div>

        <p className="text-center font-['Press_Start_2P'] text-[7px] text-[#44445a] mt-6">
          SEM CONTA?{' '}
          <Link href="/register" className="text-[#00f5ff] hover:underline">
            CRIAR AGORA
          </Link>
        </p>
      </div>
    </div>
  )
}
