'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Loader2, Megaphone } from 'lucide-react'
import { userController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'

export default function NewsPage() {
  const { isAuthenticated } = useAuthStore()
  const [news, setNews] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const authData = localStorage.getItem('fairbet-auth')
        const token = authData ? JSON.parse(authData).state.user?.loginToken : null
        
        if (!token) {
          // If not logged in, try to get some generic news if possible, or just stop loading
          setLoading(false)
          return
        }

        const response = await userController.getNews(token)
        const rawNews = response.news || response.msg || ''
        setNews(rawNews)
      } catch (err) {
        console.error('Failed to fetch news:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-[#000] p-4 text-white font-mono text-sm leading-relaxed">
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <p className="text-white/60">Please login to see the latest news and updates.</p>
          <Link 
            href="/auth/login" 
            className="px-6 py-2 bg-[#e15b24] text-white font-bold rounded uppercase tracking-widest text-[12px] hover:brightness-110 active:scale-95 transition-all"
          >
            Login Now
          </Link>
        </div>
      ) : loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={16} />
          <span>Loading news...</span>
        </div>
      ) : (
        <div className="whitespace-pre-wrap break-words">
          {news || 'No news available.'}
        </div>
      )}
    </div>
  )
}
