/**
 * Matemind was called HAQI and hapi before. Installs from that time keep working:
 * their env vars and data directory are picked up when the new ones are not set.
 */

/** Env var prefixes used before the rename; `HAPI_X` / `HAQI_X` fills `MATEMIND_X`. */
export const LEGACY_ENV_PREFIXES = ['HAPI_', 'HAQI_'] as const

export const HOME_DIR_NAME = '.matemind'
export const LEGACY_HOME_DIR_NAME = '.hapi'

export const DB_FILE_NAME = 'matemind.db'
export const LEGACY_DB_FILE_NAME = 'hapi.db'

/**
 * The env changes that keep a legacy install working, without touching anything already set:
 * legacy-prefixed vars copied to `MATEMIND_*`, and `MATEMIND_HOME` pointed at `~/.hapi`
 * when only that directory exists.
 */
export function legacyEnvUpdates(
    env: Record<string, string | undefined>,
    fs: { home: string; exists: (path: string) => boolean; join: (...parts: string[]) => string }
): Record<string, string> {
    const updates: Record<string, string> = {}
    for (const [key, value] of Object.entries(env)) {
        const prefix = LEGACY_ENV_PREFIXES.find((candidate) => key.startsWith(candidate))
        if (!prefix || value === undefined) continue
        const next = `MATEMIND_${key.slice(prefix.length)}`
        if (env[next] === undefined && updates[next] === undefined) {
            updates[next] = value
        }
    }
    const home = env.MATEMIND_HOME ?? updates.MATEMIND_HOME
    if (home === undefined) {
        const legacyHome = fs.join(fs.home, LEGACY_HOME_DIR_NAME)
        if (!fs.exists(fs.join(fs.home, HOME_DIR_NAME)) && fs.exists(legacyHome)) {
            updates.MATEMIND_HOME = legacyHome
        }
    }
    return updates
}

/** The database file in `dataDir`: the legacy `hapi.db` while it is the only one there. */
export function resolveDbFileName(dataDir: string, fs: { exists: (path: string) => boolean; join: (...parts: string[]) => string }): string {
    if (!fs.exists(fs.join(dataDir, DB_FILE_NAME)) && fs.exists(fs.join(dataDir, LEGACY_DB_FILE_NAME))) {
        return LEGACY_DB_FILE_NAME
    }
    return DB_FILE_NAME
}
