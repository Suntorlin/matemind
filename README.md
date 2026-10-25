<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/brand/assets/matemind-lockup-dark.svg">
  <img alt="Matemind" src="docs/brand/assets/matemind-lockup.svg" width="360">
</picture>

English | [简体中文](README.zh-CN.md)

**Say what you want. Matemind splits it up, keeps watch, and gives you the bottom line.**

The first mate for your AI coding agents.

**[Try the live demo →](https://suntorlin.github.io/matemind/)** It runs in your browser with demo data; no install, no AI calls. <!-- public-safety: allow -->

![Matemind on the phone: session list, a chat that leads with the conclusion, and group chat between sessions](docs/assets/screenshots/phones.png)

![Matemind on the desktop](docs/assets/screenshots/desktop.png)

<sub>Screenshots use demo data.</sub>

## What is Matemind

Matemind does not orchestrate agents. It learns what you want, your standards and how you decide.
Your AI agents (Claude Code, Codex, Cursor, Gemini, OpenCode) are the crew, and they do the work.
Matemind adds what they lack: it watches the sessions, collects reports and runs reviews, so you read less and decide less.

Matemind runs on your own machines. You control it from a phone or a browser.

## Features

### Highlights

These three features are new. They work end to end.

#### Tasks

Write what you want in one message. Matemind runs the work and asks you only when it needs you.

1. A planner session reads your repository and your memory. It writes a goal, 3 to 6 acceptance criteria, and up to 3 questions.
2. You tick, edit, or add criteria. You answer the questions.
3. A lead session splits the work into up to 5 subtasks. Up to 3 subtasks run at the same time. Each subtask runs in its own git worktree.
4. When an agent needs a decision, you get 2 to 4 options. Each option shows its gain and its cost.
5. A merge session joins the branches into one local branch. Matemind does not push.
6. A reviewer session checks each acceptance criterion and gives evidence. A failed criterion starts a fix round. The limit is 2 review rounds.
7. You get one report with a share link. You accept the report, or you write what to change.

Tasks use Claude Code. All the sessions of one task run on one machine.

#### Scheduled tasks

Scheduled tasks are like the scheduled tasks of Claude Desktop. The difference: the hub keeps the clock, so no app must stay open.

- Write a prompt, or give a file of instructions. Each run reads the file again.
- Select the machine, the folder, the agent, the model, and the Claude account.
- Select the schedule: manual, hourly, daily, weekdays, weekly, cron, or one time. The times use your time zone.
- Each run starts a new session. The session reports its result with the `scheduled_run_done` MCP tool.
- If the hub or the machine was off at the planned time, the run starts late. It starts one time, and only if the planned time is less than 7 days old.
- A run fails when no session can start. A run also fails when its session stops without a result, or when the run passes its time limit.
- Each failure goes to push, Telegram, and a Feishu or Lark webhook.
- If a Claude account cannot start (for example, its login expired), the next account in its group starts the run.
- Agents can create and change scheduled tasks with the `schedule_create`, `schedule_list`, and `schedule_update` MCP tools.

#### Multiple machines

One hub controls many machines. Each machine runs its own runner, and all runners connect to the same hub.

- Select the machine when you start a session or create a scheduled task. Matemind keeps a list of recent folders for each machine.
- Each machine has its own Claude accounts. Settings shows the accounts and the quota of each machine.
- The terminal and the file browser of a session open on the machine of that session.
- Give each machine its own home folder (`MATEMIND_HOME`). If two machines use a copy of one home folder, they share one machine ID, and the hub cannot tell them apart.


### Understand you

- **Memory from your own words.** The hub reads your own messages and proposes lasting rules. Each rule keeps your exact quote. You approve each rule before it counts.
- **Agents can propose memories too.** Agents call the `memory_propose` and `memory_search` MCP tools. An agent proposal waits until it comes up 3 times in 30 days, or until you say the same thing.
- **Group chat between sessions.** Put several sessions in one group. Write `@name` to send a task to one session, or `@all` to send it to every online member. One member keeps a shared group note: roles, goal, progress, to-dos, and risks.

Memory is experimental. Today it records and asks for approval. It does not yet add approved memories to sessions. The `MEMORY.md` file that you write in Settings → Memory is added to sessions.

### Keep watch

- **Many sessions, one list.** Tag sessions, group them into tasks, pin the important ones to the top, and snooze the rest until a set time.
- **Phone first.** The chat list looks like a messaging app. Pinned sessions show in a top row with LIVE and ASK badges. Install it as a PWA (Progressive Web App) and get push notifications.
- **Approve from anywhere.** Approve or deny tool requests from the phone, the browser, or Telegram.
- **Multiple Claude accounts.** Add several Claude accounts, see the quota left on each, and switch by hand. An experimental option switches to the next account when one hits its usage limit.
- **Usage and cost.** Settings → Usage shows token totals and cost estimates from local Claude and Codex logs.

### Bottom line

- **Reports with share links.** Agents write reports with the `mcp__matemind__report_*` MCP tools. A report can have a public share link (`/share/r/<token>`) that works without a login.
- **Review loop.** Pick a worker session and a reviewer session, then write the requirement and the acceptance criteria. The reviewer passes the work, sends it back with feedback, stops the loop, or asks you. The loop stops at a round limit (10 by default).
- **Brief view.** Pinch the chat to change the detail level: Brief, Reply, or All steps.

### Works with

- **Agents:** Claude Code, OpenAI Codex, Cursor Agent, Google Gemini, OpenCode. Matemind runs the official CLIs. It does not replace them.
- **Seamless handoff:** Work in the terminal, switch to the phone, and press space twice in the terminal to switch back. The session keeps its context.
- **Terminal anywhere:** Open a shell on the working machine from the phone or the browser.
- **Voice:** Talk to your agents through the built-in voice assistant (ElevenLabs).
- **Telegram Mini App:** Optional. Get notifications and approve requests in Telegram.

## Quick start

1. Install the CLI.

   ```bash
   npm i -g matemind
   ```

2. Start the hub with the end-to-end encrypted relay.

   ```bash
   matemind hub --relay
   ```

   The terminal shows a URL, a QR code and an access token. The relay uses WireGuard + TLS.

3. Start a session in your project directory.

   ```bash
   matemind            # Claude Code
   matemind codex      # OpenAI Codex
   matemind cursor     # Cursor Agent
   matemind gemini     # Google Gemini
   matemind opencode   # OpenCode
   ```

4. Open the URL on your phone, or scan the QR code. Log in with the access token.

5. Optional: start the runner. Then you can start new sessions from the phone.

   ```bash
   matemind runner start
   ```

Other commands: `matemind auth status|login|logout`, `matemind runner status|list|logs|stop`, `matemind doctor`, `matemind mcp`. `matemind server` is an alias for `matemind hub`.

For self-hosting (Cloudflare Tunnel, Tailscale), see [Installation](docs/guide/installation.md).

## Migrating from HAQI or hapi

| Item | Old | New | What happens to old data |
|---|---|---|---|
| Command | `haqi`, `hapi` | `matemind` | — |
| npm package | `@jasonczc/haqi` | `matemind` | — |
| Home directory | `~/.hapi` | `~/.matemind` | If `~/.matemind` does not exist and `~/.hapi` does, Matemind uses `~/.hapi` as is. It does not copy or move it. |
| Database file | `hapi.db` | `matemind.db` | In a legacy home, Matemind keeps using `hapi.db`. |
| Environment variables | `HAPI_*`, `HAQI_*` | `MATEMIND_*` | At start-up, a legacy `HAPI_X` or `HAQI_X` fills `MATEMIND_X` when `MATEMIND_X` is unset. |
| MCP tools | `mcp__haqi__*`, `mcp__hapi__*` | `mcp__matemind__*` | — |
| Agent rules file | `HAQI-Agent.md` | `MATEMIND-Agent.md` | Falls back to `HAQI-Agent.md`. |
| Web settings | `hapi-*` keys | `matemind-*` keys | The web app copies the old keys once, on first load. |

## Docs

- [Quick Start](docs/guide/quick-start.md)
- [Installation](docs/guide/installation.md)
- [How it Works](docs/guide/how-it-works.md)
- [App (PWA)](docs/guide/pwa.md)
- [Cursor Agent](docs/guide/cursor.md)
- [Voice Assistant](docs/guide/voice-assistant.md)
- [Why Matemind](docs/guide/why-matemind.md)
- [FAQ](docs/guide/faq.md)

## Build from source

```bash
bun install
bun run build:single-exe
```

The all-in-one binary (CLI + hub + web app) is written to `cli/dist-exe/bun-<os>-<arch>/matemind`.

For development workflows, see [AGENTS.md](AGENTS.md) and the package READMEs: [cli](cli/README.md), [hub](hub/README.md), [web](web/README.md).

## Release

The `Release` workflow publishes `matemind` and the platform packages `@matemind/cli-<os>-<arch>`.

1. Bump the version in `cli/package.json`. It must match the tag.
2. Push a tag such as `v0.16.0`.
3. GitHub Actions builds all binaries, publishes the npm packages, and creates a GitHub Release.

npm must use Trusted Publishing (OIDC) for each package.

## Credits

Matemind is derived from these projects. Thank you to their authors.

- **hapi** by weishu (tiann): https://github.com/tiann/hapi (AGPL-3.0)
- **haqi** by jasonczc: https://github.com/jasonczc/haqi (AGPL-3.0)
- **happy-cli** by Kirill Dubovitskiy: https://github.com/slopus/happy-cli (MIT)

hapi's name came from "哈皮", a Chinese transliteration of [Happy](https://github.com/slopus/happy). See [NOTICE](NOTICE) for the full notices.

## License

[AGPL-3.0](LICENSE). Repository: https://github.com/matemind/matemind
