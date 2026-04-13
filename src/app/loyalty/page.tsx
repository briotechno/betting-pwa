'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function LoyaltyPage() {
  // Auto-slide logic
  React.useEffect(() => {
    const slider = document.getElementById('loyalty-slider');
    if (!slider) return;

    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = slider;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: clientWidth, behavior: 'smooth' });
      }
    }, 4000); // Slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#111] pb-20">
      {/* Page Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/10 sticky top-0 z-10">
        <Link href="/" className="text-[#e15b24] hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-white text-[15px] font-bold tracking-wide uppercase">Club Loyalty</h1>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-10 flex flex-col items-center">
        {/* Main Title */}
        <h2 className="text-white text-[28px] font-bold mb-12 uppercase tracking-wider text-center">
          CLUB LOYALTY
        </h2>

        {/* Loyalty Cards Slider */}
        <div className="w-full max-w-[400px] relative mb-16 overflow-visible">
          <div 
            id="loyalty-slider"
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing pb-8 gap-0"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Silver Card */}
            <div className="flex-shrink-0 w-full snap-center pt-6 px-10">
              <div className="bg-white rounded-[20px] shadow-2xl p-4 relative">
                {/* Tier Pill - Positioned outside & Wider */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-[#e5e7eb] to-[#9ca3af] w-[70%] py-1.5 rounded-full shadow-md z-10 border border-white/20 text-center">
                  <span className="text-[#111] font-bold text-[18px]">Silver</span>
                </div>

                <div className="flex flex-col items-center pt-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[#333] text-[13px] font-bold uppercase tracking-tight">TURNOVER</span>
                    <span className="text-[#111] text-[38px] font-black">₹1K</span>
                  </div>
                  <div className="w-full text-left">
                    <h3 className="text-[#111] text-[14px] font-bold mb-1 uppercase">Benefits</h3>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-3">
                        <span className="text-[#e8612c] mt-1 shrink-0">•</span>
                        <span className="text-[#333] text-[14px] font-bold leading-tight">3 % Bonus on every Deposit</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#e8612c] mt-1 shrink-0">•</span>
                        <span className="text-[#333] text-[14px] font-bold leading-tight">1 % Weekly Lossback bonus for Live Casino and Live Cards</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#e8612c] mt-1 shrink-0">•</span>
                        <div className="flex flex-col">
                          <span className="text-[#333] text-[14px] font-bold leading-tight">1 % Weekly Lossback bonus for Sports Exch and SportsBook</span>
                          <span className="text-[#666] text-[10px] font-medium leading-none mt-0.5">(No turnover conditions, direct bonus in your wallet)</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Gold Card */}
            <div className="flex-shrink-0 w-full snap-center pt-6 px-10">
              <div className="bg-white rounded-[20px] shadow-2xl p-4 relative">
                {/* Tier Pill - Positioned outside & Wider */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-[#fcd34d] to-[#b45309] w-[70%] py-1.5 rounded-full shadow-md z-10 border border-white/20 text-center">
                  <span className="text-[#111] font-bold text-[18px]">Gold</span>
                </div>

                <div className="flex flex-col items-center pt-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[#333] text-[13px] font-bold uppercase tracking-tight">TURNOVER</span>
                    <span className="text-[#111] text-[38px] font-black">₹10L</span>
                  </div>
                  <div className="w-full text-left">
                    <h3 className="text-[#111] text-[14px] font-bold mb-1 uppercase">Benefits</h3>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-3">
                        <span className="text-[#e8612c] mt-1 shrink-0">•</span>
                        <span className="text-[#333] text-[14px] font-bold leading-tight">6 % Bonus on every Deposit</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#e8612c] mt-1 shrink-0">•</span>
                        <span className="text-[#333] text-[14px] font-bold leading-tight">2 % Weekly Lossback bonus for Live Casino and Live Cards</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#e8612c] mt-1 shrink-0">•</span>
                        <div className="flex flex-col">
                          <span className="text-[#333] text-[14px] font-bold leading-tight">2 % Weekly Lossback bonus for Sports Exch and SportsBook</span>
                          <span className="text-[#666] text-[10px] font-medium leading-none mt-0.5">(No turnover conditions, direct bonus in your wallet)</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Platinum Card */}
            <div className="flex-shrink-0 w-full snap-center pt-6 px-10">
              <div className="bg-white rounded-[20px] shadow-2xl p-4 relative">
                {/* Tier Pill - Positioned outside & Wider */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-[#d1d5db] to-[#6b7280] w-[70%] py-1.5 rounded-full shadow-md z-10 border border-white/20 text-center">
                  <span className="text-[#111] font-bold text-[18px]">Platinium</span>
                </div>

                <div className="flex flex-col items-center pt-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[#333] text-[13px] font-bold uppercase tracking-tight">TURNOVER</span>
                    <span className="text-[#111] text-[38px] font-black">₹1Cr</span>
                  </div>
                  <div className="w-full text-left">
                    <h3 className="text-[#111] text-[14px] font-bold mb-1 uppercase">Benefits</h3>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-3">
                        <span className="text-[#e8612c] mt-1 shrink-0">•</span>
                        <span className="text-[#333] text-[14px] font-bold leading-tight">9 % Bonus on every Deposit</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#e8612c] mt-1 shrink-0">•</span>
                        <span className="text-[#333] text-[14px] font-bold leading-tight">3 % Weekly Lossback bonus for Live Casino and Live Cards</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-[#e8612c] mt-1 shrink-0">•</span>
                        <div className="flex flex-col">
                          <span className="text-[#333] text-[14px] font-bold leading-tight">3 % Weekly Lossback bonus for Sports Exch and SportsBook</span>
                          <span className="text-[#666] text-[10px] font-medium leading-none mt-0.5">(No turnover conditions, direct bonus in your wallet)</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div className="w-full flex flex-col items-center">
          <h2 className="text-white text-[28px] font-bold mb-8 uppercase tracking-wider text-center">
            Rules And Regulations
          </h2>

          <div className="w-full max-w-[1200px] border-2 border-[#e6b325] rounded-[15px] p-4 lg:p-6 bg-[#161616]/50">
            <ul className="space-y-2">
              {[
                "There will be no cap on the bonus amount. The same will be awarded as per the loyalty status.",
                "It takes upto 5 hours for the system to upgrade your Loyalty Status once the turnover requirements have been met.",
                "Club members are entitled to the bonus if and when they make two or less withdrawals per week. The third withdrawal will result in nullification of the loyalty bonus.",
                "If the current average turnover is not maintained over a period of 6 months, you will be downgraded to the previous loyalty stage. Eg: If you are a Gold Club member and your average turnover is ₹1CR and over a period of 6 months your average turnover drops below ₹1CR you will be downgraded to the Silver Club membership.",
                "Team fairplay withholds the rights to terminate or alter the offered promotions, turnover logics and all things related without prior notice.",
                "In casino and card games, the bonus will not be awarded if a player places bets worth the same amount on the opposite bet in the same hand.",
                "Turnover criteria will be considered in Premium Sportsbook only on the bets placed above 1.50 odds.",
                "Turnover on session bets will only be considered on the \"NO\" option.",
                "If a user places a bet worth upto 10p in the Premium Sportsbook, it is not counted in the turnover criteria and qualifies for bonus abuse."
              ].map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-white mt-1.5 shrink-0 text-[10px]">•</span>
                  <p className="text-gray-200 text-[15px] font-medium leading-tight text-left">
                    {rule}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
