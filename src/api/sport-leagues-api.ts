import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { LeagueFilters, SportLeague } from './sport-league.model';

/* --------------------------------- Raw API shapes --------------------------------- */

interface AllLeaguesResponse {
  leagues: RawLeagueBasic[] | null;
}

interface SearchLeaguesResponse {
  /** TheSportsDB historically returns this with the typo "countrys"; we accept both. */
  countries?: RawLeagueDetailed[] | null;
  countrys?: RawLeagueDetailed[] | null;
}

interface AllSportsResponse {
  sports: RawSport[] | null;
}

interface SearchAllSeasonsResponse {
  seasons: RawSeasonBadge[] | null;
}

interface RawLeagueBasic {
  idLeague?: string;
  strLeague?: string;
  strSport?: string;
  strLeagueAlternate?: string;
}

interface RawLeagueDetailed extends RawLeagueBasic {
  strBadge?: string;
  strLogo?: string;
}

interface RawSport {
  idSport?: string;
  strSport?: string;
}

interface RawSeasonBadge {
  strSeason?: string;
  strBadge?: string;
}

/* ----------------------------------- Service ----------------------------------- */

@Injectable({ providedIn: 'root' })
export class SportLeaguesApi {
  private readonly http = inject(HttpClient);

  /** TheSportsDB free/demo key. Swap to a private key by setting `apiKey`. */
  private readonly baseUrl = 'https://www.thesportsdb.com/api/v1/json';
  private readonly apiKey = '123';
  /** The badge endpoint requires the public key `3` per the docs. */
  private readonly badgeApiKey = '3';

  /**
   * Cache responses by query so repeat filter selections do not refetch.
   * `shareReplay(1)` makes each Observable hot+cached for late subscribers.
   */
  private readonly leaguesCache = new Map<string, Observable<SportLeague[]>>();
  private readonly badgeCache = new Map<string, Observable<string | null>>();
  private sportsCache$: Observable<string[]> | null = null;

  /** Fetch leagues honoring the current filters. Search is applied client-side. */
  getLeagues(filters: LeagueFilters = {}): Observable<SportLeague[]> {
    const key = this.buildCacheKey(filters);
    const cached = this.leaguesCache.get(key);
    if (cached) {
      return cached;
    }

    const sports = filters.sports ?? [];
    const search = (filters.search ?? '').trim().toLowerCase();

    const source$: Observable<SportLeague[]> =
      sports.length === 0
        ? this.fetchAllLeagues()
        : sports.length === 1
          ? this.fetchLeaguesBySport(sports[0])
          : forkJoin(sports.map((s) => this.fetchLeaguesBySport(s))).pipe(
              map((groups) => this.dedupeById(groups.flat())),
            );

    const result$ = source$.pipe(
      map((leagues) => this.applySearch(leagues, search)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.leaguesCache.set(key, result$);
    return result$;
  }

  /** Distinct sport names, alphabetized. */
  getSports(): Observable<string[]> {
    if (this.sportsCache$) {
      return this.sportsCache$;
    }
    this.sportsCache$ = this.http
      .get<AllSportsResponse>(`${this.baseUrl}/${this.apiKey}/all_sports.php`)
      .pipe(
        map((res) =>
          (res.sports ?? [])
            .map((s) => s.strSport ?? '')
            .filter((s): s is string => !!s)
            .sort((a, b) => a.localeCompare(b)),
        ),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    return this.sportsCache$;
  }

  /** Resolve a league badge URL on demand (used when the league listing has none). */
  getLeagueBadge(id: string): Observable<string | null> {
    if (!id) {
      return of(null);
    }
    const cached = this.badgeCache.get(id);
    if (cached) {
      return cached;
    }
    const params = new HttpParams().set('badge', '1').set('id', id);
    const fetched$ = this.http
      .get<SearchAllSeasonsResponse>(`${this.baseUrl}/${this.badgeApiKey}/search_all_seasons.php`, {
        params,
      })
      .pipe(
        map((res) => res.seasons?.find((s) => !!s.strBadge)?.strBadge ?? null),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    this.badgeCache.set(id, fetched$);
    return fetched$;
  }

  /** Drop all in-memory caches (e.g., after a manual refresh). */
  clearCache(): void {
    this.leaguesCache.clear();
    this.badgeCache.clear();
    this.sportsCache$ = null;
  }

  /* ------------------------------ Private helpers ------------------------------ */

  private fetchAllLeagues(): Observable<SportLeague[]> {
    return this.http
      .get<AllLeaguesResponse>(`${this.baseUrl}/${this.apiKey}/all_leagues.php`)
      .pipe(map((res) => (res.leagues ?? []).map((l) => this.toSportLeague(l))));
  }

  private fetchLeaguesBySport(sport: string): Observable<SportLeague[]> {
    const params = new HttpParams().set('s', sport);
    return this.http
      .get<SearchLeaguesResponse>(`${this.baseUrl}/${this.apiKey}/search_all_leagues.php`, {
        params,
      })
      .pipe(
        map((res) => res.countries ?? res.countrys ?? []),
        map((leagues) => leagues.map((l) => this.toSportLeague(l))),
      );
  }

  private toSportLeague(raw: RawLeagueDetailed | RawLeagueBasic): SportLeague {
    const detailed = raw as RawLeagueDetailed;
    return {
      id: raw.idLeague ?? '',
      strLeague: raw.strLeague ?? '',
      strSport: raw.strSport ?? '',
      strLeagueAlternate: raw.strLeagueAlternate ?? '',
      strBadge: detailed.strBadge ?? '',
    };
  }

  private applySearch(leagues: SportLeague[], search: string): SportLeague[] {
    if (!search) {
      return leagues;
    }
    return leagues.filter(
      (l) =>
        l.strLeague.toLowerCase().includes(search) ||
        l.strLeagueAlternate.toLowerCase().includes(search),
    );
  }

  private dedupeById(leagues: SportLeague[]): SportLeague[] {
    const map = new Map<string, SportLeague>();
    for (const l of leagues) {
      if (l.id) {
        map.set(l.id, l);
      }
    }
    return [...map.values()];
  }

  private buildCacheKey(filters: LeagueFilters): string {
    return JSON.stringify({
      search: (filters.search ?? '').trim().toLowerCase(),
      sports: [...(filters.sports ?? [])].sort(),
    });
  }
}
