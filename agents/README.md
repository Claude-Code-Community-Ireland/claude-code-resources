# Agents

Custom agent configurations for specialized Claude Code workflows.

## Categories

| Category | Description |
|----------|-------------|
| [research](./research) | Information gathering and analysis |
| [coding](./coding) | Code-focused agents (review, refactor, etc.) |
| [analysis](./analysis) | Data and code analysis agents |
| [automation](./automation) | Task automation agents |

## Using Agents

Copy agent configurations to your Claude settings:

```bash
cp agents/coding/code-reviewer/agent.yaml ~/.claude/agents/
```

## Agent Structure

```
agent-name/
├── agent.yaml        # Agent configuration
├── README.md         # Usage documentation
└── metadata.yaml     # Author, tags, compatibility info
```

## Creating an Agent

1. Create a folder in the appropriate category
2. Define your agent in `agent.yaml`
3. Document usage in `README.md`
4. Add `metadata.yaml`
5. Submit a PR

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
