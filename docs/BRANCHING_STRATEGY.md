# Branching Strategy

We use a simplified Git Flow for our development process.

## Branches

- `main`: Production-ready code.
- `develop`: Pre-production code. All feature branches merge here.
- `feature/*`: New features. Branch off from `develop`, merge back into `develop`.
- `bugfix/*`: Bug fixes. Branch off from `develop`, merge back into `develop`.
- `hotfix/*`: Urgent fixes for production. Branch off from `main`, merge back into `main` and `develop`.

## Pull Requests

All changes must be made via Pull Requests. Direct commits to `main` and `develop` are strictly prohibited.
