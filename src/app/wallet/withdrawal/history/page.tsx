'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WithdrawalHistoryRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/wallet/withdrawal')
  }, [router])
  return null
}
