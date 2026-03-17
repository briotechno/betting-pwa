'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(true) // Start with error showing as in the image

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) {
        setError(true)
        return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Dynamic Stadium Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"
        style={{ 
          backgroundImage: 'url("/signup-bg.png")',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="w-full max-w-[850px] relative z-10 flex justify-center py-10">
        
        {/* Forgot Password Container */}
        <div className="w-full max-w-[550px] bg-black/80 border-[1.5px] border-[#f05a28] pl-6 pr-8 md:pl-10 md:pr-12 pt-8 pb-10 shadow-2xl relative">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-1">
                <span className="text-5xl font-black tracking-tighter text-[#39b54a] italic">fair</span>
                <span className="text-5xl font-black text-[#f15a24] tracking-tighter italic">play</span>
            </div>
            <p className="text-[12px] md:text-[13px] text-white font-bold uppercase tracking-[0.1em] mt-1.5">
                Greater Odds. Greater Winnings
            </p>
          </div>

          <div className="text-center mb-6">
            <p className="text-[15px] text-[#efefef] font-medium">
              Please enter your Mobile Number.
            </p>
          </div>

          <form onSubmit={handleSendOtp} className="w-full space-y-8">
            
            <div className="flex items-end gap-3 w-full relative">
              {/* Country Code Selector */}
              <div className="flex items-center gap-2 border border-white/20 rounded-[4px] px-2 h-[38px] cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-sm font-bold text-white uppercase">IN</span>
                <ChevronDown size={14} className="text-white/80" />
              </div>

              {/* Mobile Input Field Area */}
              <div className="flex-1 relative pb-1">
                <div className="flex items-baseline gap-3 border-b border-[#f15a24]">
                    <input 
                    type="tel"
                    placeholder="Mobile Number"
                    className="w-full bg-transparent text-white text-lg font-medium outline-none mb-0.5 placeholder:text-[#f15a24] placeholder:font-bold placeholder:text-[13px]"
                    value={phone}
                    onChange={(e) => {
                        setPhone(e.target.value)
                        if (e.target.value) setError(false)
                        else setError(true)
                    }}
                    />
                </div>
                {error && (
                  <p className="absolute left-0 -bottom-5 text-[11px] text-[#f15a24] font-medium leading-none">
                    Mobile number is required
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 max-w-[420px] mx-auto">
                <button 
                type="submit"
                disabled={loading}
                className="w-full h-[48px] bg-white/10 hover:bg-white/20 text-[#888] hover:text-white rounded-[40px] text-[15px] font-bold uppercase tracking-[0.1em] transition-all flex items-center justify-center border border-white/5"
                >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    "Forgot Password"
                )}
                </button>
            </div>


            <div className="text-center pt-1">
                <Link href="/auth/signup" className="text-[15px] font-bold text-white hover:text-[#f15a24] uppercase tracking-widest transition-colors">
                    Not a member?
                </Link>
            </div>
          </form>


          {/* Back Link */}
          <Link href="/auth/login" className="absolute top-6 left-6 text-white/30 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}
