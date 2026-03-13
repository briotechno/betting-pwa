'use client'
import React, { useEffect, useState } from 'react'
import { useLayoutStore } from '@/store/layoutStore'

export default function FeedbackModal() {
  const { feedbackModalOpen, setFeedbackModalOpen } = useLayoutStore()
  const [mounted, setMounted] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !feedbackModalOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setFeedbackModalOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative bg-[#212121] w-full max-w-[340px] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 space-y-6">
          <h2 className="text-[24px] font-bold text-white tracking-tight">Feedback</h2>
          
          <div className="relative">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write a comment or describe a problem."
              className="w-full bg-transparent border border-white/20 rounded-md p-4 h-[120px] text-[16px] text-white/90 placeholder:text-white/40 outline-none focus:border-[#e15b24] transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-start gap-6 pt-2">
            <button
              onClick={() => {
                // Handle submission here
                setFeedback('')
                setFeedbackModalOpen(false)
              }}
              className="h-10 px-6 bg-[#e15b24] text-white rounded-[4px] text-[14px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-[#e15b24]/20"
            >
              SUBMIT
            </button>
            <button
              onClick={() => setFeedbackModalOpen(false)}
              className="text-[14px] font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
