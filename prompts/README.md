# Prompts

System prompts and task-specific prompt templates for Claude Code.

## Categories

| Category | Description |
|----------|-------------|
| [system-prompts](./system-prompts) | Base behavior and personality prompts |
| [task-prompts](./task-prompts) | Prompts for specific tasks |

## Using Prompts

Reference prompts in your workflows or copy them directly:

```bash
cp prompts/task-prompts/code-review/prompt.md ./
```

## Structure

```
prompt-name/
├── prompt.md         # The prompt template
├── README.md         # Usage guide and examples
└── metadata.yaml     # Author, tags, compatibility info
```

## Writing Effective Prompts

- Be specific about desired output
- Include examples when helpful
- Define constraints clearly
- Consider edge cases

## Contributing

1. Create a folder in the appropriate category
2. Write your prompt with clear structure
3. Add usage examples in README.md
4. Include metadata.yaml
5. Submit a PR

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
