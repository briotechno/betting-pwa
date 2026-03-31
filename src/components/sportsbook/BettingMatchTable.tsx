'use client';

import React, { useState, useEffect } from 'react';
import { marketController } from '@/controllers/market/marketController';
import { Loader2 } from 'lucide-react';

/**
 * Interface for API match data from getGameList
 */
interface GameMatch {
  Event_Id: string;
  MarketId: string;
  Game_name: string;
  Team1: string;
  Team2: string;
  DateTime: string;
  Competition: string;
  Type: string;
}

/**
 * Interface for LiveRate response
 */
interface LiveRate {
  status: 'OPEN' | 'CLOSED' | 'SUSPENDED';
  runners: {
    [key: string]: {
      lastPriceTraded: number;
      ex: {
        availableToBack: { price: number; size: number }[];
        availableToLay: { price: number; size: number }[];
      };
    };
  };
}

const BettingMatchTable = () => {
  const [matches, setMatches] = useState<GameMatch[]>([]);
  const [liveRates, setLiveRates] = useState<Record<string, LiveRate>>({});
  const [loading, setLoading] = useState(true);

  // 1. Fetch GameList on mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await marketController.getGameList('Cricket');
        
        let matchData: GameMatch[] = [];
        if (typeof res === 'object' && !Array.isArray(res)) {
          matchData = Object.values(res).filter((v: any) => typeof v === 'object' && v !== null && (v.MarketId || v.marketid));
        } else if (Array.isArray(res)) {
          matchData = res;
        }
        
        setMatches(matchData);
      } catch (err) {
        console.error('Error fetching game list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // 2. Poll for LiveRates every 3 seconds for active MarketIds
  useEffect(() => {
    if (matches.length === 0) return;

    const marketIds = matches.map(m => m.MarketId).filter(Boolean).join(',');
    if (!marketIds) return;

    const pollRates = async () => {
      try {
        const res = await marketController.getLiveRates(marketIds);
        if (res && typeof res === 'object' && !res.error) {
          setLiveRates(prev => ({ ...prev, ...res }));
        }
      } catch (err) {
        console.error('Error polling live rates:', err);
      }
    };

    pollRates(); // Initial call
    const interval = setInterval(pollRates, 3000);
    return () => clearInterval(interval);
  }, [matches]);

  /**
   * Helper to get rate for a specific runner index
   */
  const getRate = (marketId: string, runnerId: string) => {
    const rateData = liveRates[marketId];
    if (!rateData || rateData.status !== 'OPEN') return '-';

    const runner = (rateData.runners as any)?.[runnerId];
    if (!runner) return '-';

    // Priority 1: availableToBack price
    const backPrice = runner.ex?.availableToBack?.[0]?.price;
    if (backPrice && backPrice > 0) return backPrice;

    // Priority 2: lastPriceTraded
    if (runner.lastPriceTraded && runner.lastPriceTraded > 0) return runner.lastPriceTraded;

    return '-';
  };

  /**
   * Render function for the rate box (Bright Green)
   */
  const renderGreenRateBox = (rate: string | number) => {
    if (rate === '-') return <span className="text-gray-400">-</span>;

    return (
      <div className="bg-[#58D68D] text-white font-bold py-1.5 rounded-[4px] text-center w-16 mx-auto text-[13px] border border-[#45B39D] shadow-sm">
        {rate}
      </div>
    );
  };

  if (loading && matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3">
        <Loader2 className="animate-spin text-[#e8612c]" size={32} />
        <span className="text-xs font-bold uppercase tracking-widest text-[#e8612c]">Synchronizing Market...</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-white shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-[#f0f2f5]">
            <tr className="border-b border-gray-100">
              <th className="py-3 px-4 text-[12px] font-black uppercase text-gray-500 tracking-wider w-[150px]">Date & Time</th>
              <th className="py-3 px-4 text-[12px] font-black uppercase text-gray-500 tracking-wider">Match</th>
              <th className="py-3 px-4 text-[12px] font-black uppercase text-gray-500 tracking-wider text-center w-[100px]">1</th>
              <th className="py-3 px-4 text-[12px] font-black uppercase text-gray-500 tracking-wider text-center w-[100px]">X</th>
              <th className="py-3 px-4 text-[12px] font-black uppercase text-gray-500 tracking-wider text-center w-[100px]">2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {matches.map((match) => (
              <tr key={match.Event_Id || match.MarketId} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="text-[11px] text-gray-500 font-bold whitespace-nowrap">
                    {match.DateTime}
                  </div>
                </td>
                <td className="py-4 px-4 font-bold text-[#222]">
                  <div className="flex flex-col">
                    <span className="truncate">{match.Team1}</span>
                    <span className="truncate">{match.Team2}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  {renderGreenRateBox(getRate(match.MarketId, '0'))}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-gray-300">-</span>
                </td>
                <td className="py-4 px-4 text-center">
                  {renderGreenRateBox(getRate(match.MarketId, '1'))}
                </td>
              </tr>
            ))}
            {matches.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400 italic text-sm">
                  No active matches found for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BettingMatchTable;

