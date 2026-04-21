'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  BarChart3, 
  LogOut,
  UserCircle
} from 'lucide-react';
import { useRole } from '../lib/store';

const Sidebar = () => {
  const pathname = usePathname();
  const { role, permissions } = useRole();

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={24} />, 
      path: '/dashboard',
      visible: permissions.sidebar.dashboard 
    },
    { 
      name: 'User', 
      icon: <Users size={24} />, 
      path: '/user',
      visible: permissions.sidebar.user
    },
    { 
      name: 'Audit Logs', 
      icon: <ClipboardList size={24} />, 
      path: '/audit-logs',
      visible: permissions.sidebar.auditLogs
    },
    { 
      name: 'Analytics', 
      icon: <BarChart3 size={24} />, 
      path: '/analytics',
      visible: permissions.sidebar.analytics
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#0F172A] text-white flex flex-col z-40">
      {/* Brand Identity */}
      <div className="p-8 flex items-center gap-3">
        <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
           <img src="/kcsp.png" alt="KCSP Logo" className="h-8 w-8 object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight">KCSP</span>
          <span className="text-xs text-gray-400 font-medium">RoPA</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          item.visible && (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                pathname === item.path
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`${pathname === item.path ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="text-lg font-medium">{item.name}</span>
            </Link>
          )
        ))}
      </nav>

      {/* Footer: User Profile & Logout */}
      <div className="p-6 mt-auto border-t border-white/5 space-y-4">
        <div className="flex items-center gap-4 px-2">
          <div className="h-12 w-12 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5">
            <UserCircle size={32} className="text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">หัวหน้า</span>
            <span className="text-sm text-gray-400">{role}</span>
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-[#FCA5A5] hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={24} />
          <span className="text-lg font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
