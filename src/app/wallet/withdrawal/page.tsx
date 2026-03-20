'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, Loader2, Landmark, Trash2, History, Info } from 'lucide-react'
import { walletController, userController } from '@/controllers'
import { useSnackbarStore } from '@/store/snackbarStore'
import { useAuthStore } from '@/store/authStore'
import AddBankModal from '@/components/wallet/AddBankModal'
import Button from '@/components/ui/Button'

const WITHDRAWAL_RULES = [
  "Casino Withdrawal Limit: You can withdraw up to 10 times the total amount you've deposited. If your withdrawal request exceeds this limit, the extra amount may be held or cancelled by the company.",
  "Casino Winning Limit: You can win up to 50 times your bet amount in any casino game round. If your winnings exceed this, only up to 50 times your bet will be credited to your account.",
  "The bonus amount can be used to place bets across the platform and the winnings can be withdrawn.",
  "A player can use bonus amount to place bets and play games on fairplay.",
  "If the withdrawals are pending from the bank, it may take upto 72 banking hours for your transaction to clear.",
  "If a user only deposits and attempts to withdraw the money without placing a single bet, 100% of the amount will be withheld due to suspicious activity. If this is repeated, no withdrawal will be given to the user.",
]

export default function WithdrawalPage() {
  const router = useRouter()
  const { show: showSnackbar } = useSnackbarStore()
  const { isAuthenticated } = useAuthStore()
  
  const [amount, setAmount] = useState('')
  const [bannerError, setBannerError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [bankAccounts, setBankAccounts] = useState<any[]>([])
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null)
  const [balance, setBalance] = useState({ available_balance: 0 })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const fetchData = async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('fairbet-auth') ? 
        JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
      
      if (!token) return

      const [balanceRes, bankRes] = await Promise.all([
        userController.getBalance(token),
        walletController.getBankAccounts(token)
      ])

      if (balanceRes.error === '0') setBalance(balanceRes as any)
      if (bankRes.error === '0') {
        const accounts = Array.isArray(bankRes.data) ? bankRes.data : bankRes.list || []
        setBankAccounts(accounts)
        if (accounts.length > 0 && !selectedBankId) {
          setSelectedBankId(accounts[0].id || accounts[0].Id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch withdrawal data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [isAuthenticated])

  const handleDeleteBank = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this bank account?')) return

    try {
      const token = localStorage.getItem('fairbet-auth') ? 
        JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
      if (!token) return

      const response = await walletController.deleteBankAccount(token, id)
      if (response.error === '0') {
        showSnackbar('Bank account deleted', 'success')
        fetchData()
        if (selectedBankId === id) setSelectedBankId(null)
      } else {
        showSnackbar(response.msg || 'Failed to delete account', 'error')
      }
    } catch (error) {
      showSnackbar('An error occurred', 'error')
    }
  }

  const handleWithdraw = async () => {
    if (!selectedBankId) {
      showSnackbar('Please select a bank account', 'error')
      return
    }
    if (!amount || parseFloat(amount) <= 0) {
      showSnackbar('Please enter a valid amount', 'error')
      return
    }
    if (parseFloat(amount) > balance.available_balance) {
      showSnackbar('Insufficient balance', 'error')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('fairbet-auth') ? 
        JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
      if (!token) return

      const response = await walletController.requestWithdrawal(token, selectedBankId, amount)
      if (response.error === '0') {
        showSnackbar(response.msg || 'Withdrawal request submitted successfully', 'success')
        setAmount('')
        fetchData()
      } else {
        showSnackbar(response.msg || 'Failed to submit request', 'error')
      }
    } catch (error) {
      showSnackbar('An error occurred', 'error')
    } finally {
      setSubmitting(false)
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
      <div className="flex items-center justify-between px-3 py-3 sticky top-0 z-20 bg-[#222222] border-b border-white/5">
        <div className="flex items-center gap-1">
            <button onClick={() => router.back()} className="text-[#e8612c] pr-2">
                <ChevronLeft size={22} strokeWidth={3} />
            </button>
            <h1 className="text-[15px] font-bold text-white uppercase tracking-tight">Withdrawal</h1>
        </div>
        <button 
           onClick={() => router.push('/wallet/withdrawal/history')}
           className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-[#e8612c] transition-colors bg-white/5 px-3 py-1.5 rounded-full"
        >
          <History size={14} />
          History
        </button>
      </div>

      <div className="max-w-[760px] mx-auto px-4 py-4 space-y-5">
        {/* ── Promotional Banner ── */}
        <div className="w-full overflow-hidden rounded-xl bg-black/40 border border-white/5 shadow-xl">
          {!bannerError ? (
            <img
              src="/withdrawal-banner.png"
              alt="Instant Withdrawals"
              className="w-full object-cover max-h-[160px]"
              onError={() => setBannerError(true)}
            />
          ) : (
            <div className="w-full flex items-center gap-4 px-6 py-6 bg-gradient-to-br from-[#c0390a] to-[#e8612c]">
              <div className="text-4xl">💰</div>
              <div>
                <p className="font-black text-white uppercase text-lg leading-tight">24*7 Instant Withdrawals</p>
                <div className="mt-2 bg-black/20 px-3 py-1 rounded inline-block text-[10px] font-bold uppercase">No Limits • Guaranteed</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Available Balance ── */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e8612c]/10 flex items-center justify-center">
                 <span className="text-2xl">👛</span>
              </div>
              <div className="space-y-0.5">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Available to Withdraw</p>
                 <p className="text-2xl font-black text-[#e8612c]">₹ {balance.available_balance.toLocaleString()}</p>
              </div>
           </div>
        </div>

        {/* ── Bank Selection ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-black uppercase tracking-widest text-white/60">Bank Details</h3>
            <button
               onClick={() => setIsAddModalOpen(true)}
               className="flex items-center gap-2 h-8 px-4 bg-[#e8612c] hover:bg-[#ff7a45] text-white rounded-full text-[11px] font-black transition-all shadow-lg"
            >
              ADD NEW <Plus size={14} strokeWidth={4} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bankAccounts.length === 0 ? (
              <div className="col-span-full bg-[#111] border border-dashed border-white/10 rounded-2xl p-8 text-center">
                <Landmark size={32} className="mx-auto text-white/10 mb-3" />
                <p className="text-sm text-white/40 font-bold">No saved bank accounts found.</p>
                <p className="text-[11px] text-white/20 mt-1">Add a bank account to start withdrawals.</p>
              </div>
            ) : (
              bankAccounts.map((bank: any) => {
                const id = bank.id || bank.Id
                const isSelected = selectedBankId === id
                return (
                  <div 
                    key={id}
                    onClick={() => setSelectedBankId(id)}
                    className={`relative group p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#e8612c]/5 border-[#e8612c] shadow-[0_0_20px_rgba(232,97,44,0.1)]' 
                        : 'bg-[#111] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#e8612c] text-white' : 'bg-white/5 text-white/40'}`}>
                          <Landmark size={20} />
                       </div>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleDeleteBank(id); }}
                         className="p-2 text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                    <div>
                       <p className={`text-[13px] font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-white/60'}`}>{bank.Bank || 'Bank'}</p>
                       <p className="text-[11px] text-white/30 font-medium truncate mt-0.5">{bank.ACno?.replace(/.(?=.{4})/g, '*') || '****'}</p>
                       <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2">{bank.ACholdername || 'N/A'}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 text-[#e8612c]">
                         <div className="w-5 h-5 rounded-full bg-[#e8612c] flex items-center justify-center shadow-lg">
                            <Plus className="rotate-45 text-white" size={14} strokeWidth={4} />
                         </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ── Withdrawal Amount ── */}
        <div className="space-y-3 pt-2">
          <h3 className="text-[13px] font-black uppercase tracking-widest text-white/60">Upload Amount</h3>
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl">
             <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">Amount (INR)</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-[#e8612c]">₹</div>
                   <input
                     type="number"
                     placeholder="0.00"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-xl font-black text-white focus:outline-none focus:ring-2 focus:ring-[#e8612c] transition-all"
                   />
                </div>
             </div>
             
             <Button
                fullWidth
                disabled={submitting || !selectedBankId}
                onClick={handleWithdraw}
                className="h-14 text-[14px] font-black tracking-[0.2em] shadow-[0_8px_30px_rgb(232,97,44,0.3)]"
             >
                {submitting ? <Loader2 className="animate-spin" size={24} /> : 'CONFIRM WITHDRAWAL'}
             </Button>

             <p className="text-[10px] text-center text-white/30 font-medium">
                Funds will be processed to the selected account within 30-60 mins.
             </p>
          </div>
        </div>

        {/* ── Withdrawal Rules ── */}
        <div className="bg-[#111]/50 rounded-2xl p-6 border border-white/5">
           <div className="flex items-center gap-2 mb-4">
              <Info size={16} className="text-[#e8612c]" />
              <h4 className="text-[12px] font-black uppercase tracking-widest text-[#e8612c]">Withdrawal Policy</h4>
           </div>
           <ul className="space-y-3">
             {WITHDRAWAL_RULES.map((rule, idx) => (
               <li key={idx} className="flex gap-3 items-start group">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#e8612c] mt-1.5 group-hover:scale-125 transition-transform shrink-0" />
                 <span className="text-[11px] text-white/50 leading-relaxed font-medium">{rule}</span>
               </li>
             ))}
           </ul>
        </div>
      </div>

      <AddBankModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  )
}
