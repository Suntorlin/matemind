/**
 * Matemind was called HAQI and hapi before; its settings lived under `hapi:` / `hapi-` keys.
 * Copy them to the `matemind` names once, before any module reads them. Runs once only,
 * so a value the app removes later does not come back from the old key.
 */
const MIGRATED_FLAG = 'matemind:legacyStorageMigrated'
const LEGACY_KEY = /^(?:hapi|haqi)(?=[:-])/

export function migrateLegacyStorage(storage: Storage): void {
    if (storage.getItem(MIGRATED_FLAG) !== null) return
    for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index)
        if (!key || !LEGACY_KEY.test(key)) continue
        const next = key.replace(LEGACY_KEY, 'matemind')
        const value = storage.getItem(key)
        if (value !== null && storage.getItem(next) === null) {
            storage.setItem(next, value)
        }
    }
    storage.setItem(MIGRATED_FLAG, '1')
}

try {
    migrateLegacyStorage(window.localStorage)
} catch {
    // Storage blocked (private mode, sandboxed iframe): start with defaults.
}
