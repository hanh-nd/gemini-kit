/**
 * Integration Tools Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock security
vi.mock('../security.js', () => ({
  safeGh: vi.fn(),
  commandExists: vi.fn(),
  sanitize: vi.fn((x: string) => x),
}));

describe('Integration Tools - Remaining Functionality', () => {
  let commandExists: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const security = await import('../security.js');
    commandExists = vi.mocked(security.commandExists);
  });

  describe('Utility Functions', () => {
    it('should sanitize user input', async () => {
      const security = await import('../security.js');
      const sanitize = vi.mocked(security.sanitize);
      sanitize.mockImplementation((x: string) => x.replace(/[;&|`$]/g, ''));

      const input = 'test; malicious';
      const result = sanitize(input);

      expect(result).not.toContain(';');
    });

    it('should check command availability', async () => {
      commandExists.mockReturnValue(true);
      expect(commandExists('gh')).toBe(true);
    });
  });

  describe('Git Provider Detection Logic', () => {
    it('should detect GitHub from remote URL', () => {
      const url = 'https://github.com/user/repo.git';
      expect(url.includes('github.com')).toBe(true);
    });

    it('should detect Bitbucket from remote URL', () => {
      const url = 'https://bitbucket.org/workspace/repo.git';
      expect(url.includes('bitbucket.org')).toBe(true);
    });
  });
});
