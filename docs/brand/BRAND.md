# Matemind brand and rename spec

Single source for the name, the words and the identifiers. Every rename and every new text follows this file.

## 1. Name

| Item | Value |
|---|---|
| Product name | **Matemind** (capital M only; never "MateMind", "MATEMIND" in prose) |
| Short name in speech | Mate ("ask Mate") — prose only, never an identifier |
| Meaning | *first mate* + *mastermind*. You are the captain; Matemind is the first mate who understands you, splits the work for the crew (your AI agents), keeps watch and reports back |
| Planned site | https://matemind.ai (planned, not yet bought — do not promise it works) |
| Repository | https://github.com/matemind/matemind (planned org; the code lives in a private repo until the org exists) |

## 2. Positioning

Matemind does not orchestrate agents. It understands the user.

1. **The user is the centre.** Matemind learns what you want, your standards and how you decide, and splits a request into tasks you can hand off.
2. **Agents are the crew.** Claude Code, Codex, Cursor, Gemini, OpenCode do the work. Matemind does not compete with them.
3. **Matemind adds what agents lack:** observability, data and reports, and review — so you need to read less and decide less.

## 3. Words

| Use | Text |
|---|---|
| Tagline (EN) | Say what you want. Matemind splits it up, keeps watch, and gives you the bottom line. |
| Tagline (ZH) | 你只管说要什么。Matemind 帮你拆、帮你盯、给你结论。 |
| One-liner (EN) | The first mate for your AI coding agents. |
| One-liner (ZH) | 你的 AI 编程团队的大副。 |
| Easter egg | When a task is accepted, the UI may answer "Aye, captain." (EN only). Never required to understand the product. |

### Voice

Matemind talks like a reliable first mate: the conclusion first, then the reason. No hype, no flattery. If it is not sure, it says so.

| Do | Don't |
|---|---|
| Lead with the conclusion; one idea per sentence | Hype words: "revolutionary", "10x", "magic" |
| Use numbers: sessions, decisions, cost | Pile up jargon: orchestration, multi-agent, swarm |
| Say "I guess" / "not verified" when unsure | Turn "may" into "will" |

## 4. Identifiers (code)

| Old | New | Compatibility |
|---|---|---|
| HAQI, HAPI, Haqi, Hapi (display text) | Matemind | — |
| npm `@jasonczc/haqi` | `matemind` | — |
| platform packages `@jasonczc/haqi-<os>-<arch>` | `@matemind/cli-<os>-<arch>` | — |
| workspace `@hapi/protocol`, `hapi-hub`, `hapi-web`, `hapi-website`, root `hapi` | `@matemind/protocol`, `matemind-hub`, `matemind-web`, `matemind-website`, `matemind` | — |
| CLI binaries `haqi`, `hapi` | `matemind` | Not `mate`: TextMate already installs a `mate` command |
| Env vars `HAPI_*`, `HAQI_*` | `MATEMIND_*` | At start-up, a legacy `HAPI_X`/`HAQI_X` fills `MATEMIND_X` when that is unset |
| Home dir `~/.hapi` | `~/.matemind` | If `~/.matemind` does not exist and `~/.hapi` does, use `~/.hapi` as is (no copy, no move) |
| DB file `hapi.db` | `matemind.db` | In a legacy home, keep using `hapi.db` |
| MCP server name `haqi` / `hapi` (tools `mcp__haqi__*`) | `matemind` (tools `mcp__matemind__*`) | — |
| HTTP headers `x-hapi-*` | `x-matemind-*` | Hub accepts both; CLI sends the new one |
| Agent rules file `HAQI-Agent.md` | `MATEMIND-Agent.md` | Falls back to `HAQI-Agent.md` |
| Web localStorage keys `hapi-*`, `hapi:*` | `matemind-*`, `matemind:*` | One-time copy of old keys on first load |
| Links `github.com/jasonczc/haqi`, `github.com/tiann/hapi` (as "our repo") | `github.com/matemind/matemind` | Credits to tiann/hapi and jasonczc/haqi stay (see 5) |
| `hapi.run` (as "our site") | `matemind.ai` | — |
| Commit credit line `via [HAQI](https://hapi.run)` | `via [Matemind](https://matemind.ai)` | — |

## 5. Credits (must keep)

AGPL-3.0 stays. Matemind is derived from:

- **hapi** by weishu (tiann) — https://github.com/tiann/hapi (AGPL-3.0)
- **haqi** by jasonczc — https://github.com/jasonczc/haqi (AGPL-3.0)
- **happy-cli** by Kirill Dubovitskiy — https://github.com/slopus/happy-cli (MIT)

Keep every existing copyright line and licence text. Add, never remove.

## 6. Visual identity

### The mark: ink-brush sail

Three curved brush strokes form a sail full of wind; one sunset-coloured swash under it is the bottom line. The sail is what you want, the three strokes are the work Matemind splits it into, the swash is the conclusion it brings back.

- **Curve:** the three strokes share one leading edge that bulges outward, and each stroke arches a little.
- **Brush:** slightly uneven edges; near the tail of each stroke a few thin "flying white" streaks (dry brush) let the paper show through. The swash presses down on the left and lifts off on the right.
- **No mast:** the right ends of the strokes line up and imply it. Empty space reads better than a drawn line, and at small sizes a mast is only a hairline.
- **Two drawings:** the full one (with dry-brush streaks) from 40 px up; the small one (same curves, no streaks) for 16–40 px.

Decided 2026-10-21, after the flat "split sail" read as generic SaaS. Directions compared: `concepts/artistic-directions.png`; with or without mast: `concepts/ink-mast-or-not.png`. Earlier marks are in git history.

### Wordmark

| Item | Value |
|---|---|
| Font | Geist SemiBold (600), SIL Open Font License 1.1 (github.com/vercel/geist-font) |
| Tracking | -0.01 em |
| Case | "Matemind", capital M only |
| File | Outlined paths in `matemind-wordmark.svg`; no font needed to show it |
| Live text fallback | `Geist, -apple-system, system-ui, sans-serif`, weight 600 |

In the lockup, the mark is 1.5 x the cap height. The bottom of the bar sits on the text baseline. The gap between mark and text is 0.45 x the cap height.

In the lockup, the mark is 1.5 x the cap height. The bottom of the swash sits near the text baseline.

### Colours

| Role | Light background | Dark background | Note |
|---|---|---|---|
| Sail (ink) | `#141414` | `#f3efe8` (warm off-white) | In the app the sail follows the text colour |
| Bottom-line swash | Sunset gradient, left to right: `#f0a95c` → `#e2735a` → `#d96aa8` | same | From the warm avatar-orb families; tokens `--brand-bar-0..2` |
| App icon | Rice-paper tile `#f4efe6`, ink sail, sunset swash | same | One icon for light and dark home screens |
| Wordmark | `#09090b` | `#fafafa` | `--social-fg` |

The sunset belongs to the logo only. In the UI, brand red (`#ff3040`) still means unread, and the story ring still means live.

### Clear space and minimum size

1. Clear space: at least 25% of the mark height on every side, for the mark and the lockup.
2. Below 40 px use the small drawing (`matemind-mark-small.svg`); the generator picks it for favicons and the 64 px PWA icon.
3. Lockup minimum: 20 px mark height. Below that, use the mark alone.
4. Single colour (Safari pinned tab, notification badge, print): `matemind-mark-mono.svg`.

### Do and don't

| Do | Don't |
|---|---|
| Keep colour on the swash only; use the mono mark when colour is not available | Colour the sail, or add colours to the swash |
| Use the generated files; regenerate after any change | Redraw by hand, add a mast, straighten the curves, or remove the swash |
| Use the rice-paper tile for app icons | Put the mark on an orange or warm tile, rotate it, or add text inside |

### Assets (`docs/brand/assets/`)

| File | Use |
|---|---|
| `matemind-mark.svg`, `matemind-mark-dark.svg` | Full mark for light / dark backgrounds |
| `matemind-mark-small.svg` | Small drawing for 16–40 px |
| `matemind-mark-mono.svg` | Single colour (mask icons, badges) |
| `matemind-wordmark.svg`, `matemind-wordmark-dark.svg` | Wordmark, outlined |
| `matemind-lockup.svg`, `matemind-lockup-dark.svg` | Mark + wordmark |
| `matemind-app-icon.svg` | App icon master: rice-paper tile, ink mark |
| `matemind-badge-96.png` | White mark on transparent, for Android notification badges |
| `matemind-social.png` | 1280 x 640 social preview |
| `*.png` | Renders of the files above |

All files, and the path data of the in-app `<MatemindMark>` (`web/src/components/brand/matemindMarkPaths.ts`), are generated by `docs/brand/tools/render-assets.mjs` from `docs/brand/tools/ink-mark.mjs`.
