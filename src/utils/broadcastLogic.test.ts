import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatMatchClock,
  getRatingBadgeStyle,
  calculateMatchMomentum,
  getFormationCoordinates,
} from './broadcastLogic';
import { ClockState, MatchStats } from '../types/broadcast';

test('formatMatchClock formats standard 1st half time correctly', () => {
  const clock: ClockState = {
    seconds: 1425, // 23 minutes 45 seconds
    isRunning: true,
    half: '1ST_HALF',
    addedTime: 0,
    lastSyncTimestamp: Date.now(),
  };

  const result = formatMatchClock(clock);
  assert.equal(result.display, '23:45');
  assert.equal(result.periodLabel, '1ST HALF');
  assert.equal(result.isStoppage, false);
});

test('formatMatchClock formats 1st half added time correctly', () => {
  const clock: ClockState = {
    seconds: 2840, // 47 minutes 20 seconds -> 45:00 +2:20
    isRunning: true,
    half: '1ST_HALF',
    addedTime: 3,
    lastSyncTimestamp: Date.now(),
  };

  const result = formatMatchClock(clock);
  assert.equal(result.display, '45:00 +2:20');
  assert.equal(result.isStoppage, true);
});

test('formatMatchClock handles half time and full time states', () => {
  const htClock: ClockState = {
    seconds: 2700,
    isRunning: false,
    half: 'HALF_TIME',
    addedTime: 0,
    lastSyncTimestamp: Date.now(),
  };
  assert.equal(formatMatchClock(htClock).periodLabel, 'HALF TIME');

  const ftClock: ClockState = {
    seconds: 5400,
    isRunning: false,
    half: 'FULL_TIME',
    addedTime: 0,
    lastSyncTimestamp: Date.now(),
  };
  assert.equal(formatMatchClock(ftClock).periodLabel, 'FULL TIME');
});

test('getRatingBadgeStyle returns accurate colors and styles', () => {
  const topTier = getRatingBadgeStyle(8.8);
  assert.match(topTier.bgColor, /amber/);
  assert.equal(topTier.label, 'EXCEPTIONAL');

  const solidTier = getRatingBadgeStyle(7.8);
  assert.match(solidTier.bgColor, /emerald/);
  assert.equal(solidTier.label, 'GREAT');

  const poorTier = getRatingBadgeStyle(5.2);
  assert.match(poorTier.bgColor, /rose/);
  assert.equal(poorTier.label, 'POOR');
});

test('getFormationCoordinates returns 11 players for home and away', () => {
  const homeSlots = getFormationCoordinates('4-3-3', true);
  assert.equal(homeSlots.length, 11);
  assert.equal(homeSlots[0].position, 'GK');
  // Home GK is on the left half (< 20%)
  assert.ok(homeSlots[0].x < 20);

  const awaySlots = getFormationCoordinates('4-3-3', false);
  assert.equal(awaySlots.length, 11);
  // Away GK is on the right half (> 80%)
  assert.ok(awaySlots[0].x > 80);
});

test('calculateMatchMomentum generates smoothed timeline points', () => {
  const mockStats: MatchStats = {
    possession: [62, 38],
    shots: [14, 5],
    shotsOnTarget: [6, 2],
    shotsOffTarget: [5, 2],
    blockedShots: [3, 1],
    corners: [7, 2],
    fouls: [8, 12],
    offsides: [2, 1],
    saves: [2, 5],
    passes: [520, 310],
    passAccuracy: [89, 79],
    tackles: [16, 19],
    interceptions: [11, 8],
    clearances: [9, 21],
    dangerousAttacks: [54, 28],
    attacks: [98, 62],
    dataSource: 'ADMIN_MANUAL',
    lastUpdated: '12:00:00',
  };

  const points = calculateMatchMomentum([], mockStats, 45);
  assert.ok(points.length > 5);
  // Possession and attacks favor home team, home pressure should reflect dominance
  const avgHomePressure = points.reduce((acc, p) => acc + p.homePressure, 0) / points.length;
  assert.ok(avgHomePressure >= 50);
});

test('calculateMatchMomentum supports duration of 90 or over 90 minutes as admin configures', () => {
  const mockStats: MatchStats = {
    possession: [50, 50],
    shots: [10, 10],
    shotsOnTarget: [5, 5],
    shotsOffTarget: [5, 5],
    blockedShots: [2, 2],
    corners: [5, 5],
    fouls: [10, 10],
    offsides: [1, 1],
    saves: [3, 3],
    passes: [400, 400],
    passAccuracy: [85, 85],
    tackles: [15, 15],
    interceptions: [8, 8],
    clearances: [12, 12],
    dangerousAttacks: [40, 40],
    attacks: [80, 80],
    dataSource: 'ADMIN_MANUAL',
    lastUpdated: '12:00:00',
    momentumDuration: 120, // Extra Time setting
  };

  const points120 = calculateMatchMomentum([], mockStats, 105);
  // Should have points reaching past 100 minutes up to 120
  const maxPointMin = Math.max(...points120.map((p) => p.minute));
  assert.ok(maxPointMin >= 115, `Expected max minute >= 115, got ${maxPointMin}`);
});

test('sanitizePlayers disambiguates duplicate player IDs preventing duplicate React keys', async () => {
  const { sanitizePlayers } = await import('../context/BroadcastContext');
  const duplicatePlayers: any[] = [
    { id: 'b04-7', name: 'Player 1', teamId: 'b04', number: 7 },
    { id: 'b04-7', name: 'Player 2', teamId: 'b04', number: 7 },
    { id: 'bay-7', name: 'Player 3', teamId: 'bay', number: 7 },
    { id: 'bay-7', name: 'Player 4', teamId: 'bay', number: 7 },
    { id: 'unique-1', name: 'Player 5', teamId: 'bay', number: 1 },
  ];

  const sanitized = sanitizePlayers(duplicatePlayers);
  const ids = sanitized.map((p) => p.id);
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, 5, 'Every sanitized player ID must be distinct');
  assert.equal(ids.filter((id) => id === 'b04-7').length, 1);
  assert.equal(ids.filter((id) => id === 'bay-7').length, 1);
});

