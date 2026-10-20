import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { legacyEnvUpdates } from '@matemind/protocol/legacyBrand'

// Imported first by the entry point: configuration reads the env when its module loads.
Object.assign(process.env, legacyEnvUpdates(process.env, { home: homedir(), exists: existsSync, join }))
