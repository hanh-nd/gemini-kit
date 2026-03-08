/**
 * Integration Tools - GitHub, Bitbucket, Jira
 * Tools 14, 15, 16, 17, 18, 19
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { sanitize, safeGh, safeBkt, commandExists } from './security.js';

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
  // TOOL 14: GITHUB CREATE PR
  server.tool(
    'kit_github_create_pr',
    'Create a Pull Request on GitHub using gh CLI',
    {
      title: z.string().max(256).describe('PR title'),
      body: z.string().max(65536).describe('PR description/body'),
      base: z
        .string()
        .regex(/^[a-zA-Z0-9_\-./]+$/)
        .optional()
        .default('main')
        .describe('Base branch'),
      draft: z.boolean().optional().default(false).describe('Create as draft PR'),
      labels: z
        .array(z.string().regex(/^[a-zA-Z0-9_-]+$/))
        .optional()
        .describe('Labels to add'),
    },
    async ({ title, body, base = 'main', draft = false, labels }) => {
      try {
        if (!commandExists('gh')) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ GitHub CLI (gh) not installed.

Install it with:
- macOS: brew install gh
- Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md

Then authenticate:
gh auth login`,
              },
            ],
          };
        }

        try {
          safeGh(['auth', 'status']);
        } catch {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Not authenticated with GitHub.

Run: gh auth login`,
              },
            ],
          };
        }

        const args: string[] = [
          'pr',
          'create',
          '--title',
          sanitize(title),
          '--body',
          body,
          '--base',
          base,
        ];

        if (draft) args.push('--draft');
        // Issue 3 FIX: gh CLI requires separate --label flags, not comma-joined
        if (labels && labels.length > 0) {
          for (const label of labels) {
            args.push('--label', sanitize(label));
          }
        }

        const result = safeGh(args);

        return {
          content: [
            {
              type: 'text' as const,
              text: `✅ Pull Request created!\n\n${result}`,
            },
          ],
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: `❌ Error creating PR: ${errorMsg}` }] };
      }
    }
  );

  // TOOL 15: GITHUB GET PR
  server.tool(
    'kit_github_get_pr',
    'Get Pull Request details from GitHub',
    {
      prNumber: z.number().int().positive().optional().describe('PR number'),
      includeDiff: z.boolean().optional().default(false).describe('Include diff in output'),
    },
    async ({ prNumber, includeDiff = false }) => {
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
          const prInfo = safeGh([
            'pr',
            'view',
            String(prNumber),
            '--json',
            'title,body,state,author,labels,changedFiles,additions,deletions',
          ]);

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
              const diff = safeGh(['pr', 'diff', String(prNumber)]);
              output += `\n\n### Diff\n\`\`\`diff\n${diff.slice(0, 3000)}${diff.length > 3000 ? '\n... (truncated)' : ''}\n\`\`\``;
            } catch {
              /* diff not available, ignore */
            }
          }

          return { content: [{ type: 'text' as const, text: output }] };
        } else {
          const list = safeGh([
            'pr',
            'list',
            '--limit',
            '10',
            '--json',
            'number,title,state,author',
          ]);

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
    'Get ticket details from Jira (requires JIRA_BASE_URL and JIRA_API_TOKEN env vars)',
    {
      ticketId: z.string().describe('Jira ticket ID (e.g., PROJ-123)'),
    },
    async ({ ticketId }) => {
      try {
        const baseUrl = process.env.JIRA_BASE_URL;
        const apiToken = process.env.JIRA_API_TOKEN;
        const email = process.env.JIRA_EMAIL;

        if (!baseUrl || !apiToken || !email) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Jira not configured.

Set these environment variables:
- JIRA_BASE_URL=https://your-domain.atlassian.net
- JIRA_EMAIL=your-email@example.com
- JIRA_API_TOKEN=your-api-token

Get API token from: https://id.atlassian.com/manage-profile/security/api-tokens`,
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

        const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

        // FIX: Use Node.js native fetch instead of curl for cross-platform compatibility
        const response = await fetch(`${baseUrl}/rest/api/3/issue/${safeTicketId}`, {
          method: 'GET',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Failed to fetch ticket: ${response.status} ${response.statusText}`,
              },
            ],
          };
        }

        // MEDIUM 2: Validate Jira response with Zod schema
        const jsonData = await response.json();
        const parseResult = JiraTicketSchema.safeParse(jsonData);
        if (!parseResult.success) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `❌ Invalid Jira response format: ${parseResult.error.message}`,
              },
            ],
          };
        }
        const ticket = parseResult.data;

        if (ticket.errorMessages) {
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

  // TOOL 17: GITHUB GET ISSUE
  server.tool(
    'kit_github_get_issue',
    'Get GitHub issue details using gh CLI',
    {
      issueNumber: z.number().describe('Issue number'),
    },
    async ({ issueNumber }) => {
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

        // FIX: Use safeGh instead of execSync string
        const issueInfo = safeGh([
          'issue',
          'view',
          String(issueNumber),
          '--json',
          'title,body,state,author,labels,assignees',
        ]);

        const issue = JSON.parse(issueInfo);

        const output = `## 🐛 Issue #${issueNumber}: ${issue.title}

**State:** ${issue.state}
**Author:** ${issue.author.login}
**Assignees:** ${issue.assignees.map((a: { login: string }) => a.login).join(', ') || 'None'}
**Labels:** ${issue.labels.map((l: { name: string }) => l.name).join(', ') || 'None'}

### Description
${issue.body || 'No description'}`;

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
    'Get Pull Request details from Bitbucket using bkt CLI (avivsinai/bitbucket-cli)',
    {
      prId: z.number().int().positive().optional().describe('PR ID (omit to list recent PRs)'),
      includeDiff: z.boolean().optional().default(false).describe('Include diff in output'),
    },
    async ({ prId, includeDiff = false }) => {
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

Then authenticate with Bitbucket Cloud:
  bkt auth login https://bitbucket.org --kind cloud --web

More info: https://github.com/avivsinai/bitbucket-cli`,
              },
            ],
          };
        }

        if (prId) {
          const prInfo = safeBkt(['pr', 'view', String(prId), '--json']);
          const pr = JSON.parse(prInfo);

          let output = `## PR #${prId}: ${pr.title}

**State:** ${pr.state}
**Author:** ${pr.author?.display_name || pr.author?.nickname || 'Unknown'}
**Source:** ${pr.source?.branch?.name || 'unknown'} → ${pr.destination?.branch?.name || 'unknown'}
**Reviewers:** ${(pr.reviewers || []).map((r: { display_name?: string; nickname?: string }) => r.display_name || r.nickname).join(', ') || 'none'}

### Description
${pr.description || 'No description'}`;

          if (includeDiff) {
            try {
              const diff = safeBkt(['pr', 'diff', String(prId)]);
              output += `\n\n### Diff\n\`\`\`diff\n${diff.slice(0, 3000)}${diff.length > 3000 ? '\n... (truncated)' : ''}\n\`\`\``;
            } catch {
              /* diff not available, ignore */
            }
          }

          return { content: [{ type: 'text' as const, text: output }] };
        } else {
          const list = safeBkt(['pr', 'list', '--state', 'OPEN', '--limit', '10', '--json']);
          const prs = JSON.parse(list);
          const prList = Array.isArray(prs) ? prs : prs.values || [];

          const output = `## Recent Pull Requests\n\n${prList
            .map(
              (pr: {
                id: number;
                title: string;
                state: string;
                author?: { display_name?: string; nickname?: string };
              }) =>
                `- **#${pr.id}** ${pr.title} (${pr.state}) by ${pr.author?.display_name || pr.author?.nickname || 'unknown'}`
            )
            .join('\n')}`;

          return { content: [{ type: 'text' as const, text: output }] };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: `❌ Error: ${errorMsg}` }] };
      }
    }
  );

  // TOOL 19: BITBUCKET CREATE PR
  server.tool(
    'kit_bitbucket_create_pr',
    'Create a Pull Request on Bitbucket using bkt CLI (avivsinai/bitbucket-cli)',
    {
      title: z.string().max(256).describe('PR title'),
      description: z.string().max(65536).optional().default('').describe('PR description'),
      source: z.string().optional().describe('Source branch (defaults to current branch)'),
      target: z.string().optional().default('main').describe('Target/destination branch'),
      reviewers: z.array(z.string()).optional().describe('Reviewer usernames'),
    },
    async ({ title, description = '', source, target = 'main', reviewers }) => {
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

Then authenticate with Bitbucket Cloud:
  bkt auth login https://bitbucket.org --kind cloud --web

More info: https://github.com/avivsinai/bitbucket-cli`,
              },
            ],
          };
        }

        const args: string[] = ['pr', 'create', '--title', sanitize(title)];

        if (description) args.push('--description', description);
        if (source) args.push('--source', source);
        args.push('--target', target);

        if (reviewers && reviewers.length > 0) {
          for (const reviewer of reviewers) {
            args.push('--reviewer', sanitize(reviewer));
          }
        }

        const result = safeBkt(args);

        return {
          content: [
            {
              type: 'text' as const,
              text: `✅ Pull Request created on Bitbucket!\n\n${result}`,
            },
          ],
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: `❌ Error creating PR: ${errorMsg}` }] };
      }
    }
  );
}
