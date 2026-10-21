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

### The mark: split sail

The mark is a sail cut into three bands, set on one bar. The sail is what you want. The bands are the work Matemind splits it into. The bar is the bottom line it brings back. We picked it over "Common ground" (two overlapping rings) and "Lookout" (a porthole): it tells the tagline in one shape, reads as a sail at 16 px, and needs no colour to work.

Concepts and the contact sheet: `docs/brand/concepts/`.

### Wordmark

| Item | Value |
|---|---|
| Font | Geist SemiBold (600), SIL Open Font License 1.1 (github.com/vercel/geist-font) |
| Tracking | -0.01 em |
| Case | "Matemind", capital M only |
| File | Outlined paths in `matemind-wordmark.svg`; no font needed to show it |
| Live text fallback | `Geist, -apple-system, system-ui, sans-serif`, weight 600 |

In the lockup, the mark is 1.5 x the cap height. The bottom of the bar sits on the text baseline. The gap between mark and text is 0.45 x the cap height.

### Colours

The colours come from inside the app, so the logo and the session list look like one product (decided 2026-10-21).

| Role | Value | Source in the app |
|---|---|---|
| Mark: sail and bar | Linear gradient, bottom-left to top-right: `#feda75` → `#fa7e1e` → `#d62976` → `#962fbf` → `#4f5bd5` | The "live" story ring (`--ring-live`); tokens `--brand-sail-0..4` |
| App icon tile | A session orb: base `#b86ad8` → `#5b8def`, with soft glows `#e870a6` (top-left), `#7f7be0` (right), `#f0a95c` (bottom) | Avatar orb families 0, 2 and 3 (`--orb-*`) |
| Mark on the app icon | White `#ffffff` | — |
| Wordmark | `#09090b` on light, `#fafafa` on dark | `--social-fg` |

The gradient works on light and dark backgrounds, so there is one mark file for both. The gradient belongs to the logo only. In the UI, the same colours still mean "live" on a session ring, and brand red (`#ff3040`) still means unread.

### Clear space and minimum size

1. Clear space: keep empty space of at least 25% of the mark height on every side. This applies to the mark and to the lockup.
2. Minimum size: 16 px. Below 32 px, prefer the app icon (white mark on the orb tile); the white bands stay readable there.
3. Lockup minimum: 20 px mark height (the wordmark is then about 85 px wide). Below that, use the mark alone.
4. Single colour (Safari pinned tab, notification badge, print): use `matemind-mark-mono.svg`. The bar takes the same colour as the sail.

### Do and don't

| Do | Don't |
|---|---|
| Use the gradient mark, or the mono mark when colour is not available | Fill the bands with different colours, or use colours outside the gradient |
| Keep the bar under the sail and full width | Remove the bar, or show the sail without its gaps |
| Use the orb tile with the white mark for app icons | Rotate, outline, add shadows, or add text inside the mark |

The first version (black sail, blue bar, dark tile) is in git history; the three colour options compared on 2026-10-21 are in `concepts/colour-options.png`.

### Assets (`docs/brand/assets/`)

| File | Use |
|---|---|
| `matemind-mark.svg` | Gradient mark, for light and dark backgrounds |
| `matemind-mark-mono.svg` | Single colour (mask icons) |
| `matemind-wordmark.svg`, `matemind-wordmark-dark.svg` | Wordmark, outlined |
| `matemind-lockup.svg`, `matemind-lockup-dark.svg` | Mark + wordmark |
| `matemind-app-icon.svg` | App icon master: orb tile, white mark |
| `matemind-badge-96.png` | White mark on transparent, for Android notification badges |
| `matemind-social.png` | 1280 x 640 social preview |
| `*.png` | Renders of the files above |

All icons are generated by `docs/brand/tools/render-assets.mjs`.
