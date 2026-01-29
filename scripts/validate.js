#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Load schema
const schemaPath = path.join(__dirname, '..', 'catalog', 'schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schema);

// Directories to scan for resources
const resourceDirs = [
  'skills',
  'agents',
  'claude-md',
  'prds',
  'mcp-servers',
  'hooks',
  'prompts',
  'workflows'
];

let errors = [];
let validated = 0;

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

function validateMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(content);

    const valid = validate(data);

    if (!valid) {
      errors.push({
        file: filePath,
        errors: validate.errors.map(e => `${e.instancePath} ${e.message}`)
      });
      return false;
    }

    validated++;
    return true;
  } catch (e) {
    errors.push({
      file: filePath,
      errors: [`Parse error: ${e.message}`]
    });
    return false;
  }
}

// Main validation
console.log('Validating resource metadata files...\n');

for (const dir of resourceDirs) {
  const dirPath = path.join(__dirname, '..', dir);
  const metadataFiles = findMetadataFiles(dirPath);

  for (const file of metadataFiles) {
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    process.stdout.write(`Checking ${relativePath}... `);

    if (validateMetadata(file)) {
      console.log('✓');
    } else {
      console.log('✗');
    }
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Validated: ${validated} files`);
console.log(`Errors: ${errors.length} files`);

if (errors.length > 0) {
  console.log('\nValidation Errors:');
  for (const err of errors) {
    console.log(`\n${err.file}:`);
    for (const msg of err.errors) {
      console.log(`  - ${msg}`);
    }
  }
  process.exit(1);
}

console.log('\n✓ All metadata files are valid!');
