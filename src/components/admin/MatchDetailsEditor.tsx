import React, { useState, useEffect } from 'react';
import { useBroadcast } from '../../context/BroadcastContext';
import { PRESET_TEAMS } from '../../data/initialMatchData';
import { WORLD_TEAMS, searchWorldTeams, createCustomTeam, WorldTeamInfo } from '../../data/worldTeamsData';
import { Team } from '../../types/broadcast';
import {
  Settings,
  Shield,
  Trophy,
  MapPin,
  User,
  Save,
  RotateCcw,
  ArrowLeftRight,
  Sparkles,
  Palette,
  Check,
  Search,
  Globe,
  Plus,
  ChevronDown,
} from 'lucide-react';

export const MatchDetailsEditor: React.FC = () => {
  const {
    state,
    updateMatch,
    updateStats,
    resetToDemo,
    changeHomeTeam,
    changeAwayTeam,
    swapTeams,
    loadMatchPreset,
  } = useBroadcast();

  const { match, stats } = state;

  // General Match Info State
  const [competition, setCompetition] = useState(match.competition);
  const [season, setSeason] = useState(match.season);
  const [stadium, setStadium] = useState(match.stadium);
  const [referee, setReferee] = useState(match.referee);
  const [homeScore, setHomeScore] = useState(match.homeScore);
  const [awayScore, setAwayScore] = useState(match.awayScore);

  // Home Team Customization State
  const [homeName, setHomeName] = useState(match.homeTeam.name);
  const [homeShort, setHomeShort] = useState(match.homeTeam.shortName);
  const [homeCode, setHomeCode] = useState(match.homeTeam.code);
  const [homeColor, setHomeColor] = useState(match.homeTeam.primaryColor);
  const [homeLogo, setHomeLogo] = useState(match.homeTeam.logo);
  const [homeFormation, setHomeFormation] = useState(match.homeTeam.formation);

  // Away Team Customization State
  const [awayName, setAwayName] = useState(match.awayTeam.name);
  const [awayShort, setAwayShort] = useState(match.awayTeam.shortName);
  const [awayCode, setAwayCode] = useState(match.awayTeam.code);
  const [awayColor, setAwayColor] = useState(match.awayTeam.primaryColor);
  const [awayLogo, setAwayLogo] = useState(match.awayTeam.logo);
  const [awayFormation, setAwayFormation] = useState(match.awayTeam.formation);

  // Quick stats edit
  const [possessionHome, setPossessionHome] = useState(stats.possession[0]);
  const [shotsHome, setShotsHome] = useState(stats.shots[0]);
  const [shotsAway, setShotsAway] = useState(stats.shots[1]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Team Search Autocomplete State
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeSearchOpen, setHomeSearchOpen] = useState(false);
  const [homeLeagueFilter, setHomeLeagueFilter] = useState('ALL');

  const [awaySearchQuery, setAwaySearchQuery] = useState('');
  const [awaySearchOpen, setAwaySearchOpen] = useState(false);
  const [awayLeagueFilter, setAwayLeagueFilter] = useState('ALL');

  // Keep state synced when teams are swapped or changed
  useEffect(() => {
    setCompetition(match.competition);
    setSeason(match.season);
    setStadium(match.stadium);
    setReferee(match.referee);
    setHomeScore(match.homeScore);
    setAwayScore(match.awayScore);

    setHomeName(match.homeTeam.name);
    setHomeShort(match.homeTeam.shortName);
    setHomeCode(match.homeTeam.code);
    setHomeColor(match.homeTeam.primaryColor);
    setHomeLogo(match.homeTeam.logo);
    setHomeFormation(match.homeTeam.formation);

    setAwayName(match.awayTeam.name);
    setAwayShort(match.awayTeam.shortName);
    setAwayCode(match.awayTeam.code);
    setAwayColor(match.awayTeam.primaryColor);
    setAwayLogo(match.awayTeam.logo);
    setAwayFormation(match.awayTeam.formation);

    setPossessionHome(stats.possession[0]);
    setShotsHome(stats.shots[0]);
    setShotsAway(stats.shots[1]);
  }, [match, stats]);

  // Handle Home Team Selection from World Teams
  const handleSelectWorldHomeTeam = (teamInfo: WorldTeamInfo | Team, autoStadium?: string) => {
    changeHomeTeam(teamInfo, true);
    setHomeSearchOpen(false);
    setHomeSearchQuery('');
    if (autoStadium) {
      setStadium(autoStadium);
    }
  };

  // Handle Away Team Selection from World Teams
  const handleSelectWorldAwayTeam = (teamInfo: WorldTeamInfo | Team) => {
    changeAwayTeam(teamInfo, true);
    setAwaySearchOpen(false);
    setAwaySearchQuery('');
  };

  // Handle Custom Typed Team for Home
  const handleCreateCustomHome = () => {
    if (!homeSearchQuery.trim()) return;
    const custom = createCustomTeam(homeSearchQuery, homeColor);
    changeHomeTeam(custom, true);
    setHomeSearchOpen(false);
    setHomeSearchQuery('');
  };

  // Handle Custom Typed Team for Away
  const handleCreateCustomAway = () => {
    if (!awaySearchQuery.trim()) return;
    const custom = createCustomTeam(awaySearchQuery, awayColor);
    changeAwayTeam(custom, true);
    setAwaySearchOpen(false);
    setAwaySearchQuery('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedHome: Team = {
      ...match.homeTeam,
      name: homeName,
      shortName: homeShort,
      code: homeCode.toUpperCase(),
      primaryColor: homeColor,
      logo: homeLogo,
      formation: homeFormation,
    };

    const updatedAway: Team = {
      ...match.awayTeam,
      name: awayName,
      shortName: awayShort,
      code: awayCode.toUpperCase(),
      primaryColor: awayColor,
      logo: awayLogo,
      formation: awayFormation,
    };

    updateMatch({
      competition,
      season,
      stadium,
      referee,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      homeTeam: updatedHome,
      awayTeam: updatedAway,
    });

    const possH = Math.min(100, Math.max(0, Number(possessionHome)));
    updateStats({
      possession: [possH, 100 - possH],
      shots: [Number(shotsHome), Number(shotsAway)],
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const filteredHomeWorldTeams = searchWorldTeams(homeSearchQuery, homeLeagueFilter);
  const filteredAwayWorldTeams = searchWorldTeams(awaySearchQuery, awayLeagueFilter);

  const leagueCategories = [
    { id: 'ALL', label: 'All (60+)' },
    { id: 'Premier League', label: 'Premier League' },
    { id: 'La Liga', label: 'La Liga' },
    { id: 'Serie A', label: 'Serie A' },
    { id: 'Bundesliga', label: 'Bundesliga' },
    { id: 'Ligue 1 & Europe', label: 'Europe' },
    { id: 'International', label: 'International' },
    { id: 'Americas & Rest of World', label: 'World' },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 lg:p-6 shadow-xl text-white space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-zinc-800 gap-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-500" />
          <h3 className="font-sport-heading text-2xl uppercase tracking-wider font-bold">
            Live Match &amp; World Team Customizer
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={swapTeams}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded text-xs font-bold text-black transition shadow"
            title="Swap Home and Away Teams"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>SWAP TEAMS (Home &harr; Away)</span>
          </button>

          <button
            type="button"
            onClick={resetToDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-semibold text-zinc-300 hover:text-white transition border border-zinc-700"
            title="Reset back to Arsenal vs Man City default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* QUICK MATCHUP PRESETS (1-CLICK LOAD) */}
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-sport-mono font-bold uppercase text-amber-400 tracking-wider">
            Quick 1-Click Match Presets:
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-sport-mono font-bold">
          <button
            type="button"
            onClick={() =>
              loadMatchPreset(
                PRESET_TEAMS.arsenal,
                PRESET_TEAMS.mancity,
                'Premier League',
                'Emirates Stadium, London'
              )
            }
            className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left transition hover:border-red-500"
          >
            <span className="text-red-400 block">Arsenal</span>
            <span className="text-zinc-500 text-[10px]">vs</span>
            <span className="text-sky-400 block">Man City</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const rma = WORLD_TEAMS.find((t) => t.id === 'realmadrid') || PRESET_TEAMS.realmadrid;
              const bar = WORLD_TEAMS.find((t) => t.id === 'barcelona') || PRESET_TEAMS.barcelona;
              loadMatchPreset(rma, bar, 'La Liga', 'Santiago Bernabéu, Madrid');
            }}
            className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left transition hover:border-amber-400"
          >
            <span className="text-amber-300 block">Real Madrid</span>
            <span className="text-zinc-500 text-[10px]">vs</span>
            <span className="text-blue-400 block">Barcelona</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const b04 = WORLD_TEAMS.find((t) => t.id === 'bayerleverkusen') || PRESET_TEAMS.bayern;
              const bay = WORLD_TEAMS.find((t) => t.id === 'bayern') || PRESET_TEAMS.bayern;
              loadMatchPreset(b04, bay, 'Bundesliga', 'BayArena, Leverkusen');
            }}
            className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left transition hover:border-red-600"
          >
            <span className="text-red-500 block">Leverkusen</span>
            <span className="text-zinc-500 text-[10px]">vs</span>
            <span className="text-red-400 block">Bayern</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const int = WORLD_TEAMS.find((t) => t.id === 'inter') || PRESET_TEAMS.inter;
              const mil = WORLD_TEAMS.find((t) => t.id === 'acmilan') || PRESET_TEAMS.inter;
              loadMatchPreset(int, mil, 'Serie A', 'San Siro, Milan');
            }}
            className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left transition hover:border-blue-500"
          >
            <span className="text-blue-500 block">Inter Milan</span>
            <span className="text-zinc-500 text-[10px]">vs</span>
            <span className="text-red-500 block">AC Milan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const mia = WORLD_TEAMS.find((t) => t.id === 'intermiami') || PRESET_TEAMS.arsenal;
              const nas = WORLD_TEAMS.find((t) => t.id === 'alnassr') || PRESET_TEAMS.mancity;
              loadMatchPreset(mia, nas, 'Club Friendly', 'Chase Stadium, Fort Lauderdale');
            }}
            className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left transition hover:border-pink-500"
          >
            <span className="text-pink-400 block">Inter Miami</span>
            <span className="text-zinc-500 text-[10px]">vs</span>
            <span className="text-yellow-400 block">Al Nassr</span>
          </button>

          <button
            type="button"
            onClick={() =>
              loadMatchPreset(
                PRESET_TEAMS.brazil,
                PRESET_TEAMS.argentina,
                'FIFA World Cup',
                'Maracanã Stadium, Rio'
              )
            }
            className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left transition hover:border-yellow-400"
          >
            <span className="text-yellow-400 block">Brazil</span>
            <span className="text-zinc-500 text-[10px]">vs</span>
            <span className="text-sky-300 block">Argentina</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TEAMS CONFIGURATION: HOME & AWAY DUAL PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ========================================================= */}
          {/* HOME TEAM CARD WITH SEARCH & TYPEAHEAD */}
          {/* ========================================================= */}
          <div
            className="bg-zinc-950 p-4 rounded-xl border-2 space-y-4 shadow-xl"
            style={{ borderColor: homeColor }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block shadow"
                  style={{ backgroundColor: homeColor }}
                />
                <span className="font-bold text-sm uppercase font-sport-mono text-white">
                  HOME TEAM CONFIG
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-sport-mono uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                ACTIVE: {match.homeTeam.code}
              </span>
            </div>

            {/* Smart Search & Instant Select Input */}
            <div className="relative">
              <label className="text-zinc-300 text-xs font-bold block mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-red-400" />
                  <span>Search or Type ANY Team in the World:</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-normal">
                  60+ Global Clubs &amp; Nations
                </span>
              </label>

              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={homeSearchQuery}
                    onChange={(e) => {
                      setHomeSearchQuery(e.target.value);
                      setHomeSearchOpen(true);
                    }}
                    onFocus={() => setHomeSearchOpen(true)}
                    placeholder="Type name (e.g. Leverkusen, Inter, Al Nassr, Dortmund, or your team)..."
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-500 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                  {homeSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setHomeSearchQuery('');
                        setHomeSearchOpen(false);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setHomeSearchOpen(!homeSearchOpen)}
                  className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs text-zinc-300 flex items-center gap-1 font-sport-mono"
                >
                  <Globe className="w-3.5 h-3.5 text-red-400" />
                  <span>Browse</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* Autocomplete Dropdown Panel */}
              {homeSearchOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-3 z-50 max-h-72 overflow-y-auto space-y-2">
                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1 pb-2 border-b border-zinc-800">
                    {leagueCategories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setHomeLeagueFilter(c.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-sport-mono font-bold transition ${
                          homeLeagueFilter === c.id
                            ? 'bg-red-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  {/* Create Custom Team Action Button if typing */}
                  {homeSearchQuery.trim() && (
                    <button
                      type="button"
                      onClick={handleCreateCustomHome}
                      className="w-full flex items-center gap-2 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/50 hover:bg-emerald-900/60 text-left transition"
                    >
                      <Plus className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-emerald-300 block">
                          Use Custom Team: &quot;{homeSearchQuery}&quot;
                        </span>
                        <span className="text-[10px] text-zinc-400 block font-sport-mono">
                          Auto-generates clean 3-letter code, colors, and 11-man squad
                        </span>
                      </div>
                    </button>
                  )}

                  {/* Filtered Teams Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {filteredHomeWorldTeams.slice(0, 16).map((wt) => (
                      <button
                        key={wt.id}
                        type="button"
                        onClick={() => handleSelectWorldHomeTeam(wt, wt.stadium)}
                        className="flex items-center gap-2 p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500 text-left transition"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex-shrink-0 border flex items-center justify-center overflow-hidden"
                          style={{ borderColor: wt.primaryColor }}
                        >
                          <img
                            src={wt.logo}
                            alt={wt.code}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-xs text-white block truncate">
                            {wt.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-sport-mono flex items-center gap-1">
                            <span style={{ color: wt.primaryColor }} className="font-bold">
                              {wt.code}
                            </span>
                            <span>•</span>
                            <span className="truncate">{wt.league}</span>
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Editable Fields for Home Team */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="sm:col-span-2">
                <label className="text-zinc-400 block mb-1">Club / Team Full Name</label>
                <input
                  type="text"
                  required
                  value={homeName}
                  onChange={(e) => setHomeName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">3-Letter Code</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={homeCode}
                  onChange={(e) => setHomeCode(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 font-sport-mono font-bold text-white text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Short Name</label>
                <input
                  type="text"
                  required
                  value={homeShort}
                  onChange={(e) => setHomeShort(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Primary Color</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={homeColor}
                    onChange={(e) => setHomeColor(e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={homeColor}
                    onChange={(e) => setHomeColor(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 font-sport-mono text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Formation</label>
                <select
                  value={homeFormation}
                  onChange={(e) => setHomeFormation(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-white"
                >
                  <option value="4-3-3">4-3-3</option>
                  <option value="4-2-3-1">4-2-3-1</option>
                  <option value="4-4-2">4-4-2</option>
                  <option value="3-4-3">3-4-3</option>
                  <option value="3-5-2">3-5-2</option>
                  <option value="4-1-4-1">4-1-4-1</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 text-xs">Team Crest / Logo URL</label>
              <input
                type="url"
                value={homeLogo}
                onChange={(e) => setHomeLogo(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-xs text-white"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* AWAY TEAM CARD WITH SEARCH & TYPEAHEAD */}
          {/* ========================================================= */}
          <div
            className="bg-zinc-950 p-4 rounded-xl border-2 space-y-4 shadow-xl"
            style={{ borderColor: awayColor }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block shadow"
                  style={{ backgroundColor: awayColor }}
                />
                <span className="font-bold text-sm uppercase font-sport-mono text-white">
                  AWAY TEAM CONFIG
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-sport-mono uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                ACTIVE: {match.awayTeam.code}
              </span>
            </div>

            {/* Smart Search & Instant Select Input */}
            <div className="relative">
              <label className="text-zinc-300 text-xs font-bold block mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-sky-400" />
                  <span>Search or Type ANY Team in the World:</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-normal">
                  60+ Global Clubs &amp; Nations
                </span>
              </label>

              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={awaySearchQuery}
                    onChange={(e) => {
                      setAwaySearchQuery(e.target.value);
                      setAwaySearchOpen(true);
                    }}
                    onFocus={() => setAwaySearchOpen(true)}
                    placeholder="Type name (e.g. Barcelona, Bayern, Juventus, Chelsea, or your team)..."
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-sky-500 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                  {awaySearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setAwaySearchQuery('');
                        setAwaySearchOpen(false);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setAwaySearchOpen(!awaySearchOpen)}
                  className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs text-zinc-300 flex items-center gap-1 font-sport-mono"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>Browse</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* Autocomplete Dropdown Panel */}
              {awaySearchOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-3 z-50 max-h-72 overflow-y-auto space-y-2">
                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1 pb-2 border-b border-zinc-800">
                    {leagueCategories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setAwayLeagueFilter(c.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-sport-mono font-bold transition ${
                          awayLeagueFilter === c.id
                            ? 'bg-sky-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  {/* Create Custom Team Action Button if typing */}
                  {awaySearchQuery.trim() && (
                    <button
                      type="button"
                      onClick={handleCreateCustomAway}
                      className="w-full flex items-center gap-2 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/50 hover:bg-emerald-900/60 text-left transition"
                    >
                      <Plus className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-emerald-300 block">
                          Use Custom Team: &quot;{awaySearchQuery}&quot;
                        </span>
                        <span className="text-[10px] text-zinc-400 block font-sport-mono">
                          Auto-generates clean 3-letter code, colors, and 11-man squad
                        </span>
                      </div>
                    </button>
                  )}

                  {/* Filtered Teams Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {filteredAwayWorldTeams.slice(0, 16).map((wt) => (
                      <button
                        key={wt.id}
                        type="button"
                        onClick={() => handleSelectWorldAwayTeam(wt)}
                        className="flex items-center gap-2 p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-sky-500 text-left transition"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex-shrink-0 border flex items-center justify-center overflow-hidden"
                          style={{ borderColor: wt.primaryColor }}
                        >
                          <img
                            src={wt.logo}
                            alt={wt.code}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-xs text-white block truncate">
                            {wt.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-sport-mono flex items-center gap-1">
                            <span style={{ color: wt.primaryColor }} className="font-bold">
                              {wt.code}
                            </span>
                            <span>•</span>
                            <span className="truncate">{wt.league}</span>
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Editable Fields for Away Team */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="sm:col-span-2">
                <label className="text-zinc-400 block mb-1">Club / Team Full Name</label>
                <input
                  type="text"
                  required
                  value={awayName}
                  onChange={(e) => setAwayName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">3-Letter Code</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={awayCode}
                  onChange={(e) => setAwayCode(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 font-sport-mono font-bold text-white text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Short Name</label>
                <input
                  type="text"
                  required
                  value={awayShort}
                  onChange={(e) => setAwayShort(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Primary Color</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={awayColor}
                    onChange={(e) => setAwayColor(e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={awayColor}
                    onChange={(e) => setAwayColor(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 font-sport-mono text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Formation</label>
                <select
                  value={awayFormation}
                  onChange={(e) => setAwayFormation(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-white"
                >
                  <option value="4-3-3">4-3-3</option>
                  <option value="4-2-3-1">4-2-3-1</option>
                  <option value="4-4-2">4-4-2</option>
                  <option value="3-4-3">3-4-3</option>
                  <option value="3-5-2">3-5-2</option>
                  <option value="4-1-4-1">4-1-4-1</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 text-xs">Team Crest / Logo URL</label>
              <input
                type="url"
                value={awayLogo}
                onChange={(e) => setAwayLogo(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-xs text-white"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* MATCH DETAILS & STADIUM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1">Competition / League</label>
            <input
              type="text"
              value={competition}
              onChange={(e) => setCompetition(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-white font-sport-mono"
            />
          </div>
          <div>
            <label className="text-zinc-400 block mb-1">Season</label>
            <input
              type="text"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-white font-sport-mono"
            />
          </div>
          <div>
            <label className="text-zinc-400 block mb-1">Stadium Venue</label>
            <input
              type="text"
              value={stadium}
              onChange={(e) => setStadium(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-white font-sport-mono"
            />
          </div>
          <div>
            <label className="text-zinc-400 block mb-1">Match Referee</label>
            <input
              type="text"
              value={referee}
              onChange={(e) => setReferee(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1.5 text-white font-sport-mono"
            />
          </div>
        </div>

        {/* SCORE & STATS CALIBRATION */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
          <span className="text-xs font-sport-mono uppercase text-zinc-400 font-bold block">
            Live Score &amp; Stats Calibration:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sport-mono">
            {/* Score */}
            <div className="flex items-center gap-3 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: homeColor }}>
                  {homeCode}:
                </span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={homeScore}
                  onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                  className="w-14 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-center font-bold text-white text-base"
                />
              </div>
              <span className="text-zinc-500 font-bold">-</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={awayScore}
                  onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                  className="w-14 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-center font-bold text-white text-base"
                />
                <span className="font-bold" style={{ color: awayColor }}>
                  {awayCode}
                </span>
              </div>
            </div>

            {/* Possession Slider */}
            <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
              <div className="flex justify-between mb-1">
                <span style={{ color: homeColor }}>
                  {homeCode}: {possessionHome}%
                </span>
                <span style={{ color: awayColor }}>
                  {awayCode}: {100 - possessionHome}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={possessionHome}
                onChange={(e) => setPossessionHome(parseInt(e.target.value) || 50)}
                className="w-full accent-red-500"
              />
            </div>

            {/* Shots */}
            <div className="flex items-center gap-2 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-zinc-400">Shots:</span>
              <input
                type="number"
                min="0"
                value={shotsHome}
                onChange={(e) => setShotsHome(parseInt(e.target.value) || 0)}
                className="w-12 bg-zinc-950 border border-zinc-700 rounded px-1.5 py-1 text-center text-white"
              />
              <span className="text-zinc-500">vs</span>
              <input
                type="number"
                min="0"
                value={shotsAway}
                onChange={(e) => setShotsAway(parseInt(e.target.value) || 0)}
                className="w-12 bg-zinc-950 border border-zinc-700 rounded px-1.5 py-1 text-center text-white"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-sport-mono font-bold animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Applied dynamically to all live broadcast screens!</span>
            </span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 font-sport-mono text-sm font-bold text-white transition shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Apply Dynamic Match &amp; Team Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
