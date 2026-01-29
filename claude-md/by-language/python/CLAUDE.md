# Python Project Instructions

## Project Context

<!-- Describe your project here -->
This is a Python project using [describe your stack/framework].

## Code Style

- Follow PEP 8 style guidelines
- Use type hints for function signatures
- Maximum line length: 88 characters (Black default)
- Use `snake_case` for variables and functions
- Use `PascalCase` for classes
- Use `SCREAMING_SNAKE_CASE` for constants

## Formatting & Linting

```bash
# Format code
black .
isort .

# Lint
ruff check .
mypy .
```

## Testing

- Use pytest for all tests
- Tests go in `tests/` directory mirroring `src/` structure
- Aim for >80% coverage on new code
- Use fixtures for common test setup

```bash
# Run tests
pytest

# With coverage
pytest --cov=src
```

## Dependencies

- Use `pyproject.toml` for dependency management
- Pin exact versions in production
- Use virtual environments (venv or poetry)

## Common Patterns

### Error Handling
```python
try:
    result = risky_operation()
except SpecificError as e:
    logger.error(f"Operation failed: {e}")
    raise
```

### Logging
```python
import logging
logger = logging.getLogger(__name__)
```

## File Structure

```
project/
├── src/
│   └── package_name/
├── tests/
├── docs/
├── pyproject.toml
└── README.md
```

## Git Workflow

- Create feature branches from `main`
- Use conventional commits
- Squash merge to main

## Do NOT

- Use `print()` for logging in production code
- Commit `.env` files or secrets
- Use `*` imports
- Ignore type errors
