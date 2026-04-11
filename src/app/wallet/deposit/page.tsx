'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Copy, Check, Loader2, Landmark, Phone, ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { walletController } from '@/controllers'
import { useSnackbarStore } from '@/store/snackbarStore'
import { useAuthStore } from '@/store/authStore'
import { formatDate } from '@/utils/format'

const QUICK_AMOUNTS = [500, 1000, 5000, 10000, 50000, 100000]

export default function DepositPage() {
  const router = useRouter()
  const { show: showSnackbar } = useSnackbarStore()
  const { isAuthenticated } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [methodsLoading, setMethodsLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [depositMethods, setDepositMethods] = useState<any[]>([])
  const [activeMethodId, setActiveMethodId] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])
  
  const [step, setStep] = useState(1) // 1: Amount, 2: Method selection & details
  const [utr, setUtr] = useState('')
  const [amount, setAmount] = useState('500')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenshotName, setScreenshotName] = useState('')
  const [screenshotMime, setScreenshotMime] = useState('')
  const [agreed, setAgreed] = useState(false)
  
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
      setHistoryLoading(true)

      const [methodsRes, historyRes] = await Promise.all([
        walletController.getDepositMethods(token).catch(e => {
            showSnackbar('Failed to load payment methods', 'error')
            return {}
        }),
        walletController.getDepositHistory(token).catch(e => {
            showSnackbar('Failed to load history', 'error')
            return {}
        })
      ]) as any[]
      
      if (methodsRes) {
        let methods: any[] = []
        const rawData = methodsRes.data || methodsRes.list || methodsRes.depositlist || methodsRes.banklist || methodsRes.BankList
        if (Array.isArray(rawData)) {
          methods = rawData
        } else if (rawData && typeof rawData === 'object') {
          methods = Object.values(rawData)
        } else if (Array.isArray(methodsRes)) {
          methods = methodsRes
        } else if (typeof methodsRes === 'object' && methodsRes !== null) {
          const objValues = Object.values(methodsRes)
          const potentialItems = objValues.filter(v => v && typeof v === 'object' && (v as any).Bank_Id !== undefined)
          if (potentialItems.length > 0) methods = potentialItems
        }
        setDepositMethods(methods)
      }

      if (historyRes) {
        let historyData: any[] = []
        if (Array.isArray(historyRes)) {
          historyData = historyRes
        } else if (historyRes.data && Array.isArray(historyRes.data)) {
          historyData = historyRes.data
        } else if (historyRes.list && Array.isArray(historyRes.list)) {
          historyData = historyRes.list
        } else if (typeof historyRes === 'object') {
          historyData = Object.values(historyRes).filter(v => v && typeof v === 'object' && ((v as any).Amount !== undefined || (v as any).amount !== undefined || (v as any).Utr !== undefined))
        }
        setHistory(historyData)
      }
    } catch (error) {
      console.error('Failed to fetch deposit data:', error)
      showSnackbar('Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
      setMethodsLoading(false)
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [isAuthenticated])

  const filteredMethods = useMemo(() => {
    const amt = parseFloat(amount) || 0
    return depositMethods.filter(m => {
      const min = parseFloat(m.Min || m.min_deposit || 0)
      const max = parseFloat(m.Max || m.max_deposit || 100000000)
      return amt >= min && amt <= max
    })
  }, [amount, depositMethods])

  useEffect(() => {
    if (filteredMethods.length > 0) {
      if (!filteredMethods.find(m => String(m.Bank_Id || m.Id || m.id) === activeMethodId)) {
        setActiveMethodId(String(filteredMethods[0].Bank_Id || filteredMethods[0].Id || filteredMethods[0].id))
      }
    } else {
      setActiveMethodId(null)
    }
  }, [filteredMethods, activeMethodId])

  const activeMethod = filteredMethods.find(m => String(m.Bank_Id || m.Id || m.id) === activeMethodId)

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
    if (!activeMethodId) {
      showSnackbar('Please select a payment method', 'error')
      return
    }
    const cleanAmount = parseFloat(amount)
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
       showSnackbar('Please enter a valid amount', 'error')
       return
    }

    const min = parseFloat(activeMethod?.Min || 0)
    const max = parseFloat(activeMethod?.Max || 100000000)
    if (cleanAmount < min) {
      showSnackbar(`Minimum amount for this method is ₹${min}`, 'error')
      return
    }
    if (cleanAmount > max) {
      showSnackbar(`Maximum amount for this method is ₹${max}`, 'error')
      return
    }

    if (!utr.trim()) {
      showSnackbar('Please enter valid UTR/Reference ID', 'error')
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
      if (!token) {
        showSnackbar('Session expired. Please login again.', 'error')
        router.push('/login')
        return
      }

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
        fetchData() // Refresh history
      } else {
        showSnackbar(response.msg || 'Failed to submit deposit request', 'error')
      }
    } catch (error) {
      showSnackbar('An error occurred during submission. Check your connectivity.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text)
    showSnackbar('Copied to clipboard!', 'success')
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
     case 'success':
     case 'completed':
     case 'approved':
       return 'text-[#4caf50]'
     case 'rejected':
     case 'cancelled':
     case 'failed':
       return 'text-[#f44336]'
     default:
       return 'text-[#ff9800]'
   }
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
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-20 bg-[#222222] border-b border-white/5 shadow-md">
        <div className="flex items-center gap-1">
          <button onClick={() => step === 1 ? router.back() : setStep(1)} className="text-[#e8612c] pr-2">
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[13px] font-black text-white uppercase tracking-tight">Deposit Funds</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          
          {/* ── LEFT AREA: Deposit Step 1 or 2 ── */}
          <div className="xl:col-span-12 2xl:col-span-7 space-y-8 animate-in fade-in duration-500">
            {step === 1 ? (
              /* Step 1 Content */
              <div className="space-y-8">
                 <div className="bg-[#1a1a1a] border border-white/5 rounded-[32px] p-8 shadow-2xl space-y-6">
                    <div className="space-y-3">
                      <label className="text-[14px] font-black uppercase tracking-wider text-white ml-1">Deposit Amount</label>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-[#e8612c]">₹</span>
                          <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full h-16 bg-black/20 border-2 border-white/10 rounded-2xl pl-12 pr-5 text-2xl font-black text-white focus:outline-none focus:border-[#e8612c]"
                          />
                        </div>
                        <button 
                          onClick={() => parseFloat(amount) > 0 ? setStep(2) : showSnackbar('Please enter valid amount', 'error')}
                          className="h-16 w-full md:w-auto px-8 bg-[#e8612c] hover:bg-[#ff7a45] text-white rounded-2xl font-black tracking-widest uppercase shadow-lg shadow-[#e8612c]/20"
                        >
                          SUBMIT
                        </button>
                      </div>
                    </div>
                 </div>

                 <div className="bg-[#1a1a1a] border border-red-500/20 rounded-[32px] p-8 space-y-4">
                    {[
                      "Deposit money only in the below available accounts to get the fastest credits.",
                      "Deposits made 45 minutes after account removal are valid.",
                      "Site is not responsible for money deposited to Old/Inactive accounts.",
                      "After deposit, add your UTR and amount to receive balance.",
                      "NEFT receiving time varies from 40 minutes to 2 hours.",
                      "Modification: payment valid for 1 hour after change."
                    ].map((text, i) => (
                      <div key={i} className="flex gap-4 text-white">
                          <span className="font-black text-sm text-[#e8612c]">{i + 1}.</span>
                          <p className="font-bold text-[13px] italic">{text}</p>
                      </div>
                    ))}
                 </div>
              </div>
            ) : (
              /* Step 2 Content */
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                {/* Bank Selector */}
                <div className="bg-[#111]/80 border border-white/5 rounded-[32px] p-6 shadow-2xl">
                  {methodsLoading ? (
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                       {Array(4).fill(0).map((_, i) => <div key={i} className="min-w-[100px] h-24 rounded-2xl bg-white/5 animate-pulse" />)}
                    </div>
                  ) : depositMethods.length === 0 ? (
                    <div className="py-8 text-center text-white/20 font-black uppercase tracking-widest text-xs flex flex-col items-center gap-2">
                       <AlertCircle size={24} />
                       NO PAYMENT METHODS AVAILABLE
                    </div>
                  ) : filteredMethods.length === 0 ? (
                    <div className="py-8 text-center text-[#e8612c]/60 font-black uppercase tracking-widest text-xs">
                       NO BANKS AVAILABLE FOR ₹{parseFloat(amount).toLocaleString()}
                    </div>
                  ) : (
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                      <style jsx>{`
                        .no-scrollbar::-webkit-scrollbar { display: none; }
                        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                      `}</style>
                      {filteredMethods.map((pm) => {
                        const id = String(pm.Bank_Id || pm.id || pm.Id);
                        const isActive = activeMethodId === id;
                        return (
                          <button key={id} onClick={() => setActiveMethodId(id)} className={`flex flex-col items-center justify-center gap-2 p-3 min-w-[110px] rounded-2xl border-2 transition-all ${isActive ? 'bg-white/5 border-[#e8612c]' : 'border-transparent opacity-40 grayscale'}`}>
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5"><img src={pm.Image || ''} alt="" className="w-full h-full object-contain" /></div>
                            <span className="text-[8px] font-black uppercase text-center max-w-[80px] truncate">{pm.Name || pm.bankname || 'BANK'}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Bank Details Card */}
                  <div className="space-y-6">
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-[32px] overflow-hidden p-6 space-y-1 shadow-xl min-h-[300px] flex flex-col justify-center">
                       {activeMethod ? (
                         <div className="space-y-1">
                           <AccountDetailRow label="Name" value={activeMethod.BankACnme} onCopy={handleCopy} />
                           <AccountDetailRow label={activeMethod.Type === 'BANK' ? "Account No" : "Number"} value={activeMethod.AcNo} onCopy={handleCopy} />
                           {activeMethod.Type === 'BANK' && <AccountDetailRow label="IFSC Code" value={activeMethod.Isfc} onCopy={handleCopy} />}
                           <AccountDetailRow label="Min Amount" value={`₹ ${activeMethod.Min || '200'}`} />
                           <AccountDetailRow label="Max Amount" value={`₹ ${activeMethod.Max || '1cr'}`} />
                           {activeMethod.Qr && (
                             <div className="pt-4 flex justify-center">
                               <div className="bg-white p-3 rounded-2xl w-44 shadow-lg"><img src={activeMethod.Qr.includes('base64') ? activeMethod.Qr : `data:image/jpeg;base64,${activeMethod.Qr}`} className="w-full" alt="QR" /></div>
                             </div>
                           )}
                         </div>
                       ) : (
                         <div className="text-center space-y-3 opacity-20">
                            <Landmark size={48} className="mx-auto" />
                            <p className="uppercase font-black tracking-widest text-[10px]">Select a Payment Method</p>
                         </div>
                       )}
                    </div>
                  </div>

                  {/* Form Card */}
                  <div className="bg-[#1a1a1a] border border-white/5 rounded-[32px] p-6 space-y-6 shadow-xl">
                    <div className="space-y-1.5">
                       <p className="text-[12px] font-bold text-white">Unique Transaction Reference <span className="text-red-500">*</span></p>
                       <input 
                         type="text" 
                         value={utr} 
                         onChange={(e) => setUtr(e.target.value)} 
                         placeholder="6 to 12 Digit UTR Number" 
                         className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-4 text-sm font-medium focus:outline-none focus:border-white/20 transition-colors" 
                       />
                    </div>

                    <div className="space-y-2">
                       <p className="text-[12px] font-bold text-white">Upload Your Payment Proof <span className="text-red-500 font-medium">[Required]</span></p>
                       <div className="flex items-center gap-3">
                         <button 
                           onClick={() => fileRef.current?.click()} 
                           className="h-9 px-4 bg-black border border-white/20 rounded-md text-[11px] font-bold uppercase hover:bg-white/5 transition-colors"
                         >
                           Choose file
                         </button>
                         <span className="text-[12px] text-white truncate max-w-[150px]">
                           {screenshotName || 'No file chosen'}
                         </span>
                       </div>
                       <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>

                    <div className="space-y-1.5 pt-1">
                       <p className="text-[12px] font-bold text-white">Amount <span className="text-red-500">*</span></p>
                       <input 
                         type="number" 
                         value={amount} 
                         readOnly
                         className="w-full h-12 bg-[#2a2a2a] border border-white/10 rounded-lg px-4 text-sm font-bold text-white focus:outline-none cursor-not-allowed" 
                       />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                       <input 
                         type="checkbox" 
                         id="agree-terms"
                         checked={agreed}
                         onChange={(e) => setAgreed(e.target.checked)}
                         className="w-5 h-5 rounded bg-white/10 border-white/20 accent-[#4caf50]"
                       />
                       <label htmlFor="agree-terms" className="text-[11px] font-bold text-white cursor-pointer">
                         I have read and agree with the terms of payment and withdrawal policy.
                       </label>
                    </div>

                    <button 
                      disabled={submitting} 
                      onClick={handleSubmit} 
                      className={`w-full h-12 rounded-lg text-sm font-black uppercase shadow-xl transition-all ${submitting ? 'bg-white/10 opacity-50' : 'bg-[#4caf50] hover:bg-[#43a047] text-white active:scale-[0.98]'}`}
                    >
                       {submitting ? <Loader2 className="animate-spin mx-auto" /> : 'SUBMIT'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT AREA: Transaction History (Persistent & Full Height) ── */}
          <div className="xl:col-span-12 2xl:col-span-5 flex flex-col min-h-[855px] animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex-1 flex flex-col bg-[#111] border border-white/10 rounded-none overflow-hidden shadow-2xl relative">
              {/* Table Header */}
              <div className="grid grid-cols-5 md:grid-cols-6 text-[9px] font-black uppercase tracking-wider py-6 px-4 bg-black border-b border-white/5 text-white">
                <span className="text-white">TRANS NO/UTR</span>
                <span className="text-center text-white">AMOUNT</span>
                <span className="text-center text-white">METHOD</span>
                <span className="text-center text-white">STATUS</span>
                <span className="text-center text-white">DATE</span>
                <span className="text-right hidden md:block text-white">REMARKS</span>
              </div>
              
              {/* Table Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-10 font-bold">
                {historyLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/10">
                    <Loader2 className="animate-spin" size={40} />
                    <p className="text-[11px] font-black uppercase tracking-[0.3em]">Syncing...</p>
                  </div>
                ) : history.length === 0 ? (
                  <div className="py-40 text-center">
                     <AlertCircle size={48} className="mx-auto text-white/5 mb-4" />
                     <p className="text-white/10 uppercase font-black tracking-widest">No data found!</p>
                  </div>
                ) : (
                  history.map((item, i) => (
                    <div key={i} className={`grid grid-cols-5 md:grid-cols-6 items-center py-5 px-4 border-b border-white/5 transition-all hover:bg-white/[0.03] ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}>
                      <span className="text-[10px] text-white break-all pr-2 whitespace-normal leading-relaxed">#{item.Utr || item.utr || item.RequestId || item.id || 'N/A'}</span>
                      <span className="text-[12px] text-white text-center">₹{parseFloat(item.Amount || item.amount || 0).toLocaleString()}</span>
                      <span className="text-[10px] text-white text-center uppercase">{item.Method || item.method || '—'}</span>
                      <span className="text-[10px] text-center uppercase text-white">
                        {item.Status || item.status || 'Pending'}
                      </span>
                      <span className="text-[9px] text-white text-center leading-tight">
                         {item.Date || item.date ? 
                           (item.Date || item.date).split(' ').join('\n') : 
                           formatDate(item.created_at)
                         }
                      </span>
                      <span className="text-[9px] text-white text-right italic truncate hidden md:block" title={item.Remarks || item.remarks || item.Reason || item.reason}>
                        {item.Remarks || item.remarks || item.Reason || item.reason || '—'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function AccountDetailRow({ label, value, onCopy }: { label: string; value: string; onCopy?: (v: string) => void }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between p-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="text-[10px] font-bold text-white uppercase whitespace-nowrap">{label} :</span>
        <span className="text-[11px] font-black text-white truncate">{value}</span>
      </div>
      {onCopy && (
        <button onClick={() => onCopy(value)} className="p-2 text-white/20 hover:text-[#e8612c] flex-shrink-0"><Copy size={16} /></button>
      )}
    </div>
  )
}
