import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-7 h-7' }

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin border-2 border-current border-t-transparent',
        sizes[size],
        className
      )}
    />
  )
}
