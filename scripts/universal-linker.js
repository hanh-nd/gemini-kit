#!/usr/bin/env node
/* eslint-disable no-undef */

/**
 * Universal Linker (X-Ray)
 * Language-agnostic relationship extractor for multi-tier scouting.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, statSync } from 'fs';
import { dirname, join, resolve } from 'path';

const MAX_DEPTH = 1; // 1 hop from primary files (Total 2 tiers)
const MAX_PRIMARY_FILES = 5;
const MAX_TOTAL_FILES = 20;

const args = process.argv[2] || '';
const keyword = args.replace(/['"]/g, '').split(' ').pop();

if (!keyword) {
  console.log('Error: No valid keyword found.');
  process.exit(1);
}

// 1. Regex Patterns for Multi-Language Relationships
const PATTERNS = [
  // Quoted imports: JS, TS, Go, C/C++, Ruby, etc.
  /(?:import|require|include|using|use|load|from)\s+['"]([^'"]+)['"]/g,
  // Python imports
  /from\s+([a-zA-Z0-9_\.]+)\s+import/g,
  /import\s+([a-zA-Z0-9_\.]+)/g,
  // Java/C# packages/imports
  /import\s+([a-zA-Z0-9_\.]+);/g,
];

/**
 * Resolve a module path to a file path (Agnostic)
 */
function resolveLink(sourceFile, link) {
  const dir = dirname(sourceFile);
  const root = process.cwd();

  // Potential locations to check
  const candidates = [
    resolve(dir, link), // Relative to source
    resolve(root, link), // Relative to root
    resolve(root, 'src', link), // Common src folder
  ];

  const extensions = ['', '.ts', '.js', '.py', '.go', '.tsx', '.jsx', '.rb', '.java', '.cs', '.md'];

  for (const cand of candidates) {
    for (const ext of extensions) {
      const fullPath = cand + ext;
      if (existsSync(fullPath) && !statSync(fullPath).isDirectory()) return fullPath;

      const indexPath = join(cand, 'index' + ext);
      if (existsSync(indexPath)) {
        if (existsSync(indexPath) && !statSync(indexPath).isDirectory()) return indexPath;
      }
    }
  }

  return null;
}

/**
 * Extract links from file content
 */
function extractLinks(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const links = new Set();

  // 1. Explicit Imports/Requires
  for (const pattern of PATTERNS) {
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(content)) !== null) {
      const linkPath = match[1];
      const resolved = resolveLink(filePath, linkPath);
      if (resolved && resolved !== filePath) links.add(resolved);
    }
  }

  // 2. Heuristic: Reference to other primary files
  // If this file mentions another known file name, create a link
  primaryFiles.forEach((otherFile) => {
    if (otherFile === filePath) return;
    const baseName = otherFile.split('/').pop().split('.')[0];
    if (baseName.length > 3 && content.includes(baseName)) {
      links.add(otherFile);
    }
  });

  return Array.from(links);
}

// 2. Initial Scoping (Find Primary Files)
function findPrimaryFiles(kw) {
  try {
    const rgOutput = execSync(
      `rg -l "${kw}" . --glob "!node_modules/*" --glob "!dist/*" --glob "!.git/*" | head -n 20`,
      { encoding: 'utf-8' }
    );
    return rgOutput
      .split('\n')
      .filter(Boolean)
      .map((p) => resolve(process.cwd(), p));
  } catch (e) {
    return [];
  }
}

const primaryFiles = findPrimaryFiles(keyword).slice(0, MAX_PRIMARY_FILES);
const graph = new Map();
const queue = primaryFiles.map((f) => ({ path: f, depth: 0 }));
const visited = new Set(primaryFiles);

console.log(`=== UNIVERSAL LINKER (X-RAY) REPORT FOR '${keyword}' ===\n`);

// 3. BFS for Relationships
while (queue.length > 0 && visited.size < MAX_TOTAL_FILES) {
  const { path, depth } = queue.shift();

  if (depth >= MAX_DEPTH) continue;

  try {
    const links = extractLinks(path);
    graph.set(path, links);

    for (const link of links) {
      if (!visited.has(link)) {
        visited.add(link);
        queue.push({ path: link, depth: depth + 1 });
      }
    }
  } catch (e) {
    // Skip unreadable files
  }
}

// 4. Output Summary
console.log(
  `Found ${primaryFiles.length} primary files and ${visited.size - primaryFiles.length} direct dependencies.\n`
);

console.log('[Primary Files]');
primaryFiles.forEach((f) => console.log(`- ${f}`));

console.log('\n[Relationship Graph]');
graph.forEach((links, source) => {
  if (links.length > 0) {
    console.log(`${source} ->`);
    links.forEach((l) => console.log(`  └─ ${l}`));
  }
});

console.log(
  '\n@INSTRUCTION_FOR_AGENT: Prioritize reading the Primary Files first. Use the Relationship Graph to understand the impact of changes across modules.'
);
