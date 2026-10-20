# FAQ

## General

### What is Matemind?

Matemind is the first mate for your AI coding agents. It runs Claude Code, Codex, Cursor Agent, Gemini and OpenCode sessions on your own computer. You watch and control them from your phone. Matemind also learns your standards, collects reports and runs reviews, so you read less and decide less.

### What does the name mean?

Matemind = *first mate* + *mastermind*. You are the captain. Your AI agents are the crew. Matemind is the first mate: it understands you, splits the work, keeps watch and reports back.

Matemind is derived from [hapi](https://github.com/tiann/hapi) and [haqi](https://github.com/jasonczc/haqi). See [Why Matemind](./why-matemind.md).

### Is Matemind free?

Yes, Matemind is open source and free to use under the AGPL-3.0-only license.

### What AI agents does Matemind support?

- **Claude Code** (recommended)
- **OpenAI Codex**
- **Cursor Agent**
- **Google Gemini**
- **OpenCode**

## Setup & Installation

### Do I need a hub?

Matemind includes an embedded hub. Just run `matemind hub` on your machine - no external hub required.

`matemind server` remains supported as an alias.

### How do I access Matemind from my phone?

For local network access:
```
http://<your-computer-ip>:3006
```

For internet access:
- If the hub has a public IP, access it directly (use HTTPS via reverse proxy for production)
- If behind NAT, set up a tunnel (Cloudflare Tunnel, Tailscale, or ngrok)

### What's the access token for?

The `CLI_API_TOKEN` is a shared secret that authenticates:
- CLI connections to the hub
- Web app logins
- Telegram account binding

It's auto-generated on first hub start and saved to `~/.matemind/settings.json`.

### Do you support multiple accounts?

Yes, in two ways:

- **Multiple users on one hub.** Namespaces give lightweight multi-user access for shared team hubs. See [Namespace (Advanced)](./namespace.md).
- **Multiple Claude accounts.** Add them in Settings → Claude accounts. You see the quota left on each account and can switch a session by hand. An experimental option switches to the next account when one hits its usage limit.

### I used HAQI or hapi before. Do I lose my data?

No. If `~/.matemind` does not exist and `~/.hapi` does, Matemind uses `~/.hapi` as is. It does not copy or move it. Legacy `HAPI_*` and `HAQI_*` environment variables fill the matching `MATEMIND_*` variables when those are unset.

### Can I use Matemind without Telegram?

Yes. Telegram is optional. You can use the web app directly in any browser or install it as a PWA.

## Usage

### How do I approve permissions remotely?

1. When your AI agent requests permission (e.g., to edit a file), you'll see a notification
2. Open Matemind on your phone
3. Navigate to the active session
4. Approve or deny the pending permission

### How do I receive notifications?

Matemind supports two methods:

1. **PWA Push Notifications** - Enable when prompted, works even when app is closed
2. **Telegram Bot** - See [Telegram Setup](./installation.md#telegram-setup)

### Can I start sessions remotely?

Yes, with runner mode:

1. Run `matemind runner start` on your computer
2. Your machine appears in the "Machines" list in the web app
3. Tap to spawn new sessions from anywhere

### How do I see what files were changed?

In the session view, tap the "Files" tab to:
- Browse project files
- View git status
- See diffs of changed files

### Can I send messages to the AI from my phone?

Yes. Open any session and use the chat interface to send messages directly to the AI agent.

### Can I access a terminal remotely?

Yes. Open a session in the web app and tap the Terminal tab for a remote shell.

### How do I use voice control?

Set `ELEVENLABS_API_KEY`, open a session in the web app, and click the microphone button. See [Voice Assistant](./voice-assistant.md).

## Security

### Is my data safe?

Yes. Matemind is local-first:
- All data stays on your machine
- Nothing is uploaded to external servers
- The database is stored locally in `~/.matemind/`

### How secure is the token authentication?

The auto-generated token is 256-bit (cryptographically secure). For external access, always use HTTPS via a tunnel.

### Can others access my Matemind instance?

Only if they have your access token. For additional security:
- Use a strong, unique token
- Always use HTTPS for external access
- Consider Tailscale for private networking

## Troubleshooting

### "Connection refused" error

- Ensure hub is running: `matemind hub`
- Check firewall allows port 3006
- Verify `MATEMIND_API_URL` is correct

### "Invalid token" error

- Re-run `matemind auth login`
- Check token matches in CLI and hub
- Verify `~/.matemind/settings.json` has correct `cliApiToken`

### Runner won't start

```bash
# Check status
matemind runner status

# Clear stale lock file
rm ~/.matemind/runner.state.json.lock

# Check logs
matemind runner logs
```

### Claude Code not found

Install Claude Code or set custom path:
```bash
npm install -g @anthropic-ai/claude-code
# or
export MATEMIND_CLAUDE_PATH=/path/to/claude
```

### Cursor Agent not found

Install Cursor Agent CLI:
```bash
# macOS/Linux
curl https://cursor.com/install -fsS | bash

# Windows (PowerShell)
irm 'https://cursor.com/install?win32=true' | iex
```

Ensure `agent` is on your PATH.

### How do I run diagnostics?

```bash
matemind doctor
```

This checks hub connectivity, token validity, agent availability, and more.

## Comparison

### Matemind vs Happy

| Aspect | Happy | Matemind |
|--------|-------|------|
| Design | Cloud-first | Local-first |
| Users | Multi-user | Single user |
| Deployment | Multiple services | Single binary |
| Data | Encrypted on server | Never leaves your machine |

See [Why Matemind](./why-matemind.md) for detailed comparison.

### Matemind vs running Claude Code directly

| Feature | Claude Code | Matemind + Claude Code |
|---------|-------------|-------------------|
| Remote access | No | Yes |
| Mobile control | No | Yes |
| Permission approval | Terminal only | Phone/web |
| Session persistence | No | Yes |
| Multi-machine | Manual | Built-in |

## Contributing

### How can I contribute?

Visit our [GitHub repository](https://github.com/matemind/matemind) to:
- Report issues
- Submit pull requests
- Suggest features

### Where do I report bugs?

Open an issue on [GitHub Issues](https://github.com/matemind/matemind/issues).
