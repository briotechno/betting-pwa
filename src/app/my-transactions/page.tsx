'use client'
import React, { useEffect, useState } from 'react'
import { Landmark, Search, Filter, Loader2, Trophy, XCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { statementController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'
import Modal from '@/components/ui/Modal'

export default function MyTransactionsPage() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [statement, setStatement] = useState<any[]>([])
  const [selectedBet, setSelectedBet] = useState<any>(null)
  const [betLoading, setBetLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('All')

  // Default date range: Last 7 days
  const today = new Date().toISOString().split('T')[0]
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  useEffect(() => {
    fetchStatement()
  }, [user?.loginToken])

  const fetchStatement = async () => {
    if (!user?.loginToken) return
    setLoading(true)
    try {
      const res = await statementController.getAccountStatement(user.loginToken, lastWeek, today)
      // The API returns an object with numeric keys "0", "1", "2"...
      if (res && typeof res === 'object') {
        const dataArray = Object.entries(res)
          .filter(([key]) => !isNaN(Number(key))) // Keep only numeric index keys
          .map(([_, value]) => value as any)
        setStatement(dataArray)
      } else {
        setStatement([])
      }
    } catch (err) {
      console.error('Failed to fetch statement:', err)
      setStatement([])
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionClick = async (tx: any) => {
    const gid = tx["4"] || tx.gid || tx.gameId // Use numeric key "4" from response
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

  // Get icon and color based on category
  const getCategoryTheme = (typeKey: string, description: string) => {
    const desc = (description || '').toLowerCase()
    const isDeposit = typeKey === 'D' || (typeKey === 'CR' && (desc.includes('deposit') || desc.includes('topup')))
    const isWithdraw = typeKey === 'W' || (typeKey === 'DR' && (desc.includes('withdraw') || desc.includes('payout')))
    
    if (isDeposit) return { icon: <ArrowDownLeft size={16} />, color: 'text-success', bg: 'bg-success/10', label: 'Deposit' }
    if (isWithdraw) return { icon: <ArrowUpRight size={16} />, color: 'text-danger', bg: 'bg-danger/10', label: 'Withdraw' }
    if (typeKey === 'CR') return { icon: <Trophy size={16} />, color: 'text-warning', bg: 'bg-warning/10', label: 'WIN' }
    if (typeKey === 'DR') return { icon: <XCircle size={16} />, color: 'text-danger', bg: 'bg-danger/10', label: 'Loss' }
    if (typeKey === 'O') return { icon: <Landmark size={16} />, color: 'text-primary', bg: 'bg-primary/10', label: 'Opening' }
    return { icon: <ArrowDownLeft size={16} />, color: 'text-textMuted', bg: 'bg-cardBorder', label: 'Other' }
  }

  const filteredStatement = statement.filter(tx => {
    if (activeTab === 'All') return true
    const type = (tx["2"] || '').toUpperCase()
    const description = (tx["3"] || '').toLowerCase()
    
    const isDepositDescr = description.includes('deposit') || description.includes('topup')
    const isWithdrawDescr = description.includes('withdraw') || description.includes('payout')

    if (activeTab === 'Deposits') return type === 'CR' || type === 'D' || isDepositDescr
    if (activeTab === 'Withdrawals') return type === 'W' || (type === 'DR' && isWithdrawDescr)
    if (activeTab === 'Win') return type === 'CR' && !isDepositDescr
    if (activeTab === 'Loss') return type === 'DR' && !isWithdrawDescr
    if (activeTab === 'Bets') return description.includes('match') || description.includes('odd') || !!tx["4"]
    if (activeTab === 'Bonus') return description.includes('bonus') || description.includes('offer')
    
    return true
  })

  return (
    <div className="max-w-5xl mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Landmark size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none uppercase">Statement</h1>
            <p className="text-[10px] text-textMuted uppercase font-black tracking-widest mt-1">Wallet Activity</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-card border border-cardBorder rounded-xl text-textMuted hover:text-white transition-colors">
            <Search size={18} />
          </button>
          <button className="p-2.5 bg-card border border-cardBorder rounded-xl text-textMuted hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar scroll-smooth">
        {['All', 'Deposits', 'Withdrawals', 'Win', 'Loss', 'Bets', 'Bonus'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
              activeTab === tab 
              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
              : 'bg-card border-cardBorder text-textMuted hover:text-white hover:border-textMuted'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="bg-card border border-cardBorder rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-[10px] uppercase tracking-widest font-black">Syncing Ledger...</p>
            </div>
          ) : filteredStatement.length === 0 ? (
            <div className="text-center py-20 bg-card/30">
              <div className="w-12 h-12 bg-cardBorder rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                <Landmark size={24} />
              </div>
              <p className="text-[11px] text-textMuted uppercase font-black tracking-widest leading-relaxed">
                No records found<br/><span className="opacity-50 text-[9px]">Check your filters or date range</span>
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-cardBorder">
                  <th className="py-4 px-6 text-[9px] font-black text-textMuted uppercase tracking-widest">Category</th>
                  <th className="py-4 px-6 text-[9px] font-black text-textMuted uppercase tracking-widest">Date / Game ID</th>
                  <th className="py-4 px-6 text-[9px] font-black text-textMuted uppercase tracking-widest">Details</th>
                  <th className="py-4 px-6 text-[9px] font-black text-textMuted uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cardBorder">
                {filteredStatement.map((tx: any, idx: number) => {
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
                      className={`group hover:bg-white/[0.02] transition-colors cursor-pointer ${hasGid ? 'active:bg-white/[0.03]' : ''}`}
                    >
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg} ${color}`}>
                            {icon}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-tight ${color}`}>{label}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <p className="text-[10px] font-bold text-white/90">{date}</p>
                        {hasGid && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1 h-1 rounded-full bg-primary" />
                            <span className="text-[8px] font-black text-primary uppercase tracking-tighter">ID: {tx["4"]}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[10px] text-textMuted font-medium line-clamp-1 italic max-w-[200px]">
                          {description || 'No additional details'}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <p className={`text-[12px] font-black tracking-tight ${amount >= 0 || typeKey === 'CR' || typeKey === 'O' ? 'text-success' : 'text-danger'}`}>
                          {amount >= 0 || typeKey === 'CR' || typeKey === 'O' ? '+' : '-'}₹{Math.abs(amount).toLocaleString()}
                        </p>
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-20 mt-1 block">Confirmed</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={() => window.print()}
          className="group flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-primary transition-all active:scale-95"
        >
          <Landmark size={14} className="group-hover:rotate-12 transition-transform" />
          Download Statement (PDF)
        </button>
      </div>

      {/* Bet Statement Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Bet Statement Detail"
        size="md"
        className="bet-slip-modal-dark"
      >
        <div className="p-6 bg-card">
          {betLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-5" />
              <p className="text-[10px] font-black uppercase tracking-widest text-textMuted">Reading Smart Receipt...</p>
            </div>
          ) : selectedBet?.error === '1' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
                 <Landmark size={32} />
              </div>
              <p className="text-danger uppercase font-black text-[10px] tracking-widest">
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
                       <span className={`w-2 h-2 rounded-full ${bet.Type?.toLowerCase() === 'back' ? 'bg-primary' : 'bg-danger'}`} />
                       <p className="text-[11px] font-black text-white uppercase tracking-tight truncate max-w-[180px]">
                         {bet.Game?.replace(/&nbsp;/g, ' ')}
                       </p>
                    </div>
                    <Badge variant={bet.Type?.toLowerCase() === 'back' ? 'primary' : 'danger'} className="text-[8px] px-2 uppercase font-black">
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
                        <p className="text-[13px] font-black text-primary tracking-tighter">{bet.Rate}</p>
                      </div>
                      <span className="text-[10px] text-white/20 pb-0.5 font-bold mb-0.5 ml-1">@</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Stake</p>
                      <p className="text-[13px] font-black text-white tracking-tighter">₹{parseFloat(bet.Stake).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 mt-2"
              >
                Dismiss Receipt
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
