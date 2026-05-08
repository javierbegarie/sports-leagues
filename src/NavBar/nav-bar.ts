import { Component, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, of } from 'rxjs';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

import { SportLeaguesApi } from '../api/sport-leagues-api';
import { LeagueFilters } from '../api/sport-league.model';

@Component({
  selector: 'app-nav-bar',
  imports: [
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(SportLeaguesApi);

  readonly filtersChange = output<LeagueFilters>();

  readonly form = this.fb.nonNullable.group({
    search: [''],
    sports: [[] as string[]],
  });

  readonly sports = signal<string[]>([]);
  readonly sportOptions = computed(() => this.sports().map((s) => ({ label: s, value: s })));

  constructor() {
    this.api
      .getSports()
      .pipe(
        catchError((err) => {
          console.error('[SportLeaguesApi] failed to load sports', err);
          return of<string[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((sports) => this.sports.set(sports));

    this.form.valueChanges
      .pipe(debounceTime(200), takeUntilDestroyed())
      .subscribe(() => this.emitFilters());

    // Emit an initial empty filter so the list loads on first render.
    queueMicrotask(() => this.emitFilters());
  }

  private emitFilters(): void {
    const value = this.form.getRawValue();
    this.filtersChange.emit({ search: value.search, sports: value.sports });
  }
}
