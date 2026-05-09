'use client'

import { useState, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RobotCharacter from '@/components/login/RobotCharacter'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

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
      {/* Animated robot character */}
      <RobotCharacter modalRef={modalRef} />

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
          ref={modalRef}
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
