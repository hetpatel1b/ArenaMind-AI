import { describe, it, expect } from 'vitest';
import { hasPermission, Permissions } from '../../../src/lib/auth/permissions';
import { Roles } from '../../../src/lib/auth/constants';

describe('Role-Based Access Control (RBAC) Verification', () => {
  describe('System Admin Permissions', () => {
    it('should have access to all permissions', () => {
      Object.values(Permissions).forEach((permission) => {
        expect(hasPermission(Roles.SYSTEM_ADMIN, permission)).toBe(true);
      });
    });
  });

  describe('Operations Manager Permissions', () => {
    it('should be able to approve AI recommendations', () => {
      expect(hasPermission(Roles.OPERATIONS_MANAGER, Permissions.APPROVE_AI)).toBe(true);
    });

    it('should be able to change tournament phases', () => {
      expect(hasPermission(Roles.OPERATIONS_MANAGER, Permissions.CHANGE_PHASE)).toBe(true);
    });
  });

  describe('Coordinator Permissions', () => {
    it('should NOT be able to approve AI recommendations', () => {
      expect(hasPermission(Roles.COORDINATOR, Permissions.APPROVE_AI)).toBe(false);
    });

    it('should NOT be able to dispatch resources independently', () => {
      expect(hasPermission(Roles.COORDINATOR, Permissions.DISPATCH_RESOURCE)).toBe(false);
    });

    it('should be able to view and create incidents', () => {
      expect(hasPermission(Roles.COORDINATOR, Permissions.VIEW_INCIDENTS)).toBe(true);
      expect(hasPermission(Roles.COORDINATOR, Permissions.CREATE_INCIDENT)).toBe(true);
    });
  });
});
