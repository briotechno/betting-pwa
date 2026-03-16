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
              <button className="h-[34px] bg-gradient-to-r from-[#e8612c] to-[#f48545] rounded-full flex items-center justify-between px-3 group active:scale-95 transition-all shadow-md">
                <span className="text-[11px] font-black uppercase tracking-wider text-white">DEPOSIT</span>
                <div className="w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Plus size={14} className="text-[#e8612c]" strokeWidth={4} />
                </div>
              </button>
              <button className="h-[34px] bg-gradient-to-r from-[#e8612c] to-[#f48545] rounded-full flex items-center justify-between px-3 group active:scale-95 transition-all shadow-md">
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

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-[90px] xl:bottom-10 left-4 z-50">
        <a href="https://wa.me/" target="_blank" rel="noreferrer" className="w-[54px] h-[54px] bg-[#25d366] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(37,211,102,0.4)] active:scale-95 transition-transform">
          <svg viewBox="0 0 24 24" fill="white" className="w-[34px] h-[34px]">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </a>
      </div>
    </div>
  )
}
