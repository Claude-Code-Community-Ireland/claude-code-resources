#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const resourceDirs = [
  { dir: 'skills', type: 'skill' },
  { dir: 'agents', type: 'agent' },
  { dir: 'claude-md', type: 'claude-md' },
  { dir: 'prds', type: 'prd' },
  { dir: 'mcp-servers', type: 'mcp-server' },
  { dir: 'hooks', type: 'hook' },
  { dir: 'prompts', type: 'prompt' },
  { dir: 'workflows', type: 'workflow' }
];

const catalog = {
  version: '1.0.0',
  generated: new Date().toISOString(),
  stats: {
    total: 0,
    byType: {},
    byCategory: {}
  },
  resources: []
};

function findMetadataFiles(dir) {
  const files = [];

  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);

      if (item.isDirectory()) {
        walk(fullPath);
      } else if (item.name === 'metadata.yaml' || item.name === 'metadata.yml') {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

function getResourcePath(metadataPath) {
  // Get the directory containing the metadata file
  const resourceDir = path.dirname(metadataPath);
  // Get path relative to repo root
  return path.relative(path.join(__dirname, '..'), resourceDir).replace(/\\/g, '/');
}

console.log('Building catalog...\n');

for (const { dir, type } of resourceDirs) {
  const dirPath = path.join(__dirname, '..', dir);
  const metadataFiles = findMetadataFiles(dirPath);

  console.log(`Processing ${dir}/: ${metadataFiles.length} resources`);

  for (const file of metadataFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const metadata = yaml.load(content);

      const resource = {
        id: getResourcePath(file).replace(/\//g, '-'),
        type,
        path: getResourcePath(file),
        ...metadata
      };

      catalog.resources.push(resource);

      // Update stats
      catalog.stats.total++;
      catalog.stats.byType[type] = (catalog.stats.byType[type] || 0) + 1;
      catalog.stats.byCategory[metadata.category] = (catalog.stats.byCategory[metadata.category] || 0) + 1;

    } catch (e) {
      console.error(`  Error processing ${file}: ${e.message}`);
    }
  }
}

// Sort resources by name
catalog.resources.sort((a, b) => a.name.localeCompare(b.name));

// Write catalog
const outputPath = path.join(__dirname, '..', 'catalog', 'catalog.json');
fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2));

console.log(`\n${'='.repeat(50)}`);
console.log(`Catalog built successfully!`);
console.log(`Total resources: ${catalog.stats.total}`);
console.log(`Output: catalog/catalog.json`);
