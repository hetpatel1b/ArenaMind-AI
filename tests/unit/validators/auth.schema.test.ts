import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../../../src/server/validators/auth.schema';

describe('Auth Validators', () => {
  describe('loginSchema', () => {
    it('accepts a valid payload', () => {
      const payload = { email: 'test@example.com', password: 'password123' };
      const result = loginSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects an invalid email', () => {
      const payload = { email: 'invalid-email', password: 'password123' };
      const result = loginSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error!.issues[0]!.message).toBe('Invalid email address');
      }
    });

    it('rejects a short password', () => {
      const payload = { email: 'test@example.com', password: 'short' };
      const result = loginSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error!.issues[0]!.message).toBe('Password must be at least 8 characters');
      }
    });

    it('rejects missing fields', () => {
      const payload = { email: 'test@example.com' }; // missing password
      const result = loginSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects wrong types', () => {
      const payload = { email: 'test@example.com', password: 12345678 }; // password is a number
      const result = loginSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('accepts a valid payload without organizationId', () => {
      const payload = { email: 'test@example.com', password: 'password123', name: 'John Doe' };
      const result = registerSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('accepts a valid payload with organizationId', () => {
      const payload = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
      };
      const result = registerSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects an invalid organizationId format', () => {
      const payload = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        organizationId: 'not-a-uuid',
      };
      const result = registerSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects a short name', () => {
      const payload = { email: 'test@example.com', password: 'password123', name: 'A' };
      const result = registerSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
