/**
 * Git Registration Tests - Test registerGitTools with mocked MCP server
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Types for mock objects
interface ToolHandler {
  (args: Record<string, unknown>): Promise<{ content: Array<{ type: 'text'; text: string }> }>;
}

interface RegisteredTool {
  description: string;
  schema: unknown;
  handler: ToolHandler;
}

interface MockMcpServer {
  tool: ReturnType<typeof vi.fn>;
}

// Mock all dependencies BEFORE importing the module
vi.mock('fs', () => ({
  existsSync: vi.fn().mockReturnValue(true),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock('child_process', () => ({
  execFileSync: vi.fn().mockReturnValue('git version 2.40.0'),
}));

vi.mock('../security.js', () => ({
  sanitize: vi.fn((x: string) => x.replace(/[;&|`$]/g, '')),
  safeGit: vi.fn().mockReturnValue(''),
  homeDir: '/.geminit-kit/handoffs/test-home',
}));

describe('registerGitTools - Remaining Tools', () => {
  let mockServer: MockMcpServer;
  let registeredTools: Map<string, RegisteredTool>;
  let safeGit: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    registeredTools = new Map<string, RegisteredTool>();

    // Create mock MCP server
    mockServer = {
      tool: vi.fn((name: string, description: string, schema: unknown, handler: ToolHandler) => {
        registeredTools.set(name, { description, schema, handler });
      }),
    };

    const security = await import('../security.js');
    safeGit = vi.mocked(security.safeGit);
  });

  it('should register remaining git tools', async () => {
    const { registerGitTools } = await import('../git.js');
    registerGitTools(mockServer as unknown as Parameters<typeof registerGitTools>[0]);

    expect(registeredTools.has('kit_create_checkpoint')).toBe(true);
    expect(registeredTools.has('kit_restore_checkpoint')).toBe(true);

    // Removed tools should NOT be registered
    expect(registeredTools.has('kit_list_checkpoints')).toBe(false);
    expect(registeredTools.has('kit_auto_rollback')).toBe(false);
  });

  describe('kit_create_checkpoint handler', () => {
    it('should create checkpoint successfully', async () => {
      const { registerGitTools } = await import('../git.js');
      registerGitTools(mockServer as unknown as Parameters<typeof registerGitTools>[0]);

      safeGit.mockReturnValue('');
      const tool = registeredTools.get('kit_create_checkpoint');
      const result = await tool!.handler({ name: 'test-checkpoint' });

      expect(result.content[0].text).toContain('Checkpoint created');
      expect(safeGit).toHaveBeenCalledWith(['add', '-A']);
    });
  });

  describe('kit_restore_checkpoint handler', () => {
    it('should restore with branch creation', async () => {
      vi.resetModules();
      const { registerGitTools } = await import('../git.js');
      registerGitTools(mockServer as unknown as Parameters<typeof registerGitTools>[0]);

      const security = await import('../security.js');
      vi.mocked(security.safeGit).mockReturnValue('');

      const tool = registeredTools.get('kit_restore_checkpoint');
      const result = await tool!.handler({
        checkpointId: 'kit-2024-01-01T00-00-00-test',
        createBranch: true,
      });

      expect(result.content[0].text).toContain('branch');
    });
  });
});
