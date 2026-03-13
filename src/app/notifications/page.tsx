'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Bell } from 'lucide-react'

export default function NotificationsPage() {
  const router = useRouter()

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20 font-sans">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md border-b border-white/5">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <h1 className="text-[17px] font-bold">Notifications</h1>
      </div>

      <div className="flex flex-col items-center justify-center pt-24 space-y-4 opacity-80">
        <Bell size={48} className="text-white fill-white/10" />
        <h2 className="text-[18px] font-bold tracking-tight">No Notifications</h2>
      </div>
    </div>
  )
}
