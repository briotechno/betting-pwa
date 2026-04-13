'use client'
import React from 'react'

export default function Footer() {
  return (
    <footer className="px-5 py-10 bg-[#1e1e1e] text-white border-t border-white/5 pb-32">
      <div className="max-w-[1240px] mx-auto space-y-7">
        {/* Logo and Intro */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <img
              src="https://www.fairplay247.vip/_nuxt/img/fairplay-website-logo.09a29c5.png"
              alt="Fairplay Logo"
              className="h-11 w-fit object-contain"
            />
            <p className="text-[9px] text-white/70 font-bold tracking-[0.15em] uppercase pl-1">GREATER ODDS. GREATER WINNINGS</p>
          </div>
          <p className="text-[13px] leading-[1.6] max-w-[400px] text-white/90">
            © Established in 2019, fairplay is the most trusted betting exchange and leading online casino.
          </p>
        </div>

        <div className="h-[1px] w-full bg-white/5" />

        {/* Disclaimer */}
        <div className="space-y-3">
          <h4 className="text-[14px] font-bold text-white">Disclaimer :</h4>
          <p className="text-[12px] leading-[1.8] text-white/80 font-normal">
            Please note that Gambling involves a financial risk and could be addictive over time if not practised within limits. Only 18+ people should use the services and should use it responsibly. Players should be aware of any financial risk and govern themselves accordingly.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-2">
          <p className="text-[12px] text-white/60 font-normal">
            © 2026 fairplay. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
