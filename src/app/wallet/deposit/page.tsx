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
  const [methodsLoading, setMethodsLoading] = useState(true)
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
      
      if (!token) {
        setLoading(false)
        return
      }
      setMethodsLoading(true)

      const [balanceRes, methodsRes] = await Promise.all([
        userController.getBalance(token).catch(e => ({ error: '1', balance: 0 })),
        walletController.getDepositMethods(token).catch(e => ({}))
      ]) as [any, any]

      if (balanceRes && balanceRes.error === '0') setBalance(balanceRes)
      
      if (methodsRes) {
        let methods: any[] = []
        // Deep scan for any list in common keys, or use object as dict
        const rawData = methodsRes.data || methodsRes.list || methodsRes.depositlist || methodsRes.banklist || methodsRes.BankList
        
        if (Array.isArray(rawData)) {
          methods = rawData
        } else if (rawData && typeof rawData === 'object') {
          methods = Object.values(rawData)
        } else if (Array.isArray(methodsRes)) {
          methods = methodsRes
        } else if (typeof methodsRes === 'object' && methodsRes !== null) {
          // Direct dictionary response or missing error field
          const objValues = Object.values(methodsRes)
          const potentialItems = objValues.filter(v => v && typeof v === 'object' && (v as any).Bank_Id !== undefined)
          
          if (potentialItems.length > 0) {
            methods = potentialItems
          } else if (methodsRes.error === '0') {
            // Standard format fallback
            const foundArray = objValues.find(v => Array.isArray(v))
            if (foundArray) methods = foundArray as any[]
          } else if (!methodsRes.error) {
            // Raw object values as fallback
            methods = objValues.filter(v => typeof v === 'object' && v !== null)
          }
        }

        setDepositMethods(methods)
        if (methods.length > 0 && !activeMethodId) {
           const firstId = methods[0].Bank_Id || methods[0].id || methods[0].Id
           setActiveMethodId(String(firstId))
        }
      }
    } catch (error) {
      console.error('Failed to fetch deposit data:', error)
    } finally {
      setLoading(false)
      setMethodsLoading(false)
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
      <div className="flex items-center justify-between px-3 py-3 sticky top-0 z-20 bg-[#222222] border-b border-white/5 shadow-md px-4">
        <div className="flex items-center gap-1">
          <button onClick={() => router.back()} className="text-[#e8612c] pr-2">
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[13px] font-black text-white uppercase tracking-tight">Deposit Funds</h1>
            <p className="text-[10px] font-black text-[#e8612c]">Balance: ₹{balance.balance.toLocaleString()}</p>
          </div>
        </div>
        <button 
           onClick={() => router.push('/wallet/deposit/history')}
           className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-[#e8612c] transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5"
        >
          <HistoryIcon size={14} />
          History
        </button>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-6 space-y-8">
        
        <div className="bg-[#111]/80 border border-white/5 rounded-[32px] p-6 shadow-2xl">
          <div className="flex gap-8 overflow-x-auto no-scrollbar pb-4 px-2 scroll-smooth">
            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            
            {methodsLoading ? (
               // Skeleton Loading
               Array(5).fill(0).map((_, i) => (
                 <div key={i} className="min-w-[120px] p-3 rounded-2xl bg-white/5 border-2 border-transparent animate-pulse flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/10" />
                    <div className="w-16 h-2 bg-white/10 rounded" />
                 </div>
               ))
            ) : (
              depositMethods.map((pm) => {
                const id = String(pm.Bank_Id || pm.id || pm.Id)
                const isActive = activeMethodId === id
                // Map colors based on provider name for authenticity
                const name = (pm.Name || pm.name || pm.bankname || pm.Bank || '').toUpperCase()
                const type = (pm.Type || pm.type || '').toUpperCase()

                return (
                  <button
                    key={id}
                    onClick={() => setActiveMethodId(id)}
                    className={`flex flex-col items-center justify-center gap-3 p-3 min-w-[120px] rounded-2xl transition-all border-2 relative ${
                      isActive 
                        ? 'bg-white/5 border-[#e8612c] shadow-[0_0_20px_rgba(232,97,44,0.1)]' 
                        : 'bg-transparent border-transparent grayscale opacity-40 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center p-2 bg-white shadow-lg shadow-black/20`}>
                      {pm.Image ? (
                        <img src={pm.Image} alt={name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          {type.includes('BANK') ? (
                            <Landmark size={28} className="text-[#111]" />
                          ) : (
                            <Phone size={28} className="text-[#111]" fill="#111" />
                          )}
                        </div>
                      )}
                    </div>
                    <span className={`text-[9px] font-black tracking-tighter text-center leading-tight max-w-[90px] uppercase ${isActive ? 'text-[#e8612c]' : 'text-white/40'}`}>
                      {name}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ── Active Method Label ── */}
        <div className="flex flex-col items-center justify-center space-y-3">
           <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white">
             {activeMethod ? (activeMethod.Name || activeMethod.name || activeMethod.bankname || activeMethod.Bank) : 'Select Method'}
           </h2>
           <div className="h-1 w-16 bg-[#e8612c] rounded-full shadow-[0_0_10px_rgba(232,97,44,0.2)]" />
        </div>

        {/* ── Two Panel Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT PANEL: Account Info & Promos ── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1a1a1a] border border-white/5 rounded-[24px] overflow-hidden shadow-2xl p-6 space-y-4">
              {activeMethod ? (
                <>
                  <AccountDetailRow label="Name" value={activeMethod.BankACnme} onCopy={handleCopy} />
                  <AccountDetailRow label={activeMethod.Type === 'BANK' ? "Account No" : "Number"} value={activeMethod.AcNo} onCopy={handleCopy} />
                  {activeMethod.Type === 'BANK' && <AccountDetailRow label="IFSC Code" value={activeMethod.Isfc} onCopy={handleCopy} />}
                  
                  <div className="py-3 px-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Min Amount</span>
                      <span className="text-[12px] font-black text-[#e8612c]">₹ {activeMethod.Min || activeMethod.min_deposit || '200'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Max Amount</span>
                      <span className="text-[12px] font-black text-[#e8612c]">₹ {activeMethod.Max || activeMethod.max_deposit || '1,00,00,000'}</span>
                    </div>
                  </div>

                  {activeMethod.Qr && (
                    <div className="pt-4 flex flex-col items-center">
                      <div className="bg-white p-3 rounded-2xl shadow-inner w-full max-w-[200px]">
                        <img 
                          src={activeMethod.Qr.startsWith('http') || activeMethod.Qr.startsWith('data:') ? activeMethod.Qr : `data:image/jpeg;base64,${activeMethod.Qr}`} 
                          alt="QR Code" 
                          className="w-full h-auto object-contain" 
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-20 text-center space-y-4">
                   <Landmark size={48} className="mx-auto text-white/5" />
                   <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em]">Select a payment method above</p>
                </div>
              )}
            </div>

            {/* Promotional Link */}
            <div className="text-center py-4 bg-white/5 rounded-[24px] border border-white/5">
               <a href="https://www.upitobank.xyz" target="_blank" className="inline-block group px-6">
                  <span className="text-[13px] font-black text-[#e8612c] hover:text-[#ff7a45] transition-colors flex flex-col items-center leading-tight">
                    <span>HOW TO TRANSFER UPI TO BANK</span>
                    <span className="underline underline-offset-4 text-[11px] opacity-70">WWW.UPITOBANK.XYZ</span>
                  </span>
               </a>
            </div>

            {/* Support Link */}
            <button 
              onClick={() => window.open('https://wa.me/', '_blank')}
              className="w-full bg-[#111] border border-white/10 hover:border-[#e8612c]/30 text-white rounded-[24px] p-6 shadow-lg transition-all active:scale-[0.98] flex flex-col items-center gap-3 group"
            >
              <span className="text-[11px] font-black tracking-widest uppercase text-white/40 group-hover:text-[#e8612c]">FOR PAYMENT RELATED ISSUES</span>
              <div className="w-14 h-14 rounded-full bg-[#e8612c]/10 flex items-center justify-center text-[#e8612c] group-hover:scale-110 transition-transform">
                 <Phone size={28} fill="#e8612c" />
              </div>
            </button>
          </div>

          {/* ── RIGHT PANEL: Form Submission ── */}
          <div className="lg:col-span-7">
            <div className="bg-[#1a1a1a] border border-white/5 rounded-[32px] p-8 shadow-2xl space-y-8">
              
              {/* UTR Input */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-white/30 ml-1">UTR / Reference Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="6 to 12 Digit UTR Number"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="w-full h-14 bg-black/20 border border-white/10 rounded-2xl px-5 text-sm font-bold text-white focus:outline-none focus:border-[#e8612c] transition-all placeholder:text-white/10"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-[12px] font-black uppercase tracking-widest text-white/40 ml-1">Upload Your Payment Proof <span className="text-red-500 font-bold">(Required)</span></label>
                <div 
                  onClick={() => fileRef.current?.click()}
                  className={`w-full h-20 rounded-2xl border-2 border-dashed flex items-center justify-between px-6 cursor-pointer transition-all ${
                    screenshot ? 'bg-green-500/5 border-green-500/30' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <div className="flex items-center gap-4">
                     <div className="px-4 py-2 bg-black rounded-lg text-xs font-black uppercase">Choose file</div>
                     <span className="text-[11px] font-bold text-white/40 truncate max-w-[200px]">
                        {screenshotName || 'No file chosen'}
                     </span>
                  </div>
                  {screenshot && <Check size={20} className="text-green-500" />}
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-white/30 ml-1">Amount <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-white/20">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-16 bg-black/20 border border-white/10 rounded-2xl pl-12 pr-5 text-2xl font-black text-white focus:outline-none focus:border-[#e8612c] transition-all"
                  />
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(prev => String((parseFloat(prev) || 0) + amt))}
                    className="h-12 bg-white/5 hover:bg-[#e8612c] hover:text-white border border-white/5 rounded-xl text-[12px] font-black transition-all active:scale-95"
                  >
                    +{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Agreement */}
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-black accent-[#e8612c] cursor-pointer"
                />
                <span className="text-[10px] text-white/40 font-bold leading-tight">
                   I have read and agree with the terms of payment and withdrawal policy.
                </span>
              </div>

              {/* Submit Button */}
              <button
                disabled={submitting}
                onClick={handleSubmit}
                className={`w-full h-16 rounded-[24px] text-lg font-black tracking-widest uppercase transition-all active:scale-[0.98] shadow-lg ${
                  submitting 
                    ? 'bg-white/10 text-white/20' 
                    : 'bg-[#e8612c] hover:bg-[#ff7a45] text-white shadow-[#e8612c]/20 hover:shadow-[#e8612c]/40'
                }`}
              >
                {submitting ? <Loader2 className="animate-spin mx-auto" size={28} /> : 'SUBMIT DEPOSIT'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer Instructions ── */}
        <div className="bg-white/5 border border-red-500/10 rounded-3xl p-8 space-y-4">
           {[
             "Deposit money only in the below available accounts to get the fastest credits and avoid possible delays.",
             "Deposits made 45 minutes after the account removal from the site are valid & will be added to their wallets.",
             "Site is not responsible for money deposited to Old, Inactive or Closed accounts.",
             "After deposit, add your UTR and amount to receive balance."
           ].map((text, i) => (
             <div key={i} className="flex gap-4">
                <span className="text-red-500 font-black text-sm">{i + 1}.</span>
                <p className="text-red-500 font-bold text-[13px] leading-relaxed italic">{text}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}


function AccountDetailRow({ label, value, onCopy }: { label: string; value: string; onCopy: (v: string) => void }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 group transition-colors hover:border-[#e8612c]/30">
      <div className="flex flex-col gap-0.5 max-w-[80%]">
        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</span>
        <span className="text-[13px] font-black text-white/90 break-all leading-tight">{value}</span>
      </div>
      <button 
        onClick={() => onCopy(value)}
        className="p-2 text-white/40 hover:text-[#e8612c] transition-colors"
      >
        <Copy size={18} />
      </button>
    </div>
  )
}
