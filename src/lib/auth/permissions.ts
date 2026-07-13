import { Role, Roles } from './constants';

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

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Roles.OPERATIONS_MANAGER]: [
    Permissions.VIEW_DASHBOARD,
    Permissions.VIEW_INCIDENTS,
    Permissions.CREATE_INCIDENT,
    Permissions.UPDATE_INCIDENT,
    Permissions.APPROVE_AI,
    Permissions.DISPATCH_RESOURCE,
    Permissions.VIEW_REPORTS,
    Permissions.CHANGE_PHASE,
  ],
  [Roles.DEPUTY_MANAGER]: [
    Permissions.VIEW_DASHBOARD,
    Permissions.VIEW_INCIDENTS,
    Permissions.CREATE_INCIDENT,
    Permissions.UPDATE_INCIDENT,
    Permissions.APPROVE_AI,
    Permissions.DISPATCH_RESOURCE,
    Permissions.VIEW_REPORTS,
  ],
  [Roles.COORDINATOR]: [
    Permissions.VIEW_DASHBOARD,
    Permissions.VIEW_INCIDENTS,
    Permissions.CREATE_INCIDENT,
    Permissions.UPDATE_INCIDENT,
  ],
  [Roles.SYSTEM_ADMIN]: [...Object.values(Permissions)],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions?.includes(permission) ?? false;
}
