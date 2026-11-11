import React from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { formatMatchClock } from '../../utils/broadcastLogic';

interface ScoreboardProps {
  layout?: 'broadcast-top' | 'compact' | 'studio-banner';
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ layout = 'broadcast-top' }) => {
  const { state } = useBroadcast();
  const { match, clock } = state;
  const clockInfo = formatMatchClock(clock);

  return (
    <div className="inline-flex select-none drop-shadow-2xl">
      <div className="flex items-stretch overflow-hidden rounded-lg border border-white/20 bg-zinc-950/95 shadow-2xl backdrop-blur-md">
        {/* Competition Tag / Period Flag */}
        <div className="flex flex-col items-center justify-center px-3 py-1 bg-gradient-to-b from-zinc-800 to-zinc-900 border-r border-zinc-700/80">
          <span className="font-sport-mono text-[9px] uppercase tracking-wider text-amber-400 font-bold">
            {match.competition}
          </span>
          <span className="font-sport-mono text-[10px] uppercase font-bold text-zinc-300">
            {clockInfo.periodLabel}
          </span>
        </div>

        {/* HOME TEAM */}
        <div
          className="flex items-center px-3 py-1.5 text-white transition-colors duration-300"
          style={{
            background: `linear-gradient(135deg, ${match.homeTeam.primaryColor} 0%, rgba(10,10,15,0.7) 160%)`,
          }}
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center p-0.5 mr-2 shadow">
            <img
              src={match.homeTeam.logo}
              alt={match.homeTeam.shortName}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="font-sport-heading text-2xl lg:text-3xl font-bold tracking-wider leading-none mr-3">
            {match.homeTeam.code}
          </span>
          <span className="font-sport-mono text-2xl lg:text-3xl font-bold px-2 py-0.5 bg-black/40 rounded border border-white/20 shadow-inner">
            {match.homeScore}
          </span>
        </div>

        {/* VS / DIVIDER */}
        <div className="flex items-center justify-center px-1 bg-zinc-900 border-x border-zinc-800 text-zinc-400 text-xs font-sport-mono">
          -
        </div>

        {/* AWAY TEAM */}
        <div
          className="flex items-center px-3 py-1.5 text-white transition-colors duration-300"
          style={{
            background: `linear-gradient(135deg, ${match.awayTeam.primaryColor} 0%, rgba(10,10,15,0.7) 160%)`,
          }}
        >
          <span className="font-sport-mono text-2xl lg:text-3xl font-bold px-2 py-0.5 bg-black/40 rounded border border-white/20 shadow-inner mr-3">
            {match.awayScore}
          </span>
          <span className="font-sport-heading text-2xl lg:text-3xl font-bold tracking-wider leading-none mr-2">
            {match.awayTeam.code}
          </span>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center p-0.5 shadow">
            <img
              src={match.awayTeam.logo}
              alt={match.awayTeam.shortName}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* LIVE CLOCK */}
        <div className="flex flex-col items-center justify-center px-4 py-1 bg-zinc-950 border-l border-zinc-800 text-white min-w-[85px]">
          <div className="flex items-center gap-1.5">
            {clock.isRunning && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
            <span
              className={`font-sport-mono text-lg lg:text-xl font-bold tracking-wider ${
                clockInfo.isStoppage ? 'text-amber-400' : 'text-white'
              }`}
            >
              {clockInfo.display}
            </span>
          </div>
          {clock.addedTime > 0 && (
            <span className="text-[9px] font-sport-mono font-semibold text-emerald-400">
              +{clock.addedTime} MINS
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
