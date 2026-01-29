# Conventional Commits Skill

Generate well-formatted conventional commit messages from staged changes.

## Instructions

When asked to commit changes or when the user runs `/commit`:

1. **Analyze staged changes** using `git diff --staged`
2. **Identify the type** of change:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation only
   - `style`: Formatting, no code change
   - `refactor`: Code restructuring
   - `test`: Adding/updating tests
   - `chore`: Maintenance tasks
3. **Determine the scope** (optional): The part of codebase affected
4. **Write the message** following this format:
   ```
   <type>(<scope>): <short description>

   <body - what and why, not how>

   <footer - breaking changes, issue refs>
   ```

## Examples

**Simple feature:**
```
feat(auth): add password reset functionality
```

**Bug fix with body:**
```
fix(api): handle null response from external service

The weather API occasionally returns null during maintenance windows.
Added defensive check to prevent crash and return cached data instead.
```

**Breaking change:**
```
feat(db)!: migrate from MySQL to PostgreSQL

BREAKING CHANGE: Database connection strings must be updated.
See migration guide in docs/migration-v2.md
```

## Rules

- Keep the first line under 72 characters
- Use imperative mood ("add" not "added")
- Don't end with a period
- Reference issues when applicable
- Add `!` after type for breaking changes
