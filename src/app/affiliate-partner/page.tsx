'use client'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import Footer from '@/components/layout/Footer'

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
    <div className="min-h-screen bg-[#111]">
      {/* Page Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/10 sticky top-0 z-10">
        <Link href="/" className="text-[#e15b24] hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-white text-[15px] font-bold tracking-wide uppercase">Affiliate Partner</h1>
      </div>

      <div className="max-w-[1600px] mx-auto px-[30px] py-10 pb-16">
        {/* Hero Text */}
        <div className="mb-12">
          <h1 className="text-white text-[28px] md:text-[36px] font-bold text-center mb-3">
            Come win with us, partner!
          </h1>
          <p className="text-gray-400 text-[15px] md:text-[18px] text-center max-w-2xl mx-auto">
            Make your passion your paycheck with a little help from FairPlay!
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#1e1e1e] p-6 flex gap-6 items-start border border-white/5"
              style={{ minHeight: '140px' }}
            >
              {/* Orange Avatar */}
              <div className="w-14 h-14 rounded-full bg-[#e8612c] flex items-center justify-center shrink-0">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-8 h-8 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>

              {/* Text */}
              <div className="flex-1 pt-1">
                <h3 className="text-white text-[18px] font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-[15px] leading-relaxed text-justify">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Commission Table */}
        <div className="overflow-hidden border border-white/5 mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] border-b border-white/5">
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">%</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Deposits</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Min Active User</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">New Users</th>
              </tr>
            </thead>
            <tbody>
              {commissionData.map((row, idx) => (
                <tr
                  key={row.percent}
                  className={`${idx % 2 === 0 ? 'bg-[#333]' : 'bg-[#1a1a1a]'}`}
                >
                  <td className="px-6 py-4 text-white text-[15px] font-medium">{row.percent}</td>
                  <td className="px-6 py-4 text-gray-200 text-[15px]">{row.deposits}</td>
                  <td className="px-6 py-4 text-gray-200 text-[15px]">{row.minActiveUser}</td>
                  <td className="px-6 py-4 text-gray-200 text-[15px]">{row.newUsers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <p className="text-[#e8612c] text-[15px] font-bold mt-4">
          Note* :- Settlement 1st week of next month
        </p>
      </div>
      <Footer />
    </div>
  )
}
