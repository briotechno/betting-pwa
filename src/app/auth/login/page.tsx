'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Lock, User, Phone, CheckCircle2, ShieldCheck, ChevronRight, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { authController } from '@/controllers/auth'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()

  const [loginMode, setLoginMode] = useState<'mobile' | 'userId'>('mobile')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    identifier: '', // Can be phone or userId
    password: '',
    rememberMe: false
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authController.login({
        username: formData.identifier,
        password: formData.password,
        ip: '127.0.0.1', // Placeholder IP
      })

      if (response.error === '0') {
        const user = {
          id: response.UserId || '1',
          username: formData.identifier,
          email: '',
          balance: parseFloat(response.balance || '0'),
          tier: 'Beginner' as const,
          loginToken: response.LoginToken
        }
        
        setUser(user)
        setToken(response.LoginToken)
        
        showSnackbar('Logged in successfully.', 'success')
        router.push('/')
      } else {
        showSnackbar(response.msg || 'Login failed. Please check your credentials.', 'error')
      }
    } catch (error) {
      showSnackbar('An error occurred during login. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
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

      <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center">
        {/* Top Logo */}
        <div className="mb-4">
          <Link href="/" className="flex flex-col items-center">
            <img
              src="https://www.fairplay247.vip/_nuxt/img/fairplay-website-logo.09a29c5.png"
              alt="Fairplay Logo"
              className="h-[4.5rem] object-contain drop-shadow-lg"
            />
          </Link>
          <p className="text-[8px] sm:text-[9px] text-center text-white/70 font-black tracking-[0.15em] mt-1 uppercase block">GREATER ODDS. GREATER WINNINGS</p>
        </div>

        {/* Login Container */}
        <div className="w-full bg-black/60 backdrop-blur-sm border-[1.5px] border-[#e8612c] rounded-md p-6 sm:p-8 shadow-2xl overflow-visible relative group">
          {/* Subtle border glow */}
          <div className="absolute inset-0 pointer-events-none rounded-md group-focus-within:bg-white/5 transition-colors" />

          {/* Floating WhatsApp */}

          <form onSubmit={handleLogin} className="space-y-7 pt-4">

            {/* Input Wrapper with Underline style */}
            <div className="space-y-6">
              {/* Account Input */}
              <div className="relative border-b border-white/20 pb-1 focus-within:border-white transition-colors">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="text-white"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>

                  <ChevronDown size={14} className="text-white ml-2" />
                  <div className="h-6 w-[1px] bg-white/20 mx-1"></div>

                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    className="flex-1 bg-transparent text-sm font-medium text-white placeholder-white/70 outline-none py-1"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              <Link href="/auth/forgot-password" className="text-[12px] text-white font-bold uppercase tracking-tight hover:underline">Forgot Password?</Link>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer group/check">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <div className={`w-[20px] h-[20px] rounded-[4px] border-[1.5px] transition-colors flex items-center justify-center ${formData.rememberMe ? 'bg-black border-[#e8612c]' : 'bg-black border-[#e8612c] group-hover/check:border-[#ff7a45]'}`}>
                  {formData.rememberMe && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#e8612c]" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span className="text-[13px] text-white/90 font-medium select-none">Remember Me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[45px] bg-[#e8612c] text-white rounded-[4px] text-[15px] font-bold uppercase hover:bg-[#ff7a45] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-4 shadow-lg shadow-orange-900/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#9e9589]/30 border-t-[#9e9589] rounded-full animate-spin" />
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
                <span className="  px-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">or login with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="relative">
              <button type="button" className="w-full h-[40px] bg-white rounded-[4px] flex items-center justify-center gap-2 transition-all hover:bg-gray-100 shadow-md">
                <Image src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
                <span className="text-[14px] font-bold text-black">Google</span>
              </button>
            </div>

            {/* Signup Link */}
            <p className="text-center text-[13px] text-white/80 font-medium mt-6 pb-2">
              Not a member? <Link href="/auth/signup" className="text-[#e8612c] font-black hover:underline tracking-tight ml-2 uppercase">Join Now</Link>
            </p>

            {/* Guest Link */}
            <p className="text-center text-[13px] pb-4 -mt-2">
              <Link href="/" className="text-[#e8612c] font-medium underline tracking-tight transition-all hover:text-[#ff7a45]">Continue as Guest</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
