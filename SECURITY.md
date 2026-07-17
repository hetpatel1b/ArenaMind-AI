# Security Policy

## Supported Versions

| Version | Supported         |
| ------- | ----------------- |
| 1.0.x   | ✅ Active support |
| < 1.0   | ❌ Not supported  |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in ArenaMind, please report it responsibly using the process below.

### How to Report

Send a detailed report to the project maintainers via a **private GitHub Security Advisory** on this repository, or contact the security team directly at the email address listed in the repository profile.

Include the following in your report:

1. **Description** — A clear description of the vulnerability
2. **Impact** — The potential impact and severity (e.g., data exposure, privilege escalation)
3. **Reproduction Steps** — Step-by-step instructions to reproduce the issue
4. **Environment** — Relevant software versions, operating system, and configuration
5. **Suggested Fix** — If you have a proposed remediation (optional)

### Disclosure Policy

- We follow a **coordinated disclosure** model.
- Please allow up to **90 days** for a fix before public disclosure.
- We will acknowledge receipt of your report within **48 hours**.
- We will provide a timeline for remediation within **7 business days**.
- Credit will be given to reporters in the release notes (unless anonymity is requested).

### Response Timeline

| Stage              | Timeframe                                          |
| ------------------ | -------------------------------------------------- |
| Acknowledgement    | Within 48 hours                                    |
| Initial Assessment | Within 7 business days                             |
| Patch Development  | Within 30 days (critical) / 90 days (non-critical) |
| Public Disclosure  | After patch release                                |

## Security Best Practices

ArenaMind implements the following security measures:

- **Authentication** — NextAuth.js v5 with bcrypt password hashing
- **Authorization** — Role-Based Access Control (RBAC) with Prisma-backed policies
- **Input Validation** — Zod schema validation on all API endpoints
- **Security Headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Rate Limiting** — Token bucket algorithm on API routes
- **AI Safety** — Prompt injection detection, hallucination guard, content safety filtering
- **Dependency Audit** — Automated `pnpm audit` in CI pipeline
- **Secret Management** — Environment-based configuration, no credentials in source control

## Security Contact

For security inquiries, use the **GitHub Security Advisories** feature on this repository.
