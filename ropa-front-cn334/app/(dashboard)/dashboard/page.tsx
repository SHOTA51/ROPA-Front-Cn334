'use client';

import React from 'react';
import StatCard from '../../../components/StatCard';
import { 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Upload, 
  Download,
  Eye,
  ChevronDown
} from 'lucide-react';

const mockData = [
  { id: 1, purpose: 'การตลาดและโปรโมชั่น', status: 'pending', subject: 'Customer', category: 'Email, Phone', legalBasis: 'Consent', sensitivity: 'High', retentionPeriod: '1 year' },
  { id: 2, purpose: 'ให้บริการลูกค้า', status: 'approved', subject: 'Customer', category: 'Email, Address', legalBasis: 'Legal Obligation', sensitivity: 'Medium', retentionPeriod: '2 years' },
  { id: 3, purpose: 'วิเคราะห์พฤติกรรมผู้ใช้', status: 'rejected', subject: 'Employee', category: 'Cookies, IP', legalBasis: 'Legitimate Interest', sensitivity: 'Low', retentionPeriod: '67 years' },
  { id: 4, purpose: 'จัดการพนักงาน', status: 'rejected', subject: 'Partner', category: 'ID Card, Salary', legalBasis: 'Consent', sensitivity: 'High', retentionPeriod: '2 years' },
  { id: 5, purpose: 'ติดต่อซัพพลายเออร์', status: 'approved', subject: 'Candidate', category: 'Email, Contact Name', legalBasis: 'Contract', sensitivity: 'Medium', retentionPeriod: '67 years' },
  { id: 6, purpose: 'บันทึกกล้องวงจรปิด', status: 'approved', subject: 'Visitor', category: 'Video Recording', legalBasis: 'Consent', sensitivity: 'Low', retentionPeriod: '1 year' },
  { id: 7, purpose: 'ส่งจดหมายข่าว', status: 'approved', subject: 'Subscriber', category: 'Email', legalBasis: 'Consent', sensitivity: 'High', retentionPeriod: '42 years' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-[#22C55E]';
    case 'rejected': return 'bg-[#EF4444]';
    case 'pending': return 'bg-[#F59E0B]';
    default: return 'bg-gray-400';
  }
};

const getSensitivityBadge = (level: string) => {
  switch (level) {
    case 'High': return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
    case 'Medium': return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    case 'Low': return 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">ROPA - Record of Processing Activities</h1>
      </div>

      {/* Summary Cards */}
      <div className="flex gap-6 w-full">
        <StatCard 
          title="Total Record" 
          value="1,200" 
          icon={ClipboardList} 
          iconColor="text-blue-500" 
          bgColor="bg-blue-50" 
        />
        <StatCard 
          title="Approved" 
          value="900" 
          icon={CheckCircle2} 
          iconColor="text-green-500" 
          bgColor="bg-green-50" 
        />
        <StatCard 
          title="Rejected" 
          value="100" 
          icon={XCircle} 
          iconColor="text-red-500" 
          bgColor="bg-red-50" 
        />
        <StatCard 
          title="Pending" 
          value="200" 
          icon={Clock} 
          iconColor="text-yellow-500" 
          bgColor="bg-yellow-50" 
        />
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-transparent gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#E5E7EB] border-none text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 transition-colors">
            <Filter size={20} />
            <span>Filters</span>
            <ChevronDown size={16} />
          </button>
          
          <button className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 transition-colors">
            <Upload size={20} />
            <span>Import</span>
          </button>
          
          <button className="flex items-center gap-2 h-12 px-6 rounded-xl bg-[#E5E7EB] text-gray-700 font-medium hover:bg-gray-300 transition-colors">
            <Download size={20} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 font-semibold text-sm border-b border-gray-300">
              <th className="px-8 py-5">ID</th>
              <th className="px-6 py-5">Purpose</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Subject</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5">Legal Basis</th>
              <th className="px-6 py-5">Sensitivity</th>
              <th className="px-6 py-5 flex items-center gap-1">
                Retention Period
                <ChevronDown size={16} />
              </th>
              <th className="px-8 py-5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {mockData.map((row) => (
              <tr key={row.id} className="text-gray-900 font-medium hover:bg-gray-200/50 transition-colors">
                <td className="px-8 py-6">{row.id}</td>
                <td className="px-6 py-6 truncate max-w-[200px]">{row.purpose}</td>
                <td className="px-6 py-6">
                  <div className={`h-4 w-4 rounded-full ${getStatusColor(row.status)} shadow-sm`}></div>
                </td>
                <td className="px-6 py-6">{row.subject}</td>
                <td className="px-6 py-6">{row.category}</td>
                <td className="px-6 py-6">{row.legalBasis}</td>
                <td className="px-6 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getSensitivityBadge(row.sensitivity)}`}>
                    {row.sensitivity}
                  </span>
                </td>
                <td className="px-6 py-6">{row.retentionPeriod}</td>
                <td className="px-8 py-6 text-right">
                  <button className="text-gray-500 hover:text-gray-900">
                    <Eye size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
