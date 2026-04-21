'use client';

import React from 'react';
import { X } from 'lucide-react';

interface RecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-sm font-normal text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-900">{value || 'ข้อมูล'}</p>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-lg font-bold text-gray-900 pt-4 border-t border-gray-200 first:border-t-0 first:pt-0">
    {title}
  </h3>
);

export default function RecordDetailModal({ isOpen, onClose, record }: RecordDetailModalProps) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#E5E7EB] rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-8 py-6 bg-[#1e293b] text-white flex-none">
          <h2 className="text-2xl font-bold">{record.purpose}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        <div className="px-10 py-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-6">
            <SectionTitle title="รายละเอียดของผู้ลงบันทึก ROPA" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="ชื่อ" value="ข้อมูล" />
              <Field label="ที่อยู่" value="ข้อมูล" />
              <Field label="Email" value="ข้อมูล" />
              <Field label="เบอร์โทร" value="ข้อมูล" />
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="ข้อมูลพื้นฐานและหมวดหมู่ข้อมูล" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="1. ชื่อเจ้าของข้อมูลส่วนบุคคล" value="ข้อมูล" />
              <Field label="2. กิจกรรมประมวลผล" value="ข้อมูล" />
              <div className="col-span-2">
                <Field label="3. วัตถุประสงค์ของการประมวลผล" value={record.purpose} />
              </div>
              <div className="col-span-2">
                <Field label="4. ข้อมูลส่วนบุคคลที่จัดเก็บ" value={record.category} />
              </div>
              <Field label="5. หมวดหมู่ของข้อมูล" value="ข้อมูล" />
              <Field label="6. ประเภทของข้อมูล" value="ข้อมูล" />
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="การได้มาและฐานในการประมวลผล" />
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Field label="7. วิธีการได้มาซึ่งข้อมูล" value="ข้อมูล" />
              </div>
              <Field label="8. แหล่งที่มาจากเจ้าของข้อมูลส่วนบุคคลโดยตรง" value="ข้อมูล" />
              <Field label="จากแหล่งอื่น" value="-" />
              <div className="col-span-2">
                <Field label="9. ฐานในการประมวลผล" value={record.legalBasis} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="การขอความยินยอมจากผู้เยาว์" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="อายุไม่เกิน 10 ปี" value="ไม่เกี่ยวข้อง" />
              <Field label="อายุ 10 - 20 ปี" value="ไม่เกี่ยวข้อง" />
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="ส่งหรือโอนข้อมูลไปยังต่างประเทศ" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="มีการส่งหรือโอน (ระบุประเทศ)" value="ไม่มีการส่งหรือโอน" />
              <Field label="บริษัทในเครือ (ระบุชื่อ)" value="-" />
              <Field label="วิธีการโอนข้อมูล" value="-" />
              <Field label="มาตรฐานการคุ้มครองข้อมูล" value="-" />
              <div className="col-span-2">
                <Field label="ข้อยกเว้นตามมาตรา 28" value="-" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="นโยบายการเก็บรักษาและการเปิดเผย" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="ประเภทสื่อจัดเก็บ (Soft/Hard)" value="Soft / Hard (ข้อมูล)" />
              <Field label="ระยะเวลาเก็บรักษา" value={record.retentionPeriod} />
              <Field label="วิธีการเก็บรักษา" value="ข้อมูล" />
              <Field label="สิทธิและวิธีการเข้าถึงข้อมูล" value="ข้อมูล" />
              <div className="col-span-2">
                <Field label="วิธีการลบหรือทำลาย" value="ข้อมูล" />
              </div>
              <div className="col-span-2">
                <Field label="13. การเปิดเผยที่ยกเว้นความยินยอม" value="ข้อมูล" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="สิทธิและมาตรการรักษาความปลอดภัย" />
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Field label="14. การปฏิเสธคำขอหรือการคัดค้าน" value="-" />
              </div>
              <Field label="มาตรการเชิงองค์กร" value="ข้อมูล" />
              <Field label="มาตรการเชิงเทคนิค" value="ข้อมูล" />
              <Field label="มาตรการทางกายภาพ" value="ข้อมูล" />
              <Field label="การควบคุมการเข้าถึงข้อมูล" value="ข้อมูล" />
              <Field label="หน้าที่ความรับผิดชอบผู้ใช้" value="ข้อมูล" />
              <Field label="มาตรการตรวจสอบย้อนหลัง" value="ข้อมูล" />
            </div>
          </div>
        </div>

        <div className="px-8 py-5 bg-gray-200 border-t border-gray-300 flex justify-end flex-none">
          <button 
            onClick={onClose}
            className="px-10 py-2.5 bg-[#1e293b] text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
