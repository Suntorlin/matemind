/**
 * Renders the Matemind mark and icons (docs/brand/BRAND.md section 6) to SVG and PNG.
 * Needs Playwright: link a node_modules that has it into docs/brand/tools, then run `node docs/brand/tools/render-assets.mjs` from the repo root.
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const SAIL = 'M44 4V16H34.73ZM44 20V32H22.36L31.64 20ZM44 36V48H10L19.27 36Z'
const BAR = (fill) => `<rect x="8" y="52" width="48" height="8" rx="4" fill="${fill}"/>`
// The app's "live" story-ring colours, bottom-left to top-right.
const SAIL_STOPS = [[0, '#feda75'], [0.25, '#fa7e1e'], [0.5, '#d62976'], [0.75, '#962fbf'], [1, '#4f5bd5']]
const stops = (list) => list.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')

export const mark = (id = 'mm') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="${id}" x1="6.4" y1="64" x2="48" y2="3.2" gradientUnits="userSpaceOnUse">${stops(SAIL_STOPS)}</linearGradient></defs><path fill="url(#${id})" d="${SAIL}"/>${BAR(`url(#${id})`)}</svg>`

export const markMono = (fill = '#000') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="${fill}" d="${SAIL}"/>${BAR(fill)}</svg>`

// App icon: a session orb (avatar palettes "orb-3" and "orb-0" plus a warm "orb-2" glow) with the mark in white.
export const appIcon = ({ id = 'ai', radius = 14.4, scale = 0.6 } = {}) => {
    const r = radius ? ` rx="${radius}"` : ''
    const t = 32 - 32 * scale
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs>
<linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b86ad8"/><stop offset="1" stop-color="#5b8def"/></linearGradient>
<radialGradient id="${id}w" cx="0.45" cy="0.88" r="0.62"><stop offset="0" stop-color="#f0a95c"/><stop offset="1" stop-color="#f0a95c" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}p" cx="0.26" cy="0.24" r="0.6"><stop offset="0" stop-color="#e870a6"/><stop offset="1" stop-color="#e870a6" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}v" cx="0.82" cy="0.46" r="0.58"><stop offset="0" stop-color="#7f7be0"/><stop offset="1" stop-color="#7f7be0" stop-opacity="0"/></radialGradient>
</defs><rect width="64" height="64"${r} fill="url(#${id}b)"/><rect width="64" height="64"${r} fill="url(#${id}w)"/><rect width="64" height="64"${r} fill="url(#${id}p)"/><rect width="64" height="64"${r} fill="url(#${id}v)"/>
<g transform="translate(${t} ${t}) scale(${scale})"><path fill="#fff" d="${SAIL}"/>${BAR('#fff')}</g></svg>`
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
    const A = 'docs/brand/assets/', W = 'web/public/', D = 'docs/public/', S = 'website/public/'
    const files = {
        [A + 'matemind-mark.svg']: mark(),
        [A + 'matemind-mark-mono.svg']: markMono(),
        [A + 'matemind-app-icon.svg']: appIcon(),
        [W + 'icon.svg']: appIcon(),
        [S + 'icon.svg']: appIcon(),
        [D + 'logo.svg']: appIcon(),
        [W + 'mask-icon.svg']: markMono('#000'),
    }
    for (const [path, svg] of Object.entries(files)) writeFileSync(path, svg + '\n')

    const { readFileSync } = await import('node:fs')
    // Lockup: mark (1.5x cap height) + wordmark, same geometry as the first version.
    // Lockups are kept as files (mark already in the gradient); the social image reuses the dark one.
    const lockup = (_fill, _id) => readFileSync(A + 'matemind-lockup-dark.svg', 'utf8')

    const browser = await chromium.launch()
    const png = async (svg, size, path, bg = 'transparent') => {
        const page = await browser.newPage({ viewport: { width: size, height: size } })
        await page.setContent(`<html><body style="margin:0;background:${bg}"><div style="width:${size}px;height:${size}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div></body></html>`)
        await page.screenshot({ path, omitBackground: bg === 'transparent' })
        await page.close()
    }
    await png(appIcon({ radius: 0 }), 180, W + 'apple-touch-icon-180x180.png') // iOS rounds it
    await png(appIcon({ radius: 0, scale: 0.5 }), 512, W + 'maskable-icon-512x512.png') // mark inside the 80% safe zone
    for (const s of [64, 192, 512]) await png(appIcon(), s, `${W}pwa-${s}x${s}.png`)
    await png(appIcon({ radius: 0 }), 1024, A + 'matemind-app-icon-1024.png')
    await png(mark(), 512, A + 'matemind-mark-512.png')
    for (const s of [16, 32, 48]) await png(appIcon(), s, `/tmp/mm-fav-${s}.png`)

    // Social preview 1280x640.
    const page = await browser.newPage({ viewport: { width: 1280, height: 640 } })
    await page.setContent(`<html><body style="margin:0;background:#09090b;font-family:Geist,-apple-system,system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:640px;color:#a1a1aa">
<div style="width:720px;height:134px">${lockup('#fafafa', 'so').replace('<svg ', '<svg width="100%" height="100%" ')}</div>
<div style="margin-top:56px;font-size:31px;line-height:1.5;text-align:center">Say what you want. Matemind splits it up,<br/>keeps watch, and gives you the bottom line.</div>
<div style="position:absolute;bottom:40px;font-size:21px;color:#71717a">github.com/matemind/matemind</div></body></html>`)
    await page.screenshot({ path: A + 'matemind-social.png' })
    await browser.close()
    console.log('rendered')
}
