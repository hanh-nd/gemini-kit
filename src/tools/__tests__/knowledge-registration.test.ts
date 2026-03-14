/**
 * Knowledge Registration Tests - Test registerKnowledgeTools with mocked MCP server
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

// Mock all dependencies BEFORE importing
vi.mock('fs', () => ({
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
    appendFileSync: vi.fn(),
}));

vi.mock('../security.js', () => ({
    sanitize: vi.fn((x: string) => x),
    homeDir: '/tmp/test-home',
}));

import * as fs from 'fs';

describe('registerKnowledgeTools - Remaining Tools', () => {
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

    it('should register remaining knowledge tools', async () => {
        const { registerKnowledgeTools } = await import('../knowledge.js');
        registerKnowledgeTools(mockServer as unknown as Parameters<typeof registerKnowledgeTools>[0]);

        expect(registeredTools.has('kit_save_learning')).toBe(true);
        
        // Removed tools should NOT be registered
        expect(registeredTools.has('kit_get_learnings')).toBe(false);
        expect(registeredTools.has('kit_store_diff')).toBe(false);
        expect(registeredTools.has('kit_apply_stored_diff')).toBe(false);
        expect(registeredTools.has('kit_index_codebase')).toBe(false);
        expect(registeredTools.has('kit_keyword_search')).toBe(false);
    });

    describe('kit_save_learning', () => {
        it('should save learning successfully', async () => {
            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.appendFileSync).mockReturnValue(undefined);

            const { registerKnowledgeTools } = await import('../knowledge.js');
            registerKnowledgeTools(mockServer as unknown as Parameters<typeof registerKnowledgeTools>[0]);

            const tool = registeredTools.get('kit_save_learning');
            const result = await tool!.handler({
                category: 'code_style',
                lesson: 'Use arrow functions',
                context: 'User preference'
            });

            expect(result.content[0].text).toContain('Learning saved');
        });
    });
});
