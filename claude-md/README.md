# CLAUDE.md Files

Project instruction files that customize Claude Code behavior for specific projects.

## Categories

| Category | Description |
|----------|-------------|
| [by-language](./by-language) | Python, JavaScript, Rust, Go, etc. |
| [by-framework](./by-framework) | React, Django, Rails, Next.js, etc. |
| [by-role](./by-role) | Frontend, Backend, DevOps, Full-stack |
| [by-project-type](./by-project-type) | SaaS, CLI, Library, API, etc. |

## Using CLAUDE.md Files

Copy a template to your project root and customize:

```bash
cp claude-md/by-language/python/CLAUDE.md ./CLAUDE.md
# Edit to match your project
```

## CLAUDE.md Structure

Each template folder contains:

```
template-name/
├── CLAUDE.md         # The template file
├── README.md         # Usage notes and customization guide
└── metadata.yaml     # Author, tags, compatibility info
```

## What to Include in CLAUDE.md

- Project context and goals
- Code style preferences
- Testing requirements
- File/folder conventions
- Common tasks and workflows
- Sensitive areas to be careful with

## Creating a Template

1. Create a folder in the appropriate category
2. Write your `CLAUDE.md` template
3. Add customization notes in `README.md`
4. Include `metadata.yaml`
5. Submit a PR

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
