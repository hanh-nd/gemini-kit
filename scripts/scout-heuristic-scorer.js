#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

import { execSync } from 'child_process';
import { existsSync, readFileSync, statSync } from 'fs';
import { resolve } from 'path';

// 1. Parse Arguments
const args = process.argv[2] || '';
const intentArg = process.argv.find((arg) => arg.startsWith('--intent=')) || '--intent=OVERVIEW';
const intent = intentArg.split('=')[1];

const MAX_FILES = 10;

// Helper: Run shell command safely
function runCmd(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch (error) {
    return ''; // Return empty string if grep/rg finds nothing or fails
  }
}

// 2. Intent: OVERVIEW
// Mục tiêu: Bức tranh toàn cảnh, không soi chi tiết.
if (intent === 'OVERVIEW') {
  console.log('=== PROJECT OVERVIEW ===');

  // Lấy danh sách dependencies cốt lõi
  if (existsSync('package.json')) {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
    console.log('[Dependencies]:', Object.keys(pkg.dependencies || {}).join(', '));
  }

  // Dùng tree để vẽ sơ đồ thư mục (bỏ qua các thư mục rác)
  const treeOutput = runCmd(`tree -L 3 -I "node_modules|dist|build|coverage|.git"`);
  console.log(
    '\n[Directory Structure]:\n' +
      (treeOutput || "Command 'tree' not available or empty directory.")
  );
  process.exit(0);
}

// Helper: Escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 3. Intent: MODULE_DEEPDIVE & DATA_FLOW
// Chuyển args thành keyword. Nếu args là một câu dài, lấy các từ vựng tiềm năng.
const rawKeyword = args.replace(/['"]/g, '').split(' ').pop();
const keyword = escapeRegExp(rawKeyword);

if (!keyword) {
  console.log('Error: No valid keyword found in args.');
  process.exit(1);
}

// Bước 3.1: Dùng Ripgrep (rg) để tìm thô danh sách file chứa keyword.
// Bao gồm cả các thư mục phổ biến khác và root (loại trừ node_modules)
const searchPaths = ['src', 'lib', 'components', 'pages', 'app', 'utils', 'hooks', 'services', '.']
  .filter((p) => existsSync(resolve(process.cwd(), p)))
  .join(' ');

const rgFiles = runCmd(
  `rg -l "${keyword}" ${searchPaths} --glob "!node_modules/*" --glob "!dist/*" --glob "!.git/*" 2>/dev/null`
);

if (!rgFiles) {
  console.log(`No files found containing keyword: ${rawKeyword}`);
  process.exit(0);
}

const filePaths = Array.from(
  new Set(
    rgFiles
      .split('\n')
      .filter(Boolean)
      .map((p) => resolve(process.cwd(), p))
  )
);
const scoredFiles = [];

// Các pattern để cộng điểm (Definition & Imports)
// Definition: function, async function, class, const/let/var, interface, type, enum, arrow functions
const regexDefinition = new RegExp(
  `(\\b(async\\s+)?function\\s+${keyword}\\b|\\bclass\\s+${keyword}\\b|\\b(const|let|var)\\s+${keyword}\\s*=|\\binterface\\s+${keyword}\\b|\\btype\\s+${keyword}\\s*=|\\benum\\s+${keyword}\\b|\\bconst\\s+${keyword}\\s*=\\s*(\\(.*\\)|[^=]*)\\s*=>)`,
  'i'
);

// Import/Export/Require
const regexImportExport = new RegExp(
  `(\\bimport\\b.*\\b${keyword}\\b.*\\bfrom\\b|\\bexport\\b.*\\b${keyword}\\b|\\brequire\\b\\s*\\(.*\\b${keyword}\\b.*\\))`,
  'i'
);

// Bước 3.2: Đọc file vào RAM và tính điểm (Heuristic Scoring)
filePaths.forEach((filePath) => {
  try {
    const absolutePath = resolve(process.cwd(), filePath);
    // Tránh xử lý lại thư mục nếu rg trả về
    if (statSync(absolutePath).isDirectory()) return;

    const stat = statSync(absolutePath);
    if (stat.size > 500 * 1024) return;

    const content = readFileSync(absolutePath, 'utf-8');
    let score = 0;

    // A. Tiêu chí 1: Số lần xuất hiện (Case-insensitive match count)
    const matchCount = (content.match(new RegExp(keyword, 'gi')) || []).length;
    score += matchCount;

    // B. Tiêu chí 2: Definition Bonus (+50 điểm)
    if (regexDefinition.test(content)) {
      score += 50;
    }

    // C. Tiêu chí 3: Import/Export Bonus (+10 điểm)
    if (regexImportExport.test(content)) {
      score += 10;
    }

    // D. Tiêu chí 4: Penalty file Test (-50 điểm)
    if (/\.(spec|test)\.[tj]sx?$/.test(filePath) || filePath.includes('__tests__')) {
      score -= 50;
    }

    // E. Tiêu chí 5: Penalty file config/docs (-30 điểm)
    if (/\.(json|md|yaml|yml)$/.test(filePath)) {
      score -= 30;
    }

    scoredFiles.push({ path: absolutePath, score, matchCount });
  } catch (err) {
    // Bỏ qua nếu lỗi
  }
});

// Bước 3.3: Sắp xếp theo điểm và lấy Top N
scoredFiles.sort((a, b) => b.score - a.score);
const topFiles = scoredFiles.slice(0, MAX_FILES);

// 4. Output kết quả ra Stdout cho LLM (Tier 4) đọc
console.log(`=== HEURISTIC SEARCH RESULTS FOR '${keyword}' ===`);
console.log(`Intent: ${intent}`);
console.log(
  `Found ${filePaths.length} files. Returning top ${topFiles.length} critical files based on AST-lite heuristics:\n`
);

topFiles.forEach((f) => {
  console.log(`[Score: ${f.score}] ${f.path}`);
});

console.log(
  '\n@INSTRUCTION_FOR_AGENT: Read the exact absolute paths above using your file-reading tool to analyze the flow.'
);
