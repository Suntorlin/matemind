/**
 * Matemind MCP STDIO Bridge
 *
 * Minimal STDIO MCP server exposing a single tool `change_title`.
 * On invocation it forwards the tool call to an existing Matemind HTTP MCP server
 * using the StreamableHTTPClientTransport.
 *
 * Configure the target HTTP MCP URL via env var `MATEMIND_HTTP_MCP_URL` or
 * via CLI flag `--url <http://127.0.0.1:PORT>`.
 *
 * Note: This process must not print to stdout as it would break MCP STDIO.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { MATEMIND_MCP_TOOL_DEFINITIONS } from '@/mcp/matemindMcpTools';

function parseArgs(argv: string[]): { url: string | null } {
  let url: string | null = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--url' && i + 1 < argv.length) {
      url = argv[i + 1];
      i++;
    }
  }
  return { url };
}

export async function runHappyMcpStdioBridge(argv: string[]): Promise<void> {
  try {
    // Resolve target HTTP MCP URL
    const { url: urlFromArgs } = parseArgs(argv);
    const baseUrl = urlFromArgs || process.env.MATEMIND_HTTP_MCP_URL || '';

    if (!baseUrl) {
      // Write to stderr; never stdout.
      process.stderr.write(
        '[matemind-mcp] Missing target URL. Set MATEMIND_HTTP_MCP_URL or pass --url <http://127.0.0.1:PORT>\n'
      );
      process.exit(2);
    }

    let httpClient: Client | null = null;

    async function ensureHttpClient(): Promise<Client> {
      if (httpClient) return httpClient;
      const client = new Client(
        { name: 'matemind-stdio-bridge', version: '1.0.0' },
        { capabilities: {} }
      );

      const transport = new StreamableHTTPClientTransport(new URL(baseUrl));
      await client.connect(transport);
      httpClient = client;
      return client;
    }

    // Create STDIO MCP server
    const server = new McpServer({
      name: 'Matemind MCP Bridge',
      version: '1.0.0',
    });

    for (const definition of MATEMIND_MCP_TOOL_DEFINITIONS) {
      server.registerTool<any, any>(
        definition.name,
        {
          description: definition.description,
          title: definition.title,
          inputSchema: definition.inputSchema,
        },
        async (args: Record<string, unknown>) => {
          try {
            const client = await ensureHttpClient();
            const response = await client.callTool({ name: definition.name, arguments: args });
            // Pass-through response from HTTP server
            return response as any;
          } catch (error) {
            return {
              content: [
                {
                  type: 'text' as const,
                  text: `Failed to call ${definition.name}: ${error instanceof Error ? error.message : String(error)}`
                },
              ],
              isError: true,
            };
          }
        }
      );
    }

    // Start STDIO transport
    const stdio = new StdioServerTransport();
    await server.connect(stdio);
  } catch (err) {
    try {
      process.stderr.write(`[matemind-mcp] Fatal: ${err instanceof Error ? err.message : String(err)}\n`);
    } finally {
      process.exit(1);
    }
  }
}
