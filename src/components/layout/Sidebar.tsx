'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard',   label: 'DASHBOARD'  },
  { href: '/squads',      label: 'SQUADS'     },
  { href: '/templates',   label: 'TEMPLATES'  },
  { href: '/executions',  label: 'HISTÓRICO'  },
  { href: '/settings',    label: 'CONFIG'     },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0a0a0f] border-r-2 border-[#1e1e3a] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b-2 border-[#1e1e3a]">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-purple-700 border-2 border-purple-500 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.6)] group-hover:shadow-[0_0_20px_rgba(124,58,237,0.9)] transition-all">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span
            className="text-white font-['Press_Start_2P'] text-sm tracking-wider"
            style={{ textShadow: '0 0 10px rgba(124,58,237,0.8), 2px 2px 0 #000' }}
          >
            VELO
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2.5 text-[8px] font-["Press_Start_2P"] tracking-wide transition-all duration-100',
                active
                  ? 'text-purple-400 bg-[#1a0a2e] border-l-2 border-purple-500'
                  : 'text-[#44445a] hover:text-[#00f5ff] hover:bg-[#0f0f1a] border-l-2 border-transparent'
              )}
            >
              <span className={active ? 'text-purple-400' : 'text-transparent'}>{'>'}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-dashed border-[#1e1e3a] my-2" />

      {/* User section */}
      <div className="p-3 space-y-2">
        {session?.user && (
          <div className="px-3 py-2 bg-[#0f0f1a] border border-[#1e1e3a]">
            <p className="text-[7px] text-white font-['Press_Start_2P'] truncate">
              {(session.user.name ?? session.user.email ?? 'PLAYER').toUpperCase().slice(0, 12)}
            </p>
            <p className="text-[6px] text-[#44445a] font-['Press_Start_2P'] mt-1">FREE PLAN</p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-2 px-3 py-2 text-[7px] font-['Press_Start_2P'] text-[#44445a] hover:text-[#ff3366] border border-transparent hover:border-[#ff336644] hover:bg-[#1a000a] transition-all"
        >
          {'>'} SAIR
        </button>
      </div>
    </aside>
  )
}
