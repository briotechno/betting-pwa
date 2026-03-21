'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { userController } from '@/controllers'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [stakes, setStakes] = useState<{ label: string, value: string }[]>([
    { label: 'S1', value: '100' },
    { label: 'S2', value: '500' },
    { label: 'S3', value: '1000' },
    { label: 'S4', value: '5000' },
    { label: 'S5', value: '10000' },
    { label: 'S6', value: '25000' }
  ])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    const fetchStakes = async () => {
      if (!isAuthenticated || !user?.loginToken) return
      
      setFetching(true)
      try {
        const response = await userController.getStakeButtons(user.loginToken)
        if (response.error === '0' && response.Btnname && response.Btnval) {
          const fetchedStakes = response.Btnname.map((name: string, i: number) => ({
            label: name,
            value: response.Btnval[i] || '0'
          }))
          // Ensure we have 6 stakes
          const finalStakes = [...fetchedStakes]
          while (finalStakes.length < 6) finalStakes.push({ label: `S${finalStakes.length + 1}`, value: '0' })
          setStakes(finalStakes.slice(0, 6))
        }
      } catch (error) {
        console.error('Failed to fetch stakes:', error)
      } finally {
        setFetching(false)
      }
    }

    fetchStakes()
  }, [isAuthenticated, user?.loginToken])

  const handleSave = async () => {
    if (!isAuthenticated || !user?.loginToken) {
      showSnackbar('You must be logged in to save settings', 'error')
      return
    }

    setLoading(true)
    try {
      const payload: Record<string, string> = {}
      stakes.forEach((s, i) => {
        payload[`Label${i + 1}`] = s.label || `S${i + 1}`
        payload[`Stake${i + 1}`] = s.value
      })

      const response = await userController.editStake(user.loginToken, payload)
      if (response.error === '0') {
        showSnackbar('Settings saved successfully', 'success')
        setIsEditing(false)
      } else {
        showSnackbar(response.msg || 'Failed to save settings', 'error')
      }
    } catch (error) {
      showSnackbar('An error occurred during save', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#181818] min-h-screen text-white pb-20 font-sans flex flex-col">
      {/* Sub Header */}
      <div className="bg-[#222222]">
        <div className="flex items-center px-4 py-3 max-w-[500px]">
          <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
            <ChevronLeft size={22} className="stroke-[3]" />
          </button>
          <h1 className="text-[15px] font-bold text-white uppercase tracking-tight">Settings</h1>
        </div>
      </div>

      <div className="p-4 pt-4 max-w-[500px] w-full">
        <h2 className="text-[#e8612c] text-[15px] font-bold mb-2">Edit Stakes</h2>

        {/* Stake Grid Card */}
        <div className="bg-white rounded-[4px] p-4 border-[2px] border-[#e8612c] shadow-2xl relative">
          {fetching && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
               <Loader2 className="animate-spin text-[#e8612c]" />
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-x-2 gap-y-4 mb-6 pt-2">
            {isEditing ? (
              stakes.map((stake, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={stake.value}
                    onChange={(e) => {
                      const newStakes = [...stakes]
                      newStakes[idx].value = e.target.value
                      setStakes(newStakes)
                    }}
                    placeholder="Value"
                    className="w-full h-10 border border-gray-400 rounded-[3px] text-[#333] text-[15px] font-medium text-center shadow-inner outline-none focus:border-[#e8612c]"
                  />
                  <input
                    type="text"
                    value={stake.label}
                    onChange={(e) => {
                      const newStakes = [...stakes]
                      newStakes[idx].label = e.target.value
                      setStakes(newStakes)
                    }}
                    placeholder="Label"
                    className="w-full h-6 border border-gray-300 rounded-[3px] text-[#666] text-[10px] font-medium text-center outline-none focus:border-[#e8612c]"
                  />
                </div>
              ))
            ) : (
              stakes.map((stake, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div
                    className="bg-[#e8612c] text-white h-10 rounded-[3px] flex items-center justify-center text-[15px] font-black tracking-tight shadow-md"
                  >
                    +{stake.value}
                  </div>
                  <div className="text-[10px] text-[#666] font-bold text-center uppercase">{stake.label}</div>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="h-[44px] border border-gray-400 text-[#333] text-[14px] font-bold uppercase tracking-widest rounded-[3px] active:scale-95 transition-all hover:bg-gray-50"
                  disabled={fetching}
                >
                  EDIT
                </button>
                <button className="h-[44px] bg-[#dfdfdf] text-[#999] text-[14px] font-bold uppercase tracking-widest rounded-[3px] cursor-not-allowed">
                  SAVE
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="h-[44px] border border-gray-400 text-[#333] text-[14px] font-bold uppercase tracking-widest rounded-[3px] active:scale-95 transition-all hover:bg-gray-50"
                  disabled={loading}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  className="h-[44px] bg-[#e8612c] text-white text-[14px] font-bold uppercase tracking-widest rounded-[3px] shadow-lg active:scale-95 transition-all hover:bg-[#ff7a45] flex items-center justify-center disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'SAVE'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>


    </div>
  )
}
