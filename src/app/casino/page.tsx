'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CasinoRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/markets/live-casino')
  }, [router])
  return null
}

