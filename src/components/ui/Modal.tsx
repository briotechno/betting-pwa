'use client'
import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export default function Modal({ isOpen, onClose, title, children, className, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 bet-slip-overlay"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative z-10 bg-surface rounded-2xl border border-cardBorder w-full animate-fade-in',
          sizeStyles[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-cardBorder">
            <h3 className="font-semibold text-textPrimary">{title}</h3>
            <button
              onClick={onClose}
              className="text-textMuted hover:text-textPrimary transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
