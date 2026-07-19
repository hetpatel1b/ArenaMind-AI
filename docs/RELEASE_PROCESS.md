# Release Process

Releases in ArenaMind are entirely automated using GitHub Actions.

## Triggering a Release

1. Ensure all code is merged into `main` and CI pipeline passes.
2. Push a new SemVer tag to GitHub:
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

## Automation Steps

The `release.yml` workflow takes over automatically:

1. Validates the repository and dependencies.
2. Performs a strictly verified Next.js production build.
3. Packages the build into a minimal Docker container.
4. Pushes the artifact to the GitHub Container Registry.
5. Generates a formal GitHub Release complete with auto-generated release notes detailing PRs merged since the last tag.

## Metadata Exposure

The active running release securely exposes its provenance via `GET /api/v1/version`, showing commit hashes and build dates to guarantee exact replica auditing.
