'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const gameProviders = [
  "https://www.fairplay247.vip/_nuxt/img/sportsradar1.f17a5b4.png",
  "https://www.fairplay247.vip/_nuxt/img/super-spades.a5b292c.png",
  "https://www.fairplay247.vip/_nuxt/img/vivo.eb99a90.png",
  "https://www.fairplay247.vip/_nuxt/img/xpg1.cd69809.png",
  "https://www.fairplay247.vip/_nuxt/img/realtime-gaming.451365c.png",
  "https://www.fairplay247.vip/_nuxt/img/microgaming.940cfe6.png",
  "https://www.fairplay247.vip/_nuxt/img/bcoongo.0bb566d.png",
  "https://www.fairplay247.vip/_nuxt/img/bet-games.efa36e9.png",
  "https://www.fairplay247.vip/_nuxt/img/bet-soft.73f0c8c.png",
  "https://www.fairplay247.vip/_nuxt/img/evolution-gaming.80f3313.png",
  "https://www.fairplay247.vip/_nuxt/img/ezugi.4f448c0.svg",
  "https://www.fairplay247.vip/_nuxt/img/pgsoft.296a12c.png",
  "https://www.fairplay247.vip/_nuxt/img/sa-gaming.50c2bed.png"
]

export default function AboutPage() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Page Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/10 sticky top-0 z-10">
        <Link href="/" className="text-[#e15b24] hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-white text-[15px] font-bold tracking-wide uppercase">About Us</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* About Us Section */}
        <section className="mb-12">
          <h2 className="text-white text-[24px] font-bold mb-6 text-center uppercase tracking-tight">About Us</h2>
          <div className="space-y-4 text-gray-300 text-[14px] leading-relaxed text-justify">
            <p>
              Welcome to fairplay- the world’s biggest betting exchange. A one stop shop for all sports betting and leisure gambling needs. The live casino is one of a kind complete with a spectacular range of games such as{' '}
              <Link href="/markets/live-casino/Baccarat" className="text-[#e15b24] hover:underline">Baccarat</Link>,{' '}
              <Link href="/markets/live-cards/live-teenpatti" className="text-[#e15b24] hover:underline">Teen Patti</Link>,{' '}
              <Link href="/markets/live-casino/Roulette" className="text-[#e15b24] hover:underline">Roulette</Link>,{' '}
              <Link href="/markets/live-cards/andar-bahar" className="text-[#e15b24] hover:underline">Andar- Bahar</Link>,{' '}
              <Link href="/markets/live-casino/Poker" className="text-[#e15b24] hover:underline">Poker</Link>,{' '}
              <Link href="/markets/live-casino/Blackjack" className="text-[#e15b24] hover:underline">Blackjack</Link> etc. These games are all conducted by live dealers instead of bots.{' '}
              <Link href="/" className="text-[#e15b24] hover:underline">Sports betting</Link> on fairplay includes the likes of all major events under{' '}
              <Link href="/sportsbook/Cricket" className="text-[#e15b24] hover:underline">Cricket</Link>,{' '}
              <Link href="/sportsbook/Tennis" className="text-[#e15b24] hover:underline">Tennis</Link>,{' '}
              <Link href="/sportsbook/Soccer" className="text-[#e15b24] hover:underline">Football</Link>,{' '}
              <Link href="/markets/sportsbook/Horse-Racing" className="text-[#e15b24] hover:underline">Horse racing</Link> complete with the maximum fancy market options available. Not just that, the users can also enjoy live streaming of the matches alongside live scorecards while placing their bets. That’s not all
            </p>
            <p>
              fairplay endorses authentic gambling and betting and provides the most secure platform in the market for users to have fun in a safe and responsible way. The user’s winnings are transferred to their accounts as soon as they have been authorised. Team fairplay prides itself on being a turning point in the world of gambling and making genuine gambling accessible to all enthusiasts.
            </p>
            <p>
              We have a zero tolerance policy towards any kind of fraudulent activities. Any user who is found violating any terms and conditions will find his account suspended from fairplay Club instantly. fairplay ensures the confidentiality of its users and the security of their information at all times. All safety measures are taken with regard to customer data and their transactions and no data is ever shared with a third party by fairplay.
            </p>
            <p>For all queries and site related questions, our client support team is available 24*7.</p>
            <p>Follow us on social media for exciting contests and app updates!</p>
          </div>
        </section>

        {/* Why Fairplay Section */}
        <section className="mb-20">
          <h2 className="text-white text-[24px] font-bold mb-6 text-center uppercase tracking-tight">WHY FAIRPLAY</h2>
          <div className="space-y-4 text-gray-300 text-[14px] leading-relaxed text-justify">
            <p>
              Sportsbetting is slowly and steadily finding its respectful place in the Indian market. A concept that dates back a couple of decades, legalization has been a gray area up until now. With times changing, fairplay is set to revolutionize sports betting in the Indian market. Backed by legitimate licences, fairplay is a leisure gambler’s paradise.
            </p>
            <p>
              A product that has been designed solely around what a customer would like, fairplay strives to tend to every Club member and give them more than what they could imagine.
            </p>
            <p>Built with state of the art technology, fairplay offers its users only the best!</p>
            <ul className="space-y-3 pl-2">
              <li className="flex gap-2">
                <span className="text-[#e15b24] font-black">—</span>
                <span>The BEST odds in the market are on Fairplay. It’s the only platform to offer odds based on the players’ bets, thus making the process fair and honest and also most profitable for the Club members!</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#e15b24] font-black">—</span>
                <span>Fairplay offers the maximum number of advance market and fancy market options on all major sports leagues across cricket, tennis and football. It also has the fastest bet acceptance in the market- don’t miss those odds!</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#e15b24] font-black">—</span>
                <span>The payment options are varied- from bank transfers to payment gateway options including provision for international payees. Addition of crypto currency is the newest feather in our cap!</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#e15b24] font-black">—</span>
                <span>State of the art technology to protect your information and to provide you with the best user experience in the market. Fairplay is constantly updating itself in one way or another to ensure that every user has a smooth and hassle free experience and truly enjoys being a Fairplay Club member.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#e15b24] font-black">—</span>
                <span>Live streaming of all major cricket, tennis and football leagues.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#e15b24] font-black">—</span>
                <span>Live casino and live card games conducted by live dealers, a one of a kind augmented reality experience that takes you right back to real casinos.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#e15b24] font-black">—</span>
                <span>A resourceful and dedicated Client Services team available 24*7 for any site related queries.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Game Providers Component */}
        <section className="relative">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-white text-[20px] lg:text-[24px] font-black uppercase tracking-widest text-center">
              GAME PROVIDERS
            </h2>
            <div className="w-16 h-1 bg-[#e15b24] mt-2 rounded-full" />
          </div>

          <div className="relative group">
            {/* Left Arrow */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-[-20px] lg:left-[-40px] top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-[#e15b24] z-20 hover:bg-[#e15b24] hover:text-white transition-all shadow-lg active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Scroll Container */}
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto no-scrollbar gap-4 px-2 py-4 scroll-smooth"
            >
              {gameProviders.map((src, idx) => (
                <div 
                  key={idx} 
                  className="flex-shrink-0 w-[160px] lg:w-[220px] h-24 lg:h-32 bg-[#1a1a1a] border border-white/5 rounded-xl flex items-center justify-center p-4 lg:p-6 hover:border-[#e15b24]/50 transition-all duration-300 shadow-xl group/card"
                >
                  <img 
                    src={src} 
                    alt={`Provider ${idx + 1}`} 
                    className="max-w-full max-h-full object-contain filter brightness-90 group-hover/card:brightness-110 transition-all" 
                  />
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button 
              onClick={() => scroll('right')}
              className="absolute right-[-20px] lg:right-[-40px] top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-[#e15b24] z-20 hover:bg-[#e15b24] hover:text-white transition-all shadow-lg active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
