'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const CRUMBS: Record<string, string> = {
  '/dashboard':   'DASHBOARD',
  '/squads':      'SQUADS',
  '/templates':   'TEMPLATES',
  '/executions':  'HISTÓRICO',
  '/settings':    'CONFIG',
}

function getBreadcrumb(pathname: string): string {
  for (const [path, label] of Object.entries(CRUMBS)) {
    if (pathname === path || pathname.startsWith(path + '/')) {
      const parts = ['VELO', label]
      if (pathname.includes('/new'))  parts.push('NOVO')
      if (pathname.includes('/edit')) parts.push('EDITAR')
      return parts.join(' > ')
    }
  }
  return 'VELO'
}

export default function Header() {
  const pathname = usePathname()
  const crumb = getBreadcrumb(pathname)

  return (
    <header className="h-12 border-b-2 border-[#1e1e3a] bg-[#0a0a0f] flex items-center justify-between px-5 sticky top-0 z-10">
      <span
        className="text-[8px] font-['Press_Start_2P'] text-[#44445a] tracking-wide"
        style={{ textShadow: '1px 1px 0 #000' }}
      >
        {crumb}
      </span>

      <Link
        href="/squads/new"
        className={[
          'flex items-center gap-2 px-3 py-2',
          'bg-purple-700 hover:bg-purple-600',
          'border-2 border-purple-500',
          'text-white text-[7px] font-["Press_Start_2P"] uppercase tracking-wide',
          'shadow-[2px_2px_0_#000]',
          'hover:shadow-[0_0_12px_rgba(124,58,237,0.6),2px_2px_0_#000]',
          'transition-all duration-100',
        ].join(' ')}
      >
        + NOVO SQUAD
      </Link>
    </header>
  )
}
