'use client'
import React, { useState } from 'react'
import { X, Loader2, Landmark } from 'lucide-react'
import { walletController } from '@/controllers'
import { useSnackbarStore } from '@/store/snackbarStore'
import Button from '@/components/ui/Button'

interface AddBankModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddBankModal({ isOpen, onClose, onSuccess }: AddBankModalProps) {
  const { show: showSnackbar } = useSnackbarStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    ACname: '',
    Bank: '',
    ACholdername: '',
    ACno: '',
    Isfc: '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.ACname || !formData.Bank || !formData.ACholdername || !formData.ACno || !formData.Isfc) {
      showSnackbar('Please fill all fields', 'error')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('fairbet-auth') ? 
        JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
      
      if (!token) return

      const response = await walletController.saveBankAccount({
        LoginToken: token,
        ...formData
      })

      if (response.error === '0') {
        showSnackbar('Bank account saved successfully', 'success')
        onSuccess()
        onClose()
      } else {
        showSnackbar(response.msg || 'Failed to save bank account', 'error')
      }
    } catch (error) {
      showSnackbar('An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#181818] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#222]">
          <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
            <Landmark size={18} className="text-[#e8612c]" />
            ADD BANK ACCOUNT
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-white/60 uppercase tracking-wider">Account Name (e.g. My Savings)</label>
            <input 
              type="text" 
              className="w-full h-11 bg-white rounded-md px-4 text-[#333] text-sm font-medium focus:ring-2 focus:ring-[#e8612c] focus:outline-none transition-all"
              placeholder="Enter account name"
              value={formData.ACname}
              onChange={e => setFormData({...formData, ACname: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-white/60 uppercase tracking-wider">Bank Name</label>
            <input 
              type="text" 
              className="w-full h-11 bg-white rounded-md px-4 text-[#333] text-sm font-medium focus:ring-2 focus:ring-[#e8612c] focus:outline-none transition-all"
              placeholder="Enter bank name"
              value={formData.Bank}
              onChange={e => setFormData({...formData, Bank: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-white/60 uppercase tracking-wider">Account Holder Name</label>
            <input 
              type="text" 
              className="w-full h-11 bg-white rounded-md px-4 text-[#333] text-sm font-medium focus:ring-2 focus:ring-[#e8612c] focus:outline-none transition-all"
              placeholder="As per bank records"
              value={formData.ACholdername}
              onChange={e => setFormData({...formData, ACholdername: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-white/60 uppercase tracking-wider">Account Number</label>
            <input 
              type="text" 
              className="w-full h-11 bg-white rounded-md px-4 text-[#333] text-sm font-medium focus:ring-2 focus:ring-[#e8612c] focus:outline-none transition-all"
              placeholder="Enter account number"
              value={formData.ACno}
              onChange={e => setFormData({...formData, ACno: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-white/60 uppercase tracking-wider">IFSC Code</label>
            <input 
              type="text" 
              className="w-full h-11 bg-white rounded-md px-4 text-[#333] text-sm font-medium focus:ring-2 focus:ring-[#e8612c] focus:outline-none transition-all"
              placeholder="e.g. SBIN0001234"
              value={formData.Isfc}
              onChange={e => setFormData({...formData, Isfc: e.target.value})}
            />
          </div>

          <div className="pt-2">
            <Button 
              fullWidth 
              type="submit" 
              disabled={loading}
              className="h-12 text-sm font-black tracking-[0.2em]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'SAVE BANK ACCOUNT'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
