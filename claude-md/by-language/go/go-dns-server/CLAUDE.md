# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

**DO ONLY WHAT IS EXPLICITLY REQUESTED:**
- Do exactly what the user asks, nothing more
- Do not add extra tasks or steps that were not requested
- Do not make assumptions about what the user wants

**DO NOT create unsolicited documentation files:**
- Do NOT create status reports, summaries, or markdown files unless explicitly asked
- Do NOT create files like *_SUMMARY.md, *_STATUS.md, *_REPORT.md unless requested
- Focus on code implementation, not documentation
- Only update documentation when specifically asked or when code changes require it

## Project Overview

This is a high-performance, RFC-compliant DNS server implementation in Go, designed to outperform established solutions like BIND and Unbound. **Performance target: 500,000+ QPS** with linear multi-core scaling.

The server is built with:
- Zero-allocation hot path architecture
- Two-level caching strategy (message + RRset caches)
- Lock-free, sharded data structures
- Per-core I/O with SO_REUSEPORT
- Pure Go recursive resolver (no CGO overhead)
- Optional plugin system with fast-path bypass

**Future Integration:** This DNS engine will power the Nexora admin GUI (React-based), but GUI/API implementation is post-MVP. The current focus is core performance and RFC compliance.

## Development Commands

### Building
```bash
# Build the main server binary
go build -o dns-server ./cmd/dns-server

# Build with optimizations for production
go build -ldflags="-s -w" -o dns-server ./cmd/dns-server

# Build all binaries
go build ./...
```

### Testing
```bash
# Run all tests
go test ./...

# Run tests with verbose output
go test -v ./...

# Run tests with coverage
go test -cover ./...
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Run a specific test
go test -v ./pkg/resolver -run TestRecursiveQuery

# Run benchmarks
go test -bench=. ./...
go test -bench=BenchmarkDNSQuery -benchmem ./pkg/server

# Run benchmarks with memory profiling
go test -bench=. -benchmem -memprofile=mem.out ./pkg/cache
go tool pprof mem.out
```

### Code Quality
```bash
# Format code
go fmt ./...

# Lint (requires golangci-lint)
golangci-lint run

# Vet for suspicious code
go vet ./...

# Run static analysis
go vet ./... && staticcheck ./...
```

### Performance Profiling
```bash
# CPU profiling
go test -cpuprofile=cpu.out -bench=. ./pkg/server
go tool pprof cpu.out

# Memory profiling
go test -memprofile=mem.out -bench=. ./pkg/cache
go tool pprof mem.out

# Run server with pprof endpoint
go run ./cmd/dns-server -pprof :6060
# Then: go tool pprof http://localhost:6060/debug/pprof/profile
```

### Running
```bash
# Run the server (development)
go run ./cmd/dns-server

# Run with custom config
go run ./cmd/dns-server -config config.yaml

# Run with race detector (debugging)
go run -race ./cmd/dns-server

# Run with GC tuning for performance
GOGC=300 GOMEMLIMIT=2GiB go run ./cmd/dns-server
```

## Project Architecture

### Core Design Principles

This DNS server is architected to avoid common performance pitfalls found in CoreDNS while adopting proven strategies from Unbound:

1. **Per-Core I/O Architecture**: Each CPU core has dedicated UDP socket (SO_REUSEPORT) to eliminate shared state contention
2. **Two-Level Caching**: Message cache (L1) + RRset cache (L2) for maximum hit rates and flexibility
3. **Fast-Path Bypass**: 90% of queries bypass plugin chain entirely for sub-100µs response times
4. **Zero-Allocation Hot Path**: sync.Pool and buffer reuse eliminate GC pressure
5. **Sharded Everything**: No global locks; all data structures are sharded or lock-free
6. **Pure Go Resolver**: No CGO overhead; full control over concurrency

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│  I/O Layer (Per-Core)                                   │
│  - One UDP socket per CPU core (SO_REUSEPORT)           │
│  - Goroutine pinned to OS thread                        │
│  - Private buffer pool (no contention)                  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Fast Path Detection (Inline, Zero-Alloc)               │
│  - Common query type? (A, AAAA, PTR)                    │
│  - DNSSEC not required?                                 │
│  - Response < 512 bytes?                                │
└────┬──────────────────────────────────────────┬─────────┘
     │ FAST (90%)                                │ SLOW (10%)
     ▼                                           ▼
┌──────────────────────┐              ┌───────────────────┐
│ Message Cache (L1)   │              │ Full Plugin Chain │
│ - Complete responses │              │ - Query parser    │
│ - Zero-copy serving  │              │ - Auth zones      │
│ - Sharded (64+)      │              │ - L1/L2 cache     │
└────┬─────────────────┘              │ - Recursive       │
     │ HIT (80%)   MISS               │ - DNSSEC          │
     ▼             │                  └────┬──────────────┘
   Return          ▼                       │
           ┌──────────────────┐            │
           │ RRset Cache (L2) │            │
           │ - Individual RRs │            │
           │ - Flexible build │            │
           └────┬─────────────┘            │
                │ HIT (15%)   MISS (5%)    │
                ▼             │            │
              Build           ▼            ▼
             Response   ┌──────────────────────────┐
                        │ Recursive Resolver       │
                        │ - Worker pool (bounded)  │
                        │ - Connection pool        │
                        │ - Request coalescing     │
                        │ - Infrastructure cache   │
                        └──────────┬───────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │ Prefetch Engine          │
                        │ - Background refresh     │
                        │ - Popular entries only   │
                        └──────────────────────────┘
```

### Three-Level Caching Strategy

**Inspired by Unbound's sophisticated caching:**

**L1: Message Cache**
- Stores complete DNS response bytes
- Key: Hash(query_name + query_type + flags)
- Zero-copy serving: direct byte slice return
- Size: 128MB default (configurable)
- Shard count: NumCPU * 4 (power of 2)
- Hit rate target: 80% of all queries

**L2: RRset Cache**
- Stores individual resource record sets
- Key: Hash(domain + record_type)
- Flexible response assembly for query variations
- Size: 256MB default (2x message cache)
- Shard count: NumCPU * 8 (more contention)
- Hit rate target: 15% of remaining queries

**L3: Infrastructure Cache**
- Stores upstream server metrics (RTT, failures)
- Used for smart upstream selection
- Size: Small (~10MB)
- Enables fastest resolution by choosing best upstreams

**Why Two-Level Caching Wins:**
- Message cache: Instant response for exact matches
- RRset cache: Can answer variations (e.g., different flags, DNSSEC vs no-DNSSEC)
- Example: Query "example.com A" hits message cache. Later "example.com A +dnssec" uses RRset cache
- Combined hit rate: 95%+ (vs 85% single-level)

### Package Structure

**`pkg/io/`** - I/O Layer
- `listener.go` - Per-core UDP/TCP sockets with SO_REUSEPORT
- `buffer_pool.go` - sync.Pool for zero-allocation buffer reuse
- `fast_detector.go` - Inline fast-path detection logic
- `pinning.go` - Goroutine-to-thread pinning for I/O handlers

**`pkg/plugin/`** - Optional Plugin System
- `interface.go` - Plugin interface with FastPathCapable marker
- `chain.go` - Plugin chain executor with bypass logic
- `plugins/cache/` - Message cache plugin
- `plugins/rrset/` - RRset cache plugin
- `plugins/auth/` - Authoritative zone plugin
- `plugins/recursive/` - Recursive resolver plugin
- `plugins/dnssec/` - DNSSEC validation plugin

**`pkg/cache/`** - High-Performance Caching
- `message_cache.go` - L1: Complete response cache (zero-copy)
- `rrset_cache.go` - L2: Individual resource record cache
- `infra_cache.go` - L3: Upstream server metrics
- `prefetch.go` - Background prefetch engine for popular entries
- `shard.go` - Sharding logic (hash-based distribution)
- `pool.go` - Object pools for cache entries

**`pkg/resolver/`** - Pure Go Recursive Resolver
- `recursive.go` - Main recursive resolution logic
- `upstream_pool.go` - Connection pool with smart server selection
- `coalesce.go` - Request deduplication (multiple clients, same query)
- `iterator.go` - Iterative query logic following referrals
- `hints.go` - Root hints management

**`pkg/zone/`** - Authoritative Zone Management
- `loader.go` - Zone file parsing (RFC 1035 format)
- `storage.go` - Copy-on-write zone storage
- `query.go` - Zone query handler
- `transfer.go` - AXFR/IXFR support

**`pkg/dnssec/`** - DNSSEC Implementation
- `validator.go` - Signature validation (RRSIG)
- `chain.go` - Chain of trust verification
- `nsec.go` - NSEC/NSEC3 authenticated denial
- `keys.go` - Key management (DNSKEY, DS)

**`pkg/protocol/`** - DNS Protocol (Use github.com/miekg/dns)
- Thin wrapper around miekg/dns for wire format
- Custom optimizations for zero-copy operations
- EDNS0 support

**`cmd/dns-server/`** - Main Server Binary
- `main.go` - Server initialization and lifecycle
- `config.go` - Configuration loading and validation
- `signals.go` - Signal handling and graceful shutdown
- `metrics.go` - Prometheus metrics exposition

## Performance Anti-Patterns (Lessons from CoreDNS)

**AVOID THESE MISTAKES** that cause CoreDNS to cap at 90K QPS:

### ❌ Anti-Pattern 1: Shared State Causing Lock Contention
```go
// BAD: Single cache with global lock (CoreDNS mistake)
type Cache struct {
    mu   sync.RWMutex
    data map[string]*Entry
}

// GOOD: Sharded cache with lock-free reads
type Cache struct {
    shards [64]*ShardedCache
}
type ShardedCache struct {
    data sync.Map // Lock-free reads
}
```

### ❌ Anti-Pattern 2: Allocations in Hot Path
```go
// BAD: Allocates on every query (CoreDNS pattern)
func handle(query []byte) []byte {
    msg := new(dns.Msg)  // Allocation!
    msg.Unpack(query)
    response := new(dns.Msg)  // Allocation!
    return response.Pack()    // Allocation!
}

// GOOD: Zero-allocation with sync.Pool
var msgPool = sync.Pool{New: func() interface{} { return new(dns.Msg) }}
func handle(query []byte) []byte {
    msg := msgPool.Get().(*dns.Msg)
    defer msgPool.Put(msg)
    // Reuse object, no allocations
}
```

### ❌ Anti-Pattern 3: Forced Plugin Chain Traversal
```go
// BAD: Every query goes through all plugins (CoreDNS)
for _, plugin := range plugins {
    plugin.Handle(query)  // +20ms overhead
}

// GOOD: Fast-path bypass
if isCommonQuery(query) && cached := cache.GetDirect(query); cached != nil {
    return cached  // Skip all plugins! <0.1ms
}
```

### ❌ Anti-Pattern 4: CGO Overhead
```go
// BAD: CGO calls for recursive resolution (CoreDNS with libunbound)
result := C.ub_resolve(ctx, domain, rrtype)  // 10-100x slower

// GOOD: Pure Go implementation
result := resolver.Resolve(ctx, domain, rrtype)
```

### ❌ Anti-Pattern 5: Poor Multi-Core Scaling
```go
// BAD: Shared I/O socket (all cores contend)
socket := net.ListenUDP("udp", addr)
for i := 0; i < numCores; i++ {
    go handleRequests(socket)  // All goroutines fight for socket.ReadFrom()
}

// GOOD: Per-core sockets
for i := 0; i < numCores; i++ {
    socket := createSocketWithReusePort(addr)  // Dedicated socket
    go handleRequests(socket)  // No contention
}
```

## Zero-Allocation Strategy

**Critical for 500K+ QPS:** Eliminate GC pressure in hot path

### Object Pooling
```go
// Pool everything frequently allocated
var (
    msgPool    = sync.Pool{New: func() interface{} { return new(dns.Msg) }}
    bufferPool = sync.Pool{New: func() interface{} { b := make([]byte, 4096); return &b }}
    queryPool  = sync.Pool{New: func() interface{} { return new(Query) }}
)

// Always use defer to return to pool
func handleQuery(q []byte) {
    msg := msgPool.Get().(*dns.Msg)
    defer msgPool.Put(msg)
    // ... use msg ...
}
```

### Pre-Allocated Response Arena
```go
// For message cache: store complete response bytes
type MessageCacheEntry struct {
    responseBytes []byte  // Pre-serialized, zero-copy serving
    expiry        time.Time
    hitCount      atomic.Int64
}

// Serving is just: conn.Write(entry.responseBytes)
```

### GC Tuning
```bash
# Reduce GC frequency (default GOGC=100)
export GOGC=300  # Run GC when heap grows 3x (vs 2x default)

# Set hard memory limit
export GOMEMLIMIT=2GiB  # Prevent runaway memory growth

# Profile GC impact
GODEBUG=gctrace=1 ./dns-server
```

### Benchmark Requirements
Every hot-path function MUST have a benchmark showing:
```bash
# Example: zero allocations in fast path
BenchmarkCacheLookup-16    50000000    25.3 ns/op    0 B/op    0 allocs/op
#                                                     ↑ MUST BE ZERO
```

## Lessons from Unbound/BIND/CoreDNS

### ✅ Adopt from Unbound (C, 20-50K QPS)
- **Two-level caching** (message + RRset): Increases hit rate by 10-15%
- **Prefetch mechanism**: Refresh popular entries before expiry (~10% CPU overhead, massive benefit)
- **Infrastructure cache**: Smart upstream selection based on RTT/failures
- **Slab-based sharding**: Power-of-2 shards ≈ num-threads for optimal distribution

### ✅ Adopt from CoreDNS (Go, caps at 90K QPS)
- **Plugin architecture**: Extensibility for future Nexora features
- **Modular design**: Easy to test and maintain
- **BUT IMPROVE IT**: Add fast-path bypass to avoid 20ms plugin overhead

### ❌ Avoid from CoreDNS
- **Shared state**: Causes lock contention limiting to 2-core scaling
- **GC pressure**: No sync.Pool usage, heavy allocations
- **Forced plugin chains**: Every query pays overhead even for cache hits
- **CGO recursive resolver**: 10-100x slower than pure Go

### ❌ Avoid from BIND
- **Monolithic design**: Hard to extend for future GUI integration
- **Mixed concerns**: Authoritative + recursive in one (we separate them)

### 🚀 Our Advantages Over C Implementations
- **Goroutines**: Natural concurrency without manual thread management
- **sync.Map**: Lock-free reads (C requires custom implementation)
- **Modern NIC features**: SO_REUSEPORT works better with Go scheduler
- **Memory safety**: No buffer overflows (security benefit)
- **Faster development**: Easier to iterate and optimize

## Performance Targets

### Throughput Goals
- **500,000+ QPS** on 16-core system (vs CoreDNS 90K cap)
- **50,000+ QPS per core** (linear scaling)
- **95%+ cache hit rate** (with 2-level cache + prefetch)

### Latency Goals
- **<100µs** for cached responses (fast path)
- **<50ms** for recursive resolution (slow path)
- **p99 latency <200µs** for cache hits

### Resource Goals
- **<2GB memory** for 256MB cache + working set
- **<50% CPU** at 300K QPS (headroom for spikes)
- **Linear scaling** to 16 cores minimum

### Comparison
```
                 1 core    2 cores   4 cores   8 cores   16 cores
CoreDNS (actual)  60K QPS   90K QPS   90K QPS   90K QPS   90K QPS  ❌
Unbound (C)       15K QPS   30K QPS   50K QPS   N/A       N/A      ⚠
Our Target        50K QPS  100K QPS  200K QPS  400K QPS  600K QPS  ✅
```

### Benchmarking Tools
```bash
# DNS-specific load testing
dnsperf -d queries.txt -s 127.0.0.1 -Q 100000
resperf -d queries.txt -s 127.0.0.1

# Custom Go benchmarks
go test -bench=BenchmarkEndToEnd -benchtime=30s ./...
```

## RFC Compliance Requirements

Must implement and test against:
- RFC 1034, 1035 - Core DNS protocol
- RFC 2181 - DNS specification clarifications
- RFC 2308 - Negative caching
- RFC 4033, 4034, 4035 - DNSSEC
- RFC 5001 - NSEC3
- RFC 6891 - EDNS0
- RFC 7766 - DNS over TCP
- RFC 8499 - DNS terminology

Compliance validation:
- Use Unbound test suite for interoperability
- Validate against BIND, PowerDNS, Knot
- RFC test vectors for edge cases

## Configuration Management

Expected configuration structure (YAML):
```yaml
server:
  listen_addresses: ["0.0.0.0:53", "[::]:53"]
  tcp_enabled: true
  max_tcp_connections: 1000

  # Per-core architecture
  num_io_workers: 16  # Usually = NumCPU
  pin_workers: true   # Pin goroutines to OS threads

cache:
  # Two-level cache configuration
  message_cache:
    max_size_mb: 128
    num_shards: 64     # Power of 2, typically NumCPU * 4

  rrset_cache:
    max_size_mb: 256   # 2x message cache (Unbound recommendation)
    num_shards: 128    # More shards due to higher contention

  # Prefetch configuration
  prefetch:
    enabled: true
    threshold_hits: 100      # Prefetch if hit count > 100
    threshold_ttl_pct: 10    # Prefetch when TTL < 10% remaining

  # TTL bounds
  min_ttl: 60
  max_ttl: 86400
  negative_ttl: 3600

resolver:
  root_hints: "/etc/dns/root.hints"
  max_recursion_depth: 30
  query_timeout: 5s

  # Worker pool for slow path
  worker_pool_size: 1000

  # Upstream configuration
  upstreams:
    - "8.8.8.8:53"
    - "1.1.1.1:53"

  # Request coalescing (deduplicate identical queries)
  coalesce_enabled: true

performance:
  # GC tuning (set via env vars is preferred)
  gogc: 300
  gomemlimit: "2GiB"

  # Profiling
  pprof_enabled: true
  pprof_addr: "localhost:6060"

zones:
  - name: "example.com"
    file: "/etc/dns/zones/example.com.zone"
    type: authoritative
```

## Development Priorities (MVP)

**Phase 1: Core Engine** (Current Focus)
- ✅ Per-core I/O with SO_REUSEPORT
- ✅ Two-level caching (message + RRset)
- ✅ Fast-path inline processing
- ✅ Zero-allocation hot path
- ✅ Pure Go recursive resolver

**Phase 2: RFC Compliance**
- DNSSEC support
- EDNS0 edge cases
- Negative caching
- Zone transfers

**Phase 3: Performance Validation**
- Load testing (target: 500K+ QPS)
- Latency profiling (target: <100µs cached)
- Memory profiling (target: <2GB working set)
- Multi-core scaling validation

**Phase 4: Production Readiness**
- Comprehensive logging
- Prometheus metrics
- Graceful shutdown
- Configuration hot-reload

**Post-MVP: Nexora GUI Integration**
- REST API for management
- WebSocket for real-time stats
- Zone management endpoints
- Cache control endpoints

**NOT in MVP:**
- HTTP/3 or DNS-over-HTTPS (DoH)
- DNS-over-TLS (DoT)
- Advanced filtering/blocking
- Geographic routing
- Web GUI (comes later with Nexora)

## Code Conventions

### General Go Style
- Use meaningful package names that reflect functionality
- Keep functions focused and under 50 lines when possible
- Document all exported types and functions with godoc comments
- Use table-driven tests for protocol parsing/encoding
- Employ context.Context for cancellation and timeouts
- Return errors explicitly; avoid panics in production code paths
- Use structured logging (e.g., zerolog, zap) not fmt.Println

### Performance-Critical Rules

**Rule 1: NEVER Allocate in Hot Path**
```go
// BAD
func hotPath() {
    data := make([]byte, 1024)  // ❌ Allocation
}

// GOOD
var bufferPool = sync.Pool{...}
func hotPath() {
    data := bufferPool.Get().([]byte)
    defer bufferPool.Put(data)
}
```

**Rule 2: ALWAYS Benchmark Hot Paths**
```go
// Every hot-path function needs a benchmark
func BenchmarkCacheLookup(b *testing.B) {
    // Must show 0 allocs/op
    b.ReportAllocs()
    for i := 0; i < b.N; i++ {
        cache.Lookup(key)
    }
}
```

**Rule 3: Profile Before Optimizing**
```bash
# Always profile to confirm bottlenecks
go test -cpuprofile=cpu.out -bench=.
go tool pprof cpu.out
```

**Rule 4: Prefer Lock-Free Over Locks**
```go
// Use sync.Map for read-heavy workloads (cache)
// Use atomic.Value for infrequent updates (config)
// Use channels only when necessary (slow path queue)
```

**Rule 5: Shard Everything**
```go
// NEVER use a single global lock
// ALWAYS shard by hash or core affinity
shardID := hash(key) & (numShards - 1)
```

### Testing Requirements
- Unit test coverage: >80% for all packages
- Benchmark tests: All hot-path functions must have benchmarks showing 0 allocs/op
- Integration tests: Full query/response cycles with real DNS traffic
- Load tests: Validate scaling to 500K+ QPS
- Compliance tests: Pass Unbound test suite

## Dependencies

### Essential Libraries
- **`github.com/miekg/dns`** - DNS protocol implementation (wire format)
  - Saves 80% of protocol work
  - Battle-tested, RFC compliant
  - Used by CoreDNS, many production systems

### Cache Library (Choose ONE)
- **`github.com/dgraph-io/ristretto`** - Concurrent cache with TinyLFU eviction
  - Lock-free reads
  - Built-in metrics
  - Better eviction than LRU for DNS workloads

OR

- **`github.com/allegro/bigcache`** - Zero-GC overhead cache
  - No GC pressure (critical for low latency)
  - Sharded by design
  - Simple API

### Observability
- **`github.com/prometheus/client_golang`** - Metrics exposition
- **`runtime/pprof`** - Built-in profiling (no external deps)

### Optional (Post-MVP)
- **`github.com/valyala/fasthttp`** - For DNS-over-HTTPS (DoH)

## Security Considerations

- Validate all input sizes to prevent buffer overflows
- Implement rate limiting to prevent DNS amplification attacks
- Protect against cache poisoning with proper validation
- Use randomized source ports for outbound queries (RFC 5452)
- Implement query name randomization (0x20 bit) for security
- Regular security audits and fuzzing (go-fuzz)
- DNSSEC validation for authenticated responses
