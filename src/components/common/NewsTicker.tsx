'use client'
import React, { useState, useEffect } from 'react'
import { Megaphone, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { userController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'

export default function NewsTicker() {
  const { isAuthenticated } = useAuthStore()
  const [news, setNews] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem('fairbet-auth') ? 
          JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
        
        if (!token) {
          setLoading(false)
          return
        }

        const response = await userController.getNews(token)
        const rawNews = response.news || response.msg || ''
        
        if (response.error === '0' && rawNews) {
          const newsItems = typeof rawNews === 'string' 
            ? rawNews.split(' | ').filter(item => item.trim() !== '')
            : Array.isArray(rawNews) ? rawNews : [rawNews]
          
          setNews(newsItems)
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [isAuthenticated])

  useEffect(() => {
    if (news.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [news])

  if (!isAuthenticated || (!loading && news.length === 0)) return null

  return (
    <div className="w-full h-[34px] bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 flex items-center overflow-hidden relative z-[70]">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f26522]/10 via-transparent to-[#f26522]/5 pointer-events-none" />
      
      {/* Label with Premium Styling */}
      <div className="flex-shrink-0 h-full bg-gradient-to-r from-[#f26522] to-[#e8612c] px-4 flex items-center gap-2 shadow-[4px_0_15px_rgba(0,0,0,0.4)] z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Megaphone size={13} className="text-white drop-shadow-sm" />
        </motion.div>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.15em] whitespace-nowrap">
          Updates
        </span>
      </div>
      
      <div className="flex-1 h-full flex items-center overflow-hidden relative">
        {loading ? (
          <div className="flex items-center gap-2 px-6">
            <Loader2 size={11} className="animate-spin text-[#f26522]" />
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Syncing Latest News...</span>
          </div>
        ) : (
          <div className="w-full h-full relative flex items-center px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#f26522] shadow-[0_0_8px_rgba(242,101,34,0.6)]" />
                  <span className="text-[11px] font-bold text-white/90 uppercase tracking-wide truncate">
                    {news[currentIndex]}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none h-[1px] top-0" />
    </div>
  )
}


