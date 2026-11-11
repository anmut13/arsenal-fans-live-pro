import React, { useState, useRef, useCallback } from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { Player, TacticalPath } from '../../types/broadcast';
import { getRatingBadgeStyle } from '../../utils/broadcastLogic';
import {
  Play,
  Pause,
  RotateCcw,
  Move,
  Flame,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  Sliders,
  ChevronDown,
  Sparkles,
  Info,
  CircleDot,
} from 'lucide-react';

interface TacticalPitchProps {
  interactive?: boolean; // admin can drag players & ball
  standalone?: boolean; // full-screen broadcast mode
  hideControls?: boolean; // for OBS overlay
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  interactive = true,
  standalone = false,
  hideControls = false,
}) => {
  const {
    state,
    updatePlayerCoords,
    setBallPosition,
    updateTactical,
    applyFormation,
  } = useBroadcast();

  const { match, players, tactical } = state;
  const pitchRef = useRef<HTMLDivElement>(null);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [drawMode, setDrawMode] = useState<'NONE' | 'PASS' | 'RUN' | 'PRESS'>('NONE');
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [activeFilterTeam, setActiveFilterTeam] = useState<'ALL' | 'ARSENAL' | 'OPPONENT'>('ALL');

  // Convert pixel click on pitch to 0-100 percentage coordinates
  const getPitchCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!pitchRef.current) return { x: 50, y: 50 };
    const rect = pitchRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = Math.min(98, Math.max(2, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(98, Math.max(2, ((clientY - rect.top) / rect.height) * 100));
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  }, []);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent, targetId: string) => {
    if (!interactive) return;
    e.stopPropagation();
    setActiveDragId(targetId);

    const player = players.find((p) => p.id === targetId);
    if (player) setSelectedPlayer(player);
  };

  const handlePitchClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    const coords = getPitchCoords(e);

    if (drawMode !== 'NONE') {
      if (!drawStart) {
        setDrawStart(coords);
      } else {
        const newPath: TacticalPath = {
          id: `path-${Date.now()}`,
          type: drawMode,
          fromX: drawStart.x,
          fromY: drawStart.y,
          toX: coords.x,
          toY: coords.y,
          teamId: 'arsenal',
          label: drawMode === 'PASS' ? 'Pass' : drawMode === 'RUN' ? 'Attacking Run' : 'Pressing',
        };
        updateTactical({ paths: [...tactical.paths, newPath] });
        setDrawStart(null);
        setDrawMode('NONE');
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!interactive || !activeDragId) return;
    const coords = getPitchCoords(e);

    if (activeDragId === 'ball') {
      setBallPosition(coords.x, coords.y);
    } else {
      updatePlayerCoords(activeDragId, coords.x, coords.y);
    }
  };

  const handlePointerUp = () => {
    setActiveDragId(null);
  };

  const homeStarters = players.filter((p) => p.teamId === match.homeTeam.id && p.isStarter);
  const awayStarters = players.filter((p) => p.teamId === match.awayTeam.id && p.isStarter);

  const displayedPlayers = players.filter((p) => {
    if (!p.isStarter) return false;
    if (activeFilterTeam === 'ARSENAL') return p.teamId === match.homeTeam.id;
    if (activeFilterTeam === 'OPPONENT') return p.teamId === match.awayTeam.id;
    return true;
  });

  return (
    <div
      className={`relative flex flex-col w-full h-full select-none ${
        standalone ? 'bg-[#06080d] p-4 lg:p-8 min-h-screen' : ''
      }`}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      {/* Top Header / Bar */}
      {!hideControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h2 className="font-sport-heading text-2xl lg:text-3xl tracking-wide uppercase text-white flex items-center gap-2">
                <span>Tactical Pitch</span>
                <span className="text-red-500 font-bold">•</span>
                <span className="text-sm font-sans font-semibold text-slate-300">
                  {tactical.orientation.toUpperCase()} 4K ENGINE
                </span>
              </h2>
            </div>

            <div className="hidden sm:flex items-center bg-zinc-900/80 border border-zinc-700/60 rounded-md p-1 text-xs">
              <button
                onClick={() => setActiveFilterTeam('ALL')}
                className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                  activeFilterTeam === 'ALL' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Both Teams ({homeStarters.length + awayStarters.length})
              </button>
              <button
                onClick={() => setActiveFilterTeam('ARSENAL')}
                className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                  activeFilterTeam === 'ARSENAL' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {match.homeTeam.shortName} ({homeStarters.length})
              </button>
              <button
                onClick={() => setActiveFilterTeam('OPPONENT')}
                className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                  activeFilterTeam === 'OPPONENT' ? 'bg-sky-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {match.awayTeam.shortName} ({awayStarters.length})
              </button>
            </div>
          </div>

          {/* Quick Tactical Controls */}
          {interactive && (
            <div className="flex items-center gap-2">
              {/* Formations Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs font-semibold text-slate-200">
                  <Sliders className="w-3.5 h-3.5 text-red-400" />
                  <span>{match.homeTeam.code}: {match.homeTeam.formation}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>
                <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-1 z-50 min-w-[120px]">
                  {['4-3-3', '4-2-3-1', '4-4-2', '3-4-3', '3-5-2', '4-1-4-1'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => applyFormation(match.homeTeam.id, fmt)}
                      className={`text-left px-3 py-1.5 text-xs rounded hover:bg-red-600/30 hover:text-white ${
                        match.homeTeam.formation === fmt ? 'text-red-400 font-bold bg-zinc-800' : 'text-zinc-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Heatmap toggle */}
              <button
                onClick={() => updateTactical({ showHeatmap: !tactical.showHeatmap })}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-semibold transition-colors ${
                  tactical.showHeatmap
                    ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                }`}
                title="Toggle Tactical Heatmap"
              >
                <Flame className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Heatmap</span>
              </button>

              {/* Play Movement Animation */}
              <button
                onClick={() => updateTactical({ isPlayingMovement: !tactical.isPlayingMovement })}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-bold transition-all shadow ${
                  tactical.isPlayingMovement
                    ? 'bg-red-600 border-red-500 text-white animate-pulse'
                    : 'bg-emerald-700 hover:bg-emerald-600 border-emerald-600 text-white'
                }`}
                title={tactical.isPlayingMovement ? 'Pause Movement' : 'Simulate Movement Run'}
              >
                {tactical.isPlayingMovement ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{tactical.isPlayingMovement ? 'LIVE' : 'PLAY'}</span>
              </button>

              {/* Draw Lines */}
              <div className="flex items-center border border-zinc-700 rounded bg-zinc-800 p-0.5 text-xs">
                <button
                  onClick={() => setDrawMode(drawMode === 'PASS' ? 'NONE' : 'PASS')}
                  className={`px-2 py-1 rounded font-medium ${
                    drawMode === 'PASS' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-300 hover:text-white'
                  }`}
                  title="Draw Pass (Click 2 points on pitch)"
                >
                  Pass
                </button>
                <button
                  onClick={() => setDrawMode(drawMode === 'RUN' ? 'NONE' : 'RUN')}
                  className={`px-2 py-1 rounded font-medium ${
                    drawMode === 'RUN' ? 'bg-red-600 text-white font-bold' : 'text-zinc-300 hover:text-white'
                  }`}
                  title="Draw Run (Click 2 points on pitch)"
                >
                  Run
                </button>
                {tactical.paths.length > 0 && (
                  <button
                    onClick={() => updateTactical({ paths: [] })}
                    className="px-2 py-1 text-zinc-400 hover:text-rose-400 text-xs"
                    title="Clear drawing lines"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Reset Formation Positions */}
              <button
                onClick={() => {
                  applyFormation(match.homeTeam.id, match.homeTeam.formation);
                  applyFormation(match.awayTeam.id, match.awayTeam.formation);
                }}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-zinc-300 hover:text-white"
                title="Reset to Formation Coordinates"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Orientation toggle */}
              <button
                onClick={() =>
                  updateTactical({
                    orientation: tactical.orientation === 'landscape' ? 'portrait' : 'landscape',
                  })
                }
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-zinc-300 hover:text-white"
                title={`Switch to ${tactical.orientation === 'landscape' ? 'Portrait' : 'Landscape'} Pitch`}
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Drawing Mode Helper Banner */}
      {drawMode !== 'NONE' && (
        <div className="mb-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/50 rounded flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>
              Click on the pitch to set the <strong>{drawStart ? 'Target Point' : 'Start Point'}</strong> for the{' '}
              {drawMode}.
            </span>
          </div>
          <button
            onClick={() => {
              setDrawMode('NONE');
              setDrawStart(null);
            }}
            className="text-amber-400 hover:underline font-bold"
          >
            Cancel
          </button>
        </div>
      )}

      {/* THE PITCH CONTAINER */}
      <div className="relative flex-1 w-full min-h-[460px] lg:min-h-[580px] rounded-xl overflow-hidden border-2 border-emerald-950/80 shadow-2xl flex items-center justify-center bg-emerald-950">
        <div
          ref={pitchRef}
          onClick={handlePitchClick}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          className={`relative w-full h-full select-none cursor-crosshair overflow-hidden ${
            tactical.orientation === 'landscape' ? 'pitch-stripes aspect-[16/10]' : 'pitch-stripes-vertical aspect-[10/16]'
          }`}
          style={{ minHeight: '440px' }}
        >
          {/* REALISTIC PITCH SVG MARKINGS */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="turfPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="5" height="10" fill="#1b5e20" fillOpacity="0.4" />
                <rect x="5" width="5" height="10" fill="#1e6b24" fillOpacity="0.4" />
              </pattern>
            </defs>

            {/* Turf Grass Base */}
            <rect width="100" height="100" fill="#1e6b24" />

            {/* Pitch Outer Boundary Line */}
            <rect
              x="3"
              y="4"
              width="94"
              height="92"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.5"
            />

            {/* Halfway Line */}
            <line
              x1="50"
              y1="4"
              x2="50"
              y2="96"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.5"
            />

            {/* Center Circle & Spot */}
            <circle
              cx="50"
              cy="50"
              r="9.5"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.5"
            />
            <circle cx="50" cy="50" r="0.6" fill="rgba(255, 255, 255, 0.9)" />

            {/* Left Penalty Area (Home Goalkeeper area) */}
            <rect
              x="3"
              y="22"
              width="16"
              height="56"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.5"
            />
            {/* Left 6-yard Box */}
            <rect
              x="3"
              y="34"
              width="6"
              height="32"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.5"
            />
            {/* Left Penalty Spot & Arc */}
            <circle cx="14" cy="50" r="0.5" fill="rgba(255, 255, 255, 0.9)" />
            <path
              d="M 19 41 A 9.5 9.5 0 0 1 19 59"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.5"
            />
            {/* Left Goal */}
            <rect
              x="1.5"
              y="43"
              width="1.5"
              height="14"
              fill="rgba(255, 255, 255, 0.2)"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="0.5"
            />

            {/* Right Penalty Area (Away Goalkeeper area) */}
            <rect
              x="81"
              y="22"
              width="16"
              height="56"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.5"
            />
            {/* Right 6-yard Box */}
            <rect
              x="91"
              y="34"
              width="6"
              height="32"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.5"
            />
            {/* Right Penalty Spot & Arc */}
            <circle cx="86" cy="50" r="0.5" fill="rgba(255, 255, 255, 0.9)" />
            <path
              d="M 81 41 A 9.5 9.5 0 0 0 81 59"
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="0.5"
            />
            {/* Right Goal */}
            <rect
              x="97"
              y="43"
              width="1.5"
              height="14"
              fill="rgba(255, 255, 255, 0.2)"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="0.5"
            />

            {/* Corner Arcs */}
            <path d="M 3 6 A 2 2 0 0 0 5 4" fill="none" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="0.5" />
            <path d="M 3 94 A 2 2 0 0 1 5 96" fill="none" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="0.5" />
            <path d="M 97 6 A 2 2 0 0 1 95 4" fill="none" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="0.5" />
            <path d="M 97 94 A 2 2 0 0 0 95 96" fill="none" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="0.5" />

            {/* Attacking Direction Arrows */}
            <g opacity="0.25">
              <path d="M 40 92 L 60 92 L 56 89 M 60 92 L 56 95" stroke="#fff" strokeWidth="0.6" fill="none" />
              <text x="50" y="90" fill="#fff" fontSize="2.2" textAnchor="middle" fontWeight="bold">
                {match.homeTeam.shortName.toUpperCase()} ATTACKING DIRECTION &rarr;
              </text>
            </g>

            {/* TACTICAL PASSING & RUNNING PATHS */}
            {tactical.paths.map((path) => {
              const isPass = path.type === 'PASS';
              const strokeColor = isPass ? '#fbbf24' : '#ef4444';
              return (
                <g key={path.id}>
                  <line
                    x1={path.fromX}
                    y1={path.fromY}
                    x2={path.toX}
                    y2={path.toY}
                    stroke={strokeColor}
                    strokeWidth="0.8"
                    strokeDasharray={isPass ? '1.5, 1' : 'none'}
                  />
                  <circle cx={path.toX} cy={path.toY} r="1.2" fill={strokeColor} />
                  {path.label && (
                    <g>
                      <rect
                        x={(path.fromX + path.toX) / 2 - 8}
                        y={(path.fromY + path.toY) / 2 - 3}
                        width="16"
                        height="3.6"
                        rx="1"
                        fill="rgba(0, 0, 0, 0.75)"
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="0.2"
                      />
                      <text
                        x={(path.fromX + path.toX) / 2}
                        y={(path.fromY + path.toY) / 2 - 0.7}
                        fill="#ffffff"
                        fontSize="1.6"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {path.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* TACTICAL HEATMAP OVERLAY */}
          {tactical.showHeatmap && (
            <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <radialGradient id="heat1" cx="38%" cy="75%" r="30%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.6" />
                  <stop offset="70%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heat2" cx="75%" cy="30%" r="25%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
                <circle cx="38" cy="75" r="28" fill="url(#heat1)" />
                <circle cx="75" cy="30" r="22" fill="url(#heat2)" />
              </svg>
            </div>
          )}

          {/* DYNAMIC FOOTBALL (BALL MARKER) */}
          <div
            onMouseDown={(e) => handlePointerDown(e, 'ball')}
            onTouchStart={(e) => handlePointerDown(e, 'ball')}
            style={{
              left: `${tactical.ball.x}%`,
              top: `${tactical.ball.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute z-30 transition-all ${
              tactical.isPlayingMovement ? 'duration-200' : 'duration-75'
            } ${interactive ? 'cursor-grab active:cursor-grabbing hover:scale-125' : ''}`}
            title="Football (Drag to place anywhere on pitch)"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 rounded-full bg-yellow-400/30 animate-ping" />
              <div className="w-6 h-6 rounded-full bg-white border border-zinc-900 shadow-xl flex items-center justify-center text-xs">
                ⚽
              </div>
            </div>
          </div>

          {/* PLAYERS ON PITCH (MATCHING REFERENCE SCREENSHOT) */}
          {displayedPlayers.map((player) => {
            const isHome = player.teamId === match.homeTeam.id;
            const ratingStyle = getRatingBadgeStyle(player.rating);
            const isDragging = activeDragId === player.id;
            const isSelected = selectedPlayer?.id === player.id;
            const teamColor = isHome ? match.homeTeam.primaryColor : match.awayTeam.primaryColor;

            return (
              <div
                key={player.id}
                onMouseDown={(e) => handlePointerDown(e, player.id)}
                onTouchStart={(e) => handlePointerDown(e, player.id)}
                style={{
                  left: `${player.pitchX}%`,
                  top: `${player.pitchY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-20 flex flex-col items-center group ${
                  tactical.isPlayingMovement ? 'transition-all duration-200' : 'transition-transform duration-75'
                } ${isDragging ? 'z-40 scale-110' : ''} ${interactive ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                {/* Visual Player Node */}
                <div className="relative">
                  {/* Outer glow on active selection */}
                  {isSelected && (
                    <div className="absolute -inset-1.5 rounded-full border-2 border-yellow-400 animate-pulse" />
                  )}

                  {/* Player Headshot Photo */}
                  <div
                    className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 shadow-xl bg-zinc-900"
                    style={{ borderColor: teamColor }}
                  >
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="w-full h-full object-cover pointer-events-none"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Shirt Number Badge (Top-left overlap) */}
                  <div
                    className="absolute -top-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-sport-mono font-bold text-white shadow-md border border-white/60"
                    style={{ backgroundColor: teamColor }}
                  >
                    {player.number}
                  </div>

                  {/* COLORED RATING BADGE (TOP-RIGHT OVERLAP - CRITICAL VISUAL REFERENCE) */}
                  {tactical.showRatings && (
                    <div
                      className={`absolute -top-1.5 -right-2 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded-full flex items-center gap-0.5 text-[9px] sm:text-[11px] font-sport-mono shadow-lg border ${ratingStyle.bgColor} ${ratingStyle.textColor} ${ratingStyle.borderColor}`}
                      title={`Match Rating: ${player.rating.toFixed(1)} (${ratingStyle.label})`}
                    >
                      <span>★</span>
                      <span>{player.rating.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Position Badge (Bottom overlap) */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 py-0.2 bg-zinc-950/90 text-zinc-200 border border-zinc-700/80 rounded text-[8px] sm:text-[9px] font-bold font-sport-mono uppercase tracking-wider">
                    {player.position}
                  </div>
                </div>

                {/* Player Name Tag (Underneath node) */}
                {tactical.showPlayerNames && (
                  <div className="mt-1 flex flex-col items-center pointer-events-none">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-950/85 text-white font-sport-mono text-[9px] sm:text-[11px] font-semibold tracking-wide border border-zinc-700/60 shadow whitespace-nowrap">
                      {player.shortName}
                    </span>
                    {player.goals > 0 && (
                      <span className="text-[8px] sm:text-[9px] font-bold text-yellow-300 drop-shadow">
                        ⚽ {player.goals > 1 ? `x${player.goals}` : ''}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pitch Watermark & Status Tag */}
        <div className="absolute bottom-2 left-3 pointer-events-none flex items-center gap-2 bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-white/10 text-[10px] text-zinc-300 font-sport-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>ARSENAL FANS LIVE TACTICAL ENGINE</span>
          <span className="text-zinc-500">•</span>
          <span className="text-amber-400 font-semibold">{tactical.trackingDataSource}</span>
        </div>
      </div>

      {/* Selected Player Detail Card (When an Admin clicks a player) */}
      {interactive && selectedPlayer && (
        <div className="mt-3 p-3 bg-zinc-900/90 border border-zinc-700/70 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-3">
            <img
              src={selectedPlayer.photo}
              alt={selectedPlayer.name}
              className="w-10 h-10 rounded-full object-cover border border-red-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{selectedPlayer.name}</span>
                <span className="text-zinc-400 font-sport-mono">#{selectedPlayer.number}</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold font-sport-mono">
                  {selectedPlayer.position}
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                {selectedPlayer.nationality} • Age {selectedPlayer.age} • Rating:{' '}
                <strong className="text-emerald-400">{selectedPlayer.rating.toFixed(1)}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-zinc-800 px-2 py-1 rounded">
              <span className="text-zinc-400">Coords:</span>
              <span className="font-sport-mono text-white">
                X:{selectedPlayer.pitchX.toFixed(0)}% Y:{selectedPlayer.pitchY.toFixed(0)}%
              </span>
            </div>
            <button
              onClick={() => setSelectedPlayer(null)}
              className="px-2 py-1 text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
