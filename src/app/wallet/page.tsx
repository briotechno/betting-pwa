'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, Minus } from 'lucide-react'

export default function WalletPage() {
  const router = useRouter()

  return (
    <div className="bg-[#181818] min-h-screen text-white pb-20 relative font-sans">
      {/* Sub Header */}
      <div className="flex items-center px-4 py-3 bg-[#222222]">
        <button onClick={() => router.back()} className="text-[#e8612c] pr-3">
          <ChevronLeft size={22} className="stroke-[3]" />
        </button>
        <h1 className="text-[15px] font-bold text-white">Wallet</h1>
      </div>

      <div className="max-w-[600px] mx-auto w-full">
        <div className="pt-6 pb-4 space-y-6">
          <div className="text-center">
            <h2 className="text-[15px] font-bold text-white tracking-wide">Hi, Chiragraval9699@Gmail</h2>
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-[#262626] rounded-xl p-4 shadow-xl mx-4">
            <div className="flex justify-between items-center">
              <div className="space-y-4">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-white">Wallet Amount</p>
                  <p className="text-[20px] font-medium text-[#4caf50] tracking-wider">₹ 0</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-white">Net Exposure</p>
                  <p className="text-[20px] font-medium text-[#f44336] tracking-wider">0</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-[150px]">
                <button
                  onClick={() => router.push('/wallet/deposit')}
                  className="h-[34px] bg-gradient-to-r from-[#e8612c] to-[#f48545] rounded-full flex items-center justify-between px-3 group active:scale-95 transition-all shadow-md"
                >
                  <span className="text-[11px] font-black uppercase tracking-wider text-white">DEPOSIT</span>
                  <div className="w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Plus size={14} className="text-[#e8612c]" strokeWidth={4} />
                  </div>
                </button>
                <button
                  onClick={() => router.push('/wallet/withdrawal')}
                  className="h-[34px] bg-gradient-to-r from-[#e8612c] to-[#f48545] rounded-full flex items-center justify-between px-3 group active:scale-95 transition-all shadow-md"
                >
                  <span className="text-[11px] font-black uppercase tracking-wider text-white">WITHDRAWAL</span>
                  <div className="w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Minus size={14} className="text-[#e8612c]" strokeWidth={4} />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className="relative h-[1.5px] w-2/3 mx-auto mt-8 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* Gift Card Section */}
          <div className="space-y-4">
            <h3 className="text-center text-[19px] font-bold text-white tracking-wide">Your FairPlay Gift Card</h3>
            <div
              className="mx-4 rounded-[6px] overflow-hidden relative shadow-lg aspect-[16/7]"
              style={{
                backgroundImage: 'url("/Giftcard.png")',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Inner UI on top of background */}
              <div className="absolute bottom-3 left-3 flex gap-2 items-center z-10">
                <input
                  type="text"
                  placeholder="ENTER GIFT CODE"
                  className="w-[160px] sm:w-[200px] h-[36px] bg-white border border-gray-300 rounded-[3px] px-3 text-[12px] font-bold text-gray-800 outline-none placeholder-gray-400 shadow-sm"
                />
                <button className="px-5 h-[36px] bg-[#df5723] text-white rounded-[3px] text-[11px] font-black uppercase tracking-wider shadow active:scale-95 transition-all">
                  REDEEM
                </button>
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className="relative h-[1.5px] w-2/3 mx-auto mt-10 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* Pending Bonus Section */}
          <div className="space-y-5">
            <h3 className="text-center text-[19px] font-bold text-white tracking-wide">Pending Bonus Transfers</h3>
            <p className="text-center text-white text-[15px] font-medium pb-10">No Bonuses Found!</p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}

    </div>
  )
}
