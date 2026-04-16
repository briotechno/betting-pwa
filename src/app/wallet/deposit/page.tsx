'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Copy, Check, Loader2, Landmark, Phone, ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { walletController, userController } from '@/controllers'
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
  const [txHash, setTxHash] = useState('')
  const [amount, setAmount] = useState('')
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
    const filtered = depositMethods.filter(m => {
      const min = parseFloat(m.Min || m.min_deposit || 0)
      const max = parseFloat(m.Max || m.max_deposit || 100000000)
      return amt >= min && amt <= max
    })
    
    // Sort: Banks first, then others
    return [...filtered].sort((a, b) => {
      const aType = (a.Type || a.type || '').toUpperCase();
      const bType = (b.Type || b.type || '').toUpperCase();
      if (aType === 'BANK' && bType !== 'BANK') return -1;
      if (aType !== 'BANK' && bType === 'BANK') return 1;
      return 0;
    });
  }, [amount, depositMethods])

  useEffect(() => {
    if (filteredMethods.length > 0) {
      const currentSelected = filteredMethods.find(m => String(m.Bank_Id || m.Id || m.id) === activeMethodId);
      if (!currentSelected) {
        // Find first method that is 'BANK' type, otherwise the first available
        const defaultMethod = filteredMethods.find(m => (m.Type || m.type || 'BANK').toUpperCase() === 'BANK') || filteredMethods[0];
        setActiveMethodId(String(defaultMethod.Bank_Id || defaultMethod.Id || defaultMethod.id));
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

    const isCrypto = activeMethod && (activeMethod.Type || activeMethod.type || '').toUpperCase() === 'CRYPTO';

    if (!utr.trim()) {
      showSnackbar(isCrypto ? 'Please enter USDT Reference No' : 'Please enter valid UTR/Reference ID', 'error')
      return
    }

    if (isCrypto && !txHash.trim()) {
      showSnackbar('Please enter TX Hash', 'error')
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
        showSnackbar(' Please login again.', 'error')
        router.push('/login')
        return
      }

      const response = await walletController.requestDeposit({
        LoginToken: token,
        Amount: amount,
        Utr: isCrypto ? `${utr} | Hash: ${txHash}` : utr,
        BankId: activeMethodId,
        Mime_type: screenshotMime,
        Screenshot: screenshot || ''
      })

      if (response.error === '0') {
        showSnackbar(response.msg || 'Deposit request submitted successfully', 'success')
        setUtr('')
        setTxHash('')
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
                        {/* {activeMethod && (activeMethod.Type || activeMethod.type || '').toUpperCase() === 'CRYPTO' && activeMethod.BuyPrice && (
                             <div className="absolute -bottom-6 left-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider italic text-white/40">
                               <span>Rate: {activeMethod.BuyPrice}</span>
                               <span className="text-white/20">|</span>
                               <span>Total: <span className="text-[#e8612c]">₹{(parseFloat(amount) * parseFloat(activeMethod.BuyPrice)).toLocaleString()}</span></span>
                             </div>
                          )} */}
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
                {/* Bank Selector - Clean Grid Layout */}
                <div className="space-y-4">
                  <label className="text-[14px] font-black uppercase tracking-wider text-white ml-1">Select Payment Method</label>
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
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:flex gap-2 md:gap-4 md:overflow-x-auto no-scrollbar pb-2">
                      <style jsx>{`
                        .no-scrollbar::-webkit-scrollbar { display: none; }
                        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                      `}</style>

                      {/* 1. Always show WhatsApp First */}
                      <button
                        onClick={async () => {
                          try {
                            const res = await userController.getWhatsAppLink()
                            if (res && res.error === '0' && res.Link) {
                              window.open(res.Link, '_blank')
                            } else {
                              window.open('https://go.wa.link/ambikaexchangesupport', '_blank')
                            }
                          } catch (err) {
                            window.open('https://go.wa.link/ambikaexchangesupport', '_blank')
                          }
                        }}
                        className="flex flex-col items-center justify-center gap-1.5 p-1 pt-2 rounded-xl border-2 border-transparent hover:bg-white/5 transition-all text-white"
                      >
                        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
                          <img src="/deposite/wp.png" alt="WhatsApp" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[9.5px] font-bold uppercase text-center leading-tight tracking-tighter mt-1">WhatsApp Deposit</span>
                      </button>

                      {(() => {
                        const typeCounters: Record<string, number> = {};
                        return filteredMethods.map((pm) => {
                          const id = String(pm.Bank_Id || pm.id || pm.Id);
                          const isActive = activeMethodId === id;

                          const rawType = (pm.Type || pm.type || 'BANK').toUpperCase();
                          const baseType = rawType === 'BANK' ? 'Bank' : (rawType === 'CRYPTO' ? (pm.Name || 'USDT') : rawType);
                          typeCounters[baseType] = (typeCounters[baseType] || 0) + 1;
                          const displayName = `${baseType} - ${typeCounters[baseType]}`;

                          // Icon Mapping
                          let iconPath = '/deposite/bank.png';
                          if (rawType.includes('GOOGLE') || rawType === 'GPAY') iconPath = '/deposite/googlepay.png';
                          else if (rawType.includes('PAYTM')) iconPath = '/deposite/paytm.png';
                          else if (rawType.includes('PHONE')) iconPath = '/deposite/phonepe.png';
                          else if (rawType === 'UPI') iconPath = '/deposite/Upi.png';
                          else if (rawType === 'CRYPTO' || rawType === 'USDT') iconPath = '/deposite/usdt.png';

                          return (
                            <button key={id} onClick={() => setActiveMethodId(id)} className={`flex flex-col items-center justify-center gap-1.5 p-1 pt-2 rounded-xl border-2 transition-all ${isActive ? 'bg-white/10 border-[#e8612c] text-white shadow-lg' : 'border-transparent opacity-50 grayscale hover:opacity-100 text-white'}`}>
                              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
                                <img src={iconPath} alt="" className="w-full h-full object-contain" />
                              </div>
                              <span className="text-[9.5px] font-bold uppercase text-center leading-tight truncate w-full px-1 tracking-tighter mt-1">{displayName}</span>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Bank Details Card */}
                  <div className="space-y-6">
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-[32px] overflow-hidden p-6 space-y-1 shadow-xl min-h-[300px] flex flex-col justify-center">
                      {activeMethod ? (
                        <div className="space-y-1">
                          {(() => {
                            const type = (activeMethod.Type || activeMethod.type || 'BANK').toUpperCase();

                            if (type === 'CRYPTO' || type === 'USDT') {
                              return (
                                <>
                                  <AccountDetailRow label="Wallet Name" value={activeMethod.Name || activeMethod.bankname} onCopy={handleCopy} />
                                  <AccountDetailRow label="Wallet Address" value={activeMethod.Id || activeMethod.id} onCopy={handleCopy} />
                                  <AccountDetailRow label="Min Amount" value={`₹ ${activeMethod.Min || '100'}`} />
                                  <AccountDetailRow label="Max Amount" value={`₹ ${activeMethod.Max || '10000'}`} />
                                </>
                              );
                            }

                            if (type === 'UPI' || type.includes('PAYTM') || type.includes('GOOGLE') || type.includes('PHONE') || type === 'GPAY') {
                              return (
                                <>
                                  <AccountDetailRow label="Name" value={activeMethod.BankACnme} onCopy={handleCopy} />
                                  <AccountDetailRow label="UPI ID" value={activeMethod.Id || activeMethod.id || activeMethod.AcNo} onCopy={handleCopy} />
                                  <AccountDetailRow label="Min Amount" value={`₹ ${activeMethod.Min || '200'}`} />
                                  <AccountDetailRow label="Max Amount" value={`₹ ${activeMethod.Max || '1cr'}`} />
                                </>
                              );
                            }

                            // Default: BANK
                            return (
                              <>
                                <AccountDetailRow label="Bank Name" value={activeMethod.Name || activeMethod.bankname} onCopy={handleCopy} />
                                <AccountDetailRow label="A/C No" value={activeMethod.AcNo} onCopy={handleCopy} />
                                <AccountDetailRow label="IFSC Code" value={activeMethod.Isfc} onCopy={handleCopy} />
                                <AccountDetailRow label="Account Name" value={activeMethod.BankACnme} onCopy={handleCopy} />
                                <AccountDetailRow label="Min Amount" value={`₹ ${activeMethod.Min || '200'}`} />
                                <AccountDetailRow label="Max Amount" value={`₹ ${activeMethod.Max || '1cr'}`} />
                              </>
                            );
                          })()}

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
                    {/* UTR / Reference No */}
                    <div className="space-y-1.5">
                      <p className="text-[12px] font-bold text-white">
                        {activeMethod && (activeMethod.Type || activeMethod.type || '').toUpperCase() === 'CRYPTO' ? 'USDT Reference No' : 'Unique Transaction Reference'} <span className="text-red-500">*</span>
                      </p>
                      <input
                        type="text"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                        placeholder={activeMethod && (activeMethod.Type || activeMethod.type || '').toUpperCase() === 'CRYPTO' ? '10 Digit USDT Reference No' : '6 to 12 Digit UTR Number'}
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-4 text-sm font-medium focus:outline-none focus:border-white/20 transition-colors"
                      />
                    </div>

                    {/* TX Hash for Crypto Only */}
                    {activeMethod && (activeMethod.Type || activeMethod.type || '').toUpperCase() === 'CRYPTO' && (
                      <div className="space-y-1.5">
                        <p className="text-[12px] font-bold text-white">TX Hash <span className="text-red-500">*</span></p>
                        <input
                          type="text"
                          value={txHash}
                          onChange={(e) => setTxHash(e.target.value)}
                          placeholder="Paste transaction hash"
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-4 text-sm font-medium focus:outline-none focus:border-white/20 transition-colors"
                        />
                      </div>
                    )}

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
                      <p className="text-[12px] font-bold text-white">
                        {activeMethod && (activeMethod.Type || activeMethod.type || '').toUpperCase() === 'CRYPTO' ? 'Amount (USDT)' : 'Amount'} <span className="text-red-500">*</span>
                      </p>
                      <input
                        type="number"
                        value={amount}
                        readOnly
                        className="w-full h-12 bg-[#2a2a2a] border border-white/10 rounded-lg px-4 text-sm font-bold text-white focus:outline-none cursor-not-allowed"
                      />
                      {activeMethod && (activeMethod.Type || activeMethod.type || '').toUpperCase() === 'CRYPTO' && activeMethod.BuyPrice && (
                        <div className="px-2 pt-1.5 flex items-center justify-between text-[10px] font-black uppercase tracking-wider italic">
                          <span className="text-white/40">Rate Conversion:</span>
                          <span className="text-white/60">
                            {amount} × {activeMethod.BuyPrice} = <span className="text-[#e8612c]">₹{(parseFloat(amount) * parseFloat(activeMethod.BuyPrice)).toLocaleString()}</span>
                          </span>
                        </div>
                      )}
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

                {/* Privacy Policy Update */}
                <div className="bg-[#1a1a1a] border border-red-500/20 rounded-[32px] p-8 space-y-4">
                  {[
                    "Deposit money only in the below available accounts to get the fastest credits and avoid possible delays.",
                    "Deposits made 45 minutes after the account removal from the site are valid & will be added to their wallets.",
                    "Site is not responsible for money deposited to Old, Inactive or Closed accounts.",
                    "After deposit, add your UTR and amount to receive balance.",
                    "NEFT receiving time varies from 40 minutes to 2 hours.",
                    "In case of account modification: payment valid for 1 hour after changing account details in deposit page."
                  ].map((text, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="flex-shrink-0 font-black text-sm text-[#e8612c]">{i + 1}.</span>
                      <p className="text-[13px] font-bold text-white italic leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT AREA: Transaction History (Persistent & Full Height) ── */}
          <div className="xl:col-span-12 2xl:col-span-5 flex flex-col min-h-[855px]">
            <div className="flex-1 flex flex-col bg-[#111] border border-white/10 rounded-none overflow-x-auto overflow-y-hidden shadow-2xl relative custom-scrollbar">
              <div className="flex flex-col min-w-[700px] xl:min-w-full h-full">
                {/* Table Header */}
                <div className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1.5fr_2fr] text-[8px] font-black uppercase tracking-wider py-6 px-4 bg-black border-b border-white/5 text-white sticky top-0 z-10">
                  <span className="text-white">TRANSACTION NO</span>
                  <span className="text-center text-white">METHOD</span>
                  <span className="text-center text-white">AMOUNT</span>
                  <span className="text-center text-white">STATUS</span>
                  <span className="text-center text-white">DATE</span>
                  <span className="text-white pl-4">REASON</span>
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
                    history.map((item, i) => {
                      const utr = item.Utr || item.utr || item.RequestId || item.id || '—';
                      const remark = item.Remarks || item.remarks || item.Remark || item.remark || item.Reason || item.reason || '—';
                      const status = (item.Status || item.status || 'Pending').toLowerCase();
                      const method = item.Method || item.method || '—';

                      return (
                        <div key={i} className={`grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1.5fr_2fr] items-center py-5 px-4 border-b border-white/5 transition-all hover:bg-white/[0.03] ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}>
                          <span className="text-[10px] text-white uppercase break-all pr-2">{utr}</span>
                          <span className="text-[10px] font-black text-white/40 uppercase text-center">{method}</span>
                          <span className="text-[12px] text-white text-center">₹{parseFloat(item.Amount || item.amount || 0).toLocaleString()}</span>
                          <div className="text-center">
                            <span className={`text-[10px] font-black uppercase ${status === 'success' ? 'text-green-500' :
                              status === 'failed' ? 'text-red-500' : 'text-white/60'
                              }`}>
                              {item.Status || item.status || 'Pending'}
                            </span>
                          </div>
                          <span className="text-[9px] text-white text-center leading-tight">
                            {item.Date || item.date ?
                              (item.Date || item.date).split(' ').join('\n') :
                              formatDate(item.created_at)
                            }
                          </span>
                          <span className="text-[10px] text-white/60 whitespace-normal break-words pl-4 leading-relaxed">{remark}</span>
                        </div>
                      );
                    })
                  )}
                </div>
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
    <div className="flex items-start justify-between p-3 border-b border-white/5 last:border-0 gap-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
        <span className="text-[12px] font-black text-white break-all leading-tight">
          {value}
        </span>
      </div>
      {onCopy && (
        <button onClick={() => onCopy(value)} className="p-2 -mr-2 text-white/20 hover:text-[#e8612c] transition-colors flex-shrink-0">
          <Copy size={16} />
        </button>
      )}
    </div>
  )
}
