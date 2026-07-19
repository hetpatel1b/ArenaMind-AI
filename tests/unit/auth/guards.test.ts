import { describe, it, expect } from 'vitest';
import { hasPermission, Permissions } from '../../../src/lib/auth/permissions';
import { UserRole } from '@prisma/client';

describe('Role-Based Access Control (RBAC) Verification', () => {
  describe('System Admin Permissions', () => {
    it('should have access to all permissions', () => {
      Object.values(Permissions).forEach((permission) => {
        expect(hasPermission(UserRole.super_admin, permission)).toBe(true);
      });
    });
  });

  describe('Operations Manager Permissions', () => {
    it('should be able to approve AI recommendations', () => {
      expect(hasPermission(UserRole.operations_manager, Permissions.APPROVE_AI)).toBe(true);
    });

    it('should be able to change tournament phases', () => {
      expect(hasPermission(UserRole.operations_manager, Permissions.CHANGE_PHASE)).toBe(true);
    });
  });

  describe('Coordinator Permissions', () => {
    it('should NOT be able to approve AI recommendations', () => {
      expect(hasPermission(UserRole.coordinator, Permissions.APPROVE_AI)).toBe(false);
    });

    it('should NOT be able to dispatch resources independently', () => {
      expect(hasPermission(UserRole.coordinator, Permissions.DISPATCH_RESOURCE)).toBe(false);
    });

    it('should be able to view and create incidents', () => {
      expect(hasPermission(UserRole.coordinator, Permissions.VIEW_INCIDENTS)).toBe(true);
      expect(hasPermission(UserRole.coordinator, Permissions.CREATE_INCIDENT)).toBe(true);
    });
  });
});
