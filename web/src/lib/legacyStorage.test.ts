import { describe, expect, it } from 'vitest'
import { migrateLegacyStorage } from './legacyStorage'

function memoryStorage(entries: Record<string, string>): Storage {
    const map = new Map(Object.entries(entries))
    return {
        get length() { return map.size },
        key: (index) => Array.from(map.keys())[index] ?? null,
        getItem: (key) => map.get(key) ?? null,
        setItem: (key, value) => { map.set(key, value) },
        removeItem: (key) => { map.delete(key) },
        clear: () => map.clear()
    }
}

describe('migrateLegacyStorage', () => {
    it('copies hapi and haqi keys to matemind names without overwriting', () => {
        const storage = memoryStorage({ 'hapi-lang': 'zh-CN', 'hapi:sessionDock': 'a', 'haqi:x': '1', 'matemind:sessionDock': 'b', other: 'y' })
        migrateLegacyStorage(storage)
        expect(storage.getItem('matemind-lang')).toBe('zh-CN')
        expect(storage.getItem('matemind:sessionDock')).toBe('b')
        expect(storage.getItem('matemind:x')).toBe('1')
        expect(storage.getItem('matemindother')).toBeNull()
    })

    it('runs once, so a removed value does not come back', () => {
        const storage = memoryStorage({ 'hapi-theme': 'dark' })
        migrateLegacyStorage(storage)
        storage.removeItem('matemind-theme')
        migrateLegacyStorage(storage)
        expect(storage.getItem('matemind-theme')).toBeNull()
    })
})
