const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PLUGIN_NAME = 'vibeworks-library';
const CLAUDE_DIR = path.join(require('os').homedir(), '.claude');
const PLUGINS_DIR = path.join(CLAUDE_DIR, 'plugins');
const INSTALL_DIR = path.join(PLUGINS_DIR, PLUGIN_NAME);

// The plugin source is in the parent repo's plugins/ directory
// When published to npm, we include a copy at the package root
function getSourceDir() {
  // Check if running from the repo (development)
  const repoSource = path.resolve(__dirname, '../../plugins/vibeworks-library');
  if (fs.existsSync(repoSource)) {
    return repoSource;
  }
  // Check if bundled with npm package
  const npmSource = path.resolve(__dirname, '../plugins/vibeworks-library');
  if (fs.existsSync(npmSource)) {
    return npmSource;
  }
  throw new Error(
    'Plugin source not found. If running from npm, ensure the package was built correctly.\n' +
    'If running from the repo, ensure plugins/vibeworks-library/ exists.'
  );
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function countFiles(dir, pattern) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(fullPath, pattern);
    } else if (entry.name.match(pattern)) {
      count++;
    }
  }
  return count;
}

async function install() {
  console.log(`Installing ${PLUGIN_NAME}...`);
  console.log('');

  const source = getSourceDir();

  // Ensure .claude/plugins/ exists
  fs.mkdirSync(PLUGINS_DIR, { recursive: true });

  // Remove existing installation if present
  if (fs.existsSync(INSTALL_DIR)) {
    console.log('Removing previous installation...');
    fs.rmSync(INSTALL_DIR, { recursive: true, force: true });
  }

  // Copy the plugin
  console.log(`Copying plugin to ${INSTALL_DIR}...`);
  copyDirSync(source, INSTALL_DIR);

  // Make hook scripts executable
  const hooksDir = path.join(INSTALL_DIR, 'hooks');
  if (fs.existsSync(hooksDir)) {
    const hookFiles = fs.readdirSync(hooksDir).filter(f => f.endsWith('.sh'));
    for (const hookFile of hookFiles) {
      fs.chmodSync(path.join(hooksDir, hookFile), 0o755);
    }
  }

  // Initialize a git repo in the installed directory (Claude Code requires this)
  try {
    execSync('git init', { cwd: INSTALL_DIR, stdio: 'ignore' });
    execSync('git add -A', { cwd: INSTALL_DIR, stdio: 'ignore' });
    execSync('git commit -m "Initial install of vibeworks-library" --allow-empty', {
      cwd: INSTALL_DIR,
      stdio: 'ignore',
    });
  } catch {
    // Git init is best-effort — plugin works without it in most cases
  }

  // Count installed components
  const skillCount = countFiles(path.join(INSTALL_DIR, 'skills'), /SKILL\.md$/i);
  const agentCount = countFiles(path.join(INSTALL_DIR, 'agents'), /\.md$/);
  const commandCount = countFiles(path.join(INSTALL_DIR, 'commands'), /\.md$/);

  console.log('');
  console.log(`Installed ${PLUGIN_NAME} successfully!`);
  console.log('');
  console.log(`  Skills:   ${skillCount}`);
  console.log(`  Agents:   ${agentCount}`);
  console.log(`  Commands: ${commandCount}`);
  console.log('');
  console.log('Restart Claude Code to load the plugin.');
  console.log('');
  console.log('Alternatively, install via the native marketplace:');
  console.log('  /plugin marketplace add vibeworks/vibeworks-library');
  console.log('  /plugin install vibeworks-library');
}

async function uninstall() {
  if (!fs.existsSync(INSTALL_DIR)) {
    console.log(`${PLUGIN_NAME} is not installed.`);
    return;
  }

  console.log(`Removing ${PLUGIN_NAME}...`);
  fs.rmSync(INSTALL_DIR, { recursive: true, force: true });
  console.log('');
  console.log(`${PLUGIN_NAME} has been uninstalled.`);
  console.log('Restart Claude Code to apply changes.');
}

async function list() {
  if (!fs.existsSync(INSTALL_DIR)) {
    console.log(`${PLUGIN_NAME} is not installed.`);
    console.log('');
    console.log('Install with: npx vibeworks-library install');
    return;
  }

  const skillsDir = path.join(INSTALL_DIR, 'skills');
  const agentsDir = path.join(INSTALL_DIR, 'agents');
  const commandsDir = path.join(INSTALL_DIR, 'commands');

  console.log(`${PLUGIN_NAME} — installed at ${INSTALL_DIR}`);
  console.log('');

  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort();
    console.log(`Skills (${skills.length}):`);
    skills.forEach(s => console.log(`  - ${s}`));
    console.log('');
  }

  if (fs.existsSync(agentsDir)) {
    const agents = fs.readdirSync(agentsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''))
      .sort();
    console.log(`Agents (${agents.length}):`);
    agents.forEach(a => console.log(`  - ${a}`));
    console.log('');
  }

  if (fs.existsSync(commandsDir)) {
    const commands = fs.readdirSync(commandsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''))
      .sort();
    console.log(`Commands (${commands.length}):`);
    commands.forEach(c => console.log(`  - /${c}`));
  }
}

function printHelp() {
  console.log('vibeworks-library — Developer workflow toolkit for Claude Code');
  console.log('');
  console.log('Usage:');
  console.log('  npx vibeworks-library <command>');
  console.log('');
  console.log('Commands:');
  console.log('  install     Install the plugin to ~/.claude/plugins/');
  console.log('  uninstall   Remove the plugin');
  console.log('  list        Show installed skills, agents, and commands');
  console.log('  help        Show this help message');
  console.log('');
  console.log('Alternative installation (native Claude Code):');
  console.log('  /plugin marketplace add vibeworks/vibeworks-library');
  console.log('  /plugin install vibeworks-library');
}

module.exports = { install, uninstall, list, printHelp };
