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

// Mock child_process
vi.mock('child_process', () => ({
  execSync: vi.fn(),
  execFileSync: vi.fn(),
}));

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

describe('registerIntegrationTools - Full Coverage', () => {
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

  it('should register all integration tools', async () => {
    const { registerIntegrationTools } = await import('../integration.js');
    registerIntegrationTools(
      mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
    );

    expect(registeredTools.has('kit_github_create_pr')).toBe(true);
    expect(registeredTools.has('kit_github_get_pr')).toBe(true);
    expect(registeredTools.has('kit_jira_get_ticket')).toBe(true);
    expect(registeredTools.has('kit_github_get_issue')).toBe(true);
    expect(registeredTools.has('kit_bitbucket_get_pr')).toBe(true);
    expect(registeredTools.has('kit_bitbucket_create_pr')).toBe(true);
  });

  describe('kit_github_create_pr', () => {
    it('should create PR successfully', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(true);
      vi.mocked(security.safeGh).mockReturnValue('https://github.com/user/repo/pull/123');

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_github_create_pr');
      const result = await tool!.handler({
        title: 'Test PR',
        body: 'Test body',
        draft: false,
      });

      expect(result.content[0].text).toBeDefined();
    });

    it('should handle gh not installed', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(false);

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_github_create_pr');
      const result = await tool!.handler({ title: 'Test', body: 'Test' });

      expect(result.content[0].text).toBeDefined();
    });

    it('should handle errors', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(true);
      vi.mocked(security.safeGh).mockImplementation(() => {
        throw new Error('PR creation failed');
      });

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_github_create_pr');
      const result = await tool!.handler({ title: 'Test', body: 'Test' });

      expect(result.content[0].text).toBeDefined();
    });
  });

  describe('kit_github_get_pr', () => {
    it('should get PR successfully', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(true);
      vi.mocked(security.safeGh).mockReturnValue('{"number": 123}');

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_github_get_pr');
      const result = await tool!.handler({ prNumber: 123 });

      expect(result.content[0].text).toBeDefined();
    });

    it('should handle gh not installed', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(false);

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_github_get_pr');
      const result = await tool!.handler({ prNumber: 123 });

      expect(result.content[0].text).toBeDefined();
    });
  });

  describe('kit_github_get_issue', () => {
    it('should get issue successfully', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(true);
      vi.mocked(security.safeGh).mockReturnValue('{"number": 42}');

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_github_get_issue');
      const result = await tool!.handler({ issueNumber: 42 });

      expect(result.content[0].text).toBeDefined();
    });

    it('should handle gh not installed', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(false);

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_github_get_issue');
      const result = await tool!.handler({ issueNumber: 42 });

      expect(result.content[0].text).toBeDefined();
    });
  });

  describe('kit_jira_get_ticket', () => {
    it('should get ticket structure from Atlassian CLI', async () => {
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
      expect(result.content[0].text).toContain('Status:** To Do');
    });

    it('should handle acli not installed', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockImplementation((cmd: string) => cmd !== 'acli');

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_jira_get_ticket');
      const result = await tool!.handler({ ticketId: 'PROJ-123' });

      expect(result.content[0].text).toContain('acli) not installed');
    });
  });

  describe('kit_bitbucket_get_pr', () => {
    it('should handle bkt not installed', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(false);

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_bitbucket_get_pr');
      const result = await tool!.handler({ prId: 1 });

      expect(result.content[0].text).toContain('bkt) not installed');
    });

    it('should handle bkt CLI errors', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(true);
      vi.mocked(security.safeBkt).mockImplementation(() => {
        throw new Error('Bitbucket CLI failed: not authenticated');
      });

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_bitbucket_get_pr');
      const result = await tool!.handler({ prId: 1 });

      expect(result.content[0].text).toContain('Error');
    });
  });

  describe('kit_bitbucket_create_pr', () => {
    it('should handle bkt not installed', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(false);

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_bitbucket_create_pr');
      const result = await tool!.handler({ title: 'Test PR' });

      expect(result.content[0].text).toContain('bkt) not installed');
    });

    it('should create PR successfully', async () => {
      const security = await import('../security.js');
      vi.mocked(security.commandExists).mockReturnValue(true);
      vi.mocked(security.safeBkt).mockReturnValue(
        'https://bitbucket.org/team/repo/pull-requests/42'
      );

      const { registerIntegrationTools } = await import('../integration.js');
      registerIntegrationTools(
        mockServer as unknown as Parameters<typeof registerIntegrationTools>[0]
      );

      const tool = registeredTools.get('kit_bitbucket_create_pr');
      const result = await tool!.handler({ title: 'Test PR' });

      expect(result.content[0].text).toContain('Pull Request created');
    });
  });
});
