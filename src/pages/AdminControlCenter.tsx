import React, { useState } from 'react';
import { useBroadcast } from '../context/BroadcastContext';
import { MatchClockControl } from '../components/admin/MatchClockControl';
import { LiveEventControl } from '../components/admin/LiveEventControl';
import { GraphicsSwitcher } from '../components/admin/GraphicsSwitcher';
import { PlayerManagement } from '../components/admin/PlayerManagement';
import { MatchDetailsEditor } from '../components/admin/MatchDetailsEditor';
import { TacticalPitch } from '../components/tactical/TacticalPitch';
import { MomentumChart } from '../components/broadcast/MomentumChart';
import { MatchStatsOverlay } from '../components/broadcast/MatchStatsOverlay';
import { Scoreboard } from '../components/broadcast/Scoreboard';
import {
  LayoutDashboard,
  Shield,
  Layers,
  Activity,
  Users,
  Settings,
  Tv,
  ExternalLink,
  Lock,
  Unlock,
  Radio,
  Eye,
} from 'lucide-react';

interface AdminControlCenterProps {
  onNavigate: (route: string) => void;
}

export const AdminControlCenter: React.FC<AdminControlCenterProps> = ({ onNavigate }) => {
  const { state } = useBroadcast();
  const { match, clock } = state;

  // Admin PIN Protection State
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default unlocked for instant workflow
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'DIRECTOR' | 'TACTICAL' | 'MOMENTUM' | 'SQUAD' | 'SETTINGS'
  >('DIRECTOR');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1886' || pinInput === 'admin' || pinInput === '0000') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-screen min-h-screen bg-[#07090e] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-full bg-red-600/20 border border-red-500 flex items-center justify-center mx-auto mb-4 text-red-500">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-sport-heading text-3xl uppercase font-bold tracking-wider text-white">
            Arsenal Fans Live
          </h2>
          <p className="text-zinc-400 text-xs font-sport-mono mb-5">
            Admin Control Center • Enter PIN (Default: 1886)
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              placeholder="Enter PIN..."
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-center font-sport-mono text-xl tracking-widest text-white focus:outline-none focus:border-red-500"
              autoFocus
            />

            {pinError && (
              <p className="text-rose-400 text-xs font-sport-mono">
                Invalid PIN code. Use 1886 or click Quick Unlock below.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 font-sport-heading text-lg font-bold uppercase text-white shadow-lg transition"
            >
              Unlock Control Center
            </button>

            <button
              type="button"
              onClick={() => setIsAuthenticated(true)}
              className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-sport-mono text-xs transition"
            >
              Quick Unlock / Producer Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-[#07090e] text-white flex flex-col overflow-x-hidden">
      {/* Top TV Production Header */}
      <header className="bg-zinc-950 border-b border-zinc-800/80 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-sport-heading text-2xl font-black text-white shadow-md">
              A
            </div>
            <div>
              <h1 className="font-sport-heading text-2xl uppercase font-bold tracking-wider leading-none text-white flex items-center gap-2">
                <span>Arsenal Fans Live</span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-950 border border-red-500/50 text-red-400 font-sport-mono font-bold">
                  ADMIN MASTER
                </span>
              </h1>
              <p className="text-[11px] font-sport-mono text-zinc-400">
                {match.competition} • {match.stadium}
              </p>
            </div>
          </div>
        </div>

        {/* Live Scorebug Mini */}
        <div className="hidden sm:block">
          <Scoreboard layout="compact" />
        </div>

        {/* OBS & Page Links */}
        <div className="flex items-center gap-2">
          <a
            href="#/broadcast"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 hover:text-white text-xs font-sport-mono font-bold transition"
            title="Open clean OBS broadcast overlay screen in a new tab"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>OBS Overlay</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>

          <button
            onClick={() => onNavigate('/tactical')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-sport-mono font-bold transition border border-zinc-700"
            title="Open dedicated tactical studio pitch"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tactical Feed</span>
          </button>

          <button
            onClick={() => onNavigate('/preview')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-sport-mono font-bold transition"
            title="Open dual-bus vision mixer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vision Mixer</span>
          </button>

          <button
            onClick={() => onNavigate('/settings')}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition border border-zinc-700"
            title="Football APIs & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="bg-zinc-900/60 border-b border-zinc-800 px-4 lg:px-8 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'DIRECTOR', label: 'Match Director & Clock', icon: LayoutDashboard },
          { id: 'TACTICAL', label: 'Tactical Pitch & Formations', icon: Layers },
          { id: 'MOMENTUM', label: 'Momentum & Statistics', icon: Activity },
          { id: 'SQUAD', label: 'Squad & Players', icon: Users },
          { id: 'SETTINGS', label: 'Match Details & Calibrate', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-sport-mono font-bold uppercase transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Tab Content */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'DIRECTOR' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MatchClockControl />
              <GraphicsSwitcher />
            </div>
            <LiveEventControl />
          </div>
        )}

        {activeTab === 'TACTICAL' && (
          <div className="space-y-6">
            <TacticalPitch interactive={true} standalone={false} hideControls={false} />
          </div>
        )}

        {activeTab === 'MOMENTUM' && (
          <div className="space-y-6">
            <MomentumChart />
            <MatchStatsOverlay />
          </div>
        )}

        {activeTab === 'SQUAD' && (
          <div className="space-y-6">
            <PlayerManagement />
          </div>
        )}

        {activeTab === 'SETTINGS' && (
          <div className="space-y-6">
            <MatchDetailsEditor />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800/80 px-4 py-3 text-center text-xs font-sport-mono text-zinc-500">
        ARSENAL FANS LIVE • PROFESSIONAL LIVE FOOTBALL BROADCAST PLATFORM FOR OBS STUDIO • YOUTUBE BROADCAST READY
      </footer>
    </div>
  );
};
