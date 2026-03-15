/**
 * Git Tools - Checkpoint and Rollback
 * Tools 1, 2, 6, 11
 *
 * FIX 9.1: Added createBranch option to avoid detached HEAD state
 * FIX 1.1.0: Added git availability check
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { execFileSync } from 'child_process';
import { sanitize, safeGit, getWorkspaceRoot } from './security.js';

/**
 * Check if Git is available in the system
 * Call this during server initialization to provide friendly error
 */
export function checkGitAvailable(): { available: boolean; version?: string; error?: string } {
  try {
    const version = execFileSync('git', ['--version'], {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    return { available: true, version };
  } catch {
    return {
      available: false,
      error:
        'Git is not installed or not in PATH. Please install Git: https://git-scm.com/downloads',
    };
  }
}

// Check git on module load and warn if not available
const gitStatus = checkGitAvailable();
if (!gitStatus.available) {
  console.error(`[gemini-kit] ${gitStatus.error}`);
  console.error('[gemini-kit] Git-related tools will not work until Git is installed.');
}

export function registerGitTools(server: McpServer): void {
  // TOOL 1: CREATE CHECKPOINT
  server.tool(
    'kit_create_checkpoint',
    'Create a git checkpoint before making changes. Returns checkpoint ID.',
    { name: z.string().describe('Checkpoint name/description') },
    async ({ name }) => {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const safeName = sanitize(name).replace(/\s+/g, '-').slice(0, 20);
        const checkpointId = `kit-${timestamp}-${safeName}`;

        safeGit(['add', '-A']);
        safeGit(['commit', '-m', `checkpoint: ${sanitize(name)}`, '--allow-empty']);
        safeGit(['tag', checkpointId]);

        return {
          content: [
            {
              type: 'text' as const,
              text: `✅ Checkpoint created: ${checkpointId} in ${getWorkspaceRoot()}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ Error creating checkpoint: ${error} in ${getWorkspaceRoot()}`,
            },
          ],
        };
      }
    }
  );

  // TOOL 2: RESTORE CHECKPOINT (FIX 9.1 - Detached HEAD warning + createBranch option)
  server.tool(
    'kit_restore_checkpoint',
    'Restore to a previous checkpoint. Use createBranch=true to avoid detached HEAD state.',
    {
      checkpointId: z
        .string()
        .regex(/^kit-[\d\-T]+-.+$/, 'Invalid checkpoint ID format')
        .describe('Checkpoint ID to restore'),
      createBranch: z
        .boolean()
        .optional()
        .default(true)
        .describe('Create a new branch from checkpoint (recommended to avoid detached HEAD)'),
    },
    async ({ checkpointId, createBranch = true }) => {
      try {
        const safeId = sanitize(checkpointId);

        if (createBranch) {
          // Create a recovery branch to avoid detached HEAD
          const branchName = `recovery-${Date.now()}`;
          safeGit(['checkout', '-b', branchName, safeId]);
          return {
            content: [
              {
                type: 'text' as const,
                text: `✅ Restored to checkpoint: ${checkpointId}

**Created branch:** \`${branchName}\`

You can now safely continue working on this branch.
To go back to main: \`git checkout main\``,
              },
            ],
          };
        } else {
          // Direct checkout (will cause detached HEAD)
          safeGit(['checkout', safeId]);
          return {
            content: [
              {
                type: 'text' as const,
                text: `⚠️ Restored to checkpoint: ${checkpointId}

**WARNING: You are now in DETACHED HEAD state!**

Any commits you make will be lost if you switch branches.
To keep your changes, create a branch first:
\`git checkout -b my-recovery-branch\`

Or use \`createBranch: true\` next time.`,
              },
            ],
          };
        }
      } catch (error) {
        return { content: [{ type: 'text' as const, text: `❌ Error restoring: ${error}` }] };
      }
    }
  );
}
