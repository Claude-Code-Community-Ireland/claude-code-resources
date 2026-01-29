# Contributing to Claude Code Community Ireland Resources

Thank you for your interest in contributing! This guide will help you add skills, agents, CLAUDE.md files, and other resources to our collection.

## Ways to Contribute

### 1. Submit a New Resource

The easiest way to contribute:

1. **Fork** this repository
2. **Create** your resource in the appropriate directory
3. **Add** a `metadata.yaml` file (required)
4. **Submit** a pull request

### 2. Improve Existing Resources

- Fix bugs or typos
- Improve documentation
- Update outdated resources
- Add missing metadata

### 3. Suggest External Resources

Know a great Claude Code resource elsewhere? [Open an issue](../../issues/new?template=suggest-resource.yml) to suggest it for inclusion.

## Directory Structure

Place your resource in the correct category:

```
skills/
├── development/     # Git, testing, debugging, etc.
├── productivity/    # Documentation, organization, etc.
├── devops/          # CI/CD, deployment, infrastructure
├── data/            # Data processing, analysis, etc.
└── creative/        # Writing, design, content creation

agents/
├── research/        # Information gathering agents
├── coding/          # Code-focused agents
├── analysis/        # Data and code analysis
└── automation/      # Task automation agents

claude-md/
├── by-language/     # Python, JavaScript, Rust, etc.
├── by-framework/    # React, Django, Rails, etc.
├── by-role/         # Frontend, Backend, DevOps, etc.
└── by-project-type/ # SaaS, CLI, Library, etc.

prds/
├── templates/       # Reusable PRD templates
└── examples/        # Real-world PRD examples

mcp-servers/configs/ # MCP server configurations
hooks/examples/      # Pre/post hook examples
prompts/
├── system-prompts/  # System prompt templates
└── task-prompts/    # Task-specific prompts
workflows/examples/  # Multi-step workflow definitions
```

## Resource Requirements

### Required: metadata.yaml

Every resource MUST include a `metadata.yaml` file:

```yaml
name: "Your Resource Name"
description: "Clear, concise description of what this resource does"
version: "1.0.0"

author:
  name: "Your Name"
  github: "your-github-username"

category: "development"  # Must match parent directory
tags: ["relevant", "tags", "here"]

source:
  type: "original"       # "original", "scraped", or "adapted"
  url: ""                # If scraped/adapted, include source URL
  license: "MIT"         # License of the resource

compatibility:
  claude-code-version: ">=1.0.0"
  platforms: ["windows", "macos", "linux"]

created: "2025-01-29"
updated: "2025-01-29"
```

### File Naming

- Use lowercase with hyphens: `git-commit-helper/`
- Be descriptive but concise
- Avoid special characters

### Content Guidelines

- **Skills**: Include clear instructions and examples
- **CLAUDE.md**: Follow the standard format, include placeholders
- **Agents**: Document capabilities and use cases
- **PRDs**: Include section headers and guidance

## Pull Request Process

1. **Create a branch** from `main`
2. **Add your resource** with metadata
3. **Test locally** if applicable
4. **Submit PR** with clear description
5. **Wait for review** from moderators

### PR Checklist

- [ ] Resource is in correct directory
- [ ] `metadata.yaml` is complete and valid
- [ ] No sensitive data or secrets included
- [ ] License is specified and compatible
- [ ] Description is clear and accurate

## Quality Standards

We review for:

- **Usefulness**: Does it solve a real problem?
- **Quality**: Is it well-written and documented?
- **Originality**: Is it unique or significantly improved?
- **Safety**: No malicious code or security issues
- **License**: Compatible with MIT or clearly specified

## Scraped/Adapted Resources

If you're adding a resource from another source:

1. **Verify license** allows redistribution
2. **Credit the original** in metadata.yaml
3. **Note any modifications** you made
4. **Link to the source**

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Questions?

- Open a [Discussion](../../discussions) for questions
- Check existing [Issues](../../issues) for known problems
- Join our community chat (coming soon)

## Recognition

Contributors are recognized in:
- Resource metadata (author field)
- GitHub contributors list
- Community highlights (exceptional contributions)

---

Thank you for helping grow the Claude Code community!
