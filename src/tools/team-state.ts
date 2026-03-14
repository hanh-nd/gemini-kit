/**
 * Team State Management
 * Manages shared context and state between agents in a team session
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { z } from 'zod';
import { debounce } from '../utils.js';


// ═══════════════════════════════════════════════════════════════
// SCHEMAS & TYPES
// ═══════════════════════════════════════════════════════════════

export const AgentResultSchema = z.object({
    agent: z.string(),
    status: z.enum(['pending', 'success', 'failure', 'retry', 'abort']),
    output: z.string(),
    timestamp: z.string(),
    duration: z.number().optional(),
    error: z.string().optional(),
});

export type AgentResult = z.infer<typeof AgentResultSchema>;

export const TeamSessionSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['active', 'completed', 'failed']),
    goal: z.string(),
    agents: z.array(AgentResultSchema),
    context: z.record(z.unknown()),
    retryCount: z.number().default(0),
    maxRetries: z.number().default(3),
    startTime: z.string(),
    endTime: z.string().optional(),
});

export type TeamSession = z.infer<typeof TeamSessionSchema>;

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

let currentSession: TeamSession | null = null;

const config = {
    sessionDir: path.join(process.cwd(), '.gemini-kit', 'sessions'),
};

const ACTIVE_SESSION_POINTER = 'active-session.json';

// ═══════════════════════════════════════════════════════════════
// CORE LOGIC
// ═══════════════════════════════════════════════════════════════

/**
 * Initialize team state
 */
export function initTeamState(_customConfig?: { maxRetries?: number }): void {
    if (!fs.existsSync(config.sessionDir)) {
        fs.mkdirSync(config.sessionDir, { recursive: true });
    }
    registerShutdownHandlers();
}

/**
 * Start a new team session
 */
export function startSession(goal: string, name?: string): TeamSession {
    const timestamp = Date.now();
    const sessionId = `session-${timestamp}-${crypto.randomUUID().slice(0, 8)}`;

    currentSession = {
        id: sessionId,
        name: name || `Session ${new Date().toLocaleString()}`,
        status: 'active',
        goal,
        agents: [],
        context: {},
        retryCount: 0,
        maxRetries: 3,
        startTime: new Date().toISOString(),
    };

    saveSessionSync();
    return currentSession;
}

/**
 * Get current active session
 */
export function getCurrentSession(): TeamSession | null {
    return currentSession;
}

/**
 * Add agent result to session
 */
export function addAgentResult(result: AgentResult): void {
    if (!currentSession) {
        throw new Error('No active session.');
    }

    currentSession.agents.push(result);
    saveSession();
}

/**
 * Update context
 */
export function updateContext(key: string, value: unknown): void {
    if (!currentSession) {
        throw new Error('No active session.');
    }

    currentSession.context[key] = value;
    saveSession();
}

/**
 * Increment retry count
 */
export function incrementRetry(): number {
    if (!currentSession) {
        throw new Error('No active session.');
    }

    currentSession.retryCount++;
    saveSession();
    return currentSession.retryCount;
}

/**
 * Check if can retry
 */
export function canRetry(): boolean {
    if (!currentSession) return false;
    return currentSession.retryCount < currentSession.maxRetries;
}

/**
 * End team session
 */
export function endSession(status: 'completed' | 'failed' = 'completed'): TeamSession | null {
    if (!currentSession) return null;

    currentSession.status = status;
    currentSession.endTime = new Date().toISOString();

    const session = currentSession;
    saveSessionSync();
    currentSession = null;

    return session;
}

// ═══════════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════════

/**
 * Save session to file (internal sync version)
 */
function saveSessionSync(): void {
    if (!currentSession) return;

    const filePath = path.join(config.sessionDir, `${currentSession.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(currentSession, null, 2));
}

/**
 * Debounced save - reduces file I/O when called rapidly
 */
const debouncedSave = debounce(() => {
    saveSessionSync();
}, 150);

/**
 * Save session - uses debounce for frequent calls, sync for critical operations
 */
function saveSession(immediate = false): void {
    if (!currentSession) return;

    if (immediate) {
        saveSessionSync();
    } else {
        debouncedSave();
    }
}

/**
 * List all sessions
 */
const MAX_SESSIONS_TO_LIST = parseInt(process.env.GEMINI_KIT_MAX_SESSIONS || '20', 10);

export function listSessions(limit: number = MAX_SESSIONS_TO_LIST): TeamSession[] {
    if (!fs.existsSync(config.sessionDir)) {
        return [];
    }

    const files = fs.readdirSync(config.sessionDir)
        .filter((f: string) => f.endsWith('.json') && f !== ACTIVE_SESSION_POINTER);

    const fileStats = files.map(file => {
        try {
            const filePath = path.join(config.sessionDir, file);
            const stat = fs.statSync(filePath);
            return { file, mtime: stat.mtime.getTime() };
        } catch {
            return { file, mtime: 0 };
        }
    }).sort((a, b) => b.mtime - a.mtime);

    const recentFiles = fileStats.slice(0, limit);

    return recentFiles.map(({ file }) => {
        try {
            const data = fs.readFileSync(path.join(config.sessionDir, file), 'utf-8');
            const parsed = TeamSessionSchema.safeParse(JSON.parse(data));
            if (!parsed.success) return null;
            return parsed.data;
        } catch {
            return null;
        }
    })
        .filter((s): s is TeamSession => s !== null)
        .sort((a: TeamSession, b: TeamSession) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}

/**
 * Get session summary
 */
export function getSessionSummary(): string {
    if (!currentSession) {
        return 'No active session';
    }

    const duration = currentSession.endTime
        ? Math.round((new Date(currentSession.endTime).getTime() - new Date(currentSession.startTime).getTime()) / 1000)
        : Math.round((Date.now() - new Date(currentSession.startTime).getTime()) / 1000);

    const agentStats = currentSession.agents.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return `
## Team Session: ${currentSession.name}
**Goal:** ${currentSession.goal}
**Status:** ${currentSession.status}
**Duration:** ${duration}s
**Agents:** ${currentSession.agents.length} total (${agentStats.success || 0} success, ${agentStats.failure || 0} failed)
**Retries:** ${currentSession.retryCount}/${currentSession.maxRetries}

### Agent Results:
${currentSession.agents.map(a => `- **${a.agent}**: ${a.status} (${a.duration || 0}ms)`).join('\n')}
`.trim();
}

// ═══════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN HANDLERS
// ═══════════════════════════════════════════════════════════════

function registerShutdownHandlers(): void {
    process.on('exit', () => {
        if (currentSession) {
            saveSessionSync();
        }
    });

    process.on('SIGINT', () => {
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        process.exit(0);
    });
}
