/**
 * Workflows Tests
 * Tests for workflow definitions and prompts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { Workflow, WorkflowStep } from '../workflows.js';

describe('WORKFLOWS', () => {
    let WORKFLOWS: Record<string, Workflow>;
    let getWorkflow: (name: string) => Workflow | undefined;
    let getStepPrompt: (step: WorkflowStep, task: string, context: Record<string, unknown>) => string;

    beforeEach(async () => {
        const workflows = await import('../workflows.js');
        WORKFLOWS = workflows.WORKFLOWS;
        getWorkflow = workflows.getWorkflow;
        getStepPrompt = workflows.getStepPrompt;
    });

    describe('Workflow definitions', () => {
        it('should have basic workflows defined', () => {
            expect(WORKFLOWS.cook).toBeDefined();
            expect(WORKFLOWS.quickfix).toBeDefined();
        });
    });

    describe('getWorkflow', () => {
        it('should return workflow by name', () => {
            const workflow = getWorkflow('cook');
            expect(workflow?.name).toBe('cook');
        });
    });

    describe('getStepPrompt', () => {
        it('should generate prompt for agent', () => {
            const step = { agent: 'planner', description: 'Create plan', required: true };
            const prompt = getStepPrompt(step, 'build', {});
            expect(prompt).toContain('Planner');
        });
    });
});
