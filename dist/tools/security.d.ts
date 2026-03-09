/**
 * Security Helpers - Prevent Command Injection
 * Exported utilities for safe command execution
 */
export declare const homeDir: string;
/**
 * Sanitize string for safe use with execFileSync
 * Only removes dangerous shell operators - safe chars like !?#* are allowed
 * since execFileSync doesn't invoke a shell and handles args safely
 *
 * NOTE: Flag injection is NOT handled here because:
 * 1. execFileSync uses arg arrays, not shell parsing
 * 2. Adding -- prefix would corrupt content (e.g., commit messages)
 * 3. Callers should use '--' separator when needed for specific commands
 */
export declare function sanitize(input: string): string;
/**
 * Validate file path to prevent path traversal attacks
 * Uses stricter path.sep check to prevent prefix matching flaws
 * (e.g., /tmp/app should not match /tmp/app-secret)
 */
export declare function validatePath(filePath: string, baseDir?: string): string;
/**
 * Safe git command execution using execFileSync
 * Includes stderr in error message for better debugging
 *
 * @param timeout Default from GEMINI_KIT_GIT_TIMEOUT env var or 30s
 */
export declare function safeGit(args: string[], options?: {
    cwd?: string;
    timeout?: number;
}): string;
/**
 * Safe gh (GitHub CLI) command execution
 * Includes stderr in error message for better debugging
 *
 * @param timeout Default from GEMINI_KIT_GH_TIMEOUT env var or 60s
 */
export declare function safeGh(args: string[], options?: {
    timeout?: number;
}): string;
/**
 * Check if a command exists (cross-platform)
 * Uses 'where' on Windows, 'which' on macOS/Linux
 */
export declare function commandExists(cmd: string): boolean;
/**
 * Cross-platform file finder (replaces Unix-only find/grep/head)
 * MEDIUM 2: Uses iterative queue-based approach to prevent stack overflow
 */
export declare function findFiles(dir: string, extensions: string[], maxFiles: number, excludeDirs?: string[]): string[];
/**
 * Async file finder - non-blocking for large repos
 * Uses queue-based approach to prevent stack overflow on deep directories
 */
export declare function findFilesAsync(dir: string, extensions: string[], maxFiles: number, excludeDirs?: string[]): Promise<string[]>;
/**
 * Detect git provider from remote URL
 * Returns 'github', 'bitbucket', or 'unknown'
 */
export type GitProvider = 'github' | 'bitbucket' | 'unknown';
export declare function detectGitProvider(cwd?: string): GitProvider;
/**
 * Parse Bitbucket workspace and repo slug from git remote URL
 * Supports both HTTPS and SSH formats:
 *   https://bitbucket.org/workspace/repo.git
 *   git@bitbucket.org:workspace/repo.git
 */
export declare function parseBitbucketRemote(cwd?: string): {
    workspace: string;
    repoSlug: string;
} | null;
/**
 * Safe bkt (Bitbucket CLI) command execution
 * Includes stderr in error message for better debugging
 *
 * Requires bkt CLI: brew install avivsinai/tap/bitbucket-cli
 * Auth via: bkt auth login https://bitbucket.org --kind cloud --web
 * See: https://github.com/avivsinai/bitbucket-cli
 *
 * @param timeout Default from GEMINI_KIT_BKT_TIMEOUT env var or 60s
 */
export declare function safeBkt(args: string[], options?: {
    timeout?: number;
    cwd?: string;
}): string;
