#!/usr/bin/env node

const { install, uninstall, list, printHelp } = require('../lib/installer');

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'install':
      await install();
      break;
    case 'uninstall':
      await uninstall();
      break;
    case 'list':
      await list();
      break;
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;
    default:
      if (command) {
        console.error(`Unknown command: ${command}`);
        console.error('');
      }
      printHelp();
      process.exit(command ? 1 : 0);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
