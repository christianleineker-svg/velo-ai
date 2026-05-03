import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-[8px] uppercase tracking-widest text-[#8888aa] font-['Press_Start_2P']"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full bg-[#050508] border border-[#1e1e3a] px-3 py-2.5',
          'text-white text-sm font-mono',
          'placeholder:text-[#44445a]',
          'focus:outline-none focus:border-[#00f5ff]',
          'focus:shadow-[0_0_0_1px_rgba(0,245,255,0.3),0_0_12px_rgba(0,245,255,0.15)]',
          'transition-all duration-150',
          'caret-[#00f5ff]',
          error && 'border-[#ff3366] focus:border-[#ff3366]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-[8px] text-[#ff3366] font-['Press_Start_2P']">{error}</p>
      )}
    </div>
  )
})

export default Input
