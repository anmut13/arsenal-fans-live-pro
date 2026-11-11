import React from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { BarChart3, Database } from 'lucide-react';

interface MatchStatsOverlayProps {
  standalone?: boolean;
}

export const MatchStatsOverlay: React.FC<MatchStatsOverlayProps> = ({ standalone = false }) => {
  const { state } = useBroadcast();
  const { match, stats } = state;

  const statItems = [
    { label: 'Ball Possession', home: `${stats.possession[0]}%`, away: `${stats.possession[1]}%`, homeVal: stats.possession[0], awayVal: stats.possession[1] },
    { label: 'Total Shots', home: stats.shots[0], away: stats.shots[1], homeVal: stats.shots[0], awayVal: stats.shots[1] },
    { label: 'Shots on Target', home: stats.shotsOnTarget[0], away: stats.shotsOnTarget[1], homeVal: stats.shotsOnTarget[0], awayVal: stats.shotsOnTarget[1] },
    { label: 'Shots off Target', home: stats.shotsOffTarget[0], away: stats.shotsOffTarget[1], homeVal: stats.shotsOffTarget[0], awayVal: stats.shotsOffTarget[1] },
    { label: 'Blocked Shots', home: stats.blockedShots[0], away: stats.blockedShots[1], homeVal: stats.blockedShots[0], awayVal: stats.blockedShots[1] },
    { label: 'Corner Kicks', home: stats.corners[0], away: stats.corners[1], homeVal: stats.corners[0], awayVal: stats.corners[1] },
    { label: 'Fouls Committed', home: stats.fouls[0], away: stats.fouls[1], homeVal: stats.fouls[0], awayVal: stats.fouls[1] },
    { label: 'Offsides', home: stats.offsides[0], away: stats.offsides[1], homeVal: stats.offsides[0], awayVal: stats.offsides[1] },
    { label: 'Goalkeeper Saves', home: stats.saves[0], away: stats.saves[1], homeVal: stats.saves[0], awayVal: stats.saves[1] },
    { label: 'Total Passes', home: stats.passes[0], away: stats.passes[1], homeVal: stats.passes[0], awayVal: stats.passes[1] },
    { label: 'Pass Accuracy', home: `${stats.passAccuracy[0]}%`, away: `${stats.passAccuracy[1]}%`, homeVal: stats.passAccuracy[0], awayVal: stats.passAccuracy[1] },
    { label: 'Tackles Won', home: stats.tackles[0], away: stats.tackles[1], homeVal: stats.tackles[0], awayVal: stats.tackles[1] },
    { label: 'Dangerous Attacks', home: stats.dangerousAttacks[0], away: stats.dangerousAttacks[1], homeVal: stats.dangerousAttacks[0], awayVal: stats.dangerousAttacks[1] },
  ];

  return (
    <div
      className={`w-full text-white ${
        standalone
          ? 'bg-[#090c12] p-4 lg:p-8 min-h-screen flex items-center justify-center'
          : 'bg-zinc-950/95 rounded-xl border border-zinc-800 p-5 shadow-2xl'
      }`}
    >
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-red-500" />
            <h2 className="font-sport-heading text-3xl uppercase font-bold tracking-wider">
              Match Statistics
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-sport-mono">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>SOURCE: {stats.dataSource}</span>
          </div>
        </div>

        {/* Teams Head-to-Head Header Bar */}
        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-700/80 rounded-lg p-3 mb-4 shadow">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border p-0.5"
              style={{
                backgroundColor: `${match.homeTeam.primaryColor}33`,
                borderColor: match.homeTeam.primaryColor,
              }}
            >
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.shortName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h4 className="font-sport-heading text-xl font-bold uppercase leading-none">
                {match.homeTeam.name}
              </h4>
              <span className="text-[10px] text-zinc-400 font-sport-mono">HOME</span>
            </div>
          </div>

          <div className="text-center font-sport-heading text-2xl font-bold text-zinc-400">
            VS
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <h4 className="font-sport-heading text-xl font-bold uppercase leading-none">
                {match.awayTeam.name}
              </h4>
              <span className="text-[10px] text-zinc-400 font-sport-mono">AWAY</span>
            </div>
            <div
              className="w-8 h-8 rounded-full border p-0.5"
              style={{
                backgroundColor: `${match.awayTeam.primaryColor}33`,
                borderColor: match.awayTeam.primaryColor,
              }}
            >
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.shortName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Stats Rows with Animated Dual-Colored Bars */}
        <div className="space-y-3">
          {statItems.map((item, idx) => {
            const total = item.homeVal + item.awayVal || 1;
            const homePercent = (item.homeVal / total) * 100;
            const awayPercent = 100 - homePercent;

            return (
              <div
                key={idx}
                className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 rounded-lg p-2.5 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-sport-mono font-bold mb-1.5">
                  <span
                    className="text-sm font-black"
                    style={{ color: match.homeTeam.primaryColor }}
                  >
                    {item.home}
                  </span>
                  <span className="text-zinc-300 font-sans uppercase tracking-wider text-[11px]">
                    {item.label}
                  </span>
                  <span
                    className="text-sm font-black"
                    style={{ color: match.awayTeam.primaryColor }}
                  >
                    {item.away}
                  </span>
                </div>

                {/* Dual Comparison Bar */}
                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden flex shadow-inner">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${homePercent}%`,
                      backgroundColor: match.homeTeam.primaryColor,
                    }}
                  />
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${awayPercent}%`,
                      backgroundColor: match.awayTeam.primaryColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
