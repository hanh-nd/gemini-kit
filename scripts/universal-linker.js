#!/usr/bin/env node
/* eslint-disable no-undef */

/**
 * Universal Linker (X-Ray) v2.0
 * Language-agnostic relationship extractor for multi-tier scouting.
 * Optimized for efficiency and high-accuracy file discovery.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, statSync } from 'fs';
import { dirname, join, resolve } from 'path';

// --- Configuration & Constants ---
const MAX_DEPTH = 1;
const MAX_PRIMARY_FILES = 8; // Increased for better coverage
const MAX_TOTAL_FILES = 25;
const KEYWORD_MIN_LENGTH = 3;

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
]);

// --- Core Logic ---

/**
 * Extracts meaningful keywords from a requirement string.
 */
export function extractKeywords(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s._/-]/g, ' ')
    .split(/\s+/)
    .filter(
      (word) => word.length >= KEYWORD_MIN_LENGTH && !STOP_WORDS.has(word) && !word.startsWith('@') // Handled separately if needed
    );
}

/**
 * Resolves a module path to a file path (Agnostic).
 */
export function resolveLink(sourceFile, link) {
  const dir = dirname(sourceFile);
  const root = process.cwd();

  // Normalize link: remove quotes and potential @ prefix
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

/**
 * Patterns for multi-language relationships with word-boundary awareness.
 */
const PATTERNS = [
  // Imports: JS, TS, Go, Python, Java, etc.
  /\b(?:import|require|include|using|use|load|from)\s+['"]([^'"]+)['"]/g,
  /\bimport\s+([a-zA-Z0-9_.]+)\b/g,
  // Markdown links: [text](path) or [[path]]
  /\[\[([^\]]+)\]\]/g,
  /\[[^\]]+\]\(([^)]+)\)/g,
];

/**
 * Scores a file's relevance based on keyword density.
 */
export function scoreFile(content, keywords) {
  let score = 0;
  const lowerContent = content.toLowerCase();

  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) {
      score += matches.length * 10;
    }
    // Bonus for filename matches (if content contains the full path or name)
    if (lowerContent.includes(kw)) score += 5;
  }

  return score;
}

/**
 * Extract links from file content.
 */
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

    // Heuristic: Cross-references between primary files
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

/**
 * Find primary files using ripgrep with an OR pattern of keywords.
 */
function findPrimaryFiles(keywords) {
  if (keywords.length === 0) return [];

  const pattern = keywords.map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  try {
    const rgOutput = execSync(
      `rg -l "${pattern}" . --glob "!node_modules/*" --glob "!dist/*" --glob "!.git/*" | head -n 30`,
      { encoding: 'utf-8' }
    );
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

  const primaryPaths = findPrimaryFiles(keywords).slice(0, MAX_PRIMARY_FILES);
  const fileData = new Map(); // path -> { score, depth, links }
  const queue = primaryPaths.map((p) => ({ path: p, depth: 0 }));
  const visited = new Set(primaryPaths);

  console.log(`=== UNIVERSAL LINKER (X-RAY) v2.0 FOR '${keywords.join(', ')}' ===\n`);

  while (queue.length > 0 && fileData.size < MAX_TOTAL_FILES) {
    const { path, depth } = queue.shift();

    try {
      const content = readFileSync(path, 'utf-8');
      const score = scoreFile(content, keywords);
      const links = depth < MAX_DEPTH ? extractLinks(path, primaryPaths) : [];

      fileData.set(path, { score, depth, links });

      for (const link of links) {
        if (!visited.has(link) && fileData.size < MAX_TOTAL_FILES) {
          visited.add(link);
          queue.push({ path: link, depth: depth + 1 });
        }
      }
    } catch {
      /* skip */
    }
  }

  // Sorting: Score (DESC), Depth (ASC)
  const sortedFiles = Array.from(fileData.entries()).sort(
    (a, b) => b[1].score - a[1].score || a[1].depth - b[1].depth
  );

  console.log(
    `Found ${primaryPaths.length} primary files and ${fileData.size - primaryPaths.length} discovery hops.\n`
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
