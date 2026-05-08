import { Injectable } from '@angular/core';
import { LeagueFilters, SportLeague } from './sport-league.model';

const MOCK_LEAGUES: readonly SportLeague[] = [
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

@Injectable({ providedIn: 'root' })
export class SportLeaguesApi {
  private readonly leaguesCache = new Map<string, SportLeague[]>();
  private sportsCache: string[] | null = null;

  async getLeagues(filters: LeagueFilters = {}): Promise<SportLeague[]> {
    const key = this.buildCacheKey(filters);
    const cached = this.leaguesCache.get(key);
    if (cached) {
      return cached;
    }
    await this.simulateLatency(200);
    const result = this.applyFilters([...MOCK_LEAGUES], filters);
    this.leaguesCache.set(key, result);
    return result;
  }

  async getSports(): Promise<string[]> {
    if (this.sportsCache) {
      return this.sportsCache;
    }
    await this.simulateLatency(50);
    this.sportsCache = [...new Set(MOCK_LEAGUES.map((l) => l.strSport))].sort();
    return this.sportsCache;
  }

  clearCache(): void {
    this.leaguesCache.clear();
    this.sportsCache = null;
  }

  private buildCacheKey(filters: LeagueFilters): string {
    return JSON.stringify({
      search: (filters.search ?? '').trim().toLowerCase(),
      sports: [...(filters.sports ?? [])].sort(),
    });
  }

  private applyFilters(leagues: SportLeague[], filters: LeagueFilters): SportLeague[] {
    const search = (filters.search ?? '').trim().toLowerCase();
    const sports = filters.sports ?? [];
    return leagues.filter((league) => {
      const matchesSearch =
        !search ||
        league.strLeague.toLowerCase().includes(search) ||
        league.strLeagueAlternate.toLowerCase().includes(search);
      const matchesSport = sports.length === 0 || sports.includes(league.strSport);
      return matchesSearch && matchesSport;
    });
  }

  private simulateLatency(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
