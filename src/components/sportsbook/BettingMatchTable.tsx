'use client';

import React, { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import { marketController } from '@/controllers/market/marketController';

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
        
        // Handle object response (dictionary) or array
        let matchData: GameMatch[] = [];
        if (typeof res === 'object' && !Array.isArray(res)) {
          matchData = Object.values(res).filter(v => typeof v === 'object' && v !== null && (v.MarketId || v.marketid));
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

    const runner = rateData.runners?.[runnerId];
    if (!runner) return '-';

    // Priority 1: availableToBack price
    const backPrice = runner.ex?.availableToBack?.[0]?.price;
    if (backPrice && backPrice > 0) return backPrice;

    // Priority 2: lastPriceTraded
    if (runner.lastPriceTraded && runner.lastPriceTraded > 0) return runner.lastPriceTraded;

    return '-';
  };

  /**
   * Render function for the rate box
   */
  const renderRateBox = (rate: string | number) => {
    if (rate === '-') return '-';

    return (
      <div 
        style={{ 
          backgroundColor: '#a5d9fe', // Standard blue for back or custom green?
          // User asked for "bright green background box"
          background: '#72bbef', // Overriding with a nice bright blue/green shade often used per description
          color: '#000',
          fontWeight: '700',
          padding: '8px 12px',
          borderRadius: '4px',
          textAlign: 'center',
          minWidth: '60px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'inline-block',
          fontSize: '14px'
        }}
      >
        {rate}
      </div>
    );
  };

  // Specifically for "bright green" as requested
  const renderGreenRateBox = (rate: string | number) => {
    if (rate === '-') return '-';

    return (
      <div 
        className="rate-box"
        style={{ 
          backgroundColor: '#58D68D', // Bright Green
          color: '#fff',
          fontWeight: 'bold',
          padding: '6px 0',
          borderRadius: '4px',
          textAlign: 'center',
          width: '64px',
          display: 'block',
          margin: '0 auto',
          fontSize: '13px',
          border: '1px solid #45B39D'
        }}
      >
        {rate}
      </div>
    );
  };

  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'DateTime',
      key: 'dateTime',
      width: 150,
      render: (text: string) => (
        <div style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Match',
      key: 'match',
      render: (record: GameMatch) => (
        <div style={{ fontWeight: '600' }}>
          <div style={{ color: '#222' }}>{record.Team1}</div>
          <div style={{ color: '#222' }}>{record.Team2}</div>
        </div>
      ),
    },
    {
      title: '1',
      key: 'team1_back',
      align: 'center' as const,
      width: 100,
      render: (record: GameMatch) => renderGreenRateBox(getRate(record.MarketId, '0')),
    },
    {
      title: 'X',
      key: 'draw',
      align: 'center' as const,
      width: 100,
      render: () => <span style={{ color: '#ccc' }}>-</span>,
    },
    {
      title: '2',
      key: 'team2_back',
      align: 'center' as const,
      width: 100,
      render: (record: GameMatch) => renderGreenRateBox(getRate(record.MarketId, '1')),
    },
  ];

  return (
    <div className="betting-table-container">
      <Table 
        columns={columns} 
        dataSource={matches} 
        rowKey={(record) => record.Event_Id || record.MarketId}
        loading={loading}
        pagination={false}
        size="middle"
        bordered={false}
        className="custom-betting-table"
        scroll={{ x: 'max-content' }}
      />
      
      <style jsx global>{`
        .custom-betting-table .ant-table-thead > tr > th {
          background-color: #f0f2f5;
          text-align: center;
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
        }
        .custom-betting-table .ant-table-tbody > tr > td {
          padding: 8px 16px !important;
        }
        .custom-betting-table .ant-table-row:hover > td {
          background-color: #fafafa !important;
        }
      `}</style>
    </div>
  );
};

export default BettingMatchTable;
