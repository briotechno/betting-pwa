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

      // Handle bankRes which might be an object with numeric keys or contain an error field
      if (bankRes) {
        let accounts: any[] = []
        if (Array.isArray(bankRes)) {
          accounts = bankRes
        } else if (bankRes.data && Array.isArray(bankRes.data)) {
          accounts = bankRes.data
        } else if (typeof bankRes === 'object') {
          // If it has "error": "0", check for data or items inside
          const raw = bankRes.data || bankRes.list || bankRes
          if (Array.isArray(raw)) {
            accounts = raw
          } else {
            // Case where its an object with numeric keys "0", "1" etc
            accounts = Object.values(raw).filter(v => v && typeof v === 'object' && ((v as any).ACno || (v as any).AcNo))
          }
        }

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

      const ipRes = await fetch('https://api.ipify.org?format=json').catch(() => null)
      const ipData = ipRes ? await ipRes.json() : { ip: '1.1.1.1' }
      const userIp = ipData.ip || '1.1.1.1'

      const response = await walletController.requestWithdrawal(token, selectedBankId, amount, userIp)
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

      </div>

      <div className="max-w-[760px] mx-auto px-4 py-4 space-y-6">
        {/* ── Promotional Banner ── */}
        <div className="w-full overflow-hidden rounded-xl bg-black/40 border border-white/5 shadow-xl">
          {!bannerError ? (
            <>
              <img
                src="/desktop-w.png"
                alt="Instant Withdrawals"
                className="hidden sm:block w-full object-cover max-h-[160px]"
                onError={() => setBannerError(true)}
              />
              <img
                src="/mobile-w.png"
                alt="Instant Withdrawals"
                className="block sm:hidden w-full object-cover"
                onError={() => setBannerError(true)}
              />
            </>
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

        {/* ── Category Selector ── */}
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
          <div className="w-32 h-24 bg-white rounded-lg p-3 flex flex-col items-center justify-center gap-2 shadow-lg cursor-pointer border-2 border-transparent hover:border-[#e8612c] transition-all">
            <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
              <Landmark size={24} className="text-white" />
            </div>
            <span className="text-[10px] font-black text-black uppercase text-center leading-tight">Bank Transfers</span>
          </div>
        </div>

        {/* ── Available Balance Pill ── */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-2 text-[#111] shadow-lg">
            <div className="w-6 h-5 bg-[#e8612c] rounded flex items-center justify-center">
              <svg width="14" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></svg>
            </div>
            <span className="text-[13px] font-black uppercase tracking-tight">Available to Withdraw : <span className="text-[#e8612c]">₹ {balance.available_balance.toLocaleString()}</span></span>
          </div>
        </div>

        {/* ── Withdrawal Rules List ── */}
        <div className="space-y-2 px-2">
          <ul className="list-disc list-inside space-y-1.5">
            {WITHDRAWAL_RULES.map((rule, idx) => (
              <li key={idx} className="text-[11px] text-white font-medium leading-relaxed marker:text-white">
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Bank Selection Header ── */}
        <div className="flex items-center justify-between pt-4">
          <h3 className="text-[15px] font-black text-white uppercase tracking-tight">Bank Details</h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 h-9 px-5 bg-[#e15b24] hover:bg-[#ff7a45] text-white rounded-full text-[11px] font-black transition-all shadow-lg uppercase tracking-widest"
          >
            ADD NEW <span className="w-4 h-4 rounded-full bg-white text-[#e15b24] flex items-center justify-center text-[12px]">+</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bankAccounts.length === 0 ? (
            <div className="col-span-full bg-[#1a1a1a] border border-dashed border-white/10 rounded-2xl p-8 text-center">
              <Landmark size={32} className="mx-auto text-white/10 mb-3" />
              <p className="text-sm text-white/40 font-bold">No saved bank accounts found.</p>
            </div>
          ) : (
            bankAccounts.map((bank: any) => {
              const id = bank.id || bank.Id
              const isSelected = selectedBankId === id
              return (
                <div
                  key={id}
                  onClick={() => setSelectedBankId(id)}
                  className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${isSelected
                      ? 'bg-[#e15b24]/10 border-[#e15b24] shadow-xl'
                      : 'bg-[#1a1a1a] border-white/5 hover:border-white/20'
                    }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#e15b24] text-white' : 'bg-white/5 text-white/40'}`}>
                      <Landmark size={20} />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteBank(id); }}
                      className="p-2 text-white/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div>
                    <p className={`text-[13px] font-black uppercase tracking-tight text-white`}>{bank.Bank || 'Bank'}</p>
                    <p className="text-[11px] text-white font-medium truncate mt-0.5">{bank.ACno?.replace(/.(?=.{4})/g, '*') || '****'}</p>
                    <p className="text-[10px] text-white font-bold uppercase tracking-widest mt-2 opacity-50">{bank.ACholdername || 'N/A'}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* ── Withdrawal Amount Card ── */}
        <div className="space-y-4 pt-4">
          <h3 className="text-[15px] font-black text-white uppercase tracking-tight">Upload Amount</h3>
          <div className="bg-[#111] border border-white/5 rounded-xl p-6 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-white">Amount*</label>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-12 bg-white rounded-lg px-4 text-black text-lg font-bold focus:outline-none shadow-inner"
              />
            </div>

            <button
              disabled={submitting || !selectedBankId}
              onClick={handleWithdraw}
              className={`w-full h-12 rounded-lg text-sm font-black uppercase tracking-widest shadow-xl transition-all ${submitting || !selectedBankId
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-[#e15b24] hover:bg-[#ff7a45] text-white'
                }`}
            >
              {submitting ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'SUBMIT'}
            </button>
          </div>
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
