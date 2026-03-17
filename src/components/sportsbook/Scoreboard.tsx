'use client'
import React from 'react'
import { Clock, Info, BarChart2, Users } from 'lucide-react'
import { toTitleCase } from '@/utils/format'


export default function Scoreboard() {
  return (
    <div className="bg-[#1a1a1a] text-white rounded-t-xl overflow-hidden shadow-lg border border-white/5">
      {/* Top Banner */}
      <div className="bg-black/40 px-4 py-1.5 flex justify-between items-center border-b border-white/5">
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-black bg-[#e8612c] px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">Live</span>
            <span className="text-[10px] text-white/60 font-medium uppercase tracking-widest">Match Detail</span>
         </div>
         <div className="text-[10px] font-black text-white/80 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            INN 2 | 6.0/20 OV
         </div>
      </div>

      {/* Main Score Area */}
      <div className="p-6 flex items-center justify-between relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -ml-24 -mb-24" />

        <div className="flex-1">
          <h2 className="text-xl font-black leading-tight tracking-tight mb-1">{toTitleCase("Silvertoan Panthers")}</h2>
          <div className="flex items-center gap-3">

            <p className="text-sm text-white/50 font-bold uppercase tracking-widest">9.75 RR</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-8 z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter">195/8</span>
            <span className="text-2xl text-white/20 font-light mx-2">:</span>
            <span className="text-4xl font-black tracking-tighter text-[#e8612c]">71/3</span>
          </div>
          <div className="mt-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg backdrop-blur-md">
            <p className="text-[10px] font-bold text-center uppercase tracking-tight">
               Bhawani Lions (71/3) require <span className="text-[#e8612c]">125 runs</span> from 84 balls.
            </p>
          </div>
        </div>

        <div className="flex-1 text-right">
          <h2 className="text-xl font-black leading-tight tracking-tight mb-1">{toTitleCase("Bhawani Lions")}</h2>
          <p className="text-sm text-white/50 font-bold uppercase tracking-widest leading-none">

            11.83 CRR | 8.93 RRR
          </p>
        </div>
      </div>

      {/* Stats Tabs - Hidden on Mobile */}
      <div className="hidden md:flex border-t border-white/5 bg-black/60">
        <button className="flex-1 py-3 flex items-center justify-center gap-2 border-b-2 border-[#e8612c] bg-white/5 transition-all">
          <BarChart2 size={14} className="text-[#e8612c]" />
          <span className="text-[11px] font-black uppercase tracking-widest text-white">Scorecard</span>
        </button>
        <button className="flex-1 py-3 flex items-center justify-center gap-2 border-b-2 border-transparent text-white/40 hover:text-white transition-all uppercase tracking-widest">
           <BarChart2 size={14} />
           <span className="text-[11px] font-black">Statistics</span>
        </button>
        <button className="flex-1 py-3 flex items-center justify-center gap-2 border-b-2 border-transparent text-white/40 hover:text-white transition-all uppercase tracking-widest">
           <Users size={14} />
           <span className="text-[11px] font-black">Head to head</span>
        </button>
      </div>

      {/* Scorecard Detailed View - Hidden on Mobile */}
      <div className="hidden md:flex p-4 bg-[#0d0d0d] gap-4 border-t border-white/5">
         <div className="w-1/2 space-y-3">
            <div className="grid grid-cols-4 text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1 border-b border-white/5 pb-1">
               <div className="col-span-2">Batter</div>
               <div className="text-center">R</div>
               <div className="text-center">B</div>
            </div>
            <div className="grid grid-cols-4 text-[11px] items-center">
               <div className="col-span-2 flex flex-col">
                  <span className="font-black text-white uppercase">Choudhary, Udit</span>
                  <span className="text-[9px] text-white/40 uppercase">NOT OUT</span>
               </div>
               <div className="text-center font-black text-white text-lg">33</div>
               <div className="text-center font-bold text-white/60">17</div>
            </div>
            <div className="grid grid-cols-4 text-[11px] items-center border-t border-white/5 pt-2">
               <div className="col-span-2 flex flex-col">
                  <span className="font-black text-white/60 uppercase">Lavish, -</span>
                  <span className="text-[9px] text-[#e8612c] font-black uppercase flex items-center gap-1">
                     <div className="w-1 h-1 bg-[#e8612c] rounded-full animate-ping" />
                     On Strike
                  </span>
               </div>
               <div className="text-center font-black text-white/60 text-lg">1</div>
               <div className="text-center font-bold text-white/30">1</div>
            </div>
         </div>

         <div className="flex-1 bg-white/5 rounded-lg border border-white/5 p-3 flex flex-col justify-center items-center">
             <div className="w-full h-24 bg-gradient-to-br from-green-900/40 to-green-800/40 rounded-md border border-white/5 flex items-center justify-center relative overflow-hidden">
                {/* Graphics Mockup */}
                <div className="absolute inset-x-0 bottom-4 h-[2px] bg-white/20" />
                <div className="absolute left-1/4 bottom-4 h-8 w-[2px] bg-white/40" />
                <div className="absolute right-1/4 bottom-4 h-8 w-[2px] bg-white/40" />
                <div className="flex flex-col items-center">
                   <div className="w-4 h-4 bg-[#e8612c] rounded-full blur-sm mb-1" />
                   <span className="text-[9px] font-black uppercase text-white/60">Wagon Wheel</span>
                </div>
             </div>
         </div>
      </div>
    </div>
  )
}
