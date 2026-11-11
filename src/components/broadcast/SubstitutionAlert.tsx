import React from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { MatchEvent } from '../../types/broadcast';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface SubstitutionAlertProps {
  event?: MatchEvent;
}

export const SubstitutionAlert: React.FC<SubstitutionAlertProps> = ({ event }) => {
  const { state } = useBroadcast();
  const activeEvent = event || (state.graphics.activePopup?.data as MatchEvent);

  if (!activeEvent) return null;

  const playerOut = state.players.find((p) => p.id === activeEvent.playerId);
  const playerIn = state.players.find((p) => p.id === activeEvent.subInPlayerId);
  const isHome = activeEvent.teamId === state.match.homeTeam.id;
  const team = isHome ? state.match.homeTeam : state.match.awayTeam;

  return (
    <div className="relative animate-in slide-in-from-bottom-6 duration-300 drop-shadow-2xl max-w-lg w-full">
      <div className="relative overflow-hidden rounded-xl border border-white/20 bg-zinc-950/95 shadow-2xl p-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-sport-heading text-xl font-bold uppercase tracking-wider text-emerald-400">
              SUBSTITUTION
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-sport-mono text-zinc-400">
            <span>{team.name}</span>
            <span>•</span>
            <span className="font-bold text-white">{activeEvent.minute}&apos;</span>
          </div>
        </div>

        {/* Players In and Out */}
        <div className="grid grid-cols-2 gap-3">
          {/* PLAYER IN (GREEN) */}
          <div className="flex items-center gap-2.5 bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 font-sport-mono block">
                IN
              </span>
              <p className="font-sport-heading text-lg font-bold leading-none text-white truncate">
                {playerIn ? playerIn.name : 'Substitute'}
              </p>
              <p className="text-[11px] text-zinc-400 font-sport-mono">
                #{playerIn?.number} • {playerIn?.position}
              </p>
            </div>
          </div>

          {/* PLAYER OUT (RED) */}
          <div className="flex items-center gap-2.5 bg-rose-950/40 border border-rose-500/40 p-2.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-rose-400 font-sport-mono block">
                OUT
              </span>
              <p className="font-sport-heading text-lg font-bold leading-none text-white truncate">
                {playerOut ? playerOut.name : 'Replaced Player'}
              </p>
              <p className="text-[11px] text-zinc-400 font-sport-mono">
                #{playerOut?.number} • {playerOut?.position}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
