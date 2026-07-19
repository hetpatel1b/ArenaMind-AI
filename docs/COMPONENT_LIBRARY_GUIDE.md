# ArenaMind AI Component Library Guide

## Overview

This library provides the atomic UI building blocks for the ArenaMind AI dashboard. Located in `src/app/components/ui/`, these components strictly utilize the Phase 3.1 Design System variables.

## Groupings

To prevent directory bloat, components are grouped logically:

- **`FeedbackComponents.tsx`**: `LoadingSkeleton`, `EmptyState`, `ErrorState`. Use these universally when wrapping async data fetches.
- **`KpiComponents.tsx`**: Metric and Health cards. Note: `TrendCard` accepts a `trend` prop (`up`, `down`, `neutral`) that automatically maps to semantic status colors.
- **`AiComponents.tsx`**: Standardized cards for rendering GenAI outputs, including `ExplainabilityCard` for auditing.
- **`IncidentComponents.tsx` / `CrowdComponents.tsx`**: Domain-specific UI abstractions (e.g., `DensityGauge`, `SeverityBadge`).
- **`DataGridComponents.tsx`**: Provides `EnterpriseTable`, a strictly typed generic `<T>` table that automatically handles empty states.

## Accessibility Guidelines

- All interactive elements (like `IncidentCard` with an `onClick` prop) dynamically inject `role="button"` and `tabIndex={0}`.
- Colors rely on `--status-critical`, `--status-warning`, etc., ensuring contrast compliance.

## Usage Example

```tsx
import { EnterpriseTable } from '@/app/components/ui/DataGridComponents';
import { SeverityBadge } from '@/app/components/ui/IncidentComponents';

// Usage
<EnterpriseTable
  data={incidents}
  columns={[
    { key: 'id', header: 'ID', render: (r) => r.id },
    { key: 'severity', header: 'Severity', render: (r) => <SeverityBadge severity={r.severity} /> },
  ]}
/>;
```
