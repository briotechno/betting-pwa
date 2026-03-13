'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, Minus } from 'lucide-react'

export default function WalletPage() {
  const router = useRouter()

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#1a1a1a] shadow-md">
        <button onClick={() => router.back()} className="text-white/80 pr-3">
          <ChevronLeft size={24} color="#e15b24" />
        </button>
        <h1 className="text-[17px] font-bold">Wallet</h1>
      </div>

      <div className="p-4 space-y-8">
        <div className="text-center py-2">
          <h2 className="text-[16px] font-bold text-white/90">Hi, Chiragraval9699@Gmail</h2>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[12px] font-bold text-white/60">Wallet Amount</p>
                <p className="text-[22px] font-black text-[#4caf50]">₹ 0</p>
              </div>
              <div className="space-y-1">
                <p className="text-[12px] font-bold text-white/60">Net Exposure</p>
                <p className="text-[18px] font-black text-[#f44336]">0</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-1/2">
              <button className="h-10 bg-[#e15b24] rounded-full flex items-center justify-between px-4 group active:scale-95 transition-all">
                <span className="text-[11px] font-black uppercase tracking-wider">DEPOSIT</span>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <Plus size={12} className="text-[#e15b24]" strokeWidth={4} />
                </div>
              </button>
              <button className="h-10 bg-[#e15b24] rounded-full flex items-center justify-between px-4 group active:scale-95 transition-all">
                <span className="text-[11px] font-black uppercase tracking-wider">WITHDRAWAL</span>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <Minus size={12} className="text-[#e15b24]" strokeWidth={4} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Gift Card Section */}
        <div className="space-y-4">
          <h3 className="text-center text-[20px] font-black uppercase tracking-tight">Your FairPlay Gift Card</h3>
          <div className="bg-[#fff] rounded-xl overflow-hidden shadow-2xl flex flex-col items-center p-6 relative">
             <div className="flex w-full mb-6">
                 <div className="w-1/2 flex items-center">
                    <img src="/logo.png" alt="Fairplay" className="h-8 object-contain brightness-0" />
                 </div>
                 <div className="w-1/2 flex flex-col items-end">
                    <span className="text-[32px] font-black text-[#333] leading-none">GIFT</span>
                    <span className="text-[18px] font-bold text-[#666] leading-none tracking-[4px]">CARD</span>
                 </div>
             </div>
             
             <div className="flex w-full gap-2">
                <input 
                  type="text" 
                  placeholder="ENTER GIFT CODE" 
                  className="flex-1 h-11 border-2 border-gray-200 rounded-md px-4 text-[13px] font-bold text-gray-800 outline-none focus:border-[#e15b24] transition-all"
                />
                <button className="px-6 h-11 bg-[#e15b24] text-white rounded-md text-[11px] font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all">
                  REDEEM
                </button>
             </div>

             {/* Pattern overlay */}
             <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#e15b24]/10 pointer-events-none" />
          </div>
        </div>

        {/* Pending Bonus Section */}
        <div className="space-y-6 pt-4">
          <div className="h-px bg-white/10 w-full" />
          <h3 className="text-center text-[20px] font-black uppercase tracking-tight">Pending Bonus Transfers</h3>
          <p className="text-center text-white/50 text-[14px] font-bold py-4">No Bonuses Found!</p>
        </div>
      </div>
    </div>
  )
}
