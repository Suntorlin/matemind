import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
    REPORT_INSTRUCTION,
    TITLE_INSTRUCTION,
    buildCodexSystemPrompt,
    getCodexSystemPrompt,
} from './systemPrompt';

describe('systemPrompt', () => {
    let tempRoot: string;
    let previousMatemindHome: string | undefined;
    let previousEnableReportPrompt: string | undefined;

    beforeEach(() => {
        tempRoot = mkdtempSync(join(tmpdir(), 'codex-system-prompt-'));
        previousMatemindHome = process.env.MATEMIND_HOME;
        previousEnableReportPrompt = process.env.MATEMIND_CODEX_ENABLE_REPORT_PROMPT;
        delete process.env.MATEMIND_CODEX_ENABLE_REPORT_PROMPT;
    });

    afterEach(() => {
        if (previousMatemindHome === undefined) {
            delete process.env.MATEMIND_HOME;
        } else {
            process.env.MATEMIND_HOME = previousMatemindHome;
        }
        if (previousEnableReportPrompt === undefined) {
            delete process.env.MATEMIND_CODEX_ENABLE_REPORT_PROMPT;
        } else {
            process.env.MATEMIND_CODEX_ENABLE_REPORT_PROMPT = previousEnableReportPrompt;
        }
        rmSync(tempRoot, { recursive: true, force: true });
    });

    it('defaults to title-only prompt without report guidance', () => {
        expect(getCodexSystemPrompt()).toBe(TITLE_INSTRUCTION);
        expect(getCodexSystemPrompt()).not.toContain('functions.matemind__report_create');
        expect(TITLE_INSTRUCTION).not.toContain('functions.matemind__report_create');
    });

    it('includes report screenshot storage hygiene rules when enabled', () => {
        process.env.MATEMIND_CODEX_ENABLE_REPORT_PROMPT = '1';

        const prompt = getCodexSystemPrompt();
        expect(prompt).toContain(REPORT_INSTRUCTION);
        expect(prompt).toContain('report_create (it creates a public share by default)');
        expect(prompt).toContain('Never save screenshots under the project/workspace directory.');
        expect(prompt).toContain('$MATEMIND_HOME/tmp/report-assets/<session-or-task-id>/');
        expect(prompt).toContain('When screenshot tools support "filename"/"save_as", pass the full path explicitly.');
        expect(prompt).toContain('<report-public-base-url>/share/r/FrG7h-uOFtuKw0Ay1S8NNWhuBB9uNgDq');
        expect(prompt).toContain('/share/r/<token>');
    });

    it('reads report prompt switch from settings.json when env is unset', () => {
        const workspace = join(tempRoot, 'workspace');
        const matemindHome = join(tempRoot, 'matemind-home');
        mkdirSync(workspace, { recursive: true });
        mkdirSync(matemindHome, { recursive: true });
        process.env.MATEMIND_HOME = matemindHome;
        writeFileSync(
            join(matemindHome, 'settings.json'),
            JSON.stringify({ codexReportPromptEnabled: true }, null, 2)
        );

        expect(getCodexSystemPrompt()).toContain(REPORT_INSTRUCTION);
    });

    it('returns empty system prompt when pure context mode is enabled', () => {
        const workspace = join(tempRoot, 'workspace');
        const matemindHome = join(tempRoot, 'matemind-home');
        mkdirSync(workspace, { recursive: true });
        mkdirSync(matemindHome, { recursive: true });
        process.env.MATEMIND_HOME = matemindHome;
        process.env.MATEMIND_CODEX_ENABLE_REPORT_PROMPT = '1';
        writeFileSync(
            join(matemindHome, 'settings.json'),
            JSON.stringify({ pureContextMode: true }, null, 2)
        );

        const prompt = buildCodexSystemPrompt(workspace);
        expect(prompt).toBe('');
    });
});
