'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Spinner from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

const variants = {
  primary: [
    'bg-purple-700 hover:bg-purple-600 text-white',
    'border-2 border-purple-500',
    'shadow-[2px_2px_0px_#000]',
    'hover:shadow-[0_0_20px_rgba(124,58,237,0.7),2px_2px_0px_#000]',
    'active:translate-y-px active:shadow-[1px_1px_0px_#000]',
    'font-["Press_Start_2P"] text-[8px] tracking-wide uppercase',
  ].join(' '),
  secondary: [
    'bg-transparent hover:bg-[#1e1e3a] text-[#8888aa] hover:text-[#00f5ff]',
    'border-2 border-[#1e1e3a] hover:border-[#00f5ff]',
    'shadow-[2px_2px_0px_#000]',
    'hover:shadow-[0_0_12px_rgba(0,245,255,0.3),2px_2px_0px_#000]',
    'font-["Press_Start_2P"] text-[8px] tracking-wide uppercase',
  ].join(' '),
  ghost: [
    'bg-transparent hover:bg-[#0f0f1a] text-[#44445a] hover:text-white',
    'border-2 border-transparent hover:border-[#1e1e3a]',
    'font-["Press_Start_2P"] text-[7px] tracking-wide uppercase',
  ].join(' '),
  danger: [
    'bg-red-900 hover:bg-red-700 text-white',
    'border-2 border-red-600',
    'shadow-[2px_2px_0px_#000]',
    'hover:shadow-[0_0_15px_rgba(255,51,102,0.6)]',
    'font-["Press_Start_2P"] text-[8px] tracking-wide uppercase',
  ].join(' '),
}

const sizes = {
  sm: 'px-3 py-2',
  md: 'px-4 py-2.5',
  lg: 'px-6 py-4',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 transition-all duration-100',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
