/**
 * Renders the Matemind mark and icons (docs/brand/BRAND.md section 6) to SVG and PNG.
 * Needs Playwright: link a node_modules that has it into docs/brand/tools, then run `node docs/brand/tools/render-assets.mjs` from the repo root.
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const SAIL = 'M44 4V16H34.73ZM44 20V32H22.36L31.64 20ZM44 36V48H10L19.27 36Z'
// The bottom line is the only colour: a sunset gradient from the avatar orbs' warm families.
const BAR_STOPS = ['#f0a95c', '#e2735a', '#d96aa8']
const INK = '#09090b', INK_DARK = '#fafafa', TILE = '#18181b'
const barGradient = (id) => `<linearGradient id="${id}" x1="8" y1="0" x2="56" y2="0" gradientUnits="userSpaceOnUse">${BAR_STOPS.map((c, i) => `<stop offset="${i / (BAR_STOPS.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient>`
const body = (id, sail) => `<defs>${barGradient(id)}</defs><path fill="${sail}" d="${SAIL}"/><rect x="8" y="52" width="48" height="8" rx="4" fill="url(#${id})"/>`

/** Mark: ink sail (white on dark), sunset bar. */
export const mark = (id = 'mm', sail = INK) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${body(id, sail)}</svg>`

/** Favicon / browser icon: one file that follows the colour scheme. */
export const markAuto = (id = 'ma') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><style>.s{fill:${INK}}@media (prefers-color-scheme:dark){.s{fill:${INK_DARK}}}</style><defs>${barGradient(id)}</defs><path class="s" d="${SAIL}"/><rect x="8" y="52" width="48" height="8" rx="4" fill="url(#${id})"/></svg>`

export const markMono = (fill = '#000') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="${fill}" d="${SAIL}"/><rect x="8" y="52" width="48" height="8" rx="4" fill="${fill}"/></svg>`

/** App icon: dark tile, white sail, sunset bar. */
export const appIcon = ({ id = 'ai', radius = 14.4, scale = 0.6 } = {}) => {
    const r = radius ? ` rx="${radius}"` : ''
    const t = 32 - 32 * scale
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64"${r} fill="${TILE}"/><g transform="translate(${t} ${t}) scale(${scale})">${body(id, '#ffffff')}</g></svg>`
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
    const A = 'docs/brand/assets/', W = 'web/public/', D = 'docs/public/', S = 'website/public/'
    const files = {
        [A + 'matemind-mark.svg']: mark(),
        [A + 'matemind-mark-dark.svg']: mark('mmd', INK_DARK),
        [A + 'matemind-mark-mono.svg']: markMono(),
        [A + 'matemind-app-icon.svg']: appIcon(),
        [W + 'icon.svg']: markAuto(),
        [S + 'icon.svg']: appIcon(),
        [D + 'logo.svg']: appIcon(),
        [W + 'mask-icon.svg']: markMono('#000'),
    }
    for (const [path, svg] of Object.entries(files)) writeFileSync(path, svg + '\n')

    const { readFileSync } = await import('node:fs')
    // Lockup: mark (1.5x cap height) + wordmark, same geometry as the first version.
    // Lockups: swap the mark inside the committed lockup files (wordmark paths and spacing stay).
    const withMark = (file, id, sail) => {
        const svg = readFileSync(A + file, 'utf8').replace(/<defs>[\s\S]*?<\/defs>/, '')
        return svg.replace(/(<g transform="[^"]*">)[\s\S]*?(<\/g>)/, `$1${body(id, sail)}$2`)
    }
    writeFileSync(A + 'matemind-lockup.svg', withMark('matemind-lockup.svg', 'lk', INK))
    writeFileSync(A + 'matemind-lockup-dark.svg', withMark('matemind-lockup-dark.svg', 'lkd', INK_DARK))
    const lockup = () => readFileSync(A + 'matemind-lockup-dark.svg', 'utf8')

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
    await png(mark('mmd2', INK_DARK), 512, A + 'matemind-mark-dark-512.png')
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
