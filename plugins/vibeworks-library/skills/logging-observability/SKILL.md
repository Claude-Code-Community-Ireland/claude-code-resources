---
name: logging-observability
description: Logging and observability best practices — structured logging, log levels, correlation IDs, metrics, tracing, and alerting. Reference when implementing logging or monitoring.
---

# Logging and Observability

## Structured Logging

Always use structured logging (JSON format) instead of unstructured text. Structured logs are machine-parseable, searchable, and can be aggregated across services.

### Standard Log Entry Format

```json
{
  "timestamp": "2024-03-15T14:30:22.123Z",
  "level": "INFO",
  "message": "Order processed successfully",
  "service": "order-service",
  "version": "1.4.2",
  "correlationId": "req-abc123",
  "userId": "user-456",
  "orderId": "ord-789",
  "durationMs": 234,
  "environment": "production"
}
```

### Required Fields

Every log entry must include:

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO 8601 string | When the event occurred (UTC) |
| `level` | string | Log severity level |
| `message` | string | Human-readable description of the event |
| `service` | string | Name of the service emitting the log |

### Recommended Fields

| Field | Type | Description |
|-------|------|-------------|
| `correlationId` | string | Request or trace identifier for cross-service correlation |
| `version` | string | Application version or commit hash |
| `environment` | string | Deployment environment (production, staging, etc.) |
| `userId` | string | Authenticated user identifier (if applicable) |
| `durationMs` | number | Operation duration in milliseconds |
| `error` | object | Error details when level is ERROR |

### Implementation Examples

```javascript
// Node.js with pino
const pino = require('pino');
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: { level: (label) => ({ level: label.toUpperCase() }) },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: { service: 'order-service', version: process.env.APP_VERSION || 'unknown' },
});

logger.info({ orderId: 'ord-789', durationMs: 234 }, 'Order processed successfully');
logger.error({ err, orderId: 'ord-789' }, 'Failed to process order');
```

```python
# Python with structlog
import structlog
structlog.configure(processors=[
    structlog.processors.TimeStamper(fmt="iso"),
    structlog.processors.add_log_level,
    structlog.processors.JSONRenderer(),
])
logger = structlog.get_logger(service="order-service")
logger.info("order_processed", order_id="ord-789", duration_ms=234)
```

## Log Levels Usage Guide

Choose the correct log level based on the audience and urgency:

| Level | When to Use | Examples | Audience |
|-------|-------------|----------|----------|
| **ERROR** | Something failed and requires attention. The operation could not complete. | Unhandled exception, database connection lost, payment processing failed, external API returned 5xx | On-call engineer (triggers alert) |
| **WARN** | Something unexpected happened but the operation continued. May need attention soon. | Deprecated API used, retry succeeded after failure, cache miss on hot path, connection pool near limit | Engineering team (review in daily triage) |
| **INFO** | Normal operational events worth recording. The happy path. | Request handled, order created, user logged in, migration completed, deploy started | Operations team (dashboard monitoring) |
| **DEBUG** | Detailed information useful for diagnosing issues. Not enabled in production by default. | SQL query with parameters, HTTP request/response details, cache hit/miss, algorithm intermediate steps | Developers (enabled during investigation) |
| **TRACE** | Very fine-grained detail. Rarely used outside local development. | Function entry/exit, loop iterations, variable state at each step | Developers (local debugging only) |

### Level Selection Rules

- If it means waking someone up at 3 AM, it is **ERROR**.
- If it means something is degraded but not broken, it is **WARN**.
- If it is the normal outcome of a user or system action, it is **INFO**.
- If it would help debug a problem but is too noisy for production, it is **DEBUG**.
- If you would only want it while stepping through code, it is **TRACE**.

## What to Log and What NOT to Log

### Log These Events

| Category | Events |
|----------|--------|
| Requests | Incoming HTTP requests (method, path, status, duration). API calls to external services. |
| Authentication | Login success, login failure, logout, session expiry, MFA challenge. |
| Authorization | Access denied events with user, resource, and required permission. |
| Errors | Unhandled exceptions, failed operations, timeout events, circuit breaker trips. |
| State Changes | Record creation/update/deletion, status transitions, configuration changes. |
| Performance | Slow queries (above threshold), response time percentiles, queue depth. |
| Business Events | Order placed, payment processed, subscription changed, export completed. |

### Never Log These

| Category | Reason | Alternative |
|----------|--------|-------------|
| Passwords | Credential exposure | Log event type only ("login_attempt") |
| API keys and tokens | Credential exposure | Log last 4 characters at most |
| Credit card numbers | PCI compliance violation | Log last 4 digits only |
| Social Security Numbers | PII regulation violation | Log event type only |
| Session tokens | Session hijacking risk | Log session ID prefix or hash |
| Personal health data | HIPAA violation | Log event type with anonymized reference |
| Full request bodies with sensitive fields | Data exposure | Log sanitized version or field names only |

## Correlation IDs and Request Tracing

A correlation ID (also called request ID or trace ID) links all log entries for a single request, even across multiple services.

### Middleware Implementation

```javascript
const { randomUUID } = require('crypto');

function correlationIdMiddleware(req, res, next) {
  const correlationId = req.headers['x-correlation-id'] || randomUUID();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  req.log = logger.child({ correlationId }); // Bind to logger context
  next();
}
app.use(correlationIdMiddleware);

// Usage in route handlers
app.get('/api/orders/:id', async (req, res) => {
  req.log.info({ orderId: req.params.id }, 'Fetching order');
  const order = await orderService.getById(req.params.id);
  res.json(order);
});
```

### Propagation Across Services

Forward the correlation ID in outgoing requests:

```javascript
async function callPaymentService(orderId, correlationId) {
  return fetch('https://payment-service/api/charge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-correlation-id': correlationId },
    body: JSON.stringify({ orderId }),
  }).then(r => r.json());
}
```

## Distributed Tracing

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Trace** | End-to-end record of a request flowing through the system. Contains multiple spans. |
| **Span** | A single unit of work (e.g., an HTTP request, a database query, a function call). Has a start time, duration, and metadata. |
| **Context Propagation** | Passing trace context (trace ID, span ID, flags) between services via headers. |
| **Parent-Child Relationship** | Spans form a tree: an outgoing HTTP call creates a child span of the handler span. |

### OpenTelemetry Setup

```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: 'order-service',
});
sdk.start();
```

### Custom Spans

```javascript
const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer('order-service');

async function processOrder(orderId) {
  return tracer.startActiveSpan('processOrder', async (span) => {
    try {
      span.setAttribute('order.id', orderId);
      const order = await tracer.startActiveSpan('validateOrder', async (child) => {
        const result = await validateOrder(orderId);
        child.end();
        return result;
      });
      await tracer.startActiveSpan('chargePayment', async (child) => {
        await chargePayment(order);
        child.end();
      });
      span.setStatus({ code: trace.SpanStatusCode.OK });
    } catch (error) {
      span.setStatus({ code: trace.SpanStatusCode.ERROR, message: error.message });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
```

## Metrics

### Metric Types

| Type | Description | Use Case | Example |
|------|-------------|----------|---------|
| **Counter** | Monotonically increasing value. Only goes up (or resets to zero). | Counting events, total requests, errors. | `http_requests_total{method="GET", status="200"}` |
| **Gauge** | Value that can go up or down. Point-in-time measurement. | Current state, queue depth, active connections. | `db_connections_active{pool="primary"}` |
| **Histogram** | Samples observations into configurable buckets. Tracks distribution. | Request latency, response size, query duration. | `http_request_duration_seconds_bucket{le="0.5"}` |

### Implementation Example (Prometheus Client)

```javascript
const client = require('prom-client');

// Counter
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

// Gauge
const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active database connections',
});

// Histogram
const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'path'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const end = requestDuration.startTimer({ method: req.method, path: req.route?.path || req.path });
  res.on('finish', () => {
    end();
    httpRequestsTotal.inc({ method: req.method, path: req.route?.path || req.path, status: res.statusCode });
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
```

## Alert Design Principles

Well-designed alerts reduce noise and improve response times.

### Principles

| Principle | Description |
|-----------|-------------|
| **Actionable** | Every alert must have a clear action the responder can take. If there is no action, it is not an alert. |
| **Not noisy** | Alerts that fire frequently without requiring action cause fatigue. Tune thresholds and suppress flapping. |
| **Runbook linked** | Every alert includes a link to a runbook with investigation and resolution steps. |
| **Severity-based** | Critical alerts page on-call; warnings create tickets; informational alerts appear on dashboards. |
| **Symptom-based** | Alert on user-facing symptoms (error rate, latency), not causes (CPU usage, memory). |
| **Include context** | Alert message includes service name, environment, current value, threshold, and dashboard link. |

### Alert Template

```yaml
alert: HighErrorRate
expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
for: 5m
labels:
  severity: critical
  team: backend
annotations:
  summary: "High 5xx error rate on {{ $labels.service }}"
  description: |
    Error rate is {{ $value | humanizePercentage }} (threshold: 5%).
    Service: {{ $labels.service }}
    Environment: {{ $labels.environment }}
  dashboard: "https://grafana.example.com/d/http-overview"
  runbook: "https://wiki.example.com/runbooks/high-error-rate"
```

## Health Check Endpoints

Implement three standard health check endpoints:

| Endpoint | Purpose | Checks | Response |
|----------|---------|--------|----------|
| `/health` | Basic liveness — is the process running? | Process is alive, can serve HTTP | `200 OK` with `{"status": "ok"}` |
| `/ready` | Readiness — can the service handle traffic? | Database connected, cache reachable, dependencies healthy | `200 OK` or `503 Service Unavailable` |
| `/live` | Liveness probe — is the process stuck? | Not deadlocked, event loop responsive | `200 OK` |

### Implementation

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: process.env.APP_VERSION });
});

app.get('/ready', async (req, res) => {
  const checks = {
    database: await ping(db, 'SELECT 1'),
    cache: await ping(redis, 'PING'),
  };
  const allHealthy = Object.values(checks).every(c => c.status === 'ok');
  res.status(allHealthy ? 200 : 503).json({ status: allHealthy ? 'ready' : 'not_ready', checks });
});

app.get('/live', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

async function ping(client, command) {
  try {
    await client.query(command);
    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
```

## Log Aggregation Platforms

| Platform | Strengths | Query Language | Cost Model |
|----------|-----------|---------------|------------|
| ELK (Elasticsearch, Logstash, Kibana) | Self-hosted, flexible, powerful full-text search | KQL, Lucene | Infrastructure cost (self-managed) |
| Datadog | Unified logs, metrics, traces; strong APM | Datadog query syntax | Per-ingested-GB |
| CloudWatch Logs | Native AWS integration, no infrastructure to manage | CloudWatch Insights | Per-ingested-GB + storage |
| Grafana Loki | Lightweight log aggregation, label-based indexing | LogQL | Infrastructure cost (low storage) |
| Splunk | Enterprise-grade search, compliance features | SPL | Per-ingested-GB (premium) |

### Choosing a Platform

- **Small team, AWS-native**: CloudWatch Logs with Insights queries.
- **Multi-cloud or hybrid**: Datadog or self-hosted ELK.
- **Already using Grafana for metrics**: Add Loki for logs.
- **Enterprise with compliance needs**: Splunk or Datadog.

## Observability Checklist

When implementing observability for a new service:

- [ ] Structured JSON logging with consistent field names.
- [ ] Log levels used appropriately (see table above).
- [ ] Correlation IDs generated and propagated across services.
- [ ] No secrets, PII, or credentials in log output.
- [ ] Health check endpoints implemented (`/health`, `/ready`, `/live`).
- [ ] Key metrics exposed (request rate, error rate, duration histograms).
- [ ] Distributed tracing configured with OpenTelemetry.
- [ ] Alerts defined for error rate, latency, and availability.
- [ ] Every alert linked to a runbook.
- [ ] Dashboards created for service overview and key flows.
- [ ] Log retention and rotation configured.
- [ ] Log aggregation pipeline verified end-to-end.
