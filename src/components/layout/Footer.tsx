'use client'
import React from 'react'

export default function Footer() {
  return (
    <footer className="px-4 py-8 bg-[#1a1a1a] text-[#aaaaaa] border-t border-white/5 pb-32">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Logo and Intro */}
        <div className="space-y-4">
          <img
            src="https://www.fairplay247.vip/_nuxt/img/fairplay-website-logo.09a29c5.png"
            alt="Fairplay Logo"
            className="h-10 object-contain"
          />
          <p className="text-[13px] leading-relaxed">
            © Established in 2019, fairplay is the most trusted betting exchange and leading online casino.
          </p>
        </div>

        <hr className="border-white/10" />

        {/* Disclaimer */}
        <div className="space-y-2">
          <h4 className="text-[14px] font-bold text-white">Disclaimer :</h4>
          <p className="text-[12px] leading-relaxed">
            Please note that Gambling involves a financial risk and could be addictive over time if not practised within limits. Only 18+ people should use the services and should use it responsibly. Players should be aware of any financial risk and govern themselves accordingly.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-4    lg:border-none">
          <p className="text-[12px]">
            © 2026 fairplay. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
