import { describe, expect, it } from 'bun:test'
import { legacyEnvUpdates, resolveDbFileName } from '@matemind/protocol/legacyBrand'

const join = (...parts: string[]) => parts.join('/')
const fsWith = (paths: string[]) => ({ home: '/home/me', exists: (path: string) => paths.includes(path), join })

describe('legacyEnvUpdates', () => {
    it('copies legacy env vars to MATEMIND_* without overwriting', () => {
        const updates = legacyEnvUpdates(
            { HAPI_API_URL: 'http://a', HAQI_PATH: '/bin/x', HAPI_LISTEN_PORT: '1', MATEMIND_LISTEN_PORT: '2', OTHER: 'y' },
            fsWith(['/home/me/.matemind'])
        )
        expect(updates).toEqual({ MATEMIND_API_URL: 'http://a', MATEMIND_PATH: '/bin/x' })
    })

    it('uses ~/.hapi when it is the only data directory', () => {
        expect(legacyEnvUpdates({}, fsWith(['/home/me/.hapi']))).toEqual({ MATEMIND_HOME: '/home/me/.hapi' })
    })

    it('prefers ~/.matemind once it exists, and an explicit home over both', () => {
        expect(legacyEnvUpdates({}, fsWith(['/home/me/.hapi', '/home/me/.matemind']))).toEqual({})
        expect(legacyEnvUpdates({ HAPI_HOME: '/data' }, fsWith(['/home/me/.hapi']))).toEqual({ MATEMIND_HOME: '/data' })
    })
})

describe('resolveDbFileName', () => {
    it('keeps hapi.db while it is the only database', () => {
        expect(resolveDbFileName('/d', fsWith(['/d/hapi.db']))).toBe('hapi.db')
        expect(resolveDbFileName('/d', fsWith(['/d/hapi.db', '/d/matemind.db']))).toBe('matemind.db')
        expect(resolveDbFileName('/d', fsWith([]))).toBe('matemind.db')
    })
})
