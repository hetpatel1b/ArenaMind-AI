import { describe, it, expect } from 'vitest';
import { ConfigurationService } from '@/lib/platform/config/ConfigurationService';

describe.skip('ConfigurationService', () => {
  it.skip('returns default config', () => {
    const config = ConfigurationService.getInstance();
    expect(config.getConfig('tenant')).toBeDefined();
    expect(config.getConfig('intelligence')).toBeDefined();
  });
  
  it.skip('allows updating config', () => {
    const config = ConfigurationService.getInstance();
    config.updateConfig('tenant', { id: 'new' });
    expect(config.getConfig('tenant').id).toBe('new');
  });
});