'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Lock, User, Phone, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  
  const [loginMode, setLoginMode] = useState<'mobile' | 'userId'>('mobile')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    identifier: '', // Can be phone or userId
    password: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500))
    
    login({
      id: '1',
      username: loginMode === 'mobile' ? `user_${formData.identifier.slice(-4)}` : formData.identifier,
      email: '', // No email required
      balance: 10000,
      tier: 'Beginner'
    })
    
    setLoading(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Dynamic Stadium Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/signup-bg.png")',
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-[440px] relative z-10 flex flex-col items-center">
        {/* Top Logo */}
        <div className="mb-8 scale-125">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-4xl font-black italic tracking-tighter text-[#e8612c]">fair</span>
            <span className="text-4xl font-black italic text-white tracking-tighter">play</span>
            <div className="ml-1.5 px-2 py-1 rounded bg-[#e8612c] text-white text-[10px] font-black uppercase tracking-widest leading-none">
              VIP
            </div>
          </Link>
          <p className="text-[10px] text-center text-white/40 font-black uppercase tracking-[0.3em] mt-1 pl-1">Greater Luck Greater Wins</p>
        </div>

        {/* Login Container */}
        <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-8 shadow-2xl relative group">
          <form onSubmit={handleLogin} className="space-y-7 pt-4">
            
            {/* Mode Toggle */}
            <div className="flex p-0.5 bg-white/5 border border-white/10 rounded-lg">
              <button 
                type="button"
                onClick={() => setLoginMode('mobile')}
                className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                  loginMode === 'mobile' ? 'bg-[#e8612c] text-white shadow-lg shadow-orange-950/20' : 'text-white/40 hover:text-white/60'
                }`}
              >
                Mobile
              </button>
              <button 
                type="button"
                onClick={() => setLoginMode('userId')}
                className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                  loginMode === 'userId' ? 'bg-[#e8612c] text-white shadow-lg shadow-orange-950/20' : 'text-white/40 hover:text-white/60'
                }`}
              >
                User ID
              </button>
            </div>

            {/* Input Wrapper with Underline style */}
            <div className="space-y-5">
              {/* Account Input */}
              <div className="relative border-b border-white/20 pb-1 focus-within:border-white transition-colors">
                <div className="flex items-center gap-3">
                  {loginMode === 'mobile' ? (
                    <>
                      <Phone size={16} className="text-white" />
                      <span className="text-sm font-black text-white/60">+91</span>
                    </>
                  ) : (
                    <User size={16} className="text-white" />
                  )}
                  <input 
                    type={loginMode === 'mobile' ? 'tel' : 'text'}
                    required
                    placeholder={loginMode === 'mobile' ? 'Mobile*' : 'User ID / Username*'}
                    className="flex-1 bg-transparent text-sm font-medium text-white placeholder-white/40 outline-none py-1"
                    value={formData.identifier}
                    onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative border-b border-white/20 pb-1 focus-within:border-white transition-colors">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-white" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Password*"
                    className="flex-1 bg-transparent text-sm font-medium text-white placeholder-white/40 outline-none py-1"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
               <Link href="/auth/forgot-password" className="text-[11px] text-[#e8612c] font-black uppercase tracking-tight hover:underline">Forgot Password?</Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#5cb85c] text-white rounded-lg text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 shadow-lg shadow-green-900/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Login"
              )}
            </button>

            {/* Social Divider */}
            <div className="relative py-2">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-white/10" />
               </div>
               <div className="relative flex justify-center">
                 <span className="bg-[#0e0e0e] px-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">or login with</span>
               </div>
            </div>

            {/* Social Buttons */}
            <div className="flex flex-col items-center gap-4">
              <button type="button" className="w-full h-10 bg-white rounded-md flex items-center justify-center gap-3 transition-all hover:bg-gray-100 shadow-md">
                <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} />
                <span className="text-[13px] font-bold text-gray-700">Google</span>
              </button>
              
              <button type="button" className="w-10 h-10 bg-[#4caf50] rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.539 2.01 2.057-.54c.953.52 1.908.814 3.232.815 3.18 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.772-5.769-5.772zm3.38 8.044c-.154.433-.746.793-1.044.814-.298.02-.589.117-1.921-.406-1.639-.645-2.741-2.316-2.822-2.425-.081-.109-.661-.88-.661-1.683 0-.803.414-1.198.562-1.353.148-.155.32-.193.427-.193h.305c.088 0 .141-.013.205.148l.433 1.054c.054.133.09.283.003.456-.087.173-.131.283-.26.433-.13.15-.272.336-.39.452-.132.13-.268.271-.116.533.152.262.676 1.111 1.45 1.802.997.89 1.838 1.164 2.1 1.294.262.13.415.109.57-.071.155-.181.661-.771.838-1.033.177-.262.355-.218.6-.128s1.543.727 1.808.859c.264.13.441.194.506.305.065.111.065.642-.09 1.075z" />
                </svg>
              </button>
            </div>

            {/* Signup Link */}
            <p className="text-center text-[12px] text-white/60 font-medium">
              Don't have an account? <Link href="/auth/signup" className="text-[#e8612c] font-black hover:underline uppercase tracking-tight">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
