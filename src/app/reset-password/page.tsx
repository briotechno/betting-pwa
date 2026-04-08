'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { authController } from '@/controllers/auth'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()
  
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleResetPassword = async () => {
    if (!user || !user.loginToken) {
        showSnackbar('User not authenticated.', 'error')
        return
    }

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      showSnackbar('Please fill in all fields.', 'warning')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showSnackbar('New passwords do not match.', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await authController.changePassword({
        loginToken: user.loginToken,
        oldpassword: formData.oldPassword,
        newpassword: formData.newPassword
      })

      if (res.error === '0') {
        showSnackbar(res.msg || 'Password updated successfully.', 'success')
        router.push('/')
      } else {
        showSnackbar(res.msg || 'Failed to update password.', 'error')
      }
    } catch (err) {
      showSnackbar('An error occurred. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#181818] min-h-screen text-white pb-20 font-sans">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#222222]">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
          <ChevronLeft size={22} className="stroke-[3]" />
        </button>
        <h1 className="text-[15px] font-bold text-white uppercase tracking-tight">Reset Password</h1>
      </div>

      <div className="p-4 pt-6">
        <div className="bg-[#222222] rounded-[4px] p-5 shadow-lg space-y-8 border flex flex-col border-white/5 max-w-[500px] mx-auto">
          
          {/* Old Password */}
          <div className="relative group flex items-center border-b border-gray-400 pb-1 focus-within:border-[#e8612c] transition-colors">
            <Lock className="text-white mr-3 flex-shrink-0" size={18} fill="currentColor" strokeWidth={0} />
            <input 
              type={showOld ? 'text' : 'password'} 
              placeholder="Old Password*" 
              value={formData.oldPassword}
              onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
              className="w-full bg-transparent h-8 text-[13px] font-medium text-white outline-none placeholder-gray-300"
            />
            <button 
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="text-white ml-2 flex-shrink-0"
            >
              {showOld ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative group flex items-center border-b border-gray-400 pb-1 focus-within:border-[#e8612c] transition-colors">
            <Lock className="text-white mr-3 flex-shrink-0" size={18} fill="currentColor" strokeWidth={0} />
            <input 
              type={showNew ? 'text' : 'password'} 
              placeholder="New Password*" 
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              className="w-full bg-transparent h-8 text-[13px] font-medium text-white outline-none placeholder-gray-300"
            />
            <button 
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="text-white ml-2 flex-shrink-0"
            >
              {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative group flex items-center border-b border-gray-400 pb-1 focus-within:border-[#e8612c] transition-colors">
            <Lock className="text-white mr-3 flex-shrink-0" size={18} fill="currentColor" strokeWidth={0} />
            <input 
              type={showConfirm ? 'text' : 'password'} 
              placeholder="Confirm New Password*" 
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full bg-transparent h-8 text-[13px] font-medium text-white outline-none placeholder-gray-300"
            />
            <button 
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-white ml-2 flex-shrink-0"
            >
              {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button 
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full h-10 bg-[#e8612c] text-white rounded-full text-[13px] font-bold tracking-wide active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'RESET PASSWORD'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
