---
name: security-review
description: Security review checklist covering OWASP Top 10, authentication, authorization, input validation, secrets management, and common vulnerability patterns. Reference when reviewing code for security.
---

# Security Review

## OWASP Top 10 (2021)

Use this as a baseline checklist when reviewing any application for security vulnerabilities.

### A01: Broken Access Control

Users acting outside their intended permissions.

```javascript
// VULNERABLE: No authorization check
app.get('/api/users/:id', async (req, res) => {
  const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  res.json(user);
});

// FIXED: Verify the requesting user has permission
app.get('/api/users/:id', authenticate, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  res.json(user);
});
```

### A02: Cryptographic Failures

- Use TLS 1.2+ for all data in transit. Hash passwords with bcrypt (cost 12+) or argon2.
- Never use MD5 or SHA-1 for password hashing. Encrypt data at rest with AES-256-GCM.

### A03: Injection

```python
# VULNERABLE: SQL injection via string concatenation
cursor.execute(f"SELECT * FROM users WHERE name = '{user_input}'")

# FIXED: Parameterized query
cursor.execute("SELECT * FROM users WHERE name = %s", (user_input,))
```

### A04: Insecure Design

- Rate limit authentication endpoints. Use CAPTCHA for public forms.
- Apply least privilege. Threat model before building, not after.

### A05: Security Misconfiguration

- Disable directory listing. Remove default credentials and demo accounts.
- Disable verbose errors in production. Review cloud IAM policies.

### A06: Vulnerable and Outdated Components

```bash
npm audit          # Node.js
pip-audit          # Python
bundle audit       # Ruby
```

### A07: Identification and Authentication Failures

- Enforce strong password policies (length over complexity). Account lockout after repeated failures.
- MFA for sensitive operations. Invalidate sessions on logout and password change.

### A08: Software and Data Integrity Failures

- Verify dependency integrity (lock files, checksums). Sign releases. Protect CI/CD pipelines.

### A09: Security Logging and Monitoring Failures

- Log all authentication events, authorization failures, and input validation failures.
- Ensure logs are tamper-proof and retained.

### A10: Server-Side Request Forgery (SSRF)

Application fetches a URL provided by the user without validation.

```javascript
// VULNERABLE: User controls the URL
app.get('/fetch', async (req, res) => {
  const response = await fetch(req.query.url);
  res.send(await response.text());
});

// FIXED: Allowlist of permitted domains
const ALLOWED_HOSTS = ['api.trusted-service.com'];
app.get('/fetch', async (req, res) => {
  const url = new URL(req.query.url);
  if (!ALLOWED_HOSTS.includes(url.hostname)) {
    return res.status(400).json({ error: 'Domain not allowed' });
  }
  res.send(await (await fetch(url.toString())).text());
});
```

## Authentication Patterns

### Password Hashing

```javascript
// Node.js with bcrypt
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;
const hash = await bcrypt.hash(password, SALT_ROUNDS);          // Hash
const isValid = await bcrypt.compare(candidatePassword, storedHash); // Verify
```

```python
# Python with argon2
from argon2 import PasswordHasher
ph = PasswordHasher(time_cost=3, memory_cost=65536, parallelism=4)
hash = ph.hash(password)           # Hash
ph.verify(hash, candidate_password) # Verify — raises VerifyMismatchError on failure
```

### Session Management

| Practice | Description |
|----------|-------------|
| Regenerate session ID on login | Prevents session fixation attacks |
| Set `HttpOnly` flag on cookies | Prevents JavaScript access to session cookie |
| Set `Secure` flag on cookies | Ensures cookie sent only over HTTPS |
| Set `SameSite=Strict` or `Lax` | Prevents CSRF via cookie |
| Expire sessions after inactivity | Limit window of exposure for stolen sessions |
| Invalidate on logout | Server-side session destruction |

### JWT Best Practices

| Do | Do Not |
|----|--------|
| Use asymmetric signing (RS256, ES256) for distributed systems | Use `none` algorithm |
| Set short expiration (`exp`) — 15 minutes for access tokens | Store sensitive data in JWT payload |
| Validate `iss`, `aud`, `exp`, and `nbf` claims | Use JWT as a session replacement for long-lived sessions |
| Store refresh tokens securely (HttpOnly cookie or server-side) | Store JWTs in localStorage (XSS risk) |
| Rotate signing keys periodically | Accept tokens with missing or invalid signatures |

### Multi-Factor Authentication

- Support TOTP (Time-based One-Time Password) as baseline MFA.
- Offer WebAuthn / passkeys as a phishing-resistant option.
- Provide recovery codes as a backup (store hashed, single-use).
- Require MFA re-verification for sensitive operations (password change, payment).

## Authorization

### RBAC (Role-Based Access Control)

```javascript
// Middleware pattern for RBAC
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage
app.delete('/api/users/:id', authenticate, requireRole('admin'), deleteUser);
app.get('/api/reports', authenticate, requireRole('admin', 'manager'), getReports);
```

### ABAC (Attribute-Based Access Control)

```javascript
// Policy-based authorization
function authorize(policy) {
  return (req, res, next) => {
    const ctx = { user: req.user, resource: req.resource, action: req.method };
    if (!policy.evaluate(ctx)) return res.status(403).json({ error: 'Access denied' });
    next();
  };
}

// Policy: Users can edit their own posts; admins can edit any post
const editPostPolicy = {
  evaluate: (ctx) => ctx.user.role === 'admin' || ctx.resource.author_id === ctx.user.id,
};
```

## Input Validation

### SQL Injection

```javascript
// VULNERABLE
const query = `SELECT * FROM products WHERE name = '${userInput}'`;

// FIXED: Parameterized queries
const result = await db.query('SELECT * FROM products WHERE name = $1', [userInput]);
```

### Cross-Site Scripting (XSS)

```javascript
// VULNERABLE: Inserting user input directly into HTML
element.innerHTML = userInput;

// FIXED: Use textContent for plain text
element.textContent = userInput;

// FIXED: Use a sanitization library for rich content
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### CSRF (Cross-Site Request Forgery)

```javascript
// Server-side: Generate and validate CSRF tokens
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: { httpOnly: true, sameSite: 'strict' } });

app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});
app.post('/submit', csrfProtection, (req, res) => {
  handleSubmission(req.body); // Token validated automatically by middleware
});

// Client-side: <input type="hidden" name="_csrf" value="{{csrfToken}}">
```

### Command Injection

```javascript
// VULNERABLE: User input passed to shell command
const { exec } = require('child_process');
exec(`convert ${userFilename} output.png`);

// FIXED: Use execFile with arguments array (no shell interpolation)
const { execFile } = require('child_process');
execFile('convert', [userFilename, 'output.png']);
```

### Path Traversal

```javascript
// VULNERABLE: User controls file path
app.get('/files/:name', (req, res) => res.sendFile(`/uploads/${req.params.name}`));

// FIXED: Resolve and validate path stays within allowed directory
const path = require('path');
app.get('/files/:name', (req, res) => {
  const safePath = path.resolve('/uploads', req.params.name);
  if (!safePath.startsWith('/uploads/')) return res.status(400).json({ error: 'Invalid path' });
  res.sendFile(safePath);
});
```

## Secrets Management

### Rules

| Rule | Details |
|------|---------|
| Never commit secrets to version control | Use `.gitignore` for `.env` files; use `git-secrets` or `trufflehog` to scan |
| Use environment variables for runtime config | Load via `.env` in development, platform config in production |
| Rotate secrets regularly | Automate rotation where possible (AWS Secrets Manager, HashiCorp Vault) |
| Use least-privilege credentials | Database users should only have necessary grants |
| Audit secret access | Log when secrets are read and by whom |

### .gitignore Entries for Secrets

```gitignore
.env
.env.local
.env.production
.env.*.local
*.pem
*.key
*.p12
credentials.json
service-account.json
```

## HTTPS and CORS

```javascript
// HTTPS enforcement middleware
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.hostname}${req.url}`);
  }
  next();
});

// Restrictive CORS — specify exact origins
const cors = require('cors');
app.use(cors({
  origin: ['https://app.example.com', 'https://admin.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));
```

## Security Headers

Implement these headers on all responses:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME-type sniffing |
| `X-Frame-Options` | `DENY` or `SAMEORIGIN` | Prevent clickjacking |
| `Content-Security-Policy` | See below | Prevent XSS and data injection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unused browser features |
| `X-XSS-Protection` | `0` | Disable legacy XSS filter (CSP supersedes it) |

### Content Security Policy Example

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.example.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

## Dependency Vulnerability Scanning

```bash
# Integrate into CI — fail on high or critical vulnerabilities
npm audit --audit-level=high     # Node.js
pip-audit                        # Python
bundle audit                     # Ruby
cargo audit                      # Rust
govulncheck ./...                # Go
snyk test                        # Multi-language (commercial)
trivy fs --security-checks vuln . # Container and filesystem
```

## Security Logging

**Log these**: authentication attempts (success and failure), authorization failures, input validation failures, rate limit triggers, administrative actions, security setting changes.

**Never log these**: passwords, full credit card numbers, SSNs, session tokens, API keys, personal health information.

## Security Review Checklist

Before merging any code, verify:

- [ ] No secrets or credentials in the codebase.
- [ ] All user inputs validated and sanitized.
- [ ] SQL queries use parameterized statements.
- [ ] Authentication enforced on all protected endpoints.
- [ ] Authorization checked for resource-level access.
- [ ] CSRF protection on state-changing requests.
- [ ] Security headers present on all responses.
- [ ] Dependencies scanned for known vulnerabilities.
- [ ] Error messages do not leak internal details.
- [ ] Logging captures security events without sensitive data.
- [ ] File uploads validated (type, size, name sanitized).
- [ ] Rate limiting on authentication and public endpoints.
- [ ] CORS restricted to known origins.
- [ ] HTTPS enforced with HSTS header.
