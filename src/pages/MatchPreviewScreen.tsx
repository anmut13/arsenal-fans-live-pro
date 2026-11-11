import React, { useState } from 'react';
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
import { ActiveGraphic } from '../types/broadcast';
import {
  Monitor,
  Radio,
  ArrowRight,
  Flame,
  BarChart2,
  Users,
  XCircle,
  Eye,
  Sliders,
  CheckCircle,
} from 'lucide-react';

export const MatchPreviewScreen: React.FC = () => {
  const { state, showPopupGraphic, hidePopupGraphic } = useBroadcast();
  const { graphics, match, players } = state;

  const [previewGraphicType, setPreviewGraphicType] = useState<ActiveGraphic['type']>('GOAL_CELEBRATION');
  const [previewPlayerId, setPreviewPlayerId] = useState<string>(players[8]?.id || '');

  const selectedPlayer = players.find((p) => p.id === previewPlayerId) || players[8];

  const handleCutToAir = () => {
    if (previewGraphicType === 'GOAL_CELEBRATION') {
      const lastGoal = state.events.find((e) => e.type === 'GOAL') || state.events[0];
      showPopupGraphic('GOAL_CELEBRATION', lastGoal, 9);
    } else if (previewGraphicType === 'PLAYER_PROFILE') {
      showPopupGraphic('PLAYER_PROFILE', selectedPlayer, 10);
    } else if (previewGraphicType === 'MATCH_STATS') {
      showPopupGraphic('MATCH_STATS', null, 15);
    } else if (previewGraphicType === 'MOMENTUM_CHART') {
      showPopupGraphic('MOMENTUM_CHART', null, 15);
    } else if (previewGraphicType === 'CARD_ALERT') {
      const lastCard = state.events.find((e) => e.type.includes('CARD')) || state.events[1];
      showPopupGraphic('CARD_ALERT', lastCard, 7);
    } else if (previewGraphicType === 'SUBSTITUTION_ALERT') {
      const lastSub = state.events.find((e) => e.type === 'SUBSTITUTION');
      showPopupGraphic('SUBSTITUTION_ALERT', lastSub, 7);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#07090e] text-white p-4 lg:p-6 overflow-x-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-zinc-800 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Monitor className="w-6 h-6 text-red-500" />
            <h1 className="font-sport-heading text-3xl uppercase font-bold tracking-wider">
              Vision Mixer &amp; Graphics Preview Studio
            </h1>
          </div>
          <p className="text-zinc-400 text-xs font-sport-mono mt-0.5">
            DUAL-BUS PROGRAM / PREVIEW MIXER • VERIFY BEFORE PUSHING LIVE TO OBS
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 text-white font-sport-mono text-xs font-bold animate-pulse shadow">
            <Radio className="w-3.5 h-3.5" />
            <span>PROGRAM ON AIR</span>
          </div>
        </div>
      </div>

      {/* DUAL MONITORS: PREVIEW (GREEN/AMBER) vs PROGRAM (RED) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* PREVIEW MONITOR (PST) */}
        <div className="flex flex-col bg-zinc-950 border-2 border-amber-500/60 rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-amber-950/80 to-zinc-900 border-b border-amber-500/40">
            <div className="flex items-center gap-2 text-amber-400 font-sport-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>PREVIEW BUS (NEXT TO AIR)</span>
            </div>
            <span className="text-[11px] font-sport-mono text-zinc-400">
              {previewGraphicType}
            </span>
          </div>

          {/* Preview Canvas Display */}
          <div className="relative aspect-[16/9] w-full bg-[#0b0e14] p-4 flex flex-col justify-between overflow-hidden border-b border-zinc-800">
            {/* Top Scorebug preview */}
            <div className="opacity-90">
              <Scoreboard layout="compact" />
            </div>

            {/* Queued Graphic Center */}
            <div className="flex-1 flex items-center justify-center py-2">
              {previewGraphicType === 'GOAL_CELEBRATION' && (
                <GoalCelebration
                  event={
                    state.events.find((e) => e.type === 'GOAL' || e.type === 'PENALTY_GOAL') ||
                    state.events[0]
                  }
                />
              )}
              {previewGraphicType === 'PLAYER_PROFILE' && (
                <PlayerProfileOverlay player={selectedPlayer} />
              )}
              {previewGraphicType === 'MATCH_STATS' && (
                <div className="scale-75 origin-center w-full">
                  <MatchStatsOverlay />
                </div>
              )}
              {previewGraphicType === 'MOMENTUM_CHART' && (
                <div className="scale-75 origin-center w-full">
                  <MomentumChart />
                </div>
              )}
              {previewGraphicType === 'CARD_ALERT' && (
                <CardAlert
                  event={
                    state.events.find((e) => e.type.includes('CARD')) || {
                      id: 'prev-card',
                      type: 'YELLOW_CARD',
                      minute: 38,
                      teamId: match.homeTeam.id,
                      playerId: players[5]?.id,
                      description: 'Tactical foul on breakaway',
                      timestamp: Date.now(),
                    }
                  }
                />
              )}
              {previewGraphicType === 'SUBSTITUTION_ALERT' && (
                <SubstitutionAlert
                  event={{
                    id: 'prev-sub',
                    type: 'SUBSTITUTION',
                    minute: 65,
                    teamId: match.homeTeam.id,
                    playerId: players[10]?.id,
                    subInPlayerId: players[11]?.id,
                    description: 'Tactical substitution',
                    timestamp: Date.now(),
                  }}
                />
              )}
            </div>

            {/* Bottom Ticker Preview */}
            <NewsTicker />
          </div>

          {/* Preview Selector Toolbar */}
          <div className="p-3 bg-zinc-900 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-sport-mono text-zinc-400 font-bold uppercase">
              Select Preview Graphic:
            </span>
            <div className="flex flex-wrap gap-1.5 font-sport-mono">
              {[
                { id: 'GOAL_CELEBRATION', label: 'Goal' },
                { id: 'PLAYER_PROFILE', label: 'Player' },
                { id: 'MATCH_STATS', label: 'Stats' },
                { id: 'MOMENTUM_CHART', label: 'Momentum' },
                { id: 'CARD_ALERT', label: 'Card' },
                { id: 'SUBSTITUTION_ALERT', label: 'Sub' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setPreviewGraphicType(btn.id as any)}
                  className={`px-2.5 py-1 rounded transition ${
                    previewGraphicType === btn.id
                      ? 'bg-amber-500 text-black font-bold shadow'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PROGRAM MONITOR (PGM - ACTUAL LIVE ON AIR) */}
        <div className="flex flex-col bg-zinc-950 border-2 border-red-600 rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-red-950/80 to-zinc-900 border-b border-red-600/40">
            <div className="flex items-center gap-2 text-red-500 font-sport-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span>PROGRAM BUS (LIVE ON AIR)</span>
            </div>
            <span className="text-[11px] font-sport-mono text-red-400 font-bold">
              {graphics.activePopup ? `ON AIR: ${graphics.activePopup.type}` : 'SCOREBUG ONLY'}
            </span>
          </div>

          {/* Program Canvas Display */}
          <div className="relative aspect-[16/9] w-full bg-[#0b0e14] p-4 flex flex-col justify-between overflow-hidden border-b border-zinc-800">
            {/* Top Scorebug */}
            {graphics.scoreboard && (
              <div>
                <Scoreboard layout="compact" />
              </div>
            )}

            {/* Active On-Air Popup */}
            <div className="flex-1 flex items-center justify-center py-2">
              {graphics.activePopup?.type === 'GOAL_CELEBRATION' && (
                <GoalCelebration />
              )}
              {graphics.activePopup?.type === 'PLAYER_PROFILE' && (
                <PlayerProfileOverlay />
              )}
              {graphics.activePopup?.type === 'MATCH_STATS' && (
                <div className="scale-75 origin-center w-full">
                  <MatchStatsOverlay />
                </div>
              )}
              {graphics.activePopup?.type === 'MOMENTUM_CHART' && (
                <div className="scale-75 origin-center w-full">
                  <MomentumChart />
                </div>
              )}
              {graphics.activePopup?.type === 'CARD_ALERT' && (
                <CardAlert />
              )}
              {graphics.activePopup?.type === 'SUBSTITUTION_ALERT' && (
                <SubstitutionAlert />
              )}

              {!graphics.activePopup && (
                <div className="text-zinc-600 text-xs font-sport-mono uppercase tracking-widest">
                  Live Feed Clean • Overlay Ready
                </div>
              )}
            </div>

            {/* Bottom Ticker */}
            <NewsTicker />
          </div>

          {/* Vision Mixer Take / Cut Controls */}
          <div className="p-3 bg-zinc-900 flex items-center justify-between gap-3">
            <button
              onClick={handleCutToAir}
              className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 font-sport-heading text-xl uppercase font-bold text-white transition flex items-center justify-center gap-2 shadow-lg"
            >
              <ArrowRight className="w-5 h-5" />
              <span>TAKE / CUT TO AIR</span>
            </button>

            <button
              onClick={handleCutToAir}
              className="py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 font-sport-heading text-lg uppercase font-bold text-black transition"
            >
              AUTO DISSOLVE
            </button>

            <button
              onClick={hidePopupGraphic}
              className="py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-rose-400 font-sport-mono text-xs font-bold transition border border-zinc-700"
            >
              KILL AIR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
