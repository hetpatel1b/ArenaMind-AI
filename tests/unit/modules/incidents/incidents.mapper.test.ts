import { describe, it, expect } from 'vitest';
import { toIncidentDto } from '@/lib/modules/incidents/mapper';

describe('incidents.mapper', () => {
  it('maps missing dates securely', () => {
    const inc = { id: '1', resolvedAt: null, updatedAt: new Date(), tags: [] };
    const res = toIncidentDto(inc as any);
    expect(res.resolvedAt).toBeNull();
  });
});
