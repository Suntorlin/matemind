# Installation

Install the Matemind CLI and set up the hub.

## Prerequisites

- Claude Code, OpenAI Codex CLI, Cursor Agent CLI, Google Gemini CLI, or OpenCode CLI installed

Verify your CLI is installed:

```bash
# For Claude Code
claude --version

# For OpenAI Codex CLI
codex --version

# For Cursor Agent CLI
agent --version

# For Google Gemini CLI
gemini --version

# For OpenCode CLI
opencode --version
```

## Architecture

Matemind has three components:

| Component | Role | Required |
|-----------|------|----------|
| **CLI** | Wraps AI agents (Claude/Codex/Cursor/Gemini/OpenCode), runs sessions | Yes |
| **Hub** | Central coordinator: persistence, real-time sync, remote access | Yes |
| **Runner** | Background service for remote session spawning | Optional |

### How they work together

```
┌─────────────────────────────────────────────────────┐
│              Your Machine                           │
│                                                     │
│  ┌─────────┐    Socket.IO    ┌─────────────┐       │
│  │  CLI    │◄───────────────►│    Hub      │       │
│  │+ Agent  │                 │  + SQLite   │       │
│  └─────────┘                 └──────┬──────┘       │
│       ▲                             │ SSE          │
│       │ spawn                       ▼              │
│  ┌────┴────┐                 ┌─────────────┐       │
│  │ Runner  │◄────RPC────────►│   Web App   │       │
│  │(背景)   │                 └─────────────┘       │
│  └─────────┘                                       │
└─────────────────────────────────────────────────────┘
                    │
           [Tunnel / Public URL]
                    │
              ┌─────▼─────┐
              │ Phone/Web │
              └───────────┘
```

- **CLI**: Start a session with `matemind`. The CLI wraps your AI agent and syncs with the hub.
- **Hub**: Run `matemind hub`. Stores sessions, handles permissions, enables remote access.
- **Runner**: Run `matemind runner start`. Lets you spawn sessions from phone/web without keeping a terminal open.

### Typical workflows

**Local only**: `matemind hub` → `matemind` → work in terminal

**Remote access**: `matemind hub --relay` → `matemind runner start` → control from phone/web

## Install the CLI

```bash
npm install -g matemind --registry=https://registry.npmjs.org
```

> Recommendation: use the official npm registry for global install. Some mirrors may not sync platform packages in time.

## Other install options

<details>
<summary>npx (no install)</summary>

```bash
npx matemind
```
</details>

<details>
<summary>Prebuilt binary</summary>

Download the latest release from [GitHub Releases](https://github.com/matemind/matemind/releases).

```bash
xattr -d com.apple.quarantine ./matemind
chmod +x ./matemind
sudo mv ./matemind /usr/local/bin/
```
</details>

<details>
<summary>Build from source</summary>

```bash
git clone https://github.com/matemind/matemind.git
cd matemind
bun install
bun build:single-exe

# The binary is written to cli/dist-exe/bun-<os>-<arch>/matemind
./cli/dist-exe/bun-darwin-arm64/matemind
```
</details>

## Hub setup

The hub can be deployed on:

- **Local desktop** (default) - Run on your development machine
- **Remote host** - Deploy the hub on a VPS, cloud host, or any machine with network access

### Default: Public Relay (recommended)

```bash
matemind hub --relay
```

The terminal displays a URL and QR code. Scan to access from anywhere.

`matemind server` remains supported as an alias.

- **End-to-end encrypted** with WireGuard + TLS
- No configuration needed
- Works behind NAT, firewalls, and any network

> **Tip:** The relay uses UDP by default. If you experience connectivity issues, set `MATEMIND_RELAY_FORCE_TCP=true` to force TCP mode.

### Local Only

```bash
matemind hub
# or
matemind hub --no-relay
```

The hub listens on `http://localhost:3006` by default.

On first run, Matemind:

1. Creates `~/.matemind/`
2. Generates a secure access token
3. Prints the token and saves it to `~/.matemind/settings.json`

<details>
<summary>Config files</summary>

```
~/.matemind/
├── settings.json      # Main configuration
├── matemind.db        # SQLite database (hub)
├── runner.state.json  # Runner process state
└── logs/             # Log files
```

Upgrading from HAQI or hapi: if `~/.matemind` does not exist and `~/.hapi` does, Matemind uses `~/.hapi` as is. It keeps using `hapi.db` there.
</details>

<details>
<summary>Environment variables</summary>

| Variable | Default | settings.json | Description |
|----------|---------|---------------|-------------|
| `CLI_API_TOKEN` | Auto-generated | `cliApiToken` | Shared secret for authentication |
| `MATEMIND_API_URL` | `http://localhost:3006` | `apiUrl` | Hub URL for CLI connections |
| `MATEMIND_LISTEN_HOST` | `127.0.0.1` | `listenHost` | Hub HTTP bind address |
| `MATEMIND_LISTEN_PORT` | `3006` | `listenPort` | Hub HTTP port |
| `MATEMIND_PUBLIC_URL` | - | `publicUrl` | Public URL for external access |
| `CORS_ORIGINS` | - | `corsOrigins` | Allowed CORS origins (comma-separated) |
| `TELEGRAM_BOT_TOKEN` | - | `telegramBotToken` | Telegram Bot API token |
| `TELEGRAM_NOTIFICATION` | `true` | `telegramNotification` | Enable Telegram notifications |
| `MATEMIND_RELAY_FORCE_TCP` | `false` | - | Force TCP mode for relay |
| `VAPID_SUBJECT` | `mailto:admin@hapi.run` | - | Web Push contact info |
| `MATEMIND_HOME` | `~/.matemind` | - | Config directory path |
| `DB_PATH` | `~/.matemind/matemind.db` | - | Database file path |
| `ELEVENLABS_API_KEY` | - | - | ElevenLabs API key for voice |
| `ELEVENLABS_AGENT_ID` | Auto-created | - | Custom ElevenLabs agent ID |

Legacy `HAPI_*` and `HAQI_*` variables still work. At start-up, a legacy `HAPI_X` or `HAQI_X` fills `MATEMIND_X` when `MATEMIND_X` is unset.
</details>

<details>
<summary>settings.json example</summary>

Configuration priority: **ENV > settings.json > default**

When ENV values are set and not present in settings.json, they are automatically saved.

```json
{
  "$schema": "https://raw.githubusercontent.com/matemind/matemind/main/docs/public/schemas/settings.schema.json",
  "listenHost": "0.0.0.0",
  "listenPort": 3006,
  "publicUrl": "https://your-domain.com"
}
```

JSON Schema: [settings.schema.json](https://github.com/matemind/matemind/blob/main/docs/public/schemas/settings.schema.json)
</details>

## CLI setup

If the hub is not on localhost, set these before running `matemind`:

```bash
export MATEMIND_API_URL="http://your-hub:3006"
export CLI_API_TOKEN="your-token-here"
```

Or use interactive login:

```bash
matemind auth login
```

Authentication commands:

```bash
matemind auth status
matemind auth login
matemind auth logout
```

Each machine gets a unique ID stored in `~/.matemind/settings.json`. This allows:

- Multiple machines to connect to one hub
- Remote session spawning on specific machines
- Machine health monitoring

## Operations

### Self-hosted tunnels

If you prefer not to use the public relay (e.g., for lower latency or self-managed infrastructure), you can use these alternatives:

<details>
<summary>Cloudflare Tunnel</summary>

https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/

> **Note:** Cloudflare Quick Tunnels (TryCloudflare) are not supported because they [do not support SSE](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/), which Matemind uses for real-time updates. Use a Named Tunnel instead.

**Named tunnel setup:**

```bash
# Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

# Create and configure a named tunnel
cloudflared tunnel create matemind
cloudflared tunnel route dns matemind matemind.example.com

# Run the tunnel
cloudflared tunnel --protocol http2 run matemind
```

> **Tip:** Use `--protocol http2` instead of QUIC (the default) to avoid potential timeout issues with long-lived connections.

</details>

<details>
<summary>Tailscale</summary>

https://tailscale.com/download

```bash
sudo tailscale up
matemind hub
```

Access via your Tailscale IP:

```
http://100.x.x.x:3006
```
</details>

<details>
<summary>Public IP / Reverse Proxy</summary>

If the hub has a public IP, access directly via `http://your-hub-ip:3006`.

Use HTTPS (via Nginx, Caddy, etc.) for production.

**Self-signed certificates (HTTPS)**

If `MATEMIND_API_URL` is set to an `https://...` URL with a self-signed (or otherwise untrusted) certificate, the CLI may fail with:

```
Error: self signed certificate
```

Recommended fixes (in order):

1. Use a publicly trusted certificate (e.g., Let's Encrypt)
2. Trust your private CA (recommended for private networks)
3. Dev-only workaround: disable TLS verification (insecure)

```bash
# Preferred: trust your own CA
export NODE_EXTRA_CA_CERTS="/path/to/your-ca.pem"

# Dev-only workaround: disable TLS verification (INSECURE)
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

If you use the dev-only workaround, assume MITM risk; do not use on public networks.

</details>

### Telegram setup

Enable Telegram notifications and Mini App access:

1. Message [@BotFather](https://t.me/BotFather) and create a bot
2. Set the bot token and public URL
3. Start the hub and bind your account

```bash
export TELEGRAM_BOT_TOKEN="your-bot-token"
export MATEMIND_PUBLIC_URL="https://your-public-url"

matemind hub
```

Then message your bot with `/start`, open the app, and enter your `CLI_API_TOKEN`.

**Troubleshooting:**

- If binding fails, verify `MATEMIND_PUBLIC_URL` is accessible from the internet
- Telegram Mini App requires HTTPS (not HTTP)

### Runner setup

Run a background service for remote session spawning:

```bash
matemind runner start
matemind runner status
matemind runner logs
matemind runner stop
```

With the runner running:

- Your machine appears in the "Machines" list
- You can spawn sessions remotely from the web app
- Sessions persist even when the terminal is closed

<details>
<summary>Alternative: pm2</summary>

If you prefer pm2 for process management:

```bash
pm2 start "matemind runner start --foreground" --name matemind-runner
pm2 save
```
</details>

### Background service deployment

Keep Matemind running persistently so it survives terminal closes, system restarts, and continues running in the background.

<details>
<summary>Quick: nohup</summary>

Simple one-liner for quick background runs:

```bash
# Hub
nohup matemind hub --relay > ~/.matemind/logs/hub.log 2>&1 &

# Runner
nohup matemind runner start --foreground > ~/.matemind/logs/runner.log 2>&1 &
```

View logs:

```bash
tail -f ~/.matemind/logs/hub.log
tail -f ~/.matemind/logs/runner.log
```

Stop processes:

```bash
pkill -f "matemind hub"
pkill -f "matemind runner"
```
</details>

<details>
<summary>pm2 (recommended for Node.js users)</summary>

pm2 provides process management with auto-restart on crashes and system reboot.

```bash
# Install pm2
npm install -g pm2

# Start hub and runner
pm2 start "matemind hub --relay" --name matemind-hub
pm2 start "matemind runner start --foreground" --name matemind-runner

# View status and logs
pm2 status
pm2 logs matemind-hub
pm2 logs matemind-runner

# Auto-restart on system reboot
pm2 startup    # Follow the printed instructions
pm2 save       # Save current process list
```
</details>

<details>
<summary>macOS: launchd</summary>

Create plist files for automatic startup on macOS.

**Hub** (`~/Library/LaunchAgents/com.matemind.hub.plist`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.matemind.hub</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/matemind</string>
        <string>hub</string>
        <string>--relay</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/YOUR_USERNAME/.matemind/logs/hub.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/YOUR_USERNAME/.matemind/logs/hub.log</string>
</dict>
</plist>
```

**Runner** (`~/Library/LaunchAgents/com.matemind.runner.plist`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.matemind.runner</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/matemind</string>
        <string>runner</string>
        <string>start</string>
        <string>--foreground</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/YOUR_USERNAME/.matemind/logs/runner.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/YOUR_USERNAME/.matemind/logs/runner.log</string>
</dict>
</plist>
```

Load/unload services:

```bash
# Load (start)
launchctl load ~/Library/LaunchAgents/com.matemind.hub.plist
launchctl load ~/Library/LaunchAgents/com.matemind.runner.plist

# Unload (stop)
launchctl unload ~/Library/LaunchAgents/com.matemind.hub.plist
launchctl unload ~/Library/LaunchAgents/com.matemind.runner.plist
```

> **macOS sleep note:** macOS may suspend background processes when the display sleeps. Use `caffeinate` to prevent this:
> ```bash
> caffeinate -dimsu matemind hub --relay
> ```
> Or run `caffeinate -dimsu` in a separate terminal while Matemind is running.
</details>

<details>
<summary>Linux: systemd</summary>

Create user-level systemd services for automatic startup.

**Hub** (`~/.config/systemd/user/matemind-hub.service`):

```ini
[Unit]
Description=Matemind Hub
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/matemind hub --relay
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

**Runner** (`~/.config/systemd/user/matemind-runner.service`):

```ini
[Unit]
Description=Matemind Runner
After=network.target matemind-hub.service

[Service]
Type=simple
ExecStart=/usr/local/bin/matemind runner start --foreground
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

Enable and start:

```bash
# Reload systemd
systemctl --user daemon-reload

# Enable (auto-start on login)
systemctl --user enable matemind-hub
systemctl --user enable matemind-runner

# Start now
systemctl --user start matemind-hub
systemctl --user start matemind-runner

# View status/logs
systemctl --user status matemind-hub
journalctl --user -u matemind-hub -f
```

> **Persist after logout:** To keep services running even when not logged in:
> ```bash
> loginctl enable-linger $USER
> ```
</details>

### Voice assistant setup

Enable voice control:

1. Get an API key from [elevenlabs.io](https://elevenlabs.io/app/settings/api-keys)
2. Set the environment variable:

```bash
export ELEVENLABS_API_KEY="your-api-key"
matemind hub --relay
```

See [Voice Assistant](./voice-assistant.md) for usage details.

### Security notes

- Keep tokens secret and rotate if needed
- Use HTTPS for public access
- Restrict CORS origins in production

<details>
<summary>Firewall example (ufw)</summary>

```bash
ufw allow from 192.168.1.0/24 to any port 3006
```
</details>
