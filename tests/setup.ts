import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.JWT_SECRET = 'test_secret';
process.env.OPENAI_API_KEY = 'test_key';

afterEach(() => {
  cleanup();
});

// Mock server-only to prevent it from throwing errors in jsdom environment
vi.mock('server-only', () => ({}));
