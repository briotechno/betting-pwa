'use client'
import React, { useState, useEffect } from 'react'
import { Settings, Save, RotateCcw, Target, ShieldCheck, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { userController } from '@/controllers'

export default function StakeSettingsPage() {
  const { 
    confirmBeforePlace, 
    toggleConfirmBeforePlace, 
    autoAcceptOdds, 
    toggleAutoAcceptOdds 
  } = useBetSlipStore()
  const { isAuthenticated } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()
  
  const [stakes, setStakes] = useState<{ label: string, value: string }[]>([
    { label: '', value: '100' },
    { label: '', value: '500' },
    { label: '', value: '1000' },
    { label: '', value: '2000' },
    { label: '', value: '5000' },
    { label: '', value: '10000' }
  ])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    const fetchStakes = async () => {
      if (!isAuthenticated) return
      
      setFetching(true)
      try {
        const token = localStorage.getItem('fairbet-auth') ? 
          JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
        
        if (!token) return

        const response = await userController.getStakeButtons(token)
        if (response.error === '0' && response.Btnname && response.Btnval) {
          const newStakes = response.Btnname.map((name: string, i: number) => ({
            label: name,
            value: response.Btnval[i] || '0'
          }))
          // API might return more or less, we want exactly 6 for the UI/API consistency
          const finalStakes = [...newStakes]
          while (finalStakes.length < 6) finalStakes.push({ label: '', value: '0' })
          setStakes(finalStakes.slice(0, 6))
        }
      } catch (error) {
        console.error('Failed to fetch stakes:', error)
      } finally {
        setFetching(false)
      }
    }

    fetchStakes()
  }, [isAuthenticated])

  const handleLabelChange = (index: number, label: string) => {
    const newStakes = [...stakes]
    newStakes[index].label = label
    setStakes(newStakes)
  }

  const handleValueChange = (index: number, value: string) => {
    const newStakes = [...stakes]
    newStakes[index].value = value
    setStakes(newStakes)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('fairbet-auth') ? 
        JSON.parse(localStorage.getItem('fairbet-auth')!).state.user?.loginToken : null
      
      if (!token) {
        showSnackbar('You must be logged in to save settings', 'error')
        return
      }

      const payload: Record<string, string> = {}
      stakes.forEach((s, i) => {
        payload[`Label${i + 1}`] = s.label || `Stake ${i + 1}`
        payload[`Stake${i + 1}`] = s.value
      })

      const response = await userController.editStake(token, payload)
      if (response.error === '0') {
        showSnackbar('Stake settings saved successfully', 'success')
      } else {
        showSnackbar(response.msg || 'Failed to save stake settings', 'error')
      }
    } catch (error) {
      showSnackbar('An error occurred while saving settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={24} className="text-primary" />
        <h1 className="text-xl font-bold text-white uppercase tracking-tight">Stake Settings</h1>
      </div>

      <div className="bg-card border border-cardBorder rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <Target size={24} className="text-primary" />
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-tight">Quick Stakes</p>
            <p className="text-[10px] text-textMuted uppercase tracking-widest font-black">Customize your bet buttons</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {fetching ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            stakes.map((stake, idx) => (
              <div key={idx} className="space-y-2 p-3 rounded-xl bg-surface border border-cardBorder">
                <div className="space-y-1">
                  <p className="text-[9px] text-textMuted font-black uppercase tracking-widest px-1">Label {idx + 1}</p>
                  <input 
                    type="text" 
                    value={stake.label} 
                    onChange={(e) => handleLabelChange(idx, e.target.value)}
                    placeholder={`e.g. Stake ${idx + 1}`}
                    className="w-full bg-black/40 border border-cardBorder rounded-lg py-1.5 px-3 text-[12px] font-bold text-white focus:border-primary focus:outline-none transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-textMuted font-black uppercase tracking-widest px-1">Value</p>
                  <input 
                    type="number" 
                    value={stake.value} 
                    onChange={(e) => handleValueChange(idx, e.target.value)}
                    className="w-full bg-black/40 border border-cardBorder rounded-lg py-1.5 px-3 text-[12px] font-bold text-white focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 flex gap-3">
            <Button 
              fullWidth 
              className="flex-1" 
              onClick={handleSave}
              disabled={loading || fetching}
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
              SAVE SETTINGS
            </Button>
            <Button 
              variant="outline" 
              className="px-6 flex items-center justify-center gap-2 text-textMuted hover:text-white"
              onClick={() => window.location.reload()}
              disabled={loading || fetching}
            >
                <RotateCcw size={16} /> RESET
            </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-card border border-cardBorder rounded-2xl p-6">
              <div className="flex items-center justify-between group cursor-pointer" onClick={toggleAutoAcceptOdds}>
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                          <ShieldCheck size={20} />
                      </div>
                      <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">Auto Accept Odds Change</p>
                          <p className="text-[10px] text-textMuted uppercase tracking-widest font-black mt-0.5">Speed up your betting</p>
                      </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full border relative flex items-center px-1 transition-colors ${autoAcceptOdds ? 'bg-primary/20 border-primary/30' : 'bg-surface border-cardBorder'}`}>
                      <div className={`w-4 h-4 rounded-full shadow-lg transition-transform ${autoAcceptOdds ? 'bg-primary translate-x-6' : 'bg-textMuted translate-x-0'}`} />
                  </div>
              </div>
        </div>

        <div className="bg-card border border-cardBorder rounded-2xl p-6">
              <div className="flex items-center justify-between group cursor-pointer" onClick={toggleConfirmBeforePlace}>
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <ShieldCheck size={20} />
                      </div>
                      <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">Confirm bets before placing</p>
                          <p className="text-[10px] text-textMuted uppercase tracking-widest font-black mt-0.5">Safeguard your bets</p>
                      </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full border relative flex items-center px-1 transition-colors ${confirmBeforePlace ? 'bg-primary/20 border-primary/30' : 'bg-surface border-cardBorder'}`}>
                      <div className={`w-4 h-4 rounded-full shadow-lg transition-transform ${confirmBeforePlace ? 'bg-primary translate-x-6' : 'bg-textMuted translate-x-0'}`} />
                  </div>
              </div>
        </div>
      </div>


    </div>
  )
}
