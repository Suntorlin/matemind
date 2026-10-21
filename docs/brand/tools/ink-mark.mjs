/**
 * The Matemind ink-brush mark (docs/brand/BRAND.md section 6): three curved brush strokes form a sail
 * full of wind, one sunset swash under it is the bottom line. Pure geometry, no dependencies; the
 * output is plain SVG paths. `detail: false` drops the dry-brush streaks for 16-32 px.
 */
const f = (n) => Math.round(n * 100) / 100
const rng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
const quad = (a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]
function smooth(pts, closed = true) {
    const n = pts.length
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
    const last = closed ? n : n - 1
    for (let i = 0; i < last; i++) {
        const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
        d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
    }
    return d + (closed ? 'Z' : '')
}
const wob = (r, amp) => { const a = [r() * 6, r() * 6, r() * 6]; return (t) => amp * (Math.sin(t * 7 + a[0]) * 0.5 + Math.sin(t * 13 + a[1]) * 0.3 + Math.sin(t * 23 + a[2]) * 0.2) }

// The sail's leading edge: a curve bulging outward (up-left), from the masthead to the foot.
const HEAD = [43.6, 3.2], FOOT = [8.4, 48.6], BULGE = [18.5, 15]
function leadX(y) { // x on the leading edge at height y (binary search on t)
    let lo = 0, hi = 1
    for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; quad(HEAD, BULGE, FOOT, m)[1] < y ? (lo = m) : (hi = m) }
    return quad(HEAD, BULGE, FOOT, (lo + hi) / 2)[0]
}
const MAST_X = 45.2

function band(y0, y1, seed, detail) {
    const r = rng(seed), top = wob(r, detail ? 0.35 : 0.08), bot = wob(r, detail ? 0.35 : 0.08), arch = 0.9 + (y1 - y0) * 0.06
    const pts = []
    const N = 26
    // top edge: leading edge -> mast, slightly arched
    for (let i = 0; i <= N; i++) { const t = i / N, x0 = leadX(y0) + 0.6, x = x0 + (MAST_X - x0) * t; pts.push([x, y0 - arch * Math.sin(Math.PI * t) * 0.6 + top(t)]) }
    // brush lift at the mast: a small ragged right edge
    pts.push([MAST_X + 0.5 + (detail ? r() * 0.5 : 0), y0 + (y1 - y0) * 0.35], [MAST_X + 0.2, y0 + (y1 - y0) * 0.7])
    // bottom edge: mast -> leading edge
    for (let i = N; i >= 0; i--) { const t = i / N, x0 = leadX(y1) + 0.3, x = x0 + (MAST_X - x0) * t; pts.push([x, y1 - arch * Math.sin(Math.PI * t) * 0.45 + bot(t)]) }
    // leading edge follows the curve, pressed slightly fuller at the middle
    const M = 8
    for (let i = 1; i < M; i++) { const y = y1 - (y1 - y0) * (i / M); pts.push([leadX(y) - 0.4 - Math.sin(Math.PI * i / M) * 0.5, y]) }
    return smooth(pts)
}
// Flying white: thin paper streaks inside the tail of a stroke, tapering to a point where they start.
function streaks(spans, seed, count, from, to) { // spans: [{x0,x1,y}] rows; streak runs from a random start to `to`
    const r = rng(seed), out = []
    for (let k = 0; k < count; k++) {
        const s = spans[Math.floor(r() * spans.length)]
        const y = s.y0 + (s.y1 - s.y0) * (0.12 + r() * 0.76)
        const start = s.x1 - (s.x1 - s.x0) * (from + r() * (to - from)), end = s.x1 + 0.8
        const w = 0.16 + r() * 0.36, bend = (r() - 0.5) * 0.8
        out.push(smooth([[start, y], [start + (end - start) * 0.5, y - w * 0.5 + bend], [end, y - w + bend * 0.5], [end, y + w + bend * 0.5], [start + (end - start) * 0.5, y + w * 0.5 + bend]]))
    }
    return out
}
function swash(detail, seed = 91) {
    const r = rng(seed), top = wob(r, detail ? 0.3 : 0.06), bot = wob(r, detail ? 0.3 : 0.06)
    const A = [5, 56.2], C = [30, 50.6], B = [59.6, 54.8]
    const width = (t) => 6.6 * (t < 0.12 ? 0.45 + 0.55 * Math.sin((t / 0.12) * Math.PI / 2) : t > 0.55 ? Math.max(0.12, 1 - 0.88 * ((t - 0.55) / 0.45) ** 1.4) : 1)
    const upper = [], lower = []
    const N = 40
    for (let i = 0; i <= N; i++) {
        const t = i / N, p = quad(A, C, B, t), q = quad(A, C, B, Math.min(1, t + 0.01)), o = quad(A, C, B, Math.max(0, t - 0.01))
        const dx = q[0] - o[0], dy = q[1] - o[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, w = width(t) / 2
        upper.push([p[0] + nx * (w + top(t)), p[1] + ny * (w + top(t))]); lower.push([p[0] - nx * (w + bot(t)), p[1] - ny * (w + bot(t))])
    }
    const body = smooth([...upper, ...lower.reverse()])
    return { body, rows: [{ x0: 5, x1: 59.6, y0: 51.8, y1: 56.6 }] }
}


export const SUNSET = ['#f0a95c', '#e2735a', '#d96aa8']
export const INK = '#141414'
export const INK_DARK = '#f3efe8'
export const PAPER = '#f4efe6'

/** Path data of the mark in a 64x64 box. */
export function markPaths({ detail = true } = {}) {
    const sail = BANDS.map(([a, b], i) => band(a, b, 17 + i * 13, detail))
    const sw = swash(detail)
    const sailRows = BANDS.map(([y0, y1]) => ({ x0: leadX((y0 + y1) / 2), x1: MAST_X, y0, y1 }))
    const streakPaths = detail ? [...streaks(sailRows, 4, 6, 0.1, 0.55), ...streaks(sw.rows, 8, 5, 0.06, 0.4)] : []
    return { sail, swash: sw.body, streaks: streakPaths }
}
const BANDS = [[4.4, 15.2], [19, 31.4], [35.4, 48.4]]

/** SVG body (no <svg> wrapper): `ink` for the sail, the sunset for the swash, or `mono` for both. */
export function markBody({ id = 'mm', ink = INK, detail = true, mono = null } = {}) {
    const p = markPaths({ detail })
    const swashFill = mono ?? `url(#${id}g)`
    const sailFill = mono ?? ink
    const grad = mono ? '' : `<linearGradient id="${id}g" x1="5" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">${SUNSET.map((c, i) => `<stop offset="${i / 2}" stop-color="${c}"/>`).join('')}</linearGradient>`
    const mask = p.streaks.length ? `<mask id="${id}m"><rect width="64" height="64" fill="#fff"/>${p.streaks.map((d) => `<path d="${d}" fill="#000"/>`).join('')}</mask>` : ''
    const masked = mask ? ` mask="url(#${id}m)"` : ''
    return `<defs>${grad}${mask}</defs><g${masked}><g fill="${sailFill}">${p.sail.map((d) => `<path d="${d}"/>`).join('')}</g><path d="${p.swash}" fill="${swashFill}"/></g>`
}
export const markSvg = (opts = {}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${markBody(opts)}</svg>`
