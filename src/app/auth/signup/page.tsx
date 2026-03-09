'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Lock, User, Phone, CheckCircle2, ShieldCheck, ChevronRight, Gift } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    referralCode: ''
  })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500))
    
    login({
      id: '2',
      username: formData.username || `user_${formData.phone.slice(-4)}`,
      email: '', // No email required
      balance: 10000,
      tier: 'Beginner'
    })
    
    setLoading(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-4 lg:p-8 font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#16a34a] opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#e8612c] opacity-[0.03] blur-[120px]" />
      </div>

      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10">
        
        {/* Left Side: Branding & Promo */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0d0d0d] to-[#000] border-r border-[#1a1a1a]">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 mb-12 group">
              <span className="text-4xl font-black italic tracking-tighter text-[#e8612c] group-hover:scale-105 transition-transform">fair</span>
              <span className="text-4xl font-black italic tracking-tighter text-white">play</span>
            </Link>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e8612c10] border border-[#e8612c20] mb-8">
              <Gift size={16} className="text-[#e8612c]" />
              <span className="text-[10px] font-black text-[#e8612c] uppercase tracking-widest">Joining Bonus Active</span>
            </div>

            <h2 className="text-4xl font-black text-white leading-tight mb-6">
              Join the <br />
              <span className="text-[#16a34a]">Winning</span> Circle <br />
              Today.
            </h2>
            
            <div className="space-y-6 mt-12">
               {[
                 { title: '100% Secure', desc: 'Your data is encrypted and safe', icon: <ShieldCheck className="text-[#16a34a]" size={20}/> },
                 { title: '24/7 Support', desc: 'Real-time assistance whenever you need', icon: <CheckCircle2 className="text-[#16a34a]" size={20}/> },
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#ffffff05] flex items-center justify-center shrink-0 border border-[#1a1a1a]">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">{item.title}</h4>
                      <p className="text-xs text-[#555] mt-0.5 font-bold">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[#1a1a1a]">
             <p className="text-[10px] font-black text-[#333] tracking-[0.4em] uppercase">The ultimate gaming destination</p>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
             <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
             <p className="text-xs text-[#555] font-bold">Fill in your details to get started instantly.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#444] uppercase tracking-widest ml-1">Username (Optional)</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-[#e8612c] transition-colors" />
                <input 
                  type="text"
                  placeholder="Choose a screen name"
                  className="w-full bg-[#111] border border-[#1a1a1a] focus:border-[#e8612c] rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-[#2a2a2a] outline-none transition-all"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#444] uppercase tracking-widest ml-1">Mobile Number *</label>
              <div className="relative group">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-[#e8612c] transition-colors" />
                <span className="absolute left-12 top-1/2 -translate-y-1/2 text-sm font-black text-[#555] border-r border-[#1a1a1a] pr-3">+91</span>
                <input 
                  type="tel"
                  required
                  placeholder="70000 00000"
                  className="w-full bg-[#111] border border-[#1a1a1a] focus:border-[#e8612c] rounded-2xl py-4 pl-24 pr-4 text-sm text-white placeholder-[#2a2a2a] outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#444] uppercase tracking-widest ml-1">Password *</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-[#e8612c] transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="Create a strong password"
                  className="w-full bg-[#111] border border-[#1a1a1a] focus:border-[#e8612c] rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder-[#2a2a2a] outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Referral Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#444] uppercase tracking-widest ml-1">Referral Code (Optional)</label>
              <input 
                type="text"
                placeholder="PROMO100"
                className="w-full bg-[#111] border border-[#1a1a1a] focus:border-[#e8612c] rounded-2xl py-4 px-6 text-sm text-white placeholder-[#2a2a2a] outline-none transition-all"
                value={formData.referralCode}
                onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
              />
            </div>

            {/* Terms */}
            <p className="text-[10px] text-[#555] font-bold px-1 leading-relaxed">
               By clicking register, you agree to our <Link href="#" className="text-[#e8612c] hover:underline">Terms of Service</Link> and verify you are over 18.
            </p>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-[#e8612c] to-[#f97316] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register Now
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
             <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-[#1a1a1a]" />
                <span className="text-[10px] font-black text-[#333] uppercase tracking-widest">Social Gateway</span>
                <div className="flex-1 h-px bg-[#1a1a1a]" />
             </div>
             
              <button className="w-full bg-[#111] border border-[#1a1a1a] hover:bg-[#1a1a1a] py-4 rounded-2xl flex items-center justify-center gap-3 transition-all group">
                <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} className="grayscale group-hover:grayscale-0 transition-all" />
                <span className="text-[10px] font-black text-[#888] group-hover:text-white uppercase tracking-widest">Sign up with Google</span>
              </button>
          </div>

          <p className="mt-8 text-center text-xs text-[#555] font-bold">
            Already have an account? {' '}
            <Link href="/auth/login" className="text-[#e8612c] font-black uppercase hover:underline tracking-tight">Login Instead</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
