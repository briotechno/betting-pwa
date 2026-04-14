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
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null)

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
          exposure: 0,
          availableBalance: 0,
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

      </div>

      <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
        {/* Top Logo */}
        <div className="mb-2">
          <Link href="/" className="flex flex-col items-center">
            <img
              src="https://www.fairplay247.vip/_nuxt/img/fairplay-website-logo.09a29c5.png"
              alt="Fairplay Logo"
              className="h-[3.5rem] sm:h-[4.5rem] object-contain drop-shadow-lg"
            />
          </Link>
          <p className="text-[8px] sm:text-[9px] text-center text-white/50 font-black uppercase tracking-[0.25em] mt-1 pr-4">Greater Luck <span className="text-white/40">Greater Wins</span></p>
        </div>

        {/* Signup Container */}
        <div className="w-full bg-black/80 backdrop-blur-sm border-[1.5px] border-[#e8612c] rounded-md p-5 sm:p-8 shadow-2xl overflow-visible relative group min-h-[350px]">
          {/* Subtle border glow */}
          <div className="absolute inset-0 pointer-events-none rounded-md group-focus-within:bg-white/5 transition-colors" />

          {step === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 relative z-10 pt-2">
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
                    I am of legal age 18+ to gamble and I accept the <span onClick={() => setActiveModal('terms')} className="text-[#e8612c] underline cursor-pointer">Terms And Conditions</span> & <span onClick={() => setActiveModal('privacy')} className="text-[#e8612c] underline cursor-pointer">Privacy Policy</span>.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              {(() => {
                const passwordsMatch = formData.password === formData.confirmPassword;
                const passwordValid = validatePassword(formData.password) === "";
                const isFormEmpty = !formData.username && !formData.phone && !formData.password && !formData.confirmPassword;
                const isFormComplete = formData.username && formData.phone && formData.password && formData.confirmPassword && formData.legalAgeAccepted;
                
                // Show Gray (Image 2) if there are specific errors (mismatch or invalid format)
                // BUT only if the user has started typing (not empty)
                const hasError = (!isFormEmpty && (!passwordsMatch || !passwordValid));
                
                // User's specific rule: Image 1 when no data or all data. Image 2 when error/mismatch.
                const showImage1 = isFormEmpty || (isFormComplete && passwordValid && passwordsMatch);

                return (
                  <button
                    type="submit"
                    disabled={loading || (!isFormEmpty && !showImage1)}
                    className={`w-full h-[52px] rounded-full text-[15px] font-bold uppercase tracking-widest transition-all flex items-center justify-center mt-6 shadow-lg ${
                      showImage1 
                        ? 'bg-[#4caf50] text-white hover:brightness-110 shadow-green-900/20' 
                        : 'bg-white/10 text-white/40 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Register"
                    )}
                  </button>
                );
              })()}

              {/* Social Divider */}
              <div className="relative py-2 mt-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-transparent px-3 text-[11px] font-normal text-white/50 lowercase tracking-tight">or register with</span>
                </div>
              </div>

              {/* Google Button */}
              <button 
                type="button"
                className="w-full h-[44px] bg-white rounded-[6px] flex items-center justify-center gap-3 border-[1.5px] border-[#e8612c] hover:bg-gray-50 transition-colors shadow-lg"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                <span className="text-[14px] font-bold text-black">Google</span>
              </button>

              {/* WhatsApp Icon */}
              <div className="flex justify-start pt-1">
                <a 
                  href="https://wa.me/yournumber" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <img 
                    src="/whatsapp.png" 
                    alt="WhatsApp Support" 
                    className="w-[38px] h-[38px] object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/3670/3670051.png"
                    }}
                  />
                </a>
              </div>

              {/* Login Link */}
              <p className="text-center text-[12px] text-white/70 font-normal mt-2 pb-1">
                Already a member? <Link href="/auth/login" className="text-[#e8612c] font-normal hover:underline tracking-tight ml-1">Login</Link>
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

      {/* Legal Modal (Terms or Privacy) */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[540px] h-full max-h-[85vh] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-gray-800 leading-none">
                {activeModal === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
              </h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar text-[#444] leading-relaxed">
              {activeModal === 'terms' ? (
                <div className="space-y-6 text-[13px] font-medium text-gray-600 leading-relaxed">
                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">I. Fairplay.CLUB</h2>
                    <div className="space-y-4">
                      <p>By subscribing/registering to/on our Fairplay.club website, and its sub-domains (collectively referred to as “Fairplay site”) and/or any services including, registering and playing betting games, participating in betting contests and tournaments, provided on the Fairplay site, you agree that you have read, understood and have agreed to be bound by this Terms and Conditions, regardless of how you subscribe to or use the services.</p>
                      <p>Please note that this Privacy Policy will be agreed between you and Fairplay. (‘We’, ‘Us’ or ‘Our’, as appropriate). This Privacy Policy is an integrated part of Fairplay’s Terms and Conditions. We may periodically make changes to this Privacy Policy and will notify you of these changes by posting the modified terms on our platforms. We recommend that you revisit this Privacy Policy regularly. Please read the Terms carefully and if you do not accept the Terms, do not use, visit or access any part (including, but not limited to, sub-domains, source code and/or website APIs, whether visible or not) of the Fairplay site. The Terms shall also apply to all telephone betting and betting or gaming via mobile devices including downloadable applications to a mobile device (as if references to your use of the Website were references to your use of our telephone betting and/or mobile devices betting facilities). “We”, “us”, “our”, “Fairplay” shall mean Win Ventures NV and/or any of its affiliated entities. For the purpose of these Terms and Conditions, wherever the context so require "you" or "your" or "User" or “Participant” shall mean any natural or legal person who has agreed to become a member of the Fairplay site by visiting the Fairplay site as registered User or a person who has used the Fairplay site either through browsing or otherwise. Where you play any game, or place a bet or wager, using the Website, you accept and agree to be bound by, the Rules which apply to the applicable products available on the Website from time to time.</p>
                      <p>Fairplay one stop shop for leisure gambling games including Baccarat, Teen Patti, Roulette, Poker, Blackjack and sports betting through which it offers cricket based, football, tennis, horse racing based online betting games along with live casino betting. The Fairplay site is neither affiliated by nor associated to any sort of private or government Sports leagues and tournaments until and unless expressly stated by Fairplay. In addition to this, the Fairplay app is not related and does not claim any official status with any of the official or non-official sports teams and/or sportspersons.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">II. USER REGISTRATION</h2>
                    <div className="space-y-4">
                      <p>To participate in Fairplay activities, you must register by creating a Fairplay club account by providing your true information. In the event you wish to play on the Fairplay site you shall create an account with us. You shall do so after completing the registration process by: 1. Providing true, accurate, correct and complete information as prompted by the applicable registration form. 2. Maintaining and updating true, accurate, correct and complete information provided by you during the registration process.</p>
                      <p>You shall be required to choose a username and password. You shall be solely responsible for maintaining the confidentiality of your account username and password. You shall be solely responsible for the registration information provided by you during submissions and the consequences of posting or publishing them. Fairplay is only acting as a repository of data and makes no guarantee as to the validity, accuracy, or legal status of any information / submissions.</p>
                      <p>If, at any time, Fairplay believes that your account and password is being misused in any manner, or that the information provided by you during the above stated registration process is not true, inaccurate or incomplete, then Fairplay reserves the right to terminate/cancel or suspend your account and block your access to the Fairplay site. You shall be solely and exclusively responsible for any and/or all the activities that are carried through your account. You agree to notify Fairplay of any unauthorized use of your account and/or any breach of security please contact us at chat. Fairplay shall not be liable for any loss that you may incur as a result of another person(s) using your account username and/or password and / or your failure to comply with this section. You shall be solely and exclusively liable for all the losses to Fairplay and/or other claims, damages, fines due to such an unauthorized use.</p>
                      <p>If Fairplay charges you a platform fee (facilitation fee) in respect of any Fairplay services, Fairplay shall, without delay, refund such platform fee in the event of suspension and/or termination of your account or Fairplay services on account of any fault on the part of Fairplay. It is hereby clarified that no refund shall be payable if such suspension and/or termination is affected due to any breach or failure to adhere any of these Terms and Conditions, Privacy Policy and/or any other rules by the you, the User, or a person(s) accessing your account by using your username and password; or any circumstances beyond the reasonable control of Fairplay.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">III. REGISTRATION AND PARTICIPANTS</h2>
                    <div className="space-y-4">
                      <p>The games/tournaments/contests available on the Fairplay site are open only to persons aged eighteen (18) years or above at the date of usage and/or registration, who are participating from jurisdiction where gaming on Fairplay is permitted. Employees of Fairplay, Play Ventures NV, their associated, affiliated and subsidiary companies and their families, agents, game sponsors, and any person connected with Fairplay are excluded from participating in the game and/or winning a prize. By taking part in a game (excluding administering the game) on the Fairplay site, Users/Participants warrant that all information submitted by them is true, accurate and complete proof of age may be required. Where this is not the case, we reserve the right to suspend the account and treat any deposits into the gambling account as being invalid (and any winnings arising from such deposit as void). Where an account is suspended, the relevant customer may contact us at chat seeking details regarding the same. The sole discretion to declare a User ineligible to participate shall vest with Fairplay. Users/Participants who wish to participate shall have a valid email address. In order to register for the betting games, Users/Participants are required to accurately provide the following information: Full Name, E-mail address, Password, Gender, Date of birth.</p>
                      <p>As part of the registration process, we may supply your information details to authorized credit reference agencies to confirm your identity and payment card details. You agree that we may process such information in connection with your registration. Participants may open only one account; in case we identify any customer with more than one account we reserve the right to treat any such accounts as one joint account. Participant must keep their registration and account details up to date. This, and your account information, may be amended in the personal section of the Website. If you require any assistance, please contact us at chat.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">IV. ACCOUNT DETAILS</h2>
                    <div className="space-y-4">
                      <p>Fairplay allows all its users to choose their own Username and Password combination for their account. Users must keep this information secret and confidential as you are responsible for all bets/wagers placed on your account and any other activities taking place on your account. Bets will stand if your Username and Password have been entered correctly or if your account has been accessed via Touch ID, Fingerprint log in, Face ID, Passcode, subject to there being sufficient funds in the account.</p>
                      <p>If, at any time, you feel a third party is aware of your Username, Password you should change it immediately via the Fairplay site. In case you forget part or all of your combination, contact us at chat or avail the Chat support made available for Users on the Platform. If you activate Touch ID, Fingerprint log in, Face ID, Passcode and feel that a third party could be accessing your account via any of these methods then you should immediately disable Touch ID, Fingerprint log in, Face ID, Passcode from all of your devices and contact us at chat. You are responsible for the security of your device(s) and for all bets/wagers placed on your account and any other activities taking place on your account.</p>
                      <p>If you nominate another person as an authorized user of your account, you shall be responsible for all transactions such person makes using the relevant account details. Should you lose your account details or feel that someone else may have your account details, please contact us at chat. Please note that cardholder details and any other sensitive data should never be sent to us by unencrypted email. The current balance and transaction history of your account may be viewed at any time once you have logged into your account on the Website.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">V. SUSPENSION AND CLOSURE</h2>
                    <div className="space-y-4">
                      <p>Reach out to us at chat in case of closure of accounts. Any negative balance on your behalf will be immediately due and payable to Fairplay, and your account will not be closed until the relevant amount owed to Fairplay is paid in full. Fairplay reserves the right to close or suspend your account at any time and for any reason including any violation of laws, if a user is participating on the Fairplay site illegally. Without limiting the preceding sentence, Fairplay shall be entitled to close or suspend your account if: 1. Fairplay considers that you have used the Website in a fraudulent manner or for illegal and/or unlawful or improper purposes; 2. Fairplay considers that you have used the Website in an unfair manner, have deliberately cheated or taken unfair advantage of Fairplay or any of its customers or if your account is being used for the benefit of a third party; 3. Fairplay considers that you have opened or are using any additional accounts to conceal your activity or to avoid measures put in place on other active or inactive accounts; 4. Fairplay considers that you have deliberately provided incomplete or inaccurate information when registering with the site or during of our verification processes; 5. Fairplay is requested to do so by the police, any governmental or other regulatory authority, court or other authority of competent jurisdiction, law or applicable regulation; 6. Fairplay considers that any of the events referred to in (i) to (iv) above may have occurred or are likely to occur; or 7. you become bankrupt; 8. you are in breach of Fairplay’s Responsible Gaming Policy and/or Fairplay determines that your continued participation may be detrimental to your health; 9. your account is deemed to be dormant and its balance is, or reaches zero or is otherwise closed in accordance with the Terms and Conditions listed herein.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">VI. FINANCES</h2>
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-700">A. Deposits And Wagers</h4>
                      <p>You may only bet/wager with the amount of cleared funds held in your account. Accordingly, if you want to place bets or participate in gaming, you must deposit monies into your account. By depositing funds into your account, you direct us and we agree to hold them, along with any winnings, for the sole and specific purpose of using them (i) to place your sporting and gaming stakes; and (ii) settling any fees or charges that you might incur in connection with the use of our services (Purpose). We shall be entitled to suspend or close your account if we reasonably consider or have reason to believe that you are depositing funds without any intention to place sporting and/or gaming stakes. In such circumstances we may also report this to relevant authorities.</p>
                      <h4 className="font-bold text-gray-700">B. Withdrawals</h4>
                      <p>1. All withdrawals will be processed to the payment account from which the deposits were made. Withdrawal payments can only be made in the name of and to the registered account holder. 2. For most payment types, withdrawals can be processed by clicking 'Withdraw' on the Website, subject to there being sufficient funds in your betting account. There is no set maximum withdrawal amount per day. 3. If the value of a deposit is not played through in full before a withdrawal is requested, Fairplay reserves the right to make a charge to the customer’s account to cover all reasonable costs relating to both the deposit and withdrawal.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">VII. BETTING PROCEDURES</h2>
                    <div className="space-y-4">
                      <p>It is the responsibility of the customer to ensure details of their bets/wagers are correct. Once bets/wagers have been placed they may not be cancelled by the customer. Bets can only be changed by the customer using our Edit Bet feature, where this is available. Fairplay reserves the right to cancel any bet/wager at any time.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">VIII. USE OF THE Fairplay SITE</h2>
                    <div className="space-y-4">
                      <p>All materials provided on the Fairplay site, including but not limited to all information, materials, functions, text, logos, designs, graphics, images, sounds, software, documents, products and services (collectively, the "Materials"), and the selection, arrangement and display thereof, are the copyrighted works of Fairplay and/or its vendors and/or suppliers.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">IX. PROHIBITED USE AND FAIR PLAY POLICY</h2>
                    <div className="space-y-4">
                      <p>As a condition of your use of the Fairplay site, you shall not use the Fairplay site for any purpose that is unlawful or prohibited under these Terms and Conditions or under any relevant laws, statutes, order, ordinances and regulations.</p>
                      <p>We at Fairplay consider the Fair play of online betting game/tournament/contest of utmost importance. In order to prevent any form of fraud or unfair play in our games/contests/tournaments or on our site - all User actions including - deposits/identity verification/Betting Games/Tournaments/Contests are monitored to ensure a safe, legal and fair environment for you (the Users/Participants).</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">X. LEGALITY</h2>
                    <p>The User’s/Participant’s use of the Fairplay site and software is also subject to relevant legislations which apply to the User on the basis of the location from which he/she accesses the Fairplay site. Fairplay makes no representations or warranties, implicit or explicit, as to the User’s legal right to participate.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">XI. USER CONDUCT</h2>
                    <p>You agree to abide by these Terms and Conditions and all other rules, regulations of the Fairplay Website and/or App. You shall not register or operate more than one User account with Fairplay. Any password issued by Fairplay to you shall not be revealed to anyone else.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">XII. PARTICIPATION IN CONTESTS</h2>
                    <p>By entering a Contest, User/Participant agrees to be bound by these Terms and the decisions of Fairplay. Subject to the terms and conditions stipulated herein below, the Company, at its sole discretion, may disqualify any User/Participant from a Contest.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">XIII. INTELLECTUAL PROPERTY</h2>
                    <p>Unless otherwise stated, copyright and/or all intellectual property rights in all materials on the Fairplay site trademarks and logos appearing on the Fairplay site are the properties of Fairplay and are owned & controlled by us.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">XIV. LIMITATIONS OF LIABILITY</h2>
                    <p>Users shall access the Fairplay Services provided on Fairplay voluntarily and at their own risk. Fairplay shall, under no circumstances be held responsible or liable on account of any loss or damage sustained by Users or any other person or entity.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">XXIV. INDEMNITY</h2>
                    <p>You agree to defend, indemnify and hold harmless Fairplay, its officers, directors, employees and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses arising from your use of the site.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">XXV. GOVERNING LAW AND JURISDICTION</h2>
                    <p>The relevant and applicable laws of Curacao are to be adhered to by the users under these Terms and Conditions.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">XXVI. DISPUTE RESOLUTION</h2>
                    <p>The courts or tribunals of competent jurisdiction at Curacao shall have jurisdiction to determine any and all disputes arising out of, or in connection with, the Fairplay Services provided by Fairplay.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">XXVII. BREACH AND CONSEQUENCES</h2>
                    <p>If we have evidence of a breach of our Terms and Conditions, we reserve the right in our sole discretion to take actions including permanent suspension or termination of your user account.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">XXXIV. WAIVER</h2>
                    <p>No waiver of any terms of these Terms and Conditions shall be deemed a further or continuing waiver of such term or any other term.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">XXXV. RELATIONSHIP</h2>
                    <p>None of the provisions of the Terms and Conditions shall be deemed to constitute a partnership or agency between you and Fairplay and you shall have no authority to bind Fairplay in any manner, whatsoever.</p>
                  </section>
                </div>
              ) : (
                <div className="space-y-6 text-[13px] font-medium text-gray-600 leading-relaxed">
                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.1. PRIVACY</h2>
                    <div className="space-y-4">
                      <p>Fairplay is committed to protecting your personal information. This Privacy Policy lets you know what information we collect when you use our services, why we collect this information and how we use the collected information.</p>
                      <p>Please note that this Privacy Policy will be agreed between you and Fairplay. (‘We’, ‘Us’ or ‘Our’, as appropriate). This Privacy Policy is an integrated part of Fairplay’s Terms and Conditions. We may periodically make changes to this Privacy Policy and will notify you of these changes by posting the modified terms on our platforms. We recommend that you revisit this Privacy Policy regularly.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.2. INFORMATION COLLECTED</h2>
                    <p>We consider information that may be used to identify an individual, including, but not limited to, first and last name, date of birth, home or other physical address, email address, phone number or other relevant information to be Personal Information(‘Personal Information’). You may be asked to provide Personal Information when you use our website, register for an account or use our services. The Personal Information that we collect may include information such as: contact information(including telephone number), shipping information, billing information, transaction history, website usage preferences, and feedback regarding the Services. This information is held by us on servers based in various location from time to time and elsewhere from time to time. When you interact with the services, our servers keep an activity log unique to you that collects certain administrative and traffic information including: source IP address, time of access, date of access, web page(s) visited, language use, software crash reports and type of browser used. This information is essential for the provision and quality of our services. We do not collect Personal Information about you without your knowledge.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.3. MEANS OF COLLECTING AND PROCESSING DATA</h2>
                    <p>We may automatically collect certain data as discussed above and receive Personal Information about you where you provide such information through the services or other communications and interactions on the Fairplay site. We may also receive Personal Information from online vendors and service providers, and from customer lists lawfully acquired from third-party vendors. In addition, we may engage the services of third-party service providers to provide technical support process your online transactions and maintain your account. We will have access to any information you provide to such vendors, service providers and third-party e-commerce services, and we will use the Personal Information as set out in this Privacy Policy below. This information will only be disclosed to third parties outside the company in accordance with this Privacy Policy. We take steps to ensure that our arrangements with third-party service providers and online vendors protect your privacy.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.4. INFORMATION USE</h2>
                    <div className="space-y-4">
                      <p>We use the Personal Information we collect from you to deliver our Services, to provide customer support, to undertake necessary security and identify verification checks, to process any of your online transactions, to assist your participation in third-party promotions, meet certain business requirements and for any other purpose related to the operation of the Services. As such, we may share your Personal Information with our carefully selected partners (including any other parties that have data sharing arrangements with the latter).</p>
                      <p>Your Personal Information may also be used by us to provide you with: (1) promotional offers and information regarding our products and services; and (2) promotional offers and information regarding the products and services of our partners, in order to enlarge the range of provided products and improve our customer service. From time-to-time, we may request information from you via surveys or contests. Participation in these surveys or contests is completely voluntary and you have the choice of whether or not to disclose such information. By accepting any contest prize or winnings from us, you consent to use of your name for advertising and promotional purposes without additional compensation, except where prohibited by law.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.5. CERTAIN EXCLUDED DISCLOSURES</h2>
                    <p>We may disclose your Personal Information if required to do so by law, or if we believe in good faith that such action is necessary to: (1) comply with any legal process served on us, any of our sites or the services or in circumstances where we are under a substantially similar legal obligation; (2) protect and defend our rights or property; or (3) act to protect the personal safety of users of the services or the public. If, in our sole determination, you are found to have cheated or attempted to defraud us, the company , or any other user of the services in any way including but not limited to game manipulation or payment fraud, we reserve the right to share this information (together with your identity) with other online gaming sites, banks, credit card companies, appropriate agencies and relevant authorities.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.6. ACCESS</h2>
                    <p>You may ‘opt out’ of receiving any promotional communications either by choosing to opt out via your account settings available on our sites or the services or in an email you receive from us, or at any time by sending an email, or by writing to us at Customer Service.</p>
                    <p>In addition, You may contact us if you: 1) want to confirm the accuracy of the Personal Information we have collected about you; 2) would like to update your Personal Information; and/or 3) have any complaint regarding our use of your Personal Information. If requested, we will (1) update any information you have provided to us, in case you prove the necessity for such changes or (2) mark any information to prohibit future use for marketing purposes.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.7. CONSENT TO USE OF ELECTRONIC SERVICE PROVIDERS</h2>
                    <p>In order to play real money games on our services, you will be required to send money to and receive money from us. We may use third-party electronic payment systems to process such financial transactions. By accepting this Privacy Policy, you expressly consent to Personal Information necessary for the processing of transactions including, where necessary, the transfer of information outside of your country.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.8. CONSENT TO SECURITY REVIEW</h2>
                    <p>We reserve the right to conduct a security review at any time to validate the registration data provided by you and to verify your use of the services and your financial transactions for potential breach of our Terms and Conditions and of applicable law. By using our services and thereby agreeing to our Terms and Conditions you authorize us to use your Personal Information and to disclose your Personal Information to third parties for the purposes of validating the information you provide during your use of our services.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.9. SECURITY</h2>
                    <p>We understand the importance of security and the techniques needed to secure information. We store all of the Personal Information we receive directly from you in an encrypted and password-protected database residing within our secure network behind active state-of-the-art firewall software. (Our Services support SSL).</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.10. PROTECTION OF MINORS</h2>
                    <p>Our Services are not intended for or directed at persons under the age of eighteen (18) (or the lawful age in their respective jurisdiction). Any person who provides their information to us through any part of the services signifies to us that they are eighteen (18) years of age (or the lawful age in their respective jurisdiction) or older.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.11. INTERNATIONAL TRANSFERS</h2>
                    <p>Personal Information collected on the services may be stored and processed in any country in which we or our affiliates, suppliers or agents maintain facilities. By using our services, you expressly consent to any transfer of information outside of your country (including to countries that may not be assessed as having adequate privacy laws).</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.12. COOKIES</h2>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-gray-700">Information placed on your device</h4>
                        <p>When accessing our services, we may store information on your device. This information is referred to as cookies, which are small text files that are stored on your device when you visit online pages that record your preferences.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-700">Strictly necessary cookies</h4>
                        <p>Strictly necessary cookies are essential to allow a user move around a website and use its features, such as accessing secure areas of the website or making financial transactions. Without these cookies, we would not be able to make our websites work efficiently.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-700">During the registration process</h4>
                        <p>These cookies will hold information collected during your registration and will allow us to recognize you as a customer and provide you with the services you require.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-700">On our website</h4>
                        <p>For visitors to our website, we use cookies to collect information. Our servers use three different types of cookies: A ‘session-based’ cookie, A ‘persistent’ cookie, and ‘Analytical’ cookies.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-700">Flash cookies</h4>
                        <p>You can modify your Flash Player settings to prevent the use of flash cookies. The Settings Manager of your Flash Player allows you manage your preferences.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.13. THIRD-PARTY PRACTICES</h2>
                    <p>We cannot ensure the protection of any information that you provide to a third-party online site that links to or from the services or any information collected by any third party administering our affiliate program since these third-party online sites are owned and operated independently from us.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.14. LEGAL DISCLAIMER</h2>
                    <p>The Services operate ‘AS-IS’ and ‘AS-AVAILABLE’ without liability of any kind. We are not responsible for events beyond our direct control. We cannot guarantee nor do we claim that there will be error-free performance regarding the privacy of your Personal Information.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.15. CONSENT TO PRIVACY POLICY</h2>
                    <p>Your use of our services constitutes an agreement to our Privacy Policy. This is our entire and exclusive Privacy Policy and it supersedes any earlier version. Your continued use of our services following any changes to this Privacy Policy constitutes your acceptance of the changes.</p>
                  </section>

                  <section>
                    <h2 className="text-[16px] font-black uppercase text-gray-800 mb-3 tracking-tight">1.16. OTHER WEB SITES</h2>
                    <p>Our web site may contain links to other web sites, which are outside our control and are not covered by this Privacy Policy. If you access other sites using the links provided, the operators of these sites may collect information from you. We are not responsible.</p>
                  </section>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-start">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-[#e8612c] text-white text-[12px] font-black uppercase rounded-[4px] shadow-lg active:scale-95 transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
