// @ts-nocheck -- Demo-mode mock backend (VITE_DEMO=1 builds only). Runs in the browser; no network, no model calls.
/* eslint-disable */
import {
    NOW, MIN, HOUR, DAY, HOME, MACHINE_ID, machine, TASKS, SESSIONS, summary, uid, userMsg, agentOut, asst, toolRes,
    buildTurn, TURNS, MESSAGES, G, GROUPS, GROUP_MESSAGES, GROUP_TASKS, gmsg, chatFrom, FILES, DIRS, numstatLine,
    unifiedDiff, claudeAccounts, SLASH, b64, sessionFull
} from './fixtures'
import { nextRunTime } from '@matemind/protocol/schedules'

const state = { tasks: [...TASKS], groupMessages: {} as Record<string, any[]> }

// ---------- one finished turn for every other active session ----------
const EXTRA = {
    's-csv': { user: 'Add a CSV export to the monthly finance report.', steps: [{ tool: 'Read', input: { file_path: `${HOME}/code/billing-api/src/reports/monthly.ts` }, out: '…' }, { tool: 'Edit', input: { file_path: `${HOME}/code/billing-api/src/reports/monthly.ts`, old_string: 'export function monthly', new_string: 'export function monthlyCsv' }, out: 'ok' }], final: 'CSV export works for invoices and payouts.\n\n- New endpoint: `GET /reports/monthly.csv`\n- Refund column is still missing; I asked the checkout session for the table schema.' },
    's-flaky': { user: 'The login e2e test fails sometimes. Find out why.', steps: [{ tool: 'Bash', input: { command: 'pnpm test e2e/login.spec.ts --repeat-each 20', description: 'Run the login test 20 times' }, out: '1 failed, 19 passed' }], final: 'It fails 1 in 20 runs.\n\nBoth failures happen while the session cookie refreshes. I guess the test reads the cookie before the refresh finishes; not verified yet.' },
    's-docs': { user: 'Update the API docs for the v2 endpoints.', steps: [{ tool: 'Grep', input: { pattern: '/v2/', path: 'src/routes' }, out: '12 routes' }], final: 'Docs for all 12 v2 endpoints are ready in `docs/api/v2.md`.\n\nI will publish them after PR #482 merges, because two examples use the new checkout response.' },
    's-perf': { user: 'The dashboard takes 3 s to load. Make the first load faster.', steps: [{ tool: 'Bash', input: { command: 'pnpm build && pnpm analyze', description: 'Measure the bundle' }, out: 'main.js 1.9 MB' }], final: 'First load is down from 3.1 s to 1.2 s on a fast 4G profile.\n\n- Charts load only when you open the Reports tab\n- Dates use `Intl` instead of a 300 KB library' },
    's-passkeys': { user: 'Add passkey sign-in next to the password form.', steps: [{ tool: 'Write', input: { file_path: `${HOME}/code/acme-web/src/auth/passkey.ts`, content: 'export async function signInWithPasskey() { /* … */ }' }, out: 'ok' }], final: 'Passkey sign-in works in Chrome and Safari.\n\nFirefox shows the button but falls back to the password form. Needs a design review before release.' },
    's-docker': { user: 'Our Docker image is 1.4 GB. Shrink it.', steps: [{ tool: 'Edit', input: { file_path: `${HOME}/code/billing-api/Dockerfile`, old_string: 'FROM node:22', new_string: 'FROM node:22-slim AS build' }, out: 'ok' }], final: 'The image is now 212 MB (was 1.4 GB).\n\nMulti-stage build, slim base image, and dev dependencies stay in the build stage. The app starts and the health check passes.' },
}
const nextSeqOf = {} as Record<string, number>
for (const [sid, convo] of Object.entries(EXTRA)) {
    const b = buildTurn(sid, 1, 1, SESSIONS[sid].updatedAt - 8 * MIN, convo.user, convo.steps, convo.final)
    TURNS[sid] = [{ ...b.turn, messages: b.msgs }]
    MESSAGES[sid] = b.msgs
    SESSIONS[sid].thinking = false
}
for (const sid of Object.keys(SESSIONS)) {
    const msgs = MESSAGES[sid] ?? []
    nextSeqOf[sid] = (msgs.at(-1)?.seq ?? 0) + 1
    TURNS[sid] ??= []
    MESSAGES[sid] ??= []
}
// The open turn of the checkout session finishes on its own a few seconds after you arrive.
const checkoutOpen = TURNS['s-checkout'].find((t) => t.status === 'open')

// ---------- memories ----------
const memory = (id, text, level, status, extra = {}) => ({
    id, text, level, scope: 'global', status, reason: null, source: 'user_message', sourceLabel: 'Fix checkout race condition',
    sessionId: 's-checkout', said: true, support: 3, jev: null, overridden: null, replaces: null, createdAt: NOW - 3 * DAY, updatedAt: NOW - DAY, ...extra,
})
const MEMORY = {
    memories: [
        memory('mem-1', 'Lead with the conclusion and the key numbers; details after.', 'principle', 'active'),
        memory('mem-2', 'Never push to a remote unless I say "push" in this turn.', 'principle', 'active'),
        memory('mem-3', 'Payments code: every change needs a regression test before the PR.', 'experience', 'active', { scope: 'acme-web' }),
        memory('mem-4', 'Release day is Thursday; freeze merges on Wednesday evening.', 'fact', 'pending', { said: false, source: 'propose', sourceLabel: 'Update API docs for v2 endpoints' }),
        memory('mem-5', 'Prefer slim base images for every service.', 'experience', 'candidate', { said: false, source: 'propose', sourceLabel: 'Shrink the Docker image', support: 1 }),
    ],
    links: [{ fromId: 'mem-3', toId: 'mem-2', createdAt: NOW - DAY }],
    recent: [{ id: 'ev-1', memoryId: 'mem-4', action: 'proposed', text: 'Release day is Thursday; freeze merges on Wednesday evening.', reason: null, source: 'propose', sourceLabel: 'Update API docs for v2 endpoints', costUsd: 0, createdAt: NOW - 2 * HOUR }],
    trial: { 'mem-5': { recent: 1, lastAt: NOW - 2 * MIN } },
    stats: { addedToday: 2, skippedToday: 5, skippedReasons: { 'one-off task': 3, duplicate: 2 }, judged: 7, corrected: 0, costTodayUsd: 0 },
    settings: { mode: 'record', projects: ['acme-web', 'billing-api'], jevReady: true, knownProjects: [{ name: 'acme-web', path: `${HOME}/code/acme-web`, sessions: 8 }, { name: 'billing-api', path: `${HOME}/code/billing-api`, sessions: 5 }] },
}

// ---------- scheduled tasks ----------
const scheduleRun = (id, scheduleId, startedAt, summary, sessionId = null) => ({
    id, scheduleId, trigger: 'schedule', status: 'done', scheduledFor: startedAt, startedAt, finishedAt: startedAt + 6 * MIN,
    sessionId, failure: null, reported: 'success', summary, links: [], accountId: 'work', attempts: 1,
})
const schedule = (id, name, prompt, spec, runs, extra = {}) => ({
    id, namespace: 'default', name, prompt, promptFile: null, machineId: MACHINE_ID, directory: `${HOME}/code/acme-web`, agent: 'claude',
    model: 'sonnet', thinkEffort: null, permissionMode: 'acceptEdits', accountId: 'work', worktree: true, maxMinutes: 90, spec,
    timezone: 'Asia/Tokyo', enabled: true, nextRunAt: nextRunTime(spec, 'Asia/Tokyo', NOW), createdAt: NOW - 9 * DAY, updatedAt: NOW - DAY, lastRun: runs[0] ?? null, ...extra,
})
const SCHEDULE_RUNS = {
    'sch-deps': [1, 2, 3].map((d) => scheduleRun(`run-deps-${d}`, 'sch-deps', NOW - d * DAY, d === 1 ? 'Two patch updates; tests pass; PR draft opened.' : 'No dependency updates today.')),
    'sch-flaky': [scheduleRun('run-flaky-1', 'sch-flaky', NOW - 3 * DAY, '1 flaky test this week: e2e/login.spec.ts (1 of 20 runs).', 's-flaky')],
}
const SCHEDULES = [
    schedule('sch-deps', 'Check dependency updates', 'Check for dependency updates. Apply patch updates, run the tests, and open a draft PR if they pass.', { kind: 'weekdays', time: '09:00' }, SCHEDULE_RUNS['sch-deps']),
    schedule('sch-flaky', 'Weekly flaky-test report', 'Run the e2e suite 20 times and list the tests that fail sometimes.', { kind: 'weekly', weekday: 1, time: '08:30' }, SCHEDULE_RUNS['sch-flaky']),
]

// ---------- live events ----------
const sources = new Set<any>()
class FakeEventSource {
    static CONNECTING = 0
    static OPEN = 1
    static CLOSED = 2
    readyState = 0
    url: string
    withCredentials = false
    onopen: any = null
    onmessage: any = null
    onerror: any = null
    private listeners: Record<string, any[]> = {}
    constructor(url: string) {
        this.url = String(url)
        sources.add(this)
        setTimeout(() => {
            this.readyState = 1
            this.onopen?.(new Event('open'))
            this.deliver({ type: 'connection-changed', data: { status: 'connected', subscriptionId: 'demo-subscription' } })
        }, 30)
    }
    deliver(event: any) {
        if (this.readyState !== 1) return
        const message = new MessageEvent('message', { data: JSON.stringify(event) })
        this.onmessage?.(message)
        for (const listener of this.listeners.message ?? []) listener(message)
    }
    addEventListener(type: string, listener: any) { (this.listeners[type] ??= []).push(listener) }
    removeEventListener(type: string, listener: any) { this.listeners[type] = (this.listeners[type] ?? []).filter((l) => l !== listener) }
    close() { this.readyState = 2; sources.delete(this) }
}
const emit = (event: any) => sources.forEach((source) => source.deliver(event))
setInterval(() => emit({ type: 'heartbeat', data: { timestamp: Date.now() } }), 15_000)

const touch = (sid: string) => {
    const s = SESSIONS[sid]
    s.updatedAt = s.activeAt = s.thinkingAt = Date.now()
    s.metadata.summary.updatedAt = Date.now()
    emit({ type: 'session-updated', sessionId: sid, data: s })
}
const pushMessage = (sid: string, message: any) => {
    MESSAGES[sid].push(message)
    emit({ type: 'message-received', sessionId: sid, message })
}

// ---------- scripted agent replies ----------
const zh = (text: string) => /[一-鿿]/.test(text)
function scriptFor(sid: string, text: string) {
    const s = SESSIONS[sid]
    const dir = s.metadata.path
    const lower = text.toLowerCase()
    const note = zh(text) ? '\n\n_演示回复：没有调用模型，内容是预先写好的。_' : '\n\n_Demo reply: no model was called; this answer is scripted._'
    if (/test|测试/.test(lower)) return {
        steps: [{ tool: 'Bash', input: { command: 'pnpm vitest run', description: zh(text) ? '运行测试' : 'Run the tests' }, out: '✓ 42 passed (3.4s)' }],
        final: (zh(text) ? '测试全部通过：42 个，用时 3.4 秒。\n\n- 没有新增失败\n- 覆盖率和上次一样（81%）' : 'All 42 tests pass (3.4 s).\n\n- No new failures\n- Coverage unchanged at 81%') + note,
    }
    if (/fix|bug|error|修|错|问题/.test(lower)) return {
        steps: [
            { tool: 'Grep', input: { pattern: 'TODO|throw', path: 'src' }, out: 'src/checkout/refund.ts:31' },
            { tool: 'Read', input: { file_path: `${dir}/src/checkout/refund.ts` }, out: '…' },
            { tool: 'Edit', input: { file_path: `${dir}/src/checkout/refund.ts`, old_string: 'await refund(order)', new_string: 'await refund(await lockOrder(order.id))' }, out: 'ok' },
            { tool: 'Bash', input: { command: 'pnpm vitest run src/checkout', description: zh(text) ? '运行 checkout 测试' : 'Run checkout tests' }, out: '✓ 39 passed' },
        ],
        final: (zh(text) ? '修好了：退款路径有同样的竞争问题，现在也先锁订单。\n\n- `src/checkout/refund.ts`：退款前锁定订单行\n- 39 个 checkout 测试通过。还没在 staging 验证。' : 'Fixed: the refund path had the same race; it now locks the order first.\n\n- `src/checkout/refund.ts`: lock the order row before the refund\n- 39 checkout tests pass. Not verified on staging yet.') + note,
    }
    if (/status|progress|summary|report|进度|总结|汇报|状态/.test(lower)) return {
        steps: [{ tool: 'Bash', input: { command: 'git log --oneline -5', description: zh(text) ? '看最近的提交' : 'Look at recent commits' }, out: '3 commits' }],
        final: (zh(text) ? `进度：「${s.metadata.summary.text}」完成了 3 步中的 2 步。\n\n| 项 | 状态 |\n|---|---|\n| 复现问题 | 完成 |\n| 修复 | 完成 |\n| 回归测试 | 进行中 |\n\n风险：还没在 staging 验证。` : `Progress on "${s.metadata.summary.text}": 2 of 3 steps done.\n\n| Step | Status |\n|---|---|\n| Reproduce | Done |\n| Fix | Done |\n| Regression test | In progress |\n\nRisk: not verified on staging yet.`) + note,
    }
    return {
        steps: [
            { tool: 'Read', input: { file_path: `${dir}/README.md` }, out: '…' },
            { tool: 'Grep', input: { pattern: text.split(/\s+/).filter((w) => w.length > 3)[0] ?? 'main', path: 'src' }, out: '4 matches' },
        ],
        final: (zh(text) ? `收到。我会这样做：「${text.slice(0, 80)}」\n\n1. 先读相关代码，确认改动范围\n2. 改完跑测试\n3. 回来给你一句话结论和改动清单` : `Got it. Plan for "${text.slice(0, 80)}":\n\n1. Read the related code and confirm the scope\n2. Make the change and run the tests\n3. Come back with a one-line conclusion and the list of changes`) + note,
    }
}

const running = new Map<string, number[]>()
function runTurn(sid: string, text: string) {
    const s = SESSIONS[sid]
    if (!s) return
    const turns = TURNS[sid]
    const t0 = Date.now()
    const userSeq = nextSeqOf[sid]++
    const user = userMsg(userSeq, text, t0)
    const turn = { id: `turn-${sid}-${turns.length + 1}-${t0}`, sessionId: sid, turnIndex: turns.length + 1, status: 'open', userMessageId: user.id, userSeq, agentStartSeq: userSeq + 1, agentEndSeq: userSeq, messageCount: 0, userPreview: text.slice(0, 60), assistantPreview: null, createdAt: t0, updatedAt: t0, messages: [user] }
    turns.push(turn)
    pushMessage(sid, user)
    s.active = true
    s.thinking = true
    touch(sid)
    const script = scriptFor(sid, text)
    const timers: number[] = []
    let at = 900
    const add = (message: any) => { turn.messages.push(message); turn.agentEndSeq = message.seq; turn.messageCount = turn.messages.length - 1; turn.updatedAt = Date.now(); pushMessage(sid, message) }
    for (const step of script.steps) {
        timers.push(window.setTimeout(() => {
            const id = uid('toolu')
            add(agentOut(nextSeqOf[sid]++, asst([{ type: 'tool_use', id, name: step.tool, input: step.input }]), Date.now()))
            window.setTimeout(() => add(agentOut(nextSeqOf[sid]++, toolRes(id, step.out ?? ''), Date.now())), 500)
        }, at))
        at += 1300
    }
    timers.push(window.setTimeout(() => {
        add(agentOut(nextSeqOf[sid]++, asst([{ type: 'text', text: script.final }]), Date.now()))
        turn.status = 'closed'
        turn.assistantPreview = script.final.slice(0, 60)
        s.thinking = false
        running.delete(sid)
        touch(sid)
    }, at + 900))
    running.set(sid, timers)
}

// ---------- group chat ----------
function postGroupMessage(groupId: string, body: any) {
    const group = GROUPS.find((g) => g.group.id === groupId)
    const list = groupId === G ? GROUP_MESSAGES : (state.groupMessages[groupId] ??= [])
    const text = body?.text ?? body?.payload?.text ?? ''
    const members = (group?.members ?? []).map((m) => m.sessionId).filter((id) => SESSIONS[id])
    const lower = text.toLowerCase()
    const targets = /@all\b/.test(lower) ? members : members.filter((id) => lower.includes(`@${id}`) || lower.includes(`@${SESSIONS[id].metadata.summary.text.toLowerCase()}`))
    const message = gmsg(body?.type ?? 'chat', 'user:web', { text }, Date.now(), { targetSessionIds: targets })
    message.groupId = groupId
    list.push(message)
    emit({ type: 'group-message-received', groupId, message })
    targets.forEach((sid, index) => {
        window.setTimeout(() => {
            const title = SESSIONS[sid].metadata.summary.text
            const reply = zh(text) ? `收到（${title}）：我来处理，完成后在群里回报。` : `On it (${title}). I will post the result here.`
            const m = chatFrom(sid, reply, Date.now())
            m.groupId = groupId
            list.push(m)
            emit({ type: 'group-message-received', groupId, message: m })
        }, 1200 + index * 900)
        window.setTimeout(() => {
            const done = zh(text) ? '完成：改动已提交，测试通过。演示回复，没有调用模型。' : 'Done: change committed, tests pass. (Demo reply: no model was called.)'
            const m = chatFrom(sid, done, Date.now())
            m.groupId = groupId
            list.push(m)
            emit({ type: 'group-message-received', groupId, message: m })
        }, 4200 + index * 1100)
    })
    return { message, createdTasks: [] }
}

// ---------- routing ----------
const json = (body, status = 200) => ({ status, body })

function handleGet(method, url) {
    const u = new URL(url)
    const p = u.pathname
    const q = u.searchParams
    let m
    if (p === '/api/sessions' && method === 'GET') return json({ sessions: Object.values(SESSIONS).map(summary).sort((a, b) => b.updatedAt - a.updatedAt) })
    if (p === '/api/machines') return json({ machines: [machine] })
    if (p === '/api/session-tasks' && method === 'GET') return json({ tasks: state.tasks })
    if (p === '/api/groups' && method === 'GET') return json({ groups: GROUPS })
    if ((m = p.match(/^\/api\/groups\/([^/]+)$/))) return json({ group: GROUPS.find(g => g.group.id === m[1]) ?? GROUPS[0] })
    if ((m = p.match(/^\/api\/groups\/([^/]+)\/messages$/))) return json({ messages: m[1] === G ? GROUP_MESSAGES : (state.groupMessages[m[1]] ?? []), page: { limit: 50, beforeSeq: null, nextBeforeSeq: null, hasMore: false } })
    if ((m = p.match(/^\/api\/groups\/([^/]+)\/tasks$/))) return json({ tasks: m[1] === G ? GROUP_TASKS : [] })
    if ((m = p.match(/^\/api\/groups\/([^/]+)\/note$/))) return json({ note: GROUPS.find(g => g.group.id === m[1])?.note ?? null })
    if ((m = p.match(/^\/api\/groups\/([^/]+)\/turns$/))) return json({ turns: [], page: { limit: 20, beforeTurnIndex: null, nextBeforeTurnIndex: null, hasMore: false } })
    if ((m = p.match(/^\/api\/sessions\/([^/]+)$/)) && method === 'GET') {
        const s = SESSIONS[m[1]]
        return s ? json({ session: s }) : json({ error: 'not found' }, 404)
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/turns$/))) {
        const turns = (TURNS[m[1]] ?? []).map(({ messages, ...t }) => t).reverse()
        return json({ turns, page: { limit: 20, beforeTurnIndex: null, nextBeforeTurnIndex: null, hasMore: false } })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/turns\/([^/]+)\/messages$/))) {
        const t = (TURNS[m[1]] ?? []).find(x => x.id === m[2])
        if (!t) return json({ error: 'not found' }, 404)
        const { messages, ...turn } = t
        return json({ turn, messages, page: { limit: 200, beforeSeq: null, nextBeforeSeq: null, hasMore: false, startSeq: messages[0].seq, endSeq: messages.at(-1).seq } })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/messages$/)) && method === 'GET') {
        const msgs = MESSAGES[m[1]] ?? []
        return json({ messages: msgs, page: { limit: 50, beforeSeq: null, nextBeforeSeq: null, hasMore: false } })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/slash-commands$/))) return json({ success: true, commands: SLASH.map(([name, description, source]) => ({ name, description, source })) })
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/skills$/))) return json({ success: true, skills: [{ name: 'frontend-design', description: 'Build polished UI from a short brief' }, { name: 'pdf', description: 'Read and write PDF files' }, { name: 'webapp-testing', description: 'Test the web app in a real browser' }] })
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/mcp$/))) return json({ success: true, flavor: 'claude', servers: [{ name: 'matemind', status: 'connected', available: true, connected: true, transport: 'stdio' }, { name: 'github', status: 'connected', available: true, connected: true, transport: 'http' }] })
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/(queue-status|codex-status)$/))) return json({ success: true, queue: { pendingCount: 0, inQueue: false, taskRunning: SESSIONS[m[1]]?.thinking ?? false } })
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/(queue|codex-queue)$/))) return json({ success: true, queue: { pendingCount: 0, inQueue: false, taskRunning: false, entries: [] } })
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/git-status$/))) {
        const lines = ['# branch.oid 1a2b3c4d5e6f', '# branch.head fix/checkout-race', '# branch.upstream origin/fix/checkout-race', '# branch.ab +2 -0']
        for (const [path, f] of Object.entries(FILES)) {
            if (f.status === 'untracked') lines.push(`? ${path}`)
            else lines.push(`1 .M N... 100644 100644 100644 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb ${path}`)
        }
        return json({ success: true, stdout: lines.join('\n') + '\n', exitCode: 0 })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/git-diff-numstat$/))) {
        if (q.get('staged') === 'true') return json({ success: true, stdout: '', exitCode: 0 })
        const out = Object.entries(FILES).filter(([, f]) => f.status !== 'untracked').map(([path]) => { const s = numstatLine(path); return `${s.added}\t${s.removed}\t${path}` }).join('\n')
        return json({ success: true, stdout: out + '\n', exitCode: 0 })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/git-diff-file$/))) {
        const path = q.get('path')
        return json({ success: true, stdout: FILES[path] ? unifiedDiff(path) : '', exitCode: 0 })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/git-read-snapshot$/))) {
        const f = FILES[q.get('path')]
        return f?.head != null ? json({ success: true, content: b64(f.head), size: f.head.length }) : json({ success: false, error: 'not in HEAD' })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/file$/))) {
        const f = FILES[q.get('path')]
        return f ? json({ success: true, content: b64(f.content), size: f.content.length }) : json({ success: false, error: 'not found' })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/directory$/))) {
        const d = DIRS[(q.get('path') ?? '').replace(/^\.\/?|\/$/g, '')] ?? []
        return json({ success: true, entries: d.map(([name, type, size]) => ({ name, type, size, modified: NOW - 3 * HOUR })) })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/files$/))) {
        const all = [...Object.keys(FILES), 'src/checkout/api.ts', 'src/checkout/refund.ts', 'src/checkout/errors.ts', 'src/server/db.ts', 'src/server/stripe.ts', 'src/routes/checkout.tsx', 'src/components/Button.tsx', 'e2e/checkout.spec.ts', 'e2e/login.spec.ts', 'package.json', 'README.md']
        const qq = (q.get('query') ?? '').toLowerCase()
        const files = all.filter(f => f.toLowerCase().includes(qq)).map(f => ({ fileName: f.split('/').pop(), filePath: f.split('/').slice(0, -1).join('/'), fullPath: `${HOME}/code/acme-web/${f}`, fileType: 'file' }))
        return json({ success: true, files })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/usage$/))) return json({ error: 'n/a' }, 404)
    if ((m = p.match(/^\/api\/machines\/([^/]+)\/claude-accounts$/))) return json(claudeAccounts)
    if ((m = p.match(/^\/api\/machines\/([^/]+)\/paths\/exists$/))) return json({ exists: {} })
    if (p === '/api/tasks') return json({ tasks: [] })
    if (p === '/api/schedules') return json({ schedules: SCHEDULES })
    if ((m = p.match(/^\/api\/schedules\/([^/]+)$/))) {
        const found = SCHEDULES.find((x) => x.id === m[1])
        return found ? json({ schedule: found, runs: SCHEDULE_RUNS[found.id] ?? [] }) : json({ error: 'not found' }, 404)
    }
    if (p === '/api/voice/dictation') return json({ available: false })
    if ((m = p.match(/^\/api\/memories\/([^/]+)\/related$/))) return json({ hits: [] })
    if (p === '/api/sessions/preview-url-history') return json({ urls: [], entries: [] })
    if (p === '/api/settings/new-session-defaults') return json({ defaults: { agent: 'claude', model: 'opus', thinkEffort: 'high', yoloMode: false, claudeAccountId: 'work', updatedAt: NOW - DAY } })
    return null
}

let spawned = 0
function handleMutation(method: string, url: URL, body: any) {
    const p = url.pathname
    let m
    if ((m = p.match(/^\/api\/schedules\/([^/]+)$/)) && method === 'PATCH') {
        const found = SCHEDULES.find((x) => x.id === m[1])
        if (!found) return json({ error: 'not found' }, 404)
        if (typeof body?.enabled === 'boolean') Object.assign(found, { enabled: body.enabled, nextRunAt: body.enabled ? nextRunTime(found.spec, found.timezone, Date.now()) : null, updatedAt: Date.now() })
        return json({ schedule: found })
    }
    // Newer features that need a real hub: say so instead of returning an empty success.
    if (p.startsWith('/api/schedules') || p.startsWith('/api/tasks') || p.startsWith('/api/memories/merge') || p === '/api/memories/archive' || p.startsWith('/api/voice/')) {
        return json({ error: 'Not available in the demo' }, 403)
    }
    if (p === '/api/auth' || p === '/api/bind') return json({ token: 'demo-token', user: { id: 1, firstName: 'You', username: 'you' } })
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/(messages|queue\/enqueue|codex-queue\/enqueue)$/)) && method === 'POST') {
        runTurn(m[1], body?.text ?? '')
        return m[2] === 'messages' ? json({ ok: true }) : json({ success: true, sessionId: m[1], queue: { pendingCount: 0, inQueue: false, taskRunning: true, entries: [] } })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/abort$/))) {
        for (const timer of running.get(m[1]) ?? []) clearTimeout(timer)
        running.delete(m[1])
        if (SESSIONS[m[1]]) { SESSIONS[m[1]].thinking = false; touch(m[1]) }
        return json({ ok: true })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/permissions\/([^/]+)\/(approve|deny)$/))) {
        const sid = m[1]
        const s = SESSIONS[sid]
        const request = s?.agentState.requests[m[2]]
        if (request) {
            delete s.agentState.requests[m[2]]
            s.agentState.completedRequests[m[2]] = { ...request, status: m[3] === 'approve' ? 'approved' : 'denied', completedAt: Date.now() }
            s.thinking = m[3] === 'approve'
            touch(sid)
            const turn = TURNS[sid].at(-1)
            window.setTimeout(() => {
                const text = m[3] === 'approve'
                    ? 'Ran it 20 times: 1 failure, at the cookie refresh again.\n\nNext: add tracing around the refresh and run 50 times.\n\n_Demo reply: no model was called._'
                    : 'OK, I will not run it. Tell me when I can.\n\n_Demo reply: no model was called._'
                const message = agentOut(nextSeqOf[sid]++, asst([{ type: 'text', text }]), Date.now())
                turn?.messages.push(message)
                if (turn) { turn.agentEndSeq = message.seq; turn.messageCount = turn.messages.length - 1 }
                pushMessage(sid, message)
                s.thinking = false
                touch(sid)
            }, m[3] === 'approve' ? 2500 : 600)
        }
        return json({ ok: true })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/tags$/))) {
        SESSIONS[m[1]].metadata.tags = body?.tags ?? []
        touch(m[1])
        return json({ ok: true, tags: SESSIONS[m[1]].metadata.tags })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/archive$/))) {
        Object.assign(SESSIONS[m[1]], { active: false, thinking: false })
        touch(m[1])
        return json({ ok: true })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)$/)) && method === 'PATCH') {
        if (body?.name) SESSIONS[m[1]].metadata.summary.text = body.name
        touch(m[1])
        return json({ ok: true })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)$/)) && method === 'DELETE') {
        delete SESSIONS[m[1]]
        emit({ type: 'session-removed', sessionId: m[1] })
        return json({ ok: true })
    }
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/(model|permission-mode|think-effort|service-tier|collaboration-mode|claude-account)$/))) {
        const s = SESSIONS[m[1]]
        if (body?.model) s.metadata.model = body.model
        if (body?.mode) s.permissionMode = body.mode
        if (body?.thinkEffort ?? body?.effort) s.metadata.thinkEffort = body.thinkEffort ?? body.effort
        touch(m[1])
        return json({ ok: true, success: true })
    }
    const spawn = (directory: string, agent: string, model: string) => {
        const id = `s-new-${++spawned}`
        const title = 'New session'
        const project = (directory || `${HOME}/code/acme-web`).split('/').filter(Boolean).pop()
        SESSIONS[id] = sessionFull([id, title, project, agent || 'claude', model || 'opus', [], true, false, 0, 0])
        SESSIONS[id].metadata.path = directory || `${HOME}/code/acme-web`
        TURNS[id] = []
        MESSAGES[id] = []
        nextSeqOf[id] = 1
        emit({ type: 'session-added', sessionId: id, data: SESSIONS[id] })
        return json({ type: 'success', sessionId: id })
    }
    if ((m = p.match(/^\/api\/machines\/([^/]+)\/spawn$/))) return spawn(body?.directory, body?.agent, body?.model)
    if ((m = p.match(/^\/api\/sessions\/([^/]+)\/spawn$/))) { const s = SESSIONS[m[1]]; return spawn(s?.metadata.path, s?.metadata.flavor, s?.metadata.model) }
    if (p === '/api/session-tasks' && method === 'POST') {
        const task = { id: `tk-${Date.now()}`, tag: body?.tag ?? 'web', title: body?.title ?? 'New task', status: 'open', createdAt: Date.now(), updatedAt: Date.now(), completedAt: null }
        state.tasks.push(task)
        return json({ task })
    }
    if ((m = p.match(/^\/api\/session-tasks\/([^/]+)$/))) {
        const index = state.tasks.findIndex((t) => t.id === m[1])
        if (method === 'DELETE') { state.tasks.splice(index, 1); return json({ ok: true }) }
        const task = Object.assign(state.tasks[index], body ?? {}, { updatedAt: Date.now(), completedAt: body?.status === 'done' ? Date.now() : null })
        return json({ task })
    }
    if ((m = p.match(/^\/api\/groups\/([^/]+)\/messages$/)) && method === 'POST') return json(postGroupMessage(m[1], body))
    if ((m = p.match(/^\/api\/memories\/([^/]+)\/(confirm|dismiss)$/))) {
        const item = MEMORY.memories.find((x) => x.id === m[1])
        if (item) item.status = m[2] === 'confirm' ? 'active' : 'archived'
        emit({ type: 'memories-updated' })
        return json({ memory: item })
    }
    if (p === '/api/memories/confirm-all') {
        let confirmed = 0
        for (const item of MEMORY.memories) if (item.status === 'pending') { item.status = 'active'; confirmed += 1 }
        emit({ type: 'memories-updated' })
        return json({ confirmed })
    }
    return json({ ok: true, success: true })
}

function route(method: string, url: URL, body: any) {
    const p = url.pathname
    if (method === 'GET') {
        if (p === '/api/memories') return json(MEMORY)
        if (p === '/api/memories/settings') return json({ settings: MEMORY.settings })
        if (p.startsWith('/api/memories/search')) return json({ hits: MEMORY.memories.map((x) => ({ ...x, score: 0.8 })) })
        if (p === '/api/review-loops') return json({ loops: [] })
        if (p === '/api/settings/experimental') return json({ settings: { claudeLoginShell: false } })
        if (p === '/api/settings/project-offline') return json({ projects: [] })
        if (p === '/api/push/vapid-public-key') return json({ error: 'not in demo' }, 404)
        if (p.startsWith('/api/usage/overview')) return json({ error: 'not in demo' }, 404)
        const r = handleGet(method, url.href)
        if (r) return r
        return json({ error: 'Not available in the demo' }, 404)
    }
    return handleMutation(method, url, body)
}

// ---------- install ----------
export function installDemoServer() {
    const realFetch = window.fetch.bind(window)
    window.fetch = async (input: any, init?: any) => {
        const href = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
        const url = new URL(href, window.location.href)
        if (url.origin !== window.location.origin || !url.pathname.startsWith('/api/')) return realFetch(input, init)
        const method = String(init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
        let body = null
        if (typeof init?.body === 'string') { try { body = JSON.parse(init.body) } catch { body = null } }
        const result = route(method, url, body)
        await new Promise((resolve) => setTimeout(resolve, 80 + Math.random() * 120))
        return new Response(JSON.stringify(result.body), { status: result.status, headers: { 'content-type': 'application/json' } })
    }
    window.EventSource = FakeEventSource
    if (checkoutOpen) {
        window.setTimeout(() => {
            const final = 'The refund path had the same race. I locked the order before the refund too.\n\n- `src/checkout/refund.ts`: lock the order row\n- 39 checkout tests pass\n\n_Demo reply: no model was called._'
            const message = agentOut(nextSeqOf['s-checkout']++, asst([{ type: 'text', text: final }]), Date.now())
            checkoutOpen.messages.push(message)
            checkoutOpen.status = 'closed'
            checkoutOpen.agentEndSeq = message.seq
            checkoutOpen.assistantPreview = final.slice(0, 60)
            pushMessage('s-checkout', message)
            SESSIONS['s-checkout'].thinking = false
            touch('s-checkout')
        }, 9000)
    }
}
