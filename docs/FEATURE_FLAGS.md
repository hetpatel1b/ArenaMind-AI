# Feature Flags

The `FeatureFlagService` enables safe rollout mechanisms without deploying new code.

## Capabilities

- **Percentage Rollouts**: Stably deploy features to a subset of users using deterministic hashing.
- **Environment Isolation**: Prevent features from running in production while enabled in staging.
- **Organization Whitelisting**: Enable beta features strictly for specific Enterprise tenants.

## Usage

Wrap new integrations like so:

```typescript
if (FeatureFlagService.isEnabled('new-dashboard', { environment: config.nodeEnv })) {
  // Use new feature
}
```
