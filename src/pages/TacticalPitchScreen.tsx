import React from 'react';
import { useBroadcast } from '../context/BroadcastContext';
import { TacticalPitch } from '../components/tactical/TacticalPitch';
import { Scoreboard } from '../components/broadcast/Scoreboard';
import { Shield, Sparkles, Activity } from 'lucide-react';

export const TacticalPitchScreen: React.FC = () => {
  const { state } = useBroadcast();
  const { match, clock } = state;

  return (
    <div className="relative w-screen min-h-screen bg-[#07090e] text-white flex flex-col p-4 lg:p-6 overflow-x-hidden">
      {/* Top TV Studio Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800/80 mb-4">
        <div className="flex items-center gap-4">
          <Scoreboard layout="compact" />
          <div className="hidden md:block">
            <h1 className="font-sport-heading text-2xl lg:text-3xl uppercase font-bold tracking-wider leading-none text-white">
              Tactical Analysis &amp; Formation Studio
            </h1>
            <p className="text-xs font-sport-mono text-zinc-400 mt-0.5">
              {match.stadium} • {match.homeTeam.formation} vs {match.awayTeam.formation}
            </p>
          </div>
        </div>

        {/* Live Channel Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600/20 border border-red-500/40 rounded-full text-xs font-sport-mono text-red-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>LIVE OBS TACTICAL FEED</span>
          </div>
        </div>
      </header>

      {/* Main Pitch View */}
      <main className="flex-1 flex flex-col justify-center">
        <TacticalPitch interactive={true} standalone={false} hideControls={false} />
      </main>

      {/* Footer Info */}
      <footer className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-xs font-sport-mono text-zinc-500 gap-2">
        <span>ARSENAL FANS LIVE • PROFESSIONAL FOOTBALL BROADCAST PLATFORM</span>
        <span>DRAGGABLE PLAYERS &amp; REAL-TIME FORMATION SYNCHRONIZED ACROSS SCREENS</span>
      </footer>
    </div>
  );
};
