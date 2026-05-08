# Sport Leagues

Small Angular app that lists sport leagues from [TheSportsDB](https://www.thesportsdb.com/) with text + sport filters, and shows a league's badge in a modal when an item is clicked.

> **For reviewers:** see [`PROCESS.md`](./PROCESS.md) for a short write-up of how I approached the exercise — tooling, stack choice, prompting iterations, and time spent.

## Stack

- Angular 21 (standalone, zoneless, strict, SCSS)
- PrimeNG 21 with the **Lara** theme + PrimeFlex 4 for responsive layout
- Reactive Forms for filters, signals + `rxResource` for async state
- `HttpClient` + Observables in the service layer, cached with `shareReplay`

## Project structure

```
src/
  api/                    SportLeaguesApi service + types + mocks
  NavBar/                 search + multi-select sport filter (reactive form)
  List/                   list, list-item, badge dialog
  app/                    root component, providers
```

## Development server

```bash
npm install
npm start          # ng serve → http://localhost:4200
```

## Build

```bash
npm run build
```

Artifacts are written to `dist/`.

## Tests

```bash
npm test
```

Tests run with [Vitest](https://vitest.dev/).
