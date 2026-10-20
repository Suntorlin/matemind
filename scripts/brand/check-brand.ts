/**
 * Fails when a pre-rename product name (hapi / haqi) shows up in code, except where it must stay:
 * compatibility with old installs, upstream services we still call, and credits.
 */
import { $ } from 'bun'

const CODE_PATHS = ['cli/src', 'cli/scripts', 'cli/bin', 'hub/src', 'shared/src', 'web/src', 'web/index.html', 'scripts', 'package.json']
const LEGACY = /hapi|haqi/i

// A line may keep an old name when it matches one of these.
const ALLOW: RegExp[] = [
    /\b(relay|app)\.hapi\.run\b/, // upstream relay and web app (external services)
    /admin@hapi\.run/, // upstream Web Push contact
    /tiann\/(tap|hapi)/, // upstream repo and Homebrew tap
    /\/data\/github\/happy\/hapi/, // test fixture path
    /'hapi'\s*$|\?\? 'hapi'/, // tunwg relay auth value of the upstream relay
    /x-hapi-protocol-version|X-Hapi-Protocol-Version/, // header read/sent for pre-rename CLIs and hubs
    /@@HAPI_REPO/, // git markers from pre-rename CLIs
    /\bLEGACY_|legacyEnv|legacyBrand|before the Matemind rename|was called HAQI/, // compatibility code (say why on the line)
]

const files = (await $`git ls-files -- ${CODE_PATHS}`.text()).split('\n')// Files that exist to handle the old names: compatibility code and the privacy guard.
    .filter((file) => file && file !== 'scripts/brand/check-brand.ts' && !/(^|\/)legacy\w*\.(test\.)?ts$|^scripts\/safety\//.test(file))
const problems: string[] = []
for (const file of files) {
    const text = await Bun.file(file).text().catch(() => '')
    text.split('\n').forEach((line, index) => {
        if (LEGACY.test(line) && !ALLOW.some((pattern) => pattern.test(line))) {
            problems.push(`${file}:${index + 1}: ${line.trim().slice(0, 140)}`)
        }
    })
}

if (problems.length > 0) {
    console.error('[brand:check] Old product names found (use Matemind, or add a reason to ALLOW):')
    for (const problem of problems) console.error(`  ${problem}`)
    process.exit(1)
}
console.log('[brand:check] OK - no old product names in code.')
