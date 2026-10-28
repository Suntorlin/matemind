// @ts-nocheck -- Demo-mode mock data (VITE_DEMO=1 builds only). Synthetic tasks: a running one with a decision, one
// at the report, and one whose draft waits for the user.
/* eslint-disable */
import { NOW, MIN, HOUR, DAY, HOME, MACHINE_ID } from './fixtures'

// id, title, project dir, flavor, model, tags, active, thinking, age(ms since activity), pending
export const TASK_SESSION_ROWS = [
    ['s-t-lead', 'Lead: make refunds safe to retry', 'acme-web', 'claude', 'opus', ['web'], true, false, 4 * MIN, 0],
    ['s-t-lock', 'Lock the order row in the refund path', 'acme-web', 'claude', 'opus', ['web'], false, false, 25 * MIN, 0],
    ['s-t-csv', 'Add the refund column to the CSV export', 'billing-api', 'claude', 'sonnet', ['api'], true, true, 20_000, 0],
    ['s-t-btn', 'Disable the refund button while pending', 'acme-web', 'claude', 'sonnet', ['web'], true, true, 45_000, 0],
    ['s-t-perf-lead', 'Lead: dashboard first load under 1 s', 'acme-web', 'claude', 'opus', ['web'], false, false, 2 * HOUR, 0],
    ['s-t-perf-review', 'Review: dashboard first load', 'acme-web', 'claude', 'opus', ['web'], false, false, 2 * HOUR, 0],
    ['s-t-passkey-plan', 'Plan: passkeys for team plans', 'acme-web', 'claude', 'opus', ['web'], true, false, 3 * MIN, 0],
]

const REPO = `${HOME}/code/acme-web`

const member = (groupId, sid, role, i) => ({ id: 100 + i, groupId, namespace: 'default', memberType: 'session', sessionId: sid, userId: null, role, createdAt: NOW - DAY })

function taskGroup(task, members) {
    return {
        group: {
            id: task.id, namespace: 'default', name: task.name, description: null, noteSessionId: null, notePrompt: null,
            kind: 'task', tag: task.tag, status: task.status, goal: task.goal, archivedAt: null,
            createdAt: task.createdAt, updatedAt: task.updatedAt,
        },
        members: members.map(([sid, role], i) => member(task.id, sid, role, i)),
        note: null,
    }
}

const base = {
    nonGoals: [], repoPath: REPO, machineId: MACHINE_ID, files: [], draft: null, completedAt: null,
}

// ---------- 1. running, one decision waits for the user ----------
const REFUND_ACCEPTANCE = [
    { id: 'a1', text: 'Two refund requests for one order pay out once', source: 'principle', sourceRef: 'Money paths need a concurrency test', verify: 'Test sends 2 parallel refunds; 1 payout in Stripe test mode' },
    { id: 'a2', text: 'The refund button is disabled while a request is open', source: 'inferred', sourceRef: null, verify: 'Component test clicks twice' },
    { id: 'a3', text: 'The monthly CSV has a refund column that matches the refunds table', source: 'user', sourceRef: null, verify: 'Sum of the column equals the table for March' },
    { id: 'a4', text: 'All checkout and billing tests pass', source: 'repo', sourceRef: 'CONTRIBUTING.md', verify: 'pnpm test' },
]

export const TASK_REFUND = {
    ...base,
    id: 'tg-refund', name: 'Make refunds safe to retry', tag: 'web', status: 'active',
    goal: 'A refund that is retried or clicked twice pays out once, and finance sees every refund in the CSV export.',
    nonGoals: ['Partial refunds', 'A new refund UI'],
    acceptance: REFUND_ACCEPTANCE,
    leadSessionId: 's-t-lead',
    members: [{ sessionId: 's-t-lead', role: 'lead' }, { sessionId: 's-t-lock', role: 'worker' }, { sessionId: 's-t-csv', role: 'worker' }, { sessionId: 's-t-btn', role: 'worker' }],
    guide: { state: 'confirmed', error: null, request: 'Refunds can pay out twice, like checkout did. Fix it, and add refunds to the finance CSV.' },
    load: { progress: 1, correction: 0, decision: 1, request: 1 },
    createdAt: NOW - 70 * MIN, updatedAt: NOW - 2 * MIN,
    run: {
        phase: 'running',
        subtasks: [
            { id: 'st1', title: 'Lock the order row in the refund path', brief: 'Use the same lock as pay.ts.', criteria: ['a1'], dependsOn: [], fix: false, state: 'done', sessionId: 's-t-lock', branch: 'task/refund-lock', summary: '`refund.ts` locks the order row. A test with 2 parallel refunds passes: 1 payout.', startedAt: NOW - 55 * MIN, doneAt: NOW - 25 * MIN, live: { active: false, thinking: false, lastActivityAt: NOW - 25 * MIN, step: null, waiting: null } },
            { id: 'st2', title: 'Add the refund column to the CSV export', brief: 'One row per refund, negative amount.', criteria: ['a3'], dependsOn: [], fix: false, state: 'running', sessionId: 's-t-csv', branch: 'task/refund-csv', summary: null, startedAt: NOW - 50 * MIN, doneAt: null, live: { active: true, thinking: true, lastActivityAt: NOW - 20_000, step: 'Running pnpm test reports', waiting: null } },
            { id: 'st3', title: 'Disable the refund button while pending', brief: 'Same pattern as PayButton.', criteria: ['a2'], dependsOn: [], fix: false, state: 'running', sessionId: 's-t-btn', branch: 'task/refund-button', summary: null, startedAt: NOW - 48 * MIN, doneAt: null, live: { active: true, thinking: false, lastActivityAt: NOW - 45_000, step: null, waiting: 'Waits for your decision' } },
            { id: 'st4', title: 'Regression test: retry a refund after a timeout', brief: 'Needs the decision on retries.', criteria: ['a1', 'a4'], dependsOn: ['st1'], fix: false, state: 'waiting', sessionId: null, branch: null, summary: null, startedAt: null, doneAt: null },
        ],
        decisions: [
            {
                id: 'd2', subtaskId: 'st3', askedBy: 's-t-btn', askedAt: NOW - 2 * MIN,
                question: 'Stripe can time out after the money moved. What should a retry do?',
                context: '6 refunds timed out last month. Today a retry sends a second refund.',
                options: [
                    { label: 'Ask Stripe first, then retry', good: 'No double payout, also after a timeout', cost: 'One more API call per retry (about 200 ms)' },
                    { label: 'Idempotency key only', good: 'Least code; Stripe drops the duplicate', cost: 'Keys expire after 24 h; a later retry pays twice' },
                    { label: 'Block retries, ask finance', good: 'No risk of a double payout', cost: 'Manual work for every timeout, about 6 a month' },
                ],
                recommended: 'Ask Stripe first, then retry',
                answer: null,
            },
            {
                id: 'd1', subtaskId: 'st2', askedBy: 's-t-csv', askedAt: NOW - 40 * MIN,
                question: 'Show refunds as negative rows or as a separate column?',
                context: null,
                options: [{ label: 'Negative rows', good: 'Totals add up as they are', cost: null }, { label: 'Separate column', good: null, cost: 'Finance changes their sheet' }],
                recommended: 'Negative rows',
                answer: { label: 'Negative rows', by: 'precedent', memoryId: 'mem-csv', at: NOW - 40 * MIN },
            },
        ],
        signals: [],
        integration: null, review: null, report: null, revisions: [], delivery: null,
        watch: {
            checkedAt: NOW - 30_000,
            log: [
                { at: NOW - 40 * MIN, kind: 'auto_approved', text: 'Answered from memory: refunds are negative rows (you said so on Oct 12)', notified: false },
                { at: NOW - 25 * MIN, kind: 'reminded', text: 'Subtask 1 is done: 2 parallel refunds pay out once', notified: false },
                { at: NOW - 2 * MIN, kind: 'approval', text: 'Subtask 3 waits for your decision on retries', notified: true },
            ],
        },
    },
}

// ---------- 2. at the report ----------
export const TASK_PERF = {
    ...base,
    id: 'tg-perf', name: 'Dashboard first load under 1 s', tag: 'web', status: 'active',
    goal: 'The dashboard shows its first numbers in under 1 s on a fast 4G profile.',
    acceptance: [
        { id: 'p1', text: 'First contentful paint is under 1 s on fast 4G', source: 'user', sourceRef: null, verify: 'Lighthouse, 3 runs, median' },
        { id: 'p2', text: 'The main bundle is under 500 KB', source: 'inferred', sourceRef: null, verify: 'pnpm analyze' },
        { id: 'p3', text: 'Charts and dates look the same as before', source: 'principle', sourceRef: 'No visual change in a perf task', verify: 'Screenshot diff of 5 pages' },
    ],
    leadSessionId: 's-t-perf-lead',
    members: [{ sessionId: 's-t-perf-lead', role: 'lead' }, { sessionId: 's-perf', role: 'worker' }, { sessionId: 's-t-perf-review', role: 'reviewer' }],
    guide: { state: 'confirmed', error: null, request: 'The dashboard takes 3 s to load. Get it under 1 s.' },
    load: { progress: 0, correction: 0, decision: 0, request: 1 },
    createdAt: NOW - 5 * HOUR, updatedAt: NOW - 2 * HOUR,
    run: {
        phase: 'reporting',
        subtasks: [
            { id: 'ps1', title: 'Load charts only on the Reports tab', brief: '', criteria: ['p1', 'p2'], dependsOn: [], fix: false, state: 'done', sessionId: 's-perf', branch: 'task/perf-charts', summary: 'Charts load on demand. Main bundle 1.9 MB → 420 KB.', startedAt: NOW - 4 * HOUR, doneAt: NOW - 3 * HOUR },
            { id: 'ps2', title: 'Replace the date library with Intl', brief: '', criteria: ['p2', 'p3'], dependsOn: [], fix: false, state: 'done', sessionId: 's-perf', branch: 'task/perf-dates', summary: 'Dates use Intl. 5 pages match the old screenshots.', startedAt: NOW - 4 * HOUR, doneAt: NOW - 3 * HOUR },
        ],
        decisions: [],
        signals: [],
        integration: { branch: 'task/dashboard-1s', worktree: `${REPO}-worktrees/dashboard-1s`, summary: '2 branches merged, no conflicts.' },
        review: {
            round: 1,
            results: [
                { criterionId: 'p1', status: 'met', evidence: 'Median FCP 0.82 s (was 3.1 s), 3 Lighthouse runs.' },
                { criterionId: 'p2', status: 'met', evidence: 'main.js is 420 KB (was 1.9 MB).' },
                { criterionId: 'p3', status: 'met', evidence: '5 of 5 pages match the old screenshots.' },
            ],
            suggestions: ['Preload the Reports chunk when the cursor moves to the tab.'],
        },
        report: { conclusion: 'First load is 0.82 s (was 3.1 s). All 3 criteria are met.', markdown: '', shareUrl: null, at: NOW - 2 * HOUR },
        revisions: [],
        delivery: { conclusion: 'First load is 0.82 s (was 3.1 s). All 3 criteria are met.', body: '- Charts load only on the Reports tab\n- Dates use `Intl` instead of a 300 KB library\n- Branch `task/dashboard-1s` is ready to merge. Not pushed.', at: NOW - 2 * HOUR },
        watch: { checkedAt: NOW - 2 * HOUR, log: [] },
    },
}

// ---------- 3. the draft waits for the user ----------
export const TASK_PASSKEY = {
    ...base,
    id: 'tg-passkey', name: 'Passkeys for team plans', tag: 'web', status: 'guiding',
    goal: null, acceptance: [],
    leadSessionId: 's-t-passkey-plan',
    members: [{ sessionId: 's-t-passkey-plan', role: 'lead' }],
    guide: { state: 'ready', error: null, request: 'Team admins want to require passkeys for their members.' },
    load: null, run: null,
    createdAt: NOW - 6 * MIN, updatedAt: NOW - 3 * MIN,
    draft: {
        version: 1, tag: 'web', repoPath: REPO,
        goal: 'A team admin can require passkeys. Members without a passkey must add one at their next sign-in.',
        nonGoals: ['Passkeys for personal plans'],
        criteria: [
            { id: 'k1', text: 'An admin can turn on "Require passkeys" in team settings', source: 'user', sourceRef: null, verify: 'e2e test' },
            { id: 'k2', text: 'A member without a passkey must add one before the dashboard opens', source: 'inferred', sourceRef: null, verify: 'e2e test' },
            { id: 'k3', text: 'Firefox users can still sign in with the fallback', source: 'repo', sourceRef: 'docs/browsers.md', verify: 'Playwright, Firefox' },
        ],
        questions: [
            {
                id: 'q1', text: 'What happens to a member who has no device for passkeys?',
                options: [
                    { id: 'o1', label: 'Admin can make an exception', good: 'Nobody is locked out', cost: 'One more admin screen' },
                    { id: 'o2', label: 'No exceptions', good: 'Simple and strict', cost: 'Some members cannot sign in' },
                ],
                default: 'o1', precedentRef: 'SSO rollout: you allowed exceptions',
            },
        ],
    },
}

export const DEMO_TASKS = [TASK_REFUND, TASK_PERF, TASK_PASSKEY]

export const TASK_GROUPS = [
    taskGroup(TASK_REFUND, TASK_REFUND.members.map((m) => [m.sessionId, m.role])),
    taskGroup(TASK_PERF, TASK_PERF.members.map((m) => [m.sessionId, m.role])),
    taskGroup(TASK_PASSKEY, TASK_PASSKEY.members.map((m) => [m.sessionId, m.role])),
]

// One finished turn for each task session that shows a conversation.
export const TASK_EXTRA = {
    's-t-lead': {
        user: 'Refunds can pay out twice, like checkout did. Fix it, and add refunds to the finance CSV.',
        steps: [{ tool: 'Read', input: { file_path: `${REPO}/src/checkout/refund.ts` }, out: '…' }, { tool: 'Grep', input: { pattern: 'refund', path: 'src/reports' }, out: '0 matches' }],
        final: 'Split into 4 subtasks. 3 run now, the retry test waits for subtask 1.\n\n- Subtask 1 is done: 2 parallel refunds pay out once.\n- Subtask 3 asks how a retry after a Stripe timeout should work. I suggest "Ask Stripe first".',
    },
    's-t-csv': {
        user: 'Add the refund column to the monthly CSV export. One row per refund, negative amount.',
        steps: [{ tool: 'Edit', input: { file_path: `${HOME}/code/billing-api/src/reports/monthly.ts`, old_string: 'rows.push(payment)', new_string: 'rows.push(payment, ...refundRows(payment))' }, out: 'ok' }],
        final: 'Refund rows are in the export. Running the report tests now.',
    },
    's-t-btn': {
        user: 'Disable the refund button while a request is open. Same pattern as PayButton.',
        steps: [{ tool: 'Edit', input: { file_path: `${REPO}/src/checkout/RefundButton.tsx`, old_string: '<Button onClick={refund}>', new_string: '<Button onClick={refund} disabled={pending}>' }, out: 'ok' }],
        final: 'The button is disabled while pending. Before the retry path, I need a decision: what should a retry do after a Stripe timeout?',
    },
    's-t-perf-lead': {
        user: 'The dashboard takes 3 s to load. Get it under 1 s.',
        steps: [{ tool: 'Bash', input: { command: 'pnpm build && pnpm analyze', description: 'Measure the bundle' }, out: 'main.js 1.9 MB' }],
        final: 'First load is 0.82 s (was 3.1 s). All 3 criteria are met.\n\nBranch `task/dashboard-1s` is ready to merge. Not pushed.',
    },
}

// The task groups' timelines: the task page's "latest" line shows the newest one.
let tseq = 0
const tchat = (groupId, sid, text, t) => ({ id: `tgm-${++tseq}`, groupId, namespace: 'default', seq: tseq, type: 'chat', source: `session:${sid}`, payload: { sessionId: sid, contentType: 'output', text }, createdAt: t, actorSessionId: sid, targetSessionIds: [sid] })
const tuser = (groupId, text, t) => ({ id: `tgm-${++tseq}`, groupId, namespace: 'default', seq: tseq, type: 'command', source: 'user:web', payload: { text }, createdAt: t, targetSessionIds: [] })
export const TASK_GROUP_MESSAGES = {
    'tg-refund': [
        tuser('tg-refund', TASK_REFUND.guide.request, NOW - 70 * MIN),
        tchat('tg-refund', 's-t-lead', 'Split into 4 subtasks. 3 run now; the retry test waits for subtask 1.', NOW - 55 * MIN),
        tchat('tg-refund', 's-t-lead', 'Subtask 1 is done: 2 parallel refunds pay out once. Subtask 3 needs your call on retries; I suggest "Ask Stripe first".', NOW - 2 * MIN),
    ],
    'tg-passkey': [
        tuser('tg-passkey', TASK_PASSKEY.guide.request, NOW - 6 * MIN),
        tchat('tg-passkey', 's-t-passkey-plan', 'Draft ready: 3 criteria and 1 question. I used your SSO rollout as the default for exceptions.', NOW - 3 * MIN),
    ],
}
