# Source Code

TypeScript source code for Gemini-Kit MCP extension.

## Purpose

Core implementation of MCP tools, utilities, and extension functionality.

## Components

| Directory/File  | Description                                        |
| --------------- | -------------------------------------------------- |
| `tools/`        | MCP tool implementations                           |
| `kit-server.ts` | Main MCP server entry point                        |
| `constants.ts`  | Shared constants and configuration                 |
| `utils.ts`      | Utility functions (path handling, file operations) |
| `__tests__/`    | Test suite                                         |

## Component Details

### 🔴 Critical: `kit-server.ts`

Main MCP server implementation. Registers all tools, handles requests, and manages server lifecycle.

- **Exports**: `startServer()`, tool registrations
- **Dependencies**: All tools in `tools/` directory

### 🟡 Supporting: `constants.ts`

Shared constants including file patterns, default values, and configuration.

- **Exports**: `PATTERNS`, `DEFAULTS`, `CONFIG`

### 🟡 Supporting: `utils.ts`

Utility functions for common operations.

- **Exports**: Path utilities, file helpers, string manipulation

### 🔴 Critical: `tools/`

MCP tool implementations:

- **integration.ts** - GitHub/Jira/Bitbucket integration
- **security.ts** - Secret detection and blocking
- **config.ts** - Project configuration

## Building

```bash
npm run build
```

## Testing

```bash
npm test
```
