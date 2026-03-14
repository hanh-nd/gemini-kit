/**
 * Integration Registration Tests - Test registerIntegrationTools with mocked MCP server
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

// Mock security
vi.mock('../security.js', () => ({
  safeGh: vi.fn().mockReturnValue('https://github.com/user/repo/pull/1'),
  safeBkt: vi.fn().mockReturnValue('https://bitbucket.org/team/repo/pull-requests/1'),
  safeAcli: vi.fn().mockReturnValue(JSON.stringify({
    fields: {
      summary: 'Test issue',
      status: { name: 'To Do' },
      priority: { name: 'High' },
      assignee: { displayName: 'John Doe' },
      reporter: { displayName: 'Jane Smith' },
      issuetype: { name: 'Task' },
      description: 'Test description',
      labels: ['bug']
    }
  })),
  commandExists: vi.fn().mockReturnValue(true),
  sanitize: vi.fn((x: string) => x),
}));

describe('registerIntegrationTools - Remaining Tools', () => {
  let mockServer: MockMcpServer;
  let registeredTools: Map<string, RegisteredTool>;

  beforeEach(() => {
    vi.clearAllMocks();
    registeredTools = new Map<string, RegisteredTool>();

    mockServer = {
      tool: vi.fn((name: string, description: string, schema: unknown, handler: ToolHandler) => {
        registeredTools.set(name, { description, schema, handler });
      }),
    };
  });

  it('should register remaining integration tools', async () => {
    const { registerIntegrationTools } = await import('../integration.js');
    registerIntegrationTools(
      mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
    );

    expect(registeredTools.has('kit_github_get_pr')).toBe(true);
    expect(registeredTools.has('kit_jira_get_ticket')).toBe(true);
    expect(registeredTools.has('kit_bitbucket_get_pr')).toBe(true);
    
    // Removed tools should NOT be registered
    expect(registeredTools.has('kit_github_create_pr')).toBe(false);
    expect(registeredTools.has('kit_github_get_issue')).toBe(false);
    expect(registeredTools.has('kit_bitbucket_create_pr')).toBe(false);
  });

  describe('kit_github_get_pr', () => {
    it('should get PR successfully', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(true);
      vi.mocked(security.safeGh).mockReturnValue(JSON.stringify({
        title: 'Test PR',
        body: 'Test body',
        state: 'OPEN',
        author: { login: 'user' },
        labels: [],
        changedFiles: 1,
        additions: 1,
        deletions: 1
      }));

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_github_get_pr');
      const result = await tool!.handler({ prNumber: 123 });

      expect(result.content[0].text).toBeDefined();
      expect(result.content[0].text).toContain('PR #123');
    });
  });

  describe('kit_jira_get_ticket', () => {
    it('should get ticket structure', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(true);

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_jira_get_ticket');
      const result = await tool!.handler({ ticketId: 'PROJ-123' });

      expect(result.content[0].text).toContain('PROJ-123');
      expect(result.content[0].text).toContain('Test issue');
    });
  });
});
