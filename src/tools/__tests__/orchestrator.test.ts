/**
 * Orchestrator Engine Tests
 * Tests for workflow orchestration, team management, and routing
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock team-state module
vi.mock('../team-state.js', () => ({
    initTeamState: vi.fn(),
}));

describe('Orchestrator', () => {
    let orchestrator: typeof import('../orchestrator.js');
    let teamState: typeof import('../team-state.js');

    beforeEach(async () => {
        vi.clearAllMocks();

        // Import modules fresh for each test
        orchestrator = await import('../orchestrator.js');
        teamState = await import('../team-state.js');
    });

    afterEach(() => {
        vi.resetModules();
    });

    describe('initOrchestrator', () => {
        it('should initialize with default config', () => {
            orchestrator.initOrchestrator();
            expect(teamState.initTeamState).toHaveBeenCalledWith({ maxRetries: 3 });
        });

        it('should merge custom config with defaults', () => {
            orchestrator.initOrchestrator({ maxRetries: 5, verbose: true });
            expect(teamState.initTeamState).toHaveBeenCalledWith({ maxRetries: 5 });
        });
    });
});
