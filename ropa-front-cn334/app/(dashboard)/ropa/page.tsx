'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FileText,
  ShieldCheck,
  Globe,
  Database,
  Lock,
  ArrowRight,
  Info,
  Download,
  FileSpreadsheet,
} from 'lucide-react';

type Mode = 'Controller' | 'Processor';

interface FieldItem {
  no: string;
  label: string;
  column: string;
  description: string;
  example: string;
  fieldInApp: string;
}

const SECTIONS: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  fields: FieldItem[];
}[] = [
  {
    title: 'ข้อมูลพื้นฐานของกิจกรรม',
    icon: <FileText size={22} />,
    accent: 'bg-blue-50 border-blue-200 text-blue-700',
    fields: [
      {
        no: '1',
        label: 'ชื่อเจ้าของข้อมูลส่วนบุคคล',
        column: 'dataSubject',
        description:
          'ระบุว่าเจ้าของข้อมูลเป็นใคร เช่น ลูกค้า พนักงาน คู่ค้า ผู้สมัครงาน',
        example: 'ข้อมูลผู้สมัครงาน',
        fieldInApp: 'Data Subject (เจ้าของข้อมูล)',
      },
      {
        no: '2',
        label: 'กิจกรรมประมวลผล',
        column: 'processingActivity',
        description:
          'ชื่อกิจกรรมที่ใช้ข้อมูลส่วนบุคคล เช่น รับสมัครงาน จ่ายเงินเดือน ส่งแคมเปญการตลาด',
        example: 'การรับสมัครงาน',
        fieldInApp: 'Processing Activity',
      },
      {
        no: '3',
        label: 'วัตถุประสงค์ของการประมวลผล',
        column: 'purpose',
        description:
          'อธิบายว่าเก็บ/ใช้ข้อมูลไปเพื่ออะไร ให้ระบุเฉพาะเจาะจง หลีกเลี่ยงคำกว้างๆ',
        example: 'เพื่อคัดเลือกผู้สมัครงานตามคุณสมบัติ และติดต่อนัดสัมภาษณ์',
        fieldInApp: 'Purpose (วัตถุประสงค์)',
      },
    ],
  },
  {
    title: 'ข้อมูลส่วนบุคคลที่จัดเก็บ',
    icon: <Database size={22} />,
    accent: 'bg-purple-50 border-purple-200 text-purple-700',
    fields: [
      {
        no: '4',
        label: 'ข้อมูลส่วนบุคคลที่จัดเก็บ',
        column: 'personalDataItems',
        description:
          'รายการฟิลด์ข้อมูลจริงๆ ที่เก็บ เช่น ชื่อ-นามสกุล เลขบัตรประชาชน เบอร์โทร อีเมล',
        example: 'ชื่อ-นามสกุล, เลขบัตรประชาชน, เบอร์โทร, อีเมล, ประวัติการศึกษา',
        fieldInApp: 'Personal Data Items',
      },
      {
        no: '5',
        label: 'หมวดหมู่ของข้อมูล',
        column: 'dataCategory',
        description:
          'จัดกลุ่มว่าเป็นข้อมูลของใคร เช่น ลูกค้า, คู่ค้า, ผู้ติดต่อ, พนักงาน',
        example: 'ข้อมูลผู้สมัคร',
        fieldInApp: 'Data Category',
      },
      {
        no: '6',
        label: 'ประเภทของข้อมูล',
        column: 'dataType',
        description:
          'เลือก GENERAL (ข้อมูลทั่วไป) หรือ SENSITIVE (ข้อมูลอ่อนไหว เช่น ศาสนา, สุขภาพ, ความผิดทางอาญา)',
        example: 'SENSITIVE — เก็บข้อมูลประวัติสุขภาพของผู้สมัคร',
        fieldInApp: 'Data Type (Select: GENERAL / SENSITIVE)',
      },
      {
        no: '7',
        label: 'วิธีการได้มาซึ่งข้อมูล',
        column: 'collectionMethod',
        description: 'รูปแบบไฟล์/สื่อที่รับข้อมูล — soft file (อิเล็กทรอนิกส์) หรือ hard copy',
        example: 'เอกสาร / ข้อมูลอิเล็กทรอนิกส์ เช่น อีเมล',
        fieldInApp: 'Collection Method',
      },
      {
        no: '8',
        label: 'แหล่งที่ได้มาซึ่งข้อมูล',
        column: 'dataSource, sourceDirect, sourceIndirect',
        description:
          'ระบุที่มาของข้อมูล และติ๊กเลือกว่าได้มาจากเจ้าของโดยตรง หรือจากแหล่งอื่น (กรณีแหล่งอื่นต้องแจ้งเจ้าของภายใน 30 วัน)',
        example: 'เว็บไซต์รับสมัครงาน, ฟอร์มใบสมัคร (จากเจ้าของโดยตรง ✓)',
        fieldInApp: 'Data Source + Source Direct / Source Indirect',
      },
    ],
  },
  {
    title: 'ฐานทางกฎหมายและความยินยอม',
    icon: <ShieldCheck size={22} />,
    accent: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    fields: [
      {
        no: '9',
        label: 'ฐานในการประมวลผล',
        column: 'legalBasis',
        description:
          'เลือก 1 ใน 6 ฐานตาม PDPA: CONSENT (ความยินยอม) / CONTRACT (สัญญา) / LEGAL_OBLIGATION (กฎหมาย) / VITAL_INTEREST (อันตรายถึงชีวิต) / PUBLIC_TASK (ภารกิจสาธารณะ) / LEGITIMATE_INTEREST (ประโยชน์อันชอบธรรม)',
        example:
          'LEGAL_OBLIGATION — พระราชบัญญัติควบคุมโรคจากการประกอบอาชีพ พ.ศ. 2562 มาตรา 29',
        fieldInApp: 'Legal Basis (Select)',
      },
      {
        no: '10',
        label: 'การขอความยินยอมของผู้เยาว์',
        column: 'minorConsent',
        description:
          'หากเจ้าของข้อมูลอายุไม่เกิน 10 ปี ต้องได้รับความยินยอมจากผู้ใช้อำนาจปกครอง / อายุ 10-20 ปี ต้องขอความยินยอมทั้งผู้เยาว์และผู้ปกครอง',
        example: 'ไม่มี (เจ้าของข้อมูลเป็นผู้ใหญ่ทั้งหมด)',
        fieldInApp: 'Minor Consent',
      },
    ],
  },
  {
    title: 'การส่ง/โอนข้อมูลไปต่างประเทศ',
    icon: <Globe size={22} />,
    accent: 'bg-orange-50 border-orange-200 text-orange-700',
    fields: [
      {
        no: '11.1',
        label: 'มีการส่ง/โอนไปต่างประเทศหรือไม่',
        column: 'transferExists, transferDestination',
        description:
          'ติ๊ก transferExists = true และระบุประเทศปลายทาง เช่น Singapore, USA',
        example: 'ไม่มีการโอนข้อมูล (transferExists = false)',
        fieldInApp: 'Transfer Exists + Transfer Destination',
      },
      {
        no: '11.2',
        label: 'เป็นการส่งภายในกลุ่มบริษัท (Intra-Group)',
        column: 'intraGroupTransfer',
        description:
          'กรณีส่งไปบริษัทในเครือ ต้องมี BCR (Binding Corporate Rules) ให้ระบุชื่อบริษัทผู้รับ',
        example: 'ไม่มี',
        fieldInApp: 'Intra-Group Transfer',
      },
      {
        no: '11.3',
        label: 'วิธีการโอนข้อมูล',
        column: 'transferMethod',
        description: 'เช่น ส่งผ่าน API แบบเข้ารหัส, email encrypted, SFTP',
        example: 'SFTP with AES-256',
        fieldInApp: 'Transfer Method',
      },
      {
        no: '11.4',
        label: 'มาตรฐานการคุ้มครองของประเทศปลายทาง',
        column: 'destinationStandard',
        description: 'ประเทศปลายทางได้รับการประกาศว่ามีมาตรฐานคุ้มครองเพียงพอหรือไม่ (Adequacy)',
        example: 'GDPR Adequacy Decision',
        fieldInApp: 'Destination Standard',
      },
      {
        no: '11.5',
        label: 'ข้อยกเว้นตามมาตรา 28',
        column: 'article28Exception',
        description:
          'หากปลายทางไม่ผ่าน adequacy ต้องอ้างข้อยกเว้น เช่น ปฏิบัติตามกฎหมาย, ความยินยอม, ปฏิบัติตามสัญญา, ป้องกันอันตรายชีวิต',
        example: 'ปฏิบัติตามสัญญา',
        fieldInApp: 'Article 28 Exception',
      },
    ],
  },
  {
    title: 'นโยบายการเก็บรักษาและสิทธิ',
    icon: <BookOpen size={22} />,
    accent: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    fields: [
      {
        no: '12.1',
        label: 'ประเภทของข้อมูลที่จัดเก็บ',
        column: 'storageType',
        description: 'soft file (อิเล็กทรอนิกส์) หรือ hard copy',
        example: 'soft file',
        fieldInApp: 'Storage Type',
      },
      {
        no: '12.2',
        label: 'วิธีการเก็บรักษาข้อมูล',
        column: 'storageMethod',
        description: 'ระบบที่ใช้เก็บ เช่น HRMS, AWS S3, ตู้เอกสารล็อกกุญแจ',
        example: 'ระบบ HRMS / AWS S3 — encrypted at rest',
        fieldInApp: 'Storage Method',
      },
      {
        no: '12.3',
        label: 'ระยะเวลาการเก็บรักษา',
        column: 'retentionPeriod',
        description: 'ต้องมีระยะเวลาที่ชัดเจน + เหตุผล (ตามกฎหมาย/ภารกิจ) ห้ามเก็บ "ตลอดไป"',
        example: '2 ปีหลังปิดการสรรหา',
        fieldInApp: 'Retention Period',
      },
      {
        no: '12.4',
        label: 'สิทธิและวิธีการเข้าถึงข้อมูล',
        column: 'exerciseOfRights',
        description: 'ช่องทางให้เจ้าของข้อมูลใช้สิทธิ เช่น แก้ไข, ลบ, คัดค้าน',
        example: 'ส่งคำขอทางอีเมล dpo@company.co.th',
        fieldInApp: 'Exercise Of Rights',
      },
      {
        no: '12.5',
        label: 'วิธีการลบหรือทำลายข้อมูล',
        column: 'deletionMethod',
        description: 'ระบุวิธีที่ทำให้ข้อมูลไม่สามารถกู้คืนได้',
        example: 'Secure-erase + Certificate of Destruction',
        fieldInApp: 'Deletion Method',
      },
    ],
  },
  {
    title: 'การเปิดเผย / การปฏิเสธสิทธิ',
    icon: <Info size={22} />,
    accent: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    fields: [
      {
        no: '13',
        label: 'การใช้/เปิดเผยข้อมูลที่ได้รับยกเว้น',
        column: 'disclosureExempt',
        description:
          'ระบุเฉพาะกรณีที่กฎหมายยกเว้นไม่ต้องขอความยินยอม ให้อธิบายฐานที่อ้างอิง',
        example: 'เปิดเผยต่อกรมสวัสดิการและคุ้มครองแรงงาน ตามกฎหมายแรงงาน',
        fieldInApp: 'Disclosure Exempt',
      },
      {
        no: '14',
        label: 'การปฏิเสธคำขอ/คัดค้านการใช้สิทธิ',
        column: 'rightsRejection',
        description:
          'บันทึก *เฉพาะ* เมื่อมีการปฏิเสธสิทธิ ต้องให้เหตุผลทางกฎหมาย หากไม่มีให้เว้นว่าง',
        example: '-',
        fieldInApp: 'Rights Rejection',
      },
    ],
  },
  {
    title: 'มาตรการรักษาความมั่นคงปลอดภัย',
    icon: <Lock size={22} />,
    accent: 'bg-red-50 border-red-200 text-red-700',
    fields: [
      {
        no: '15.0',
        label: 'คำอธิบายภาพรวม',
        column: 'securityMeasures',
        description: 'สรุปภาพรวมมาตรการที่ใช้ป้องกันข้อมูล (จะลงรายละเอียดในข้อ 15.1-15.6)',
        example: 'ใช้มาตรฐาน ISO 27001 + ควบคุมการเข้าถึงด้วย MFA',
        fieldInApp: 'Security Measures (overview)',
      },
      {
        no: '15.1',
        label: 'มาตรการเชิงองค์กร',
        column: 'organizationalMeasures',
        description: 'นโยบาย, การฝึกอบรม, การแบ่งหน้าที่, ข้อตกลงไม่เปิดเผยข้อมูล',
        example: 'อบรมพนักงานรายปี + NDA กับ outsource',
        fieldInApp: 'Organizational Measures',
      },
      {
        no: '15.2',
        label: 'มาตรการเชิงเทคนิค',
        column: 'technicalMeasures',
        description: 'Encryption, Firewall, IDS/IPS, Anti-malware, backup',
        example: 'AES-256 at rest + TLS 1.3 in transit + daily backup',
        fieldInApp: 'Technical Measures',
      },
      {
        no: '15.3',
        label: 'มาตรการทางกายภาพ',
        column: 'physicalMeasures',
        description: 'ล็อกกุญแจห้องเซิร์ฟเวอร์, CCTV, access card',
        example: 'ห้อง server ต้องใช้ access card + CCTV 24 ชม.',
        fieldInApp: 'Physical Measures',
      },
      {
        no: '15.4',
        label: 'การควบคุมการเข้าถึงข้อมูล',
        column: 'accessControl',
        description: 'กำหนดสิทธิผู้ใช้ตาม Role-Based Access (least privilege)',
        example: 'กำหนดเฉพาะผู้มีสิทธิ / ฝ่าย HR เท่านั้น',
        fieldInApp: 'Access Control',
      },
      {
        no: '15.5',
        label: 'หน้าที่ความรับผิดชอบของผู้ใช้งาน',
        column: 'userResponsibility',
        description: 'ผู้ใช้ต้องไม่เปิดเผย รหัสผ่าน และแจ้งเหตุการณ์ผิดปกติทันที',
        example: 'พนักงานลงนามข้อตกลงการรักษาความลับทุกคน',
        fieldInApp: 'User Responsibility',
      },
      {
        no: '15.6',
        label: 'มาตรการตรวจสอบย้อนหลัง',
        column: 'auditMeasure',
        description: 'Audit log การเข้าถึง/แก้ไข, rotation log, review รายเดือน',
        example: 'System audit log + review ทุก 30 วัน',
        fieldInApp: 'Audit Measure',
      },
    ],
  },
];

const Tab = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
      active
        ? 'bg-[#0F172A] text-white shadow'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {label}
  </button>
);

export default function RopaGuidePage() {
  const [mode, setMode] = useState<Mode>('Controller');

  return (
    <div className="flex flex-col space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          คู่มือการกรอก ROPA Form
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          Record of Processing Activities — บันทึกรายการกิจกรรมการประมวลผลข้อมูลส่วนบุคคล ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) มาตรา 39
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-4 items-start">
        <Info className="text-blue-600 flex-none mt-1" size={22} />
        <div>
          <p className="text-sm font-bold text-blue-900 mb-1">ROPA คืออะไร?</p>
          <p className="text-sm text-blue-800 leading-relaxed">
            ROPA เป็นเอกสารที่ <b>ผู้ควบคุมข้อมูล (Controller)</b> และ <b>ผู้ประมวลผลข้อมูล (Processor)</b> ต้องจัดทำและเก็บไว้เพื่อให้คณะกรรมการ PDPC ตรวจสอบได้เมื่อร้องขอ โดยต้องครอบคลุมทุกกิจกรรมที่มีการเก็บ/ใช้/เปิดเผย/โอนข้อมูลส่วนบุคคล
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5 justify-between shadow-sm">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-white rounded-xl border border-emerald-200 flex-none">
            <FileSpreadsheet className="text-emerald-600" size={32} />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">ดาวน์โหลดฟอร์ม ROPA ต้นฉบับ (Excel)</p>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              ไฟล์ <code className="bg-white px-1.5 py-0.5 rounded text-emerald-700 font-mono text-xs">ROPA_Form.xlsx</code> มี 3 sheet: <b>Controller</b>, <b>Processor</b>, และ <b>Example (ตัวอย่างการกรอก)</b> — ใช้เป็น reference ประกอบการกรอกในระบบ
            </p>
            <p className="text-xs text-gray-500 mt-1">ขนาดไฟล์ ~70 KB · รูปแบบ .xlsx</p>
          </div>
        </div>
        <a
          href="/ROPA_Form.xlsx"
          download="ROPA_Form.xlsx"
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow flex-none"
        >
          <Download size={18} />
          ดาวน์โหลด .xlsx
        </a>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-600 mr-2">บทบาทที่ลงทะเบียน:</span>
        <Tab
          active={mode === 'Controller'}
          label="Controller (ผู้ควบคุมข้อมูล)"
          onClick={() => setMode('Controller')}
        />
        <Tab
          active={mode === 'Processor'}
          label="Processor (ผู้ประมวลผล)"
          onClick={() => setMode('Processor')}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {mode === 'Controller' ? 'Controller — ผู้ควบคุมข้อมูล' : 'Processor — ผู้ประมวลผลข้อมูล'}
        </h2>
        {mode === 'Controller' ? (
          <p className="text-sm text-gray-700 leading-relaxed">
            <b>ผู้ควบคุมข้อมูล</b> คือผู้ที่มีอำนาจตัดสินใจเกี่ยวกับ <b>วัตถุประสงค์และวิธีการ</b> ในการประมวลผลข้อมูลส่วนบุคคล เช่น บริษัทที่เก็บข้อมูลลูกค้า/พนักงานของตัวเอง จะต้องลงบันทึก ROPA ครบทั้ง 15 ข้อ
          </p>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed">
            <b>ผู้ประมวลผลข้อมูล</b> คือผู้ที่ประมวลผลข้อมูลส่วนบุคคล <b>ตามคำสั่งของ Controller</b> เช่น Cloud provider, Outsource payroll บันทึกจะต้องระบุ <b>ชื่อ/ที่อยู่ของ Controller</b> ที่ว่าจ้างเพิ่มเติม (ตาม field `recipient` และ `processorAddress` ในระบบ) และไม่ต้องระบุ "ฐานทางกฎหมาย" (legal basis) เองเพราะ Controller เป็นผู้กำหนด
          </p>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ข้อมูลผู้ลงบันทึก (ส่วนหัว)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-bold text-gray-700">ชื่อ</p>
            <p className="text-gray-600">ดึงจากบัญชีผู้ใช้ที่ login อัตโนมัติ</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">แผนก (Department)</p>
            <p className="text-gray-600">ดึงจากโปรไฟล์ผู้ใช้ สามารถเปลี่ยนได้ในฟอร์ม</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Email / เบอร์โทร / ที่อยู่</p>
            <p className="text-gray-600">ดึงจากฐานข้อมูลผู้ใช้และบริษัท (อ่านอย่างเดียว)</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">Record Type</p>
            <p className="text-gray-600">เลือก <b>CONTROLLER</b> หรือ <b>PROCESSOR</b> ตามบทบาทที่บันทึก</p>
          </div>
        </div>
      </div>

      {SECTIONS.map((section, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className={`p-2 rounded-lg border ${section.accent}`}>
              {section.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {idx + 1}. {section.title}
            </h2>
          </div>
          <div className="space-y-4">
            {section.fields.map((f) => (
              <div
                key={f.no}
                className="border-l-4 border-gray-300 hover:border-blue-500 transition-colors pl-5 py-2"
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    ข้อ {f.no}
                  </span>
                  <span className="text-base font-bold text-gray-900">{f.label}</span>
                  <span className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded">
                    {f.column}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1 leading-relaxed">
                  {f.description}
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs">
                  <div>
                    <span className="font-bold text-gray-500">ตัวอย่าง: </span>
                    <span className="text-gray-800">{f.example}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-500">ช่องในระบบ: </span>
                    <span className="text-gray-800">{f.fieldInApp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 text-sm text-gray-700">
        <p className="font-bold mb-2">📎 เอกสารอ้างอิง</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 มาตรา 39 (Controller) และ มาตรา 40 (Processor)</li>
          <li>Template ต้นฉบับ: ROPA_Form.xlsx (Controller / Processor / Example)</li>
          <li>แนวปฏิบัติของสำนักงานคุ้มครองข้อมูลส่วนบุคคล (PDPC)</li>
        </ul>
      </div>
    </div>
  );
}
