'use client'
import React from 'react'
import { FileText, ChevronRight, Scale, Info, ShieldAlert, BadgeCheck } from 'lucide-react'

export default function RulesPage() {
  const sections = [
    { title: 'General Rules', icon: <Info size={18} />, color: 'text-blue-400' },
    { title: 'Sports Betting Rules', icon: <Scale size={18} />, color: 'text-primary' },
    { title: 'Casino Rules', icon: <BadgeCheck size={18} />, color: 'text-orange-400' },
    { title: 'Responsible Gaming', icon: <ShieldAlert size={18} />, color: 'text-red-400' },
    { title: 'Terms of Service', icon: <FileText size={18} />, color: 'text-indigo-400' },
    { title: 'Privacy Policy', icon: <ShieldAlert size={18} />, color: 'text-green-400' },
  ]

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <FileText size={24} className="text-primary" />
        <h1 className="text-xl font-bold text-white uppercase tracking-tight">Rules & Regulations</h1>
      </div>

      <div className="bg-card border border-cardBorder rounded-2xl overflow-hidden mb-6">
        {sections.map((section, idx) => (
          <div 
            key={section.title} 
            className="flex items-center justify-between p-5 border-b border-cardBorder/50 last:border-none hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-colors group-hover:bg-white/10 ${section.color}`}>
                {section.icon}
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">{section.title}</h3>
            </div>
            <ChevronRight size={18} className="text-textMuted group-hover:translate-x-1 transition-transform" />
          </div>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
            <p className="text-[10px] text-primary/80 font-black uppercase tracking-widest leading-relaxed mb-4">
                Version 2.4.1 Updated: Feb 2024
            </p>
            <p className="text-[11px] text-textMuted font-bold leading-relaxed mb-6">
                Please make sure to read and understand all the rules and regulations. By signing up, you agree to these legal terms.
            </p>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">
                Download Full Rulebook (PDF)
            </button>
      </div>

    </div>
  )
}
