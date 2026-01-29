# Claude Code Community Ireland Resources

A community-curated collection of Claude Code skills, agents, CLAUDE.md files, PRDs, prompts, and more.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Community](https://img.shields.io/badge/Community-Ireland-green.svg)](https://github.com/Claude-Code-Community-Ireland)

## What's Inside

| Category | Description | Browse |
|----------|-------------|--------|
| **Skills** | Reusable skill definitions for Claude Code | [/skills](./skills) |
| **Agents** | Custom agent configurations | [/agents](./agents) |
| **CLAUDE.md** | Project instruction files by language/framework | [/claude-md](./claude-md) |
| **PRDs** | Product requirement document templates | [/prds](./prds) |
| **MCP Servers** | Model Context Protocol server configs | [/mcp-servers](./mcp-servers) |
| **Hooks** | Pre/post execution hook examples | [/hooks](./hooks) |
| **Prompts** | System and task prompt collections | [/prompts](./prompts) |
| **Workflows** | Multi-step workflow definitions | [/workflows](./workflows) |

## Quick Start

### Option 1: Clone Everything

```bash
git clone https://github.com/Claude-Code-Community-Ireland/claude-code-resources.git
```

### Option 2: Copy Individual Resources

Browse the categories above and copy what you need directly into your project.

### Option 3: Use the Website

Visit our [searchable catalog](https://claude-code-community-ireland.github.io/claude-code-resources) to find resources with filtering and preview.

## Using Resources

### Skills

Copy a skill folder to your project's `.claude/skills/` directory:

```bash
cp -r skills/development/git-commit-helper ~/.claude/skills/
```

### CLAUDE.md Files

Copy a CLAUDE.md template to your project root:

```bash
cp claude-md/by-language/python/CLAUDE.md ./CLAUDE.md
```

### Agents

Copy agent configurations to your `.claude/` directory:

```bash
cp agents/coding/code-reviewer/agent.yaml ~/.claude/agents/
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick contribution options:**

1. **Submit via Issue** - Use our [resource submission template](.github/ISSUE_TEMPLATE/submit-resource.yml)
2. **Open a PR** - Fork, add your resource with metadata, submit PR
3. **Suggest a Source** - Know a great repo? Open an issue to suggest it

## Resource Metadata

Every resource includes a `metadata.yaml` file with:

```yaml
name: "Resource Name"
description: "What this resource does"
author:
  name: "Your Name"
  github: "yourusername"
category: "development"
tags: ["tag1", "tag2"]
source:
  type: "original"  # or "scraped", "adapted"
  license: "MIT"
```

## Community

- **Discord**: [Join Claude Code Community Ireland](https://discord.gg/QHjX4VYs9J)
- **GitHub Discussions**: Ask questions, share ideas
- **Issues**: Report bugs, request features

## Moderators

Resources are reviewed by community moderators to ensure quality. Want to help moderate? Open an issue!

## License

This repository is licensed under the [MIT License](LICENSE).

Individual resources may have their own licenses specified in their metadata.

---

**Run by [Claude Code Community Ireland](https://github.com/Claude-Code-Community-Ireland)**
