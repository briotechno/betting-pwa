import React from 'react'
import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'danger' | 'warn' | 'live' | 'default'
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

const variantStyles = {
  primary: 'bg-primary text-white',
  success: 'bg-success text-white',
  danger: 'bg-danger text-white',
  warn: 'bg-warn text-black',
  live: 'bg-live text-white',
  default: 'bg-surface text-textSecondary border border-cardBorder',
}

const sizeStyles = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full font-semibold',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {variant === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse" />
      )}
      {children}
    </span>
  )
}
