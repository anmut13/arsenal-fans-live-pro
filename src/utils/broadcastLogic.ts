import { ClockState, MatchEvent, MatchStats, MomentumPoint, PlayerPosition } from '../types/broadcast';

/**
 * Formats match clock seconds into broadcast television display string.
 * Example:
 * 1st Half: 0 - 2700s -> '00:00' to '45:00' (or '45:00 +2' if added time)
 * 2nd Half: 2700 - 5400s -> '45:00' to '90:00' (or '90:00 +4' if added time)
 */
export function formatMatchClock(clock: ClockState): {
  display: string;
  periodLabel: string;
  isStoppage: boolean;
} {
  const totalSeconds = Math.max(0, clock.seconds);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  let periodLabel = 'PRE-MATCH';
  let isStoppage = false;
  let display = '00:00';

  switch (clock.half) {
    case 'UPCOMING':
      periodLabel = 'KICK-OFF';
      display = '00:00';
      break;

    case '1ST_HALF':
      periodLabel = '1ST HALF';
      if (totalMinutes >= 45) {
        isStoppage = true;
        const extraMins = totalMinutes - 45;
        const extraSecs = remainingSeconds;
        display = `45:00 +${extraMins}:${pad(extraSecs)}`;
      } else {
        display = `${pad(totalMinutes)}:${pad(remainingSeconds)}`;
      }
      break;

    case 'HALF_TIME':
      periodLabel = 'HALF TIME';
      display = '45:00';
      break;

    case '2ND_HALF':
      periodLabel = '2ND HALF';
      if (totalMinutes >= 90) {
        isStoppage = true;
        const extraMins = totalMinutes - 90;
        const extraSecs = remainingSeconds;
        display = `90:00 +${extraMins}:${pad(extraSecs)}`;
      } else {
        display = `${pad(totalMinutes)}:${pad(remainingSeconds)}`;
      }
      break;

    case 'EXTRA_TIME':
      periodLabel = 'EXTRA TIME';
      display = `${pad(totalMinutes)}:${pad(remainingSeconds)}`;
      break;

    case 'PENALTIES':
      periodLabel = 'PENALTIES';
      display = 'AET';
      break;

    case 'FULL_TIME':
      periodLabel = 'FULL TIME';
      display = '90:00';
      break;
  }

  return { display, periodLabel, isStoppage };
}

/**
 * Calculates ratings color codes based on player performance.
 * Rating badges mimic professional broadcast design (green >= 7.5, gold >= 8.5, etc.)
 */
export function getRatingBadgeStyle(rating: number): {
  bgColor: string;
  textColor: string;
  borderColor: string;
  label: string;
} {
  if (rating >= 8.5) {
    return {
      bgColor: 'bg-gradient-to-r from-amber-400 to-amber-600',
      textColor: 'text-zinc-950 font-bold',
      borderColor: 'border-amber-300',
      label: 'EXCEPTIONAL',
    };
  }
  if (rating >= 7.5) {
    return {
      bgColor: 'bg-gradient-to-r from-emerald-500 to-emerald-700',
      textColor: 'text-white font-bold',
      borderColor: 'border-emerald-400',
      label: 'GREAT',
    };
  }
  if (rating >= 6.5) {
    return {
      bgColor: 'bg-gradient-to-r from-teal-600 to-teal-800',
      textColor: 'text-white font-semibold',
      borderColor: 'border-teal-500',
      label: 'SOLID',
    };
  }
  if (rating >= 6.0) {
    return {
      bgColor: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
      textColor: 'text-yellow-100',
      borderColor: 'border-yellow-500',
      label: 'AVERAGE',
    };
  }
  return {
    bgColor: 'bg-gradient-to-r from-rose-700 to-rose-900',
    textColor: 'text-rose-100',
    borderColor: 'border-rose-500',
    label: 'POOR',
  };
}

/**
 * Calculates mathematical match momentum timeline points across 90 or over 90 minutes.
 * Supports configurable duration as admin wants (e.g. 90, 95, 100, 105, 120+ minutes).
 * Integrates dangerous attacks, shots, corners, and goals.
 */
export function calculateMatchMomentum(
  events: MatchEvent[],
  stats: MatchStats,
  currentMinute: number,
  homeTeamId: string = 'arsenal',
  customDuration?: number
): MomentumPoint[] {
  const points: MomentumPoint[] = [];
  const configuredDuration = customDuration || stats.momentumDuration || 90;
  const maxMinute = Math.max(10, Math.max(configuredDuration, currentMinute));

  // Base balance from overall possession & dangerous attacks
  const homeRatio = stats.possession[0] / (stats.possession[0] + stats.possession[1] || 1);
  const homeAttacksRatio = stats.dangerousAttacks[0] / (stats.dangerousAttacks[0] + stats.dangerousAttacks[1] || 1);

  for (let m = 1; m <= maxMinute; m += 2) {
    // Check events within 5 minutes of minute m
    const recentEvents = events.filter((e) => Math.abs(e.minute - m) <= 4);
    
    let homeEventWeight = 0;
    let awayEventWeight = 0;
    let isDangerous = false;
    let eventIcon: string | undefined;
    let eventDescription: string | undefined;

    for (const evt of recentEvents) {
      const isHome = evt.teamId === homeTeamId;
      let weight = 0;
      if (evt.type === 'GOAL' || evt.type === 'PENALTY_GOAL') {
        weight = 40;
        eventIcon = '⚽';
        eventDescription = `Goal: ${evt.description}`;
        isDangerous = true;
      } else if (evt.type === 'SHOT_ON_TARGET') {
        weight = 20;
        isDangerous = true;
      } else if (evt.type === 'CORNER') {
        weight = 12;
      } else if (evt.type === 'RED_CARD') {
        weight = -25; // hurting the team with red card
      }

      if (isHome) {
        homeEventWeight += weight;
      } else {
        awayEventWeight += weight;
      }
    }

    // Smooth sinusoidal game flow wave adapted to total match duration
    const wave = Math.sin((m / maxMinute) * Math.PI * 5) * 15;
    const homeBase = 50 + (homeRatio - 0.5) * 30 + (homeAttacksRatio - 0.5) * 20 + wave;

    let homePressure = Math.min(100, Math.max(0, homeBase + homeEventWeight - awayEventWeight));
    let awayPressure = 100 - homePressure;

    let dominantTeam: 'home' | 'away' | 'neutral' = 'neutral';
    if (homePressure > 56) dominantTeam = 'home';
    else if (awayPressure > 56) dominantTeam = 'away';

    points.push({
      minute: m,
      homePressure: Math.round(homePressure),
      awayPressure: Math.round(awayPressure),
      dominantTeam,
      isDangerous: isDangerous || homePressure > 78 || awayPressure > 78,
      eventIcon,
      eventDescription,
    });
  }

  return points;
}

/**
 * Tactical Formation coordinate templates (0 - 100 pitch coordinates).
 * For Arsenal (attacking left-to-right on standard landscape pitch):
 * x: 0 = goal line (GK), 100 = opposition goal
 * y: 0 = top touchline, 100 = bottom touchline
 */
export interface FormationSlot {
  position: PlayerPosition;
  x: number;
  y: number;
  nameHint: string;
}

export function getFormationCoordinates(
  formation: string,
  isHomeTeam: boolean = true
): FormationSlot[] {
  // Base 11 positions for standard formations on a 0-100 x 0-100 half
  // If home team, x is 5% to 48%. If away team, x is 52% to 95%.
  const mapX = (normX: number) => {
    // normX: 0 = GK, 1 = Attacking box
    if (isHomeTeam) {
      return 6 + normX * 40;
    } else {
      return 94 - normX * 40;
    }
  };

  const mapY = (normY: number) => {
    // normY: 0 = top, 1 = bottom
    return 10 + normY * 80;
  };

  switch (formation) {
    case '4-3-3':
      return [
        { position: 'GK', x: mapX(0.04), y: mapY(0.5), nameHint: 'Goalkeeper' },
        { position: 'LB', x: mapX(0.24), y: mapY(0.12), nameHint: 'Left Back' },
        { position: 'CB', x: mapX(0.20), y: mapY(0.36), nameHint: 'Left Center Back' },
        { position: 'CB', x: mapX(0.20), y: mapY(0.64), nameHint: 'Right Center Back' },
        { position: 'RB', x: mapX(0.24), y: mapY(0.88), nameHint: 'Right Back' },
        { position: 'CDM', x: mapX(0.42), y: mapY(0.50), nameHint: 'Defensive Midfield' },
        { position: 'CM', x: mapX(0.58), y: mapY(0.28), nameHint: 'Left Central Midfield' },
        { position: 'CAM', x: mapX(0.60), y: mapY(0.72), nameHint: 'Right Attacking Midfield' },
        { position: 'LW', x: mapX(0.85), y: mapY(0.15), nameHint: 'Left Wing' },
        { position: 'ST', x: mapX(0.92), y: mapY(0.50), nameHint: 'Striker' },
        { position: 'RW', x: mapX(0.85), y: mapY(0.85), nameHint: 'Right Wing' },
      ];

    case '4-2-3-1':
      return [
        { position: 'GK', x: mapX(0.04), y: mapY(0.5), nameHint: 'Goalkeeper' },
        { position: 'LB', x: mapX(0.24), y: mapY(0.12), nameHint: 'Left Back' },
        { position: 'CB', x: mapX(0.20), y: mapY(0.36), nameHint: 'Left Center Back' },
        { position: 'CB', x: mapX(0.20), y: mapY(0.64), nameHint: 'Right Center Back' },
        { position: 'RB', x: mapX(0.24), y: mapY(0.88), nameHint: 'Right Back' },
        { position: 'CDM', x: mapX(0.44), y: mapY(0.35), nameHint: 'Left Defensive Mid' },
        { position: 'CDM', x: mapX(0.44), y: mapY(0.65), nameHint: 'Right Defensive Mid' },
        { position: 'LM', x: mapX(0.68), y: mapY(0.16), nameHint: 'Left Attacking Mid' },
        { position: 'CAM', x: mapX(0.70), y: mapY(0.50), nameHint: 'Central Attacking Mid' },
        { position: 'RM', x: mapX(0.68), y: mapY(0.84), nameHint: 'Right Attacking Mid' },
        { position: 'ST', x: mapX(0.92), y: mapY(0.50), nameHint: 'Center Forward' },
      ];

    case '4-4-2':
      return [
        { position: 'GK', x: mapX(0.04), y: mapY(0.5), nameHint: 'Goalkeeper' },
        { position: 'LB', x: mapX(0.24), y: mapY(0.12), nameHint: 'Left Back' },
        { position: 'CB', x: mapX(0.20), y: mapY(0.36), nameHint: 'Left Center Back' },
        { position: 'CB', x: mapX(0.20), y: mapY(0.64), nameHint: 'Right Center Back' },
        { position: 'RB', x: mapX(0.24), y: mapY(0.88), nameHint: 'Right Back' },
        { position: 'LM', x: mapX(0.52), y: mapY(0.15), nameHint: 'Left Mid' },
        { position: 'CM', x: mapX(0.50), y: mapY(0.38), nameHint: 'Left Central Mid' },
        { position: 'CM', x: mapX(0.50), y: mapY(0.62), nameHint: 'Right Central Mid' },
        { position: 'RM', x: mapX(0.52), y: mapY(0.85), nameHint: 'Right Mid' },
        { position: 'ST', x: mapX(0.88), y: mapY(0.36), nameHint: 'Left Striker' },
        { position: 'ST', x: mapX(0.88), y: mapY(0.64), nameHint: 'Right Striker' },
      ];

    case '3-4-3':
      return [
        { position: 'GK', x: mapX(0.04), y: mapY(0.5), nameHint: 'Goalkeeper' },
        { position: 'CB', x: mapX(0.22), y: mapY(0.25), nameHint: 'Left Center Back' },
        { position: 'CB', x: mapX(0.20), y: mapY(0.50), nameHint: 'Central Center Back' },
        { position: 'CB', x: mapX(0.22), y: mapY(0.75), nameHint: 'Right Center Back' },
        { position: 'LWB', x: mapX(0.48), y: mapY(0.10), nameHint: 'Left Wing Back' },
        { position: 'CM', x: mapX(0.50), y: mapY(0.37), nameHint: 'Left Midfield' },
        { position: 'CM', x: mapX(0.50), y: mapY(0.63), nameHint: 'Right Midfield' },
        { position: 'RWB', x: mapX(0.48), y: mapY(0.90), nameHint: 'Right Wing Back' },
        { position: 'LW', x: mapX(0.82), y: mapY(0.20), nameHint: 'Left Forward' },
        { position: 'ST', x: mapX(0.90), y: mapY(0.50), nameHint: 'Striker' },
        { position: 'RW', x: mapX(0.82), y: mapY(0.80), nameHint: 'Right Forward' },
      ];

    default: // fallback to 4-3-3
      return getFormationCoordinates('4-3-3', isHomeTeam);
  }
}
