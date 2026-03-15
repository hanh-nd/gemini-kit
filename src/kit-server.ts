#!/usr/bin/env node
/**
 * Gemini-Kit MCP Server
 * Provides custom tools for agent orchestration
 *
 * Modular architecture - tools split into separate modules
 * Refactored: Core tools moved to tools/core.ts
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Import modular tool registrations
import { registerIntegrationTools } from './tools/integration.js';
import { registerCoreTools } from './tools/core.js';

const server = new McpServer({
  name: 'gemini-kit-agents',
  version: '1.0.0',
});

// ═══════════════════════════════════════════════════════════════
// REGISTER MODULAR TOOLS
// ═══════════════════════════════════════════════════════════════

registerIntegrationTools(server); // GitHub, Jira tools
registerCoreTools(server); // Extension info, skills, prompts

// ═══════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════
const transport = new StdioServerTransport();
await server.connect(transport);
