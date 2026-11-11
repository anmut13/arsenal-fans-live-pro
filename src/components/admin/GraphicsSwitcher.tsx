import React, { useState } from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { ActiveGraphic } from '../../types/broadcast';
import {
  Monitor,
  Tv,
  CheckCircle,
  XCircle,
  PlaySquare,
  Sparkles,
  Flame,
  BarChart2,
  Users,
  Share2,
  Radio,
  FileText,
} from 'lucide-react';

export const GraphicsSwitcher: React.FC = () => {
  const {
    state,
    updateGraphics,
    showPopupGraphic,
    hidePopupGraphic,
    setBallPosition,
    updateTactical,
  } = useBroadcast();

  const { graphics, match, players, tactical } = state;
  const [selectedProfilePlayerId, setSelectedProfilePlayerId] = useState<string>(players[8]?.id || '');
  const [tickerInput, setTickerInput] = useState<string>(graphics.tickerText);
  const [sponsorInput, setSponsorInput] = useState<string>(graphics.sponsorName);

  const handleUpdateTicker = () => {
    updateGraphics({ tickerText: tickerInput, sponsorName: sponsorInput });
  };

  const selectedPlayer = players.find((p) => p.id === selectedProfilePlayerId) || players[8];

  const handleQuickBallMove = (x: number, y: number, teamId?: string) => {
    setBallPosition(x, y);
    if (teamId) {
      updateTactical({ possessionTeamId: teamId });
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 lg:p-5 shadow-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
        <div className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-red-500" />
          <h3 className="font-sport-heading text-xl uppercase tracking-wider font-bold">
            Broadcast Graphics Master Switcher
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {graphics.activePopup ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 font-sport-mono text-xs font-bold animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE POPUP: {graphics.activePopup.type}</span>
            </span>
          ) : (
            <span className="text-zinc-500 font-sport-mono text-xs">NO ACTIVE POPUP</span>
          )}
        </div>
      </div>

      {/* Main Graphics Toggle Grid (6 Tiles) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
        {/* 1. Scorebug Toggle */}
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs uppercase font-sport-mono text-zinc-300">
              Scoreboard
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                graphics.scoreboard ? 'bg-emerald-400' : 'bg-zinc-600'
              }`}
            />
          </div>
          <button
            onClick={() => updateGraphics({ scoreboard: !graphics.scoreboard })}
            className={`w-full py-1.5 rounded font-sport-mono text-xs font-bold uppercase transition ${
              graphics.scoreboard
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
            }`}
          >
            {graphics.scoreboard ? 'ON AIR' : 'OFF AIR'}
          </button>
        </div>

        {/* 2. Tactical Ball Radar (PiP on Live Broadcast) */}
        <div className="bg-zinc-950 border border-emerald-500/30 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs uppercase font-sport-mono text-emerald-400">
              Tactical Radar
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                graphics.tacticalRadar ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'
              }`}
            />
          </div>
          <button
            onClick={() => updateGraphics({ tacticalRadar: !graphics.tacticalRadar })}
            className={`w-full py-1.5 rounded font-sport-mono text-xs font-bold uppercase transition ${
              graphics.tacticalRadar
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
            }`}
          >
            {graphics.tacticalRadar ? 'RADAR ON AIR' : 'RADAR PiP'}
          </button>
        </div>

        {/* 3. Match Statistics Graphic Trigger */}
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs uppercase font-sport-mono text-zinc-300">
              Match Stats
            </span>
            <BarChart2 className="w-3.5 h-3.5 text-red-400" />
          </div>
          <button
            onClick={() => {
              if (graphics.activePopup?.type === 'MATCH_STATS') hidePopupGraphic();
              else showPopupGraphic('MATCH_STATS', null, 15);
            }}
            className={`w-full py-1.5 rounded font-sport-mono text-xs font-bold uppercase transition ${
              graphics.activePopup?.type === 'MATCH_STATS'
                ? 'bg-amber-500 text-black animate-pulse'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            {graphics.activePopup?.type === 'MATCH_STATS' ? 'HIDE STATS' : 'PUSH STATS'}
          </button>
        </div>

        {/* 4. Momentum Chart Graphic Trigger */}
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs uppercase font-sport-mono text-zinc-300">
              Momentum
            </span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <button
            onClick={() => {
              if (graphics.activePopup?.type === 'MOMENTUM_CHART') hidePopupGraphic();
              else showPopupGraphic('MOMENTUM_CHART', null, 15);
            }}
            className={`w-full py-1.5 rounded font-sport-mono text-xs font-bold uppercase transition ${
              graphics.activePopup?.type === 'MOMENTUM_CHART'
                ? 'bg-amber-500 text-black animate-pulse'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            {graphics.activePopup?.type === 'MOMENTUM_CHART' ? 'HIDE MOMENTUM' : 'PUSH MOMENTUM'}
          </button>
        </div>

        {/* 5. Goal Celebration Graphic Trigger */}
        <div className="bg-zinc-950 border border-amber-500/30 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs uppercase font-sport-mono text-amber-400">
              Celebration
            </span>
            <span className="text-xs">🎉</span>
          </div>
          <button
            onClick={() => {
              if (graphics.activePopup?.type === 'GOAL_CELEBRATION') {
                hidePopupGraphic();
              } else {
                const lastGoal = state.events.find((e) => e.type === 'GOAL' || e.type === 'PENALTY_GOAL');
                const defaultScorer = state.players.find(
                  (p) => p.isStarter && (p.position === 'ST' || p.position === 'RW' || p.position === 'LW')
                );
                showPopupGraphic(
                  'GOAL_CELEBRATION',
                  lastGoal || {
                    id: `goal-event-${Date.now()}`,
                    type: 'GOAL',
                    minute: Math.floor(state.clock.seconds / 60) || 73,
                    teamId: state.match.homeTeam.id,
                    playerId: defaultScorer?.id || state.players[0]?.id,
                    description: `Spectacular goal celebration on air for ${state.match.homeTeam.name}!`,
                    timestamp: Date.now(),
                  },
                  10
                );
              }
            }}
            className={`w-full py-1.5 rounded font-sport-mono text-xs font-bold uppercase transition ${
              graphics.activePopup?.type === 'GOAL_CELEBRATION'
                ? 'bg-amber-500 text-black font-black animate-pulse'
                : 'bg-zinc-800 hover:bg-zinc-700 text-amber-300'
            }`}
          >
            {graphics.activePopup?.type === 'GOAL_CELEBRATION' ? 'HIDE GOAL' : 'PUSH GOAL'}
          </button>
        </div>

        {/* 6. Clear Screen / Full Tactical Push */}
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs uppercase font-sport-mono text-zinc-300">
              Clear Screen
            </span>
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <button
            onClick={hidePopupGraphic}
            disabled={!graphics.activePopup}
            className={`w-full py-1.5 rounded font-sport-mono text-xs font-bold uppercase transition ${
              graphics.activePopup
                ? 'bg-rose-900 hover:bg-rose-800 text-white'
                : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
            }`}
          >
            CLEAR POPUPS
          </button>
        </div>
      </div>

      {/* Tactical Pitch Full Overlay & Live Ball Movement Controls */}
      <div className="mb-4 p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <PlaySquare className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-sport-mono font-bold uppercase text-emerald-400">
              Live Tactical Ball Movement on Broadcast:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (graphics.activePopup?.type === 'TACTICAL_PITCH') hidePopupGraphic();
                else showPopupGraphic('TACTICAL_PITCH', null, 30);
              }}
              className={`px-3 py-1 rounded text-xs font-sport-mono font-bold uppercase transition ${
                graphics.activePopup?.type === 'TACTICAL_PITCH'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {graphics.activePopup?.type === 'TACTICAL_PITCH' ? 'HIDE FULL PITCH' : 'PUSH FULL PITCH ON AIR'}
            </button>

            <button
              onClick={() => updateTactical({ isPlayingMovement: !tactical.isPlayingMovement })}
              className={`px-3 py-1 rounded text-xs font-sport-mono font-bold uppercase transition flex items-center gap-1.5 ${
                tactical.isPlayingMovement
                  ? 'bg-amber-500 text-black animate-pulse'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              <span>{tactical.isPlayingMovement ? '⏸ PAUSE PLAY' : '▶ ANIMATE BALL'}</span>
            </button>
          </div>
        </div>

        {/* Quick Ball Placement Hotkeys */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-400 font-sport-mono text-[11px] font-bold">
            MOVE BALL TO:
          </span>
          <button
            onClick={() => handleQuickBallMove(50, 50)}
            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded text-[11px] font-sport-mono text-zinc-200"
          >
            ⚽ Centre Circle
          </button>
          <button
            onClick={() => handleQuickBallMove(16, 50, match.awayTeam.id)}
            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded text-[11px] font-sport-mono text-zinc-200"
          >
            ⚽ {match.homeTeam.code} Box (Attack)
          </button>
          <button
            onClick={() => handleQuickBallMove(84, 50, match.homeTeam.id)}
            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded text-[11px] font-sport-mono text-zinc-200"
          >
            ⚽ {match.awayTeam.code} Box (Attack)
          </button>
          <button
            onClick={() => handleQuickBallMove(72, 18, match.homeTeam.id)}
            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded text-[11px] font-sport-mono text-zinc-200"
          >
            ⚽ Left Wing Cross
          </button>
          <button
            onClick={() => handleQuickBallMove(72, 82, match.homeTeam.id)}
            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded text-[11px] font-sport-mono text-zinc-200"
          >
            ⚽ Right Wing Cutback
          </button>

          {/* Possession Switcher */}
          <button
            onClick={() =>
              updateTactical({
                possessionTeamId:
                  tactical.possessionTeamId === match.homeTeam.id
                    ? match.awayTeam.id
                    : match.homeTeam.id,
              })
            }
            className="ml-auto px-2.5 py-1 rounded text-[11px] font-sport-mono font-bold uppercase border transition"
            style={{
              backgroundColor: `${
                tactical.possessionTeamId === match.homeTeam.id
                  ? match.homeTeam.primaryColor
                  : match.awayTeam.primaryColor
              }33`,
              color:
                tactical.possessionTeamId === match.homeTeam.id
                  ? match.homeTeam.primaryColor
                  : match.awayTeam.primaryColor,
              borderColor:
                tactical.possessionTeamId === match.homeTeam.id
                  ? match.homeTeam.primaryColor
                  : match.awayTeam.primaryColor,
            }}
          >
            POSSESSION: {tactical.possessionTeamId === match.homeTeam.id ? match.homeTeam.code : match.awayTeam.code}
          </button>
        </div>
      </div>

      {/* Player Profile Spotlight Trigger */}
      <div className="mb-4 p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-sport-mono font-bold uppercase text-zinc-300 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Player Spotlight Lower Third Graphic:</span>
          </span>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          <select
            value={selectedProfilePlayerId}
            onChange={(e) => setSelectedProfilePlayerId(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.teamId === match.homeTeam.id ? 'ARS' : match.awayTeam.code} #{p.number} {p.name}{' '}
                ({p.position}) - Rating: {p.rating.toFixed(1)}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (selectedPlayer) {
                showPopupGraphic('PLAYER_PROFILE', selectedPlayer, 10);
              }
            }}
            className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 font-sport-mono text-xs font-bold text-white transition whitespace-nowrap"
          >
            PUSH PLAYER CARD
          </button>
        </div>
      </div>

      {/* Ticker & Sponsor Control */}
      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sport-mono font-bold uppercase text-zinc-300">
            Breaking News Ticker &amp; Sponsor Text
          </span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={graphics.ticker}
                onChange={(e) => updateGraphics({ ticker: e.target.checked })}
                className="rounded bg-zinc-800 border-zinc-700 text-red-600"
              />
              <span>Show Ticker</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={graphics.sponsorBanner}
                onChange={(e) => updateGraphics({ sponsorBanner: e.target.checked })}
                className="rounded bg-zinc-800 border-zinc-700 text-red-600"
              />
              <span>Show Sponsor</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-zinc-500 block mb-1">Ticker Message</label>
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              onBlur={handleUpdateTicker}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-white"
            />
          </div>
          <div>
            <label className="text-zinc-500 block mb-1">Sponsor Brand Line</label>
            <input
              type="text"
              value={sponsorInput}
              onChange={(e) => setSponsorInput(e.target.value)}
              onBlur={handleUpdateTicker}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
