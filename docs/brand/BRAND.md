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
