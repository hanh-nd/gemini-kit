/**
 * Orchestrator Engine
 * Coordinates agents, manages workflows, handles retries and parallel execution
 */

import {
    TeamSession,
    AgentResult,
    initTeamState,
} from './team-state.js';

import {
    Workflow,
    WorkflowStep,
} from './workflows.js';

export interface OrchestratorConfig {
    maxRetries: number;
    parallelEnabled: boolean;
    autoRetry: boolean;
    verbose: boolean;
}

const DEFAULT_CONFIG: OrchestratorConfig = {
    maxRetries: 3,
    parallelEnabled: true,
    autoRetry: true,
    verbose: false,
};

let config: OrchestratorConfig = DEFAULT_CONFIG;

/**
 * Initialize orchestrator
 */
export function initOrchestrator(customConfig?: Partial<OrchestratorConfig>): void {
    config = { ...DEFAULT_CONFIG, ...customConfig };
    initTeamState({ maxRetries: config.maxRetries });
}

// Export types
export type { TeamSession, AgentResult, Workflow, WorkflowStep };
