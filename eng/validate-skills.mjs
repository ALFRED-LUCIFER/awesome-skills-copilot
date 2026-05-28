#!/usr/bin/env node
// Validates every skills/<name>/SKILL.md frontmatter follows the project standard.
// Adapted from github/awesome-copilot/eng/validate-skills.mjs.
//
// Checks for each skill folder:
//   - SKILL.md exists.
//   - frontmatter has name: matching folder name.
//   - frontmatter has description: (non-empty).
//   - name matches kebab-case regex.

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const skillsDir = join(repoRoot, 'skills');

const NAME_RX = /^[a-z][a-z0-9-]{0,49}$/;

async function readFrontmatterFields(filePath) {
  const text = await readFile(filePath, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const block = match[1];
  const out = {};
  for (const line of block.split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return out;
}

if (!existsSync(skillsDir)) {
  console.error(`skills/ directory not found at ${skillsDir}`);
  process.exit(1);
}

const errors = [];
const entries = await readdir(skillsDir, { withFileTypes: true });
const skillFolders = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();

for (const folder of skillFolders) {
  const skillFile = join(skillsDir, folder, 'SKILL.md');
  if (!existsSync(skillFile)) {
    errors.push(`${folder}/: missing SKILL.md`);
    continue;
  }
  const fm = await readFrontmatterFields(skillFile);
  if (!fm) {
    errors.push(`${folder}/SKILL.md: missing frontmatter block`);
    continue;
  }
  if (!fm.name) errors.push(`${folder}/SKILL.md: missing name:`);
  else if (fm.name !== folder) errors.push(`${folder}/SKILL.md: folder name "${folder}" but frontmatter name "${fm.name}"`);
  else if (!NAME_RX.test(fm.name)) errors.push(`${folder}/SKILL.md: name "${fm.name}" must match ${NAME_RX}`);
  if (!fm.description) errors.push(`${folder}/SKILL.md: missing description:`);
}

if (errors.length) {
  console.error('Skill validation errors:');
  for (const e of errors) console.error(`  - ${e}`);
  console.error(`\n${errors.length} error(s) - skill validation failed.`);
  process.exit(1);
}

console.log(`OK: ${skillFolders.length} skill(s) valid: ${skillFolders.join(', ')}`);
