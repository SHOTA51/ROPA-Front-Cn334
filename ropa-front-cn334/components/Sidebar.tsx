'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ClipboardList, BarChart3, LogOut, User as UserIcon } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'User', href: '/user', icon: Users },
  { name: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 flex h-full w-[280px] flex-col bg-[#0F172A] text-white">
      {/* Logo Area */}
      <div className="flex items-center gap-3 p-8 pt-10">
        <div className="relative w-12 h-12">
          <Image 
            src="/kcsp.png" 
            alt="KCSP Logo" 
            fill
            className="object-contain brightness-110"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight leading-tight">KCSP</span>
          <span className="text-sm font-normal text-gray-400">RoPA</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-200 ${
                isActive
                  ? 'bg-[#1E293B] text-blue-400 border-l-4 border-blue-500 rounded-l-none'
                  : 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
              }`}
            >
              <Icon size={24} />
              <span className="text-lg font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="mt-auto border-t border-gray-800 p-6 space-y-6">
        <div className="flex items-center gap-4 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 text-white overflow-hidden">
             <UserIcon size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-medium leading-tight">หัวหน้า</span>
            <span className="text-sm font-normal text-gray-400">Admin</span>
          </div>
        </div>
        
        <Link 
          href="/login"
          className="flex items-center gap-4 px-4 py-2 text-[#FCA5A5] hover:text-red-400 transition-colors"
        >
          <LogOut size={24} />
          <span className="text-lg font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
