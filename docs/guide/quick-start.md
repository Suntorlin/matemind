# Quick Start

<Steps>

## Install Matemind

::: code-group

```bash [npm]
npm install -g matemind --registry=https://registry.npmjs.org
```

```bash [npx (one-off)]
npx matemind
```

:::

> Recommendation: use the official npm registry for global install. Some mirrors may not sync platform packages in time.

Other install options: [Installation](./installation.md)

## Start the hub

```bash
matemind hub --relay
```

On first run, Matemind prints an access token and saves it to `~/.matemind/settings.json`.

`matemind server` remains supported as an alias.

The terminal will display a URL and QR code for remote access.

> End-to-end encrypted with WireGuard + TLS.

## Start a coding session

```bash
matemind
```

This starts Claude Code wrapped with Matemind. The session appears in the web UI.

## Open the UI

Open the URL shown in the terminal, or scan the QR code with your phone.

Enter your access token to log in.

</Steps>

## Next steps

- [Seamless Handoff](./how-it-works.md#seamless-handoff) - Switch between terminal and phone seamlessly
- [Hub setup](./installation.md#hub-setup) - Access Matemind from anywhere
- [Notifications](./installation.md#telegram-setup) - Set up Telegram notifications
- [Install the App](./pwa.md) - Add Matemind to your home screen
