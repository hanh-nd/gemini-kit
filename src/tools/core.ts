/**
 * Core Tools - Project context, handoff, and artifact management
 * Extracted from kit-server.ts for better modularity
 */

import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { DEFAULT_EXTENSIONS } from './config.js';

/**
 * Resolve path relative to extension root
 */
function getExtensionRoot(): string {
  // Resolve extension root from bundled file location (dist/kit-server.js → ../)
  const distDir = path.dirname(new URL(import.meta.url).pathname);
  return path.resolve(distDir, '..');
}

/**
 * Register core tools with MCP server
 */
export function registerCoreTools(server: McpServer): void {
  // ═══════════════════════════════════════════════════════════════
  // TOOL: GET EXTENSION INFO
  // ═══════════════════════════════════════════════════════════════
  server.tool(
    'kit_get_extension_info',
    'Get information about the gemini-kit extension, including absolute paths to agents, skills, commands, and scripts',
    {},
    async () => {
      try {
        const root = getExtensionRoot();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  extensionRoot: root,
                  agentsDir: path.join(root, 'agents'),
                  skillsDir: path.join(root, 'skills'),
                  commandsDir: path.join(root, 'commands'),
                  scriptsDir: path.join(root, 'scripts'),
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error getting extension info: ${error}` }],
        };
      }
    }
  );

  // ═══════════════════════════════════════════════════════════════
  // TOOL: GET COMMAND PROMPT
  // Returns the prompt content from a command .toml file
  // Used by /do to delegate to the correct command workflow
  // ═══════════════════════════════════════════════════════════════
  server.tool(
    'kit_get_command_prompt',
    "Get the prompt/workflow of a gemini-kit command by name. Use this to understand and follow a command's workflow.",
    {
      command: z.string().describe('Command name without slash, e.g. "review-pr", "pr", "debug"'),
    },
    async ({ command }) => {
      try {
        const extensionRoot = getExtensionRoot();
        const commandsDir = path.join(extensionRoot, 'commands');

        // Sanitize command name
        const safeName = command.replace(/[^a-zA-Z0-9-_]/g, '');
        const filePath = path.join(commandsDir, `${safeName}.toml`);

        if (!fs.existsSync(filePath)) {
          // List available commands
          const available = fs
            .readdirSync(commandsDir)
            .filter((f) => f.endsWith('.toml'))
            .map((f) => f.replace('.toml', ''))
            .sort();

          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Command "${command}" not found.\n\nAvailable commands:\n${available.map((c) => `  /${c}`).join('\n')}`,
              },
            ],
          };
        }

        let content = fs.readFileSync(filePath, 'utf8');

        // Rewrite relative paths to absolute paths for agents and skills
        // Matches: agents/*.md, skills/*/SKILL.md, skills/*.toml (if any)
        const agentsPath = path.join(extensionRoot, 'agents');
        const skillsPath = path.join(extensionRoot, 'skills');

        // Replace `agents/` and `skills/` when they appear as start of path in prompt
        content = content.replace(/(`?)agents\//g, `$1${agentsPath}${path.sep}`);
        content = content.replace(/(`?)skills\//g, `$1${skillsPath}${path.sep}`);

        return {
          content: [
            {
              type: 'text' as const,
              text: content,
            },
          ],
        };
      } catch (error) {
        return { content: [{ type: 'text' as const, text: `Error reading command: ${error}` }] };
      }
    }
  );
}

// Export DEFAULT_EXTENSIONS for backward compatibility
export { DEFAULT_EXTENSIONS };
