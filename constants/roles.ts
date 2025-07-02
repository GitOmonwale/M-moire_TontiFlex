export const ROLES = {
  CLIENT: 'CLIENT',
  AGENT_SFD: 'AGENT_SFD',
  SUPERVISOR: 'SUPERVISOR',
  ADMIN_SFD: 'ADMIN_SFD',
  ADMINPLAT: 'ADMINPLAT'
} as const;

export type UserRole = keyof typeof ROLES;

export type RoleKey = 'CLIENT' | 'AGENT_SFD' | 'SUPERVISOR' | 'ADMIN_SFD' | 'ADMINPLAT';

export const ROLE_MAPPING: Record<RoleKey, string> = {
  [ROLES.ADMINPLAT]: 'admin',
  [ROLES.ADMIN_SFD]: 'adminsfd',
  [ROLES.CLIENT]: 'client',
  [ROLES.AGENT_SFD]: 'agent',
  [ROLES.SUPERVISOR]: 'supervisor'
} as const;

export const DEFAULT_ROUTES: Record<RoleKey, string> = {
  [ROLES.ADMINPLAT]: '/dashboards/dashboard-admin',
  [ROLES.ADMIN_SFD]: '/dashboards/dashboard-adminsfd',
  [ROLES.CLIENT]: '/dashboards/dashboard-client',
  [ROLES.AGENT_SFD]: '/dashboards/dashboard-agent',
  [ROLES.SUPERVISOR]: '/dashboards/dashboard-supervisor'
} as const;
