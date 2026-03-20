'use client'
import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { userController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'

export default function PopupModal() {
  const { isAuthenticated } = useAuthStore()
  const [content, setContent] = useState<string | null>(null)
  const [isHtml, setIsHtml] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const hasTriggered = useRef(false)

  useEffect(() => {
    // Prevent multiple triggers in the same component lifecycle
    if (hasTriggered.current) return

    const fetchPopup = async () => {
      // Check if popup was already shown in this session
      const shown = sessionStorage.getItem('fairbet-popup-shown')
      if (shown === 'true') {
        return
      }

      if (!isAuthenticated) {
        return
      }

      try {
        const token = localStorage.getItem('fairbet-auth') ? 
          JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
        
        if (!token) return

        const response: any = await userController.getPopupImage(token)
        
        let rawData = response
        if (Array.isArray(response) && response.length > 0) {
          rawData = response[0]
        }

        const value = rawData.image || rawData

        if (value && typeof value === 'string') {
          hasTriggered.current = true
          sessionStorage.setItem('fairbet-popup-shown', 'true')

          const HTML_REGEX = /<[a-z][\s\S]*>/i
          const isTextHtml = HTML_REGEX.test(value)

          if (isTextHtml) {
            setContent(value)
            setIsHtml(true)
          } else {
            const formattedUrl = value.startsWith('data:') 
              ? value 
              : `data:image/png;base64,${value}`
            setContent(formattedUrl)
            setIsHtml(false)
          }
          
          setIsOpen(true)
        }
      } catch (error) {
        console.error('Failed to fetch popup content:', error)
      }
    }

    fetchPopup()
  }, [isAuthenticated])

  if (!isOpen || !content) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-10 pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-auto"
        onClick={() => setIsOpen(false)}
      />
      
      {isHtml ? (
        // Text / HTML View: Centered Card
        <div className="relative w-full max-w-md bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 pointer-events-auto p-10 flex flex-col items-center text-center">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div 
            className="text-white text-lg font-bold leading-relaxed w-full prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ) : (
        // Image View: Raw Image
        <div className="relative max-w-[90vw] max-h-[90vh] animate-in zoom-in-95 duration-500 pointer-events-auto">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute -top-4 -right-4 z-10 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-[#e8612c] transition-all shadow-xl"
          >
            <X size={24} />
          </button>
          <img 
            src={content} 
            alt="Promotion" 
            className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl block"
          />
        </div>
      )}
    </div>
  )
}
