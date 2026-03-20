'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Copy, Check, Loader2, Upload, History as HistoryIcon, Info, Landmark, Phone } from 'lucide-react'
import { walletController, userController } from '@/controllers'
import { useSnackbarStore } from '@/store/snackbarStore'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'

// ── Quick Amounts ────────────────────────────────────────────────────────────
const QUICK_AMOUNTS = [500, 1000, 5000, 10000, 50000, 100000]

export default function DepositPage() {
  const router = useRouter()
  const { show: showSnackbar } = useSnackbarStore()
  const { isAuthenticated } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [depositMethods, setDepositMethods] = useState<any[]>([])
  const [activeMethodId, setActiveMethodId] = useState<string | null>(null)
  const [balance, setBalance] = useState({ balance: 0 })
  
  const [utr, setUtr] = useState('')
  const [amount, setAmount] = useState('500')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenshotName, setScreenshotName] = useState('')
  const [screenshotMime, setScreenshotMime] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submittedCount, setSubmittedCount] = useState(0)
  
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('fairbet-auth') ? 
        JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
      
      if (!token) return

      const [balanceRes, methodsRes] = await Promise.all([
        userController.getBalance(token),
        walletController.getDepositMethods(token)
      ])

      if (balanceRes.error === '0') setBalance(balanceRes as any)
      if (methodsRes.error === '0') {
        let methods: any[] = []
        if (Array.isArray(methodsRes.data)) {
           methods = methodsRes.data
        } else if (typeof methodsRes.data === 'object' && methodsRes.data !== null) {
           methods = Object.values(methodsRes.data)
        } else if (methodsRes.list) {
           methods = Array.isArray(methodsRes.list) ? methodsRes.list : Object.values(methodsRes.list)
        }
        setDepositMethods(methods)
        if (methods.length > 0) {
           const firstId = methods[0].Bank_Id || methods[0].id || methods[0].Id
           setActiveMethodId(String(firstId))
        }
      }
    } catch (error) {
      console.error('Failed to fetch deposit data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [isAuthenticated])

  const activeMethod = depositMethods.find(m => String(m.Bank_Id || m.id || m.Id) === activeMethodId)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScreenshotName(file.name)
    setScreenshotMime(file.type)

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setScreenshot(base64String.split(',')[1] || base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    setSubmittedCount(prev => prev + 1)
    
    if (!activeMethodId) {
      showSnackbar('Please select a payment method', 'error')
      return
    }
    if (!utr.trim()) {
      showSnackbar('Please enter valid UTR/Reference ID', 'error')
      return
    }
    if (!amount || parseFloat(amount) <= 0) {
      showSnackbar('Please enter a valid amount', 'error')
      return
    }
    if (!agreed) {
      showSnackbar('Please agree to the terms', 'error')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('fairbet-auth') ? 
        JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
      if (!token) return

      const response = await walletController.requestDeposit({
        LoginToken: token,
        Amount: amount,
        Utr: utr,
        BankId: activeMethodId,
        Mime_type: screenshotMime,
        Screenshot: screenshot || ''
      })

      if (response.error === '0') {
        showSnackbar(response.msg || 'Deposit request submitted successfully', 'success')
        setUtr('')
        setScreenshot(null)
        setScreenshotName('')
        setAgreed(false)
        setSubmittedCount(0)
        setTimeout(fetchData, 2000)
      } else {
        showSnackbar(response.msg || 'Failed to submit deposit request', 'error')
      }
    } catch (error) {
      showSnackbar('An error occurred while submitting', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text)
    showSnackbar('Copied to clipboard!', 'success')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#e8612c]" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 bg-[#181818] text-white">
      {/* ── Sub Header ── */}
      <div className="flex items-center justify-between px-3 py-3 sticky top-0 z-20 bg-[#222222] border-b border-white/5 shadow-md">
        <div className="flex items-center gap-1">
          <button onClick={() => router.back()} className="text-[#e8612c] pr-2">
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
          <h1 className="text-[15px] font-bold text-white uppercase tracking-tight">Deposit Funds</h1>
        </div>
        <button 
           onClick={() => router.push('/wallet/deposit/history')}
           className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-[#e8612c] transition-colors bg-white/5 px-3 py-1.5 rounded-full"
        >
          <HistoryIcon size={14} />
          History
        </button>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-6 space-y-6">
        
        {/* ── Current Balance ── */}
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-xl">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e8612c]/10 flex items-center justify-center text-2xl">
                 💰
              </div>
              <div className="space-y-0.5">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Total Balance</p>
                 <p className="text-2xl font-black text-[#e8612c]">₹ {balance.balance.toLocaleString()}</p>
              </div>
           </div>
           <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest text-center mb-1">Status</p>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active</span>
              </div>
           </div>
        </div>

        {/* ── Payment Methods ── */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Select Payment Method</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {depositMethods.map((pm) => {
              const id = String(pm.Bank_Id || pm.id || pm.Id)
              const isActive = activeMethodId === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveMethodId(id)}
                  className={`flex flex-col items-center justify-center gap-3 p-4 min-w-[120px] rounded-2xl border transition-all ${
                    isActive 
                      ? 'bg-[#e8612c]/5 border-[#e8612c] shadow-[0_0_20px_rgba(232,97,44,0.1)]' 
                      : 'bg-[#111] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#e8612c] text-white shadow-lg' : 'bg-white/5 text-white/40'}`}>
                    {pm.type?.toLowerCase().includes('bank') ? <Landmark size={24} /> : <Phone size={24} />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest text-center ${isActive ? 'text-white' : 'text-white/40'}`}>
                    {pm.Name || pm.name || pm.bankname || pm.Bank || 'Transfer'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Details Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ── LEFT: Account Info ── */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-4">
             <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-[#e8612c] px-4 py-2 flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Bank Details</span>
                   <Landmark size={14} className="text-white/50" />
                </div>
                
                <div className="p-5 space-y-4">
                  {activeMethod ? (
                    <>
                      <DetailRow label="Bank Name" value={activeMethod.Name || activeMethod.name || activeMethod.Bank} onCopy={handleCopy} />
                      <DetailRow label="Account Name" value={activeMethod.BankACnme || activeMethod.acname || activeMethod.ACname} onCopy={handleCopy} />
                      <DetailRow label="Account No" value={activeMethod.AcNo || activeMethod.acno || activeMethod.ACno} onCopy={handleCopy} />
                      <DetailRow label="IFSC Code" value={activeMethod.Isfc || activeMethod.ifsc} onCopy={handleCopy} />
                      {activeMethod.Qr && (
                         <div className="pt-2 flex flex-col items-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3 text-center">Scan to Pay</p>
                            <div className="bg-white p-2 rounded-xl inline-block shadow-inner">
                               <img 
                                 src={activeMethod.Qr.startsWith('http') || activeMethod.Qr.startsWith('data:') ? activeMethod.Qr : `data:image/jpeg;base64,${activeMethod.Qr}`} 
                                 alt="QR Code" 
                                 className="w-32 h-32 object-contain" 
                               />
                            </div>
                         </div>
                      )}
                    </>
                  ) : (
                    <div className="py-10 text-center">
                       <Landmark size={32} className="mx-auto text-white/10 mb-3" />
                       <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Select a method to see details</p>
                    </div>
                  )}
                </div>
             </div>

             <div className="bg-[#111]/50 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                   <Info size={18} className="text-[#e8612c]" />
                </div>
                <div className="flex-1">
                   <p className="text-[10px] font-bold text-white/80 uppercase">Payment Issues?</p>
                   <p className="text-[9px] text-white/40 font-medium">Contact our 24/7 WhatsApp support for instant help.</p>
                </div>
                <button 
                   onClick={() => window.open('https://wa.me/', '_blank')}
                   className="p-2.5 bg-[#25d366] rounded-xl text-white shadow-lg hover:scale-110 transition-transform"
                >
                   <Phone size={18} fill="white" />
                </button>
             </div>
          </div>

          {/* ── RIGHT: Submit Form ── */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-4">
             <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                   <div className="w-2 h-2 rounded-full bg-[#e8612c]" />
                   <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-white">Deposit Submission</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* UTR */}
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-white/30">UTR / Ref Number <span className="text-[#e8612c]">*</span></label>
                      <input
                        type="text"
                        placeholder="12 digit UTR number"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                        className={`w-full h-12 bg-white/5 border rounded-xl px-4 text-sm font-bold text-white focus:outline-none transition-all ${
                           submittedCount > 0 && !utr ? 'border-red-500' : 'border-white/10 focus:border-[#e8612c]'
                        }`}
                      />
                   </div>

                   {/* Amount */}
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-white/30">Deposit Amount <span className="text-[#e8612c]">*</span></label>
                      <div className="relative">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#e8612c]">₹</div>
                         <input
                           type="number"
                           placeholder="0.00"
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                           className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 text-sm font-black text-white focus:outline-none focus:border-[#e8612c] transition-all"
                         />
                      </div>
                   </div>
                </div>

                {/* Quick Amounts */}
                <div className="flex flex-wrap gap-2">
                   {QUICK_AMOUNTS.map((amt) => (
                      <button
                         key={amt}
                         onClick={() => setAmount(prev => String((parseFloat(prev) || 0) + amt))}
                         className="flex-1 min-w-[80px] h-10 rounded-xl bg-white/5 border border-white/5 text-[11px] font-black hover:bg-[#e8612c] hover:border-[#e8612c] transition-all active:scale-95"
                      >
                         +{amt.toLocaleString()}
                      </button>
                   ))}
                </div>

                {/* File Upload */}
                <div className="space-y-1.5 pt-2">
                   <label className="text-[11px] font-black uppercase tracking-widest text-white/30">Payment Screenshot (Optional)</label>
                   <div 
                      onClick={() => fileRef.current?.click()}
                      className={`w-full h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                         screenshot ? 'bg-green-500/5 border-green-500/30' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                      }`}
                   >
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {screenshot ? (
                         <>
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg">
                               <Check size={18} strokeWidth={3} />
                            </div>
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest truncate max-w-[200px]">{screenshotName}</span>
                         </>
                      ) : (
                         <>
                            <Upload size={24} className="text-white/20" />
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Click to upload image</span>
                         </>
                      )}
                   </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 mt-4">
                   <input
                     type="checkbox"
                     checked={agreed}
                     onChange={(e) => setAgreed(e.target.checked)}
                     className="w-5 h-5 rounded border-white/10 bg-white/5 accent-[#e8612c] mt-0.5 cursor-pointer"
                   />
                   <p className="text-[11px] text-white/40 font-medium leading-relaxed">
                      I have transferred the funds to the selected account and I confirm that the UTR/Ref ID is correct. 
                      Incorrect submissions may lead to account suspension.
                   </p>
                </div>

                <div className="pt-2">
                   <Button
                      fullWidth
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="h-14 text-sm font-black tracking-[0.2em] shadow-[0_8px_30px_rgb(232,97,44,0.3)]"
                   >
                      {submitting ? <Loader2 className="animate-spin" size={24} /> : 'SUBMIT DEPOSIT REQUEST'}
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value, onCopy }: { label: string; value: string; onCopy: (v: string) => void }) {
   if (!value) return null
   return (
      <div className="group space-y-1">
         <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">{label}</p>
         <div className="flex items-center justify-between gap-4">
            <span className="text-[13px] font-black text-white/90 tracking-tight break-all">{value}</span>
            <button 
               onClick={() => onCopy(value)}
               className="p-1.5 text-white/20 hover:text-[#e8612c] hover:bg-[#e8612c]/10 rounded-lg transition-all"
            >
               <Copy size={16} />
            </button>
         </div>
      </div>
   )
}
