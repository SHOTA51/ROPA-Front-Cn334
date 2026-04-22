'use client';

import React from 'react';
import { X } from 'lucide-react';

interface RecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Record<string, unknown> | null;
}

const display = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') {
    const obj = value as { name?: string };
    return obj.name || JSON.stringify(value);
  }
  return String(value).replace(/_/g, ' ');
};

const Field = ({ label, value }: { label: string; value: unknown }) => (
  <div className="space-y-1">
    <p className="text-sm font-normal text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-900 break-words">{display(value)}</p>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-lg font-bold text-gray-900 pt-4 border-t border-gray-200 first:border-t-0 first:pt-0">
    {title}
  </h3>
);

export default function RecordDetailModal({ isOpen, onClose, record }: RecordDetailModalProps) {
  if (!isOpen || !record) return null;

  const r = record as Record<string, unknown>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#E5E7EB] rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-8 py-6 bg-[#1e293b] text-white flex-none">
          <h2 className="text-2xl font-bold truncate pr-4">{display(r.purpose)}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        <div className="px-10 py-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-6">
            <SectionTitle title="ข้อมูลทั่วไป" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="Record Type" value={r.recordType} />
              <Field label="Status" value={r.status} />
              <Field label="Risk Level" value={r.riskLevel} />
              <Field label="Department" value={r.department} />
              <Field label="Created By" value={r.createdBy} />
              <Field label="Updated By" value={r.updatedBy} />
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="ข้อมูลพื้นฐานและหมวดหมู่ข้อมูล" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="1. ชื่อเจ้าของข้อมูลส่วนบุคคล" value={r.dataSubject} />
              <Field label="2. กิจกรรมประมวลผล" value={r.processingActivity} />
              <div className="col-span-2">
                <Field label="3. วัตถุประสงค์ของการประมวลผล" value={r.purpose} />
              </div>
              <div className="col-span-2">
                <Field label="4. ข้อมูลส่วนบุคคลที่จัดเก็บ" value={r.personalDataItems} />
              </div>
              <Field label="5. หมวดหมู่ของข้อมูล" value={r.dataCategory} />
              <Field label="6. ประเภทของข้อมูล" value={r.dataType} />
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="การได้มาและฐานในการประมวลผล" />
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Field label="7. วิธีการได้มาซึ่งข้อมูล" value={r.collectionMethod} />
              </div>
              <Field label="จากเจ้าของข้อมูลโดยตรง" value={r.sourceDirect} />
              <Field label="จากแหล่งอื่น" value={r.sourceIndirect} />
              <div className="col-span-2">
                <Field label="9. ฐานในการประมวลผล" value={r.legalBasis} />
              </div>
              <div className="col-span-2">
                <Field label="ความยินยอมของผู้เยาว์" value={r.minorConsent} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="ผู้รับข้อมูลและผู้ประมวลผลภายนอก" />
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Field label="Recipient" value={r.recipient} />
              </div>
              <Field label="Data Processor" value={r.dataProcessor} />
              <Field label="Processor Address" value={r.processorAddress} />
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="ส่งหรือโอนข้อมูลไปยังต่างประเทศ" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="มีการส่งหรือโอน" value={r.transferExists} />
              <Field label="ประเทศปลายทาง" value={r.transferDestination} />
              <Field label="บริษัทในเครือ" value={r.intraGroupTransfer} />
              <Field label="วิธีการโอนข้อมูล" value={r.transferMethod} />
              <Field label="มาตรฐานการคุ้มครองข้อมูล" value={r.destinationStandard} />
              <Field label="ข้อยกเว้นตามมาตรา 28" value={r.article28Exception} />
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="นโยบายการเก็บรักษาและการเปิดเผย" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="ประเภทสื่อจัดเก็บ" value={r.storageType} />
              <Field label="ระยะเวลาเก็บรักษา" value={r.retentionPeriod} />
              <div className="col-span-2">
                <Field label="วิธีการเก็บรักษา" value={r.storageMethod} />
              </div>
              <div className="col-span-2">
                <Field label="สิทธิและวิธีการเข้าถึงข้อมูล" value={r.exerciseOfRights} />
              </div>
              <div className="col-span-2">
                <Field label="วิธีการลบหรือทำลาย" value={r.deletionMethod} />
              </div>
              <div className="col-span-2">
                <Field label="การเปิดเผยที่ยกเว้นความยินยอม" value={r.disclosureExempt} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle title="สิทธิและมาตรการรักษาความปลอดภัย" />
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Field label="การปฏิเสธคำขอหรือการคัดค้าน" value={r.rightsRejection} />
              </div>
              <Field label="มาตรการเชิงองค์กร" value={r.organizationalMeasures} />
              <Field label="มาตรการเชิงเทคนิค" value={r.technicalMeasures} />
              <Field label="มาตรการทางกายภาพ" value={r.physicalMeasures} />
              <Field label="การควบคุมการเข้าถึงข้อมูล" value={r.accessControl} />
              <Field label="หน้าที่ความรับผิดชอบผู้ใช้" value={r.userResponsibility} />
              <Field label="มาตรการตรวจสอบย้อนหลัง" value={r.auditMeasure} />
            </div>
          </div>

          {Boolean(r.rejectionReason) && (
            <div className="space-y-6">
              <SectionTitle title="Rejection" />
              <div className="grid grid-cols-1 gap-6">
                <Field label="Rejection Reason" value={r.rejectionReason} />
                <Field label="Rejected At" value={r.rejectedAt} />
                <Field label="Rejected By" value={r.rejectedBy} />
              </div>
            </div>
          )}
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
