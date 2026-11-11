import React, { useState } from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { Player, PlayerPosition } from '../../types/broadcast';
import { getRatingBadgeStyle } from '../../utils/broadcastLogic';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Star,
  Shield,
  Layers,
  RefreshCw,
} from 'lucide-react';

export const PlayerManagement: React.FC = () => {
  const {
    state,
    updatePlayer,
    addPlayer,
    deletePlayer,
    showPopupGraphic,
    regenerateSquad,
  } = useBroadcast();

  const { players, match } = state;
  const [activeTab, setActiveTab] = useState<'HOME' | 'AWAY'>('HOME');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Player Form state
  const [formName, setFormName] = useState('');
  const [formShortName, setFormShortName] = useState('');
  const [formNumber, setFormNumber] = useState<number>(10);
  const [formPos, setFormPos] = useState<PlayerPosition>('CM');
  const [formNat, setFormNat] = useState('England');
  const [formAge, setFormAge] = useState<number>(24);
  const [formPhoto, setFormPhoto] = useState('');
  const [formRating, setFormRating] = useState<number>(7.5);
  const [formIsStarter, setFormIsStarter] = useState(true);

  const currentTeamId = activeTab === 'HOME' ? match.homeTeam.id : match.awayTeam.id;
  const currentTeam = activeTab === 'HOME' ? match.homeTeam : match.awayTeam;

  const teamPlayers = players.filter((p) => p.teamId === currentTeamId);

  const handleOpenEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormName(player.name);
    setFormShortName(player.shortName);
    setFormNumber(player.number);
    setFormPos(player.position);
    setFormNat(player.nationality);
    setFormAge(player.age);
    setFormPhoto(player.photo);
    setFormRating(player.rating);
    setFormIsStarter(player.isStarter);
    setIsCreatingNew(false);
  };

  const handleOpenCreate = () => {
    setEditingPlayer(null);
    setFormName('');
    setFormShortName('');
    setFormNumber(20);
    setFormPos('CM');
    setFormNat('England');
    setFormAge(22);
    setFormPhoto('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80');
    setFormRating(7.5);
    setFormIsStarter(false);
    setIsCreatingNew(true);
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();

    if (isCreatingNew) {
      const newPlayer: Player = {
        id: `${currentTeam.code.toLowerCase()}-${formNumber}-${Date.now()}`,
        teamId: currentTeamId,
        name: formName || 'New Player',
        shortName: formShortName || formName.split(' ').pop() || 'Player',
        number: formNumber,
        position: formPos,
        nationality: formNat,
        age: formAge,
        photo:
          formPhoto ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
        rating: Number(formRating),
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 0,
        isStarter: formIsStarter,
        pitchX: 50,
        pitchY: 50,
      };
      addPlayer(newPlayer);
    } else if (editingPlayer) {
      updatePlayer(editingPlayer.id, {
        name: formName,
        shortName: formShortName,
        number: formNumber,
        position: formPos,
        nationality: formNat,
        age: formAge,
        photo: formPhoto,
        rating: Number(formRating),
        isStarter: formIsStarter,
      });
    }

    setEditingPlayer(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 lg:p-5 shadow-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          <h3 className="font-sport-heading text-xl uppercase tracking-wider font-bold">
            Squad &amp; Player Management
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => regenerateSquad(activeTab === 'HOME')}
            title={`Generate fresh 11 starters and bench for ${currentTeam.name}`}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded text-xs font-bold text-zinc-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            <span>Generate Squad</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-bold text-white transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add New Player</span>
          </button>
        </div>
      </div>

      {/* Team Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('HOME')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'HOME'
              ? 'text-white shadow'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
          style={
            activeTab === 'HOME'
              ? { backgroundColor: match.homeTeam.primaryColor }
              : undefined
          }
        >
          <span className="w-2 h-2 rounded-full bg-white inline-block" />
          <span>{match.homeTeam.name} Squad</span>
          <span className="bg-black/40 px-1.5 py-0.2 rounded text-[10px]">
            {players.filter((p) => p.teamId === match.homeTeam.id).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('AWAY')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'AWAY'
              ? 'text-white shadow'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
          style={
            activeTab === 'AWAY'
              ? { backgroundColor: match.awayTeam.primaryColor }
              : undefined
          }
        >
          <span className="w-2 h-2 rounded-full bg-white inline-block" />
          <span>{match.awayTeam.name} Squad</span>
          <span className="bg-black/40 px-1.5 py-0.2 rounded text-[10px]">
            {players.filter((p) => p.teamId === match.awayTeam.id).length}
          </span>
        </button>
      </div>

      {/* Player Edit / Create Modal Form */}
      {(editingPlayer || isCreatingNew) && (
        <form
          onSubmit={handleSavePlayer}
          className="mb-5 p-4 bg-zinc-950 border border-zinc-700 rounded-xl space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-xs font-bold font-sport-mono uppercase text-amber-400">
              {isCreatingNew ? 'Create New Player' : `Editing: ${editingPlayer?.name}`}
            </h4>
            <button
              type="button"
              onClick={() => {
                setEditingPlayer(null);
                setIsCreatingNew(false);
              }}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Short / Jersey Name</label>
              <input
                type="text"
                required
                value={formShortName}
                onChange={(e) => setFormShortName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-400 block mb-1">Shirt #</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={formNumber}
                  onChange={(e) => setFormNumber(parseInt(e.target.value) || 1)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Position</label>
                <select
                  value={formPos}
                  onChange={(e) => setFormPos(e.target.value as PlayerPosition)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-white"
                >
                  <option value="GK">GK</option>
                  <option value="CB">CB</option>
                  <option value="LB">LB</option>
                  <option value="RB">RB</option>
                  <option value="CDM">CDM</option>
                  <option value="CM">CM</option>
                  <option value="CAM">CAM</option>
                  <option value="LM">LM</option>
                  <option value="RM">RM</option>
                  <option value="LW">LW</option>
                  <option value="RW">RW</option>
                  <option value="ST">ST</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Nationality</label>
              <input
                type="text"
                value={formNat}
                onChange={(e) => setFormNat(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1">Age</label>
              <input
                type="number"
                min="16"
                max="45"
                value={formAge}
                onChange={(e) => setFormAge(parseInt(e.target.value) || 20)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1">
                Rating ({Number(formRating).toFixed(1)})
              </label>
              <input
                type="range"
                min="4.0"
                max="10.0"
                step="0.1"
                value={formRating}
                onChange={(e) => setFormRating(parseFloat(e.target.value))}
                className="w-full mt-2 accent-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  checked={formIsStarter}
                  onChange={(e) => setFormIsStarter(e.target.checked)}
                  className="rounded bg-zinc-800 border-zinc-700 text-red-600"
                />
                <span>Starting XI?</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 text-xs">Headshot Photo URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={formPhoto}
              onChange={(e) => setFormPhoto(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setEditingPlayer(null);
                setIsCreatingNew(false);
              }}
              className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs"
            >
              Save Player Data
            </button>
          </div>
        </form>
      )}

      {/* Players List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 font-sport-mono uppercase text-[10px]">
              <th className="py-2 px-2">Player</th>
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Pos</th>
              <th className="py-2 px-2">Rating</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Goals</th>
              <th className="py-2 px-2">Assists</th>
              <th className="py-2 px-2">Cards</th>
              <th className="py-2 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sport-mono">
            {teamPlayers.map((player) => {
              const ratingStyle = getRatingBadgeStyle(player.rating);
              return (
                <tr key={player.id} className="hover:bg-zinc-800/50 transition">
                  {/* Photo & Name */}
                  <td className="py-2 px-2 flex items-center gap-2.5 font-sans">
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <span className="font-bold text-white block leading-tight">
                        {player.name}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {player.nationality} • {player.age}y
                      </span>
                    </div>
                  </td>

                  {/* Shirt # */}
                  <td className="py-2 px-2 font-bold text-white">#{player.number}</td>

                  {/* Position */}
                  <td className="py-2 px-2 font-bold text-amber-400">{player.position}</td>

                  {/* Rating */}
                  <td className="py-2 px-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${ratingStyle.bgColor} ${ratingStyle.textColor}`}
                    >
                      ★ {player.rating.toFixed(1)}
                    </span>
                  </td>

                  {/* Starter / Sub */}
                  <td className="py-2 px-2">
                    <button
                      onClick={() => updatePlayer(player.id, { isStarter: !player.isStarter })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        player.isStarter
                          ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                      title="Click to toggle Starter / Sub"
                    >
                      {player.isStarter ? 'STARTER' : 'BENCH'}
                    </button>
                  </td>

                  {/* Goals */}
                  <td className="py-2 px-2 text-white font-bold">{player.goals}</td>

                  {/* Assists */}
                  <td className="py-2 px-2 text-zinc-300">{player.assists}</td>

                  {/* Cards */}
                  <td className="py-2 px-2">
                    {player.yellowCards > 0 && <span title="Yellow Card">🟨 </span>}
                    {player.redCards > 0 && <span title="Red Card">🟥 </span>}
                    {player.yellowCards === 0 && player.redCards === 0 && (
                      <span className="text-zinc-600">-</span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-2 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Push Spotlight Graphic */}
                      <button
                        onClick={() => showPopupGraphic('PLAYER_PROFILE', player, 10)}
                        className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                        title="Display Spotlight Lower-Third on Broadcast"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(player)}
                        className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                        title="Edit Player"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deletePlayer(player.id)}
                        className="p-1 bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 rounded"
                        title="Delete Player"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
