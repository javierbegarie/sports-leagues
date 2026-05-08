import { Component, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';

import { SportLeague } from '../api/sport-league.model';

@Component({
  selector: 'app-list-item',
  imports: [CardModule],
  templateUrl: './list-item.html',
  styleUrl: './list-item.scss',
})
export class ListItem {
  readonly league = input.required<SportLeague>();
  readonly selected = output<SportLeague>();

  onClick(): void {
    this.selected.emit(this.league());
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}
