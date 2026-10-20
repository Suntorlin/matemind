# Why Matemind?

Matemind is hapi plus a layer that understands you. It keeps hapi's local-first design. It adds memory, observability, reports and review on top.

## TL;DR

| Question | Answer |
|---|---|
| What does Matemind keep from hapi? | Local-first hub, single binary, relay, remote control, approvals, terminal, voice, PWA, Telegram Mini App |
| What does Matemind add? | Memory from your own words, group chat between sessions, reports with share links, a review loop, tools to organise many sessions, multiple Claude accounts |
| What does hapi have that Matemind does not? | Native iOS and Android apps, and any upstream feature added after the fork |
| Who should pick Matemind? | You run many agent sessions and want fewer things to read and decide |
| Who should pick hapi? | You want native mobile apps, or a smaller tool that only does remote control |

## What Matemind adds to hapi

hapi lets you control your agent sessions from your phone. Matemind starts from you, not from the sessions. You are the captain. Your agents are the crew. Matemind is the first mate.

### Understand you

- **Memory from your own words.** The hub reads your own messages and proposes lasting rules. Each rule keeps your exact quote. You approve each rule before it counts.
- **Agent proposals wait.** Agents can call `memory_propose`. Matemind only watches these proposals. A proposal goes to you after 3 mentions in 30 days, or when you say the same thing. An agent cannot claim that you said something.
- **Group chat between sessions.** `@name` sends a task to one session. `@all` sends it to every online member. One member keeps a shared group note with roles, goal, progress, to-dos and risks.

Memory is experimental. It records and asks for approval. It does not yet add approved memories to sessions.

### Keep watch

- **Organise many sessions.** Tags, tasks, pin to top and snooze. They sync across devices.
- **Phone-first list.** A chat-app style list with a pinned row and LIVE / ASK badges, so you see at a glance which session needs you.
- **Multiple Claude accounts.** See the quota left on each account and switch by hand. An experimental option switches when an account hits its limit.
- **Usage and cost.** Token totals and cost estimates from local Claude and Codex logs.

### Bottom line

- **Reports.** Agents publish reports through MCP tools (`mcp__matemind__report_*`). A report can get a public share link.
- **Review loop.** A reviewer session checks a worker session against your acceptance criteria. It passes the work, sends it back, stops, or asks you.
- **Brief view.** Show only the conclusion of each turn, the replies, or all steps.

## What hapi has that Matemind does not

We want you to pick the right tool. These are the gaps we know of.

- **Native mobile apps.** Upstream hapi has native iOS (SwiftUI/UIKit) and Android (Kotlin Compose) clients. Matemind has only the web app, which you can install as a PWA.
- **Newer upstream features.** hapi keeps moving. Check the [hapi README](https://github.com/tiann/hapi) for features added after Matemind forked. We have not checked each one against Matemind.
- **The relay service.** `matemind hub --relay` uses the relay that upstream hapi runs (`relay.hapi.run` by default). Matemind does not run its own relay yet.
- **Simplicity.** Matemind has more screens and more settings. If you only need remote control, hapi is smaller.

## Matemind and Happy

[Happy](https://github.com/slopus/happy) is an excellent project. hapi was built as a local-first alternative to it, and Matemind keeps that choice.

**The short answer**: Happy uses a centralized server that stores your encrypted data. Matemind is decentralized: each user runs their own hub, and the relay server only forwards encrypted traffic without storing anything.

| Aspect | Happy | Matemind |
|--------|-------|----------|
| **Architecture** | Centralized (cloud server stores encrypted data) | Decentralized (each user runs own hub) |
| **Data** | Encrypted on server (server cannot read) | Stays on your machine |
| **Encryption** | Application-layer E2EE (client encrypts before sending) | WireGuard + TLS via relay; or none needed if self-hosted |
| **Deployment** | Multiple services (PostgreSQL, Redis, app server) | Single binary |

## Architecture: Happy vs Matemind

### Happy: Centralized Cloud

Happy's centralized design requires:

- **Application-layer E2EE** — Clients encrypt before sending; the server stores encrypted blobs it cannot read
- **Distributed database + cache** — PostgreSQL + Redis for multi-user scaling
- **Complex deployment** — Docker, multiple services, config files

```
┌─────────────────────────────────────────────────────────────────────────┐
│                             PUBLIC INTERNET                             │
│                                                                         │
│   ┌─────────────┐                    ┌─────────────────────────────────┐│
│   │             │                    │        Cloud Server             ││
│   │  Mobile App │◄───── E2EE ───────►│                                 ││
│   │             │                    │  ┌─────────────────────────────┐││
│   └─────────────┘                    │  │   Encrypted Database        │││
│                                      │  │   (server cannot read)      │││
│                                      │  └─────────────────────────────┘││
│                                      └────────────────┬────────────────┘│
│                                                       │ E2EE            │
└───────────────────────────────────────────────────────┼─────────────────┘
                                                        ▼
                                             ┌───────────────────┐
                                             │       CLI         │
                                             │ (holds the keys)  │
                                             └───────────────────┘
```

The server stores encrypted data — it never sees plaintext, but it does hold your data.

### Matemind: Decentralized

Matemind keeps this design from hapi. Each user runs their own hub. Matemind offers two modes of remote access:

- **Self-hosted** (own server / Cloudflare Tunnel / Tailscale) — You control the full network path, no E2EE needed
- **Public relay** (`matemind hub --relay`) — E2E encrypted via tunwg (WireGuard + TLS); the relay only forwards opaque packets
- **Single embedded database** — SQLite, no external services
- **One-command deployment** — Single binary, zero config

#### Mode 1: Self-Hosted (own server or tunnel)

You control the entire path. No encryption beyond standard HTTPS is needed.

```
┌────────────────────────────────────────────────────────────────────────┐
│                       YOUR NETWORK / TUNNEL                            │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                   Single Process / Binary                      │   │
│   │                                                                │   │
│   │  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │   │
│   │  │   CLI    │◄──►│   Hub    │◄──►│ Web App  │                  │   │
│   │  └──────────┘    └────┬─────┘    └──────────┘                  │   │
│   │                       │                                        │   │
│   │                       ▼                                        │   │
│   │              ┌────────────────┐                                │   │
│   │              │ Local Database │                                │   │
│   │              │  (plaintext)   │                                │   │
│   │              └────────────────┘                                │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                            │                                           │
│                            ▼ HTTPS                                     │
│               ┌────────────────────────┐                               │
│               │ Cloudflare / Tailscale │                               │
│               │ / Public IP / etc.     │                               │
│               └────────────────────────┘                               │
└────────────────────────────────────────────────────────────────────────┘
```

#### Mode 2: Public Relay (E2E encrypted)

The relay server only forwards encrypted packets — it cannot read your data.

```
┌────────────────────────────────────────────────────────────────────────┐
│                       YOUR MACHINE                                     │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                   Single Process / Binary                      │   │
│   │                                                                │   │
│   │  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │   │
│   │  │   CLI    │◄──►│   Hub    │◄──►│ Web App  │                  │   │
│   │  └──────────┘    └────┬─────┘    └──────────┘                  │   │
│   │                       │                                        │   │
│   │                       ▼                                        │   │
│   │              ┌────────────────┐                                │   │
│   │              │ Local Database │                                │   │
│   │              │  (plaintext)   │                                │   │
│   │              └────────────────┘                                │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                            │                                           │
│                            ▼ tunwg (WireGuard + TLS)                   │
└────────────────────────────┼───────────────────────────────────────────┘
                             │ E2E encrypted
                    ┌────────▼────────┐
                    │  Relay Server   │
                    │  (forwards only,│
                    │  cannot read)   │
                    └────────┬────────┘
                             │ E2E encrypted
                    ┌────────▼────────┐
                    │  Your Phone /   │
                    │  Browser        │
                    └─────────────────┘
```

## Key Differences

### Data Location

| Aspect | Happy | Matemind |
|--------|-------|------|
| **Where data lives** | Cloud server (encrypted blobs) | Your own machine |
| **Who stores it** | Central server holds encrypted data | Only your hub, locally |
| **Data at rest** | Encrypted (server cannot read) | Plaintext (protected by OS) |
| **Server's role** | Stores encrypted data + syncs devices | Relay only forwards (or no server at all if self-hosted) |

### Deployment Model

**Happy** requires orchestrating multiple components:

```
┌───────────────────────────────────────────────────────────────────┐
│   Distributed Services (4+ components)                            │
│                                                                   │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│   │ Database │  │  Cache   │  │ Storage  │  │  Server  │          │
│   │(Postgres)│  │ (Redis)  │  │ (Files)  │  │(Node.js) │          │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
│                                                                   │
│   Requires: Container orchestration, multiple config files        │
└───────────────────────────────────────────────────────────────────┘
```

**Matemind** bundles everything:

```
┌───────────────────────────────────────────────────────────────────┐
│   Single Binary (everything bundled)                              │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────────┐ │
│   │  CLI + Hub + Web App + Database (SQLite, embedded)          │ │
│   └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│   Requires: One command to run                                    │
└───────────────────────────────────────────────────────────────────┘
```

### Security Approach

| Aspect | Happy | Matemind (self-hosted) | Matemind (relay) |
|--------|-------|-------------------|--------------|
| **Problem** | Data on untrusted server | Remote access to local hub | Remote access via third-party relay |
| **Solution** | Application-layer E2EE | HTTPS (you control the path) | WireGuard + TLS (tunwg) |
| **Key management** | Client holds keys; server never sees plaintext | Not needed | Handled by tunwg automatically |
| **Data at rest** | Encrypted on server | Plaintext on your machine | Plaintext on your machine |

## Why Different Architectures?

### Happy: Centralized

```
Goal: Multi-user cloud platform
         │
         ├──► Server stores user data
         │         └──► Must encrypt everything (application-layer E2EE)
         │
         ├──► Many concurrent users on one server
         │         └──► Must scale horizontally (PostgreSQL, Redis)
         │
         └──► Multiple devices per user
                   └──► Must sync encrypted state across devices
```

**Result**: Sophisticated infrastructure with zero-knowledge server

### Matemind: Decentralized

```
Goal: Self-hosted tool — each user runs their own hub
         │
         ├──► Data never leaves your machine
         │         └──► No application-layer E2EE needed
         │
         ├──► Each user has their own hub
         │         └──► No horizontal scaling needed; unlimited users in aggregate
         │
         ├──► Self-hosted access (own server/tunnel)
         │         └──► You control the full path — HTTPS sufficient
         │
         └──► Public relay access
                   └──► WireGuard + TLS (tunwg) — relay forwards only
```

**Result**: Simple, portable, one-command deployment

## Summary

| Dimension | Happy | hapi | Matemind |
|-----------|-------|------|----------|
| **Architecture** | Centralized cloud server | Each user runs own hub | Each user runs own hub |
| **Data location** | Server (encrypted) | Your machine | Your machine |
| **Deployment** | Multiple services | Single binary | Single binary |
| **Focus** | Managed cloud service | Remote control of sessions | Understanding the user; watching and reviewing many sessions |
| **Native mobile apps** | Yes | Yes | No (web app and PWA only) |
