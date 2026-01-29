const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const AWESOME_SKILLS_PATH = 'C:/Users/kamac/Downloads/awesome-skills';
const REPO_PATH = path.join(__dirname, '..');

// Blocked categories (security/hacking related)
const BLOCKED_KEYWORDS = [
  'attack', 'exploit', 'hack', 'malware', 'phishing', 'injection',
  'penetration', 'vulnerability', 'reverse-engineer', 'crack',
  'blockchain', 'crypto', 'web3', 'solana', 'ethereum', 'defi', 'nft'
];

// ============ SKILLS IMPORT ============
async function importSkills() {
  console.log('\n=== IMPORTING SKILLS ===\n');

  const indexPath = path.join(AWESOME_SKILLS_PATH, 'skills_index.json');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

  let imported = 0;
  let skipped = 0;

  for (const skill of index) {
    // Quality filters
    if (!skill.description || skill.description.length < 30) {
      skipped++;
      continue;
    }

    // Block harmful content
    const text = (skill.name + ' ' + skill.description + ' ' + skill.category).toLowerCase();
    if (BLOCKED_KEYWORDS.some(kw => text.includes(kw))) {
      skipped++;
      continue;
    }

    // Get skill file path
    const skillDir = path.join(AWESOME_SKILLS_PATH, skill.path);
    const skillFile = path.join(skillDir, 'SKILL.md');

    if (!fs.existsSync(skillFile)) {
      skipped++;
      continue;
    }

    const content = fs.readFileSync(skillFile, 'utf8');
    if (content.length < 200) {
      skipped++;
      continue;
    }

    // Determine category
    let category = skill.category || 'general';
    if (category === 'uncategorized') category = 'general';

    // Create target directory
    const targetDir = path.join(REPO_PATH, 'skills', category, skill.name);
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy skill file
    fs.writeFileSync(path.join(targetDir, 'skill.md'), content);

    // Create metadata
    const metadata = {
      name: skill.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: skill.description.substring(0, 200),
      version: '1.0.0',
      author: {
        name: 'antigravity-awesome-skills',
        github: 'sickn33'
      },
      category: category,
      tags: [category, 'imported', 'skill'],
      source: {
        type: 'scraped',
        url: `https://github.com/sickn33/antigravity-awesome-skills/tree/main/${skill.path}`,
        license: 'Apache-2.0'
      },
      compatibility: {
        'claude-code-version': '>=1.0.0',
        platforms: ['windows', 'macos', 'linux']
      },
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0]
    };

    fs.writeFileSync(path.join(targetDir, 'metadata.yaml'), yaml.dump(metadata));

    imported++;
    if (imported % 20 === 0) console.log(`  Imported ${imported} skills...`);
    if (imported >= 100) break; // Cap at 100
  }

  console.log(`\nSkills: Imported ${imported}, Skipped ${skipped}`);
  return imported;
}

// ============ CLAUDE.MD IMPORT ============
async function importClaudeMd() {
  console.log('\n=== IMPORTING CLAUDE.MD FILES ===\n');

  const scrapedPath = path.join(REPO_PATH, 'catalog', 'scraped-pending.json');
  if (!fs.existsSync(scrapedPath)) {
    console.log('No scraped-pending.json found');
    return 0;
  }

  const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));

  let imported = 0;
  let skipped = 0;

  for (const item of scraped) {
    if (item.type !== 'claude-md') continue;
    if (!item.content || item.content.length < 1000) {
      skipped++;
      continue;
    }

    // Block harmful content
    const repoName = item.source.repository.full_name.toLowerCase();
    const desc = (item.source.repository.description || '').toLowerCase();
    if (BLOCKED_KEYWORDS.some(kw => repoName.includes(kw) || desc.includes(kw))) {
      skipped++;
      continue;
    }

    // Determine category based on content/description
    let category = 'general';
    const text = (item.content + ' ' + desc).toLowerCase();
    if (text.includes('react') || text.includes('vue') || text.includes('angular')) category = 'frontend';
    else if (text.includes('python') || text.includes('django') || text.includes('flask')) category = 'python';
    else if (text.includes('node') || text.includes('express') || text.includes('typescript')) category = 'nodejs';
    else if (text.includes('go ') || text.includes('golang')) category = 'go';
    else if (text.includes('rust')) category = 'rust';
    else if (text.includes('mobile') || text.includes('ios') || text.includes('android')) category = 'mobile';
    else if (text.includes('devops') || text.includes('docker') || text.includes('kubernetes')) category = 'devops';
    else if (text.includes('api') || text.includes('backend')) category = 'backend';

    // Create safe folder name
    const folderName = item.source.repository.name.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50);

    // Create target directory
    const targetDir = path.join(REPO_PATH, 'claude-md', category, folderName);
    fs.mkdirSync(targetDir, { recursive: true });

    // Write CLAUDE.md
    fs.writeFileSync(path.join(targetDir, 'CLAUDE.md'), item.content);

    // Create metadata
    const metadata = {
      name: item.source.repository.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: (item.source.repository.description || `CLAUDE.md from ${item.source.repository.full_name}`).substring(0, 200),
      version: '1.0.0',
      author: {
        name: item.source.repository.owner.login,
        github: item.source.repository.owner.login
      },
      category: category,
      tags: [category, 'imported', 'claude-md'],
      source: {
        type: 'scraped',
        url: item.source.html_url,
        license: 'Unknown'
      },
      compatibility: {
        'claude-code-version': '>=1.0.0',
        platforms: ['windows', 'macos', 'linux']
      },
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0]
    };

    fs.writeFileSync(path.join(targetDir, 'metadata.yaml'), yaml.dump(metadata));

    imported++;
    if (imported % 10 === 0) console.log(`  Imported ${imported} CLAUDE.md files...`);
    if (imported >= 80) break; // Cap at 80
  }

  console.log(`\nCLAUDE.md: Imported ${imported}, Skipped ${skipped}`);
  return imported;
}

// ============ AGENTS IMPORT ============
async function importAgents() {
  console.log('\n=== IMPORTING AGENTS ===\n');

  const indexPath = path.join(AWESOME_SKILLS_PATH, 'skills_index.json');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

  // Find agent-related skills
  const agentKeywords = ['agent', 'orchestrat', 'automat', 'workflow', 'pipeline', 'task', 'assistant'];

  let imported = 0;
  let skipped = 0;

  for (const skill of index) {
    const text = (skill.name + ' ' + skill.description).toLowerCase();

    // Only import agent-related skills
    if (!agentKeywords.some(kw => text.includes(kw))) {
      continue;
    }

    // Block harmful content
    if (BLOCKED_KEYWORDS.some(kw => text.includes(kw))) {
      skipped++;
      continue;
    }

    // Get skill file
    const skillDir = path.join(AWESOME_SKILLS_PATH, skill.path);
    const skillFile = path.join(skillDir, 'SKILL.md');

    if (!fs.existsSync(skillFile)) {
      skipped++;
      continue;
    }

    const content = fs.readFileSync(skillFile, 'utf8');
    if (content.length < 200) {
      skipped++;
      continue;
    }

    // Determine category
    let category = 'general';
    if (text.includes('code') || text.includes('develop')) category = 'coding';
    else if (text.includes('research') || text.includes('analy')) category = 'research';
    else if (text.includes('automat') || text.includes('workflow')) category = 'automation';
    else if (text.includes('test')) category = 'testing';
    else if (text.includes('data')) category = 'data';

    // Create target directory
    const targetDir = path.join(REPO_PATH, 'agents', category, skill.name);
    fs.mkdirSync(targetDir, { recursive: true });

    // Write as agent.md (user preference)
    fs.writeFileSync(path.join(targetDir, 'agent.md'), content);

    // Create metadata
    const metadata = {
      name: skill.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: skill.description.substring(0, 200),
      version: '1.0.0',
      author: {
        name: 'antigravity-awesome-skills',
        github: 'sickn33'
      },
      category: category,
      tags: [category, 'agent', 'imported'],
      source: {
        type: 'scraped',
        url: `https://github.com/sickn33/antigravity-awesome-skills/tree/main/${skill.path}`,
        license: 'Apache-2.0'
      },
      compatibility: {
        'claude-code-version': '>=1.0.0',
        platforms: ['windows', 'macos', 'linux']
      },
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0]
    };

    fs.writeFileSync(path.join(targetDir, 'metadata.yaml'), yaml.dump(metadata));

    imported++;
    if (imported % 10 === 0) console.log(`  Imported ${imported} agents...`);
    if (imported >= 60) break; // Cap at 60
  }

  console.log(`\nAgents: Imported ${imported}, Skipped ${skipped}`);
  return imported;
}

// ============ MAIN ============
async function main() {
  console.log('='.repeat(50));
  console.log('MASS IMPORT FROM OPEN SOURCE');
  console.log('='.repeat(50));

  const skills = await importSkills();
  const claudeMd = await importClaudeMd();
  const agents = await importAgents();

  console.log('\n' + '='.repeat(50));
  console.log('IMPORT COMPLETE');
  console.log('='.repeat(50));
  console.log(`Skills:    ${skills}`);
  console.log(`CLAUDE.md: ${claudeMd}`);
  console.log(`Agents:    ${agents}`);
  console.log(`TOTAL:     ${skills + claudeMd + agents}`);
  console.log('\nRun: node scripts/build-catalog.js');
}

main().catch(console.error);
