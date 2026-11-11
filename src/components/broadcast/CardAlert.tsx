import React from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { MatchEvent } from '../../types/broadcast';

interface CardAlertProps {
  event?: MatchEvent;
}

export const CardAlert: React.FC<CardAlertProps> = ({ event }) => {
  const { state } = useBroadcast();
  const activeEvent = event || (state.graphics.activePopup?.data as MatchEvent);

  if (!activeEvent) return null;

  const isYellow = activeEvent.type === 'YELLOW_CARD';
  const isSecondYellow = activeEvent.type === 'SECOND_YELLOW';
  const isRed = activeEvent.type === 'RED_CARD' || isSecondYellow;

  const player = state.players.find((p) => p.id === activeEvent.playerId);
  const isHome = activeEvent.teamId === state.match.homeTeam.id;
  const team = isHome ? state.match.homeTeam : state.match.awayTeam;

  return (
    <div className="relative animate-in slide-in-from-bottom-6 duration-300 drop-shadow-2xl max-w-md w-full">
      <div className="relative overflow-hidden rounded-xl border border-white/20 bg-zinc-950/95 shadow-2xl p-4 flex items-center gap-4 text-white">
        {/* Physical Referee Card Visual */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-10 h-14 rounded-md shadow-2xl border-2 flex items-center justify-center font-bold text-xs transform -rotate-6 ${
              isRed
                ? 'bg-red-600 border-red-400 text-white shadow-red-600/50'
                : 'bg-amber-400 border-amber-200 text-zinc-900 shadow-amber-400/50'
            }`}
          >
            {isSecondYellow ? '2x🟨' : isRed ? '🟥' : '🟨'}
          </div>
        </div>

        {/* Player Headshot */}
        {player?.photo && (
          <img
            src={player.photo}
            alt={player.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 shadow"
          />
        )}

        {/* Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-sport-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                isRed ? 'bg-red-600 text-white' : 'bg-amber-400 text-black'
              }`}
            >
              {isSecondYellow
                ? 'SECOND YELLOW / RED'
                : isRed
                ? 'RED CARD'
                : 'YELLOW CARD'}
            </span>
            <span className="font-sport-mono text-zinc-400 text-xs font-bold">
              {activeEvent.minute}&apos;
            </span>
          </div>

          <h4 className="font-sport-heading text-2xl font-bold uppercase mt-1 leading-none truncate">
            {player ? player.name : 'Player'}
          </h4>
          <p className="text-zinc-400 text-xs font-sport-mono">
            {team.name} • #{player?.number || ''}
          </p>

          {activeEvent.description && (
            <p className="text-zinc-300 text-[11px] mt-1 line-clamp-1 italic">
              {activeEvent.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
