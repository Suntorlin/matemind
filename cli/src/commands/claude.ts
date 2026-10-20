import chalk from 'chalk'
import { execFileSync } from 'node:child_process'
import { z } from 'zod'
import { PROTOCOL_VERSION, normalizeClaudeModelValue } from '@matemind/protocol'
import type { StartOptions } from '@/claude/runClaude'
import { configuration } from '@/configuration'
import { isRunnerRunningCurrentlyInstalledHappyVersion } from '@/runner/controlClient'
import { authAndSetupMachineIfNeeded } from '@/ui/auth'
import { logger } from '@/ui/logger'
import { initializeToken } from '@/ui/tokenInit'
import { spawnHappyCLI } from '@/utils/spawnHappyCLI'
import { maybeAutoStartServer } from '@/utils/autoStartServer'
import { withBunRuntimeEnv } from '@/utils/bunRuntime'
import { extractErrorInfo } from '@/utils/errorUtils'
import type { CommandDefinition } from './types'

export const claudeCommand: CommandDefinition = {
    name: 'default',
    requiresRuntimeAssets: true,
    run: async ({ commandArgs }) => {
        const args = [...commandArgs]

        if (args.length > 0 && args[0] === 'claude') {
            args.shift()
        }

        const options: StartOptions = {}
        let showHelp = false
        const unknownArgs: string[] = []

        for (let i = 0; i < args.length; i++) {
            const arg = args[i]

            if (arg === '-h' || arg === '--help') {
                showHelp = true
                unknownArgs.push(arg)
            } else if (arg === '--matemind-starting-mode') {
                options.startingMode = z.enum(['local', 'remote']).parse(args[++i])
            } else if (arg === '--yolo') {
                options.permissionMode = 'bypassPermissions'
                unknownArgs.push('--dangerously-skip-permissions')
            } else if (arg === '--dangerously-skip-permissions') {
                options.permissionMode = 'bypassPermissions'
                unknownArgs.push(arg)
            } else if (arg === '--model') {
                const model = args[++i]
                if (!model) {
                    throw new Error('Missing --model value')
                }
                const normalizedModel = normalizeClaudeModelValue(model) ?? model
                options.model = normalizedModel
                unknownArgs.push('--model', normalizedModel)
            } else if (arg === '--effort') {
                const effort = args[++i]
                if (!effort) {
                    throw new Error('Missing --effort value')
                }
                if (effort !== 'low' && effort !== 'medium' && effort !== 'high' && effort !== 'max') {
                    throw new Error('Invalid --effort value (expected low, medium, high, or max)')
                }
                options.thinkEffort = effort
                unknownArgs.push('--effort', effort)
            } else if (arg.startsWith('--effort=')) {
                const effort = arg.slice('--effort='.length)
                if (effort !== 'low' && effort !== 'medium' && effort !== 'high' && effort !== 'max') {
                    throw new Error('Invalid --effort value (expected low, medium, high, or max)')
                }
                options.thinkEffort = effort
                unknownArgs.push(arg)
            } else if (arg === '--started-by') {
                options.startedBy = args[++i] as 'runner' | 'terminal'
            } else {
                unknownArgs.push(arg)
                if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
                    unknownArgs.push(args[++i])
                }
            }
        }

        if (unknownArgs.length > 0) {
            options.claudeArgs = [...(options.claudeArgs || []), ...unknownArgs]
        }

        if (showHelp) {
            console.log(`
${chalk.bold('matemind')} - The first mate for your AI coding agents

${chalk.bold('Usage:')}
  matemind [options]         Start Claude with Telegram control (direct-connect)
  matemind auth              Manage authentication
  matemind codex             Start Codex mode
  matemind cursor            Start Cursor Agent mode
  matemind gemini            Start Gemini ACP mode
  matemind opencode          Start OpenCode ACP mode
  matemind mcp               Start MCP stdio bridge
  matemind connect           (not available in direct-connect mode)
  matemind notify            (not available in direct-connect mode)
  matemind hub               Start the API + web hub
  matemind hub --relay       Start with public relay
  matemind server            Alias for matemind hub
  matemind runner            Manage background service that allows
                            to spawn new sessions away from your computer
  matemind doctor            System diagnostics & troubleshooting

${chalk.bold('Examples:')}
  matemind                    Start session (will prompt for token if not set)
  matemind auth login         Configure CLI_API_TOKEN interactively
  matemind --yolo             Start with bypassing permissions
                            matemind sugar for --dangerously-skip-permissions
  matemind auth status        Show direct-connect status
  matemind doctor             Run diagnostics

${chalk.bold('matemind supports ALL Claude options!')}
  Use any claude flag with matemind as you would with claude. Our favorite:

  matemind --resume

${chalk.gray('─'.repeat(60))}
${chalk.bold.cyan('Claude Code Options (from `claude --help`):')}
`)

            try {
                const claudeHelp = execFileSync(
                    'claude',
                    ['--help'],
                    { encoding: 'utf8', env: withBunRuntimeEnv(), shell: process.platform === 'win32' }
                )
                console.log(claudeHelp)
            } catch {
                console.log(chalk.yellow('Could not retrieve claude help. Make sure claude is installed.'))
            }

            process.exit(0)
        }

        await initializeToken()
        await maybeAutoStartServer()
        await authAndSetupMachineIfNeeded()

        logger.debug('Ensuring matemind background service is running & matches our version...')

        if (!(await isRunnerRunningCurrentlyInstalledHappyVersion())) {
            logger.debug('Starting matemind background service...')

            const runnerProcess = spawnHappyCLI(['runner', 'start-sync'], {
                detached: true,
                stdio: 'ignore',
                env: process.env
            })
            runnerProcess.unref()

            await new Promise(resolve => setTimeout(resolve, 200))
        }

        try {
            const { runClaude } = await import('@/claude/runClaude')
            await runClaude(options)
        } catch (error) {
            const { message, messageLower, axiosCode, httpStatus, responseErrorText, serverProtocolVersion } = extractErrorInfo(error)

            if (
                axiosCode === 'ECONNREFUSED' ||
                axiosCode === 'ETIMEDOUT' ||
                axiosCode === 'ENOTFOUND' ||
                messageLower.includes('econnrefused') ||
                messageLower.includes('etimedout') ||
                messageLower.includes('enotfound') ||
                messageLower.includes('network error')
            ) {
                console.error(chalk.yellow('Unable to connect to Matemind hub'))
                console.error(chalk.gray(`  Hub URL: ${configuration.apiUrl}`))
                console.error(chalk.gray('  Please check your network connection or hub status'))
            } else if (httpStatus === 403 && responseErrorText === 'Machine access denied') {
                console.error(chalk.red('Machine access denied.'))
                console.error(chalk.gray('  This machineId is already registered under a different namespace.'))
                console.error(chalk.gray('  Fix: run `matemind auth logout`, or set a separate MATEMIND_HOME per namespace.'))
            } else if (httpStatus === 403 && responseErrorText === 'Session access denied') {
                console.error(chalk.red('Session access denied.'))
                console.error(chalk.gray('  This session belongs to a different namespace.'))
                console.error(chalk.gray('  Use the matching CLI_API_TOKEN or switch namespaces.'))
            } else if (
                httpStatus === 401 ||
                httpStatus === 403 ||
                messageLower.includes('unauthorized') ||
                messageLower.includes('forbidden')
            ) {
                console.error(chalk.red('Authentication error:'), message)
                console.error(chalk.gray('  Run: matemind auth login'))
            } else {
                console.error(chalk.red('Error:'), message)
            }

            if (serverProtocolVersion !== undefined && serverProtocolVersion !== PROTOCOL_VERSION) {
                if (serverProtocolVersion < PROTOCOL_VERSION) {
                    console.error(chalk.yellow(`  Hint: hub protocol version (${serverProtocolVersion}) is behind CLI (${PROTOCOL_VERSION}). Please update the hub.`))
                } else {
                    console.error(chalk.yellow(`  Hint: CLI protocol version (${PROTOCOL_VERSION}) is behind hub (${serverProtocolVersion}). Please update the CLI.`))
                }
            }

            if (process.env.DEBUG) {
                console.error(error)
            }
            process.exit(1)
        }
    }
}
