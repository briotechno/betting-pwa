'use client'
import React, { useState, useEffect } from 'react'
import { Megaphone, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { userController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'

export default function NewsTicker() {
  const { isAuthenticated } = useAuthStore()
  const [newsItems, setNewsItems] = useState<string[]>([])
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
          const items = typeof rawNews === 'string' 
            ? rawNews.split(' | ').filter(item => item.trim() !== '')
            : Array.isArray(rawNews) ? rawNews : [rawNews]
          
          setNewsItems(items)
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [isAuthenticated])

  if (!isAuthenticated || (!loading && newsItems.length === 0)) return null

  const newsString = newsItems.join('       |       ')

  return (
    <div className="w-full h-[34px] bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 flex items-center overflow-hidden relative z-[70] px-4">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f26522]/10 via-transparent to-[#f26522]/5 pointer-events-none" />
      
      {/* Small Megaphone Icon */}
      <div className="flex-shrink-0 flex items-center gap-2 z-10 bg-[#0a0a0a]/80 pr-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Megaphone size={13} className="text-[#f26522] drop-shadow-sm" />
        </motion.div>
      </div>
      
      <div className="flex-1 h-full flex items-center overflow-hidden relative">
        {loading ? (
          <div className="flex items-center gap-2 px-2">
            <Loader2 size={11} className="animate-spin text-[#f26522]" />
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Syncing Latest News...</span>
          </div>
        ) : (
          <div className="flex whitespace-nowrap items-center">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: '-100%' }}
              transition={{
                duration: Math.max(20, newsString.length * 0.2), // Dynamic duration based on length
                repeat: Infinity,
                ease: 'linear'
              }}
              className="flex items-center"
            >
              <span className="text-[11px] font-bold text-white/90 uppercase tracking-wide px-4">
                {newsString}
              </span>
              {/* Duplicate for smoother loop if needed, but for simple marquee 100% to -100% is fine */}
            </motion.div>
          </div>
        )}
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none h-[1px] top-0" />
    </div>
  )
}


