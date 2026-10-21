// @ts-nocheck -- Demo-mode mock data (VITE_DEMO=1 builds only). Synthetic: no real users, paths or sessions.
/* eslint-disable */

export const NOW = Date.now()
export const MIN = 60_000, HOUR = 3_600_000, DAY = 86_400_000
export const HOME = '/Users/me'
export const MACHINE_ID = 'm-0b1c2d3e-macbook'

export const machine = {
    id: MACHINE_ID, namespace: 'default', seq: 1, createdAt: NOW - 90 * DAY, updatedAt: NOW, active: true, activeAt: NOW,
    metadata: { host: 'macbook', platform: 'darwin', happyCliVersion: '0.17.0', displayName: 'macbook', homeDir: HOME },
    metadataVersion: 1, runnerState: { status: 'running', pid: 4242, startedAt: NOW - 2 * DAY }, runnerStateVersion: 1
}

export const TASKS = [
    { id: 'tk-checkout', tag: 'web', title: 'Checkout reliability', status: 'open', createdAt: NOW - 3 * DAY, updatedAt: NOW - HOUR, completedAt: null },
    { id: 'tk-exports', tag: 'api', title: 'Finance exports', status: 'open', createdAt: NOW - 2 * DAY, updatedAt: NOW - 2 * HOUR, completedAt: null },
    { id: 'tk-docs', tag: 'docs', title: 'Docs for v2 launch', status: 'open', createdAt: NOW - 4 * DAY, updatedAt: NOW - DAY, completedAt: null },
    { id: 'tk-sso', tag: 'web', title: 'SSO for team plans', status: 'done', createdAt: NOW - 9 * DAY, updatedAt: NOW - 2 * DAY, completedAt: NOW - 2 * DAY },
    { id: 'tk-perf', tag: 'web', title: 'Dashboard under 1 s', status: 'open', createdAt: NOW - 6 * DAY, updatedAt: NOW - DAY, completedAt: null },
]

// id, title, project dir, flavor, model, tags, active, thinking, age(ms since activity), pending
export const S = [
    ['s-checkout', 'Fix checkout race condition', 'acme-web', 'claude', 'opus', ['web', 'pinned', 'task:tk-checkout'], true, true, 0, 0],
    ['s-csv', 'Add CSV export to reports', 'billing-api', 'codex', 'gpt-5.5', ['api', 'pinned', 'task:tk-exports'], true, true, 1 * MIN, 0],
    ['s-flaky', 'Find the flaky login test', 'acme-web', 'claude', 'sonnet', ['web', 'task:tk-checkout'], true, false, 3 * MIN, 1],
    ['s-docs', 'Update API docs for v2 endpoints', 'acme-web', 'gemini', 'gemini-3-pro', ['docs', 'pinned', 'task:tk-docs'], true, false, 12 * MIN, 0],
    ['s-perf', 'Speed up dashboard first load', 'acme-web', 'claude', 'opus', ['web', 'task:tk-perf'], true, true, 30_000, 0],
    ['s-passkeys', 'Add passkey sign-in', 'acme-web', 'codex', 'gpt-5.5', ['web'], true, false, 6 * MIN, 0],
    ['s-docker', 'Shrink the Docker image', 'billing-api', 'opencode', 'auto', ['api'], true, true, 2 * MIN, 0],
    ['s-invoice', 'Invoice PDF layout review', 'billing-api', 'cursor', 'auto', ['api'], false, false, 3 * HOUR, 0],
    ['s-cron', 'Move cron jobs to queue workers', 'billing-api', 'codex', 'gpt-5.5', ['api'], false, false, 5 * HOUR, 0],
    ['s-onboard', 'Onboarding email copy', 'marketing-site', 'opencode', 'auto', ['docs'], false, false, 20 * HOUR, 0],
    ['s-deps', 'Bump dependencies and fix types', 'acme-web', 'claude', 'sonnet', [], false, false, 26 * HOUR, 0],
    ['s-release', 'Release notes for 2.4', 'acme-web', 'claude', 'opus', ['docs', 'task:tk-docs'], false, false, 2 * DAY, 0],
    ['s-webhooks', 'Retry failed Stripe webhooks', 'billing-api', 'claude', 'opus', ['api'], false, false, 3 * DAY, 0],
]

export function sessionFull(row) {
    const [id, title, proj, flavor, model, tags, active, thinking, age, pending] = row
    const at = NOW - age
    const requests = {}
    if (pending) requests['req-1'] = { tool: 'Bash', arguments: { command: 'pnpm test e2e/login.spec.ts --repeat-each 20', description: 'Run the login test 20 times' }, createdAt: NOW - 2 * MIN }
    return {
        id, namespace: 'default', seq: 10, createdAt: at - 40 * MIN, updatedAt: at, active, activeAt: at,
        metadata: {
            path: `${HOME}/code/${proj}`, host: 'macbook', version: '0.17.0', os: 'darwin',
            summary: { text: title, updatedAt: at }, machineId: MACHINE_ID, tags, model, thinkEffort: 'high',
            flavor, homeDir: HOME, startedFromRunner: true, startedBy: 'runner', lifecycleState: active ? 'running' : 'archived',
            ...(flavor === 'claude' ? { claudeAccount: { id: 'work', email: 'you@example.com', automatic: true, status: 'active', updatedAt: at }, rateLimitSnapshot: { five_hour: { status: 'allowed', utilization: 0.38, resetsAt: Math.floor((NOW + 2 * HOUR) / 1000), observedAt: NOW }, usageLimits: [{ kind: 'session', percent: 38, resetsAt: Math.floor((NOW + 2 * HOUR) / 1000), severity: 'normal', observedAt: NOW }, { kind: 'weekly_all', percent: 61, resetsAt: Math.floor((NOW + 3 * DAY) / 1000), severity: 'normal', observedAt: NOW }] } } : {}),
            slashCommands: ['review', 'compact', 'init', 'pr-comments', 'security-review', 'release-notes', 'test-plan'],
        },
        metadataVersion: 1,
        agentState: { controlledByUser: false, requests, completedRequests: {} }, agentStateVersion: 1,
        thinking, thinkingAt: at, permissionMode: 'default', modelMode: model === 'opus' ? 'opus' : model === 'sonnet' ? 'sonnet' : 'default',
        todos: id === 's-checkout' ? [
            { content: 'Reproduce the double charge', status: 'completed', priority: 'high', id: '1' },
            { content: 'Lock the order row while paying', status: 'completed', priority: 'high', id: '2' },
            { content: 'Add a regression test', status: 'in_progress', priority: 'medium', id: '3' },
        ] : undefined,
    }
}
export const SESSIONS = Object.fromEntries(S.map(r => [r[0], sessionFull(r)]))

export function summary(s) {
    const m = s.metadata
    return {
        id: s.id, createdAt: s.createdAt, active: s.active, thinking: s.thinking, activeAt: s.activeAt, updatedAt: s.updatedAt,
        metadata: { path: m.path, machineId: m.machineId, tags: m.tags, model: m.model, thinkEffort: m.thinkEffort, summary: { text: m.summary.text }, flavor: m.flavor },
        todoProgress: s.todos ? { completed: s.todos.filter(t => t.status === 'completed').length, total: s.todos.length } : null,
        pendingRequestsCount: Object.keys(s.agentState.requests).length, modelMode: s.modelMode,
    }
}

// ---------- messages ----------
let uuidN = 0
export const uid = (p = 'u') => `${p}-${(++uuidN).toString(16).padStart(8, '0')}-demo`
export function userMsg(seq, text, t) {
    return { id: uid('m'), seq, localId: null, content: { role: 'user', content: { type: 'text', text }, meta: { sentFrom: 'webapp' } }, createdAt: t }
}
export function agentOut(seq, data, t) {
    return { id: uid('m'), seq, localId: null, content: { role: 'agent', content: { type: 'output', data: { isSidechain: false, userType: 'external', cwd: `${HOME}/code/acme-web`, sessionId: 'claude-demo', version: '0.0.0', uuid: uid(), parentUuid: null, timestamp: new Date(t).toISOString(), ...data } }, meta: { sentFrom: 'cli' } }, createdAt: t }
}
export const asst = (content) => ({ type: 'assistant', message: { model: 'claude-opus-5-5', id: uid('msg'), type: 'message', role: 'assistant', content, stop_reason: null, usage: { input_tokens: 3, output_tokens: 120 } } })
export const toolRes = (id, text) => ({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: text }] } })

export function buildTurn(sessionId, turnIndex, startSeq, t0, userText, steps, finalText) {
    const msgs = []
    let seq = startSeq
    let t = t0
    const stepGap = finalText ? 9_000 : 15_000
    const userM = userMsg(seq++, userText, t)
    msgs.push(userM)
    for (const st of steps) {
        t += stepGap
        if (st.text) { msgs.push(agentOut(seq++, asst([{ type: 'text', text: st.text }]), t)); continue }
        const id = uid('toolu')
        msgs.push(agentOut(seq++, asst([{ type: 'tool_use', id, name: st.tool, input: st.input }]), t))
        t += 3_000
        msgs.push(agentOut(seq++, toolRes(id, st.out ?? ''), t))
    }
    t += 10_000
    if (finalText) msgs.push(agentOut(seq++, asst([{ type: 'text', text: finalText }]), t))
    const turn = {
        id: `turn-${sessionId}-${turnIndex}`, sessionId, turnIndex, status: finalText ? 'closed' : 'open', userMessageId: userM.id, userSeq: startSeq,
        agentStartSeq: startSeq + 1, agentEndSeq: seq - 1, messageCount: msgs.length - 1,
        userPreview: userText.slice(0, 60), assistantPreview: finalText ? finalText.slice(0, 60) : null, createdAt: t0, updatedAt: t,
    }
    return { turn, msgs, nextSeq: seq, endT: t }
}

const CONVOS = {
    's-checkout': [
        {
            user: 'Look at the checkout errors from this week. What breaks most?',
            steps: [
                { tool: 'Bash', input: { command: 'sentry-cli issues list --project acme-web --query "checkout" --period 7d', description: 'List checkout errors from the last 7 days' }, out: '3 issues' },
                { tool: 'Read', input: { file_path: `${HOME}/code/acme-web/src/checkout/api.ts` }, out: '…' },
            ],
            final: 'Double charges are the top problem: 41 of 50 checkout errors this week (82%).\n\n| Error | Count |\n|---|---|\n| Duplicate charge | 41 |\n| Card declined, no message | 6 |\n| Timeout on 3-D Secure | 3 |\n\nAll 41 duplicates come from phones, within 1 s of the first tap.',
        },
        {
            user: 'Customers get charged twice when they double-tap "Pay". Find out why and fix it.',
            steps: [
                { tool: 'Grep', input: { pattern: 'createPayment', path: 'src/checkout' }, out: 'src/checkout/pay.ts:42\nsrc/checkout/api.ts:18' },
                { tool: 'Read', input: { file_path: `${HOME}/code/acme-web/src/checkout/pay.ts` }, out: '…' },
                { text: 'The pay handler reads the order, then charges. Two taps run both steps in parallel.' },
                { tool: 'Edit', input: { file_path: `${HOME}/code/acme-web/src/checkout/pay.ts`, old_string: 'const order = await db.order.find(id)', new_string: 'const order = await db.order.lockForPayment(id)' }, out: 'ok' },
                { tool: 'Bash', input: { command: 'pnpm vitest run src/checkout', description: 'Run checkout tests' }, out: '✓ 38 passed (2.1s)' },
            ],
            final: 'Fixed: two taps no longer charge twice.\n\nThe handler read the order and charged it in two steps, so a second tap could run in between. The order row is now locked for the payment, and the button is disabled while the request is open.\n\n- `src/checkout/pay.ts`: lock the order row before the charge\n- `src/checkout/PayButton.tsx`: disable while pending\n- 38 checkout tests pass. Not verified on staging yet.',
        },
        {
            user: 'Add a regression test and open a PR.',
            steps: [
                { tool: 'Write', input: { file_path: `${HOME}/code/acme-web/src/checkout/pay.race.test.ts`, content: "it('charges once on double tap', async () => {\n  await Promise.all([pay(order), pay(order)])\n  expect(stripe.charges).toHaveLength(1)\n})" }, out: 'ok' },
                { tool: 'Bash', input: { command: 'pnpm vitest run src/checkout/pay.race.test.ts', description: 'Run the new test' }, out: '✓ 1 passed' },
                { tool: 'Bash', input: { command: 'gh pr create --fill', description: 'Open the pull request' }, out: 'https://github.com/acme/acme-web/pull/482' },
            ],
            final: 'PR #482 is open. The new test fails on main and passes on the branch.\n\nReport with the before/after timeline: [Checkout race fix](https://matemind.ai/r/demo-checkout).',
        },
        {
            user: 'Good. Also check the refund path for the same bug.',
            steps: [
                { tool: 'Grep', input: { pattern: 'refund', path: 'src' }, out: 'src/checkout/refund.ts:12\nsrc/admin/orders.tsx:88' },
                { tool: 'Read', input: { file_path: `${HOME}/code/acme-web/src/checkout/refund.ts` }, out: '…' },
            ],
            final: null,
        },
    ],
}

export const TURNS = {}
export const MESSAGES = {}
for (const [sid, convo] of Object.entries(CONVOS)) {
    let seq = 1
    const starts = [NOW - 75 * MIN, NOW - 52 * MIN, NOW - 24 * MIN, NOW - 70_000]
    TURNS[sid] = []
    MESSAGES[sid] = []
    convo.forEach((c, i) => {
        const t = starts[i] ?? NOW - (convo.length - i) * 10 * MIN
        const b = buildTurn(sid, i + 1, seq, t, c.user, c.steps, c.final)
        TURNS[sid].push({ ...b.turn, messages: b.msgs })
        MESSAGES[sid].push(...b.msgs)
        seq = b.nextSeq
    })
}

// ---------- groups ----------
export const G = 'g-checkout-squad'
const group = {
    group: { id: G, namespace: 'default', name: 'Checkout squad', description: 'Payment bugs before the 2.4 release', noteSessionId: 's-checkout', notePrompt: null, createdAt: NOW - 2 * DAY, updatedAt: NOW - 5 * MIN },
    members: ['s-checkout', 's-flaky', 's-csv', 's-docs'].map((sid, i) => ({ id: i + 1, groupId: G, namespace: 'default', memberType: 'session', sessionId: sid, userId: null, role: 'member', createdAt: NOW - 2 * DAY })),
    note: { groupId: G, namespace: 'default', content: '## Release 2.4: checkout\n\n- Double charge: fixed in PR #482\n- Flaky login test: 1 in 20 runs fail, cause not found yet\n- CSV export: refund column in progress\n- Docs: wait for the PR to merge\n\nDecision needed: ship 2.4 on Thursday or wait for the refund check?', version: 7, updatedBy: 's-checkout', updatedAt: NOW - 5 * MIN },
}
const GROUP2 = {
    group: { id: 'g-billing', namespace: 'default', name: 'Billing exports', description: null, noteSessionId: null, notePrompt: null, createdAt: NOW - 5 * DAY, updatedAt: NOW - 3 * HOUR },
    members: ['s-csv', 's-invoice', 's-cron'].map((sid, i) => ({ id: 10 + i, groupId: 'g-billing', namespace: 'default', memberType: 'session', sessionId: sid, userId: null, role: 'member', createdAt: NOW - 5 * DAY })),
    note: null,
}
export const GROUPS = [group, GROUP2]

export const gseqRef = { value: 0 }
export const gmsg = (type, source, payload, t, extra = {}) => ({ id: `gm-${++gseqRef.value}`, groupId: G, namespace: 'default', seq: gseqRef.value, type, source, payload, createdAt: t, ...extra })
export const chatFrom = (sid, text, t) => gmsg('chat', `session:${sid}`, { sessionId: sid, contentType: 'output', text }, t, { actorSessionId: sid, targetSessionIds: [sid] })
export const GROUP_MESSAGES = [
    gmsg('command', 'user:web', { text: '@all Release 2.4 is Thursday. Post your status in one line.' }, NOW - 40 * MIN, { targetSessionIds: ['s-checkout', 's-flaky', 's-csv', 's-docs'] }),
    chatFrom('s-checkout', 'Double charge is fixed. PR #482 is open, 38 tests pass.', NOW - 39 * MIN),
    chatFrom('s-flaky', 'Login test fails 1 in 20 runs. I guess a timing issue with the session cookie; not verified.', NOW - 38 * MIN),
    chatFrom('s-csv', 'CSV export works. The refund column is missing; I asked the checkout session for the schema.', NOW - 37 * MIN),
    chatFrom('s-checkout', 'Refunds live in `refunds` with `order_id`, `amount_cents` and `created_at`. One row per refund.', NOW - 35 * MIN),
    chatFrom('s-docs', 'Docs are ready. I will publish after PR #482 merges.', NOW - 34 * MIN),
    gmsg('command', 'user:web', { text: '@s-flaky Run it 50 times with tracing on and send me the failing trace.' }, NOW - 12 * MIN, { targetSessionIds: ['s-flaky'] }),
    chatFrom('s-flaky', 'Running 50 times now. 2 failures so far, both at the cookie refresh. I will post the trace when the run ends.', NOW - 4 * MIN),
]
export const GROUP_TASKS = [
    { id: 'gt-1', groupId: G, namespace: 'default', traceId: 'tr-1', source: 'user:web', targetSessionId: 's-flaky', command: 'Run it 50 times with tracing on and send me the failing trace.', status: 'running', dedupeKey: null, expiresAt: null, createdAt: NOW - 12 * MIN, updatedAt: NOW - 4 * MIN, startedAt: NOW - 12 * MIN, completedAt: null, error: null },
    { id: 'gt-2', groupId: G, namespace: 'default', traceId: 'tr-0', source: 'session:s-csv', targetSessionId: 's-checkout', command: 'Send the refund schema', status: 'completed', dedupeKey: null, expiresAt: null, createdAt: NOW - 37 * MIN, updatedAt: NOW - 35 * MIN, startedAt: NOW - 37 * MIN, completedAt: NOW - 35 * MIN, error: null },
]

// ---------- files / git ----------
const PAY_TS = `import { db } from '@/server/db'
import { stripe } from '@/server/stripe'
import { PaymentError } from './errors'

export async function pay(orderId: string, userId: string) {
  // Lock the row so a second tap waits for the first one.
  const order = await db.order.lockForPayment(orderId)
  if (order.userId !== userId) {
    throw new PaymentError('not-owner')
  }
  if (order.status === 'paid') {
    return { ok: true, chargeId: order.chargeId }
  }

  const charge = await stripe.charges.create({
    amount: order.totalCents,
    currency: order.currency,
    customer: order.customerId,
    idempotency_key: \`order-\${order.id}\`,
  })

  await db.order.markPaid(order.id, charge.id)
  return { ok: true, chargeId: charge.id }
}
`
const PAY_TS_OLD = PAY_TS
    .replace("  // Lock the row so a second tap waits for the first one.\n  const order = await db.order.lockForPayment(orderId)", '  const order = await db.order.find(orderId)')
    .replace("    idempotency_key: `order-${order.id}`,\n", '')
    .replace("  if (order.status === 'paid') {\n    return { ok: true, chargeId: order.chargeId }\n  }\n\n", '')
const BTN_TSX = `export function PayButton({ orderId }: { orderId: string }) {
  const pay = usePay()
  return (
    <Button
      disabled={pay.isPending}
      onClick={() => pay.mutate(orderId)}
    >
      {pay.isPending ? 'Paying…' : 'Pay now'}
    </Button>
  )
}
`
const BTN_OLD = BTN_TSX.replace("      disabled={pay.isPending}\n", '').replace("{pay.isPending ? 'Paying…' : 'Pay now'}", "Pay now")
const RACE_TEST = `import { describe, expect, it } from 'vitest'
import { pay } from './pay'

describe('pay', () => {
  it('charges once on double tap', async () => {
    const order = await seedOrder({ totalCents: 4900 })
    await Promise.all([pay(order.id, order.userId), pay(order.id, order.userId)])
    expect(stripe.charges).toHaveLength(1)
  })
})
`
export const FILES = {
    'src/checkout/pay.ts': { content: PAY_TS, head: PAY_TS_OLD, status: 'modified' },
    'src/checkout/PayButton.tsx': { content: BTN_TSX, head: BTN_OLD, status: 'modified' },
    'src/checkout/pay.race.test.ts': { content: RACE_TEST, head: null, status: 'untracked' },
}
export const DIRS = {
    '': [['src', 'directory'], ['e2e', 'directory'], ['public', 'directory'], ['docs', 'directory'], ['package.json', 'file', 812], ['pnpm-lock.yaml', 'file', 182344], ['README.md', 'file', 2310], ['tsconfig.json', 'file', 644], ['vite.config.ts', 'file', 1022], ['.env.example', 'file', 210]],
    'src': [['checkout', 'directory'], ['components', 'directory'], ['routes', 'directory'], ['server', 'directory'], ['main.tsx', 'file', 702], ['App.tsx', 'file', 1840]],
    'src/checkout': [['api.ts', 'file', 1320], ['errors.ts', 'file', 410], ['pay.ts', 'file', PAY_TS.length], ['pay.race.test.ts', 'file', RACE_TEST.length], ['PayButton.tsx', 'file', BTN_TSX.length], ['refund.ts', 'file', 990]],
}

export function numstatLine(path) {
    const f = FILES[path]
    const a = f.content.split('\n'), b = (f.head ?? '').split('\n')
    const added = a.filter(l => !b.includes(l)).length, removed = b.filter(l => l && !a.includes(l)).length
    return { added, removed }
}
export function unifiedDiff(path) {
    const f = FILES[path]
    const a = (f.head ?? '').split('\n'), b = f.content.split('\n')
    // simple LCS diff
    const n = a.length, m = b.length
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    const lines = []
    let i = 0, j = 0
    while (i < n || j < m) {
        if (i < n && j < m && a[i] === b[j]) { lines.push(' ' + a[i]); i++; j++ }
        else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) { lines.push('+' + b[j]); j++ }
        else { lines.push('-' + a[i]); i++ }
    }
    const header = f.head == null
        ? `diff --git a/${path} b/${path}\nnew file mode 100644\n--- /dev/null\n+++ b/${path}\n@@ -0,0 +1,${m} @@\n`
        : `diff --git a/${path} b/${path}\n--- a/${path}\n+++ b/${path}\n@@ -1,${n} +1,${m} @@\n`
    return header + lines.join('\n') + '\n'
}

// ---------- claude accounts, memory, misc ----------
export const claudeAccounts = {
    revision: 'rev-3',
    pool: {
        initialAccount: 'work', autoSwitch: true,
        profiles: [
            { id: 'work', email: 'you@example.com', trustGroup: 'Work', enabled: true },
            { id: 'personal', email: 'you+side@example.com', trustGroup: 'Personal', enabled: true },
            { id: 'team', email: 'team@example.com', trustGroup: 'Work', enabled: true },
        ],
    },
    usage: {
        work: { usageLimits: [{ kind: 'session', percent: 38, resetsAt: Math.floor((NOW + 2 * HOUR) / 1000), severity: 'normal', observedAt: NOW }, { kind: 'weekly_all', percent: 61, resetsAt: Math.floor((NOW + 3 * DAY) / 1000), severity: 'normal', observedAt: NOW }] },
        personal: { usageLimits: [{ kind: 'session', percent: 9, resetsAt: Math.floor((NOW + 4 * HOUR) / 1000), severity: 'normal', observedAt: NOW }, { kind: 'weekly_all', percent: 22, resetsAt: Math.floor((NOW + 5 * DAY) / 1000), severity: 'normal', observedAt: NOW }] },
        team: { usageLimits: [{ kind: 'session', percent: 87, resetsAt: Math.floor((NOW + 1 * HOUR) / 1000), severity: 'warning', observedAt: NOW }, { kind: 'weekly_all', percent: 74, resetsAt: Math.floor((NOW + 2 * DAY) / 1000), severity: 'normal', observedAt: NOW }] },
    },
}

export const SLASH = [
    ['review', 'Review the current changes and find issues', 'builtin'],
    ['compact', 'Summarize the conversation to free up context', 'builtin'],
    ['security-review', 'Check the pending changes for security issues', 'builtin'],
    ['pr-comments', 'Get comments from a GitHub pull request', 'builtin'],
    ['init', 'Create a CLAUDE.md file with codebase notes', 'builtin'],
    ['release-notes', 'Draft release notes from merged PRs', 'project'],
    ['test-plan', 'Write a test plan for the current branch', 'user'],
    ['clear', 'Clear the conversation history', 'builtin'],
    ['cost', 'Show token usage and cost for this session', 'builtin'],
]


export const b64 = (text: string) => {
    const bytes = new TextEncoder().encode(text)
    let binary = ''
    bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
    return btoa(binary)
}
