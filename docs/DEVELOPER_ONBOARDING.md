# Developer Onboarding Guide

Welcome to the ArenaMind AI Engineering team! This guide will help you get your local environment set up to enterprise standards.

## 1. Prerequisites

- **Node.js**: We strictly use Node v20. We recommend using `nvm`. Run `nvm use` in the project root.
- **pnpm**: We use `pnpm` (v10+) for fast, deterministic dependency management.
- **Git**: Ensure your Git is configured with your corporate email.

## 2. Setup

1. Clone the repository: `git clone <repo-url>`
2. Copy environment files:
   ```bash
   cp .env.example .env.development
   ```
   _Ask your team lead for any required secret keys._
3. Install dependencies:
   ```bash
   pnpm install
   ```
   _This automatically sets up Husky git hooks._
4. Start the development server:
   ```bash
   pnpm run dev
   ```

## 3. Development Standards

- **Commits**: We strictly enforce Conventional Commits. Husky will intercept invalid commit messages.
- **Code Quality**: Prettier and ESLint run automatically on commit. Ensure your code has 0 warnings.
- **Branching**: Do not commit to `main` or `develop` directly. See `BRANCHING_STRATEGY.md`.

## 4. IDE Setup

If you use VS Code, open this repository at the root. You will be prompted to install recommended extensions. Our workspace `.vscode` configuration will automatically configure "format on save" and import sorting.
