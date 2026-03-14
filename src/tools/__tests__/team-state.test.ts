/**
 * Team State Tests
 * Tests for session management, context, and persistence
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';

// Mock fs module
vi.mock('fs', () => ({
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    readdirSync: vi.fn(),
}));

// Mock path module  
vi.mock('path', () => ({
    join: vi.fn((...args: string[]) => args.join('/')),
}));

// Mock utils
vi.mock('../../utils.js', () => ({
    debounce: vi.fn((fn: () => void) => fn),
}));

describe('Team State', () => {
    let teamState: typeof import('../team-state.js');

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();

        // Default mocks
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readdirSync).mockReturnValue([]);

        // Import fresh module
        teamState = await import('../team-state.js');
    });

    afterEach(() => {
        vi.resetModules();
    });

    describe('initTeamState', () => {
        it('should create session directory if not exists', () => {
            vi.mocked(fs.existsSync).mockReturnValue(false);

            teamState.initTeamState();

            expect(fs.mkdirSync).toHaveBeenCalledWith(
                expect.stringContaining('sessions'),
                { recursive: true }
            );
        });
    });

    describe('startSession', () => {
        it('should create session with unique id', () => {
            const session1 = teamState.startSession('Goal 1');
            expect(session1.id).toMatch(/^session-\d+-[a-f0-9]{8}$/);
        });
    });

    describe('getCurrentSession', () => {
        it('should return current session after start', () => {
            teamState.startSession('Test goal');
            const session = teamState.getCurrentSession();

            expect(session).not.toBeNull();
            expect(session?.goal).toBe('Test goal');
        });
    });

    describe('addAgentResult', () => {
        it('should add result to session agents array', () => {
            teamState.startSession('Test goal');

            teamState.addAgentResult({
                agent: 'coder',
                status: 'success',
                output: 'Code written',
                timestamp: new Date().toISOString(),
            });

            const session = teamState.getCurrentSession();
            expect(session?.agents).toHaveLength(1);
        });
    });

    describe('updateContext', () => {
        it('should update context values', () => {
            teamState.startSession('Test goal');
            teamState.updateContext('plan', 'Step 1');
            
            const session = teamState.getCurrentSession();
            expect(session?.context['plan']).toBe('Step 1');
        });
    });

    describe('endSession', () => {
        it('should end session', () => {
            teamState.startSession('Test goal');
            const session = teamState.endSession('completed');

            expect(session?.status).toBe('completed');
        });
    });
});
