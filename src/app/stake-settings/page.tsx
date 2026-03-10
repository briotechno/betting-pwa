'use client'
import React, { useState } from 'react'
import { Settings, Save, RotateCcw, Target, ShieldCheck, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function StakeSettingsPage() {
  const [stakes, setStakes] = useState(['100', '500', '1000', '2000', '5000', '10000', '25000', '50000', '100000', '250000'])

  const handleStakeChange = (index: number, value: string) => {
    const newStakes = [...stakes]
    newStakes[index] = value
    setStakes(newStakes)
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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {stakes.map((stake, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-[9px] text-textMuted font-black uppercase tracking-widest px-1">Stake {idx + 1}</p>
              <div className="relative">
                <input 
                  type="text" 
                  value={stake} 
                  onChange={(e) => handleStakeChange(idx, e.target.value)}
                  className="w-full bg-surface border border-cardBorder rounded-lg py-2 px-3 text-sm font-black text-white focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
            <Button fullWidth className="flex-1">SAVE SETTINGS</Button>
            <Button variant="outline" className="px-6 flex items-center justify-center gap-2 text-textMuted hover:text-white">
                <RotateCcw size={16} /> RESET
            </Button>
        </div>
      </div>

      <div className="bg-card border border-cardBorder rounded-2xl p-6">
            <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">Auto Accept Odds Change</p>
                        <p className="text-[10px] text-textMuted uppercase tracking-widest font-black mt-0.5">Speed up your betting</p>
                    </div>
                </div>
                <div className="w-12 h-6 rounded-full bg-primary/20 border border-primary/30 relative flex items-center px-1">
                    <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/20 translate-x-6 transition-transform" />
                </div>
            </div>
      </div>

    </div>
  )
}
