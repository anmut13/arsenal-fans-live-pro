import React from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { Flame, ShieldAlert, Activity, TrendingUp, Info, Sliders } from 'lucide-react';

interface MomentumChartProps {
  standalone?: boolean;
}

export const MomentumChart: React.FC<MomentumChartProps> = ({ standalone = false }) => {
  const { state, updateStats } = useBroadcast();
  const { match, momentum, stats, clock } = state;

  const configuredDuration = stats.momentumDuration || 90;
  const rawMinute = Math.floor(clock.seconds / 60) || 73;
  const totalMinutes = Math.max(configuredDuration, Math.max(90, rawMinute));
  const currentMinute = Math.min(totalMinutes, rawMinute);

  // Latest momentum readings
  const latestPoint = momentum[momentum.length - 1] || {
    homePressure: 64,
    awayPressure: 36,
    dominantTeam: 'home',
    isDangerous: true,
  };

  // Territory dominance calculation
  const homeTerritory = Math.round(
    stats.dangerousAttacks[0] / (stats.dangerousAttacks[0] + stats.dangerousAttacks[1] || 1) * 100
  );
  const awayTerritory = 100 - homeTerritory;

  // Dynamic time axis ticks
  const ticks = [0, 15, 30, 45, 60, 75, 90];
  if (totalMinutes > 90) {
    if (totalMinutes >= 105) ticks.push(105);
    if (totalMinutes >= 120) ticks.push(120);
    if (!ticks.includes(totalMinutes)) ticks.push(totalMinutes);
  }

  return (
    <div
      className={`flex flex-col w-full text-white ${
        standalone ? 'bg-[#090c12] p-4 lg:p-8 min-h-screen' : 'bg-zinc-950/90 rounded-xl border border-zinc-800 p-4 lg:p-6 shadow-2xl'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="font-sport-heading text-2xl lg:text-3xl uppercase font-bold tracking-wider text-white">
              Attack Momentum &amp; Pressure Index
            </h2>
          </div>
          <p className="text-zinc-400 text-xs flex items-center gap-1.5 mt-0.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>ESTIMATED REAL-TIME MATCH INTELLIGENCE • {totalMinutes}&apos; TIMELINE</span>
          </p>
        </div>

        {/* Live Pressure Comparison Pill */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 font-sport-mono text-sm">
          <span className="font-bold" style={{ color: match.homeTeam.primaryColor }}>
            {match.homeTeam.code} {latestPoint.homePressure}%
          </span>
          <span className="text-zinc-500">vs</span>
          <span className="font-bold" style={{ color: match.awayTeam.primaryColor }}>
            {match.awayTeam.code} {latestPoint.awayPressure}%
          </span>
        </div>
      </div>

      {/* Admin Momentum Duration Selector */}
      <div className="mt-4 p-2.5 bg-zinc-900/90 border border-zinc-800 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs font-sport-mono">
        <div className="flex items-center gap-2 text-zinc-300 font-bold">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>MOMENTUM DURATION:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[90, 95, 100, 105, 120].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => updateStats({ momentumDuration: mins })}
              className={`px-2.5 py-1 rounded font-bold transition text-[11px] ${
                (stats.momentumDuration || 90) === mins
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
              }`}
            >
              {mins}&apos; {mins === 90 ? '(90M)' : mins > 100 ? '(Extra Time)' : '(Stoppage)'}
            </button>
          ))}

          <div className="flex items-center gap-1 pl-2 border-l border-zinc-700">
            <span className="text-zinc-400 text-[10px]">Custom:</span>
            <input
              type="number"
              min={90}
              max={130}
              value={stats.momentumDuration || 90}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 90;
                updateStats({ momentumDuration: Math.max(90, Math.min(130, val)) });
              }}
              className="w-14 bg-zinc-950 border border-zinc-700 rounded px-1.5 py-0.5 text-xs text-white text-center font-bold"
            />
            <span className="text-zinc-400 text-[10px]">mins</span>
          </div>
        </div>
      </div>

      {/* Main Momentum Graph: 0 - totalMinutes (90 or 90+) */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-sport-mono text-zinc-400 mb-1.5">
          <span className="flex items-center gap-1.5 font-bold" style={{ color: match.homeTeam.primaryColor }}>
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: match.homeTeam.primaryColor }} />
            {match.homeTeam.shortName.toUpperCase()} PRESSURE (+100)
          </span>
          <span className="text-zinc-500">HALF TIME (45&apos;)</span>
          <span className="flex items-center gap-1.5 font-bold" style={{ color: match.awayTeam.primaryColor }}>
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: match.awayTeam.primaryColor }} />
            {match.awayTeam.shortName.toUpperCase()} PRESSURE (-100)
          </span>
        </div>

        {/* SVG MOMENTUM CURVE */}
        <div className="relative h-44 sm:h-52 w-full bg-zinc-900/90 rounded-lg border border-zinc-800 p-2 overflow-hidden shadow-inner">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${totalMinutes} 100`} preserveAspectRatio="none">
            {/* Zero Equilibrium Line */}
            <line x1="0" y1="50" x2={totalMinutes} y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeDasharray="1,1" />

            {/* 45' Half-time vertical line */}
            <line x1="45" y1="0" x2="45" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" strokeDasharray="2,2" />

            {/* 90' Full-time vertical line if over 90 */}
            {totalMinutes > 90 && (
              <>
                <line x1="90" y1="0" x2="90" y2="100" stroke="rgba(245,158,11,0.5)" strokeWidth="0.8" strokeDasharray="2,2" />
                <rect x="90" y="0" width={totalMinutes - 90} height="100" fill="rgba(245,158,11,0.06)" />
              </>
            )}

            {/* Bars for each 2-minute interval */}
            {momentum.map((pt) => {
              const x = pt.minute;
              const isHomeDominant = pt.homePressure >= 50;
              const barHeight = Math.abs(pt.homePressure - 50); // 0 to 50
              const y = isHomeDominant ? 50 - barHeight : 50;
              const barColor = isHomeDominant ? match.homeTeam.primaryColor : match.awayTeam.primaryColor;

              return (
                <g key={pt.minute}>
                  <rect
                    x={x - 0.75}
                    y={y}
                    width={1.5}
                    height={Math.max(1, barHeight)}
                    fill={barColor}
                    opacity={pt.minute <= currentMinute ? 0.95 : 0.25}
                    rx="0.4"
                  />
                  {pt.eventIcon && (
                    <text
                      x={x}
                      y={isHomeDominant ? y - 3 : y + barHeight + 7}
                      fontSize="5"
                      textAnchor="middle"
                      className="cursor-pointer"
                    >
                      {pt.eventIcon}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Current Match Time Marker Line */}
            <line
              x1={currentMinute}
              y1="0"
              x2={currentMinute}
              y2="100"
              stroke="#fbbf24"
              strokeWidth="0.8"
            />
            <circle cx={currentMinute} cy="50" r="1.5" fill="#fbbf24" />
          </svg>

          {/* Time axis labels positioned proportionally */}
          <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] font-sport-mono text-zinc-500 pointer-events-none">
            {ticks.map((t) => (
              <span
                key={t}
                className={t === 45 || t === 90 || t === totalMinutes ? 'text-zinc-300 font-bold' : ''}
              >
                {t}&apos;{t === 45 ? ' (HT)' : t === 90 && totalMinutes > 90 ? ' (90\')' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MATCH INTELLIGENCE METRIC CARDS */}
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* HOME TEAM PRESSURE */}
        <div
          className="bg-zinc-900/80 rounded-lg p-3 border"
          style={{ borderColor: `${match.homeTeam.primaryColor}50` }}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold" style={{ color: match.homeTeam.primaryColor }}>
              {match.homeTeam.shortName.toUpperCase()} PRESSURE
            </span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold font-sport-mono text-white">
            {latestPoint.homePressure}%
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${latestPoint.homePressure}%`,
                backgroundColor: match.homeTeam.primaryColor,
              }}
            />
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Attacking 3rd Dominance</span>
        </div>

        {/* AWAY TEAM PRESSURE */}
        <div
          className="bg-zinc-900/80 rounded-lg p-3 border"
          style={{ borderColor: `${match.awayTeam.primaryColor}50` }}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold" style={{ color: match.awayTeam.primaryColor }}>
              {match.awayTeam.shortName.toUpperCase()} PRESSURE
            </span>
            <ShieldAlert className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-sport-mono text-white">
            {latestPoint.awayPressure}%
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${latestPoint.awayPressure}%`,
                backgroundColor: match.awayTeam.primaryColor,
              }}
            />
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Counter Hazard Level</span>
        </div>

        {/* TERRITORY CONTROL */}
        <div className="bg-zinc-900/80 border border-zinc-700/60 rounded-lg p-3">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="font-bold text-zinc-300">TERRITORY CONTROL</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-sport-mono text-white">
            {homeTerritory}% <span className="text-xs text-zinc-400">vs {awayTerritory}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2 overflow-hidden flex">
            <div
              className="bg-red-600 h-full transition-all duration-500"
              style={{ width: `${homeTerritory}%` }}
            />
            <div
              className="bg-sky-500 h-full transition-all duration-500"
              style={{ width: `${awayTerritory}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Pitch Tilt &amp; High Press</span>
        </div>

        {/* DANGEROUS ATTACKS */}
        <div className="bg-zinc-900/80 border border-zinc-700/60 rounded-lg p-3">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="font-bold text-amber-400">DANGEROUS ATTACKS</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-sport-mono text-white">
            {stats.dangerousAttacks[0]}{' '}
            <span className="text-xs text-zinc-400">vs {stats.dangerousAttacks[1]}</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2 overflow-hidden flex">
            <div
              className="bg-red-600 h-full"
              style={{
                width: `${
                  (stats.dangerousAttacks[0] /
                    (stats.dangerousAttacks[0] + stats.dangerousAttacks[1] || 1)) *
                  100
                }%`,
              }}
            />
            <div
              className="bg-sky-500 h-full"
              style={{
                width: `${
                  (stats.dangerousAttacks[1] /
                    (stats.dangerousAttacks[0] + stats.dangerousAttacks[1] || 1)) *
                  100
                }%`,
              }}
            />
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">Box Entries &amp; Key Passes</span>
        </div>
      </div>
    </div>
  );
};
