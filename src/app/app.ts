import { Component, inject, signal } from '@angular/core';

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

  readonly leagues = signal<SportLeague[]>([]);
  readonly loading = signal<boolean>(false);

  async onFiltersChange(filters: LeagueFilters): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.api.getLeagues(filters);
      this.leagues.set(result);
    } finally {
      this.loading.set(false);
    }
  }
}
