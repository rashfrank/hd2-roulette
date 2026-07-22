# Helldivers 2 Build Roulette

Two pages, no backend, pure static HTML/CSS/JS:

- **index.html** — build generator. 8 reels: primary, secondary, grenade,
  4 stratagem slots (each locked to a type — see below), booster.
  Includes a warbond filter so you only get gear you actually own.
- **faction.html** — bonus slot machine. 4 reels of Automaton / Illuminate /
  Terminid icons. Land 4 matching in a row to win; anything else flashes
  the screen red and you redeploy (spin again).

## Stratagem slot types

The 4 stratagem reels on the main page each pull from a specific subset,
tagged in `js/data.js` via the `type` field on every stratagem:

| Slot | Type value       | Meaning                          |
|------|------------------|-----------------------------------|
| 1    | `orbital`        | Orbital strikes                   |
| 2    | `eagle`          | Eagle airstrikes                  |
| 3    | `sentry`         | Sentries / turrets                |
| 4    | `support_weapon` | Support weapons                   |

Backpacks (`backpack`) and vehicles (`vehicle`) are tagged too but aren't
wired to a slot right now — nothing uses them yet. If you want a 5th/6th
slot for those, just add a reel in `index.html` with
`data-category="stratagem" data-stype="backpack"` (or `vehicle`) and it'll
work automatically.

## Warbond filter

`js/data.js` has a `WARBONDS` list and every weapon/stratagem/booster has a
`source` field pointing at one of those warbond ids. The filter panel on
the page lets you check off which warbonds you own — unchecked ones get
excluded from the roulette. If a whole category ends up with zero eligible
items (e.g. you unchecked everything), the roulette quietly falls back to
the full list for that category and shows a warning banner instead of
breaking.

## Running it

Just open `index.html` (or `faction.html`) in a browser. If images don't
load from `file://`, run a local server from the project folder:

```
python -m http.server 8000
```

then visit `http://localhost:8000`.

## Editing content

- Weapons/grenades/stratagems/boosters: `js/data.js` — add, remove, rename,
  or re-tag `source`/`type` freely, no build step needed.
- Faction icons: `js/faction.js` → `FACTIONS` array, images live in
  `images/factions/`.
- Sounds: `audio/spin.mp3` (loops during spin), `audio/land.mp3` (plays
  when a reel stops), `audio/fanfare.mp3` (plays on a completed build /
  faction win). Swap files, keep the same names.
