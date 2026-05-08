import { Component, input, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ListItem } from './list-item';
import { SportLeague } from '../api/sport-league.model';

@Component({
  selector: 'app-list',
  imports: [ListItem, DialogModule, ProgressSpinnerModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  readonly leagues = input<SportLeague[]>([]);
  readonly loading = input<boolean>(false);

  readonly selected = signal<SportLeague | null>(null);

  onSelect(league: SportLeague): void {
    this.selected.set(league);
  }

  onDialogVisibleChange(visible: boolean): void {
    if (!visible) {
      this.selected.set(null);
    }
  }
}
