export type AdminRole = 'super_admin' | 'manager' | 'staff';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  id: string;
  email: string;
  role: AdminRole;
}

export const ROLE_PERMISSIONS = {
  super_admin: {
    can_manage_products: true,
    can_manage_orders: true,
    can_manage_users: true,
    can_view_analytics: true,
  },
  manager: {
    can_manage_products: true,
    can_manage_orders: true,
    can_manage_users: false,
    can_view_analytics: true,
  },
  staff: {
    can_manage_products: false,
    can_manage_orders: false, // Can only view
    can_manage_users: false,
    can_view_analytics: false,
  },
} as const;

export function hasPermission(
  role: AdminRole,
  permission: keyof typeof ROLE_PERMISSIONS.super_admin
): boolean {
  return ROLE_PERMISSIONS[role][permission];
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  manager: 'Manager',
  staff: 'Staff',
};

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin: 'Full access to all features including user management',
  manager: 'Can manage products and orders',
  staff: 'Can view and update orders only',
};
