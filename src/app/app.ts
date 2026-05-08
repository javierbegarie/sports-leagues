import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, of, switchMap, tap } from 'rxjs';

import { NavBar } from '../NavBar/nav-bar';
import { List } from '../List/list';
import { SportLeaguesApi } from '../api/sport-leagues-api';
import { LeagueFilters, SportLeague } from '../api/sport-league.model';

@Component({
  selector: 'app-root',
  imports: [NavBar, List],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly api = inject(SportLeaguesApi);
  private readonly filters$ = new Subject<LeagueFilters>();

  readonly leagues = signal<SportLeague[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.filters$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((filters) =>
          this.api.getLeagues(filters).pipe(
            catchError((err) => {
              console.error('[SportLeaguesApi] failed to load leagues', err);
              this.error.set('Failed to load leagues. Please try again.');
              return of<SportLeague[]>([]);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((leagues) => {
        this.leagues.set(leagues);
        this.loading.set(false);
      });
  }

  onFiltersChange(filters: LeagueFilters): void {
    this.filters$.next(filters);
  }
}
