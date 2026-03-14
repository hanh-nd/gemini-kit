/**
 * Core Tools Tests - Test registerCoreTools
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Types
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

// Mock fs
vi.mock('fs', () => ({
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
    readdirSync: vi.fn(),
}));

import * as fs from 'fs';

describe('registerCoreTools', () => {
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

    it('should register remaining core tools', async () => {
        const { registerCoreTools } = await import('../core.js');
        registerCoreTools(mockServer as unknown as Parameters<typeof registerCoreTools>[0]);

        expect(registeredTools.has('kit_get_extension_info')).toBe(true);
        expect(registeredTools.has('kit_get_command_prompt')).toBe(true);
        expect(registeredTools.has('kit_get_skill_list')).toBe(true);
        
        // Unused tools should NOT be registered
        expect(registeredTools.has('kit_get_project_context')).toBe(false);
        expect(registeredTools.has('kit_handoff_agent')).toBe(false);
        expect(registeredTools.has('kit_save_artifact')).toBe(false);
        expect(registeredTools.has('kit_list_commands')).toBe(false);
    });

    describe('kit_get_extension_info', () => {
        it('should return extension information', async () => {
            const { registerCoreTools } = await import('../core.js');
            registerCoreTools(mockServer as unknown as Parameters<typeof registerCoreTools>[0]);

            const tool = registeredTools.get('kit_get_extension_info');
            const result = await tool!.handler({});

            const info = JSON.parse(result.content[0].text);
            expect(info).toHaveProperty('extensionRoot');
            expect(info).toHaveProperty('agentsDir');
            expect(info).toHaveProperty('skillsDir');
        });
    });

    describe('kit_get_skill_list', () => {
        it('should list available skills', async () => {
            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readdirSync).mockReturnValue([
                { name: 'test-skill', isDirectory: () => true }
            ] as any); // eslint-disable-line @typescript-eslint/no-explicit-any



            vi.mocked(fs.readFileSync).mockReturnValue('name: Test Skill\ndescription: Test description\n---\n');

            const { registerCoreTools } = await import('../core.js');
            registerCoreTools(mockServer as unknown as Parameters<typeof registerCoreTools>[0]);

            const tool = registeredTools.get('kit_get_skill_list');
            const result = await tool!.handler({});

            expect(result.content[1].text).toContain('Available Skills');
            expect(result.content[1].text).toContain('Test Skill');
        });
    });
});
