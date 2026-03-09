'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Wallet, ArrowDownCircle, ArrowUpCircle, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'

const walletTabs = ['Overview', 'Deposit', 'Withdraw', 'History']

const transactions = [
  { id: 1, type: 'deposit', amount: 5000, status: 'success', date: '2024-01-15 14:32', method: 'UPI' },
  { id: 2, type: 'bet', amount: -500, status: 'success', date: '2024-01-15 15:10', method: 'Cricket - IND vs AUS' },
  { id: 3, type: 'win', amount: 1240, status: 'success', date: '2024-01-15 17:45', method: 'Cricket - IND vs AUS' },
  { id: 4, type: 'withdraw', amount: -2000, status: 'pending', date: '2024-01-16 09:15', method: 'Bank Transfer' },
  { id: 5, type: 'deposit', amount: 3000, status: 'success', date: '2024-01-16 10:00', method: 'PhonePe' },
  { id: 6, type: 'bet', amount: -200, status: 'success', date: '2024-01-16 11:20', method: 'Soccer - MU vs ARS' },
  { id: 7, type: 'withdraw', amount: -1500, status: 'failed', date: '2024-01-16 12:00', method: 'Bank Transfer' },
]

const depositMethods = [
  { id: 'upi', name: 'UPI', icon: '📱', min: 100, max: 100000 },
  { id: 'phonepe', name: 'PhonePe', icon: '💜', min: 100, max: 100000 },
  { id: 'gpay', name: 'Google Pay', icon: '🔵', min: 100, max: 100000 },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦', min: 500, max: 500000 },
  { id: 'card', name: 'Debit/Credit', icon: '💳', min: 500, max: 200000 },
]

const quickAmounts = [500, 1000, 2000, 5000, 10000, 25000]

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const { user } = useAuthStore()

  const balance = user?.balance || 0

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Wallet Header */}
      <div className="bg-gradient-to-r from-primary/80 to-orange-600/80 rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={20} className="text-white/80" />
            <span className="text-white/80 text-sm font-medium">My Wallet</span>
          </div>
          <p className="text-4xl font-black text-white mb-1">₹{balance.toLocaleString()}</p>
          <p className="text-white/70 text-sm">Available Balance</p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setActiveTab('Deposit')}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <ArrowDownCircle size={16} />
              Deposit
            </button>
            <button
              onClick={() => setActiveTab('Withdraw')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/30 transition-colors"
            >
              <ArrowUpCircle size={16} />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Main Wallet', value: `₹${balance.toLocaleString()}`, color: 'text-textPrimary' },
          { label: 'Exposure', value: '₹0', color: 'text-danger' },
          { label: 'Bonus', value: '₹0', color: 'text-success' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-cardBorder rounded-xl p-3 text-center">
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-textMuted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-cardBorder mb-5 overflow-x-auto no-scrollbar">
        {walletTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Deposit Tab */}
      {activeTab === 'Deposit' && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-textPrimary mb-3">Select Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              {depositMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/10'
                      : 'border-cardBorder bg-card hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-[11px] font-medium text-textPrimary">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Input
              label="Enter Amount"
              type="number"
              placeholder="Enter deposit amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setDepositAmount(String(amt))}
                  className="px-3 py-1 bg-surface border border-cardBorder hover:border-primary text-xs text-textSecondary hover:text-primary rounded-full transition-colors"
                >
                  ₹{amt >= 1000 ? `${amt / 1000}K` : amt}
                </button>
              ))}
            </div>
          </div>

          {depositAmount && (
            <div className="bg-card rounded-xl border border-cardBorder p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Deposit Amount</span>
                <span className="text-textPrimary font-semibold">₹{Number(depositAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Processing Fee</span>
                <span className="text-success">FREE</span>
              </div>
              <div className="h-px bg-cardBorder" />
              <div className="flex justify-between text-sm font-bold">
                <span className="text-textPrimary">You&apos;ll Receive</span>
                <span className="text-primary">₹{Number(depositAmount).toLocaleString()}</span>
              </div>
            </div>
          )}

          <Button fullWidth size="lg" disabled={!depositAmount}>
            PROCEED TO PAYMENT
          </Button>

          <p className="text-xs text-textMuted text-center">
            Minimum: ₹100 • Maximum: ₹1,00,000 • Instant processing
          </p>
        </div>
      )}

      {/* Withdraw Tab */}
      {activeTab === 'Withdraw' && (
        <div className="space-y-5">
          <div className="bg-warn/10 border border-warn/30 rounded-xl p-4">
            <p className="text-xs text-warn font-medium">⚠️ Complete KYC verification before withdrawal</p>
          </div>

          <Input
            label="Withdraw Amount"
            type="number"
            placeholder="Enter amount to withdraw"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setWithdrawAmount(String(amt))}
                className="px-3 py-1 bg-surface border border-cardBorder hover:border-primary text-xs text-textSecondary hover:text-primary rounded-full transition-colors"
              >
                ₹{amt >= 1000 ? `${amt / 1000}K` : amt}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <Input label="Bank Account Number" placeholder="Enter account number" />
            <Input label="IFSC Code" placeholder="Enter IFSC code" />
            <Input label="Account Holder Name" placeholder="Enter full name" />
          </div>

          <Button fullWidth size="lg" variant="outline" disabled={!withdrawAmount}>
            REQUEST WITHDRAWAL
          </Button>
        </div>
      )}

      {/* Transaction History */}
      {(activeTab === 'History' || activeTab === 'Overview') && (
        <div className="space-y-2">
          {activeTab === 'Overview' && (
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-textPrimary">Recent Transactions</h3>
              <button onClick={() => setActiveTab('History')} className="text-xs text-primary hover:underline">
                View All
              </button>
            </div>
          )}
          {(activeTab === 'History' ? transactions : transactions.slice(0, 4)).map((tx) => (
            <div key={tx.id} className="bg-card border border-cardBorder rounded-xl p-3 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                tx.type === 'deposit' ? 'bg-success/20' :
                tx.type === 'win' ? 'bg-success/20' :
                tx.type === 'bet' ? 'bg-primary/20' :
                'bg-danger/20'
              }`}>
                {tx.type === 'deposit' && <ArrowDownCircle size={18} className="text-success" />}
                {tx.type === 'win' && <CheckCircle size={18} className="text-success" />}
                {tx.type === 'bet' && <Wallet size={18} className="text-primary" />}
                {tx.type === 'withdraw' && <ArrowUpCircle size={18} className="text-danger" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-textPrimary capitalize">{tx.type}</p>
                <p className="text-[10px] text-textMuted truncate">{tx.method}</p>
                <p className="text-[10px] text-textMuted">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                  {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                </p>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  tx.status === 'success' ? 'bg-success/20 text-success' :
                  tx.status === 'pending' ? 'bg-warn/20 text-warn' :
                  'bg-danger/20 text-danger'
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
