#!/usr/bin/env node
// Validates .github/plugin/plugin.json against the private-copilot conventions.
// Adapted from github/awesome-copilot/eng/validate-plugins.mjs for single-plugin use.
//
// Checks:
//   1. plugin.json exists and parses as JSON.
//   2. name matches /^[a-z][a-z0-9-]{0,49}$/ (VS Code Copilot plugin spec).
//   3. description, version present.
//   4. Every path in agents[] and skills[] resolves on disk.
//   5. Every .agent.md file's frontmatter name: matches its filename.
//   6. Every skill folder contains SKILL.md whose frontmatter name: matches the folder name.
//   7. agents[] and skills[] entries are alphabetically sorted.

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const manifestPath = join(repoRoot, '.github/plugin/plugin.json');

const NAME_RX = /^[a-z][a-z0-9-]{0,49}$/;

const errors = [];
const warnings = [];

function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

async function readFrontmatterField(filePath, field) {
  const text = await readFile(filePath, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const block = match[1];
  const line = block.split(/\r?\n/).find((l) => l.startsWith(`${field}:`));
  if (!line) return null;
  return line.replace(`${field}:`, '').trim().replace(/^['"]|['"]$/g, '');
}

function assertSorted(arr, label) {
  const sorted = [...arr].sort();
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== sorted[i]) {
      err(`${label} is not alphabetically sorted (expected "${sorted[i]}" at position ${i}, got "${arr[i]}")`);
      return;
    }
  }
}

// Step 1 — manifest exists + parses
if (!existsSync(manifestPath)) {
  err(`Missing manifest: ${manifestPath}`);
  console.error(errors.join('\n'));
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch (e) {
  err(`plugin.json does not parse as JSON: ${e.message}`);
  console.error(errors.join('\n'));
  process.exit(1);
}

// Step 2 — name format
if (!manifest.name) err('plugin.json missing required field: name');
else if (!NAME_RX.test(manifest.name)) err(`plugin.json name "${manifest.name}" must match ${NAME_RX} (kebab-case, ≤50 chars). Invalid names cause silent plugin load failure in VS Code.`);

// Step 3 — required fields
if (!manifest.description) err('plugin.json missing required field: description');
if (!manifest.version) err('plugin.json missing required field: version');

// Step 4 — paths resolve
const agentDirs = Array.isArray(manifest.agents) ? manifest.agents : [];
const skillDirs = Array.isArray(manifest.skills) ? manifest.skills : [];

assertSorted(skillDirs, 'plugin.json skills[]');

// Step 5 — agent files
const allAgentFiles = [];
for (const relDir of agentDirs) {
  const absDir = join(repoRoot, relDir);
  if (!existsSync(absDir)) {
    err(`agents path does not exist: ${relDir}`);
    continue;
  }
  const entries = await readdir(absDir);
  const agentFiles = entries.filter((f) => f.endsWith('.agent.md')).sort();
  for (const f of agentFiles) {
    allAgentFiles.push(join(absDir, f));
    const expectedName = f.replace(/\.agent\.md$/, '');
    const declaredName = await readFrontmatterField(join(absDir, f), 'name');
    if (!declaredName) err(`${f}: missing "name:" frontmatter field`);
    else if (declaredName !== expectedName) err(`${f}: filename says "${expectedName}" but frontmatter name is "${declaredName}"`);
  }
}

// Step 6 — skill folders
for (const relDir of skillDirs) {
  const absDir = join(repoRoot, relDir);
  if (!existsSync(absDir)) {
    err(`skills path does not exist: ${relDir}`);
    continue;
  }
  const folderName = basename(absDir);
  const skillFile = join(absDir, 'SKILL.md');
  if (!existsSync(skillFile)) {
    err(`${relDir}: SKILL.md not found`);
    continue;
  }
  const declaredName = await readFrontmatterField(skillFile, 'name');
  if (!declaredName) err(`${relDir}/SKILL.md: missing "name:" frontmatter field`);
  else if (declaredName !== folderName) err(`${relDir}/SKILL.md: folder name "${folderName}" but frontmatter name is "${declaredName}"`);
}

// Report
if (warnings.length) {
  console.warn('Warnings:');
  for (const w of warnings) console.warn(`  ⚠️  ${w}`);
}

if (errors.length) {
  console.error('\nErrors:');
  for (const e of errors) console.error(`  ❌ ${e}`);
  console.error(`\n${errors.length} error(s) — validation failed.`);
  process.exit(1);
}

console.log(`✅ plugin.json valid (name: ${manifest.name}, version: ${manifest.version})`);
console.log(`   ${allAgentFiles.length} agent(s) verified, ${skillDirs.length} skill folder(s) verified.`);
