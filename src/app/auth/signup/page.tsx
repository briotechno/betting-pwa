'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Lock, User, Phone, CheckCircle2, ShieldCheck, ChevronRight, Gift, ChevronDown } from 'lucide-react'
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
    referralCode: '',
    promotionalEmails: true,
    legalAgeAccepted: true
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
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Dynamic Stadium Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: 'url("/signup-bg.png")',
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-[650px] lg:max-w-[700px] relative z-10 flex flex-col items-center">
        {/* Top Logo */}
        <div className="mb-4">
          <Link href="/" className="flex flex-col items-center">
            <img
              src="https://www.fairplay247.vip/_nuxt/img/fairplay-website-logo.09a29c5.png"
              alt="Fairplay Logo"
              className="h-[4.5rem] object-contain drop-shadow-lg"
            />
          </Link>
          <p className="text-[9px] text-center text-white/50 font-black uppercase tracking-[0.25em] mt-1 pr-4">Greater Luck <span className="text-white/40">Greater Wins</span></p>
        </div>

        {/* Signup Container */}
        <div className="w-full bg-black/60 backdrop-blur-sm border-[1.5px] border-[#e8612c] rounded-md p-6 sm:p-8 shadow-2xl overflow-visible relative group">
          {/* Subtle border glow */}
          <div className="absolute inset-0 pointer-events-none rounded-md group-focus-within:bg-white/5 transition-colors" />

          {/* Floating WhatsApp */}


          <form onSubmit={handleSignup} className="space-y-6 relative z-10 pt-4">
            {/* Phone Input with Country Select */}
            <div className="relative border-b border-white/20 pb-1 group/input focus-within:border-white transition-colors">
              <div className="flex items-center gap-3">
                <select className="bg-transparent text-sm font-black text-white outline-none appearance-none cursor-pointer">
                  <option value="IN">IN</option>
                </select>
                <ChevronRight size={14} className="text-white/40 rotate-90 -ml-2" />
                <input
                  type="tel"
                  required
                  placeholder="Mobile*"
                  className="flex-1 bg-transparent text-sm font-medium text-white placeholder-white/40 outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <span className="absolute right-0 bottom-1 text-[10px] text-white/20 font-bold">0/10</span>
            </div>

            {/* Password Input */}
            <div className="relative border-b border-white/20 pb-1 focus-within:border-white transition-colors">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-white" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password*"
                  className="flex-1 bg-transparent text-sm font-medium text-white placeholder-white/40 outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="relative border-b border-white/20 pb-1 focus-within:border-white transition-colors">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-white" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Confirm Password*"
                  className="flex-1 bg-transparent text-sm font-medium text-white placeholder-white/40 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group/check">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.promotionalEmails}
                  onChange={(e) => setFormData({ ...formData, promotionalEmails: e.target.checked })}
                />
                <div className={`mt-0.5 w-[18px] h-[18px] rounded-[4px] border-[1.5px] transition-colors flex items-center justify-center shrink-0 ${formData.promotionalEmails ? 'bg-black border-[#e8612c]' : 'bg-black border-[#e8612c] group-hover/check:border-[#ff7a45]'
                  }`}>
                  {formData.promotionalEmails && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-[#e8612c]" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span className="text-[11px] text-white/80 font-medium leading-tight select-none pt-0.5">I'd like to receive promotional emails and newsletter</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group/check">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.legalAgeAccepted}
                  onChange={(e) => setFormData({ ...formData, legalAgeAccepted: e.target.checked })}
                />
                <div className={`mt-0.5 w-[18px] h-[18px] rounded-[4px] border-[1.5px] transition-colors flex items-center justify-center shrink-0 ${formData.legalAgeAccepted ? 'bg-black border-[#e8612c]' : 'bg-black border-[#e8612c] group-hover/check:border-[#ff7a45]'
                  }`}>
                  {formData.legalAgeAccepted && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-[#e8612c]" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span className="text-[11px] text-white/80 font-medium leading-tight select-none pt-0.5">
                  I am of legal age 18+ to gamble and I accept the <span className="text-[#e8612c] underline">Terms And Conditions</span> & <span className="text-[#e8612c] underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.legalAgeAccepted}
              className="w-full h-[46px] bg-white/10 text-[#9e9589] rounded-full text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-white/20 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#9e9589]/30 border-t-[#9e9589] rounded-full animate-spin" />
              ) : (
                "Register"
              )}
            </button>

            {/* Social Divider */}
            <div className="relative py-2 mt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="  px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">or register with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="relative">
              <button type="button" className="w-full h-10 bg-white rounded-md flex items-center justify-center gap-3 transition-all hover:bg-gray-100 shadow-md">
                <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} />
                <span className="text-[13px] font-bold text-gray-700">Google</span>
              </button>

              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="absolute -bottom-[3.25rem] -left-2 w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg cursor-pointer">
                <img src="/whatsapp.png" alt="WhatsApp" className="w-[42px] h-[42px] object-cover" />
              </a>
            </div>

            {/* Login Link */}
            <p className="text-center text-[13px] text-white/50 font-bold mt-6 pb-2">
              Already a member? <Link href="/auth/login" className="text-[#e8612c] font-black hover:underline tracking-tight ml-1">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
