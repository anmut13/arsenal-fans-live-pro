import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  BroadcastState,
  MatchDetails,
  ClockState,
  Player,
  MatchEvent,
  MatchStats,
  ActiveGraphic,
  MomentumPoint,
  Team,
} from '../types/broadcast';
import { buildInitialState, generateSquadForTeam } from '../data/initialMatchData';
import { calculateMatchMomentum, getFormationCoordinates } from '../utils/broadcastLogic';
import { broadcastAudio } from '../utils/broadcastAudio';

interface BroadcastContextType {
  state: BroadcastState;
  updateMatch: (patch: Partial<MatchDetails>) => void;
  updateClock: (patch: Partial<ClockState>) => void;
  startClock: () => void;
  pauseClock: () => void;
  resetClock: () => void;
  addClockMinutes: (mins: number) => void;
  setMatchPeriod: (period: MatchDetails['status']) => void;
  updatePlayer: (id: string, patch: Partial<Player>) => void;
  addPlayer: (player: Player) => void;
  deletePlayer: (id: string) => void;
  updatePlayerCoords: (id: string, x: number, y: number) => void;
  applyFormation: (teamId: string, formation: string) => void;
  updateStats: (patch: Partial<MatchStats>) => void;
  addEvent: (eventData: Omit<MatchEvent, 'id' | 'timestamp'>) => void;
  deleteEvent: (id: string) => void;
  setBallPosition: (x: number, y: number) => void;
  updateTactical: (patch: Partial<BroadcastState['tactical']>) => void;
  updateGraphics: (patch: Partial<BroadcastState['graphics']>) => void;
  showPopupGraphic: (type: ActiveGraphic['type'], data?: any, durationSec?: number) => void;
  hidePopupGraphic: () => void;
  updateApiSettings: (patch: Partial<BroadcastState['api']>) => void;
  resetToDemo: () => void;
  changeHomeTeam: (team: Team, reloadSquad?: boolean) => void;
  changeAwayTeam: (team: Team, reloadSquad?: boolean) => void;
  swapTeams: () => void;
  loadMatchPreset: (homeTeam: Team, awayTeam: Team, competition?: string, stadium?: string) => void;
  regenerateSquad: (isHome: boolean) => void;
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
}

export function sanitizePlayers(players: Player[]): Player[] {
  if (!Array.isArray(players)) return [];
  const seen = new Set<string>();
  return players.map((p, idx) => {
    let id = p.id;
    if (!id || seen.has(id)) {
      id = `${id || (p.teamId ? p.teamId.toLowerCase() : 'ply')}-${idx}`;
    }
    seen.add(id);
    return id !== p.id ? { ...p, id } : p;
  });
}

const STORAGE_KEY = 'arsenal_fans_live_state_v1';
const BroadcastContext = createContext<BroadcastContextType | null>(null);

export const BroadcastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BroadcastState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.players)) {
            parsed.players = sanitizePlayers(parsed.players);
          }
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to load stored broadcast state, using initial state:', e);
      }
    }
    return buildInitialState();
  });

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync to other tabs / OBS Browser sources
  const broadcastSync = useCallback((newState: BroadcastState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type: 'STATE_UPDATE', payload: newState });
      }
    } catch (e) {
      console.warn('Sync failed:', e);
    }
  }, []);

  const setAndSyncState = useCallback(
    (updater: (prev: BroadcastState) => BroadcastState) => {
      setState((prev) => {
        const updated = updater(prev);
        if (updated && Array.isArray(updated.players)) {
          updated.players = sanitizePlayers(updated.players);
        }
        broadcastSync(updated);
        return updated;
      });
    },
    [broadcastSync]
  );

  // Initialize BroadcastChannel & storage listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('arsenal_fans_live_channel');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'STATE_UPDATE' && event.data.payload) {
          setState(event.data.payload);
        }
      };

      const handleStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            setState(parsed);
          } catch (err) {
            console.error('Storage sync error:', err);
          }
        }
      };
      window.addEventListener('storage', handleStorage);

      return () => {
        channel.close();
        window.removeEventListener('storage', handleStorage);
      };
    }
  }, []);

  // Match clock ticker (second by second)
  useEffect(() => {
    if (!state.clock.isRunning) return;

    const interval = setInterval(() => {
      setAndSyncState((prev) => ({
        ...prev,
        clock: {
          ...prev.clock,
          seconds: prev.clock.seconds + 1,
          lastSyncTimestamp: Date.now(),
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [state.clock.isRunning, setAndSyncState]);

  // Tactical animated movement ticker (smooth interpolated movement)
  useEffect(() => {
    if (!state.tactical.isPlayingMovement) return;

    const interval = setInterval(() => {
      setState((prev) => {
        // Slightly bounce/move target players along their attacking runs
        const updatedPlayers = prev.players.map((p) => {
          if (!p.isStarter) return p;
          const deltaX = (Math.random() - 0.5) * 0.8 * prev.tactical.animationSpeed;
          const deltaY = (Math.random() - 0.5) * 0.8 * prev.tactical.animationSpeed;
          return {
            ...p,
            pitchX: Math.min(96, Math.max(4, p.pitchX + deltaX)),
            pitchY: Math.min(94, Math.max(6, p.pitchY + deltaY)),
          };
        });

        // Ball moves slightly towards active play
        const ballDeltaX = (Math.random() - 0.48) * 1.5 * prev.tactical.animationSpeed;
        const ballDeltaY = (Math.random() - 0.5) * 1.5 * prev.tactical.animationSpeed;
        const newBall = {
          x: Math.min(94, Math.max(6, prev.tactical.ball.x + ballDeltaX)),
          y: Math.min(92, Math.max(8, prev.tactical.ball.y + ballDeltaY)),
        };

        return {
          ...prev,
          players: updatedPlayers,
          tactical: {
            ...prev.tactical,
            ball: newBall,
          },
        };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [state.tactical.isPlayingMovement, state.tactical.animationSpeed]);

  const toggleAudioMute = useCallback(() => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      broadcastAudio.setMuted(next);
      return next;
    });
  }, []);

  const updateMatch = useCallback((patch: Partial<MatchDetails>) => {
    setAndSyncState((prev) => ({
      ...prev,
      match: { ...prev.match, ...patch },
    }));
  }, [setAndSyncState]);

  const updateClock = useCallback((patch: Partial<ClockState>) => {
    setAndSyncState((prev) => ({
      ...prev,
      clock: { ...prev.clock, ...patch },
    }));
  }, [setAndSyncState]);

  const startClock = useCallback(() => {
    broadcastAudio.playWhistle();
    updateClock({ isRunning: true });
  }, [updateClock]);

  const pauseClock = useCallback(() => {
    broadcastAudio.playWhistle();
    updateClock({ isRunning: false });
  }, [updateClock]);

  const resetClock = useCallback(() => {
    updateClock({ seconds: 0, isRunning: false });
  }, [updateClock]);

  const addClockMinutes = useCallback((mins: number) => {
    setAndSyncState((prev) => ({
      ...prev,
      clock: {
        ...prev.clock,
        seconds: Math.max(0, prev.clock.seconds + mins * 60),
      },
    }));
  }, [setAndSyncState]);

  const setMatchPeriod = useCallback((period: MatchDetails['status']) => {
    broadcastAudio.playWhistle();
    setAndSyncState((prev) => {
      let seconds = prev.clock.seconds;
      if (period === '1ST_HALF' && seconds < 1) seconds = 0;
      else if (period === 'HALF_TIME') seconds = 45 * 60;
      else if (period === '2ND_HALF' && seconds < 45 * 60) seconds = 45 * 60;
      else if (period === 'FULL_TIME') seconds = 90 * 60;

      return {
        ...prev,
        match: { ...prev.match, status: period },
        clock: { ...prev.clock, half: period, seconds },
      };
    });
  }, [setAndSyncState]);

  const updatePlayer = useCallback((id: string, patch: Partial<Player>) => {
    setAndSyncState((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, [setAndSyncState]);

  const addPlayer = useCallback((player: Player) => {
    setAndSyncState((prev) => ({
      ...prev,
      players: [...prev.players, player],
    }));
  }, [setAndSyncState]);

  const deletePlayer = useCallback((id: string) => {
    setAndSyncState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
    }));
  }, [setAndSyncState]);

  const updatePlayerCoords = useCallback((id: string, x: number, y: number) => {
    setAndSyncState((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === id ? { ...p, pitchX: x, pitchY: y } : p)),
    }));
  }, [setAndSyncState]);

  const applyFormation = useCallback((teamId: string, formation: string) => {
    setAndSyncState((prev) => {
      const isHome = teamId === prev.match.homeTeam.id;
      const slots = getFormationCoordinates(formation, isHome);
      const teamPlayers = prev.players.filter((p) => p.teamId === teamId && p.isStarter);

      const updatedPlayers = prev.players.map((p) => {
        if (p.teamId === teamId && p.isStarter) {
          const index = teamPlayers.findIndex((tp) => tp.id === p.id);
          if (index >= 0 && slots[index]) {
            return {
              ...p,
              position: slots[index].position,
              pitchX: slots[index].x,
              pitchY: slots[index].y,
            };
          }
        }
        return p;
      });

      const updatedTeam = isHome
        ? { ...prev.match.homeTeam, formation }
        : { ...prev.match.awayTeam, formation };

      return {
        ...prev,
        players: updatedPlayers,
        match: {
          ...prev.match,
          homeTeam: isHome ? updatedTeam : prev.match.homeTeam,
          awayTeam: !isHome ? updatedTeam : prev.match.awayTeam,
        },
      };
    });
  }, [setAndSyncState]);

  const updateStats = useCallback((patch: Partial<MatchStats>) => {
    setAndSyncState((prev) => {
      const newStats = { ...prev.stats, ...patch, lastUpdated: new Date().toLocaleTimeString() };
      const currentMin = Math.floor(prev.clock.seconds / 60);
      const newMomentum = calculateMatchMomentum(prev.events, newStats, currentMin);
      return {
        ...prev,
        stats: newStats,
        momentum: newMomentum,
      };
    });
  }, [setAndSyncState]);

  const showPopupGraphic = useCallback(
    (type: ActiveGraphic['type'], data?: any, durationSec = 8) => {
      broadcastAudio.playGraphicAlert();
      if (type === 'GOAL_CELEBRATION') {
        broadcastAudio.playGoalFanfare();
      }

      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
        popupTimeoutRef.current = null;
      }

      setAndSyncState((prev) => ({
        ...prev,
        graphics: {
          ...prev.graphics,
          activePopup: {
            id: `popup-${Date.now()}`,
            type,
            visible: true,
            duration: durationSec,
            data,
          },
        },
      }));

      if (durationSec > 0) {
        popupTimeoutRef.current = setTimeout(() => {
          setAndSyncState((prev) => ({
            ...prev,
            graphics: {
              ...prev.graphics,
              activePopup: null,
            },
          }));
        }, durationSec * 1000);
      }
    },
    [setAndSyncState]
  );

  const hidePopupGraphic = useCallback(() => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }
    setAndSyncState((prev) => ({
      ...prev,
      graphics: {
        ...prev.graphics,
        activePopup: null,
      },
    }));
  }, [setAndSyncState]);

  const addEvent = useCallback(
    (eventData: Omit<MatchEvent, 'id' | 'timestamp'>) => {
      const newEvent: MatchEvent = {
        ...eventData,
        id: `evt-${Date.now()}`,
        timestamp: Date.now(),
      };

      setAndSyncState((prev) => {
        const newEvents = [newEvent, ...prev.events];
        let newHomeScore = prev.match.homeScore;
        let newAwayScore = prev.match.awayScore;

        if (newEvent.type === 'GOAL' || newEvent.type === 'PENALTY_GOAL') {
          if (newEvent.teamId === prev.match.homeTeam.id) {
            newHomeScore += 1;
          } else {
            newAwayScore += 1;
          }
        } else if (newEvent.type === 'OWN_GOAL') {
          // If home scores own goal, away gets point
          if (newEvent.teamId === prev.match.homeTeam.id) {
            newAwayScore += 1;
          } else {
            newHomeScore += 1;
          }
        }

        const currentMin = Math.floor(prev.clock.seconds / 60);
        const newMomentum = calculateMatchMomentum(newEvents, prev.stats, currentMin);

        return {
          ...prev,
          events: newEvents,
          match: {
            ...prev.match,
            homeScore: newHomeScore,
            awayScore: newAwayScore,
          },
          momentum: newMomentum,
        };
      });

      // Auto trigger broadcast alert based on event
      if (newEvent.type === 'GOAL' || newEvent.type === 'PENALTY_GOAL' || newEvent.type === 'OWN_GOAL') {
        showPopupGraphic('GOAL_CELEBRATION', newEvent, 9);
      } else if (newEvent.type === 'YELLOW_CARD' || newEvent.type === 'RED_CARD' || newEvent.type === 'SECOND_YELLOW') {
        showPopupGraphic('CARD_ALERT', newEvent, 7);
      } else if (newEvent.type === 'SUBSTITUTION') {
        showPopupGraphic('SUBSTITUTION_ALERT', newEvent, 7);
      }
    },
    [setAndSyncState, showPopupGraphic]
  );

  const deleteEvent = useCallback((id: string) => {
    setAndSyncState((prev) => {
      const target = prev.events.find((e) => e.id === id);
      let newHomeScore = prev.match.homeScore;
      let newAwayScore = prev.match.awayScore;

      if (target && (target.type === 'GOAL' || target.type === 'PENALTY_GOAL')) {
        if (target.teamId === prev.match.homeTeam.id) newHomeScore = Math.max(0, newHomeScore - 1);
        else newAwayScore = Math.max(0, newAwayScore - 1);
      }

      const newEvents = prev.events.filter((e) => e.id !== id);
      const currentMin = Math.floor(prev.clock.seconds / 60);
      const newMomentum = calculateMatchMomentum(newEvents, prev.stats, currentMin);

      return {
        ...prev,
        events: newEvents,
        match: {
          ...prev.match,
          homeScore: newHomeScore,
          awayScore: newAwayScore,
        },
        momentum: newMomentum,
      };
    });
  }, [setAndSyncState]);

  const setBallPosition = useCallback((x: number, y: number) => {
    setAndSyncState((prev) => ({
      ...prev,
      tactical: {
        ...prev.tactical,
        ball: { x, y },
      },
    }));
  }, [setAndSyncState]);

  const updateTactical = useCallback((patch: Partial<BroadcastState['tactical']>) => {
    setAndSyncState((prev) => ({
      ...prev,
      tactical: { ...prev.tactical, ...patch },
    }));
  }, [setAndSyncState]);

  const updateGraphics = useCallback((patch: Partial<BroadcastState['graphics']>) => {
    setAndSyncState((prev) => ({
      ...prev,
      graphics: { ...prev.graphics, ...patch },
    }));
  }, [setAndSyncState]);

  const updateApiSettings = useCallback((patch: Partial<BroadcastState['api']>) => {
    setAndSyncState((prev) => ({
      ...prev,
      api: { ...prev.api, ...patch },
    }));
  }, [setAndSyncState]);

  const changeHomeTeam = useCallback((team: Team, reloadSquad: boolean = true) => {
    setAndSyncState((prev) => {
      let updatedPlayers = prev.players;
      if (reloadSquad) {
        const awayPlayers = prev.players.filter((p) => p.teamId === prev.match.awayTeam.id);
        const newHomeSquad = generateSquadForTeam(team, true);
        updatedPlayers = [...newHomeSquad, ...awayPlayers];
      } else {
        updatedPlayers = prev.players.map((p) =>
          p.teamId === prev.match.homeTeam.id ? { ...p, teamId: team.id } : p
        );
      }
      const currentMin = Math.floor(prev.clock.seconds / 60);
      const newMomentum = calculateMatchMomentum(prev.events, prev.stats, currentMin, team.id);

      return {
        ...prev,
        match: {
          ...prev.match,
          homeTeam: team,
        },
        players: updatedPlayers,
        momentum: newMomentum,
      };
    });
  }, [setAndSyncState]);

  const changeAwayTeam = useCallback((team: Team, reloadSquad: boolean = true) => {
    setAndSyncState((prev) => {
      let updatedPlayers = prev.players;
      if (reloadSquad) {
        const homePlayers = prev.players.filter((p) => p.teamId === prev.match.homeTeam.id);
        const newAwaySquad = generateSquadForTeam(team, false);
        updatedPlayers = [...homePlayers, ...newAwaySquad];
      } else {
        updatedPlayers = prev.players.map((p) =>
          p.teamId === prev.match.awayTeam.id ? { ...p, teamId: team.id } : p
        );
      }
      return {
        ...prev,
        match: {
          ...prev.match,
          awayTeam: team,
        },
        players: updatedPlayers,
      };
    });
  }, [setAndSyncState]);

  const swapTeams = useCallback(() => {
    setAndSyncState((prev) => {
      const oldHome = prev.match.homeTeam;
      const oldAway = prev.match.awayTeam;
      const oldHomeScore = prev.match.homeScore;
      const oldAwayScore = prev.match.awayScore;

      // Invert coordinates for existing starters
      const updatedPlayers = prev.players.map((p) => {
        if (!p.isStarter) return p;
        return {
          ...p,
          pitchX: Number((100 - p.pitchX).toFixed(1)),
        };
      });

      const swappedStats: MatchStats = {
        ...prev.stats,
        possession: [prev.stats.possession[1], prev.stats.possession[0]],
        shots: [prev.stats.shots[1], prev.stats.shots[0]],
        shotsOnTarget: [prev.stats.shotsOnTarget[1], prev.stats.shotsOnTarget[0]],
        shotsOffTarget: [prev.stats.shotsOffTarget[1], prev.stats.shotsOffTarget[0]],
        blockedShots: [prev.stats.blockedShots[1], prev.stats.blockedShots[0]],
        corners: [prev.stats.corners[1], prev.stats.corners[0]],
        fouls: [prev.stats.fouls[1], prev.stats.fouls[0]],
        offsides: [prev.stats.offsides[1], prev.stats.offsides[0]],
        saves: [prev.stats.saves[1], prev.stats.saves[0]],
        passes: [prev.stats.passes[1], prev.stats.passes[0]],
        passAccuracy: [prev.stats.passAccuracy[1], prev.stats.passAccuracy[0]],
        tackles: [prev.stats.tackles[1], prev.stats.tackles[0]],
        interceptions: [prev.stats.interceptions[1], prev.stats.interceptions[0]],
        clearances: [prev.stats.clearances[1], prev.stats.clearances[0]],
        dangerousAttacks: [prev.stats.dangerousAttacks[1], prev.stats.dangerousAttacks[0]],
        attacks: [prev.stats.attacks[1], prev.stats.attacks[0]],
      };

      const currentMin = Math.floor(prev.clock.seconds / 60);
      const newMomentum = calculateMatchMomentum(prev.events, swappedStats, currentMin, oldAway.id);

      return {
        ...prev,
        match: {
          ...prev.match,
          homeTeam: oldAway,
          awayTeam: oldHome,
          homeScore: oldAwayScore,
          awayScore: oldHomeScore,
        },
        stats: swappedStats,
        players: updatedPlayers,
        momentum: newMomentum,
      };
    });
  }, [setAndSyncState]);

  const loadMatchPreset = useCallback(
    (homeTeam: Team, awayTeam: Team, competition?: string, stadium?: string) => {
      setAndSyncState((prev) => {
        const homeSquad = generateSquadForTeam(homeTeam, true);
        const awaySquad = generateSquadForTeam(awayTeam, false);
        const currentMin = Math.floor(prev.clock.seconds / 60);
        const newMomentum = calculateMatchMomentum([], prev.stats, currentMin, homeTeam.id);

        return {
          ...prev,
          match: {
            ...prev.match,
            homeTeam,
            awayTeam,
            homeScore: 0,
            awayScore: 0,
            competition: competition || prev.match.competition,
            stadium: stadium || `${homeTeam.name} Stadium`,
          },
          players: [...homeSquad, ...awaySquad],
          events: [],
          momentum: newMomentum,
          graphics: {
            ...prev.graphics,
            tickerText: `MATCHDAY LIVE • ${homeTeam.name.toUpperCase()} VS ${awayTeam.name.toUpperCase()} • ${stadium || homeTeam.name + ' Stadium'} • LIVE BROADCAST`,
            activePopup: null,
          },
        };
      });
    },
    [setAndSyncState]
  );

  const regenerateSquad = useCallback(
    (isHome: boolean) => {
      setAndSyncState((prev) => {
        const targetTeam = isHome ? prev.match.homeTeam : prev.match.awayTeam;
        const otherTeamId = isHome ? prev.match.awayTeam.id : prev.match.homeTeam.id;
        const otherPlayers = prev.players.filter((p) => p.teamId === otherTeamId);
        const newSquad = generateSquadForTeam(targetTeam, isHome);
        return {
          ...prev,
          players: [...otherPlayers, ...newSquad],
        };
      });
    },
    [setAndSyncState]
  );

  const resetToDemo = useCallback(() => {
    const demo = buildInitialState();
    setAndSyncState(() => demo);
  }, [setAndSyncState]);

  return (
    <BroadcastContext.Provider
      value={{
        state,
        updateMatch,
        updateClock,
        startClock,
        pauseClock,
        resetClock,
        addClockMinutes,
        setMatchPeriod,
        updatePlayer,
        addPlayer,
        deletePlayer,
        updatePlayerCoords,
        applyFormation,
        updateStats,
        addEvent,
        deleteEvent,
        setBallPosition,
        updateTactical,
        updateGraphics,
        showPopupGraphic,
        hidePopupGraphic,
        updateApiSettings,
        resetToDemo,
        changeHomeTeam,
        changeAwayTeam,
        swapTeams,
        loadMatchPreset,
        regenerateSquad,
        isAudioMuted,
        toggleAudioMute,
      }}
    >
      {children}
    </BroadcastContext.Provider>
  );
};

export const useBroadcast = () => {
  const context = useContext(BroadcastContext);
  if (!context) {
    throw new Error('useBroadcast must be used within a BroadcastProvider');
  }
  return context;
};
