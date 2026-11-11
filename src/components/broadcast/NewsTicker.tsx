import React from 'react';
import { useBroadcast } from '../../context/BroadcastContext';

export const NewsTicker: React.FC = () => {
  const { state } = useBroadcast();
  const { graphics, match } = state;

  if (!graphics.ticker) return null;

  return (
    <div className="w-full flex items-stretch select-none border-t border-white/20 bg-zinc-950/95 shadow-2xl backdrop-blur-md overflow-hidden text-white h-9">
      {/* Red Channel Pill */}
      <div className="flex items-center px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-sport-heading text-lg font-black uppercase tracking-wider flex-shrink-0 z-10 border-r border-white/20">
        <span className="w-2 h-2 rounded-full bg-white mr-2 animate-ping" />
        <span>ARSENAL FANS LIVE</span>
      </div>

      {/* Scrolling Ticker Text */}
      <div className="flex-1 overflow-hidden relative flex items-center">
        <div className="flex items-center whitespace-nowrap animate-marquee font-sport-mono text-xs font-semibold text-zinc-200">
          <span className="mx-6 text-yellow-400 font-bold">MATCHDAY LIVE:</span>
          <span>{graphics.tickerText}</span>
          <span className="mx-6 text-zinc-500">•</span>
          <span className="text-red-400 font-bold">{match.homeTeam.name} {match.homeScore} - {match.awayScore} {match.awayTeam.name}</span>
          <span className="mx-6 text-zinc-500">•</span>
          <span>{match.stadium}</span>
          <span className="mx-6 text-amber-400 font-bold">★ {graphics.sponsorName}</span>
          <span className="mx-6 text-zinc-500">•</span>
          <span>NEXT: UEFA CHAMPIONS LEAGUE QUARTER FINAL</span>
        </div>
      </div>

      {/* Sponsor Tag */}
      {graphics.sponsorBanner && (
        <div className="hidden sm:flex items-center px-4 bg-zinc-900 border-l border-zinc-800 text-[11px] font-sport-mono text-amber-400 font-bold flex-shrink-0">
          {graphics.sponsorName}
        </div>
      )}
    </div>
  );
};
