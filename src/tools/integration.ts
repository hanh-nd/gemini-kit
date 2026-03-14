/**
 * Integration Tools - GitHub, Bitbucket, Jira
 * Tools 14, 15, 16, 17, 18, 19
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { sanitize, safeGh, safeBkt, safeAcli, commandExists } from './security.js';

// Zod schemas for GitHub CLI responses (MEDIUM 3: Validate JSON)
const PrDetailSchema = z.object({
  title: z.string(),
  body: z.string().nullable(),
  state: z.string(),
  author: z.object({ login: z.string() }),
  labels: z.array(z.object({ name: z.string() })),
  changedFiles: z.number(),
  additions: z.number(),
  deletions: z.number(),
});

const PrListItemSchema = z.object({
  number: z.number(),
  title: z.string(),
  state: z.string(),
  author: z.object({ login: z.string() }),
});

// MEDIUM 2: Jira ticket schema for runtime validation
// ADF (Atlassian Document Format) can have many nested content types
// We use a more permissive schema that accepts any ADF structure
const AdfContentSchema = z
  .object({
    type: z.string().optional(),
    content: z.array(z.unknown()).optional(),
    text: z.string().optional(),
  })
  .passthrough();

const JiraFieldsSchema = z.object({
  summary: z.string(),
  status: z.object({ name: z.string() }).optional(),
  priority: z.object({ name: z.string() }).optional(),
  assignee: z.object({ displayName: z.string() }).nullable().optional(),
  reporter: z.object({ displayName: z.string() }).nullable().optional(),
  issuetype: z.object({ name: z.string() }).optional(),
  // Handle both plain string and ADF (Atlassian Document Format) structures
  description: z
    .union([
      z.string(),
      z
        .object({
          type: z.string().optional(),
          version: z.number().optional(),
          content: z.array(AdfContentSchema).optional(),
        })
        .passthrough(), // Accept any additional ADF fields
    ])
    .nullable()
    .optional(),
  labels: z.array(z.string()).optional(),
});

const JiraTicketSchema = z.object({
  errorMessages: z.array(z.string()).optional(),
  fields: JiraFieldsSchema,
});

/**
 * Extract plain text from ADF (Atlassian Document Format) content
 * Recursively walks the content tree to find text nodes
 */
function extractAdfText(adf: Record<string, unknown> | null | undefined): string {
  if (!adf || typeof adf !== 'object') return 'No description';

  const content = adf.content as Array<Record<string, unknown>> | undefined;
  if (!content || !Array.isArray(content)) return 'No description';

  const textParts: string[] = [];

  function extractText(nodes: Array<Record<string, unknown>>): void {
    for (const node of nodes) {
      if (typeof node.text === 'string') {
        textParts.push(node.text);
      }
      if (Array.isArray(node.content)) {
        extractText(node.content as Array<Record<string, unknown>>);
      }
    }
  }

  extractText(content);
  return textParts.join(' ') || 'No description';
}

// Note: IssueDetailSchema reserved for future kit_github_get_issue tool

export function registerIntegrationTools(server: McpServer): void {
  // TOOL 15: GITHUB GET PR
  server.tool(
    'kit_github_get_pr',
    'Get Pull Request details from GitHub',
    {
      prNumber: z.number().int().positive().optional().describe('PR number'),
      includeDiff: z.boolean().optional().default(false).describe('Include diff in output'),
      repo: z
        .string()
        .regex(/^[a-zA-Z0-9_\-./]+$/)
        .optional()
        .describe('Repository in owner/repo format'),
    },
    async ({ prNumber, includeDiff = false, repo }) => {
      try {
        if (!commandExists('gh')) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ GitHub CLI (gh) not installed. Install with: brew install gh',
              },
            ],
          };
        }

        if (prNumber) {
          const prArgs = [
            'pr',
            'view',
            String(prNumber),
            '--json',
            'title,body,state,author,labels,changedFiles,additions,deletions',
          ];

          if (repo) prArgs.push('--repo', sanitize(repo));
          const prInfo = safeGh(prArgs);

          // MEDIUM 3: Validate JSON with zod
          const parseResult = PrDetailSchema.safeParse(JSON.parse(prInfo));
          if (!parseResult.success) {
            return {
              content: [
                {
                  type: 'text' as const,
                  text: `❌ Failed to parse PR data: ${parseResult.error.message}`,
                },
              ],
            };
          }
          const pr = parseResult.data;
          let output = `## PR #${prNumber}: ${pr.title}

**State:** ${pr.state}
**Author:** ${pr.author.login}
**Labels:** ${pr.labels.map((l) => l.name).join(', ') || 'none'}
**Changes:** +${pr.additions} / -${pr.deletions} (${pr.changedFiles} files)

### Description
${pr.body || 'No description'}`;

          if (includeDiff) {
            try {
              const diffArgs = ['pr', 'diff', String(prNumber)];
              if (repo) diffArgs.push('--repo', sanitize(repo));
              const diff = safeGh(diffArgs);
              output += `\n\n### Diff\n\`\`\`diff\n${diff.slice(0, 3000)}${diff.length > 3000 ? '\n... (truncated)' : ''}\n\`\`\``;
            } catch {
              /* diff not available, ignore */
            }
          }

          return { content: [{ type: 'text' as const, text: output }] };
        } else {
          const listArgs = [
            'pr',
            'list',
            '--limit',
            '10',
            '--json',
            'number,title,state,author',
          ];

          if (repo) listArgs.push('--repo', sanitize(repo));
          const list = safeGh(listArgs);

          // MEDIUM 3: Validate JSON with zod
          const parseResult = z.array(PrListItemSchema).safeParse(JSON.parse(list));
          if (!parseResult.success) {
            return {
              content: [
                {
                  type: 'text' as const,
                  text: `❌ Failed to parse PR list: ${parseResult.error.message}`,
                },
              ],
            };
          }
          const prs = parseResult.data;
          const output = `## Recent Pull Requests\n\n${prs
            .map((pr) => `- **#${pr.number}** ${pr.title} (${pr.state}) by @${pr.author.login}`)
            .join('\n')}`;

          return { content: [{ type: 'text' as const, text: output }] };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: `Error: ${errorMsg}` }] };
      }
    }
  );

  // TOOL 16: JIRA GET TICKET
  server.tool(
    'kit_jira_get_ticket',
    'Get ticket details from Jira using Atlassian CLI (acli)',
    {
      ticketId: z.string().describe('Jira ticket ID (e.g., PROJ-123)'),
    },
    async ({ ticketId }) => {
      try {
        if (!commandExists('acli')) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Atlassian CLI (acli) not installed.

Install it from:
https://developer.atlassian.com/cloud/acli/guides/how-to-get-started/

Then authenticate:
acli jira auth login --web`,
              },
            ],
          };
        }

        // FIX: Validate ticketId format to prevent command injection
        const safeTicketId = ticketId.match(/^[A-Z]+-\d+$/)?.[0];
        if (!safeTicketId) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Invalid ticket ID format: ${ticketId}\n\nExpected format: PROJ-123`,
              },
            ],
          };
        }

        // Use acli to get ticket info in JSON format
        const ticketInfo = safeAcli(['jira', 'workitem', 'view', safeTicketId, '--json']);

        // MEDIUM 2: Validate Jira response with Zod schema
        const jsonData = JSON.parse(ticketInfo);
        const parseResult = JiraTicketSchema.safeParse(jsonData);
        if (!parseResult.success) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Invalid Jira response format from acli: ${parseResult.error.message}`,
              },
            ],
          };
        }
        const ticket = parseResult.data;

        if (ticket.errorMessages && ticket.errorMessages.length > 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Ticket not found: ${ticketId}\n\n${ticket.errorMessages.join('\n')}`,
              },
            ],
          };
        }

        const output = `## 🎫 ${ticketId}: ${ticket.fields.summary}

**Status:** ${ticket.fields.status?.name || 'Unknown'}
**Priority:** ${ticket.fields.priority?.name || 'None'}
**Assignee:** ${ticket.fields.assignee?.displayName || 'Unassigned'}
**Reporter:** ${ticket.fields.reporter?.displayName || 'Unknown'}
**Type:** ${ticket.fields.issuetype?.name || 'Unknown'}

### Description
${
  typeof ticket.fields.description === 'string'
    ? ticket.fields.description
    : extractAdfText(ticket.fields.description as Record<string, unknown>)
}

### Labels
${ticket.fields.labels?.join(', ') || 'None'}`;

        return { content: [{ type: 'text' as const, text: output }] };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: `Error: ${errorMsg}` }] };
      }
    }
  );

  // TOOL 18: BITBUCKET GET PR
  server.tool(
    'kit_bitbucket_get_pr',
    'Get Pull Request details from Bitbucket using bkt CLI. Requires bkt context to be set up first.',
    {
      prId: z.number().int().positive().optional().describe('PR ID (omit to list recent PRs)'),
      includeDiff: z.boolean().optional().default(false).describe('Include diff in output'),
      workspace: z.string().optional().describe('Bitbucket workspace override'),
      repoSlug: z.string().optional().describe('Repository slug override'),
      context: z.string().optional().describe('Bitbucket context name'),
    },
    async ({ prId, includeDiff = false, workspace, repoSlug, context }) => {
      try {
        if (!commandExists('bkt')) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Bitbucket CLI (bkt) not installed.

Install bkt using one of these methods:

  # Homebrew (macOS/Linux)
  brew install avivsinai/tap/bitbucket-cli

  # Go Install
  go install github.com/avivsinai/bitbucket-cli/cmd/bkt@latest

  # From Source
  git clone https://github.com/avivsinai/bitbucket-cli.git
  cd bitbucket-cli && make build

Then authenticate and set up context:
  bkt auth login https://bitbucket.org --kind cloud --web
  bkt context create my-cloud --host api.bitbucket.org --workspace <your-workspace> --set-active

More info: https://github.com/avivsinai/bitbucket-cli`,
              },
            ],
          };
        }

        if (prId) {
          const viewArgs = ['pr', 'view', String(prId), '--json'];
          if (workspace) viewArgs.push('--workspace', sanitize(workspace));
          if (repoSlug) viewArgs.push('--repo', sanitize(repoSlug));
          if (context) viewArgs.push('--context', sanitize(context));

          const prInfo = safeBkt(viewArgs);
          const pr = JSON.parse(prInfo);

          let output = `## PR #${prId} Details\n\n\`\`\`json\n${JSON.stringify(pr, null, 2)}\n\`\`\``;

          if (includeDiff) {
            try {
              const diffArgs = ['pr', 'diff', String(prId)];
              if (workspace) diffArgs.push('--workspace', sanitize(workspace));
              if (repoSlug) diffArgs.push('--repo', sanitize(repoSlug));
              if (context) diffArgs.push('--context', sanitize(context));

              const diff = safeBkt(diffArgs);
              output += `\n\n### Diff\n\`\`\`diff\n${diff.slice(0, 3000)}${diff.length > 3000 ? '\n... (truncated)' : ''}\n\`\`\``;
            } catch {
              /* diff not available, ignore */
            }
          }

          return { content: [{ type: 'text' as const, text: output }] };
        } else {
          const listArgs = ['pr', 'list', '--state', 'OPEN', '--limit', '10', '--json'];
          if (workspace) listArgs.push('--workspace', sanitize(workspace));
          if (repoSlug) listArgs.push('--repo', sanitize(repoSlug));
          if (context) listArgs.push('--context', sanitize(context));

          const list = safeBkt(listArgs);
          const prs = JSON.parse(list);

          const output = `## Recent Pull Requests\n\n\`\`\`json\n${JSON.stringify(prs, null, 2)}\n\`\`\``;

          return { content: [{ type: 'text' as const, text: output }] };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: `❌ Error: ${errorMsg}` }] };
      }
    }
  );
}

