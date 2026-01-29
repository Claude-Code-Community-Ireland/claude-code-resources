---
name: testing-strategy
description: Test pyramid and testing strategy — unit, integration, and end-to-end test ratios, mocking strategies, test isolation, and what to test. Reference when planning test coverage or evaluating test quality.
---

# Testing Strategy

## Test Pyramid

```
        /  E2E  \          ~10% — Slow, brittle, expensive
       /  Integ  \         ~20% — Medium speed, real dependencies
      /   Unit    \        ~70% — Fast, isolated, numerous
     /______________\
```

| Layer       | Count  | Speed     | Scope                        | Runs           |
|-------------|--------|-----------|------------------------------|----------------|
| Unit        | ~70%   | < 10ms   | Single function or class     | Every commit   |
| Integration | ~20%   | < 5s     | Multiple components together | Every push     |
| E2E         | ~10%   | < 60s    | Full user workflow           | Pre-merge, CI  |

If the pyramid inverts (more E2E than unit), treat it as a structural problem.

## Unit Test Principles

### FIRST Properties

| Property            | Rule                                                       |
|---------------------|------------------------------------------------------------|
| **Fast**            | Entire unit suite runs in under 30 seconds                 |
| **Isolated**        | No test depends on another test's execution or state       |
| **Repeatable**      | Same result every run, regardless of time, network, or OS  |
| **Self-validating** | Pass or fail with no manual inspection needed              |
| **Timely**          | Written before or alongside the production code            |

### What to Unit Test

- [ ] Pure functions and their edge cases
- [ ] Business logic and calculations
- [ ] State transitions and validation rules
- [ ] Data transformations and mappings
- [ ] Error handling paths
- [ ] Boundary conditions (empty, null, max, min, off-by-one)

### What NOT to Unit Test

- [ ] Framework configuration or boilerplate
- [ ] Simple getters/setters with no logic
- [ ] Third-party library internals
- [ ] Private methods directly (test through public interface)

### Arrange-Act-Assert

```typescript
describe("calculateDiscount", () => {
  it("applies 10% discount for orders over $100", () => {
    // Arrange
    const order = { items: [{ price: 120, quantity: 1 }] };
    // Act
    const result = calculateDiscount(order);
    // Assert
    expect(result.discount).toBe(12);
    expect(result.total).toBe(108);
  });
});
```

```python
class TestCalculateDiscount:
    def test_applies_10_percent_for_orders_over_100(self):
        order = Order(items=[Item(price=120, quantity=1)])
        result = calculate_discount(order)
        assert result.discount == 12
        assert result.total == 108
```

## Integration Test Scope

| Category            | Example                                               |
|---------------------|-------------------------------------------------------|
| Database queries    | Repository methods with a real (test) database        |
| API endpoints       | HTTP request through middleware, handler, and response |
| External services   | Calls to third-party APIs with sandboxed accounts     |
| Message queues      | Publish and consume cycle with real broker             |
| File system         | Read/write operations with temp directories           |
| Cache layers        | Cache set, get, invalidation with real cache           |

```typescript
describe("UserRepository", () => {
  let db: Database;
  beforeAll(async () => { db = await createTestDatabase(); await db.migrate(); });
  afterAll(async () => { await db.close(); });
  beforeEach(async () => { await db.truncateAll(); });

  it("finds user by email", async () => {
    await db.insert("users", { email: "test@example.com", name: "Test User" });
    const user = await userRepo.findByEmail("test@example.com");
    expect(user).not.toBeNull();
    expect(user.name).toBe("Test User");
  });
});
```

### Integration Test Rules

- [ ] Use a dedicated test database, never production data
- [ ] Reset state between tests (truncate tables, clear queues)
- [ ] Use test containers or in-memory databases where possible
- [ ] Test the happy path and the most critical error paths

## E2E Test Selection Criteria

**Include:** Critical revenue paths (signup, checkout, payment), authentication flows, core user journeys (3-5 things your product must do), cross-system workflows.

**Exclude:** Edge cases (cover in unit tests), UI-only validation, admin features, scenarios covered by lower-level tests.

```typescript
test("user can complete checkout", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', "user@test.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');
  await page.goto("/products/widget-1");
  await page.click("text=Add to Cart");
  await page.goto("/cart");
  await page.click("text=Checkout");
  await page.fill('[name="card"]', "4242424242424242");
  await page.click("text=Place Order");
  await expect(page.locator(".order-confirmation")).toBeVisible();
});
```

## Mocking Guidelines

### When to Mock

| Mock                            | Reason                                        |
|---------------------------------|-----------------------------------------------|
| External HTTP APIs              | Avoid network dependency and rate limits       |
| Time and date functions         | Enable deterministic time-based tests          |
| Random number generators        | Enable reproducible outputs                    |
| Email/SMS/notification services | Prevent sending real messages                  |
| Payment processors              | Avoid real charges during tests                |

### When NOT to Mock

| Do Not Mock                | Reason                                              |
|----------------------------|-----------------------------------------------------|
| The module under test      | You would be testing your mock, not your code       |
| Simple value objects       | No external dependency, no side effects             |
| Standard library functions | Trusted, deterministic, fast                        |
| Database in integration    | The database interaction is what you are testing    |
| Everything by default      | Over-mocking makes tests pass even when code breaks |

```typescript
// Good: mock the HTTP client, not the service
const mockHttpClient = { get: jest.fn().mockResolvedValue({ data: { id: 1, name: "Test" } }) };
const service = new UserService(mockHttpClient);

// Bad: mocking the method you are testing
jest.spyOn(service, "getUser").mockResolvedValue({ id: 1 });
```

## Test Fixtures and Factories

Prefer factories over shared fixtures to keep tests independent.

```typescript
function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: randomUUID(),
    email: `user-${Date.now()}@test.com`,
    name: "Test User",
    role: "member",
    createdAt: new Date(),
    ...overrides,
  };
}
const admin = buildUser({ role: "admin" });
```

- [ ] Generate unique values to prevent cross-test contamination
- [ ] Use factories with sensible defaults and explicit overrides
- [ ] Keep test data minimal; only set fields relevant to the assertion
- [ ] Never share mutable state between tests

## Property-Based Testing

Test invariants with randomly generated inputs.

```typescript
import fc from "fast-check";

test("sort is idempotent", () => {
  fc.assert(fc.property(fc.array(fc.integer()), (arr) => {
    expect(sort(sort(arr))).toEqual(sort(arr));
  }));
});

test("encode/decode roundtrip", () => {
  fc.assert(fc.property(fc.string(), (input) => {
    expect(decode(encode(input))).toBe(input);
  }));
});
```

Use for: serialization roundtrips, sorting invariants, mathematical properties, parsers, encoding.

## Snapshot Testing

**Appropriate:** Serialized output formats, generated config files, stable component render output.
**Harmful:** Large frequently-changing outputs, UI with dynamic content, testing logic or behavior.

- [ ] Review snapshot diffs carefully; never blindly update
- [ ] Keep snapshots small and focused
- [ ] Use inline snapshots for short outputs

## Coverage Metrics

| Metric              | Target  | Notes                                        |
|---------------------|---------|----------------------------------------------|
| Line coverage       | >= 80%  | Reasonable baseline for most projects        |
| Branch coverage     | >= 75%  | More meaningful than line coverage           |
| Critical path       | >= 95%  | Auth, payments, data integrity               |
| New code coverage   | >= 90%  | Enforce on PRs with coverage diff tools      |

- [ ] Track coverage trends over time, not just absolute numbers
- [ ] Never game coverage with meaningless tests
- [ ] 100% coverage does not mean bug-free; focus on meaningful assertions
- [ ] Exclude generated code, vendor code, and config from metrics

## Testing Anti-Patterns

| Anti-Pattern             | Problem                                          | Fix                                       |
|--------------------------|--------------------------------------------------|-------------------------------------------|
| Testing implementation   | Breaks when refactoring, even if behavior is same | Test behavior and outputs                |
| Flaky tests              | Erodes trust, gets ignored                       | Fix or delete immediately                |
| Slow test suite          | Developers skip running tests                    | Parallelize, mock I/O, split by layer    |
| Over-mocking             | Tests pass but code is broken                    | Mock boundaries only                     |
| Shared mutable state     | Tests pass alone, fail together                  | Isolate state per test, use factories    |
| Testing private methods  | Couples tests to implementation details          | Test through the public API              |
| No assertion             | Test passes without verifying anything           | Every test must assert something         |
| Ignoring test failures   | Hides real bugs                                  | Fix or remove; never skip permanently    |

## Test Naming Conventions

```
// describe/it style
describe("ShoppingCart")
  it("calculates total with tax for items in cart")

// given/when/then style
test("given an empty cart, when adding an item, then total reflects item price")

// should style
test("should return 404 when user is not found")
```

- [ ] Name describes the scenario and expected outcome
- [ ] Name reads as a sentence or specification
- [ ] Failed test name tells you what broke without reading the code
