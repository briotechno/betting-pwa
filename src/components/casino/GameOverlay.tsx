'use client'
import React from 'react'
import { X, Maximize2, RefreshCw } from 'lucide-react'

import { useAuthStore } from '@/store/authStore'

interface GameOverlayProps {
  url: string | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
  isFloating?: boolean;
}

export default function GameOverlay({ url, title, isOpen, onClose, onRefresh, isFloating = false }: GameOverlayProps) {
  const { isAuthenticated } = useAuthStore()
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 ${isAuthenticated ? 'top-[34px]' : 'top-0'} z-[100] bg-black flex flex-col pt-[ env(safe-area-inset-top) ] animate-in fade-in slide-in-from-bottom-4 duration-300`}>
      {/* Immersive Floating Close Button */}
      {isFloating && (
        <button
          onClick={onClose}
          className="fixed top-4 left-4 z-[110] w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-all hover:bg-black/60"
        >
          <X size={24} />
        </button>
      )}

      {/* Standard Header (Hidden in floating mode) */}
      {!isFloating && (
        <div className="h-14 bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
            <span className="text-[14px] font-black uppercase tracking-tight text-white">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-1.5 rounded-full bg-white/5 text-white/70 hover:text-white"
              >
                <RefreshCw size={18} />
              </button>
            )}
            <button className="p-1.5 rounded-full bg-white/5 text-white/70">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 relative bg-black">
        {!url ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 border-4 border-[#e8612c]/20 border-t-[#e8612c] rounded-full animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[12px]">Connecting to server...</p>
          </div>
        ) : (
          <iframe
            src={url}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen"
          />
        )}
      </div>
    </div>
  )
}
