'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { marketController } from '@/controllers/market/marketController'
import OddsTable from '@/components/sportsbook/OddsTable'
import { useSnackbarStore } from '@/store/snackbarStore'

const mainCategories = [
  { id: 'sportsbook', label: 'Sportsbook', iconClass: 'iconpe-sportsbook', link: '/sportsbook' },
  { id: 'live-casino', label: 'Live Casino', iconClass: 'iconpe-live-casino', link: '/markets/live-casino' },
  { id: 'live-cards', label: 'Live Cards', iconClass: 'iconpe-live-cards', link: '/markets/live-cards' },
]

const sportsSubCategories = [
  { id: 'cricket', label: 'Cricket', icon: 'https://www.fairplay247.vip/markets/sportsbook/undefined/sportsbook-categories/cricket.png' },
  { id: 'football', label: 'Football', icon: 'https://www.fairplay247.vip/markets/sportsbook/undefined/sportsbook-categories/soccer.png' },
  { id: 'tennis', label: 'Tennis', icon: 'https://www.fairplay247.vip/markets/sportsbook/undefined/sportsbook-categories/tennis.png' },
]

export default function MarketsPage() {
  const router = useRouter()
  const { show: showSnackbar } = useSnackbarStore()
  const [activeMain, setActiveMain] = useState('sportsbook')
  const [activeSport, setActiveSport] = useState('cricket')

  // Live Data State
  const [matches, setMatches] = useState<any[]>([])
  const [odds, setOdds] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // 1. Fetch Match List
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true)
        const res = await marketController.getGameList('Cricket,Football,Tennis')
        let matchData: any[] = []
        if (res && typeof res === 'object') {
          matchData = Object.values(res).filter(v => typeof v === 'object' && v !== null && (v.MarketId || v.marketid || v.Gid || v.gid))
        } else if (Array.isArray(res)) {
          matchData = res
        }
        setMatches(matchData)
      } catch (err) {
        console.error('Failed to fetch matches:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMatches()
  }, [])

  // 2. Poll for Live Rates
  useEffect(() => {
    if (matches.length === 0) return

    const marketIds = matches
      .map(m => m.MarketId || m.marketid)
      .filter(id => !!id)
      .join(',')

    if (!marketIds) return

    const fetchRates = async () => {
      try {
        const res = await marketController.getLiveRates(marketIds)
        if (res && typeof res === 'object' && !res.error) {
          setOdds(prev => ({ ...prev, ...res }))
        } else if (Array.isArray(res)) {
          const oddsMap: Record<string, any> = {}
          res.forEach(item => {
            const mId = item.MarketId || item.marketid
            if (mId) oddsMap[mId] = item
          })
          setOdds(prev => ({ ...prev, ...oddsMap }))
        }
      } catch (err) {
        console.error('Failed to fetch live rates:', err)
      }
    }

    let isMounted = true
    let timeoutId: NodeJS.Timeout

    const poll = async () => {
      await fetchRates()
      if (isMounted) timeoutId = setTimeout(poll, 1000)
    }

    poll()
    return () => {
      isMounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [matches])

  const getSportMatches = (sportId: string) => {
    const searchTerms: Record<string, string[]> = {
      cricket: ['cricket'],
      football: ['football', 'soccer'],
      tennis: ['tennis']
    }
    const terms = searchTerms[sportId] || [sportId]

    return matches
      .filter(m => {
        const sType = (m.Type || m.sportname || '').toLowerCase()
        return terms.some(term => sType.includes(term))
      })
      .map(m => {
        const mId = m.MarketId || m.marketid
        const matchOdds = odds[mId]
        const rawRunners = matchOdds?.runner || matchOdds?.runners || {}
        const rowOdds: any[] = [null, null, null]

        const getPrices = (data: any) => (Array.isArray(data) ? data : (data ? Object.values(data) : []))

        const extractOdd = (r: any) => {
          if (!r) return { back: 0, backSize: '', lay: 0, laySize: '' }
          const backPrices = getPrices(r.back || r.availableToBack || r.ex?.availableToBack)
          const layPrices = getPrices(r.lay || r.availableToLay || r.ex?.availableToLay)
          const bestBack = backPrices[0]
          const bestLay = layPrices[0]
          return {
            back: parseFloat(bestBack?.rate || bestBack?.price || r.lastPriceTraded || 0),
            backSize: bestBack?.size || '',
            lay: parseFloat(bestLay?.rate || bestLay?.price || 0),
            laySize: bestLay?.size || '',
          }
        }

        const runnerArr = getPrices(rawRunners)
        if (typeof rawRunners === 'object' && !Array.isArray(rawRunners)) {
          if (rawRunners["0"]) rowOdds[0] = extractOdd(rawRunners["0"])
          if (rawRunners["1"]) rowOdds[1] = extractOdd(rawRunners["1"])
          if (rawRunners["2"]) rowOdds[2] = extractOdd(rawRunners["2"])
        } else {
          runnerArr.forEach((r, idx) => { if (idx < 3) rowOdds[idx] = extractOdd(r) })
        }
        if (rowOdds[0] && rowOdds[1] && !rowOdds[2]) {
          rowOdds[2] = rowOdds[1]; rowOdds[1] = null;
        }

        const finalOdds = rowOdds.map(o => o || { back: 0, lay: 0, backSize: '', laySize: '' })
        const getV = (obj: any, keys: string[]) => {
          for (const k of keys) {
            if (obj[k] !== undefined) return obj[k]
            const foundK = Object.keys(obj).find(ok => ok.toLowerCase() === k.toLowerCase())
            if (foundK) return obj[foundK]
          }
          return undefined
        }

        return {
          id: getV(m, ['gid', 'Gid', 'Event_Id', 'eid']) || mId,
          teamName: getV(m, ['Team1', 'team1']) && getV(m, ['Team2', 'team2']) 
                    ? `${getV(m, ['Team1', 'team1'])} vs ${getV(m, ['Team2', 'team2'])}` 
                    : getV(m, ['Game_name', 'Competition']) || 'Match',
          odds: finalOdds,
          startTime: getV(m, ['DateTime', 'dateTime', 'Datetime', 'staredtime', 'StartTime']),
          status: (matchOdds?.status || matchOdds?.Status || '').toUpperCase(),
          competitionId: getV(m, ['CompetitionCode', 'cid']) || 'league'
        }
      })
  }

  const handleMainClick = (cat: any) => {
    setActiveMain(cat.id)
    if (cat.id !== 'sportsbook') {
      router.push(cat.link)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#000] text-white">
      {/* Header */}
      <div className="flex items-center px-0 h-[42px] bg-[#1a1a1a] shadow-md relative z-20">
        <div className="flex items-center w-full px-1">
          <button onClick={() => router.back()} className="text-[#e8612c] w-[35px] h-[35px] flex items-center justify-center">
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-[14px] font-bold text-white pl-0 capitalize tracking-tight ml-2">Markets</h1>
        </div>
      </div>

      {/* Main Categories Tabs */}
      <div className="flex bg-[#212121] border-b border-white/5 relative z-10 w-full overflow-hidden shrink-0">
        {mainCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleMainClick(cat)}
            className="flex-1 flex flex-col items-center justify-center h-[55px] relative transition-all"
          >
            <div className="mb-0.5">
              <i 
                className={`v-icon notranslate icon-color v-icon--left iconpe ${cat.iconClass} theme--dark ${activeMain === cat.id ? 'primary--text' : 'text-white/60 opacity-60'}`} 
                style={{ fontSize: '18px' }} 
              />
            </div>
            <span className={`text-[11px] font-black uppercase tracking-tighter leading-none ${activeMain === cat.id ? 'text-[#e8612c]' : 'text-[#888]'}`}>
              {cat.label}
            </span>
            {activeMain === cat.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#e8612c] z-10" />
            )}
          </button>
        ))}
      </div>

      {/* Sub Categories Tabs */}
      <div className="flex bg-[#1a1a1a] overflow-x-auto no-scrollbar border-b border-white/5 w-full shrink-0">
        <div className="flex min-w-full">
          {sportsSubCategories.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setActiveSport(sport.id)}
              className="flex-1 min-w-[100px] flex flex-col items-center justify-center h-[55px] relative"
            >
              <div className="mb-0.5">
                <img
                  src={sport.icon}
                  alt={sport.label}
                  className={`w-[22px] h-[22px] object-contain transition-all ${activeSport === sport.id ? 'brightness-100' : 'opacity-60 grayscale'}`}
                />
              </div>
              <span className={`text-[11px] font-black uppercase tracking-tight leading-none ${activeSport === sport.id ? 'text-white' : 'text-[#888]'}`}>
                {sport.label}
              </span>
              {activeSport === sport.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e8612c] z-10" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#111] relative overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 size={32} className="animate-spin text-[#e8612c]" />
            <p className="text-[10px] uppercase font-black tracking-widest text-white/20">Loading Markets...</p>
          </div>
        ) : (
          <div className="p-1">
             <div className="flex items-center gap-2 px-2 py-3 bg-[#111]">
               <div className="w-4 h-4 rounded-full bg-[#e8612c] border-2 border-white/10" />
               <span className="text-[12px] font-black uppercase tracking-wider text-white">{activeSport} Matches</span>
             </div>
             <div className="space-y-0.5 rounded-[12px] overflow-hidden">
               <OddsTable
                 matchId={activeSport}
                 matchName={`${activeSport.toUpperCase()}`}
                 competition="Markets"
                 marketName="Match Odds"
                 columns={['1', 'X', '2']}
                 rows={getSportMatches(activeSport)}
                 sport={activeSport}
               />
             </div>
          </div>
        )}

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/..."
          className="fixed bottom-24 right-4 z-50 transition-transform active:scale-90"
        >
          <img
            src="/whatsapp.png"
            alt="WhatsApp"
            className="w-12 h-12 drop-shadow-2xl"
          />
        </a>
      </div>
    </div>
  )
}
