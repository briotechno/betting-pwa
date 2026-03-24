'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, Loader2, Calendar, Trophy, ArrowRight } from 'lucide-react'
import { useLayoutStore } from '@/store/layoutStore'
import { useAuthStore } from '@/store/authStore'
import { marketController } from '@/controllers/market/marketController'

interface SearchResult {
  Datetime: string;
  Type: string;
  GameName: string;
  Gid: string;
}

export default function SearchModal() {
  const router = useRouter()
  const { searchModalOpen, setSearchModalOpen } = useLayoutStore()
  const { user } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = async (val: string) => {
    setQuery(val)
    if (val.length < 3) {
      setResults([])
      setError(null)
      return
    }

    if (!user?.loginToken) return;

    try {
      setLoading(true)
      setError(null)
      const res = await marketController.search(user.loginToken, val)
      
      if (Array.isArray(res)) {
        setResults(res)
      } else if (res.error === '1') {
        setResults([])
        setError(res.msg || 'No results found')
      }
    } catch (err) {
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setSearchModalOpen(false)
    // Map sport type to segments used in routes if possible, or use a generic route
    const sportSegment = result.Type.toLowerCase()
    router.push(`/sports/${sportSegment}/${result.Gid}`)
  }

  if (!mounted || !searchModalOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
      {/* Backdrop - Root Level Overlay */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
        onClick={() => setSearchModalOpen(false)}
      />
      
      {/* Modal Container - Centered Vertically & Horizontally */}
      <div className="relative w-full max-w-[500px] bg-[#1a1a1a] rounded-[16px] border border-white/10 shadow-[0_30px_100px_-12px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-black text-white uppercase tracking-tighter">Search Events</h2>
            <div className="bg-[#f26522]/10 px-2 py-0.5 rounded text-[10px] font-bold text-[#f26522] uppercase">Live Beta</div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-4 pt-3">
          <div className="relative group">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f26522]" strokeWidth={3} />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for match, team or league..."
              className="w-full h-12 bg-white rounded-[8px] pl-12 pr-12 text-[16px] text-black font-bold outline-none ring-4 ring-transparent focus:ring-[#f26522]/20 transition-all placeholder:text-gray-400 placeholder:font-medium"
              onKeyDown={(e) => e.key === 'Escape' && setSearchModalOpen(false)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {loading ? (
                <Loader2 size={18} className="text-[#f26522] animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-bold">↵</div>
              )}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="px-3 pb-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="py-12 flex flex-col items-center justify-center opacity-40">
              <Search size={40} className="text-gray-500 mb-3" />
              <p className="text-gray-500 text-[13px] font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((res: SearchResult) => (
                <button
                  key={res.Gid}
                  onClick={() => handleResultClick(res)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group text-left border border-transparent hover:border-white/5"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-[#f26522]/20 group-hover:border-[#f26522]/20 transition-colors">
                    {res.Type.toLowerCase().includes('cricket') ? (
                      <span className="text-lg">🏏</span>
                    ) : res.Type.toLowerCase().includes('foot') ? (
                      <span className="text-lg">⚽</span>
                    ) : (
                      <Trophy size={20} className="text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-black text-white group-hover:text-[#f26522] transition-colors truncate uppercase tracking-tight">
                      {res.GameName}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        <Calendar size={10} />
                        {res.Datetime}
                      </div>
                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                        {res.Type}
                      </div>
                    </div>
                  </div>

                  <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-all transform translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          ) : !loading && query.length >= 3 && !error && (
            <div className="py-12 flex flex-col items-center justify-center opacity-40">
              <Search size={40} className="text-gray-500 mb-3" />
              <p className="text-gray-500 text-[13px] font-black uppercase tracking-widest">No results matched your query</p>
            </div>
          )}

          {!query && !loading && (
             <div className="py-8 text-center text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] italic opacity-30">
                Type something to start searching...
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Powered by Real-Time Index</p>
          <button 
            onClick={() => setSearchModalOpen(false)}
            className="text-gray-400 hover:text-white font-black text-[12px] uppercase tracking-widest transition-all"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  )
}
