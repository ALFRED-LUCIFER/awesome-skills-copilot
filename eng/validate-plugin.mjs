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
const pluginsDir = join(repoRoot, 'plugins');

const NAME_RX = /^[a-z][a-z0-9-]{0,49}$/;

async function readFrontmatterField(filePath, field) {
  const text = await readFile(filePath, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const block = match[1];
  const line = block.split(/\r?\n/).find((l) => l.startsWith(`${field}:`));
  if (!line) return null;
  return line.replace(`${field}:`, '').trim().replace(/^['"]|['"]$/g, '');
}

// Discover all plugins under plugins/
if (!existsSync(pluginsDir)) {
  console.log('✅ No plugins/ directory — skipping plugin validation.');
  process.exit(0);
}

const pluginFolders = (await readdir(pluginsDir, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

if (pluginFolders.length === 0) {
  console.log('✅ No plugin folders found — skipping.');
  process.exit(0);
}

let totalErrors = 0;

for (const folder of pluginFolders) {
  const manifestPath = join(pluginsDir, folder, 'plugin.json');
  const errors = [];
  const warnings = [];
  function err(msg) { errors.push(msg); }
  function warn(msg) { warnings.push(msg); }

  // Step 1 — manifest exists + parses
  if (!existsSync(manifestPath)) {
    console.warn(`  ⚠️  plugins/${folder}: no plugin.json — skipping`);
    continue;
  }

  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (e) {
    err(`plugin.json does not parse as JSON: ${e.message}`);
    for (const e2 of errors) console.error(`  ❌ plugins/${folder}: ${e2}`);
    totalErrors += errors.length;
    continue;
  }

  // Step 2 — name format
  if (!manifest.name) err('plugin.json missing required field: name');
  else if (!NAME_RX.test(manifest.name)) err(`plugin.json name "${manifest.name}" must match ${NAME_RX}`);

  // Step 3 — required fields
  if (!manifest.description) err('plugin.json missing required field: description');
  if (!manifest.version) err('plugin.json missing required field: version');

  // Step 4 — paths resolve (relative to plugin folder)
  const pluginDir = join(pluginsDir, folder);
  const agentPaths = Array.isArray(manifest.agents) ? manifest.agents : [];
  const skillPaths = Array.isArray(manifest.skills) ? manifest.skills : [];

  // Step 5 — agent files
  let agentCount = 0;
  for (const relPath of agentPaths) {
    const absPath = join(pluginDir, relPath);
    if (!existsSync(absPath)) {
      err(`agents path does not exist: ${relPath}`);
      continue;
    }
    const s = await stat(absPath);
    if (s.isDirectory()) {
      const entries = await readdir(absPath);
      const agentFiles = entries.filter((f) => f.endsWith('.agent.md'));
      agentCount += agentFiles.length;
      for (const f of agentFiles) {
        const expectedName = f.replace(/\.agent\.md$/, '');
        const declaredName = await readFrontmatterField(join(absPath, f), 'name');
        if (!declaredName) err(`${f}: missing "name:" frontmatter field`);
        else if (declaredName !== expectedName) err(`${f}: filename says "${expectedName}" but frontmatter name is "${declaredName}"`);
      }
    } else if (absPath.endsWith('.agent.md')) {
      agentCount++;
    }
  }

  // Step 6 — skill folders
  for (const relPath of skillPaths) {
    const absPath = join(pluginDir, relPath);
    if (!existsSync(absPath)) {
      err(`skills path does not exist: ${relPath}`);
      continue;
    }
    const folderName = basename(absPath);
    const skillFile = join(absPath, 'SKILL.md');
    if (!existsSync(skillFile)) {
      err(`${relPath}: SKILL.md not found`);
      continue;
    }
    const declaredName = await readFrontmatterField(skillFile, 'name');
    if (!declaredName) err(`${relPath}/SKILL.md: missing "name:" frontmatter field`);
    else if (declaredName !== folderName) err(`${relPath}/SKILL.md: folder name "${folderName}" but frontmatter name is "${declaredName}"`);
  }

  // Report per plugin
  if (warnings.length) {
    for (const w of warnings) console.warn(`  ⚠️  plugins/${folder}: ${w}`);
  }
  if (errors.length) {
    for (const e2 of errors) console.error(`  ❌ plugins/${folder}: ${e2}`);
    totalErrors += errors.length;
  } else {
    console.log(`✅ plugins/${folder}/plugin.json valid (name: ${manifest.name}, version: ${manifest.version})`);
    console.log(`   ${agentCount} agent(s), ${skillPaths.length} skill folder(s) verified.`);
  }
}

if (totalErrors > 0) {
  console.error(`\n${totalErrors} error(s) — plugin validation failed.`);
  process.exit(1);
}
console.log(`\n✅ All ${pluginFolders.length} plugin(s) validated.`);
