import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'
  blink?: boolean
  className?: string
}

const variants = {
  default:  'bg-[#1e1e3a] text-[#8888aa] border-[#44445a]',
  success:  'bg-[#003322] text-[#00ff88] border-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.4)]',
  warning:  'bg-[#332200] text-[#ffd700] border-[#ffd700]',
  error:    'bg-[#330011] text-[#ff3366] border-[#ff3366] shadow-[0_0_8px_rgba(255,51,102,0.4)]',
  info:     'bg-[#001a33] text-[#00f5ff] border-[#00f5ff] shadow-[0_0_8px_rgba(0,245,255,0.3)]',
  purple:   'bg-[#1a0a33] text-[#c084fc] border-[#7c3aed] shadow-[0_0_8px_rgba(124,58,237,0.4)]',
}

export default function Badge({ children, variant = 'default', blink = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1',
        'border text-[7px] uppercase tracking-widest',
        'font-["Press_Start_2P"]',
        variants[variant],
        blink && 'animate-blink',
        className
      )}
    >
      {children}
    </span>
  )
}
