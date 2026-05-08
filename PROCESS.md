# Process & Decisions

A short note on how I approached this exercise (90-minute budget).

## Tooling

I started by trying to upgrade my GitHub Copilot plan, since the free tier was unlikely to keep up with the prompt size and output detail I expected to need. Account upgrades are paused at the moment, so I switched to **Claude**. I configured it with the **Opus** model on **Extra high effort** — I knew I would send long, structured prompts and wanted complete, low-tweak outputs in return.

## Stack

The role targets **Vue**, but I went with **Angular**. It is the framework I have the most production experience with, so I could spend the budget on the exercise rather than fighting the toolchain. For UI, I picked **PrimeNG** (component library) and **PrimeFlex** (utility-first responsive layout) so I could get something polished and mobile-first on screen quickly without writing CSS from zero.

Specific stack choices:

- Angular 21 with **standalone components**, **zoneless**, **strict** TypeScript, **SCSS**.
- PrimeNG 21 with the **Lara** theme preset (free).
- **Signals** + reactive forms; **`rxResource`** for the badge fetch.

## How I prompted

### Round 1 — Mock prototype

The first prompt asked Claude to scaffold the project end-to-end against the brief: folder structure, mocked async API with an internal `Map` cache, reactive-forms filters in a NavBar, a responsive list, a click-to-show badge dialog dismissible by clicking outside. The goal was to validate the skeleton, layout, and styling before any network code went in.

<details>
<summary>Click to read the verbatim first prompt</summary>

> I need to generate an Angular project.
>
> This project is simple:
>
> - We need to show a list of Sport Leagues with some filters.
> - The project needs to be responsive, I suggest to use a Mobile First approach. The filters should stack one over another when the screen is smaller and be adjacent on bigger screen. The list item will only display text data: League Name, Sport Name, League Name alternate, every Sport league will also have its own id but that's not gonna be shown, this ListItem data can also stack in smaller screens but League name should be bold text.
> - When the user clicks in a List item we should show the Badge image representing the league.
> - We need to have the next folder structure and components:
>   - src: App Component.
>   - src/List: List component, List item component.
>   - src/NavBar: NavBar component
>   - src/api: SportLeaguesAPI service
> - Do not do any API call, implement async method for the service but just return mock data. I will take care of the API calls later.
> - Make use of PrimeNg as a component library and Prime Flex to handle the responsiveness and layout structure. We will need to filter by text, so make use of PrimeNG Seach component and we will need to filter by Sport so make use of PrimeNg Dropdown. These components should be inside NavBar component and we should manage them as a reactive form. For the List and ListItems do similar, make use of the better fit PrimeNG component, for the Badge if you're undecided you can make use of the modal, but personally I'd use anything that's simple enough and can be dismissed by clicking outside
> - Even if we mock the data, it would be good to consider some caching mechanism for certain queries. Let's consider to have an internal Map inside SportLeaguesAPI service which will cache the responses based on the query.
> - PrimeNg can make use of themes, choose the one you think fits the case and it's free.
> - No need to initialize git. I can take care of that.
>
> Feel free to ask any question in the process of initializing this project.

</details>

### Round 2 — Real API

Once the shell was working, I swapped the mocks for the real **TheSportsDB** endpoints, moved from Promises to **Observables + `HttpClient`**, and kept the existing `SportLeague` / `LeagueFilters` interfaces by mapping raw API shapes inside the service. Caching is preserved via `shareReplay`-backed `Map`s keyed by query.

The endpoints in play:

- `all_leagues.php` — list when no sport filter is active
- `search_all_leagues.php?s=<Sport>` — one call per selected sport, results merged + deduped by id
- `all_sports.php` — populates the sport filter
- `search_all_seasons.php?badge=1&id=<id>` — fetches the badge image lazily

Mocks were moved to `src/api/mocks.ts` for offline reference, not deleted.

### Round 3 — `rxResource` for the badge

The badge endpoint is separate from the league list, so it only needs to fire on row click. I asked Claude whether moving to `resource` made sense, and it recommended **`rxResource`** specifically — the service already returns Observables, so an Observable-loader avoided `firstValueFrom` glue and kept the service as the single transform boundary.

The refactor collapsed a `Subject` + `switchMap` + three manual signals (`badgeUrl`, `badgeLoading`, `badgeError`) into one declarative resource — about a **40% reduction** in the `List` component's TypeScript. Free wins:

- Returning `undefined` from `params` puts the resource in idle (no flicker on close).
- Switching leagues mid-flight auto-cancels the previous HTTP request.
- `reload()` is available if a "Try again" affordance is added later.

## Time spent

Approximate breakdown of the 90-minute budget:

| Step | Time |
| --- | --- |
| Sorting out the Claude subscription | ~10 min |
| Crafting the first prompt | ~5 min |
| Each major iteration (mocks → real API → `rxResource`) | ~5 min each |
| **Total active work** | **~60 min** |

The remaining headroom went to reading the generated diffs, sanity-checking PrimeNG/Angular 21 compatibility, and writing this note.
