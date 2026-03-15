#!/usr/bin/env node
/* eslint-disable no-undef */

/**
 * Universal Linker (X-Ray) v2.1
 * Language-agnostic relationship extractor for multi-tier scouting.
 * Optimized with smart scoring, file-type weighting, and natural language filtering.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, statSync } from 'fs';
import { dirname, join, resolve } from 'path';

// --- Configuration & Constants ---
const MAX_DEPTH = 1;
const MAX_PRIMARY_FILES = 8;
const MAX_TOTAL_FILES = 25;
const KEYWORD_MIN_LENGTH = 3;

const EXCLUDE_GLOBS = [
  'node_modules/*',
  'dist/*',
  '.git/*',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb',
  'composer.lock',
  'Gemfile.lock',
  'Cargo.lock',
  'poetry.lock',
  'go.sum',
  'mix.lock',
  '.DS_Store',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
];

// Expanded Stop Words based on natural language inquiries
const STOP_WORDS = new Set([
  'improve',
  'efficient',
  'returning',
  'files',
  'path',
  'output',
  'should',
  'high',
  'change',
  'founding',
  'correct',
  'for',
  'the',
  'and',
  'with',
  'from',
  'this',
  'that',
  'your',
  'about',
  'into',
  'will',
  'have',
  'been',
  'were',
  'also',
  'some',
  'how',
  'what',
  'where',
  'why',
  'who',
  'does',
  'do',
  'can',
  'could',
  'page',
  'server',
  'client',
  'sending',
  'before',
  'after',
  'using',
  'use',
  'make',
  'when',
  'then',
  'there',
  'their',
]);

// --- Core Logic ---

export function extractKeywords(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s._/-]/g, ' ')
    .split(/\s+/)
    .filter(
      (word) => word.length >= KEYWORD_MIN_LENGTH && !STOP_WORDS.has(word) && !word.startsWith('@')
    );
}

export function resolveLink(sourceFile, link) {
  const dir = dirname(sourceFile);
  const root = process.cwd();
  const cleanLink = link.replace(/['"]/g, '').replace(/^@/, '');

  const candidates = [
    resolve(dir, cleanLink),
    resolve(root, cleanLink),
    resolve(root, 'src', cleanLink),
    resolve(root, 'scripts', cleanLink),
  ];

  const extensions = [
    '',
    '.ts',
    '.js',
    '.py',
    '.go',
    '.tsx',
    '.jsx',
    '.rb',
    '.java',
    '.cs',
    '.md',
    '.toml',
    '.json',
  ];

  for (const cand of candidates) {
    for (const ext of extensions) {
      const fullPath = cand + ext;
      try {
        if (existsSync(fullPath) && !statSync(fullPath).isDirectory()) return fullPath;
        const indexPath = join(cand, 'index' + ext);
        if (existsSync(indexPath) && !statSync(indexPath).isDirectory()) return indexPath;
      } catch {
        /* ignore */
      }
    }
  }
  return null;
}

const PATTERNS = [
  /\b(?:import|require|include|using|use|load|from)\s+['"]([^'"]+)['"]/g,
  /\bimport\s+([a-zA-Z0-9_.]+)\b/g,
  /\[\[([^\]]+)\]\]/g,
  /\[[^\]]+\]\(([^)]+)\)/g,
];

export function scoreFile(content, keywords, filePath) {
  let score = 0;
  const lowerContent = content.toLowerCase();
  const lowerPath = filePath.toLowerCase();
  const baseName = lowerPath.split('/').pop();

  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) {
      score += matches.length * 10;
    }

    // Massive bonus for filename matches
    if (baseName.includes(kw)) {
      score += 150;
    } else if (lowerPath.includes(kw)) {
      score += 50;
    }
  }

  // Penalty for config and infrastructure files (to reduce noise)
  if (
    lowerPath.endsWith('.json') ||
    lowerPath.endsWith('.yaml') ||
    lowerPath.endsWith('.yml') ||
    lowerPath.includes('dockerfile')
  ) {
    score = Math.floor(score / 10);
  }

  // Multiplier boost for source code implementation files
  if (lowerPath.match(/\.(ts|tsx|js|jsx|py|go|java|rb|cs|php)$/)) {
    score = Math.floor(score * 1.5);
  }

  return score;
}

export function extractLinks(filePath, primaryFilePaths = []) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const links = new Set();

    for (const pattern of PATTERNS) {
      let match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(content)) !== null) {
        const resolved = resolveLink(filePath, match[1]);
        if (resolved && resolved !== filePath) links.add(resolved);
      }
    }

    for (const other of primaryFilePaths) {
      if (other === filePath) continue;
      const baseName = other.split('/').pop().split('.')[0];
      if (baseName.length > 3 && content.includes(baseName)) {
        links.add(other);
      }
    }
    return Array.from(links);
  } catch {
    return [];
  }
}

export function findPrimaryFiles(keywords) {
  if (keywords.length === 0) return [];
  const pattern = keywords.map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const globFlags = EXCLUDE_GLOBS.map((g) => `--glob "!${g}"`).join(' ');

  try {
    const rgOutput = execSync(`rg -l -i "${pattern}" . ${globFlags} | head -n 50`, {
      encoding: 'utf-8',
    });
    return rgOutput
      .split('\n')
      .filter(Boolean)
      .map((p) => resolve(process.cwd(), p));
  } catch {
    return [];
  }
}

// --- Execution (CLI Mode) ---
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1].endsWith('universal-linker.js')
) {
  const input = process.argv.slice(2).join(' ');
  const keywords = extractKeywords(input);

  if (keywords.length === 0) {
    console.log('Error: No valid keywords extracted from input.');
    process.exit(1);
  }

  const primaryPaths = findPrimaryFiles(keywords);
  const fileData = new Map();

  // Pre-calculate scores to pick the true top 8, not just the first 8 from ripgrep
  const scoredPaths = primaryPaths
    .map((path) => {
      try {
        const content = readFileSync(path, 'utf-8');
        return { path, score: scoreFile(content, keywords, path), content };
      } catch {
        return { path, score: 0, content: '' };
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PRIMARY_FILES);

  const queue = scoredPaths.map((p) => ({
    path: p.path,
    depth: 0,
    content: p.content,
    score: p.score,
  }));
  const visited = new Set(scoredPaths.map((p) => p.path));

  console.log(`=== UNIVERSAL LINKER (X-RAY) v2.1 FOR '${keywords.join(', ')}' ===\n`);

  while (queue.length > 0 && fileData.size < MAX_TOTAL_FILES) {
    const { path, depth, score } = queue.shift();

    try {
      const links =
        depth < MAX_DEPTH
          ? extractLinks(
              path,
              scoredPaths.map((p) => p.path)
            )
          : [];
      fileData.set(path, { score, depth, links });

      for (const link of links) {
        if (!visited.has(link) && fileData.size < MAX_TOTAL_FILES) {
          visited.add(link);
          try {
            const linkContent = readFileSync(link, 'utf-8');
            const linkScore = scoreFile(linkContent, keywords, link);
            queue.push({ path: link, depth: depth + 1, content: linkContent, score: linkScore });
          } catch {
            /* skip */
          }
        }
      }
    } catch {
      /* skip */
    }
  }

  const sortedFiles = Array.from(fileData.entries()).sort(
    (a, b) => b[1].score - a[1].score || a[1].depth - b[1].depth
  );

  console.log(
    `Found ${scoredPaths.length} primary files and ${fileData.size - scoredPaths.length} discovery hops.\n`
  );
  console.log('[Top Ranked Files]');
  sortedFiles.slice(0, 10).forEach(([path, data]) => {
    const relPath = path.replace(process.cwd() + '/', '');
    console.log(`- ${relPath} (Score: ${data.score}, Depth: ${data.depth})`);
  });

  console.log('\n[Relationship Graph]');
  sortedFiles.forEach(([path, data]) => {
    if (data.links.length > 0) {
      const relSource = path.replace(process.cwd() + '/', '');
      console.log(`${relSource} ->`);
      data.links.forEach((l) => {
        const relLink = l.replace(process.cwd() + '/', '');
        console.log(`  └─ ${relLink}`);
      });
    }
  });

  console.log(
    '\n@INSTRUCTION_FOR_AGENT: Prioritize high-score files. Use the graph to trace impact across boundaries.'
  );
}
