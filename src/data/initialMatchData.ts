import { BroadcastState, Player, Team, PlayerPosition } from '../types/broadcast';
import { getFormationCoordinates, calculateMatchMomentum } from '../utils/broadcastLogic';
import { generateWorldSquad } from './worldTeamsData';

export const PRESET_TEAMS: Record<string, Team> = {
  arsenal: {
    id: 'arsenal',
    name: 'Arsenal FC',
    shortName: 'Arsenal',
    code: 'ARS',
    logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#db0007',
    secondaryColor: '#ffffff',
    formation: '4-3-3',
  },
  mancity: {
    id: 'mancity',
    name: 'Manchester City',
    shortName: 'Man City',
    code: 'MCI',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#6CABDD',
    secondaryColor: '#1C2C5B',
    formation: '4-2-3-1',
  },
  realmadrid: {
    id: 'realmadrid',
    name: 'Real Madrid',
    shortName: 'Real Madrid',
    code: 'RMA',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#e0a800',
    secondaryColor: '#1a1a2e',
    formation: '4-3-3',
  },
  barcelona: {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'Barcelona',
    code: 'BAR',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#a50044',
    secondaryColor: '#004d98',
    formation: '4-3-3',
  },
  liverpool: {
    id: 'liverpool',
    name: 'Liverpool FC',
    shortName: 'Liverpool',
    code: 'LIV',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#c8102e',
    secondaryColor: '#00b2a9',
    formation: '4-3-3',
  },
  chelsea: {
    id: 'chelsea',
    name: 'Chelsea FC',
    shortName: 'Chelsea',
    code: 'CHE',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#034694',
    secondaryColor: '#ffffff',
    formation: '4-2-3-1',
  },
  bayern: {
    id: 'bayern',
    name: 'Bayern Munich',
    shortName: 'Bayern',
    code: 'BAY',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#dc052d',
    secondaryColor: '#0066b2',
    formation: '4-2-3-1',
  },
  manutd: {
    id: 'manutd',
    name: 'Manchester United',
    shortName: 'Man Utd',
    code: 'MUN',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#da291c',
    secondaryColor: '#ffe500',
    formation: '4-2-3-1',
  },
  psg: {
    id: 'psg',
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    code: 'PSG',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#004170',
    secondaryColor: '#da291c',
    formation: '4-3-3',
  },
  inter: {
    id: 'inter',
    name: 'Inter Milan',
    shortName: 'Inter',
    code: 'INT',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#010e80',
    secondaryColor: '#000000',
    formation: '3-5-2',
  },
  dortmund: {
    id: 'dortmund',
    name: 'Borussia Dortmund',
    shortName: 'Dortmund',
    code: 'BVB',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#fde100',
    secondaryColor: '#000000',
    formation: '4-2-3-1',
  },
  england: {
    id: 'england',
    name: 'England',
    shortName: 'England',
    code: 'ENG',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#ffffff',
    secondaryColor: '#ce1124',
    formation: '4-2-3-1',
  },
  brazil: {
    id: 'brazil',
    name: 'Brazil',
    shortName: 'Brazil',
    code: 'BRA',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#fedf00',
    secondaryColor: '#009b3a',
    formation: '4-3-3',
  },
  france: {
    id: 'france',
    name: 'France',
    shortName: 'France',
    code: 'FRA',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#002395',
    secondaryColor: '#ffffff',
    formation: '4-3-3',
  },
  argentina: {
    id: 'argentina',
    name: 'Argentina',
    shortName: 'Argentina',
    code: 'ARG',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    primaryColor: '#75aadb',
    secondaryColor: '#ffffff',
    formation: '4-3-3',
  },
};

export const ARSENAL_TEAM: Team = PRESET_TEAMS.arsenal;
export const OPPONENT_TEAM: Team = PRESET_TEAMS.mancity;

// Known roster database for popular clubs
const SQUAD_DATABASE: Record<string, Array<{ name: string; shortName: string; number: number; pos: PlayerPosition; rating: number; nat: string; age: number; photo: string }>> = {
  arsenal: [
    { name: 'David Raya', shortName: 'Raya', number: 22, pos: 'GK', age: 29, nat: 'Spain', rating: 7.9, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Jurriën Timber', shortName: 'Timber', number: 12, pos: 'RB', age: 23, nat: 'Netherlands', rating: 7.8, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'William Saliba', shortName: 'Saliba', number: 2, pos: 'CB', age: 23, nat: 'France', rating: 8.6, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Gabriel Magalhães', shortName: 'Gabriel', number: 6, pos: 'CB', age: 26, nat: 'Brazil', rating: 8.4, photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Riccardo Calafiori', shortName: 'Calafiori', number: 33, pos: 'LB', age: 22, nat: 'Italy', rating: 7.6, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Thomas Partey', shortName: 'Partey', number: 5, pos: 'CDM', age: 31, nat: 'Ghana', rating: 7.4, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Declan Rice', shortName: 'Rice', number: 41, pos: 'CM', age: 25, nat: 'England', rating: 8.5, photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Martin Ødegaard (C)', shortName: 'Ødegaard', number: 8, pos: 'CAM', age: 25, nat: 'Norway', rating: 8.9, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Bukayo Saka', shortName: 'Saka', number: 7, pos: 'RW', age: 23, nat: 'England', rating: 9.1, photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Kai Havertz', shortName: 'Havertz', number: 29, pos: 'ST', age: 25, nat: 'Germany', rating: 8.3, photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Gabriel Martinelli', shortName: 'Martinelli', number: 11, pos: 'LW', age: 23, nat: 'Brazil', rating: 8.1, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Leandro Trossard', shortName: 'Trossard', number: 19, pos: 'LW', age: 29, nat: 'Belgium', rating: 7.7, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Gabriel Jesus', shortName: 'Jesus', number: 9, pos: 'ST', age: 27, nat: 'Brazil', rating: 7.3, photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Mikel Merino', shortName: 'Merino', number: 23, pos: 'CM', age: 28, nat: 'Spain', rating: 7.5, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80' },
  ],
  mancity: [
    { name: 'Ederson', shortName: 'Ederson', number: 31, pos: 'GK', age: 31, nat: 'Brazil', rating: 7.6, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Kyle Walker', shortName: 'Walker', number: 2, pos: 'RB', age: 34, nat: 'England', rating: 7.3, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Rúben Dias', shortName: 'Dias', number: 3, pos: 'CB', age: 27, nat: 'Portugal', rating: 8.0, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Manuel Akanji', shortName: 'Akanji', number: 25, pos: 'CB', age: 29, nat: 'Switzerland', rating: 7.5, photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Joško Gvardiol', shortName: 'Gvardiol', number: 24, pos: 'LB', age: 22, nat: 'Croatia', rating: 7.9, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Mateo Kovačić', shortName: 'Kovačić', number: 8, pos: 'CDM', age: 30, nat: 'Croatia', rating: 7.2, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'İlkay Gündoğan', shortName: 'Gündoğan', number: 19, pos: 'CDM', age: 34, nat: 'Germany', rating: 7.7, photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Bernardo Silva', shortName: 'Bernardo', number: 20, pos: 'RM', age: 30, nat: 'Portugal', rating: 8.4, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Phil Foden', shortName: 'Foden', number: 47, pos: 'CAM', age: 24, nat: 'England', rating: 8.3, photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Jérémy Doku', shortName: 'Doku', number: 11, pos: 'LM', age: 22, nat: 'Belgium', rating: 7.6, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Erling Haaland', shortName: 'Haaland', number: 9, pos: 'ST', age: 24, nat: 'Norway', rating: 8.8, photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Jack Grealish', shortName: 'Grealish', number: 10, pos: 'LW', age: 29, nat: 'England', rating: 7.4, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80' },
  ],
  realmadrid: [
    { name: 'Thibaut Courtois', shortName: 'Courtois', number: 1, pos: 'GK', age: 32, nat: 'Belgium', rating: 8.3, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Dani Carvajal', shortName: 'Carvajal', number: 2, pos: 'RB', age: 32, nat: 'Spain', rating: 8.0, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Antonio Rüdiger', shortName: 'Rüdiger', number: 22, pos: 'CB', age: 31, nat: 'Germany', rating: 8.4, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Éder Militão', shortName: 'Militão', number: 3, pos: 'CB', age: 26, nat: 'Brazil', rating: 7.9, photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Ferland Mendy', shortName: 'Mendy', number: 23, pos: 'LB', age: 29, nat: 'France', rating: 7.6, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Aurélien Tchouaméni', shortName: 'Tchouaméni', number: 14, pos: 'CDM', age: 24, nat: 'France', rating: 8.1, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Federico Valverde', shortName: 'Valverde', number: 8, pos: 'CM', age: 26, nat: 'Uruguay', rating: 8.7, photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Jude Bellingham', shortName: 'Bellingham', number: 5, pos: 'CAM', age: 21, nat: 'England', rating: 9.0, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Rodrygo', shortName: 'Rodrygo', number: 11, pos: 'RW', age: 23, nat: 'Brazil', rating: 8.2, photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Kylian Mbappé', shortName: 'Mbappé', number: 9, pos: 'ST', age: 25, nat: 'France', rating: 9.2, photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Vinícius Júnior', shortName: 'Vinícius', number: 7, pos: 'LW', age: 24, nat: 'Brazil', rating: 9.3, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Luka Modrić', shortName: 'Modrić', number: 10, pos: 'CM', age: 39, nat: 'Croatia', rating: 7.8, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80' },
  ],
  barcelona: [
    { name: 'Marc-André ter Stegen', shortName: 'Ter Stegen', number: 1, pos: 'GK', age: 32, nat: 'Germany', rating: 7.8, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Jules Koundé', shortName: 'Koundé', number: 23, pos: 'RB', age: 26, nat: 'France', rating: 8.2, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Pau Cubarsí', shortName: 'Cubarsí', number: 2, pos: 'CB', age: 17, nat: 'Spain', rating: 7.9, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Iñigo Martínez', shortName: 'Iñigo', number: 5, pos: 'CB', age: 33, nat: 'Spain', rating: 7.7, photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Alejandro Balde', shortName: 'Balde', number: 3, pos: 'LB', age: 21, nat: 'Spain', rating: 7.8, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Marc Casadó', shortName: 'Casadó', number: 17, pos: 'CDM', age: 21, nat: 'Spain', rating: 7.6, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Pedri', shortName: 'Pedri', number: 8, pos: 'CM', age: 21, nat: 'Spain', rating: 8.8, photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Dani Olmo', shortName: 'Olmo', number: 20, pos: 'CAM', age: 26, nat: 'Spain', rating: 8.4, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Lamine Yamal', shortName: 'Yamal', number: 19, pos: 'RW', age: 17, nat: 'Spain', rating: 9.1, photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Robert Lewandowski', shortName: 'Lewandowski', number: 9, pos: 'ST', age: 36, nat: 'Poland', rating: 8.9, photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Raphinha', shortName: 'Raphinha', number: 11, pos: 'LW', age: 27, nat: 'Brazil', rating: 8.9, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80' },
  ],
  liverpool: [
    { name: 'Alisson Becker', shortName: 'Alisson', number: 1, pos: 'GK', age: 32, nat: 'Brazil', rating: 8.4, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Trent Alexander-Arnold', shortName: 'Alexander-Arnold', number: 66, pos: 'RB', age: 26, nat: 'England', rating: 8.7, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Virgil van Dijk (C)', shortName: 'Van Dijk', number: 4, pos: 'CB', age: 33, nat: 'Netherlands', rating: 8.8, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Ibrahima Konaté', shortName: 'Konaté', number: 5, pos: 'CB', age: 25, nat: 'France', rating: 8.1, photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Andy Robertson', shortName: 'Robertson', number: 26, pos: 'LB', age: 30, nat: 'Scotland', rating: 7.9, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Ryan Gravenberch', shortName: 'Gravenberch', number: 38, pos: 'CDM', age: 22, nat: 'Netherlands', rating: 8.4, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Alexis Mac Allister', shortName: 'Mac Allister', number: 10, pos: 'CM', age: 25, nat: 'Argentina', rating: 8.5, photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Dominik Szoboszlai', shortName: 'Szoboszlai', number: 8, pos: 'CAM', age: 24, nat: 'Hungary', rating: 8.1, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Mohamed Salah', shortName: 'Salah', number: 11, pos: 'RW', age: 32, nat: 'Egypt', rating: 9.2, photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Darwin Núñez', shortName: 'Núñez', number: 9, pos: 'ST', age: 25, nat: 'Uruguay', rating: 7.9, photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=160&h=160&q=80' },
    { name: 'Luis Díaz', shortName: 'Díaz', number: 7, pos: 'LW', age: 27, nat: 'Colombia', rating: 8.4, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80' },
  ],
};

/**
 * Dynamically generates a complete Starting XI and Substitutes squad for ANY team.
 * If known squad exists in database, uses it. Otherwise generates a balanced squad.
 */
export function generateSquadForTeam(team: Team, isHome: boolean): Player[] {
  const teamKey = team.id.toLowerCase();
  const rawPlayers = SQUAD_DATABASE[teamKey];
  const slots = getFormationCoordinates(team.formation || '4-3-3', isHome);
  const players: Player[] = [];

  if (rawPlayers && rawPlayers.length >= 11) {
    // 11 Starters
    rawPlayers.slice(0, 11).forEach((raw, i) => {
      const slot = slots[i];
      players.push({
        id: `${team.code.toLowerCase()}-${raw.number}`,
        teamId: team.id,
        name: raw.name,
        shortName: raw.shortName,
        number: raw.number,
        position: slot ? slot.position : raw.pos,
        nationality: raw.nat,
        age: raw.age,
        photo: raw.photo,
        rating: raw.rating,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 70,
        isStarter: true,
        pitchX: slot ? slot.x : (isHome ? 20 : 80),
        pitchY: slot ? slot.y : 50,
      });
    });

    // Subs (with distinct -sub suffix to prevent key collisions)
    rawPlayers.slice(11).forEach((raw, i) => {
      players.push({
        id: `${team.code.toLowerCase()}-${raw.number}-sub-${i}`,
        teamId: team.id,
        name: raw.name,
        shortName: raw.shortName,
        number: raw.number,
        position: raw.pos,
        nationality: raw.nat,
        age: raw.age,
        photo: raw.photo,
        rating: raw.rating,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 0,
        isStarter: false,
        pitchX: isHome ? 5 : 95,
        pitchY: 5,
      });
    });
    return players;
  }

  // Check if team exists in global world clubs directory
  const worldSquad = generateWorldSquad(team, isHome);
  if (worldSquad && worldSquad.length >= 11) {
    return worldSquad;
  }

  // Generate balanced generic roster for custom team with distinct shirt numbers
  const starterNumbers = [1, 2, 5, 4, 3, 6, 8, 10, 7, 9, 11];
  const genericPos: PlayerPosition[] = ['GK', 'RB', 'CB', 'CB', 'LB', 'CDM', 'CM', 'CAM', 'RW', 'ST', 'LW'];
  genericPos.forEach((pos, i) => {
    const slot = slots[i];
    const num = starterNumbers[i] || (i + 1);
    players.push({
      id: `${team.code.toLowerCase()}-${num}-${i}`,
      teamId: team.id,
      name: `${team.shortName} Player ${num}`,
      shortName: `${team.code} ${num}`,
      number: num,
      position: slot ? slot.position : pos,
      nationality: 'Pro',
      age: 24,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
      rating: 7.5,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 70,
      isStarter: true,
      pitchX: slot ? slot.x : (isHome ? 20 : 80),
      pitchY: slot ? slot.y : 50,
    });
  });

  // 3 generic subs with distinct numbers and IDs
  [12, 14, 21].forEach((num, i) => {
    players.push({
      id: `${team.code.toLowerCase()}-${num}-sub-${i}`,
      teamId: team.id,
      name: `${team.shortName} Sub ${num}`,
      shortName: `Sub ${num}`,
      number: num,
      position: 'CM',
      nationality: 'Pro',
      age: 22,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80',
      rating: 7.0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 0,
      isStarter: false,
      pitchX: isHome ? 5 : 95,
      pitchY: 5,
    });
  });

  return players;
}

export function buildInitialState(): BroadcastState {
  const homeSquad = generateSquadForTeam(ARSENAL_TEAM, true);
  const awaySquad = generateSquadForTeam(OPPONENT_TEAM, false);
  const players = [...homeSquad, ...awaySquad];

  // Specific initial goals for demo
  const saka = players.find(p => p.id === 'ars-7');
  if (saka) saka.goals = 1;
  const havertz = players.find(p => p.id === 'ars-29');
  if (havertz) havertz.goals = 1;
  const haaland = players.find(p => p.id === 'mci-9');
  if (haaland) haaland.goals = 1;

  const events = [
    {
      id: 'evt-1',
      type: 'GOAL' as const,
      minute: 23,
      teamId: 'arsenal',
      playerId: 'ars-7',
      assistPlayerId: 'ars-8',
      description: 'Bukayo Saka brilliant curler into top left corner! Assist by Martin Ødegaard.',
      timestamp: Date.now() - 45 * 60 * 1000,
    },
    {
      id: 'evt-2',
      type: 'YELLOW_CARD' as const,
      minute: 38,
      teamId: 'arsenal',
      playerId: 'ars-5',
      description: 'Thomas Partey tactical foul on counter-attack.',
      timestamp: Date.now() - 30 * 60 * 1000,
    },
    {
      id: 'evt-3',
      type: 'GOAL' as const,
      minute: 54,
      teamId: 'mancity',
      playerId: 'mci-9',
      assistPlayerId: 'mci-20',
      description: 'Erling Haaland header from close range. Assist Bernardo Silva.',
      timestamp: Date.now() - 15 * 60 * 1000,
    },
    {
      id: 'evt-4',
      type: 'GOAL' as const,
      minute: 68,
      teamId: 'arsenal',
      playerId: 'ars-29',
      assistPlayerId: 'ars-7',
      description: 'Kai Havertz powerful finish after lightning cutback from Bukayo Saka!',
      timestamp: Date.now() - 3 * 60 * 1000,
    },
  ];

  const stats = {
    possession: [57, 43] as [number, number],
    shots: [15, 8] as [number, number],
    shotsOnTarget: [7, 3] as [number, number],
    shotsOffTarget: [5, 3] as [number, number],
    blockedShots: [3, 2] as [number, number],
    corners: [8, 4] as [number, number],
    fouls: [9, 11] as [number, number],
    offsides: [2, 1] as [number, number],
    saves: [2, 5] as [number, number],
    passes: [498, 382] as [number, number],
    passAccuracy: [88, 82] as [number, number],
    tackles: [18, 14] as [number, number],
    interceptions: [12, 7] as [number, number],
    clearances: [14, 22] as [number, number],
    dangerousAttacks: [61, 34] as [number, number],
    attacks: [104, 69] as [number, number],
    dataSource: 'ADMIN_MANUAL' as const,
    lastUpdated: 'Live sync active',
  };

  const currentMinute = 73;
  const momentum = calculateMatchMomentum(events, stats, currentMinute, 'arsenal');

  return {
    match: {
      id: 'match-live-broadcast',
      competition: 'Premier League',
      season: '2025/26',
      date: '2026-11-04',
      kickoffTime: '20:00 GMT',
      stadium: 'Emirates Stadium, London',
      referee: 'Michael Oliver',
      homeTeam: ARSENAL_TEAM,
      awayTeam: OPPONENT_TEAM,
      homeScore: 2,
      awayScore: 1,
      status: '2ND_HALF',
    },
    clock: {
      seconds: 73 * 60 + 24, // 73:24
      isRunning: true,
      half: '2ND_HALF',
      addedTime: 4,
      lastSyncTimestamp: Date.now(),
    },
    players,
    events,
    stats,
    momentum,
    tactical: {
      ball: { x: 42, y: 72 },
      possessionTeamId: 'arsenal',
      attackingDirection: 'LEFT_TO_RIGHT',
      paths: [
        {
          id: 'path-1',
          type: 'PASS',
          fromX: 30,
          fromY: 67,
          toX: 40,
          toY: 78,
          teamId: 'arsenal',
          label: 'Incisive Ball',
        },
        {
          id: 'path-2',
          type: 'RUN',
          fromX: 40,
          fromY: 78,
          toX: 44,
          toY: 60,
          teamId: 'arsenal',
          label: 'Attacking Overload',
        },
      ],
      showHeatmap: false,
      showPlayerNames: true,
      showRatings: true,
      showPassingLines: true,
      orientation: 'landscape',
      isPlayingMovement: false,
      animationSpeed: 1.0,
      trackingDataSource: 'ADMIN_MANUAL_TACTICAL',
    },
    graphics: {
      scoreboard: true,
      ticker: true,
      tickerText: 'ARSENAL FANS LIVE • EMIRATES STADIUM • HAVERTZ FIRES ARSENAL INTO 2-1 LEAD • SAKA SENSATIONAL ASSIST • OBS READY 1080P/720P',
      sponsorBanner: true,
      sponsorName: 'EMIRATES FLY BETTER • ARSENAL OFFICIAL PARTNER',
      activePopup: null,
    },
    api: {
      provider: 'manual',
      apiKeyMasked: 'api-ft-••••••••••••••9a2',
      refreshInterval: 15,
      autoSync: false,
      connectionStatus: 'ONLINE',
      lastSyncTime: '12:00:00 (DEMO MODE)',
      dataPriority: 'MANUAL_OVERRIDE',
    },
  };
}
