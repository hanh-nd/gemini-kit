/**
 * Core Tools - Project context, handoff, and artifact management
 * Extracted from kit-server.ts for better modularity
 */

import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { safeGit, findFilesAsync } from './security.js';
import { DEFAULT_EXTENSIONS, getFileExtensions } from './config.js';

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
  // TOOL: GET PROJECT CONTEXT (Cross-platform)
  // HIGH FIX: Uses async file scanning to avoid blocking event loop
  // ═══════════════════════════════════════════════════════════════
  server.tool(
    'kit_get_project_context',
    'Gather project context including structure, dependencies, and recent changes',
    { depth: z.number().optional().default(2).describe('Directory depth to scan') },
    async ({ depth = 2 }) => {
      try {
        const projectDir = process.cwd();
        const extensions = getFileExtensions(projectDir);
        // HIGH FIX: Use async version to avoid blocking
        const files = await findFilesAsync(projectDir, extensions, 50);

        // Filter by depth (approximate)
        const structure = files.filter((f) => {
          const parts = f.split(path.sep);
          return parts.length <= depth + 1;
        });

        let packageInfo = null;
        const pkgPath = path.join(projectDir, 'package.json');
        if (fs.existsSync(pkgPath)) {
          try {
            packageInfo = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
          } catch {
            /* parse error, ignore */
          }
        }

        let gitLog = '';
        try {
          gitLog = safeGit(['log', '--oneline', '-5']);
        } catch {
          /* no git log, ignore */
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  structure: structure,
                  package: packageInfo
                    ? {
                        name: packageInfo.name,
                        version: packageInfo.version,
                        dependencies: Object.keys(packageInfo.dependencies || {}),
                      }
                    : null,
                  recentCommits: gitLog.split('\n').filter(Boolean),
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return { content: [{ type: 'text' as const, text: `Error getting context: ${error}` }] };
      }
    }
  );

  // ═══════════════════════════════════════════════════════════════
  // TOOL: HANDOFF AGENT
  // ═══════════════════════════════════════════════════════════════
  server.tool(
    'kit_handoff_agent',
    'Handoff context to another agent in the workflow',
    {
      fromAgent: z.string().describe('Current agent name'),
      toAgent: z.string().describe('Target agent name'),
      context: z.string().describe('Context to pass'),
      artifacts: z.array(z.string()).optional().describe('File paths of artifacts'),
    },
    async ({ fromAgent, toAgent, context, artifacts }) => {
      try {
        const handoffDir = path.join(process.cwd(), '.gemini-kit', 'handoffs');
        fs.mkdirSync(handoffDir, { recursive: true });

        const handoff = {
          timestamp: new Date().toISOString(),
          from: fromAgent,
          to: toAgent,
          context,
          artifacts: artifacts || [],
        };
        // Issue 5 FIX: Use UUID to prevent filename collision in concurrent handoffs
        const filename = `${crypto.randomUUID()}-${fromAgent}-${toAgent}.json`;
        fs.writeFileSync(path.join(handoffDir, filename), JSON.stringify(handoff, null, 2));

        return {
          content: [
            {
              type: 'text' as const,
              text: `✅ Handoff from ${fromAgent} → ${toAgent}\n\nContext: ${context.slice(0, 200)}...`,
            },
          ],
        };
      } catch (error) {
        return { content: [{ type: 'text' as const, text: `Error in handoff: ${error}` }] };
      }
    }
  );

  // ═══════════════════════════════════════════════════════════════
  // TOOL: SAVE ARTIFACT
  // ═══════════════════════════════════════════════════════════════
  server.tool(
    'kit_save_artifact',
    'Save an artifact (plan, report, log) from agent work',
    {
      name: z.string().describe('Artifact name'),
      type: z.enum(['plan', 'report', 'log', 'other']).describe('Artifact type'),
      content: z.string().describe('Artifact content'),
    },
    async ({ name, type, content }) => {
      try {
        const artifactDir = path.join(process.cwd(), '.gemini-kit', 'artifacts', type);
        fs.mkdirSync(artifactDir, { recursive: true });

        // Security: Use path.basename and allow only safe characters
        const safeName = path
          .basename(String(name))
          .replace(/[^a-zA-Z0-9-_]/g, '-')
          .slice(0, 50);
        // Issue 5 FIX: Use UUID to prevent filename collision
        const filename = `${safeName}-${crypto.randomUUID().slice(0, 8)}.md`;
        const filepath = path.join(artifactDir, filename);
        fs.writeFileSync(filepath, content);

        return { content: [{ type: 'text' as const, text: `✅ Artifact saved: ${filepath}` }] };
      } catch (error) {
        return { content: [{ type: 'text' as const, text: `Error saving artifact: ${error}` }] };
      }
    }
  );

  // ═══════════════════════════════════════════════════════════════
  // TOOL: GET EXTENSION INFO
  // ═══════════════════════════════════════════════════════════════
  server.tool(
    'kit_get_extension_info',
    'Get information about the gemini-kit extension, including absolute paths to agents and skills',
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
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return { content: [{ type: 'text' as const, text: `Error getting extension info: ${error}` }] };
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

  // ═══════════════════════════════════════════════════════════════
  // TOOL: LIST COMMANDS
  // Lists all available gemini-kit commands
  // ═══════════════════════════════════════════════════════════════
  server.tool('kit_list_commands', 'List all available gemini-kit slash commands', {}, async () => {
    try {
      const extensionRoot = getExtensionRoot();
      const commandsDir = path.join(extensionRoot, 'commands');

      const commands = fs
        .readdirSync(commandsDir)
        .filter((f) => f.endsWith('.toml'))
        .map((f) => {
          const name = f.replace('.toml', '');
          try {
            const content = fs.readFileSync(path.join(commandsDir, f), 'utf8');
            const descMatch = content.match(/description\s*=\s*"([^"]*)"/);
            return { name, description: descMatch?.[1] || '' };
          } catch {
            return { name, description: '' };
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      const output = `## Available Commands (${commands.length})\n\n${commands
        .map((c) => `- **/${c.name}**${c.description ? `: ${c.description}` : ''}`)
        .join('\n')}`;

      return { content: [{ type: 'text' as const, text: output }] };
    } catch (error) {
      return { content: [{ type: 'text' as const, text: `Error listing commands: ${error}` }] };
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // TOOL: GET SKILLS LIST
  // Lists all available skills and their metadata from YAML frontmatter
  // ═══════════════════════════════════════════════════════════════
  server.tool(
    'kit_get_skill_list',
    'Get a list of all available skills and their descriptions from the extension',
    {},
    async () => {
      try {
        const extensionRoot = getExtensionRoot();
        const skillsDir = path.join(extensionRoot, 'skills');

        if (!fs.existsSync(skillsDir)) {
          return { content: [{ type: 'text' as const, text: '❌ Skills directory not found.' }] };
        }

        const skillFolders = fs
          .readdirSync(skillsDir, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);

        const skills = [];

        for (const folder of skillFolders) {
          const skillFilePath = path.join(skillsDir, folder, 'SKILL.md');
          if (fs.existsSync(skillFilePath)) {
            const content = fs.readFileSync(skillFilePath, 'utf8');

            // Simple YAML frontmatter parser for name and description
            const nameMatch = content.match(/^name:\s*(.+)$/m);
            const descMatch = content.match(/^description:\s*([\s\S]*?)(?=^---|^[a-zA-Z]+:|\n\n)/m);

            if (nameMatch) {
              const name = nameMatch[1].trim().replace(/^['"]|['"]$/g, '');
              let description = descMatch ? descMatch[1].trim() : '';

              // Clean up multi-line descriptions if they start with |
              if (description.startsWith('|')) {
                description = description.slice(1).trim();
              }
              // Remove quotes if present
              description = description.replace(/^['"]|['"]$/g, '');

              skills.push({
                name,
                description,
                path: skillFilePath,
              });
            }
          }
        }

        const output = `## Available Skills (${skills.length})\n\n${skills
          .map((s) => `- **${s.name}**: ${s.description.split('\n')[0]}`)
          .join('\n')}\n\nTo use a skill, read its absolute path: \`kit_get_extension_info\` provides the root.`;

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(skills, null, 2),
            },
            {
              type: 'text' as const,
              text: output,
            },
          ],
        };
      } catch (error) {
        return { content: [{ type: 'text' as const, text: `Error listing skills: ${error}` }] };
      }
    }
  );
}

// Export DEFAULT_EXTENSIONS for backward compatibility
export { DEFAULT_EXTENSIONS };
