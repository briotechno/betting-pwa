'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, History, X, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useSnackbarStore } from '@/store/snackbarStore'
import { casinoController } from '@/controllers/casino/casinoController'
import { marketController } from '@/controllers/market/marketController'
import GameOverlay from '@/components/casino/GameOverlay'
import Badge from '@/components/ui/Badge'
import MatchCard from '@/components/sportsbook/MatchCard'
import OddsTable from '@/components/sportsbook/OddsTable'
import { useI18nStore } from '@/store/i18nStore'
import { formatDate } from '@/utils/format'

// Banners
const banners = [
  { id: 1, image: '/banner1.png', link: '/promotions' },
  { id: 2, image: '/banner2.png', link: '/profile/refer' },
  { id: 3, image: '/banner3.png', link: '/sports/cricket' },
]

const quickSports = [
  { id: 'cricket', label: 'Cricket', emoji: '🏏' },
  { id: 'soccer', label: 'Soccer', emoji: '⚽' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾' },
]

import PopupModal from '@/components/common/PopupModal'

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const { t } = useI18nStore()
  const { user } = useAuthStore()
  const { show: showSnackbar } = useSnackbarStore()
  const [showPremium, setShowPremium] = useState(false)
  const [premiumUrl, setPremiumUrl] = useState<string | null>(null)
  const bannerTimer = useRef<NodeJS.Timeout | null>(null)

  // Live Data State
  const [matches, setMatches] = useState<any[]>([])
  const [odds, setOdds] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  const handlePremiumClick = async () => {
    if (!user) {
      showSnackbar('Please login to access the premium sportsbook', 'error')
      return
    }
    setShowPremium(true)
    setPremiumUrl(null)
    try {
      const res = await casinoController.openSportsbook(user.loginToken || '')
      if (res.error === '0' && res.url) {
        setPremiumUrl(res.url)
      } else {
        showSnackbar(res.msg || 'Failed to fetch sportsbook URL', 'error')
        setShowPremium(false)
      }
    } catch (err) {
      showSnackbar('Network error', 'error')
      setShowPremium(false)
    }
  }

  // Banner Auto-slide
  useEffect(() => {
    bannerTimer.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => { if (bannerTimer.current) clearInterval(bannerTimer.current) }
  }, [])

  // 1. Fetch Match List
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true)
        const res = await marketController.getGameList('Cricket,Soccer,Tennis')

        let matchData: any[] = []
        if (res && typeof res === 'object') {
          // Flatten dictionary/list response
          // API might return an object with numeric keys "0", "1", "2"...
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
          // rates response usually has { marketid: { runner: [ { back: [...], lay: [...] } ] } }
          setOdds(prev => ({ ...prev, ...res }))
        } else if (Array.isArray(res)) {
          // Handle array if that's what comes back
          const oddsMap: Record<string, any> = {}
          res.forEach(item => {
            if (item.MarketId || item.marketid) {
              oddsMap[item.MarketId || item.marketid] = item
            }
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
      if (isMounted) {
        timeoutId = setTimeout(poll, 200)
      }
    }

    poll()
    return () => {
      isMounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [matches])

  // Helper to map match + rates to OddsTable rows
  const getSportMatches = (sportId: string) => {
    const searchTerms: Record<string, string[]> = {
      cricket: ['cricket'],
      soccer: ['soccer', 'football'],
      tennis: ['tennis']
    }

    const terms = searchTerms[sportId] || [sportId]
    const now = new Date()

    return matches
      .filter(m => {
        // 1. Sport check
        const sType = (m.Type || m.sportname || '').toLowerCase()
        const isCorrectSport = terms.some(term => sType.includes(term))
        if (!isCorrectSport) return false

        // 2. Time check (Inplay Filter)
        const timeKeys = ['DateTime', 'dateTime', 'Datetime', 'staredtime', 'StartTime']
        let startTimeStr = ''
        for (const k of timeKeys) {
          if (m[k]) { startTimeStr = m[k]; break; }
        }

        let startTime: Date | null = null
        if (startTimeStr) {
          // Robust parsing for common formats (ISO and DD-MM-YYYY)
          const dateVal = startTimeStr.includes('T') ? startTimeStr : startTimeStr.replace(' ', 'T')
          startTime = new Date(dateVal)

          // Manual parse for DD-MM-YYYY formats if standard parsing fails
          if (isNaN(startTime.getTime())) {
            const parts = startTimeStr.split(/[-/ :]/)
            if (parts.length >= 3) {
              const day = parseInt(parts[0], 10)
              const month = parseInt(parts[1], 10) - 1 // 0-based
              const year = parseInt(parts[2], 10)
              if (day <= 31 && month <= 11) {
                const hour = parseInt(parts[3] || '0', 10)
                const minute = parseInt(parts[4] || '0', 10)
                const second = parseInt(parts[5] || '0', 10)
                startTime = new Date(year, month, day, hour, minute, second)
              }
            }
          }
        }

        if (startTime && !isNaN(startTime.getTime())) {
          // Check if match hasn't started yet
          if (startTime > now) return false

          // Check if match is "Expired" (started more than 24 hours ago)
          // Most matches (Tennis, Soccer, T20 Cricket) finish within 24h.
          // This removes stale matches like "24-03-2026" from a 27-03-2026 view.
          if (now.getTime() - startTime.getTime() > 24 * 60 * 60 * 1000) {
            return false
          }

          // Specific filter to remove stagnant/irrelevant entries as requested
          if (startTimeStr.includes('28-03-2026 08:30:00')) {
            return false
          }
        }

        // 3. Status & Activity check (Hide if no odds, empty values, or expired)
        const mId = m.MarketId || m.marketid
        const matchOdds = odds[mId]

        // Use live rate information if available
        if (matchOdds) {
          const status = (matchOdds.status || matchOdds.Status || '').toUpperCase()
          if (status === 'CLOSED') return false

          // Match rate activity check
          const rawRunners = matchOdds?.runner || matchOdds?.runners || {}
          const runnersArr = Array.isArray(rawRunners) ? rawRunners : Object.values(rawRunners)

          const hasActiveOdds = runnersArr.some((r: any) => {
            const backPrices = r.back || r.availableToBack || r.ex?.availableToBack
            const backArr = Array.isArray(backPrices) ? backPrices : (backPrices ? Object.values(backPrices) : [])
            const hasRate = backArr.some((b: any) => parseFloat(b?.price || b?.rate || 0) > 0)
            const hasLastPrice = parseFloat(r.lastPriceTraded || 0) > 0
            return hasRate || hasLastPrice
          })

          if (!hasActiveOdds) return false
        } else if (!isLoading) {
          // Hide if no odds entries ever appeared and we've finished the first load cycle
          return false
        }

        return true
      })
      .map(m => {
        const mId = m.MarketId || m.marketid
        const matchOdds = odds[mId]

        const rawRunners = matchOdds?.runner || matchOdds?.runners || {}
        const rowOdds: any[] = [null, null, null] // Slots for 1, X, 2

        const getPrices = (data: any) => {
          if (!data) return [];
          return Array.isArray(data) ? data : Object.values(data);
        };

        const extractOdd = (r: any) => {
          if (!r) return { back: 0, backSize: '', lay: 0, laySize: '' };
          const backPrices = getPrices(r.back || r.availableToBack || r.ex?.availableToBack);
          const layPrices = getPrices(r.lay || r.availableToLay || r.ex?.availableToLay);
          const bestBack = backPrices[0];
          const bestLay = layPrices[0];
          return {
            back: parseFloat(bestBack?.rate || bestBack?.price || r.lastPriceTraded || 0),
            backSize: bestBack?.size || '',
            lay: parseFloat(bestLay?.rate || bestLay?.price || 0),
            laySize: bestLay?.size || '',
          }
        };

        if (typeof rawRunners === 'object' && !Array.isArray(rawRunners)) {
          // It's an object like {"0": {...}, "1": {...}}
          // Match the keys directly if possible
          if (rawRunners["0"]) rowOdds[0] = extractOdd(rawRunners["0"])
          if (rawRunners["1"]) rowOdds[1] = extractOdd(rawRunners["1"])
          if (rawRunners["2"]) rowOdds[2] = extractOdd(rawRunners["2"])

          // If we have "0" and "1" but no "2", it's likely Cricket Team 1 (0) and Team 2 (1)
          // We should shift Team 2 to index 2 to show under "2" column, leaving X empty
          if (rowOdds[0] && rowOdds[1] && !rowOdds[2]) {
            rowOdds[2] = rowOdds[1]
            rowOdds[1] = null
          }
        } else if (Array.isArray(rawRunners)) {
          rawRunners.forEach((r, idx) => {
            if (idx < 3) rowOdds[idx] = extractOdd(r)
          })
          if (rawRunners.length === 2) {
            rowOdds[2] = rowOdds[1]
            rowOdds[1] = null
          }
        }

        // Fill remaining with empty
        const finalOdds = rowOdds.map(o => o || { back: 0, lay: 0, backSize: '', laySize: '' })

        // 🏆 NEW: Case-insensitive robust mapping
        const getV = (obj: any, keys: string[]) => {
          for (const k of keys) {
            // Check direct match
            if (obj[k] !== undefined) return obj[k]
            // Check lowercase/uppercase versions
            const foundK = Object.keys(obj).find(ok => ok.toLowerCase() === k.toLowerCase())
            if (foundK) return obj[foundK]
          }
          return undefined
        }

        const team1 = getV(m, ['Team1', 'team1'])
        const team2 = getV(m, ['Team2', 'team2'])
        const gName = getV(m, ['Game_name', 'GameName', 'ename', 'name', 'Competition'])
        const dateTime = getV(m, ['DateTime', 'dateTime', 'Datetime', 'staredtime', 'StartTime'])

        let name = 'Match'
        if (team1 && team2) {
          if (team2 === 'TOURNAMENT_WINNER') {
            name = team1
          } else {
            name = `${team1} vs ${team2}`
          }
        } else if (gName) {
          name = gName
        }

        const status = (matchOdds?.status || matchOdds?.Status || '').toUpperCase()

        return {
          id: mId || getV(m, ['gid', 'Gid', 'Event_Id', 'marketid', 'MarketId']),
          teamName: name,
          odds: finalOdds,
          startTime: undefined, // Hide start time for inplay table (shows Live icon instead)
          status: status
        }
      })
  }

  // Helper to get upcoming (future) matches per sport
  const getUpcomingMatches = (sportId: string) => {
    const searchTerms: Record<string, string[]> = {
      cricket: ['cricket'],
      soccer: ['soccer', 'football'],
      tennis: ['tennis']
    }

    const terms = searchTerms[sportId] || [sportId]
    const now = new Date()

    // Parse date helper (shared logic)
    const parseDate = (str: string): Date | null => {
      if (!str) return null
      const dateVal = str.includes('T') ? str : str.replace(' ', 'T')
      let d = new Date(dateVal)
      if (isNaN(d.getTime())) {
        const parts = str.split(/[-/ :]/)
        if (parts.length >= 3) {
          const day = parseInt(parts[0], 10)
          const month = parseInt(parts[1], 10) - 1
          const year = parseInt(parts[2], 10)
          if (day <= 31 && month <= 11) {
            const hour = parseInt(parts[3] || '0', 10)
            const minute = parseInt(parts[4] || '0', 10)
            const second = parseInt(parts[5] || '0', 10)
            d = new Date(year, month, day, hour, minute, second)
          }
        }
      }
      return d && !isNaN(d.getTime()) ? d : null
    }

    return matches
      .filter(m => {
        const sType = (m.Type || m.sportname || '').toLowerCase()
        const isCorrectSport = terms.some(term => sType.includes(term))
        if (!isCorrectSport) return false

        const timeKeys = ['DateTime', 'dateTime', 'Datetime', 'staredtime', 'StartTime']
        let startTimeStr = ''
        for (const k of timeKeys) {
          if (m[k]) { startTimeStr = m[k]; break; }
        }

        const startTime = parseDate(startTimeStr)
        // Only include matches that haven't started yet
        if (!startTime || startTime <= now) return false

        return true
      })
      .sort((a, b) => {
        // Sort by start time ascending
        const timeKeys = ['DateTime', 'dateTime', 'Datetime', 'staredtime', 'StartTime']
        const getTime = (m: any) => {
          let str = ''
          for (const k of timeKeys) { if (m[k]) { str = m[k]; break; } }
          const d = parseDate(str)
          return d ? d.getTime() : Infinity
        }
        return getTime(a) - getTime(b)
      })
      .map(m => {
        const mId = m.MarketId || m.marketid
        const matchOdds = odds[mId]

        const rawRunners = matchOdds?.runner || matchOdds?.runners || {}
        const rowOdds: any[] = [null, null, null]

        const getPrices = (data: any) => {
          if (!data) return []
          return Array.isArray(data) ? data : Object.values(data)
        }

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

        if (typeof rawRunners === 'object' && !Array.isArray(rawRunners)) {
          if (rawRunners["0"]) rowOdds[0] = extractOdd(rawRunners["0"])
          if (rawRunners["1"]) rowOdds[1] = extractOdd(rawRunners["1"])
          if (rawRunners["2"]) rowOdds[2] = extractOdd(rawRunners["2"])
          if (rowOdds[0] && rowOdds[1] && !rowOdds[2]) {
            rowOdds[2] = rowOdds[1]
            rowOdds[1] = null
          }
        } else if (Array.isArray(rawRunners)) {
          rawRunners.forEach((r, idx) => {
            if (idx < 3) rowOdds[idx] = extractOdd(r)
          })
          if (rawRunners.length === 2) {
            rowOdds[2] = rowOdds[1]
            rowOdds[1] = null
          }
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

        const team1 = getV(m, ['Team1', 'team1'])
        const team2 = getV(m, ['Team2', 'team2'])
        const gName = getV(m, ['Game_name', 'GameName', 'ename', 'name', 'Competition'])
        const dateTime = getV(m, ['DateTime', 'dateTime', 'Datetime', 'staredtime', 'StartTime'])

        let name = 'Match'
        if (team1 && team2) {
          if (team2 === 'TOURNAMENT_WINNER') {
            name = team1
          } else {
            name = `${team1} vs ${team2}`
          }
        } else if (gName) {
          name = gName
        }

        return {
          id: mId || getV(m, ['gid', 'Gid', 'Event_Id', 'marketid', 'MarketId']),
          teamName: name,
          odds: finalOdds,
          startTime: dateTime,
          status: ''
        }
      })
  }

  return (
    <div className="max-w-full">
      <PopupModal />

      {/* Banner Carousel */}
      <div className="relative overflow-hidden bg-[#0a0a0a]">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link}
              className="min-w-full relative block h-[100px] md:h-auto md:aspect-[3/1] lg:aspect-[3.5/1] overflow-hidden"
            >
              <img src={banner.image} alt="Promotion" className="w-full h-full object-cover object-center" />
            </Link>
          ))}
        </div>
      </div>

      <div className="p-2 md:p-4 space-y-4">
        {/* INPLAY Section Header */}
        {/* <div className="flex items-center gap-2 px-1 mb-2">
          <div className="w-6 h-6 rounded-full bg-[#e8612c] flex items-center justify-center shadow-[0_0_8px_rgba(232,97,44,0.4)]">
            <i className="v-icon notranslate mdi mdi-access-point theme--light text-white text-[12px]"></i>
          </div>
          <h2 className="text-[15px] font-black text-white uppercase tracking-tight">INPLAY</h2>
        </div> */}

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-white/20 gap-3">
            <Loader2 size={40} className="animate-spin text-[#e8612c]" />
            <p className="text-[10px] font-black uppercase tracking-widest">Syncing with Exchange...</p>
          </div>
        ) : (
          quickSports.map((sport) => {
            const sportId = sport.id
            const sportMatches = getSportMatches(sportId)
            if (sportMatches.length === 0) return null

            return (
              <div key={sportId} className="space-y-0 overflow-hidden shadow-2xl lg:shadow-none bg-transparent rounded-b-[16px]">
                {/* Sport Label Header */}
                <div className="flex items-center h-10 lg:h-12 overflow-hidden rounded-t-[4px]">
                  <div className="bg-[#e8612c] flex items-center px-3 gap-2 flex-1 h-full">
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      {sportId === 'cricket' ? (
                        <i className="v-icon notranslate icon-color v-icon--left iconpe iconpe-cricket theme--light text-white" style={{ fontSize: '16px' }}></i>
                      ) : sportId === 'soccer' ? (
                        <i className="v-icon notranslate icon-color v-icon--left mdi mdi-soccer theme--light text-white" style={{ fontSize: '16px' }}></i>
                      ) : (
                        <i className="v-icon notranslate icon-color v-icon--left iconpe iconpe-tennis theme--light text-white" style={{ fontSize: '16px' }}></i>
                      )}
                    </div>
                    <span className="text-[13px] font-black text-white uppercase tracking-wider">{sportId}</span>
                  </div>

                  <div className="flex items-center h-full lg:w-[388px]" style={{ backgroundImage: 'linear-gradient(to right, #000 50%, #444)' }}>
                    <div className="flex items-center justify-end pr-2 w-full">
                      <div className="hidden lg:flex gap-1">
                        <div className="w-[124px] flex justify-center items-center"><span className="text-[10px] font-black text-white">1</span></div>
                        <div className="w-[124px] flex justify-center items-center"><span className="text-[10px] font-black text-white">X</span></div>
                        <div className="w-[124px] flex justify-center items-center"><span className="text-[10px] font-black text-white">2</span></div>
                      </div>
                      <div className="flex lg:hidden gap-1">
                        <div className="w-[59px] flex justify-center"><span className="text-[11px] font-black text-white">1</span></div>
                        <div className="w-[59px] flex justify-center border-l border-white/10"><span className="text-[11px] font-black text-white">X</span></div>
                        <div className="w-[59px] flex justify-center border-l border-white/10"><span className="text-[11px] font-black text-white">2</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <OddsTable
                  matchId={sportId}
                  matchName={`${sportId.toUpperCase()} LIVE`}
                  competition="Main Markets"
                  marketName="Match Odds"
                  columns={['1', 'X', '2']}
                  rows={sportMatches}
                  sport={sportId}
                />
              </div>
            )
          })
        )}

        {/* Live Games Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Live Cards */}
          <div className="bg-[#111] p-2 rounded-[16px] border border-[#474747] shadow-inner">
            <div className="flex items-center justify-center relative px-2 mb-4 lg:mb-6">
              <h3 className="text-[1rem] font-normal text-white leading-none">Live <span className="text-[#e8612c]">Cards</span></h3>
              <Link href="/live-cards" className="text-[10px] text-[#e8612c] font-black tracking-wider absolute right-2">More ...</Link>
            </div>
            <div className="grid grid-cols-3 gap-3 px-1">
              {[
                { name: 'Teenpatti', iconPath: 'teenpatti.ec813d1.png' },
                { name: 'Hi Low', iconPath: 'hi-lo.3d33723.png' },
                { name: 'Andar Bahar', iconPath: 'andar-bahar.86115b2.png' },
                { name: '2 Card Teenpatti', iconPath: '2-card-teenpatti.cc8e4f2.png' },
                { name: 'Amar Akbar Anthony', iconPath: 'amar-akbar.366de2b.png' },
                { name: '32 Card Casino', iconPath: '32-card-casino.1f23beb.png' },
              ].map((game, idx) => {
                const isPurple = idx % 2 === 0
                return (
                  <Link
                    key={game.name}
                    href={`/live-cards/${game.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="relative flex items-center h-[35px] md:h-[50px] min-w-[64px] rounded-full border-2 border-transparent transition-transform active:scale-95 group overflow-hidden"
                    style={isPurple
                      ? { background: 'linear-gradient(#130c2d, #130c2d) padding-box, linear-gradient(to left, #1904e5, #fab2ff) border-box', boxShadow: '#8154f1 0px -1px 5px 2px' }
                      : { background: 'linear-gradient(#130c2d, #130c2d) padding-box, linear-gradient(to left, #f37415, #ff0000) border-box', boxShadow: '#f37415 0px -1px 5px 2px' }
                    }
                  >
                    <div className="absolute inset-0 flex items-center justify-center px-8 md:px-12">
                      <span className="text-[8px] md:text-[11px] font-bold text-white uppercase tracking-tighter truncate">{game.name}</span>
                    </div>
                    <div className="absolute right-2 md:right-4 w-[16px] md:w-[26px] h-full flex items-center justify-center shrink-0">
                      <img src={`/casino-icons/${game.iconPath}`} alt={game.name} className="w-full h-auto object-contain transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Live Casino */}
          <div className="bg-[#111] p-2 rounded-[16px] border border-[#474747] shadow-inner">
            <div className="flex items-center justify-center relative px-2 mb-4 lg:mb-6">
              <h3 className="text-[1rem] font-normal text-white leading-none">Live <span className="text-[#e8612c]">Casino</span></h3>
              <Link href="/markets/live-casino" className="text-[10px] text-[#e8612c] font-black tracking-wider absolute right-2">More ...</Link>
            </div>
            <div className="grid grid-cols-3 gap-3 px-1">
              {[
                { name: 'Roulette', iconPath: 'roulette.d32562e.png' },
                { name: 'Lightning Dice', iconPath: 'lightning-dice.d78d3a8.png' },
                { name: 'Crazy Time', iconPath: 'crazy-time.48d7437.png' },
                { name: 'Deal No Deal', iconPath: 'deal-no-deal.b41caae.png' },
                { name: 'Money Wheel', iconPath: 'money-wheel.6da4f96.png' },
                { name: 'Dragon Tiger', iconPath: 'dragon-tiger.23aaed5.png' },
              ].map((game, idx) => {
                const isPurple = idx % 2 === 0
                return (
                  <Link
                    key={game.name}
                    href={`/markets/live-casino/${game.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="relative flex items-center h-[35px] md:h-[50px] min-w-[64px] rounded-full border-2 border-transparent transition-transform active:scale-95 group overflow-hidden"
                    style={isPurple
                      ? { background: 'linear-gradient(#130c2d, #130c2d) padding-box, linear-gradient(to left, #1904e5, #fab2ff) border-box', boxShadow: '#8154f1 0px -1px 5px 2px' }
                      : { background: 'linear-gradient(#130c2d, #130c2d) padding-box, linear-gradient(to left, #f37415, #ff0000) border-box', boxShadow: '#f37415 0px -1px 5px 2px' }
                    }
                  >
                    <div className="absolute inset-0 flex items-center justify-center px-8 md:px-12">
                      <span className="text-[8px] md:text-[11px] font-bold text-white uppercase tracking-tighter truncate">{game.name}</span>
                    </div>
                    <div className="absolute right-2 md:right-4 w-[16px] md:w-[26px] h-full flex items-center justify-center shrink-0">
                      <img src={`/casino-icons/${game.iconPath}`} alt={game.name} className="w-full h-auto object-contain transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Premium Banner */}
        <div className="w-full overflow-hidden shadow-lg border border-white/5 bg-[#111]">
          <div onClick={handlePremiumClick} className="block relative cursor-pointer group">
            <img src="/premium.9849a83.gif" alt="Premium Sport" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </div>
        </div>

        {/* UPCOMING Section */}
        {!isLoading && (
          <>
            <div className="flex items-center gap-2 px-1 mb-2 mt-4">
              <div className="w-6 h-6 rounded-full bg-[#e8612c] flex items-center justify-center shadow-[0_0_8px_rgba(232,97,44,0.4)]">
                <i className="v-icon notranslate mdi mdi-clock-outline theme--light text-white text-[12px]"></i>
              </div>
              <h2 className="text-[15px] font-black text-white uppercase tracking-tight">UPCOMING</h2>
            </div>

            {quickSports.map((sport) => {
              const sportId = sport.id
              const upcomingMatches = getUpcomingMatches(sportId)
              if (upcomingMatches.length === 0) return null

              return (
                <div key={`upcoming-${sportId}`} className="space-y-0 overflow-hidden shadow-2xl lg:shadow-none bg-transparent rounded-b-[16px]">
                  {/* Sport Label Header */}
                  <div className="flex items-center h-10 lg:h-12 overflow-hidden rounded-t-[4px]">
                    <div className="bg-[#e8612c] flex items-center px-3 gap-2 flex-1 h-full">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        {sportId === 'cricket' ? (
                          <i className="v-icon notranslate icon-color v-icon--left iconpe iconpe-cricket theme--light text-white" style={{ fontSize: '16px' }}></i>
                        ) : sportId === 'soccer' ? (
                          <i className="v-icon notranslate icon-color v-icon--left mdi mdi-soccer theme--light text-white" style={{ fontSize: '16px' }}></i>
                        ) : (
                          <i className="v-icon notranslate icon-color v-icon--left iconpe iconpe-tennis theme--light text-white" style={{ fontSize: '16px' }}></i>
                        )}
                      </div>
                      <span className="text-[13px] font-black text-white uppercase tracking-wider">{sportId}</span>
                    </div>

                    <div className="flex items-center h-full lg:w-[388px]" style={{ backgroundImage: 'linear-gradient(to right, #000 50%, #444)' }}>
                      <div className="flex items-center justify-end pr-2 w-full">
                        <div className="hidden lg:flex gap-1">
                          <div className="w-[124px] flex justify-center items-center"><span className="text-[10px] font-black text-white">1</span></div>
                          <div className="w-[124px] flex justify-center items-center"><span className="text-[10px] font-black text-white">X</span></div>
                          <div className="w-[124px] flex justify-center items-center"><span className="text-[10px] font-black text-white">2</span></div>
                        </div>
                        <div className="flex lg:hidden gap-1">
                          <div className="w-[59px] flex justify-center"><span className="text-[11px] font-black text-white">1</span></div>
                          <div className="w-[59px] flex justify-center border-l border-white/10"><span className="text-[11px] font-black text-white">X</span></div>
                          <div className="w-[59px] flex justify-center border-l border-white/10"><span className="text-[11px] font-black text-white">2</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <OddsTable
                    matchId={sportId}
                    matchName={`${sportId.toUpperCase()} UPCOMING`}
                    competition="Main Markets"
                    marketName="Match Odds"
                    columns={['1', 'X', '2']}
                    rows={upcomingMatches}
                    isUpcoming={true}
                    sport={sportId}
                  />
                </div>
              )
            })}
          </>
        )}

        {/* App Download Banner */}
        <div className="flex flex-col items-center text-center overflow-hidden relative">
          <img src="https://www.fairplay247.vip/_nuxt/img/download-apk-pc.87223d1.png" alt="Download App PC" className="hidden lg:block w-full h-[276px] object-cover" />
          <img src="./download-app-banner.png" alt="Download App Mobile" className="lg:hidden w-full h-auto object-contain" />
        </div>
      </div>

      <GameOverlay isOpen={showPremium} url={premiumUrl} title="Premium Sportsbook" isFloating={true} onClose={() => setShowPremium(false)} />
    </div>
  )
}
