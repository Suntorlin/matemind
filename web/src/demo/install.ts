/**
 * Demo mode (VITE_DEMO=1 builds only): the app runs against an in-browser mock backend with
 * synthetic data. No hub, no agent, no model calls. Loaded by main.tsx before the first render.
 */
import { installDemoServer } from './server'

installDemoServer()

try {
    // Sign in automatically: the mock /api/auth accepts any token.
    const key = `matemind_access_token::${window.location.origin}`
    if (!localStorage.getItem(key)) localStorage.setItem(key, 'demo')
    localStorage.setItem('pwa_install_dismissed', '1')
} catch {
    // Storage blocked: the login page shows instead; any token works.
}

function addBadge() {
    const badge = document.createElement('div')
    badge.textContent = 'Demo · mock data, no AI calls'
    badge.setAttribute('style', [
        'position:fixed', 'left:50%', 'transform:translateX(-50%)', 'top:calc(env(safe-area-inset-top) + 6px)', 'z-index:2147483000',
        'padding:3px 10px', 'border-radius:999px', 'font:600 11px/16px -apple-system,system-ui,sans-serif',
        'color:#fff', 'background:linear-gradient(90deg,#f0a95c,#e2735a,#d96aa8)',
        'box-shadow:0 1px 6px rgba(0,0,0,.18)', 'opacity:.92', 'pointer-events:none'
    ].join(';'))
    document.body.appendChild(badge)
    // Show it on arrival, then get out of the way of the page headers.
    window.setTimeout(() => {
        badge.style.transition = 'opacity .4s'
        badge.style.opacity = '0'
        window.setTimeout(() => badge.remove(), 450)
    }, 6000)
}
if (document.body) addBadge()
else document.addEventListener('DOMContentLoaded', addBadge)
