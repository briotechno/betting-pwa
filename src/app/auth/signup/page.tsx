'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Lock, User, Phone, CheckCircle2, ShieldCheck, ChevronRight, Gift, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authController } from '@/controllers/auth'
import { useSnackbarStore } from '@/store/snackbarStore'

export default function SignupPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()

  const [step, setStep] = useState<'register' | 'otp'>('register')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
    promotionalEmails: true,
    legalAgeAccepted: true
  })

  const [usernameStatus, setUsernameStatus] = useState<{ loading: boolean; available: boolean | null; msg: string }>({
    loading: false,
    available: null,
    msg: ''
  })

  const handleUsernameCheck = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus({ loading: false, available: null, msg: '' });
      return;
    }

    setUsernameStatus(prev => ({ ...prev, loading: true }));
    try {
      const res = await authController.checkUsername(username);
      if (res.error === '0') {
        setUsernameStatus({ loading: false, available: true, msg: 'Username available' });
      } else {
        setUsernameStatus({ loading: false, available: false, msg: res.msg || 'Username already exists' });
      }
    } catch (err) {
      setUsernameStatus({ loading: false, available: null, msg: 'Error checking username' });
    }
  }

  const [passwordError, setPasswordError] = useState('')

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters long";
    if (!hasUpperCase) return "At least one uppercase letter (A-Z)";
    if (!hasLowerCase) return "At least one lowercase letter (a-z)";
    if (!hasSpecialChar) return "At least one special character (!@#$%^&*)";
    
    return "";
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const passErr = validatePassword(formData.password);
    if (passErr) {
      setPasswordError(passErr);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showSnackbar("Passwords do not match!", "error")
      return
    }

    if (usernameStatus.available === false) {
      showSnackbar("Please choose a different username", "error")
      return
    }
    
    setLoading(true)
    try {
      const res = await authController.sendOtp(formData.phone)
      if (res.error === '0') {
        setStep('otp')
        showSnackbar("OTP sent successfully", "success")
      } else {
        showSnackbar(res.msg || "Failed to send OTP", "error")
      }
    } catch (err) {
      showSnackbar("An error occurred. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await authController.createUser({
        username: formData.username,
        password: formData.password,
        mobile: formData.phone,
        otp: formData.otp
      })

      if (response.error === '0') {
        showSnackbar("Registration successful!", "success")
        const user = {
          id: response.UserId || '2',
          username: formData.username,
          email: '',
          balance: 0,
          tier: 'Beginner' as const,
          loginToken: response.apitoken
        }
        
        setUser(user)
        setToken(response.apitoken)
        router.push('/')
      } else {
        showSnackbar(response.msg || "Verification failed", "error")
      }
    } catch (error) {
      showSnackbar("An error occurred. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setOtpLoading(true)
    try {
      const res = await authController.sendOtp(formData.phone)
      if (res.error === '0') {
        showSnackbar("OTP resent successfully", "success")
      } else {
        showSnackbar(res.msg || "Failed to resend OTP", "error")
      }
    } finally {
      setOtpLoading(false)
    }
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
        <div className="w-full bg-black/60 backdrop-blur-sm border-[1.5px] border-[#e8612c] rounded-md p-6 sm:p-8 shadow-2xl overflow-visible relative group min-h-[400px]">
          {/* Subtle border glow */}
          <div className="absolute inset-0 pointer-events-none rounded-md group-focus-within:bg-white/5 transition-colors" />

          {step === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-6 relative z-10 pt-4">
              {/* Username Input */}
              <div className="relative border-b border-white/20 pb-1 group/input focus-within:border-white transition-colors">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-white" />
                  <input
                    type="text"
                    required
                    placeholder="Username*"
                    className="flex-1 bg-transparent text-sm font-medium text-white placeholder-white/40 outline-none"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value });
                      handleUsernameCheck(e.target.value);
                    }}
                  />
                  {usernameStatus.loading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {usernameStatus.available === true && <CheckCircle2 size={14} className="text-green-500" />}
                </div>
                {usernameStatus.msg && (
                  <span className={`absolute right-0 bottom-[-14px] text-[10px] font-bold ${usernameStatus.available ? 'text-green-500' : 'text-red-500'}`}>
                    {usernameStatus.msg}
                  </span>
                )}
              </div>

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
                <span className="absolute right-0 bottom-1 text-[10px] text-white/20 font-bold">{formData.phone.length}/10</span>
              </div>

              {/* Password Input */}
              <div className="relative border-b border-white/20 pb-1 focus-within:border-white transition-colors mt-2">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-white" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password*"
                    className="flex-1 bg-transparent text-sm font-medium text-white placeholder-white/40 outline-none"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (passwordError) setPasswordError(validatePassword(e.target.value));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <span className="absolute left-0 bottom-[-14px] text-[10px] font-bold text-red-500">
                    {passwordError}
                  </span>
                )}
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
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                className="w-full h-[46px] bg-[#e8612c] text-white rounded-[4px] text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-[#ff7a45] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-6 shadow-lg shadow-orange-900/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Register"
                )}
              </button>

              {/* Login Link */}
              <p className="text-center text-[13px] text-white/50 font-bold mt-6 pb-2">
                Already a member? <Link href="/auth/login" className="text-[#e8612c] font-black hover:underline tracking-tight ml-1">Login</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtpConfirm} className="space-y-8 relative z-10 pt-10 px-4 md:px-10">
              <p className="text-center text-white/90 font-medium text-[15px]">Please check your Mobile Number for code.</p>

              {/* Mobile Display */}
              <div className="relative border-b border-white/20 pb-2">
                <div className="flex items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 font-bold uppercase">Mobile Number*</span>
                    <span className="text-white text-lg font-medium tracking-wide">{formData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Code Input */}
              <div className="relative border-b border-[#e8612c] pb-2">
                <div className="flex items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e8612c]">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <div className="flex-1">
                    <span className="text-[13px] text-[#e8612c] font-bold block">Code</span>
                    <input
                      type="text"
                      maxLength={4}
                      autoFocus
                      required
                      className="w-full bg-transparent text-white text-lg font-bold outline-none pt-1"
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    />
                  </div>
                </div>
                <div className="absolute right-0 bottom-2 text-[11px] text-[#e8612c] font-bold">
                  {formData.otp.length}/4
                </div>
                <p className="absolute left-0 -bottom-5 text-[10px] text-[#e8612c] font-medium italic">Please check your mobile number for OTP</p>
              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                disabled={loading || formData.otp.length < 4}
                className="w-full h-[48px] bg-white/10 text-white/40 rounded-full text-[14px] font-bold uppercase tracking-[0.1em] border border-white/5 hover:bg-white/20 hover:text-white transition-all enabled:bg-[#e8612c] enabled:text-white enabled:border-transparent mt-12"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  "Confirm"
                )}
              </button>

              {/* Resend Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={otpLoading}
                  className="text-[#e8612c] text-[13px] font-bold uppercase hover:underline tracking-widest disabled:opacity-50"
                >
                  {otpLoading ? "Sending..." : "Resend Code"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
