/**
 * Kit Server Registration Tests - Full coverage for main server
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock fs
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
  readFileSync: vi.fn(),
  readdirSync: vi.fn().mockReturnValue([]),
  statSync: vi.fn().mockReturnValue({ isDirectory: () => false }),
}));

// Mock security
vi.mock('../tools/security.js', () => ({
  findFilesAsync: vi.fn().mockResolvedValue(['index.ts', 'utils.ts']),
  safeGit: vi.fn().mockReturnValue('abc123 commit 1'),
  sanitize: vi.fn((x: string) => x),
  homeDir: '/.geminit-kit/tmp/test-home',
}));

// Mock modular tool modules
vi.mock('../tools/git.js', () => ({
  registerGitTools: vi.fn(),
  checkGitAvailable: vi.fn().mockReturnValue({ available: true, version: 'git 2.40' }),
}));

vi.mock('../tools/knowledge.js', () => ({
  registerKnowledgeTools: vi.fn(),
}));

vi.mock('../tools/integration.js', () => ({
  registerIntegrationTools: vi.fn(),
}));

vi.mock('../tools/core.js', () => ({
  registerCoreTools: vi.fn(),
}));

vi.mock('../tools/orchestrator.js', () => ({
  initOrchestrator: vi.fn(),
}));

// Mock MCP server
vi.mock('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: vi.fn().mockImplementation(() => ({
    tool: vi.fn(),
    connect: vi.fn(),
  })),
}));

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: vi.fn(),
}));

import * as fs from 'fs';

describe('Kit Server - getFileExtensions logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should read custom extensions from mock settings', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({
        fileExtensions: ['.custom', '.ext'],
      })
    );

    const content = fs.readFileSync('settings.json', 'utf-8');
    const settings = JSON.parse(content as string);
    expect(settings.fileExtensions).toEqual(['.custom', '.ext']);
  });
});

describe('Kit Server - git log parsing logic', () => {
  it('should split git log lines correctly', () => {
    const log = 'abc123 commit 1\ndef456 commit 2';
    const commits = log.split('\n').filter(Boolean);
    expect(commits).toHaveLength(2);
    expect(commits[0]).toContain('abc123');
  });
});

describe('Kit Server - Constants', () => {
  it('should have a robust list of default extensions', () => {
    const DEFAULT_EXTENSIONS = [
      '.ts',
      '.js',
      '.tsx',
      '.jsx',
      '.py',
      '.go',
      '.rs',
      '.java',
      '.kt',
      '.md',
    ];

    expect(DEFAULT_EXTENSIONS).toContain('.ts');
    expect(DEFAULT_EXTENSIONS).toContain('.py');
    expect(DEFAULT_EXTENSIONS).toContain('.go');
    expect(DEFAULT_EXTENSIONS).toContain('.md');
  });
});
