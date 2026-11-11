import React from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { ArrowRight, Activity, Radio, CircleDot, Shield } from 'lucide-react';

interface LiveTacticalRadarProps {
  layout?: 'pip' | 'overlay-card' | 'compact';
  onClose?: () => void;
}

export const LiveTacticalRadar: React.FC<LiveTacticalRadarProps> = ({
  layout = 'pip',
  onClose,
}) => {
  const { state } = useBroadcast();
  const { match, players, tactical } = state;

  const isHomePossession = tactical.possessionTeamId === match.homeTeam.id;
  const possessionTeam = isHomePossession ? match.homeTeam : match.awayTeam;

  // Starters only for clean broadcast radar
  const homeStarters = players.filter((p) => p.teamId === match.homeTeam.id && p.isStarter);
  const awayStarters = players.filter((p) => p.teamId === match.awayTeam.id && p.isStarter);

  return (
    <div
      className={`relative select-none text-white overflow-hidden rounded-xl border border-white/20 bg-zinc-950/95 shadow-2xl backdrop-blur-md transition-all duration-300 pointer-events-auto ${
        layout === 'pip'
          ? 'w-[360px] sm:w-[440px] shadow-emerald-950/40 border-emerald-500/30'
          : layout === 'compact'
          ? 'w-[320px]'
          : 'w-full max-w-2xl'
      }`}
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-[11px] font-sport-mono font-bold">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-sport-heading uppercase tracking-wider text-xs">
            TACTICAL RADAR
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400 uppercase text-[10px]">
            {tactical.isPlayingMovement ? 'LIVE MOVEMENT' : 'BALL POSITION'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Possession pill */}
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm"
            style={{
              backgroundColor: `${possessionTeam.primaryColor}33`,
              color: possessionTeam.primaryColor,
              border: `1px solid ${possessionTeam.primaryColor}66`,
            }}
          >
            <CircleDot className="w-2.5 h-2.5 animate-pulse" />
            <span>{possessionTeam.code} POSSESSION</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white px-1 font-bold"
              title="Close Tactical Radar"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* SVG Grass Football Pitch */}
      <div className="relative aspect-[16/10] w-full bg-[#11401f] overflow-hidden">
        {/* Subtle pitch stripes */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #1b6332 0, #1b6332 10%, #164f28 10%, #164f28 20%)',
          }}
        />

        {/* Pitch SVG markings */}
        <svg
          viewBox="0 0 100 64"
          className="w-full h-full absolute inset-0 pointer-events-none stroke-white/40 fill-none"
          strokeWidth="0.8"
        >
          {/* Outer Boundary */}
          <rect x="2" y="2" width="96" height="60" rx="1" />

          {/* Halfway line */}
          <line x1="50" y1="2" x2="50" y2="62" />

          {/* Centre circle */}
          <circle cx="50" cy="32" r="9.15" />
          <circle cx="50" cy="32" r="0.8" fill="rgba(255,255,255,0.7)" />

          {/* Left Penalty Box (Home) */}
          <rect x="2" y="14" width="16.5" height="36" />
          {/* Left Goal Area */}
          <rect x="2" y="23" width="5.5" height="18" />
          {/* Left Penalty Spot & Arc */}
          <circle cx="11" cy="32" r="0.8" fill="rgba(255,255,255,0.7)" />
          <path d="M 18.5,25 A 9.15,9.15 0 0,1 18.5,39" />

          {/* Right Penalty Box (Away) */}
          <rect x="81.5" y="14" width="16.5" height="36" />
          {/* Right Goal Area */}
          <rect x="92.5" y="23" width="5.5" height="18" />
          {/* Right Penalty Spot & Arc */}
          <circle cx="89" cy="32" r="0.8" fill="rgba(255,255,255,0.7)" />
          <path d="M 81.5,25 A 9.15,9.15 0 0,0 81.5,39" />

          {/* Tactical Paths / Passing routes */}
          {tactical.paths.map((p) => {
            const isPass = p.type === 'PASS';
            const color = isPass ? '#fde047' : '#38bdf8';
            return (
              <g key={p.id}>
                <line
                  x1={p.fromX}
                  y1={(p.fromY / 100) * 64}
                  x2={p.toX}
                  y2={(p.toY / 100) * 64}
                  stroke={color}
                  strokeWidth="1.2"
                  strokeDasharray={isPass ? '2,2' : 'none'}
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <circle
                  cx={p.toX}
                  cy={(p.toY / 100) * 64}
                  r="1.2"
                  fill={color}
                />
              </g>
            );
          })}
        </svg>

        {/* HOME PLAYERS (Dynamic Dots) */}
        {homeStarters.map((player) => (
          <div
            key={player.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out flex items-center justify-center pointer-events-none"
            style={{
              left: `${player.pitchX}%`,
              top: `${player.pitchY}%`,
            }}
          >
            <div
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white flex items-center justify-center font-sport-mono font-black text-[8px] shadow-lg"
              style={{
                backgroundColor: match.homeTeam.primaryColor,
                color: '#ffffff',
              }}
              title={`${player.name} (${player.position})`}
            >
              {player.number}
            </div>
          </div>
        ))}

        {/* AWAY PLAYERS (Dynamic Dots) */}
        {awayStarters.map((player) => (
          <div
            key={player.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out flex items-center justify-center pointer-events-none"
            style={{
              left: `${player.pitchX}%`,
              top: `${player.pitchY}%`,
            }}
          >
            <div
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white flex items-center justify-center font-sport-mono font-black text-[8px] shadow-lg"
              style={{
                backgroundColor: match.awayTeam.primaryColor,
                color: '#ffffff',
              }}
              title={`${player.name} (${player.position})`}
            >
              {player.number}
            </div>
          </div>
        ))}

        {/* LIVE BALL ⚽ WITH PULSING TRACKING RING */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out pointer-events-none z-20"
          style={{
            left: `${tactical.ball.x}%`,
            top: `${tactical.ball.y}%`,
          }}
        >
          {/* Radar Waves / Pulse Ring */}
          <div
            className="absolute -inset-2 rounded-full animate-ping opacity-60"
            style={{ backgroundColor: possessionTeam.primaryColor }}
          />

          {/* Ball Halo */}
          <div
            className="absolute -inset-1 rounded-full blur-[2px] opacity-90"
            style={{ backgroundColor: possessionTeam.primaryColor }}
          />

          {/* Actual 3D-styled Football Marker */}
          <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white border border-black shadow-xl flex items-center justify-center text-[10px] leading-none transform hover:scale-125 transition-transform">
            ⚽
          </div>

          {/* Mini Telemetry Tag */}
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/85 px-1.5 py-0.5 rounded border border-white/20 text-[9px] font-sport-mono font-bold text-amber-300 shadow pointer-events-none">
            {tactical.ball.x.toFixed(0)}% • {tactical.ball.y.toFixed(0)}%
          </div>
        </div>

        {/* Attacking Direction Banner at Bottom of Pitch */}
        <div className="absolute bottom-1 inset-x-2 flex items-center justify-between text-[9px] font-sport-mono text-white/70 pointer-events-none">
          <span className="flex items-center gap-1 font-bold">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: match.homeTeam.primaryColor }}
            />
            <span>{match.homeTeam.code}</span>
          </span>

          <span className="flex items-center gap-1 text-[8px] uppercase tracking-wider text-emerald-300 bg-black/50 px-2 py-0.5 rounded-full">
            <span>{match.homeTeam.shortName} ATTACK</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </span>

          <span className="flex items-center gap-1 font-bold">
            <span>{match.awayTeam.code}</span>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: match.awayTeam.primaryColor }}
            />
          </span>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-950 border-t border-zinc-800 text-[10px] font-sport-mono text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>BALL DEPTH: {tactical.ball.x.toFixed(0)}% PITCH LENGTH</span>
        </div>
        <span className="text-zinc-500 uppercase text-[9px]">
          {tactical.trackingDataSource === 'VERIFIED_COORDINATES_PROVIDER'
            ? 'VERIFIED GPS'
            : 'ESTIMATED / TACTICAL ENGINE'}
        </span>
      </div>
    </div>
  );
};
