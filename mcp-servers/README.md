# MCP Servers

Model Context Protocol (MCP) server configurations for extending Claude Code capabilities.

## What is MCP?

MCP allows Claude Code to connect to external tools and data sources through a standardized protocol.

## Using MCP Configs

Copy configurations to your Claude settings:

```bash
cp mcp-servers/configs/database-connector/config.json ~/.claude/mcp/
```

## Structure

```
config-name/
├── config.json       # MCP server configuration
├── README.md         # Setup and usage guide
└── metadata.yaml     # Author, tags, compatibility info
```

## Contributing

1. Create a folder in configs/
2. Add your MCP configuration
3. Document setup steps in README.md
4. Include metadata.yaml
5. Submit a PR

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
