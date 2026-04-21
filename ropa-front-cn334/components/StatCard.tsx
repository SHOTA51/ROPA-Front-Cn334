import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  extra?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconColor, bgColor, extra }) => {
  return (
    <div className={`flex items-center gap-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex-1 relative`}>
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bgColor}`}>
        <Icon size={32} className={iconColor} />
      </div>
      <div className="flex flex-col">
        <span className="text-gray-500 text-lg font-medium">{title}</span>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      {extra && <div className="absolute bottom-4 right-6">{extra}</div>}
    </div>
  );
};

export default StatCard;
