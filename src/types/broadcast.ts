export type MatchStatus = 
  | 'UPCOMING'
  | '1ST_HALF'
  | 'HALF_TIME'
  | '2ND_HALF'
  | 'EXTRA_TIME'
  | 'PENALTIES'
  | 'FULL_TIME';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  formation: string; // e.g. '4-3-3', '4-2-3-1'
}

export type PlayerPosition = 'GK' | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB' | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM' | 'LW' | 'RW' | 'CF' | 'ST';

export interface Player {
  id: string;
  teamId: string;
  name: string;
  shortName: string;
  number: number;
  position: PlayerPosition;
  nationality: string;
  age: number;
  photo: string;
  rating: number; // 0.0 - 10.0
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  isStarter: boolean;
  pitchX: number; // 0 - 100 percentage
  pitchY: number; // 0 - 100 percentage
  targetX?: number; // For tactical animation
  targetY?: number;
}

export type EventType =
  | 'GOAL'
  | 'OWN_GOAL'
  | 'PENALTY_GOAL'
  | 'PENALTY_MISSED'
  | 'YELLOW_CARD'
  | 'SECOND_YELLOW'
  | 'RED_CARD'
  | 'SUBSTITUTION'
  | 'VAR_CHECK'
  | 'INJURY'
  | 'CORNER'
  | 'OFFSIDE'
  | 'SAVE'
  | 'SHOT_ON_TARGET';

export interface MatchEvent {
  id: string;
  type: EventType;
  minute: number;
  extraMinute?: number;
  teamId: string;
  playerId?: string;
  assistPlayerId?: string;
  subInPlayerId?: string;
  description: string;
  timestamp: number;
}

export interface MatchStats {
  possession: [number, number]; // [home, away] e.g. [58, 42]
  shots: [number, number];
  shotsOnTarget: [number, number];
  shotsOffTarget: [number, number];
  blockedShots: [number, number];
  corners: [number, number];
  fouls: [number, number];
  offsides: [number, number];
  saves: [number, number];
  passes: [number, number];
  passAccuracy: [number, number]; // [88, 81] %
  tackles: [number, number];
  interceptions: [number, number];
  clearances: [number, number];
  dangerousAttacks: [number, number];
  attacks: [number, number];
  dataSource: 'ADMIN_MANUAL' | 'API_FOOTBALL_VERIFIED' | 'ESTIMATED_SIMULATION';
  lastUpdated: string;
  momentumDuration?: number; // Configurable timeline duration in minutes (e.g. 90, 95, 100, 105, 120+)
}

export interface MomentumPoint {
  minute: number;
  homePressure: number; // 0 - 100
  awayPressure: number; // 0 - 100
  dominantTeam: 'home' | 'away' | 'neutral';
  isDangerous: boolean;
  eventIcon?: string;
  eventDescription?: string;
}

export interface TacticalPath {
  id: string;
  type: 'PASS' | 'RUN' | 'PRESS' | 'SHOT';
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  teamId: string;
  label?: string;
}

export interface ActiveGraphic {
  id: string;
  type: 
    | 'SCOREBOARD'
    | 'GOAL_CELEBRATION'
    | 'CARD_ALERT'
    | 'SUBSTITUTION_ALERT'
    | 'STARTING_XI'
    | 'TEAM_FORMATION'
    | 'PLAYER_PROFILE'
    | 'PLAYER_COMPARISON'
    | 'MATCH_STATS'
    | 'MOMENTUM_CHART'
    | 'TACTICAL_PITCH'
    | 'MATCH_TIMELINE'
    | 'HALF_TIME_SUMMARY'
    | 'FULL_TIME_SUMMARY'
    | 'SPONSOR_BANNER'
    | 'NEWS_TICKER';
  visible: boolean;
  duration?: number; // seconds, 0 = persistent
  data?: any;
}

export interface ClockState {
  seconds: number; // total match seconds elapsed in current half
  isRunning: boolean;
  half: MatchStatus;
  addedTime: number; // e.g. 4 for +4 mins
  lastSyncTimestamp: number;
}

export interface MatchDetails {
  id: string;
  competition: string;
  season: string;
  date: string;
  kickoffTime: string;
  stadium: string;
  referee: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  homePenalties?: number;
  awayPenalties?: number;
  status: MatchStatus;
}

export interface ApiSyncSettings {
  provider: 'api-football' | 'sportscore' | 'football-data' | 'manual';
  apiKeyMasked: string;
  refreshInterval: number; // seconds
  autoSync: boolean;
  connectionStatus: 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'ERROR';
  lastSyncTime?: string;
  lastError?: string;
  selectedFixtureId?: string;
  dataPriority: 'MANUAL_OVERRIDE' | 'API_VERIFIED_FIRST';
}

export interface BroadcastState {
  match: MatchDetails;
  clock: ClockState;
  players: Player[];
  events: MatchEvent[];
  stats: MatchStats;
  momentum: MomentumPoint[];
  tactical: {
    ball: { x: number; y: number };
    possessionTeamId: string;
    attackingDirection: 'LEFT_TO_RIGHT' | 'RIGHT_TO_LEFT';
    paths: TacticalPath[];
    showHeatmap: boolean;
    showPlayerNames: boolean;
    showRatings: boolean;
    showPassingLines: boolean;
    orientation: 'landscape' | 'portrait';
    isPlayingMovement: boolean;
    animationSpeed: number; // 0.5, 1.0, 1.5, 2.0
    trackingDataSource: 'ADMIN_MANUAL_TACTICAL' | 'VERIFIED_COORDINATES_PROVIDER';
  };
  graphics: {
    scoreboard: boolean;
    ticker: boolean;
    tickerText: string;
    sponsorBanner: boolean;
    sponsorName: string;
    tacticalRadar?: boolean;
    tacticalRadarPosition?: 'bottom-right' | 'top-right' | 'bottom-left';
    activePopup?: ActiveGraphic | null;
  };
  api: ApiSyncSettings;
}
