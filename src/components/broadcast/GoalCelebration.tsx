import React from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { MatchEvent } from '../../types/broadcast';

interface GoalCelebrationProps {
  event?: MatchEvent;
  onDismiss?: () => void;
}

export const GoalCelebration: React.FC<GoalCelebrationProps> = ({ event, onDismiss }) => {
  const { state, hidePopupGraphic } = useBroadcast();
  const activeEvent = event || (state.graphics.activePopup?.data as MatchEvent);

  if (!activeEvent) return null;

  const isHome = activeEvent.teamId === state.match.homeTeam.id;
  const team = isHome ? state.match.homeTeam : state.match.awayTeam;
  const scorer = state.players.find((p) => p.id === activeEvent.playerId);
  const assist = activeEvent.assistPlayerId
    ? state.players.find((p) => p.id === activeEvent.assistPlayerId)
    : null;

  const handleClose = () => {
    if (onDismiss) onDismiss();
    else hidePopupGraphic();
  };

  return (
    <div className="relative animate-in fade-in zoom-in-95 duration-300 drop-shadow-2xl max-w-xl w-full pointer-events-auto">
      {/* Background Glow & Pulsing Stadium Lighting */}
      <div
        className="absolute -inset-4 rounded-3xl blur-3xl opacity-80 animate-pulse transition-all"
        style={{ backgroundColor: team.primaryColor }}
      />

      {/* Floating Confetti / Sparkle Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[
          { x: '10%', y: '15%', delay: '0s', color: '#fbbf24', char: '✨' },
          { x: '85%', y: '20%', delay: '0.2s', color: '#f43f5e', char: '🎉' },
          { x: '25%', y: '80%', delay: '0.4s', color: '#38bdf8', char: '⚽' },
          { x: '75%', y: '75%', delay: '0.1s', color: '#fbbf24', char: '★' },
          { x: '50%', y: '10%', delay: '0.3s', color: '#34d399', char: '✦' },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute text-sm animate-bounce opacity-90"
            style={{
              left: p.x,
              top: p.y,
              animationDelay: p.delay,
              animationDuration: '1.8s',
            }}
          >
            {p.char}
          </span>
        ))}
      </div>

      {/* Main Broadcast Card */}
      <div className="relative overflow-hidden rounded-xl border-2 border-white/50 bg-zinc-950/95 shadow-2xl text-white">
        {/* Top Celebration Banner */}
        <div
          className="flex items-center justify-between px-6 py-2.5 transition-all relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor || team.primaryColor})`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-3xl animate-spin" style={{ animationDuration: '3s' }}>
              ⚽
            </span>
            <span className="font-sport-heading text-4xl lg:text-5xl font-black uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] animate-pulse">
              GOAAAL!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 font-sport-mono font-bold text-xs sm:text-sm">
              <span className="text-amber-300">{activeEvent.minute}&apos;</span>
              <span className="text-zinc-400">•</span>
              <span>{team.shortName.toUpperCase()}</span>
            </div>

            <button
              onClick={handleClose}
              className="w-6 h-6 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-xs text-white/80 hover:text-white transition"
              title="Dismiss Goal Celebration"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex items-center gap-5">
          {/* Scorer Photo with Golden Ring */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl bg-zinc-800">
              {scorer?.photo ? (
                <img
                  src={scorer.photo}
                  alt={scorer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-zinc-800 text-white">
                  ⚽
                </div>
              )}
            </div>
            {scorer && (
              <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-zinc-950 font-sport-mono font-black text-sm shadow border border-white/50">
                #{scorer.number}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-sport-heading text-3xl sm:text-4xl font-extrabold uppercase tracking-wide leading-none text-white truncate">
              {scorer ? scorer.name : 'Unknown Scorer'}
            </h3>
            <p className="text-amber-400 font-sport-mono text-xs sm:text-sm font-semibold mt-1">
              {team.name} • {scorer?.position || 'Forward'}
            </p>

            {assist && (
              <div className="mt-2.5 flex items-center gap-2 text-xs text-zinc-300 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                <span className="text-zinc-400 uppercase text-[10px] font-bold">Assist:</span>
                <span className="font-semibold text-white">{assist.name}</span>
                <span className="text-zinc-400 font-sport-mono">#{assist.number}</span>
              </div>
            )}

            {activeEvent.description && (
              <p className="mt-2 text-xs text-zinc-300 italic line-clamp-2">
                &ldquo;{activeEvent.description}&rdquo;
              </p>
            )}
          </div>

          {/* New Live Score Bug */}
          <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-lg bg-zinc-900 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-400 font-sport-mono">SCORE</span>
            <div className="flex items-center gap-2 text-xl font-bold font-sport-mono mt-0.5">
              <span className="text-red-400">{state.match.homeScore}</span>
              <span className="text-zinc-500">-</span>
              <span className="text-sky-400">{state.match.awayScore}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
