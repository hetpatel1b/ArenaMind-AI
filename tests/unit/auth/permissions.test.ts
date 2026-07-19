import { describe, it, expect } from 'vitest';
import { UserRole } from '@prisma/client';
import { Permissions, ROLE_PERMISSIONS, hasPermission } from '../../../src/lib/auth/permissions';

describe('Permissions & Roles', () => {
  describe('hasPermission', () => {
    it('returns true if the role has the specific permission', () => {
      expect(hasPermission(UserRole.operations_manager, Permissions.VIEW_DASHBOARD)).toBe(true);
      expect(hasPermission(UserRole.deputy_manager, Permissions.CREATE_INCIDENT)).toBe(true);
      expect(hasPermission(UserRole.coordinator, Permissions.VIEW_INCIDENTS)).toBe(true);
    });

    it('returns false if the role lacks the specific permission', () => {
      // Coordinator does not have DISPATCH_RESOURCE or MANAGE_USERS
      expect(hasPermission(UserRole.coordinator, Permissions.DISPATCH_RESOURCE)).toBe(false);
      expect(hasPermission(UserRole.coordinator, Permissions.MANAGE_USERS)).toBe(false);

      // Deputy Manager does not have CHANGE_PHASE
      expect(hasPermission(UserRole.deputy_manager, Permissions.CHANGE_PHASE)).toBe(false);
    });

    it('super_admin and organization_admin have all permissions', () => {
      Object.values(Permissions).forEach((permission) => {
        expect(hasPermission(UserRole.super_admin, permission)).toBe(true);
        expect(hasPermission(UserRole.organization_admin, permission)).toBe(true);
      });
    });

    it('returns false for invalid roles', () => {
      expect(hasPermission('invalid_role' as UserRole, Permissions.VIEW_DASHBOARD)).toBe(false);
    });

    it('returns false for roles with undefined permissions in map', () => {
      // Temporarily mock ROLE_PERMISSIONS to simulate a missing role
      const original = ROLE_PERMISSIONS[UserRole.operations_manager];
      (ROLE_PERMISSIONS as any)[UserRole.operations_manager] = undefined;

      expect(hasPermission(UserRole.operations_manager, Permissions.VIEW_DASHBOARD)).toBe(false);

      // Restore
      (ROLE_PERMISSIONS as any)[UserRole.operations_manager] = original;
    });

    it('returns false for unknown permissions', () => {
      expect(hasPermission(UserRole.super_admin, 'unknown_permission' as any)).toBe(false);
    });
  });

  describe('ROLE_PERMISSIONS definition', () => {
    it('contains definitions for known roles', () => {
      expect(ROLE_PERMISSIONS[UserRole.operations_manager]).toBeDefined();
      expect(ROLE_PERMISSIONS[UserRole.deputy_manager]).toBeDefined();
      expect(ROLE_PERMISSIONS[UserRole.coordinator]).toBeDefined();
      expect(ROLE_PERMISSIONS[UserRole.super_admin]).toBeDefined();
      expect(ROLE_PERMISSIONS[UserRole.organization_admin]).toBeDefined();
    });
  });
});
