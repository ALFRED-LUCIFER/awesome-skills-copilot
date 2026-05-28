#!/usr/bin/env node
// Emits a marketplace.json next to plugin.json. Adapted from awesome-copilot/eng/generate-marketplace.mjs
// but trimmed for the single-plugin case - Org hosts one plugin here today, but the script keeps
// the awesome-copilot shape so additional plugins can be added under a future plugins/ subtree.

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const manifestPath = join(repoRoot, '.github/plugin/plugin.json');
const marketplacePath = join(repoRoot, '.github/plugin/marketplace.json');

if (!existsSync(manifestPath)) {
  console.error(`Missing ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

const marketplace = {
  name: 'private-copilot-marketplace',
  metadata: {
    description: 'Copilot Agent System private Copilot plugin registry',
    version: '1.0.0',
    pluginsDir: '.'
  },
  owner: manifest.author ?? { name: 'Copilot Agent System Development' },
  plugins: [
    {
      name: manifest.name,
      source: '.',
      description: manifest.description,
      version: manifest.version
    }
  ]
};

await writeFile(marketplacePath, JSON.stringify(marketplace, null, 2) + '\n', 'utf8');
console.log(`OK: wrote ${marketplacePath} (1 plugin: ${manifest.name}@${manifest.version})`);
