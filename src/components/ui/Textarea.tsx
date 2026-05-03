import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
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
      <textarea
        ref={ref}
        id={id}
        className={cn(
          'w-full bg-[#050508] border border-[#1e1e3a] px-3 py-2.5',
          'text-[#00f5ff] text-sm font-mono resize-none',
          'placeholder:text-[#44445a]',
          'focus:outline-none focus:border-[#00f5ff]',
          'focus:shadow-[0_0_0_1px_rgba(0,245,255,0.3),0_0_12px_rgba(0,245,255,0.15)]',
          'transition-all duration-150',
          'caret-[#00f5ff] leading-relaxed',
          error && 'border-[#ff3366]',
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

export default Textarea
