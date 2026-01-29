#!/usr/bin/env node

const { Octokit } = require('octokit');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const sources = require('./sources.json');

async function searchGitHub(query, type) {
  console.log(`Searching: ${query}`);

  try {
    const results = await octokit.rest.search.code({
      q: query,
      per_page: 30
    });

    console.log(`  Found ${results.data.total_count} results`);
    return results.data.items;
  } catch (e) {
    console.error(`  Error: ${e.message}`);
    return [];
  }
}

async function getFileContent(owner, repo, path) {
  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path
    });

    if (response.data.content) {
      return Buffer.from(response.data.content, 'base64').toString('utf8');
    }
    return null;
  } catch (e) {
    return null;
  }
}

function generateMetadata(item, type, content) {
  const name = path.basename(path.dirname(item.path)) || item.name.replace('.md', '');

  return {
    name: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: `Scraped from ${item.repository.full_name}`,
    version: '1.0.0',
    author: {
      name: item.repository.owner.login,
      github: item.repository.owner.login
    },
    category: type === 'claude-md' ? 'by-project-type' : 'development',
    tags: [type, 'scraped'],
    source: {
      type: 'scraped',
      url: item.html_url,
      license: 'Unknown'
    },
    compatibility: {
      'claude-code-version': '>=1.0.0',
      platforms: ['windows', 'macos', 'linux']
    },
    created: new Date().toISOString().split('T')[0],
    updated: new Date().toISOString().split('T')[0]
  };
}

async function main() {
  console.log('Claude Code Resource Scraper');
  console.log('='.repeat(50) + '\n');

  const newResources = [];
  const specificSource = process.env.SCRAPE_SOURCE;

  // Search GitHub code
  for (const search of sources.github.searches) {
    if (specificSource && !search.query.includes(specificSource)) continue;

    const items = await searchGitHub(search.query, search.type);

    for (const item of items) {
      // Skip excluded repos
      if (sources.exclude.repos.includes(item.repository.full_name)) continue;
      if (sources.exclude.users.includes(item.repository.owner.login)) continue;

      console.log(`  Processing: ${item.repository.full_name}/${item.path}`);

      const content = await getFileContent(
        item.repository.owner.login,
        item.repository.name,
        item.path
      );

      if (content) {
        newResources.push({
          type: search.type,
          source: item,
          content,
          metadata: generateMetadata(item, search.type, content)
        });
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\nFound ${newResources.length} potential resources`);

  // Save for review (in actual workflow, this would create files in the right directories)
  const outputPath = path.join(__dirname, '..', '..', 'catalog', 'scraped-pending.json');
  fs.writeFileSync(outputPath, JSON.stringify(newResources, null, 2));

  console.log(`\nPending resources saved to: catalog/scraped-pending.json`);
  console.log('Review and approve these resources before adding to the catalog.');
}

main().catch(console.error);
