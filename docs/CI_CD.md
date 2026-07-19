# CI/CD Pipeline Architecture

ArenaMind employs a robust, fully automated CI/CD pipeline built on GitHub Actions.

## Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

Runs on every push and pull request to the `main` branch.

- Validates code with ESLint and TypeScript.
- Generates Prisma client and validates database schema.
- Executes the full unit test suite.
- Performs a Next.js production build.
- Validates the Dockerfile by performing a test container build.

### 2. Security Checks (`.github/workflows/security.yml`)

Runs on every push, PR, and on a nightly schedule.

- Performs `npm audit` for vulnerability scanning.
- Reviews dependency changes for malicious additions.
- Scans the repository for leaked secrets (TruffleHog).
- Validates OSS license compliance (forbids GPL-3.0 in this environment).

### 3. Release Pipeline (`.github/workflows/release.yml`)

Triggered automatically when a SemVer tag (e.g., `v1.0.0`) is pushed.

- Builds the optimized production Docker image.
- Pushes the image to GitHub Container Registry (`ghcr.io`).
- Creates a GitHub Release with auto-generated release notes.
