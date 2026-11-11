import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTeamCode,
  createCustomTeam,
  searchWorldTeams,
  generateWorldSquad,
  WORLD_TEAMS,
} from './worldTeamsData';

test('generateTeamCode creates clean 3-letter uppercase codes', () => {
  assert.equal(generateTeamCode('Real Madrid'), 'RMA');
  assert.equal(generateTeamCode('Paris Saint-Germain'), 'PSG');
  assert.equal(generateTeamCode('FC Barcelona'), 'BAR');
  assert.equal(generateTeamCode('Liverpool FC'), 'LIV');
  assert.equal(generateTeamCode('Arsenal'), 'ARS');
  assert.equal(generateTeamCode('Bayer Leverkusen'), 'BAY');
});

test('createCustomTeam creates a valid custom team object with code and colors', () => {
  const custom = createCustomTeam('Seattle Sounders');
  assert.equal(custom.name, 'Seattle Sounders');
  assert.equal(custom.code, 'SEA');
  assert.ok(custom.primaryColor.startsWith('#'));
  assert.equal(custom.formation, '4-3-3');
});

test('searchWorldTeams finds teams by club name, league, and star players', () => {
  const byName = searchWorldTeams('Leverkusen');
  assert.ok(byName.some((t) => t.code === 'B04'));

  const byPlayer = searchWorldTeams('Messi');
  assert.ok(byPlayer.some((t) => t.id === 'intermiami' || t.id === 'argentina'));

  const byRonaldo = searchWorldTeams('Ronaldo');
  assert.ok(byRonaldo.some((t) => t.id === 'alnassr' || t.id === 'portugal'));

  const byLeague = searchWorldTeams('', 'Serie A');
  assert.ok(byLeague.some((t) => t.code === 'INT'));
  assert.ok(byLeague.some((t) => t.code === 'JUV'));
});

test('generateWorldSquad creates starting XI and substitutes with valid pitch coords', () => {
  const testTeam = WORLD_TEAMS[0]; // Arsenal
  const squad = generateWorldSquad(testTeam, true);

  assert.equal(squad.length, 15); // 11 starters + 4 subs
  const starters = squad.filter((p) => p.isStarter);
  assert.equal(starters.length, 11);

  // Check goalkeeper is in home territory
  const gk = starters.find((p) => p.position === 'GK');
  assert.ok(gk);
  assert.ok(gk.pitchX < 25); // Home GK should be close to left goal
});

test('generateSquadForTeam produces 100% unique player IDs for Bayer Leverkusen (B04) and Bayern (BAY)', async () => {
  const { generateSquadForTeam, PRESET_TEAMS } = await import('./initialMatchData');

  const b04Team = WORLD_TEAMS.find((t) => t.id === 'bayerleverkusen')!;
  assert.ok(b04Team, 'Bayer Leverkusen should be found in WORLD_TEAMS');
  assert.equal(b04Team.code, 'B04');

  const b04Squad = generateSquadForTeam(b04Team, true);
  assert.ok(b04Squad.length >= 11);
  const b04Ids = b04Squad.map((p) => p.id);
  const uniqueB04Ids = new Set(b04Ids);
  assert.equal(uniqueB04Ids.size, b04Ids.length, 'All B04 player IDs must be unique (no duplicate keys)');
  assert.equal(b04Ids.filter((id) => id === 'b04-7').length <= 1, true, 'No duplicate b04-7 id');

  const bayTeam = WORLD_TEAMS.find((t) => t.id === 'bayern') || PRESET_TEAMS.bayern;
  assert.ok(bayTeam, 'Bayern Munich should be found');
  assert.equal(bayTeam.code, 'BAY');

  const baySquad = generateSquadForTeam(bayTeam, false);
  assert.ok(baySquad.length >= 11);
  const bayIds = baySquad.map((p) => p.id);
  const uniqueBayIds = new Set(bayIds);
  assert.equal(uniqueBayIds.size, bayIds.length, 'All BAY player IDs must be unique (no duplicate keys)');
  assert.equal(bayIds.filter((id) => id === 'bay-7').length <= 1, true, 'No duplicate bay-7 id');
});

test('generateSquadForTeam produces unique player IDs for completely custom team fallback', async () => {
  const { generateSquadForTeam } = await import('./initialMatchData');
  const customTeam = {
    id: 'custom-team-99',
    name: 'Custom FC',
    shortName: 'Custom',
    code: 'CUS',
    logo: 'https://example.com/logo.png',
    primaryColor: '#123456',
    secondaryColor: '#654321',
    formation: '4-3-3',
  };

  const squad = generateSquadForTeam(customTeam, true);
  const ids = squad.map((p) => p.id);
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, ids.length, 'All custom team player IDs must be strictly unique');
});

