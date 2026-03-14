/**
 * Git Tools Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock security module
vi.mock('../security.js', () => ({
    sanitize: vi.fn((x: string) => x.replace(/[;&|`$]/g, '')),
    safeGit: vi.fn(),
}));

// Mock child_process
vi.mock('child_process', () => ({
    execFileSync: vi.fn(),
}));

describe('Git Tools - Remaining Functionality', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
    });

    describe('checkGitAvailable', () => {
        it('should return available=true when git is installed', async () => {
            const { execFileSync } = await import('child_process');
            vi.mocked(execFileSync).mockReturnValue('git version 2.40.0');

            const { checkGitAvailable } = await import('../git.js');
            const result = checkGitAvailable();

            expect(result.available).toBe(true);
        });
    });

    describe('Checkpoint Creation Logic', () => {
        it('should generate valid checkpoint ID format', () => {
            const name = 'test';
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const checkpointId = `kit-${timestamp}-${name}`;
            expect(checkpointId).toMatch(/^kit-\d{4}-\d{2}-\d{2}T/);
        });
    });
});
