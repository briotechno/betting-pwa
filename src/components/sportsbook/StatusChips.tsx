'use client';

import React from 'react';
import { MonitorPlay } from 'lucide-react';

interface StatusChipsProps {
  tv?: boolean;
  bm?: boolean;
  fancy?: boolean;
  goal?: boolean;
  wset?: boolean;
  className?: string;
}

const StatusChips: React.FC<StatusChipsProps> = ({ tv, bm, fancy, goal, wset, className = '' }) => {
  if (!tv && !bm && !fancy && !goal && !wset) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {tv && (
        <div className="relative group/tv">
          <div className="w-[22px] h-[18px] bg-[#3498db] rounded-[3px] flex items-center justify-center shadow-sm border border-[#2980b9] cursor-help transition-transform hover:scale-110">
             <MonitorPlay size={12} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 group-hover/tv:opacity-100 transition-opacity duration-200 z-50 shadow-xl">
            Live Stream
          </span>
        </div>
      )}

      {bm && (
        <div className="relative group/bm">
          <div className="px-1.5 h-[18px] bg-[#e67e22] rounded-[3px] flex items-center justify-center shadow-sm border border-[#d35400] cursor-help transition-transform hover:scale-110">
            <span className="text-[10px] font-black text-white leading-none">BM</span>
          </div>
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 group-hover/bm:opacity-100 transition-opacity duration-200 z-50 shadow-xl">
            Bookmaker
          </span>
        </div>
      )}

      {fancy && (
        <div className="relative group/fancy">
          <div className="w-[18px] h-[18px] bg-[#9b59b6] rounded-[3px] flex items-center justify-center shadow-sm border border-[#8e44ad] cursor-help transition-transform hover:scale-110">
            <span className="text-[10px] font-black text-white leading-none">F</span>
          </div>
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 group-hover/fancy:opacity-100 transition-opacity duration-200 z-50 shadow-xl">
            Fancy Markets
          </span>
        </div>
      )}

      {goal && (
        <div className="relative group/goal">
          <div className="w-[18px] h-[18px] bg-[#2ecc71] rounded-[3px] flex items-center justify-center shadow-sm border border-[#27ae60] cursor-help transition-transform hover:scale-110">
            <span className="text-[10px] font-black text-white leading-none">G</span>
          </div>
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 group-hover/goal:opacity-100 transition-opacity duration-200 z-50 shadow-xl">
            Goal Markets
          </span>
        </div>
      )}

      {wset && (
        <div className="relative group/set">
          <div className="px-1.5 h-[18px] bg-[#f1c40f] rounded-[3px] flex items-center justify-center shadow-sm border border-[#f39c12] cursor-help transition-transform hover:scale-110">
            <span className="text-[10px] font-black text-white leading-none">SET</span>
          </div>
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 group-hover/set:opacity-100 transition-opacity duration-200 z-50 shadow-xl">
            Set Markets
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusChips;
