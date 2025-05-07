// Script to clean up residual TypeScript syntax after conversion to JavaScript
// Run with: node fix-project.js
// It will traverse the ./src directory (relative to project root) and attempt to
// fix common leftover TypeScript constructs so that the project is valid JS.
// It also deletes TypeScript config files.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = __dirname; // assuming script placed in project root
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Helper: Recursively walk directory and collect file paths
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules just in case
      if (entry.name === 'node_modules') continue;
      files.push(...walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

// Generic cleanup replacements
function fixContent(content) {
  let fixed = content;

  // 1. Fix incorrect React import (import * from 'react')
  fixed = fixed.replace(/import \* +from (["'])react\1/g, 'import * as React from $1react$1');

  // 2. Ensure React is imported as namespace if React JSX used but no React import (optional)
  //   This would require parsing; skipping for now.

  // 3. Remove generic params in React.forwardRef<...>
  fixed = fixed.replace(/React\.forwardRef<[^>]+>/g, 'React.forwardRef');

  // 4. Remove simple type annotations in destructured parameter objects e.g. ({ a, b }: FooProps)
  fixed = fixed.replace(/\((\s*\{[^}]*\})\s*\)\s*:\s*[^=\{\(]+/g, '($1)');

  // 5. Remove simple variable type annotations e.g. const x: Foo = ... ;  let y: Bar =
  fixed = fixed.replace(/(const|let|var) ([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*[^=;]+=/g, '$1 $2 =');

  // 6. Remove TS as assertions like " as const" (we keep runtime logic) - quick replace for common ones
  fixed = fixed.replace(/ as const/g, '');

  // 7. Remove leftover TS interface / type imports (import type)
  fixed = fixed.replace(/import type .*;?\n/g, '');

  return fixed;
}

function processFile(filePath) {
  if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return; // only process JS/JSX
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = fixContent(original);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    console.log('Updated', path.relative(ROOT_DIR, filePath));
  }
}

function run() {
  const files = walk(SRC_DIR);
  files.forEach(processFile);

  // Delete TypeScript config files if present
  const tsConfigs = ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json'];
  for (const cfg of tsConfigs) {
    const cfgPath = path.join(ROOT_DIR, cfg);
    if (fs.existsSync(cfgPath)) {
      fs.rmSync(cfgPath);
      console.log('Deleted', cfg);
    }
  }
  console.log('Cleanup complete.');
}

run();
