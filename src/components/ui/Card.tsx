import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  glow?: boolean
}

export default function Card({ children, className, onClick, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#13131f] border-2 border-[#1e1e3a]',
        'transition-all duration-200',
        onClick && [
          'cursor-pointer',
          'hover:border-purple-600',
          'hover:shadow-[0_0_15px_rgba(124,58,237,0.25)]',
          'hover:scale-[1.01]',
        ],
        glow && 'border-purple-600 shadow-[0_0_20px_rgba(124,58,237,0.4)]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
