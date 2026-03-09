'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Phone, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'phone' | 'otp' | 'reset'>('phone')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setStep('otp')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 mb-2">
            <span className="text-4xl font-black text-primary">fair</span>
            <span className="text-4xl font-black text-white">bet</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-cardBorder p-6 shadow-2xl">
          <Link href="/auth/login" className="flex items-center gap-2 text-textMuted hover:text-textPrimary mb-5 text-sm">
            <ArrowLeft size={16} />
            Back to Login
          </Link>

          <h2 className="text-xl font-bold text-textPrimary mb-1">Reset Password</h2>
          <p className="text-textMuted text-sm mb-6">Enter your phone number to receive OTP</p>

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone size={14} />}
              />
              <Button type="submit" fullWidth loading={loading}>
                SEND OTP
              </Button>
            </form>
          ) : step === 'otp' ? (
            <div className="space-y-4">
              <p className="text-sm text-textMuted">OTP sent to {phone}</p>
              <div className="flex gap-2 justify-center">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-10 h-12 text-center text-lg font-bold bg-surface border border-cardBorder rounded-xl text-textPrimary focus:outline-none focus:border-primary"
                  />
                ))}
              </div>
              <Button fullWidth onClick={() => setStep('reset')}>
                VERIFY OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input label="New Password" type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
              <Button fullWidth>
                RESET PASSWORD
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
