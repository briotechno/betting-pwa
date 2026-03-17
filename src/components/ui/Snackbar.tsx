'use client'
import React, { useEffect, useState } from 'react'
import { useSnackbarStore } from '@/store/snackbarStore'

export default function Snackbar() {
  const { isOpen, message, hide } = useSnackbarStore()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
    } else {
      const timer = setTimeout(() => setShow(false), 300) // match transition duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!show) return null

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[9999] flex justify-center pt-8 px-4 transition-all duration-300 pointer-events-none ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
      }`}
    >
      <div 
        role="status"
        aria-live="polite"
        className="flex items-center justify-between min-w-[344px] max-w-[672px] w-full sm:w-auto bg-[#4caf50] text-[#fff] px-4 py-2.5 rounded shadow-xl pointer-events-auto"
        style={{
          boxShadow: '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)'
        }}
      >
        <div className="text-[14px] font-normal tracking-wide py-1 leading-tight">
          {message}
        </div>
        <button 
          onClick={hide}
          className="ml-8 uppercase text-[14px] font-bold text-white hover:bg-white/10 px-2 py-1.5 rounded transition-colors tracking-widest whitespace-nowrap"
        >
          Close
        </button>
      </div>
    </div>
  )
}
