import React from 'react';
import { useBroadcast } from '../context/BroadcastContext';
import { Scoreboard } from '../components/broadcast/Scoreboard';
import { GoalCelebration } from '../components/broadcast/GoalCelebration';
import { CardAlert } from '../components/broadcast/CardAlert';
import { SubstitutionAlert } from '../components/broadcast/SubstitutionAlert';
import { MatchStatsOverlay } from '../components/broadcast/MatchStatsOverlay';
import { MomentumChart } from '../components/broadcast/MomentumChart';
import { PlayerProfileOverlay } from '../components/broadcast/PlayerProfileOverlay';
import { NewsTicker } from '../components/broadcast/NewsTicker';
import { TacticalPitch } from '../components/tactical/TacticalPitch';
import { LiveTacticalRadar } from '../components/broadcast/LiveTacticalRadar';

export const LiveBroadcastScreen: React.FC = () => {
  const { state } = useBroadcast();
  const { graphics } = state;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-transparent select-none flex flex-col justify-between p-6 lg:p-8 pointer-events-none">
      {/* Top Left: Scoreboard Bug */}
      <div className="flex items-start justify-between w-full pointer-events-auto">
        {graphics.scoreboard ? (
          <Scoreboard layout="broadcast-top" />
        ) : (
          <div />
        )}

        {/* Top Right: Live Watermark or Match Info */}
        <div className="hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-sport-mono text-zinc-300 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>ARSENAL FANS LIVE</span>
          <span className="text-zinc-500">•</span>
          <span className="text-amber-400 font-bold">{state.match.competition}</span>
        </div>
      </div>

      {/* Center / Lower-Third: Active Dynamic Broadcast Popup */}
      <div className="flex-1 flex items-center justify-center pointer-events-auto px-4 my-auto">
        {graphics.activePopup?.type === 'GOAL_CELEBRATION' && (
          <GoalCelebration />
        )}

        {graphics.activePopup?.type === 'CARD_ALERT' && (
          <CardAlert />
        )}

        {graphics.activePopup?.type === 'SUBSTITUTION_ALERT' && (
          <SubstitutionAlert />
        )}

        {graphics.activePopup?.type === 'MATCH_STATS' && (
          <div className="max-w-2xl w-full">
            <MatchStatsOverlay />
          </div>
        )}

        {graphics.activePopup?.type === 'MOMENTUM_CHART' && (
          <div className="max-w-3xl w-full">
            <MomentumChart />
          </div>
        )}

        {graphics.activePopup?.type === 'PLAYER_PROFILE' && (
          <PlayerProfileOverlay />
        )}

        {graphics.activePopup?.type === 'TACTICAL_PITCH' && (
          <div className="max-w-4xl w-full animate-in zoom-in-95 duration-300">
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/50 shadow-2xl bg-zinc-950/95 p-4 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="font-sport-heading text-2xl font-bold uppercase tracking-wider">
                    LIVE TACTICAL ANALYSIS & BALL TRACKING
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-sport-mono text-zinc-400">
                  <span className="font-bold text-white">{state.match.homeTeam.shortName}</span>
                  <span>vs</span>
                  <span className="font-bold text-white">{state.match.awayTeam.shortName}</span>
                </div>
              </div>
              <TacticalPitch hideControls={true} interactive={false} standalone={false} />
            </div>
          </div>
        )}
      </div>

      {/* Floating Tactical Ball Movement Radar (PiP on Live Broadcast) */}
      {graphics.tacticalRadar && (
        <div className="absolute bottom-20 right-8 z-30 pointer-events-auto animate-in slide-in-from-right-8 duration-300 shadow-2xl">
          <LiveTacticalRadar layout="pip" />
        </div>
      )}

      {/* Bottom: News Ticker / Sponsor Ribbon */}
      <div className="w-full pointer-events-auto">
        <NewsTicker />
      </div>
    </div>
  );
};
