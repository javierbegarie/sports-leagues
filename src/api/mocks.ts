import { SportLeague } from './sport-league.model';

/**
 * Static mock leagues kept for offline development and tests.
 * Currently unused at runtime — the service hits the real TheSportsDB API.
 */
export const MOCK_LEAGUES: readonly SportLeague[] = [
  {
    id: '4328',
    strLeague: 'English Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'EPL, Premier League',
    strBadge: 'https://placehold.co/300x300/3a0066/ffffff?text=EPL',
  },
  {
    id: '4329',
    strLeague: 'English League Championship',
    strSport: 'Soccer',
    strLeagueAlternate: 'EFL Championship',
    strBadge: 'https://placehold.co/300x300/0a4d2e/ffffff?text=Championship',
  },
  {
    id: '4332',
    strLeague: 'Italian Serie A',
    strSport: 'Soccer',
    strLeagueAlternate: 'Serie A',
    strBadge: 'https://placehold.co/300x300/0066cc/ffffff?text=Serie+A',
  },
  {
    id: '4335',
    strLeague: 'Spanish La Liga',
    strSport: 'Soccer',
    strLeagueAlternate: 'La Liga, Primera Division',
    strBadge: 'https://placehold.co/300x300/cc0033/ffffff?text=La+Liga',
  },
  {
    id: '4331',
    strLeague: 'German Bundesliga',
    strSport: 'Soccer',
    strLeagueAlternate: 'Bundesliga',
    strBadge: 'https://placehold.co/300x300/d50000/ffffff?text=Bundesliga',
  },
  {
    id: '4387',
    strLeague: 'NBA',
    strSport: 'Basketball',
    strLeagueAlternate: 'National Basketball Association',
    strBadge: 'https://placehold.co/300x300/c8102e/ffffff?text=NBA',
  },
  {
    id: '4516',
    strLeague: 'WNBA',
    strSport: 'Basketball',
    strLeagueAlternate: "Women's National Basketball Association",
    strBadge: 'https://placehold.co/300x300/ff8200/ffffff?text=WNBA',
  },
  {
    id: '4391',
    strLeague: 'NFL',
    strSport: 'American Football',
    strLeagueAlternate: 'National Football League',
    strBadge: 'https://placehold.co/300x300/013369/ffffff?text=NFL',
  },
  {
    id: '4424',
    strLeague: 'MLB',
    strSport: 'Baseball',
    strLeagueAlternate: 'Major League Baseball',
    strBadge: 'https://placehold.co/300x300/002d72/ffffff?text=MLB',
  },
  {
    id: '4380',
    strLeague: 'NHL',
    strSport: 'Ice Hockey',
    strLeagueAlternate: 'National Hockey League',
    strBadge: 'https://placehold.co/300x300/111111/ffffff?text=NHL',
  },
];
