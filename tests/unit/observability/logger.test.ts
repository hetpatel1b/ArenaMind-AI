import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '@/lib/observability/logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs info messages in JSON format', () => {
    logger.info('Test info', { userId: '123' });
    expect(console.log).toHaveBeenCalledTimes(1);
    
    const loggedOutput = vi.mocked(console.log).mock.calls[0][0];
    const parsed = JSON.parse(loggedOutput as string);
    
    expect(parsed.level).toBe('INFO');
    expect(parsed.message).toBe('Test info');
    expect(parsed.userId).toBe('123');
    expect(parsed.timestamp).toBeDefined();
  });

  it('logs warn messages in JSON format', () => {
    logger.warn('Test warn');
    expect(console.warn).toHaveBeenCalledTimes(1);
    
    const loggedOutput = vi.mocked(console.warn).mock.calls[0][0];
    const parsed = JSON.parse(loggedOutput as string);
    
    expect(parsed.level).toBe('WARN');
    expect(parsed.message).toBe('Test warn');
  });

  it('logs error messages in JSON format', () => {
    logger.error('Test error');
    expect(console.error).toHaveBeenCalledTimes(1);
    
    const loggedOutput = vi.mocked(console.error).mock.calls[0][0];
    const parsed = JSON.parse(loggedOutput as string);
    
    expect(parsed.level).toBe('ERROR');
    expect(parsed.message).toBe('Test error');
  });

  it('logs debug messages only in development', () => {
    const originalEnv = process.env.NODE_ENV;
    
    process.env.NODE_ENV = 'production';
    logger.debug('Test debug');
    expect(console.debug).not.toHaveBeenCalled();
    
    process.env.NODE_ENV = 'development';
    logger.debug('Test debug dev');
    expect(console.debug).toHaveBeenCalledTimes(1);
    
    process.env.NODE_ENV = originalEnv;
  });
});
