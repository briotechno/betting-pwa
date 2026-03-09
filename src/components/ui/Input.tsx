import React from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export default function Input({ label, error, leftIcon, rightIcon, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-textSecondary font-medium">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted">
            {leftIcon}
          </div>
        )}
        <input
          className={clsx(
            'w-full bg-surface border rounded-lg text-textPrimary placeholder-textMuted',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'px-4 py-2.5 text-sm transition-all duration-200',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error ? 'border-danger' : 'border-cardBorder',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
