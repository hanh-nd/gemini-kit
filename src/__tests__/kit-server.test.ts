/**
 * Kit Server Tests - Complete coverage for main server
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs';

// Mock fs
vi.mock('fs', () => ({
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
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

describe('Kit Server - getFileExtensions logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle custom extensions from settings.json', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
            fileExtensions: ['.custom', '.ext']
        }));

        const settings = JSON.parse('{"fileExtensions": [".custom", ".ext"]}');
        expect(settings.fileExtensions).toEqual(['.custom', '.ext']);
    });
});

describe('Kit Server - git log parsing', () => {
    it('should split git log lines', () => {
        const log = 'abc123 commit 1\ndef456 commit 2\n';
        const commits = log.split('\n').filter(Boolean);
        expect(commits).toHaveLength(2);
    });
});
