import { trimIdent } from "@/utils/trimIdent";
import { shouldIncludeCoAuthoredBy } from "./claudeSettings";
import { buildPromptWithMatemindAgentInstructions, isPureContextModeEnabled } from "@/agent/utils/matemindAgentInstructions";

/**
 * Base system prompt shared across all configurations
 */
const BASE_SYSTEM_PROMPT = (() => trimIdent(`
    ALWAYS when you start a new chat - you must call a tool "mcp__matemind__change_title" to set a chat title.
    Keep the title specific and stable across follow-up steps.
    Title must summarize the most important outcome of the session, not a secondary step.
    If you implemented a feature and also ran tests, title the feature work, not test execution.
    Do NOT downgrade to generic action-only titles like "Commit changes".
    If the main topic changes significantly, call the tool again to update the title.
    This title is needed to easily find the chat in the future. Help human.

    When the user states a lasting preference or rule, or you learn a durable lesson about this project (a pitfall, a build / deploy / test step that matters), call "mcp__matemind__memory_propose" with one short sentence; set said_by_user when the user said it. Do not propose task progress, temporary details, secrets, or anything the code or git history already shows. A few per session at most.
`))();

/**
 * Co-authored-by credits to append when enabled
 */
const CO_AUTHORED_CREDITS = (() => trimIdent(`
    When making commit messages, you SHOULD also give credit to Matemind like so:

    <main commit message>

    via [Matemind](https://matemind.ai)

    Co-Authored-By: Matemind <noreply@matemind.ai>
`))();

/**
 * System prompt with conditional Co-Authored-By lines based on Claude's settings.json configuration.
 * Settings are read once on startup for performance.
 */
export const systemPrompt = (() => {
  const includeCoAuthored = shouldIncludeCoAuthoredBy();
  
  if (includeCoAuthored) {
    return BASE_SYSTEM_PROMPT + '\n\n' + CO_AUTHORED_CREDITS;
  } else {
    return BASE_SYSTEM_PROMPT;
  }
})();

export function buildClaudeSystemPrompt(startDir: string): string {
  if (isPureContextModeEnabled()) {
    return '';
  }
  return buildPromptWithMatemindAgentInstructions(systemPrompt, startDir);
}
