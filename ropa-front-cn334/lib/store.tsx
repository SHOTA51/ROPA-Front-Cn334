'use client';

import React from 'react';
import { Role, Permissions, ROLE_PERMISSIONS } from './permissions';
import { AuthProvider, useAuth } from './AuthContext';

export function RoleProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export function useRole(): {
  role: Role;
  setRole: (r: Role) => void;
  permissions: Permissions;
} {
  const { roleName } = useAuth();
  const role: Role = (roleName as Role) || 'Admin';
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.Admin;
  return {
    role,
    setRole: () => {},
    permissions,
  };
}
