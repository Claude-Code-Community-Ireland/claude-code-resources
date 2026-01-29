# Hooks

Pre and post execution hook examples for Claude Code automation.

## What are Hooks?

Hooks are shell commands that execute before or after Claude Code actions, enabling custom automation workflows.

## Using Hooks

Copy hook examples to your Claude settings:

```bash
cp hooks/examples/pre-commit-lint/hook.sh ~/.claude/hooks/
```

## Structure

```
hook-name/
├── hook.sh           # The hook script
├── README.md         # Setup and usage guide
└── metadata.yaml     # Author, tags, compatibility info
```

## Hook Types

- **Pre-hooks**: Run before an action
- **Post-hooks**: Run after an action

## Contributing

1. Create a folder in examples/
2. Add your hook script
3. Document setup and trigger conditions
4. Include metadata.yaml
5. Submit a PR

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
