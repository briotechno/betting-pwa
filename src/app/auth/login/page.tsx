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
  const [showErrors, setShowErrors] = useState(false)

  const [formData, setFormData] = useState({
    identifier: '', // Can be phone or userId
    password: '',
    rememberMe: false
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowErrors(formData.identifier === '' || formData.password === '')
    
    if (formData.identifier === '' || formData.password === '') {
      return
    }

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
          exposure: parseFloat(response.exposure || '0'),
          availableBalance: parseFloat(response.available_balance || response.balance || '0'),
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

  const isFormValid = formData.identifier.length > 0 && formData.password.length > 0

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
        {/* <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" /> */}
      </div>

      <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center">
        {/* Login Container */}
        <div className="w-full bg-black/80 backdrop-blur-sm border-[1.5px] border-[#e8612c] rounded-md p-6 sm:p-8 shadow-2xl overflow-visible relative group">
          {/* Subtle border glow */}
          <div className="absolute inset-0 pointer-events-none rounded-md group-focus-within:bg-white/5 transition-colors" />

          {/* Top Logo - Now inside container */}
          <div className="mb-10 flex flex-col items-center">
            <Link href="/" className="flex flex-col items-center">
              <img
                src="https://www.fairplay247.vip/_nuxt/img/fairplay-website-logo.09a29c5.png"
                alt="Fairplay Logo"
                className="h-[4.5rem] object-contain drop-shadow-lg"
              />
            </Link>
            {/* <p className="text-[8px] sm:text-[9px] text-center text-white/70 font-black tracking-[0.15em] mt-1 uppercase block">GREATER ODDS. GREATER WINNINGS</p> */}
          </div>

          <form onSubmit={handleLogin} className="space-y-3">

            {/* Input Wrapper with Underline style */}
            <div className="space-y-5">
              {/* Username Input */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 min-w-[32px]">
                    <User size={18} className="text-white" />
                    <ChevronDown size={14} className="text-white opacity-80" />
                  </div>
                  <div className={`flex-1 relative border-b pb-1 transition-colors ${showErrors && !formData.identifier ? 'border-[#ff4d4d]' : 'border-white/20'}`}>
                    <input
                      type="text"
                      required
                      placeholder="Username"
                      className={`w-full bg-transparent text-sm font-normal text-white outline-none transition-colors ${showErrors && !formData.identifier ? 'placeholder-[#ff4d4d]' : 'placeholder-white/70'}`}
                      value={formData.identifier}
                      onChange={(e) => {
                        setFormData({ ...formData, identifier: e.target.value })
                        if (showErrors && e.target.value) setShowErrors(false)
                      }}
                    />
                  </div>
                </div>
                {showErrors && !formData.identifier && (
                  <p className="text-[11px] text-[#ff4d4d] font-normal leading-none pl-[44px]">This field is required</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center min-w-[32px]">
                    <Lock size={18} className={showErrors && !formData.password ? 'text-[#ff4d4d]' : 'text-white'} />
                  </div>
                  <div className={`flex-1 relative border-b pb-1 flex items-center gap-3 transition-colors ${showErrors && !formData.password ? 'border-[#ff4d4d]' : 'border-white/20'}`}>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Password"
                      className={`flex-1 bg-transparent text-sm font-normal text-white outline-none transition-colors ${showErrors && !formData.password ? 'placeholder-[#ff4d4d]' : 'placeholder-white/40'}`}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value })
                        if (showErrors && e.target.value) setShowErrors(false)
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={showErrors && !formData.password ? 'text-[#ff4d4d]' : 'text-white/40 hover:text-white'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {showErrors && !formData.password && (
                  <p className="text-[11px] text-[#ff4d4d] font-normal leading-none pl-[44px]">Password is required</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Link href="/auth/forgot-password" title="Forgot Password" id="forgot-password-link" className="text-[12px] text-white font-normal uppercase tracking-tight hover:underline">FORGOT PASSWORD?</Link>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer group/check">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <div className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] transition-colors flex items-center justify-center ${formData.rememberMe ? 'bg-black border-[#e8612c]' : 'bg-black border-[#e8612c] group-hover/check:border-[#ff7a45]'}`}>
                  {formData.rememberMe && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-[#e8612c]" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span className="text-[13px] text-white/90 font-normal select-none">Remember Me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-[48px] rounded-[6px] text-[15px] font-medium uppercase transition-all flex items-center justify-center mt-1 border ${isFormValid 
                ? 'bg-[#f36c21] text-white border-[#f36c21] hover:brightness-110 shadow-lg shadow-orange-900/20' 
                : 'bg-white/10 text-white/40 border-white/5 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "LOGIN"
              )}
            </button>

            {/* Social Divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent px-3 text-[12px] font-normal text-white/70 tracking-tight">or log in with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="relative">
              <button type="button" className="w-full h-[40px] bg-white rounded-[4px] flex items-center justify-center gap-2 transition-all hover:bg-gray-100 shadow-md">
                <Image src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
                <span className="text-[14px] font-normal text-black">Google</span>
              </button>
            </div>

            <p className="text-center text-[13px] text-white/50 font-normal mt-2 pb-1">
              Not a member? <Link href="/auth/signup" className="text-[#f36c21] font-normal hover:underline tracking-tight ml-2 border-b border-transparent hover:border-[#f36c21]">JOIN NOW</Link>
            </p>

            {/* Guest Link */}
            <p className="text-center text-[13px] pb-2 mt-1">
              <Link href="/" className="text-[#f36c21] font-normal underline tracking-tight transition-all">Continue as Guest</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
