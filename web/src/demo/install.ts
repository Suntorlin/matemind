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
const REPO_URL = 'https://github.com/Suntorlin/matemind' // public-safety: allow
const GITHUB_MARK = '<svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>'

/** Always-visible link to the source: in the desktop rail above the profile icon, floating on phones. */
function addGitHubLink() {
    const style = document.createElement('style')
    style.textContent = `
.matemind-demo-github{position:fixed;z-index:2147483000;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:999px;
  color:var(--social-fg,#09090b);background:var(--social-surface,#fff);border:1px solid var(--social-border,#e4e4e7);box-shadow:0 2px 10px rgba(0,0,0,.12);
  right:14px;bottom:calc(env(safe-area-inset-bottom) + 136px);text-decoration:none}
.matemind-demo-github:hover{background:var(--social-muted,#f4f4f5)}
@media (min-width:1024px){.matemind-demo-github{right:auto;left:16px;bottom:76px;box-shadow:none}}`
    document.head.appendChild(style)
    const link = document.createElement('a')
    link.className = 'matemind-demo-github'
    link.href = REPO_URL
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.title = 'Matemind on GitHub'
    link.setAttribute('aria-label', 'Matemind on GitHub')
    link.innerHTML = GITHUB_MARK
    document.body.appendChild(link)
    // On phones the floating button would cover a conversation: show it on list pages only.
    const phone = window.matchMedia('(max-width: 1023px)')
    const sync = () => {
        const base = import.meta.env.BASE_URL.replace(/\/$/, '')
        const path = window.location.pathname.slice(base.length) || '/'
        const inDetail = /^\/(sessions|groups)\/[^/]+/.test(path) && !/^\/sessions\/new/.test(path)
        link.style.display = phone.matches && inDetail ? 'none' : 'flex'
    }
    sync()
    window.setInterval(sync, 400)
}

function addDemoChrome() {
    addBadge()
    addGitHubLink()
}
if (document.body) addDemoChrome()
else document.addEventListener('DOMContentLoaded', addDemoChrome)
