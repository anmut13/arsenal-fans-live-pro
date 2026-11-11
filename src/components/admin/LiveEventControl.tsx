import React, { useState } from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { EventType, MatchEvent } from '../../types/broadcast';
import {
  Zap,
  Trash2,
  Undo2,
  PlusCircle,
  Flag,
  AlertTriangle,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';

export const LiveEventControl: React.FC = () => {
  const { state, addEvent, deleteEvent, showPopupGraphic } = useBroadcast();
  const { match, players, events, clock } = state;

  const currentMinute = Math.max(1, Math.floor(clock.seconds / 60));

  // Quick Event Form state
  const [selectedType, setSelectedType] = useState<EventType>('GOAL');
  const [selectedTeamId, setSelectedTeamId] = useState<string>(match.homeTeam.id);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [selectedAssistId, setSelectedAssistId] = useState<string>('');
  const [selectedSubInId, setSelectedSubInId] = useState<string>('');
  const [minuteInput, setMinuteInput] = useState<number>(currentMinute);
  const [descriptionInput, setDescriptionInput] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const teamPlayers = players.filter((p) => p.teamId === selectedTeamId);

  const handleQuickGoal = (teamId: string) => {
    const isHome = teamId === match.homeTeam.id;
    const team = isHome ? match.homeTeam : match.awayTeam;
    const defaultScorer =
      players.find(
        (p) =>
          p.teamId === teamId &&
          p.isStarter &&
          (p.position === 'ST' || p.position === 'RW' || p.position === 'LW' || p.position === 'CF')
      ) ||
      players.find((p) => p.teamId === teamId && p.isStarter) ||
      teamPlayers[0];

    addEvent({
      type: 'GOAL',
      minute: currentMinute,
      teamId,
      playerId: defaultScorer?.id,
      description: `Spectacular goal by ${defaultScorer?.name || 'Scorer'} for ${team.name}!`,
    });
  };

  const handleCreateCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      type: selectedType,
      minute: minuteInput || currentMinute,
      teamId: selectedTeamId,
      playerId: selectedPlayerId || undefined,
      assistPlayerId: selectedAssistId || undefined,
      subInPlayerId: selectedSubInId || undefined,
      description: descriptionInput || `${selectedType.replace('_', ' ')} event recorded`,
    });

    // Reset form
    setDescriptionInput('');
    setIsFormOpen(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 lg:p-5 shadow-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-sport-heading text-xl uppercase tracking-wider font-bold">
            Live Match Event &amp; Timeline Control
          </h3>
        </div>
        <button
          onClick={() => {
            setMinuteInput(currentMinute);
            setIsFormOpen(!isFormOpen);
          }}
          className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-bold text-white transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{isFormOpen ? 'Close Form' : 'New Match Event'}</span>
        </button>
      </div>

      {/* Quick 1-Click Action Buttons for Director */}
      <div className="mb-4">
        <span className="text-[11px] font-sport-mono text-zinc-400 font-bold uppercase block mb-2">
          One-Click Instant Event Triggers:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* Quick Home Goal */}
          <button
            onClick={() => handleQuickGoal(match.homeTeam.id)}
            style={{ backgroundColor: match.homeTeam.primaryColor }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-white font-sport-mono text-xs font-bold transition shadow hover:brightness-110"
          >
            <span>⚽</span>
            <span>{match.homeTeam.code} GOAL</span>
          </button>

          {/* Quick Away Goal */}
          <button
            onClick={() => handleQuickGoal(match.awayTeam.id)}
            style={{ backgroundColor: match.awayTeam.primaryColor }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-white font-sport-mono text-xs font-bold transition shadow hover:brightness-110"
          >
            <span>⚽</span>
            <span>{match.awayTeam.code} GOAL</span>
          </button>

          {/* Dedicated Goal Celebration Push */}
          <button
            onClick={() => {
              const lastGoal = events.find((e) => e.type === 'GOAL' || e.type === 'PENALTY_GOAL');
              const defaultScorer = players.find(
                (p) => p.isStarter && (p.position === 'ST' || p.position === 'RW' || p.position === 'LW')
              );
              showPopupGraphic(
                'GOAL_CELEBRATION',
                lastGoal || {
                  id: `goal-event-${Date.now()}`,
                  type: 'GOAL',
                  minute: currentMinute,
                  teamId: match.homeTeam.id,
                  playerId: defaultScorer?.id || players[0]?.id,
                  description: `Spectacular goal celebration on air for ${match.homeTeam.name}!`,
                  timestamp: Date.now(),
                },
                10
              );
            }}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-sport-mono text-xs font-bold transition shadow"
            title="Trigger Goal Celebration Banner & Sound on Live Broadcast"
          >
            <span>🎉</span>
            <span>CELEBRATE GOAL</span>
          </button>

          {/* Quick Yellow Card */}
          <button
            onClick={() => {
              addEvent({
                type: 'YELLOW_CARD',
                minute: currentMinute,
                teamId: match.homeTeam.id,
                playerId: teamPlayers[0]?.id,
                description: 'Caution for persistent infringement',
              });
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-sport-mono text-xs font-bold transition shadow"
          >
            <span>🟨</span>
            <span>YELLOW CARD</span>
          </button>

          {/* Quick Red Card */}
          <button
            onClick={() => {
              addEvent({
                type: 'RED_CARD',
                minute: currentMinute,
                teamId: match.awayTeam.id,
                playerId: players.find((p) => p.teamId === match.awayTeam.id)?.id,
                description: 'Straight red card for dangerous foul',
              });
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-sport-mono text-xs font-bold transition shadow"
          >
            <span>🟥</span>
            <span>RED CARD</span>
          </button>
        </div>
      </div>

      {/* Expanded Custom Event Creator Form */}
      {isFormOpen && (
        <form
          onSubmit={handleCreateCustomEvent}
          className="mb-5 p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3"
        >
          <div className="font-bold text-xs uppercase text-amber-400 font-sport-mono">
            Detailed Match Event Creator
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Event Type */}
            <div>
              <label className="text-zinc-400 block mb-1">Event Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as EventType)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="GOAL">⚽ Goal</option>
                <option value="PENALTY_GOAL">🎯 Penalty Goal</option>
                <option value="OWN_GOAL">🔄 Own Goal</option>
                <option value="YELLOW_CARD">🟨 Yellow Card</option>
                <option value="SECOND_YELLOW">🟨🟥 Second Yellow</option>
                <option value="RED_CARD">🟥 Red Card</option>
                <option value="SUBSTITUTION">🔁 Substitution</option>
                <option value="VAR_CHECK">📺 VAR Review</option>
                <option value="CORNER">🚩 Corner Kick</option>
                <option value="OFFSIDE">🚫 Offside</option>
                <option value="SAVE">🧤 Goalkeeper Save</option>
              </select>
            </div>

            {/* Team */}
            <div>
              <label className="text-zinc-400 block mb-1">Team</label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value={match.homeTeam.id}>{match.homeTeam.name} (Home)</option>
                <option value={match.awayTeam.id}>{match.awayTeam.name} (Away)</option>
              </select>
            </div>

            {/* Minute */}
            <div>
              <label className="text-zinc-400 block mb-1">Match Minute</label>
              <input
                type="number"
                min="1"
                max="120"
                value={minuteInput}
                onChange={(e) => setMinuteInput(parseInt(e.target.value) || currentMinute)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          {/* Player & Sub Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">
                {selectedType === 'SUBSTITUTION' ? 'Player OUT' : 'Primary Player'}
              </label>
              <select
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="">Select Player...</option>
                {teamPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.number} {p.name} ({p.position})
                  </option>
                ))}
              </select>
            </div>

            {selectedType === 'SUBSTITUTION' ? (
              <div>
                <label className="text-zinc-400 block mb-1">Player IN</label>
                <select
                  value={selectedSubInId}
                  onChange={(e) => setSelectedSubInId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="">Select Substitute IN...</option>
                  {teamPlayers
                    .filter((p) => !p.isStarter)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.number} {p.name} ({p.position})
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-zinc-400 block mb-1">Assist Player (Optional)</label>
                <select
                  value={selectedAssistId}
                  onChange={(e) => setSelectedAssistId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="">None / Solo Effort</option>
                  {teamPlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.number} {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-zinc-400 block mb-1 text-xs">Event Description / Comment</label>
            <input
              type="text"
              placeholder="e.g. Bukayo Saka curler from 20 yards out into top corner"
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 font-bold text-white text-xs"
            >
              Add Event to Match &amp; Broadcast
            </button>
          </div>
        </form>
      )}

      {/* Live Event Timeline List */}
      <div>
        <div className="flex items-center justify-between text-xs font-sport-mono text-zinc-400 mb-2">
          <span className="font-bold uppercase">Match Event Timeline ({events.length} Events):</span>
          <span>Click eye icon to trigger broadcast alert</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-1">
          {events.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-xs">
              No events recorded yet. Use the buttons above to log match events.
            </div>
          ) : (
            events.map((evt) => {
              const isHome = evt.teamId === match.homeTeam.id;
              const player = players.find((p) => p.id === evt.playerId);
              const isGoal = evt.type === 'GOAL' || evt.type === 'PENALTY_GOAL';

              return (
                <div
                  key={evt.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition ${
                    isHome
                      ? 'bg-zinc-950/80 border-red-500/30'
                      : 'bg-zinc-950/80 border-sky-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-sport-mono font-bold text-amber-400 bg-zinc-800 px-1.5 py-0.5 rounded text-[11px]">
                      {evt.minute}&apos;
                    </span>
                    <span className="text-base">
                      {isGoal
                        ? '⚽'
                        : evt.type.includes('YELLOW')
                        ? '🟨'
                        : evt.type.includes('RED')
                        ? '🟥'
                        : evt.type === 'SUBSTITUTION'
                        ? '🔁'
                        : '📌'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white truncate">
                          {player ? player.name : evt.type}
                        </span>
                        <span
                          className={`text-[10px] font-sport-mono font-semibold ${
                            isHome ? 'text-red-400' : 'text-sky-400'
                          }`}
                        >
                          ({isHome ? match.homeTeam.code : match.awayTeam.code})
                        </span>
                      </div>
                      <p className="text-zinc-400 text-[11px] truncate">{evt.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Trigger Popup Alert on Broadcast */}
                    <button
                      onClick={() => {
                        if (isGoal) showPopupGraphic('GOAL_CELEBRATION', evt, 8);
                        else if (evt.type.includes('CARD')) showPopupGraphic('CARD_ALERT', evt, 7);
                        else if (evt.type === 'SUBSTITUTION') showPopupGraphic('SUBSTITUTION_ALERT', evt, 7);
                      }}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded"
                      title="Trigger Alert Graphic on Live Broadcast"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete / Undo Event */}
                    <button
                      onClick={() => deleteEvent(evt.id)}
                      className="p-1.5 bg-zinc-800 hover:bg-rose-950/80 text-zinc-400 hover:text-rose-400 rounded"
                      title="Delete Event & Revert Score"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
