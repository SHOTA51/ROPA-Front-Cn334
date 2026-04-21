'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Permissions, ROLE_PERMISSIONS } from './permissions';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  permissions: Permissions;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('Admin');

  // Load from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('user-role') as Role;
    if (savedRole && ROLE_PERMISSIONS[savedRole]) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('user-role', newRole);
  };

  const permissions = ROLE_PERMISSIONS[role];

  return (
    <RoleContext.Provider value={{ role, setRole, permissions }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
