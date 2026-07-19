# ArenaMind Testing Standards & Architecture

Welcome to the ArenaMind Enterprise Testing Infrastructure. This document outlines the standards, policies, and conventions required for all future testing across the repository.

## Folder Convention

The `tests/` directory is standardized to maintain a clean architecture:

- `unit/`: Isolated unit tests for individual functions, components, and classes. Mocks external dependencies.
- `integration/`: Tests that verify interactions between multiple units (e.g., Services to Database, Routes to Services).
- `e2e/`: End-to-end tests using Playwright simulating real user flows across the full stack.
- `helpers/`: Reusable utility functions for setting up test conditions (e.g., `renderWithProviders`, `createAuthenticatedRequest`).
- `mocks/`: Centralized mocks for external libraries and dependencies (e.g., Prisma, Redis, next-auth). Local duplicated mocks are prohibited.
- `factories/`: Deterministic object generators for tests (e.g., `createUser()`). Must never use random values.
- `fixtures/`: Static data payloads or JSON responses used across multiple test files.
- `utils/`: Legacy utilities folder (deprecated). Use `helpers/` instead.

## Naming Convention

- **Test Files**: Must end in `.test.ts` or `.test.tsx` (e.g., `button.test.tsx`, `auth.service.test.ts`).
- **Factories**: Must end in `.factory.ts` (e.g., `user.factory.ts`).
- **Mocks**: Must end in `.mock.ts` (e.g., `prisma.mock.ts`).
- **Helpers**: Must end in `.helpers.ts` or explicitly describe their function (e.g., `auth.helpers.ts`, `renderWithProviders.tsx`).

## Testing Policies

### AAA Pattern

All tests must strictly follow the **Arrange, Act, Assert** pattern:

1. **Arrange**: Set up the state, initialize factories, and configure mocks.
2. **Act**: Execute the function or component under test.
3. **Assert**: Verify the expected outcome.

### Isolation Rules

- Tests must be completely independent and deterministic.
- State must not leak between tests. Use `beforeEach` and `afterEach` to reset mocks and databases.
- Avoid using `setTimeout` or arbitrary delays; use mock timers (`vi.useFakeTimers()`) instead.

### Prohibited Patterns

The following patterns are strictly forbidden in this repository and will cause CI failure if merged:

- `.only` (Focusing a test)
- `.skip` (Skipping a test)
- `.todo` (Unimplemented test placeholders)
- Commenting out tests (Disabled tests)

### Coverage Policy

- We enforce strict coverage thresholds via `vitest.config.ts`.
- **Minimum Thresholds**: Statements (60%), Branches (60%), Functions (60%), Lines (60%).
- Code coverage is not a metric to game; do not create fake tests or artificially call functions just to bump coverage. Test behavior, not lines.

### Mock & Factory Policy

- **Follow DRY (Don't Repeat Yourself)**: Do not create a new mock or factory if one already exists in `tests/mocks/` or `tests/factories/`.
- **Deterministic Factories**: Factories must use consistent defaults. If you need a specific state, pass an override object to the factory rather than adding randomness (e.g., `Math.random()` or faker libraries).

---

_This foundation was established in Sprint D1.1. All future logic additions must comply with these architectural constraints._
