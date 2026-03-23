'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Calendar, Loader2, Trophy, XCircle, ArrowDownLeft, ArrowUpRight, Landmark } from 'lucide-react'
import { statementController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'

export default function TransactionsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('ALL') // Default to ALL to see everything or filter
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  
  // States for filters
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])

  // Bet Statement States
  const [selectedBet, setSelectedBet] = useState<any>(null)
  const [betLoading, setBetLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchTransactions = useCallback(async () => {
    if (!user?.loginToken) return
    setLoading(true)
    try {
      const res = await statementController.getAccountStatement(user.loginToken, fromDate, toDate)
      // The API returns an object with numeric keys "0", "1", "2"...
      if (res && typeof res === 'object') {
        const dataArray = Object.entries(res)
          .filter(([key]) => !isNaN(Number(key))) // Keep only numeric index keys
          .map(([_, value]) => value as any)
        setTransactions(dataArray)
      } else {
        setTransactions([])
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [user?.loginToken, fromDate, toDate])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleApply = () => {
    fetchTransactions()
  }

  const handleTransactionClick = async (tx: any) => {
    const gid = tx["4"] || tx.gid || tx.gameId
    if (!gid) return

    setBetLoading(true)
    setIsModalOpen(true)
    try {
      const res = await statementController.getBetStatement(gid, user?.loginToken || '')
      if (res.error === '0') {
        setSelectedBet(res)
      } else {
        setSelectedBet({ error: '1', msg: res.msg || 'No details found' })
      }
    } catch (err) {
      console.error('Failed to fetch bet statement:', err)
    } finally {
      setBetLoading(false)
    }
  }

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'ALL') return true
    const typeKey = (tx["2"] || '').toUpperCase()
    const description = (tx["3"] || '').toLowerCase()
    
    const isDepositDescr = description.includes('deposit') || description.includes('topup')
    const isWithdrawDescr = description.includes('withdraw') || description.includes('payout')

    if (activeTab === 'DEPOSIT') {
      return typeKey === 'D' || (typeKey === 'CR' && isDepositDescr)
    }
    if (activeTab === 'WITHDRAW') {
      return typeKey === 'W' || (typeKey === 'DR' && isWithdrawDescr)
    }
    if (activeTab === 'WIN') {
      return typeKey === 'CR' && !isDepositDescr
    }
    if (activeTab === 'LOSS') {
      return typeKey === 'DR' && !isWithdrawDescr
    }
    return true
  })

  // Get icon and color based on category
  const getCategoryTheme = (typeKey: string, description: string) => {
    const desc = description.toLowerCase()
    const isDeposit = typeKey === 'D' || (typeKey === 'CR' && (desc.includes('deposit') || desc.includes('topup')))
    const isWithdraw = typeKey === 'W' || (typeKey === 'DR' && (desc.includes('withdraw') || desc.includes('payout')))
    
    if (isDeposit) return { icon: <ArrowDownLeft size={16} />, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Deposit' }
    if (isWithdraw) return { icon: <ArrowUpRight size={16} />, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Withdraw' }
    if (typeKey === 'CR') return { icon: <Trophy size={16} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'WIN' }
    if (typeKey === 'DR') return { icon: <XCircle size={16} />, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Loss' }
    if (typeKey === 'O') return { icon: <Landmark size={16} />, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Opening' }
    return { icon: <ArrowDownLeft size={16} />, color: 'text-white/40', bg: 'bg-white/5', label: 'Other' }
  }

  return (
    <div className="bg-[#111111] min-h-screen text-white flex flex-col pb-0">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#222222] border-b border-white/5">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
          <ChevronLeft size={22} className="stroke-[3]" />
        </button>
        <h1 className="text-[15px] font-bold uppercase tracking-wide">My Transactions</h1>
      </div>

      <div className="px-4 py-5 space-y-5 bg-[#222222] border-b border-white/10">
        {/* Date Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-white/60 mb-1 uppercase tracking-widest pl-1">From</label>
            <div className="relative">
              <input 
                type="date" 
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-xl h-[42px] px-4 text-white text-[13px] font-medium outline-none focus:border-[#e8612c] transition-colors appearance-none"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={16} />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-white/60 mb-1 uppercase tracking-widest pl-1">To</label>
            <div className="relative">
              <input 
                type="date" 
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-xl h-[42px] px-4 text-white text-[13px] font-medium outline-none focus:border-[#e8612c] transition-colors appearance-none"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div>
          <button 
            onClick={handleApply}
            disabled={loading}
            className="w-full sm:w-[170px] h-11 bg-[#e8612c] text-white rounded-xl text-[12px] font-black uppercase tracking-widest active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'APPLY FILTERS'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pb-20 overflow-y-auto">
        {/* Tabs */}
        <div className="flex px-4 pt-4 border-b border-white/5 sticky top-0 bg-[#111111] z-10 overflow-x-auto no-scrollbar scroll-smooth">
          {['ALL', 'DEPOSIT', 'WITHDRAW', 'WIN', 'LOSS'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`mr-8 pb-3 text-[11px] font-black tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'text-[#e8612c] border-b-2 border-[#e8612c]' 
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transaction Table */}
        <div className="flex-1 overflow-x-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-30">
               <Loader2 className="w-10 h-10 animate-spin text-[#e8612c] mb-3" />
               <p className="text-[10px] font-black uppercase tracking-widest">Updating Ledger...</p>
             </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center pt-8 gap-8">
              <h2 className="text-[14px] font-bold text-white/30 uppercase tracking-widest">No Records Found</h2>
              <div className="relative w-[130px] h-[130px] rounded-full border-[2px] border-white/5 flex items-center justify-center">
                <div className="absolute inset-y-0 w-[2px] bg-white/5" />
                <div className="absolute inset-x-0 h-[2px] bg-white/5" />
                <div className="absolute w-2 h-2 rounded-full bg-white/10" />
                <div className="absolute bottom-2">
                   <img 
                    src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZkOG9nbnkzZ3BtbmY0bmh6Ymx4Ymx4Ymx4Ymx4Ymx4Ymx4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKVUn7iM8FMEU24/giphy.gif" 
                    alt="Empty" 
                    className="w-12 h-12 grayscale opacity-20"
                  />
                </div>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="py-4 px-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Type</th>
                  <th className="py-4 px-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Date / ID</th>
                  <th className="py-4 px-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Description</th>
                  <th className="py-4 px-4 text-[9px] font-black text-white/40 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.map((tx, idx) => {
                  const amount = parseFloat(tx["1"] || 0)
                  const typeKey = (tx["2"] || '').toUpperCase()
                  const date = tx["0"]
                  const description = tx["3"]?.replace(/&nbsp;/g, ' ').replace(/Transcation/g, '').replace(/^\s*\/+\s*/, '') || ''
                  const hasGid = !!tx["4"]
                  const { icon, color, bg, label } = getCategoryTheme(typeKey, description)

                  return (
                    <tr 
                      key={idx} 
                      onClick={() => handleTransactionClick(tx)}
                      className={`group hover:bg-white/[0.03] transition-all duration-200 cursor-pointer ${hasGid ? 'active:bg-white/[0.05]' : ''}`}
                    >
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg} ${color}`}>
                            {icon}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-tight ${color}`}>{label}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="text-[10px] font-bold text-white/80">{date}</p>
                        {hasGid && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="w-1 h-1 rounded-full bg-[#e8612c]" />
                            <span className="text-[8px] font-black text-[#e8612c] uppercase tracking-tighter">ID: {tx["4"]}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-[10px] text-white/40 font-medium line-clamp-1 italic max-w-[200px]">
                          {description || 'No remark'}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <p className={`text-[12px] font-black tracking-tight ${amount >= 0 || typeKey === 'CR' || typeKey === 'O' ? 'text-green-500' : 'text-red-500'}`}>
                          {amount >= 0 || typeKey === 'CR' || typeKey === 'O' ? '+' : '-'}₹{Math.abs(amount).toLocaleString()}
                        </p>
                        <Badge variant="default" className="text-[7px] px-1 py-0 h-3 opacity-30 mt-1">Confirmed</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bet Statement Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Bet Statement Receipt"
        size="md"
        className="bet-slip-modal-dark"
      >
        <div className="p-6 bg-[#1a1a1a]">
          {betLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#e8612c] mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Loading Details...</p>
            </div>
          ) : selectedBet?.error === '1' ? (
            <div className="text-center py-6">
               <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} />
               </div>
               <p className="text-red-500 uppercase font-black text-[10px] tracking-widest">
                {selectedBet.msg}
               </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(selectedBet || {})
                .filter(([key]) => !isNaN(Number(key)))
                .map(([key, bet]: [string, any]) => (
                <div key={key} className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-4">
                   <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${bet.Type?.toLowerCase() === 'back' ? 'bg-[#e8612c]' : 'bg-red-500'}`} />
                       <p className="text-[11px] font-black text-white uppercase tracking-tight truncate max-w-[180px]">
                         {bet.Game?.replace(/&nbsp;/g, ' ')}
                       </p>
                    </div>
                    <Badge variant={bet.Type?.toLowerCase() === 'back' ? 'primary' : 'danger'} className="text-[8px] px-2 uppercase font-black bg-[#e8612c]">
                      {bet.Type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Selection</p>
                      <p className="text-[11px] font-bold text-white uppercase">{bet.Selection}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Date</p>
                      <p className="text-[9px] font-medium text-white/60">{bet.Date}</p>
                    </div>
                    <div className="flex items-end gap-1">
                      <div>
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Rate</p>
                        <p className="text-[13px] font-black text-[#e8612c] tracking-tighter">{bet.Rate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Stake</p>
                      <p className="text-[13px] font-black text-white tracking-tighter">₹{parseFloat(bet.Stake || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 bg-[#e8612c] text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#e8612c]/20 mt-2"
              >
                CLOSE RECEIPT
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
