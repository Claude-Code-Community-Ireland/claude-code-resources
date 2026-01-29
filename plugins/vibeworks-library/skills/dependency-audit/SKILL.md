---
name: dependency-audit
description: Dependency management and auditing — evaluating new dependencies, security vulnerability scanning, update strategies, and license compliance. Use when adding or auditing dependencies.
---

# Dependency Audit

## Evaluating New Dependencies

Before adding any dependency, run through this evaluation checklist. Every "no" answer is a risk that must be explicitly accepted.

### Evaluation Checklist

- [ ] **Maintenance**: Last commit within 6 months? Issues responded to? More than one maintainer?
- [ ] **Adoption**: More than 1,000 weekly downloads (npm) or equivalent? Used by known projects?
- [ ] **Bundle size**: Checked via bundlephobia.com or equivalent? Is tree-shaking supported?
- [ ] **License**: Compatible with your project license? (See license matrix below)
- [ ] **Security**: No open CVEs? Has a security policy? Publishes signed releases?
- [ ] **API surface**: Does it do one thing well, or is it a kitchen-sink package?
- [ ] **Alternatives**: Have you checked if the standard library or an existing dep covers this?
- [ ] **Transitive deps**: How many transitive dependencies does it pull in?

### Quick Evaluation Commands

```bash
# npm — check package info
npm info <package> --json | jq '{name, version, license, homepage, maintainers}'

# Check download stats
npm info <package> --json | jq '.downloads'

# Bundle size (requires bundlephobia API or website)
# Visit: https://bundlephobia.com/package/<package>

# Check for known vulnerabilities before installing
npm audit --dry-run --package-lock-only

# Python — check package metadata
pip show <package>
pip index versions <package>

# Rust — check crate info
cargo info <crate>
```

### Decision Framework

| Factor               | Accept                       | Investigate                    | Reject                        |
|----------------------|------------------------------|--------------------------------|-------------------------------|
| Weekly downloads     | > 50,000                     | 1,000 - 50,000                 | < 1,000                       |
| Last commit          | < 3 months                   | 3 - 12 months                  | > 12 months                   |
| Open issues          | < 50 with triage             | 50 - 200                       | > 200 untriaged               |
| Maintainers          | >= 2                         | 1 active                       | 0 active                      |
| Transitive deps      | < 5                          | 5 - 20                         | > 20                          |
| Bundle size (JS)     | < 10 KB gzipped              | 10 - 50 KB                     | > 50 KB (for a single feature)|
| License              | MIT, Apache-2.0, BSD         | ISC, MPL-2.0                   | GPL, AGPL, SSPL, unlicensed   |

---

## Security Vulnerability Scanning

### npm / Yarn

```bash
# Run audit against known vulnerability databases
npm audit

# Fix automatically where possible
npm audit fix

# Fix with major version bumps (review changes carefully)
npm audit fix --force

# Generate machine-readable report
npm audit --json > audit-report.json

# Yarn equivalent
yarn audit
yarn audit --json
```

### pip (Python)

```bash
# Install safety or pip-audit
pip install pip-audit

# Run audit
pip-audit

# Output in JSON
pip-audit --format json --output audit-report.json

# Check a requirements file without installing
pip-audit -r requirements.txt
```

### Cargo (Rust)

```bash
# Install cargo-audit
cargo install cargo-audit

# Run audit
cargo audit

# Fix where possible
cargo audit fix

# Generate JSON report
cargo audit --json
```

### Go

```bash
# Built-in vulnerability scanning (Go 1.18+)
govulncheck ./...
```

### CI Integration

Run audits on every pull request. Fail the build on critical or high severity findings.

```yaml
# GitHub Actions example
- name: Security audit
  run: |
    npm audit --audit-level=high
    if [ $? -ne 0 ]; then
      echo "::error::Security vulnerabilities found"
      exit 1
    fi
```

---

## Automated Dependency Updates

### Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "America/New_York"
    open-pull-requests-limit: 10
    reviewers:
      - "team-platform"
    labels:
      - "dependencies"
      - "automated"
    # Group minor and patch updates to reduce PR noise
    groups:
      production-deps:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"
      dev-deps:
        dependency-type: "development"
        update-types:
          - "minor"
          - "patch"
    # Ignore major version bumps for specific packages
    ignore:
      - dependency-name: "aws-sdk"
        update-types: ["version-update:semver-major"]

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"

  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Renovate Configuration

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":semanticCommits",
    "group:monorepos",
    "group:recommended"
  ],
  "schedule": ["before 9am on monday"],
  "prConcurrentLimit": 10,
  "labels": ["dependencies", "automated"],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "matchCurrentVersion": "!/^0/",
      "automerge": true,
      "automergeType": "pr",
      "platformAutomerge": true
    },
    {
      "matchUpdateTypes": ["major"],
      "labels": ["dependencies", "breaking-change"],
      "automerge": false
    },
    {
      "matchPackagePatterns": ["eslint", "prettier", "@types/*"],
      "groupName": "linting and types",
      "automerge": true
    },
    {
      "matchDepTypes": ["devDependencies"],
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true
    }
  ],
  "vulnerabilityAlerts": {
    "enabled": true,
    "labels": ["security"],
    "prPriority": 10
  }
}
```

### Update Strategy

| Update Type | Strategy                                | Review Required |
|-------------|------------------------------------------|-----------------|
| Patch       | Auto-merge if tests pass                 | No              |
| Minor       | Auto-merge for stable deps (>= 1.0.0)   | Spot-check      |
| Major       | Manual review, check migration guide     | Yes             |
| Security    | Prioritize, merge within 24-48 hours     | Yes             |

---

## Lock File Hygiene

### Rules

1. **Always commit lock files** (`package-lock.json`, `yarn.lock`, `Pipfile.lock`, `Cargo.lock`, `go.sum`)
2. **Never manually edit lock files** — use the package manager commands
3. **Review lock file diffs** in PRs — large unexplained changes may indicate supply chain issues
4. **Use exact versions in lock files** — never delete and regenerate without reason
5. **One lock file per project** — do not mix npm and yarn in the same project

### Resolving Lock File Conflicts

```bash
# npm — regenerate from package.json
rm package-lock.json
npm install

# Yarn — regenerate
rm yarn.lock
yarn install

# After resolving, verify nothing unexpected changed
git diff package-lock.json | head -100
```

### Integrity Verification

```bash
# npm — verify installed packages match lock file
npm ci  # Clean install from lock file (CI environments)

# Yarn — same concept
yarn install --frozen-lockfile

# pip — verify hashes
pip install --require-hashes -r requirements.txt
```

---

## License Compatibility Matrix

### Common License Compatibility

| Dependency License | MIT Project | Apache-2.0 Project | GPL-3.0 Project | Proprietary Project |
|--------------------|-------------|---------------------|------------------|---------------------|
| MIT                | OK          | OK                  | OK               | OK                  |
| Apache-2.0         | OK          | OK                  | OK (GPL-3+ only) | OK                  |
| BSD-2/3-Clause     | OK          | OK                  | OK               | OK                  |
| ISC                | OK          | OK                  | OK               | OK                  |
| MPL-2.0            | OK          | OK                  | OK               | OK (file-level)     |
| LGPL-2.1/3.0       | OK          | OK                  | OK               | OK (dynamic linking)|
| GPL-2.0            | NO          | NO                  | OK (same version)| NO                  |
| GPL-3.0            | NO          | NO                  | OK               | NO                  |
| AGPL-3.0           | NO          | NO                  | NO (unless AGPL) | NO                  |
| SSPL               | NO          | NO                  | NO               | NO                  |
| Unlicensed         | NO          | NO                  | NO               | NO                  |

### License Scanning

```bash
# npm — check all dependency licenses
npx license-checker --summary
npx license-checker --failOn "GPL-2.0;GPL-3.0;AGPL-3.0"
npx license-checker --production --csv > licenses.csv

# Python
pip install pip-licenses
pip-licenses --format=table
pip-licenses --fail-on="GPL-3.0;AGPL-3.0"

# Rust
cargo install cargo-license
cargo license
```

### License Policy

- Maintain an approved license allow-list in CI
- Flag any new dependency with an unapproved license as a blocking issue
- "Unlicensed" means "all rights reserved" — never use unlicensed code
- When in doubt, consult legal before merging

---

## Vendoring vs Package Management

### When to Vendor

- The dependency is abandoned but you need it
- You need to patch a critical bug upstream has not fixed
- You are building for an air-gapped environment
- The dependency is very small (< 100 lines) and unlikely to change

### When NOT to Vendor

- The dependency is actively maintained
- Security patches are regularly published
- The dependency has its own complex dependency tree
- You would be taking on maintenance burden you cannot sustain

### Vendoring Procedure

1. Copy the source into a `vendor/` or `third_party/` directory
2. Record the original source, version, and license in a `VENDORED.md` file
3. Apply your patches as separate, clearly commented commits
4. Set a calendar reminder to check for upstream updates quarterly

---

## Monorepo Dependency Management

### Hoisting Strategy

```bash
# npm workspaces — hoist shared deps to root
npm install <package> -w packages/shared

# Yarn workspaces — nohoist for packages that need isolation
# package.json
{
  "workspaces": {
    "packages": ["packages/*"],
    "nohoist": ["**/react-native", "**/react-native/**"]
  }
}
```

### Monorepo Rules

1. **Shared dependencies** go in the root `package.json`
2. **Package-specific dependencies** go in that package's `package.json`
3. **Version consistency** — all packages should use the same version of shared deps
4. **Use a tool** like `syncpack` or `manypkg` to enforce version consistency

```bash
# Check for version mismatches across packages
npx syncpack list-mismatches

# Fix version mismatches
npx syncpack fix-mismatches
```

---

## Vulnerability Response Procedure

### Severity Classification

| Severity | CVSS Score | Response Time | Example                              |
|----------|-----------|---------------|--------------------------------------|
| Critical | 9.0-10.0  | 4 hours       | Remote code execution, auth bypass   |
| High     | 7.0-8.9   | 24 hours      | SQL injection, privilege escalation  |
| Medium   | 4.0-6.9   | 1 week        | XSS in admin panel, info disclosure  |
| Low      | 0.1-3.9   | Next sprint   | Minor info leak, DoS requiring auth  |

### Response Steps

1. **Assess**: Determine if your usage of the dependency triggers the vulnerability
2. **Mitigate**: Apply a workaround if a patch is not immediately available
3. **Patch**: Update to a fixed version as soon as one is available
4. **Verify**: Confirm the vulnerability is resolved with scanning tools
5. **Document**: Record the vulnerability, your response, and timeline in an incident log

### Assessment Template

```markdown
## Vulnerability Assessment: CVE-YYYY-XXXXX

**Package**: example-lib
**Installed Version**: 2.3.1
**Fixed Version**: 2.3.2
**Severity**: High (CVSS 8.1)

### Are We Affected?
[ ] We use the affected function/feature
[ ] The vulnerable code path is reachable in our application
[ ] External input reaches the vulnerable code

### Mitigation
- Describe workaround if patch is not yet available

### Action
- [ ] Update to fixed version
- [ ] Run tests
- [ ] Deploy to staging and verify
- [ ] Deploy to production
- [ ] Close vulnerability ticket
```

---

## Dependency Hygiene Checklist (Periodic Review)

Run this checklist quarterly or when onboarding a new team member.

- [ ] Run `npm audit` / `pip-audit` / `cargo audit` — zero critical or high findings
- [ ] Remove unused dependencies (`npx depcheck`, `pip-extra-reqs`)
- [ ] Verify all lock files are committed and up to date
- [ ] Check for deprecated packages (`npm outdated`)
- [ ] Review license compliance report — no unapproved licenses
- [ ] Confirm Dependabot or Renovate is running and PRs are being merged
- [ ] Review vendored dependencies for upstream updates
- [ ] Verify CI fails on audit findings above your threshold
- [ ] Document any accepted risks with justification and expiration date
