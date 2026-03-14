#!/usr/bin/env node
/* eslint-disable no-undef */
import { execSync } from 'child_process';

/**
 * count-tests.js
 * Deterministically count test files in the project using ripgrep (rg).
 */

function runCmd(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

// 1. Check if rg is available
const hasRg = runCmd('which rg');
if (!hasRg) {
  console.log('Error: ripgrep (rg) is not installed. Please install it for accurate test counting.');
  process.exit(1);
}

// 2. Define test patterns
// - Files ending in .test.ts/js/tsx/jsx
// - Files ending in .spec.ts/js/tsx/jsx
// - Files inside __tests__ directories
const patterns = [
  '--glob "**/*.test.[tj]s{x,}"',
  '--glob "**/*.spec.[tj]s{x,}"',
  '--glob "**/__tests__/**/*"',
];

// 3. Command construction
// Use -l to list filenames, then wc -l to count them
// Exclude common non-project directories
const excludeGlob = '--glob "!node_modules/*" --glob "!dist/*" --glob "!build/*" --glob "!.git/*"';
const searchPath = '.';

let totalCount = 0;

try {
  // We search for everything (.) but filter by test globs
  // rg -l . --glob ...
  const command = `rg -l "." ${patterns.join(' ')} ${excludeGlob} ${searchPath} | wc -l`;
  const result = runCmd(command);
  totalCount = parseInt(result, 10) || 0;
} catch {
  // Fallback if pipe fails
  totalCount = 0;
}

// 4. Output the result for the agent to consume
console.log(`TEST_COUNT_RESULT: ${totalCount}`);
console.log(`[Details]: Searched for test files in ${searchPath} using ripgrep.`);
