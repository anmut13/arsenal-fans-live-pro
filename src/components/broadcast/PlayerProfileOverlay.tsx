import React from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { Player } from '../../types/broadcast';
import { getRatingBadgeStyle } from '../../utils/broadcastLogic';
import { Star, Award, Shield, Footprints } from 'lucide-react';

interface PlayerProfileOverlayProps {
  player?: Player;
}

export const PlayerProfileOverlay: React.FC<PlayerProfileOverlayProps> = ({ player }) => {
  const { state } = useBroadcast();
  const activePlayer = player || (state.graphics.activePopup?.data as Player) || state.players[8]; // Default Saka

  if (!activePlayer) return null;

  const isHome = activePlayer.teamId === state.match.homeTeam.id;
  const team = isHome ? state.match.homeTeam : state.match.awayTeam;
  const ratingStyle = getRatingBadgeStyle(activePlayer.rating);

  return (
    <div className="relative animate-in slide-in-from-bottom-8 duration-300 drop-shadow-2xl max-w-xl w-full">
      <div className="relative overflow-hidden rounded-xl border border-white/20 bg-zinc-950/95 shadow-2xl p-5 text-white">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: team.primaryColor }}
            />
            <span className="font-sport-heading text-xl uppercase font-bold text-amber-400">
              KEY PLAYER SPOTLIGHT
            </span>
          </div>
          <span className="font-sport-mono text-xs text-zinc-400 font-bold uppercase">
            {team.name}
          </span>
        </div>

        {/* Player Banner */}
        <div className="mt-4 flex items-center gap-5">
          {/* Headshot */}
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-full overflow-hidden border-2 shadow-xl"
              style={{ borderColor: team.primaryColor }}
            >
              <img
                src={activePlayer.photo}
                alt={activePlayer.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-sport-mono font-bold">
              #{activePlayer.number}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-sport-heading text-3xl font-extrabold uppercase leading-none tracking-wide text-white truncate">
              {activePlayer.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-xs font-bold font-sport-mono text-zinc-300">
                {activePlayer.position}
              </span>
              <span className="text-zinc-400 text-xs font-sport-mono">
                {activePlayer.nationality} • Age {activePlayer.age}
              </span>
            </div>

            {/* Rating pill */}
            <div className="mt-2.5 flex items-center gap-3">
              <div
                className={`px-2.5 py-0.5 rounded-full text-xs font-sport-mono font-bold flex items-center gap-1 shadow ${ratingStyle.bgColor} ${ratingStyle.textColor}`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>RATING {activePlayer.rating.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-zinc-400 font-sport-mono">
                Status: {activePlayer.isStarter ? 'Starter' : 'Substitute'}
              </span>
            </div>
          </div>
        </div>

        {/* Key Stats Bar */}
        <div className="mt-4 grid grid-cols-4 gap-2 pt-3 border-t border-zinc-800/80 text-center">
          <div className="bg-zinc-900/60 p-2 rounded">
            <span className="text-[10px] text-zinc-400 uppercase font-sport-mono block">Goals</span>
            <span className="font-sport-heading text-2xl font-bold text-emerald-400">
              {activePlayer.goals}
            </span>
          </div>
          <div className="bg-zinc-900/60 p-2 rounded">
            <span className="text-[10px] text-zinc-400 uppercase font-sport-mono block">Assists</span>
            <span className="font-sport-heading text-2xl font-bold text-amber-400">
              {activePlayer.assists}
            </span>
          </div>
          <div className="bg-zinc-900/60 p-2 rounded">
            <span className="text-[10px] text-zinc-400 uppercase font-sport-mono block">Minutes</span>
            <span className="font-sport-heading text-2xl font-bold text-white">
              {activePlayer.minutesPlayed}&apos;
            </span>
          </div>
          <div className="bg-zinc-900/60 p-2 rounded">
            <span className="text-[10px] text-zinc-400 uppercase font-sport-mono block">Discipline</span>
            <span className="font-sport-mono text-base font-bold text-zinc-300">
              {activePlayer.yellowCards > 0 ? `🟨 ${activePlayer.yellowCards}` : 'Clean'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
