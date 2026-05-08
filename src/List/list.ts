import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ListItem } from './list-item';
import { SportLeaguesApi } from '../api/sport-leagues-api';
import { SportLeague } from '../api/sport-league.model';

@Component({
  selector: 'app-list',
  imports: [ListItem, DialogModule, ProgressSpinnerModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  private readonly api = inject(SportLeaguesApi);

  readonly leagues = input<SportLeague[]>([]);
  readonly loading = input<boolean>(false);

  readonly selected = signal<SportLeague | null>(null);

  /**
   * Reactive badge fetch. While `selected` is `null` the params function returns
   * `undefined`, which keeps the resource in the idle state (no request, no
   * loading flicker). When a league is selected the stream subscribes to the
   * service's cached Observable; switching leagues auto-cancels the previous one.
   */
  readonly badgeResource = rxResource({
    params: () => this.selected()?.id,
    stream: ({ params: id }) => this.api.getLeagueBadge(id),
    defaultValue: null as string | null,
  });

  onSelect(league: SportLeague): void {
    this.selected.set(league);
  }

  onDialogVisibleChange(visible: boolean): void {
    if (!visible) {
      this.selected.set(null);
    }
  }
}
