import { UserRole } from '@prisma/client';

export const Permissions = {
  VIEW_DASHBOARD: 'view:dashboard',
  VIEW_INCIDENTS: 'view:incidents',
  CREATE_INCIDENT: 'create:incident',
  UPDATE_INCIDENT: 'update:incident',
  APPROVE_AI: 'approve:ai_recommendation',
  DISPATCH_RESOURCE: 'dispatch:resource',
  VIEW_REPORTS: 'view:reports',
  CHANGE_PHASE: 'change:phase',
  MANAGE_USERS: 'manage:users',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

export const ROLE_PERMISSIONS: Partial<Record<UserRole, readonly Permission[]>> = {
  [UserRole.operations_manager]: [
    Permissions.VIEW_DASHBOARD,
    Permissions.VIEW_INCIDENTS,
    Permissions.CREATE_INCIDENT,
    Permissions.UPDATE_INCIDENT,
    Permissions.APPROVE_AI,
    Permissions.DISPATCH_RESOURCE,
    Permissions.VIEW_REPORTS,
    Permissions.CHANGE_PHASE,
  ],
  [UserRole.deputy_manager]: [
    Permissions.VIEW_DASHBOARD,
    Permissions.VIEW_INCIDENTS,
    Permissions.CREATE_INCIDENT,
    Permissions.UPDATE_INCIDENT,
    Permissions.APPROVE_AI,
    Permissions.DISPATCH_RESOURCE,
    Permissions.VIEW_REPORTS,
  ],
  [UserRole.coordinator]: [
    Permissions.VIEW_DASHBOARD,
    Permissions.VIEW_INCIDENTS,
    Permissions.CREATE_INCIDENT,
    Permissions.UPDATE_INCIDENT,
  ],
  [UserRole.super_admin]: [...Object.values(Permissions)],
  [UserRole.organization_admin]: [...Object.values(Permissions)],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions?.includes(permission) ?? false;
}
