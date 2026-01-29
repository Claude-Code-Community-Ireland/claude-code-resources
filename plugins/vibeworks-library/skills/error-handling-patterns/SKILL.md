---
name: error-handling-patterns
description: Error handling best practices across languages — error types, recovery strategies, user-facing messages, and logging. Reference when implementing error handling or designing error flows.
---

# Error Handling Patterns

## Error Classification

| Type            | Cause                                            | Can Recover? | Example                                     |
|-----------------|--------------------------------------------------|--------------|----------------------------------------------|
| **Operational** | Runtime problem in a correctly-written program   | Yes          | Network timeout, disk full, invalid input    |
| **Programmer**  | Bug in the code                                  | No           | TypeError, null dereference, assertion failure|

**Operational errors:** Anticipate them, handle explicitly, retry if transient, return clear error to caller, log with context.
**Programmer errors:** Crash immediately (fail fast), fix the bug, log full stack trace.

## Try/Catch Patterns

### When to Catch

- [ ] You can meaningfully recover (retry, fallback, return default)
- [ ] You need to translate the error for the caller
- [ ] You are at a boundary (HTTP handler, event listener, queue consumer)
- [ ] You need to add context before re-throwing

### When to Propagate

- [ ] You cannot recover; let the caller decide
- [ ] The error is already descriptive enough
- [ ] You are in a pure business logic layer (no I/O awareness)

### Catch, Add Context, Re-throw

```typescript
async function getUser(id: string): Promise<User> {
  try {
    return await db.query("SELECT * FROM users WHERE id = $1", [id]);
  } catch (error) {
    throw new DatabaseError(`Failed to fetch user ${id}`, { cause: error });
  }
}
```

```python
def get_user(user_id: str) -> User:
    try:
        return db.query("SELECT * FROM users WHERE id = %s", (user_id,))
    except DatabaseError as e:
        raise UserFetchError(f"Failed to fetch user {user_id}") from e
```

### Catch at Boundaries

```typescript
app.get("/users/:id", async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: { code: "RESOURCE_NOT_FOUND", message: "User not found." } });
    }
    logger.error("Unhandled error in GET /users/:id", { error, requestId: req.id });
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } });
  }
});
```

### Never Swallow Errors

```typescript
// BAD: empty catch block
try { await saveData(data); } catch (error) { }

// GOOD: handle or re-throw
try { await saveData(data); } catch (error) {
  logger.error("Failed to save data", { error, data });
  throw error;
}
```

## Custom Error Classes

### JavaScript / TypeScript

```typescript
class AppError extends Error {
  constructor(message: string, public readonly code: string,
    public readonly statusCode = 500, public readonly isOperational = true, cause?: Error) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, "RESOURCE_NOT_FOUND", 404);
  }
}

class ValidationError extends AppError {
  constructor(public readonly details: { field: string; message: string }[]) {
    super("Validation failed", "VALIDATION_FAILED", 422);
  }
}

class ExternalServiceError extends AppError {
  constructor(service: string, cause: Error) {
    super(`External service ${service} failed`, "EXTERNAL_SERVICE_ERROR", 502, true, cause);
  }
}
```

### Python

```python
class AppError(Exception):
    def __init__(self, message: str, code: str, status_code: int = 500, is_operational: bool = True):
        super().__init__(message)
        self.message, self.code, self.status_code, self.is_operational = message, code, status_code, is_operational

class NotFoundError(AppError):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(f"{resource} with id {resource_id} not found", "RESOURCE_NOT_FOUND", 404)

class ValidationError(AppError):
    def __init__(self, details: list[dict]):
        super().__init__("Validation failed", "VALIDATION_FAILED", 422)
        self.details = details

class ExternalServiceError(AppError):
    def __init__(self, service: str):
        super().__init__(f"External service {service} failed", "EXTERNAL_SERVICE_ERROR", 502)
```

## Error Boundaries in React

```tsx
import { Component, ErrorInfo, ReactNode } from "react";

interface Props { fallback: ReactNode; children: ReactNode; onError?: (error: Error, info: ErrorInfo) => void; }
interface State { hasError: boolean; }

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(): State { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
    logger.error("React error boundary caught error", { error: error.message, componentStack: info.componentStack });
  }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

// Usage
<ErrorBoundary fallback={<p>Something went wrong. Please refresh the page.</p>}
  onError={(error) => reportToMonitoring(error)}>
  <Dashboard />
</ErrorBoundary>
```

- [ ] Wrap each independent UI section in its own boundary
- [ ] Provide a meaningful fallback (not a blank page)
- [ ] Report errors to your monitoring service
- [ ] Error boundaries only catch rendering errors, not event handlers or async code

## Retry with Exponential Backoff

**Formula:** `delay = min(base_delay * 2^attempt + random_jitter, max_delay)`

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  opts = { maxAttempts: 3, baseDelayMs: 1000, maxDelayMs: 30000 }
): Promise<T> {
  let lastError: Error;
  for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
    try { return await fn(); }
    catch (error) {
      lastError = error as Error;
      if (attempt === opts.maxAttempts - 1) break;
      const delay = Math.min(opts.baseDelayMs * 2 ** attempt + Math.random() * 1000, opts.maxDelayMs);
      logger.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms`, { error: lastError.message });
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError!;
}
```

### Retry Rules

- [ ] Only retry transient errors (network, 429, 503), never 400 or 401
- [ ] Always use jitter to prevent thundering herd
- [ ] Set a maximum number of attempts (3-5 typical)
- [ ] Set a maximum delay cap
- [ ] Log every retry attempt with the error and delay

## Circuit Breaker Pattern

```
CLOSED --[failure threshold reached]--> OPEN --[timeout expires]--> HALF-OPEN
HALF-OPEN --[success]--> CLOSED    |    HALF-OPEN --[failure]--> OPEN
```

| State       | Behavior                                                 |
|-------------|----------------------------------------------------------|
| **Closed**  | Requests pass through normally. Failures are counted.    |
| **Open**    | Requests fail immediately without calling the service.   |
| **Half-Open** | A limited number of test requests are allowed through.|

```typescript
class CircuitBreaker {
  private state: "closed" | "open" | "half-open" = "closed";
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(private failureThreshold = 5, private resetTimeoutMs = 30000) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) this.state = "half-open";
      else throw new Error("Circuit breaker is open. Service unavailable.");
    }
    try {
      const result = await fn();
      this.failureCount = 0; this.state = "closed";
      return result;
    } catch (error) {
      this.failureCount++; this.lastFailureTime = Date.now();
      if (this.failureCount >= this.failureThreshold) this.state = "open";
      throw error;
    }
  }
}
```

## User-Facing Error Messages

| Rule                           | Good                                              | Bad                                        |
|--------------------------------|---------------------------------------------------|--------------------------------------------|
| Be clear about what happened   | "Your payment could not be processed."            | "Error 500."                               |
| Be actionable                  | "Please check your card details and try again."   | "Something went wrong."                    |
| Avoid technical jargon         | "We could not connect to the server."             | "ECONNREFUSED 10.0.0.1:5432"              |
| Do not blame the user          | "We could not find that page."                    | "You entered the wrong URL."               |
| Do not expose internal details | "Please try again later."                         | "NullPointerException in UserService.java" |
| Provide a way forward          | "Contact support if this continues."              | (nothing)                                  |

**Template:** `[What happened]. [What the user can do]. [How to get help if needed].`

## Logging Error Context

```typescript
// Good: structured context
logger.error("Failed to process payment", {
  error: error.message, stack: error.stack,
  orderId: order.id, userId: user.id, amount: order.total,
  requestId: req.id, correlationId: req.headers["x-correlation-id"],
});

// Bad: string concatenation
logger.error(`Error: ${error} for order ${order.id}`);
```

| Field           | Purpose                                | Example                 |
|-----------------|----------------------------------------|-------------------------|
| `error.message` | What went wrong                        | "Connection refused"    |
| `error.stack`   | Where it happened                      | Full stack trace        |
| `requestId`     | Trace a single request across systems  | "req_abc123"            |
| `correlationId` | Trace a workflow across services       | "corr_xyz789"           |
| `userId`        | Who was affected                       | "user_456"              |
| `operation`     | What was being attempted               | "createOrder"           |

- [ ] Never log passwords, tokens, credit card numbers, or PII
- [ ] Always include a request or correlation ID
- [ ] Log at the appropriate level (error for failures, warn for recoverable)
- [ ] Include enough context to reproduce the issue

## Fail-Fast vs Graceful Degradation

| Question                                        | Fail-Fast | Degrade Gracefully |
|-------------------------------------------------|-----------|--------------------|
| Would continuing corrupt data?                  | Yes       |                    |
| Is the feature critical to the core workflow?   | Yes       |                    |
| Is it a configuration or startup issue?         | Yes       |                    |
| Is the failed component optional?               |           | Yes                |
| Can the user still complete their primary task? |           | Yes                |
| Is there a reasonable fallback?                 |           | Yes                |

```typescript
// Fail fast on missing config
for (const name of ["DATABASE_URL", "JWT_SECRET", "REDIS_URL"]) {
  if (!process.env[name]) throw new Error(`Missing required env var: ${name}`);
}

// Graceful degradation for optional service
async function getRecommendations(userId: string): Promise<Product[]> {
  try { return await recommendationService.getForUser(userId); }
  catch (error) {
    logger.warn("Recommendation service unavailable, using fallback", { error: error.message, userId });
    return getDefaultRecommendations();
  }
}
```

## Error Codes and Catalogs

```typescript
const ErrorCatalog = {
  // Authentication (1xxx)
  AUTH_TOKEN_EXPIRED:      { code: 1001, status: 401, message: "Authentication token has expired." },
  AUTH_TOKEN_INVALID:      { code: 1002, status: 401, message: "Authentication token is invalid." },
  AUTH_INSUFFICIENT_PERMS: { code: 1003, status: 403, message: "Insufficient permissions." },
  // Validation (2xxx)
  VALIDATION_REQUIRED:     { code: 2001, status: 422, message: "Required field is missing." },
  VALIDATION_FORMAT:       { code: 2002, status: 422, message: "Field format is invalid." },
  VALIDATION_RANGE:        { code: 2003, status: 422, message: "Value is out of allowed range." },
  // Resources (3xxx)
  RESOURCE_NOT_FOUND:      { code: 3001, status: 404, message: "Resource not found." },
  RESOURCE_CONFLICT:       { code: 3002, status: 409, message: "Resource conflict." },
  // External Services (4xxx)
  EXT_SERVICE_UNAVAILABLE: { code: 4001, status: 503, message: "External service unavailable." },
  EXT_SERVICE_TIMEOUT:     { code: 4002, status: 504, message: "External service timeout." },
  // Internal (5xxx)
  INTERNAL_UNEXPECTED:     { code: 5001, status: 500, message: "An unexpected error occurred." },
} as const;
```

- [ ] Group codes by category with numeric prefixes
- [ ] Every error returned by the API must have a catalog entry
- [ ] Document error codes in the API reference
- [ ] Never reuse or reassign error codes
