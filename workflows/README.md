# Workflows

Multi-step workflow definitions for complex Claude Code automation.

## Using Workflows

Copy workflow definitions to your project:

```bash
cp workflows/examples/pr-review-flow/workflow.yaml ./
```

## Structure

```
workflow-name/
├── workflow.yaml     # Workflow definition
├── README.md         # Setup and usage guide
└── metadata.yaml     # Author, tags, compatibility info
```

## Workflow Components

- **Steps**: Sequential actions to perform
- **Conditions**: When to execute each step
- **Inputs**: Required parameters
- **Outputs**: Expected results

## Contributing

1. Create a folder in examples/
2. Define your workflow
3. Document usage in README.md
4. Include metadata.yaml
5. Submit a PR

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
