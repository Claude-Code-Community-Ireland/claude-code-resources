# PRDs (Product Requirement Documents)

Templates and examples for product requirement documents to use with Claude Code.

## Categories

| Category | Description |
|----------|-------------|
| [templates](./templates) | Reusable PRD templates |
| [examples](./examples) | Real-world PRD examples |

## Using PRD Templates

```bash
cp prds/templates/feature-prd/template.md ./docs/my-feature-prd.md
```

## PRD Structure

```
prd-name/
├── template.md       # The PRD template
├── README.md         # How to use this template
└── metadata.yaml     # Author, tags, compatibility info
```

## What Makes a Good PRD for Claude

- Clear problem statement
- Specific acceptance criteria
- Technical constraints
- Out of scope items
- Success metrics

## Creating a PRD Template

1. Create a folder in templates/ or examples/
2. Write your PRD with placeholder sections
3. Document how to customize in README.md
4. Add metadata.yaml
5. Submit a PR

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
