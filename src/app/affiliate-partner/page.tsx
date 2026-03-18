'use client'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const features = [
  {
    title: 'Hefty Commissions',
    icon: 'https://www.fairplay247.vip/_nuxt/img/Hefty-Commissions-94x94.6e89ea9.png',
    desc: 'We offer a commission rate upto 40% subject to differ based on number of clients and the estimated turnover.',
  },
  {
    title: 'Multi Tier System',
    icon: 'https://www.fairplay247.vip/_nuxt/img/Multi-Tier-System.d840f48.png',
    desc: "Know someone that knows everyone? Bring in an affiliate and earn commission on the players that come with them!",
  },
  {
    title: 'Offerings',
    icon: 'https://www.fairplay247.vip/_nuxt/img/Offerings.50a5a78.png',
    desc: "FairPlay is the world's biggest sports betting exchange with a range of live casino and live Indian card games and the best odds for sports betting!",
  },
  {
    title: 'Easy, Accessible, Efficient',
    icon: 'https://www.fairplay247.vip/_nuxt/img/Easy-Accessible-Efficient.9d4232c.png',
    desc: 'FairPlay brings advanced online gambling to your fingertips in the most easy and user friendly way there is!',
  },
  {
    title: 'Stay Up To Date',
    icon: 'https://www.fairplay247.vip/_nuxt/img/stay-up-to-date-94x94.a1d0f79.png',
    desc: "We believe with money matters, transparency is key! Access detailed data of the players' activities and your downline's performance in our affiliate backend.",
  },
  {
    title: '24*7 Customer Support',
    icon: 'https://www.fairplay247.vip/_nuxt/img/247-Customer-Support.b2beff3.png',
    desc: "For everything else, there's the dedicated Client Services team available round the clock!",
  },
]

const commissionData = [
  { percent: 15, deposits: '200k to 2000k', minActiveUser: 5, newUsers: 3 },
  { percent: 20, deposits: '2000k to 5000k', minActiveUser: 20, newUsers: 10 },
  { percent: 30, deposits: '5000k and above', minActiveUser: 50, newUsers: 25 },
]

export default function AffiliatePartnerPage() {
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Page Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/10 sticky top-0 z-10">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-white text-[15px] font-bold tracking-wide">Affiliate Partner</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 pb-16">
        {/* Hero Text */}
        <h1 className="text-white text-[26px] md:text-[32px] font-bold text-center mb-3">
          Come win with us, partner!
        </h1>
        <p className="text-gray-300 text-[15px] md:text-[17px] text-center mb-8">
          Make your passion your paycheck with a little help from FairPlay!
        </p>

        {/* Divider */}
        <div className="border-t border-white/10 mb-10" />

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#1e1e1e]  rounded-lg p-5 flex gap-4 items-start"
              style={{ minHeight: '145px' }}
            >
              {/* Orange Avatar */}
              <div className="w-12 h-12 rounded-full bg-[#e8612c] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(232,97,44,0.4)]">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-7 h-7 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-white text-[16px] font-bold capitalize mb-2 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-[13px] leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Commission Table */}
        <div className="bg-[#1e1e1e] rounded-lg overflow-hidden ">
          <table className="w-full">
            <thead>
              <tr className="bg-[#252525] border-b border-white/10">
                <th className="px-5 py-3.5 text-left text-[12px] font-black text-gray-300 uppercase tracking-wider">%</th>
                <th className="px-5 py-3.5 text-left text-[12px] font-black text-gray-300 uppercase tracking-wider">Deposits</th>
                <th className="px-5 py-3.5 text-left text-[12px] font-black text-gray-300 uppercase tracking-wider">Min Active User</th>
                <th className="px-5 py-3.5 text-left text-[12px] font-black text-gray-300 uppercase tracking-wider">New Users</th>
              </tr>
            </thead>
            <tbody>
              {commissionData.map((row, idx) => (
                <tr
                  key={row.percent}
                  className={`border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.03] ${idx % 2 === 1 ? 'bg-[#252525]/40' : ''
                    }`}
                >
                  <td className="px-5 py-4 text-white text-[14px] font-semibold">{row.percent}</td>
                  <td className="px-5 py-4 text-gray-300 text-[14px]">{row.deposits}</td>
                  <td className="px-5 py-4 text-gray-300 text-[14px]">{row.minActiveUser}</td>
                  <td className="px-5 py-4 text-gray-300 text-[14px]">{row.newUsers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <p className="text-[#e8612c] text-[13px] font-semibold mt-4">
          Note* :- Settlement 1st week of next month
        </p>
      </div>
    </div>
  )
}
