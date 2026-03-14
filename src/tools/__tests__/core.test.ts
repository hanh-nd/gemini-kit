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
        expect(registeredTools.has('kit_get_skill_list')).toBe(false);
        
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



    describe('kit_get_command_prompt', () => {
        it('should rewrite agents/, skills/, and scripts/ paths to absolute', async () => {
            const rawContent = 'Use scripts/myscript.js with agents/myagent.md and skills/myskill/SKILL.md';
            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue(rawContent);

            const { registerCoreTools } = await import('../core.js');
            registerCoreTools(mockServer as unknown as Parameters<typeof registerCoreTools>[0]);

            const tool = registeredTools.get('kit_get_command_prompt');
            const result = await tool!.handler({ command: 'test' });

            const content = result.content[0].text;
            // Should not contain the relative path as a standalone word/path start
            // Use a more specific check to ensure it was replaced (not preceded by /)
            expect(content).not.toMatch(/(^|\s)scripts\/myscript\.js/);
            expect(content).toContain('/scripts/myscript.js');
            expect(content).toContain('/agents/myagent.md');
            expect(content).toContain('/skills/myskill/SKILL.md');
        });
    });
});
