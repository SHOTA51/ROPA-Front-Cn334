export type Role = 'Admin' | 'DataOwner' | 'DPO' | 'Auditor' | 'Executive';

export interface Permissions {
  sidebar: {
    dashboard: boolean;
    user: boolean;
    auditLogs: boolean;
    analytics: boolean;
    ropa: boolean;
  };
  dashboard: {
    import: boolean;
    export: boolean;
    pendingRequest: boolean;
  };
  user: {
    create: boolean;
    edit: boolean;
    delete: boolean;
    viewDetails: boolean;
  };
}

export const ROLE_PERMISSIONS: Record<Role, Permissions> = {
  'Admin': {
    sidebar: { dashboard: true, user: true, auditLogs: true, analytics: true, ropa: true },
    dashboard: { import: true, export: true, pendingRequest: false },
    user: { create: true, edit: true, delete: true, viewDetails: true },
  },
  'DataOwner': {
    sidebar: { dashboard: true, user: false, auditLogs: false, analytics: true, ropa: true },
    dashboard: { import: true, export: true, pendingRequest: false },
    user: { create: false, edit: false, delete: false, viewDetails: false },
  },
  'DPO': {
    sidebar: { dashboard: true, user: true, auditLogs: true, analytics: true, ropa: true },
    dashboard: { import: true, export: true, pendingRequest: true },
    user: { create: false, edit: false, delete: false, viewDetails: true },
  },
  'Auditor': {
    sidebar: { dashboard: true, user: true, auditLogs: true, analytics: true, ropa: true },
    dashboard: { import: false, export: true, pendingRequest: false },
    user: { create: false, edit: false, delete: false, viewDetails: true },
  },
  'Executive': {
    sidebar: { dashboard: true, user: false, auditLogs: false, analytics: true, ropa: true },
    dashboard: { import: false, export: true, pendingRequest: false },
    user: { create: false, edit: false, delete: false, viewDetails: false },
  },
};
