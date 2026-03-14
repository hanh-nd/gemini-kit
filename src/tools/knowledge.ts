/**
 * Knowledge Tools - Learnings
 * Tool 7
 * 
 * FIXES:
 * - 9.5: Learning Delimiter - use unique markers
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { homeDir } from './security.js';

// Constants
const LEARNING_START = '<!-- LEARNING_START';
const LEARNING_END = '<!-- LEARNING_END -->';

export function registerKnowledgeTools(server: McpServer): void {
    // TOOL 7: SAVE LEARNING (FIX 9.5 - unique delimiter)
    server.tool(
        'kit_save_learning',
        'Save a learning/lesson from user feedback to improve future responses',
        {
            category: z.enum(['code_style', 'bug', 'preference', 'pattern', 'other']).describe('Category of the learning'),
            lesson: z.string().describe('The lesson learned'),
            context: z.string().optional().describe('Additional context'),
        },
        async ({ category, lesson, context }) => {
            try {
                const learningsDir = path.join(homeDir, '.gemini-kit', 'learnings');
                fs.mkdirSync(learningsDir, { recursive: true });

                const learningsFile = path.join(learningsDir, 'LEARNINGS.md');
                if (!fs.existsSync(learningsFile)) {
                    fs.writeFileSync(learningsFile, `# Gemini-Kit Learnings\n\n> AI automatically learns from user feedback.\n\n---\n\n`);
                }

                const timestamp = new Date().toISOString();
                const dateStr = timestamp.split('T')[0];
                const id = Date.now();

                // Use unique delimiters that won't conflict with content (FIX 9.5)
                const entry = `
${LEARNING_START}:${category}:${id} -->
**[${category.toUpperCase()}]** - ${dateStr}

**Lesson:** ${lesson}
${context ? `\n**Context:** ${context}` : ''}
${LEARNING_END}

---
`;
                fs.appendFileSync(learningsFile, entry);

                return { content: [{ type: 'text' as const, text: `✅ Learning saved!\n\nCategory: ${category}\nLesson: ${lesson}` }] };
            } catch (error) {
                return { content: [{ type: 'text' as const, text: `❌ Error: ${error}` }] };
            }
        }
    );
}
