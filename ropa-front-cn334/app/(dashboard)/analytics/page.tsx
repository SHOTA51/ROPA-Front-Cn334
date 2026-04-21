'use client';

import React from 'react';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Analytics</h1>
      </div>

      {/* Analytics Content Placeholders */}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-[#D1D5DB] rounded-2xl h-[400px] flex items-center justify-center border border-gray-300">
           <div className="flex flex-col items-center gap-4">
              <span className="text-2xl font-medium text-gray-700">สัดส่วนฐานทางกฎหมาย</span>
              <span className="text-4xl font-bold text-gray-600">Graph</span>
           </div>
        </div>
        <div className="bg-[#D1D5DB] rounded-2xl h-[400px] flex items-center justify-center border border-gray-300">
           <div className="flex flex-col items-center gap-4">
              <span className="text-2xl font-medium text-gray-700">ประเภทของข้อมูล</span>
              <span className="text-4xl font-bold text-gray-600">Graph</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-2xl font-medium text-gray-700">แนวโน้มการเพิ่มขึ้นของข้อมูลในระบบ (... เดือนย้อนหลัง)</span>
        <div className="bg-[#D1D5DB] rounded-2xl h-[300px] flex items-center justify-center border border-gray-300">
           <span className="text-4xl font-bold text-gray-600">Graph</span>
        </div>
      </div>
    </div>
  );
}
