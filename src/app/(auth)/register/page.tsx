'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import RobotCharacter from '@/components/login/RobotCharacter'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('AS SENHAS NÃO COINCIDEM'); return }
    if (password.length < 6)  { setError('SENHA MUITO CURTA (MIN 6)'); return }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) { setError((json.error ?? 'ERRO AO CRIAR CONTA').toUpperCase()); setLoading(false); return }
      await signIn('credentials', { email, password, redirect: false })
      router.push('/dashboard')
    } catch {
      setError('ERRO INESPERADO. TENTE NOVAMENTE.')
      setLoading(false)
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
          <div className="font-['Press_Start_2P'] text-[9px] text-[#00ff88] tracking-widest">
            NEW PLAYER
          </div>
        </div>

        {/* Form box */}
        <div
          ref={modalRef}
          className="border-2 border-[#1e1e3a] bg-[#0f0f1a] p-6"
          style={{ boxShadow: '4px 4px 0 #000' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'NOME', type: 'text',     val: name,     set: setName,     ph: 'Seu nome',         req: false },
              { label: 'EMAIL', type: 'email',   val: email,    set: setEmail,    ph: 'seu@email.com',    req: true  },
              { label: 'SENHA', type: 'password', val: password, set: setPassword, ph: 'Mínimo 6 chars',  req: true  },
              { label: 'CONFIRMAR', type: 'password', val: confirm, set: setConfirm, ph: '••••••••',      req: true  },
            ].map(({ label, type, val, set, ph, req }) => (
              <div key={label}>
                <label className="block font-['Press_Start_2P'] text-[7px] text-[#8888aa] mb-2 tracking-widest">
                  {label}
                </label>
                <input
                  type={type}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  placeholder={ph}
                  required={req}
                  className="w-full terminal-input px-3 py-2.5 text-sm font-mono rounded-none"
                />
              </div>
            ))}

            {error && (
              <div className="border border-[#ff3366] bg-[#1a000a] px-3 py-2">
                <p className="font-['Press_Start_2P'] text-[7px] text-[#ff3366] text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-['Press_Start_2P'] text-[8px] bg-purple-700 border-2 border-purple-500 text-white py-3 hover:bg-purple-600 hover:shadow-[0_0_12px_rgba(124,58,237,0.6)] transition-all shadow-[3px_3px_0_#000] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? '► CRIANDO...' : '► CRIAR CONTA'}
            </button>
          </form>
        </div>

        <p className="text-center font-['Press_Start_2P'] text-[7px] text-[#44445a] mt-6">
          JÁ TEM CONTA?{' '}
          <Link href="/login" className="text-[#00f5ff] hover:underline">
            ENTRAR
          </Link>
        </p>
      </div>
    </div>
  )
}
