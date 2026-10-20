import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { buildPromptWithMatemindAgentInstructions, loadMatemindAgentInstructions } from './matemindAgentInstructions'

describe('matemindAgentInstructions', () => {
    let tempRoot: string
    let previousMatemindHome: string | undefined

    beforeEach(() => {
        tempRoot = mkdtempSync(join(tmpdir(), 'matemind-agent-instructions-'))
        previousMatemindHome = process.env.MATEMIND_HOME
    })

    afterEach(() => {
        if (previousMatemindHome === undefined) {
            delete process.env.MATEMIND_HOME
        } else {
            process.env.MATEMIND_HOME = previousMatemindHome
        }

        rmSync(tempRoot, { recursive: true, force: true })
    })

    it('loads MATEMIND-Agent.md from nearest parent directory', () => {
        const workspaceRoot = join(tempRoot, 'workspace')
        const nestedDir = join(workspaceRoot, 'apps', 'hub')
        mkdirSync(nestedDir, { recursive: true })
        writeFileSync(join(workspaceRoot, 'MATEMIND-Agent.md'), 'workspace-policy')

        const instructions = loadMatemindAgentInstructions(nestedDir)

        expect(instructions).toBe('workspace-policy')
    })

    it('creates global MEMORY.md under MATEMIND_HOME and injects it into prompt when enabled', () => {
        const startDir = join(tempRoot, 'workspace')
        const matemindHome = join(tempRoot, 'matemind-home')
        mkdirSync(startDir, { recursive: true })
        mkdirSync(matemindHome, { recursive: true })
        process.env.MATEMIND_HOME = matemindHome
        writeFileSync(
            join(matemindHome, 'settings.json'),
            JSON.stringify({ memoryInjectionEnabled: true }, null, 2)
        )

        const prompt = buildPromptWithMatemindAgentInstructions('BASE PROMPT', startDir)
        const memoryPath = join(matemindHome, 'MEMORY.md')

        expect(existsSync(memoryPath)).toBe(true)
        expect(prompt).toContain(`Load long-term user memory from ${memoryPath}.`)
        expect(prompt).toContain('Treat MEMORY.md as global personal style and durable constraints shared across sessions.')
        expect(prompt).toContain('Never write session-specific details')
        expect(prompt).toContain(`<matemind-memory path="${memoryPath}">`)
        expect(prompt).toContain('# MEMORY.md')
        expect(prompt).toContain('## Communication Style')
    })

    it('skips global memory injection by default', () => {
        const startDir = join(tempRoot, 'workspace')
        const matemindHome = join(tempRoot, 'matemind-home')
        mkdirSync(startDir, { recursive: true })
        mkdirSync(matemindHome, { recursive: true })
        process.env.MATEMIND_HOME = matemindHome

        const prompt = buildPromptWithMatemindAgentInstructions('BASE PROMPT', startDir)

        expect(prompt).toBe('BASE PROMPT')
        expect(existsSync(join(matemindHome, 'MEMORY.md'))).toBe(false)
    })

    it('loads both workspace instructions and global memory', () => {
        const startDir = join(tempRoot, 'workspace')
        const matemindHome = join(tempRoot, 'matemind-home')
        mkdirSync(startDir, { recursive: true })
        process.env.MATEMIND_HOME = matemindHome
        writeFileSync(join(startDir, 'MATEMIND-Agent.md'), 'repo-rules')
        mkdirSync(matemindHome, { recursive: true })
        writeFileSync(
            join(matemindHome, 'settings.json'),
            JSON.stringify({ memoryInjectionEnabled: true }, null, 2)
        )
        writeFileSync(join(matemindHome, 'MEMORY.md'), 'user-prefers-short-replies')

        const prompt = buildPromptWithMatemindAgentInstructions('BASE PROMPT', startDir)

        expect(prompt).toContain('<matemind-agent-instructions>')
        expect(prompt).toContain('repo-rules')
        expect(prompt).toContain('<matemind-memory path="')
        expect(prompt).toContain('user-prefers-short-replies')
    })

    it('truncates oversized MEMORY.md content', () => {
        const startDir = join(tempRoot, 'workspace')
        const matemindHome = join(tempRoot, 'matemind-home')
        mkdirSync(startDir, { recursive: true })
        mkdirSync(matemindHome, { recursive: true })
        process.env.MATEMIND_HOME = matemindHome
        writeFileSync(
            join(matemindHome, 'settings.json'),
            JSON.stringify({ memoryInjectionEnabled: true }, null, 2)
        )
        writeFileSync(join(matemindHome, 'MEMORY.md'), `prefix-${'x'.repeat(70 * 1024)}`)

        const prompt = buildPromptWithMatemindAgentInstructions('BASE PROMPT', startDir)

        expect(prompt).toContain('[truncated: MEMORY.md exceeded 65536 bytes]')
    })

    it('skips all automatic prompt injections when pure context mode is enabled', () => {
        const startDir = join(tempRoot, 'workspace')
        const matemindHome = join(tempRoot, 'matemind-home')
        mkdirSync(startDir, { recursive: true })
        mkdirSync(matemindHome, { recursive: true })
        process.env.MATEMIND_HOME = matemindHome
        writeFileSync(join(startDir, 'MATEMIND-Agent.md'), 'repo-rules')
        writeFileSync(
            join(matemindHome, 'settings.json'),
            JSON.stringify({
                memoryInjectionEnabled: true,
                pureContextMode: true
            }, null, 2)
        )

        const prompt = buildPromptWithMatemindAgentInstructions('BASE PROMPT', startDir)

        expect(prompt).toBe('BASE PROMPT')
        expect(existsSync(join(matemindHome, 'MEMORY.md'))).toBe(false)
    })
})
