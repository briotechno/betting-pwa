'use client'
import React, { useState, useEffect } from 'react'
import { Megaphone, Loader2 } from 'lucide-react'
import { userController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'

export default function NewsTicker() {
  const { isAuthenticated } = useAuthStore()
  const [news, setNews] = useState<string>('')
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
        if (response.error === '0' && response.news) {
          // The API might return an array or a single string
          const newsText = Array.isArray(response.news) 
            ? response.news.join(' | ') 
            : response.news
          setNews(newsText)
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [isAuthenticated])

  if (!isAuthenticated || (!loading && !news)) return null

  return (
    <div className="w-full h-8 bg-[#1a1a1a] border-b border-white/5 flex items-center overflow-hidden relative group">
      <div className="absolute left-0 top-0 bottom-0 z-10 bg-[#e8612c] px-3 flex items-center gap-2 shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
        <Megaphone size={14} className="text-white" />
        <span className="text-[10px] font-black text-white uppercase tracking-tighter">News</span>
      </div>
      
      <div className="flex-1 h-full flex items-center overflow-hidden ml-[80px]">
        {loading ? (
          <div className="flex items-center gap-2 px-4">
            <Loader2 size={12} className="animate-spin text-white/30" />
            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Loading latest news...</span>
          </div>
        ) : (
          <div className="whitespace-nowrap animate-ticker inline-block pl-[100%] hover:pause-ticker">
            <span className="text-[12px] font-bold text-white/80 pr-[100px] inline-block uppercase tracking-wide">
              {news || 'Welcome to Fairplay 247! Latest updates will appear here.'}
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
        .pause-ticker {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
