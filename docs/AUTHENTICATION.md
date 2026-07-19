# ArenaMind Authentication

## Overview

ArenaMind uses **NextAuth.js (Auth.js)** as the core identity provider.

## Providers

- SSO Providers: Microsoft Entra ID (Azure AD), Google Workspace.
- Local: Strict bcrypt-hashed passwords for external contractors, strictly tied to Email domains.

## Security Controls

- **JWT**: Stateless JSON Web Tokens are utilized to scale across edge functions.
- **Expiration**: Short-lived access tokens (1h) with rolling refresh logic.
- **MFA Check**: Verified at the edge layer; users without MFA enabled on their tenant are forced into a restricted state.
- **Bcrypt**: Rounds are configured to 12 for optimal CPU balancing against brute-force attacks.

## Environment Validation

All NextAuth keys and Provider Secrets are strictly validated via Zod schemas at startup (`src/env.mjs`). Missing secrets will crash the server immediately.
