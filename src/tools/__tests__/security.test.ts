/**
 * Security Tools Tests
 * Tests for sanitize, safeGit, commandExists, findFilesAsync
 */

import { describe, it, expect, beforeEach } from 'vitest';


describe('sanitize', () => {
    let sanitize: (input: string) => string;

    beforeEach(async () => {
        const security = await import('../security.js');
        sanitize = security.sanitize;
    });

    it('should remove semicolons', () => {
        expect(sanitize('test; rm -rf /')).toBe('test rm -rf /');
    });

    it('should limit length to 500 characters', () => {
        const longString = 'a'.repeat(1000);
        expect(sanitize(longString).length).toBe(500);
    });
});

describe('safeGit', () => {
    let safeGit: (args: string[], options?: { cwd?: string; timeout?: number }) => string;

    beforeEach(async () => {
        const security = await import('../security.js');
        safeGit = security.safeGit;
    });

    it('should throw on invalid git commands', () => {
        expect(() => safeGit(['invalid-command-12345'])).toThrow();
    });
});

describe('commandExists', () => {
    let commandExists: (cmd: string) => boolean;

    beforeEach(async () => {
        const security = await import('../security.js');
        commandExists = security.commandExists;
    });

    it('should return true for existing command (node)', () => {
        expect(commandExists('node')).toBe(true);
    });

    it('should return false for non-existing command', () => {
        expect(commandExists('non-existent-command-xyz-12345')).toBe(false);
    });
});

describe('findFilesAsync', () => {
    let findFilesAsync: (
        dir: string,
        extensions: string[],
        maxFiles: number,
        excludeDirs?: string[]
    ) => Promise<string[]>;

    beforeEach(async () => {
        const security = await import('../security.js');
        findFilesAsync = security.findFilesAsync;
    });

    it('should find TypeScript files asynchronously', async () => {
        const files = await findFilesAsync(process.cwd(), ['.ts'], 10);
        expect(Array.isArray(files)).toBe(true);
        expect(files.every(f => !f.startsWith('/'))).toBe(true);
    });
});
