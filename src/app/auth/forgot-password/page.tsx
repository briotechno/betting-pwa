'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Phone, Loader2, ArrowRight } from 'lucide-react'
import { authController } from '@/controllers/auth'
import { useSnackbarStore } from '@/store/snackbarStore'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { show: showSnackbar } = useSnackbarStore()
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleForgotPass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mobile) {
      showSnackbar('Please enter your mobile number', 'warning')
      return
    }

    setLoading(true)
    try {
      const res = await authController.forgotPassword(mobile)
      if (res.error === '0') {
        showSnackbar(res.msg || 'Password sent to your mobile', 'success')
        setSuccess(true)
      } else {
        showSnackbar(res.msg || 'Failed to process request', 'error')
      }
    } catch (err) {
      showSnackbar('An error occurred. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-[#222222] border-b border-white/5">
        <button onClick={() => router.back()} className="text-[#e8612c] mr-4">
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="text-[17px] font-black uppercase tracking-tight">Forgot Password</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {!success ? (
          <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-[#e8612c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-[#e8612c]" size={28} />
              </div>
              <h2 className="text-[20px] font-black uppercase tracking-tight">Find Your Account</h2>
              <p className="text-[13px] text-gray-400 font-medium">Enter your registered mobile number and we'll send you a new password.</p>
            </div>

            <form onSubmit={handleForgotPass} className="space-y-6">
              <div className="relative border-b border-gray-600 pb-1 focus-within:border-[#e8612c] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Mobile Number"
                    className="flex-1 bg-transparent text-[15px] font-bold text-white placeholder-gray-500 outline-none py-2"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || mobile.length < 10}
                className="w-full h-[50px] bg-[#e8612c] text-white rounded-[4px] text-[15px] font-black uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:grayscale"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'SEND PASSWORD'}
              </button>
            </form>

            <p className="text-center">
              <Link href="/auth/login" className="text-[12px] font-black text-[#e8612c] uppercase hover:underline">Back to Login</Link>
            </p>
          </div>
        ) : (
          <div className="w-full max-w-[400px] text-center space-y-8 animate-in zoom-in duration-500">
             <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                   <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                   </svg>
                </div>
             </div>
             <div className="space-y-2">
                <h2 className="text-[22px] font-black uppercase tracking-tight">Success!</h2>
                <p className="text-[14px] text-gray-400 font-medium leading-relaxed px-4">
                  We've sent a new password to <span className="text-white font-bold">+91 {mobile}</span>. Please check your messages and use it to login.
                </p>
             </div>
             
             <button
                onClick={() => router.push('/auth/login')}
                className="w-full h-[50px] bg-white text-black rounded-[4px] text-[15px] font-black uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                GO TO LOGIN <ArrowRight size={18} />
              </button>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="p-8 opacity-20 flex justify-center grayscale">
         <img
            src="https://www.fairplay247.vip/_nuxt/img/fairplay-website-logo.09a29c5.png"
            alt="Fairplay Logo"
            className="h-8 object-contain"
          />
      </div>
    </div>
  )
}
