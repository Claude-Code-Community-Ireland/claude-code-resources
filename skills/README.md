# Skills

Claude Code skills are reusable instruction sets that extend Claude's capabilities for specific tasks.

## Categories

| Category | Description |
|----------|-------------|
| [development](./development) | Git, testing, debugging, code review |
| [productivity](./productivity) | Documentation, organization, planning |
| [devops](./devops) | CI/CD, deployment, infrastructure |
| [data](./data) | Data processing, analysis, transformation |
| [creative](./creative) | Writing, design, content creation |

## Using Skills

### Option 1: Copy to your project

```bash
cp -r skills/development/git-commit-helper ~/.claude/skills/
```

### Option 2: Reference in CLAUDE.md

```markdown
# Skills to use
- Use the git-commit-helper skill for all commits
```

## Skill Structure

Each skill folder contains:

```
skill-name/
├── skill.md          # The skill definition
└── metadata.yaml     # Author, tags, compatibility info
```

## Creating a Skill

1. Create a folder in the appropriate category
2. Write your `skill.md` with clear instructions
3. Add `metadata.yaml` with required fields
4. Submit a PR

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
