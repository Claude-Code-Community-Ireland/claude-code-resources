const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const data = require('../catalog/scraped-pending.json');

// Select diverse high-quality resources
const selected = [
  'snowplow/snowplow-php-tracker',      // PHP
  'comphy-lab/MultiRheoFlow',           // Scientific computing
  'exiao/chatkit-link',                 // AI/chatbot
  'aguileraz/crowbar-mobile',           // React Native
  'piwi3910/dns-go',                    // Go
  'martink-rsa/quickstarter-1-monorepo-nextjs-supabase-with-sanity-blog', // Next.js/Supabase
  'matthewfallshaw/nixpkgs',            // Nix
  'littlebee/daphbot-due',              // Robotics
];

const categoryMap = {
  'snowplow/snowplow-php-tracker': { cat: 'by-language', subcat: 'php', name: 'php-analytics-tracker' },
  'comphy-lab/MultiRheoFlow': { cat: 'by-project-type', subcat: 'scientific', name: 'scientific-computing' },
  'exiao/chatkit-link': { cat: 'by-project-type', subcat: 'ai-chatbot', name: 'ai-chatbot-app' },
  'aguileraz/crowbar-mobile': { cat: 'by-framework', subcat: 'react-native', name: 'react-native-marketplace' },
  'piwi3910/dns-go': { cat: 'by-language', subcat: 'go', name: 'go-dns-server' },
  'martink-rsa/quickstarter-1-monorepo-nextjs-supabase-with-sanity-blog': { cat: 'by-framework', subcat: 'nextjs-supabase', name: 'nextjs-supabase-sanity' },
  'matthewfallshaw/nixpkgs': { cat: 'by-project-type', subcat: 'devops', name: 'nix-user-config' },
  'littlebee/daphbot-due': { cat: 'by-project-type', subcat: 'robotics', name: 'robotics-bot' },
};

for (const repoName of selected) {
  const resource = data.find(d => d.source.repository.full_name === repoName);
  if (!resource) {
    console.log('NOT FOUND: ' + repoName);
    continue;
  }

  const mapping = categoryMap[repoName];
  const dirPath = path.join(__dirname, '..', 'claude-md', mapping.cat, mapping.subcat, mapping.name);

  // Create directory
  fs.mkdirSync(dirPath, { recursive: true });

  // Write CLAUDE.md
  fs.writeFileSync(path.join(dirPath, 'CLAUDE.md'), resource.content);

  // Create metadata
  const metadata = {
    name: mapping.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: resource.source.repository.description || `CLAUDE.md from ${repoName}`,
    version: '1.0.0',
    author: {
      name: resource.source.repository.owner.login,
      github: resource.source.repository.owner.login
    },
    category: mapping.cat,
    tags: [mapping.subcat, 'scraped', 'claude-md'],
    source: {
      type: 'scraped',
      url: resource.source.html_url,
      license: 'Unknown'
    },
    compatibility: {
      'claude-code-version': '>=1.0.0',
      platforms: ['windows', 'macos', 'linux']
    },
    created: new Date().toISOString().split('T')[0],
    updated: new Date().toISOString().split('T')[0]
  };

  fs.writeFileSync(path.join(dirPath, 'metadata.yaml'), yaml.dump(metadata));

  console.log('ADDED: ' + repoName + ' -> claude-md/' + mapping.cat + '/' + mapping.subcat + '/' + mapping.name);
}

console.log('\nDone! Run build-catalog.js to update the catalog.');
