import React from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  onClick?: () => void
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export default function Card({ children, className, padding = 'md', hoverable = false, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-card rounded-xl border border-cardBorder',
        paddingStyles[padding],
        hoverable && 'hover:border-primary/50 cursor-pointer transition-all duration-200 game-card-hover',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
