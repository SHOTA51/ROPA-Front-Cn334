'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, Check, X, Trash2, Power } from 'lucide-react';
import * as api from '../../../../lib/api';
import { useRole } from '../../../../lib/store';

interface RopaForm {
  recordType: string;
  purpose: string;
  dataSubject: string;
  processingActivity: string;
  personalDataItems: string;
  dataCategory: string;
  dataType: string;
  collectionMethod: string;
  sourceDirect: boolean;
  sourceIndirect: string;
  dataSource: string;
  legalBasis: string;
  minorConsent: string;
  processorAddress: string;
  recipient: string;
  dataProcessor: string;
  transferExists: boolean;
  transferDestination: string;
  intraGroupTransfer: string;
  transferMethod: string;
  destinationStandard: string;
  article28Exception: string;
  storageType: string;
  storageMethod: string;
  retentionPeriod: string;
  exerciseOfRights: string;
  deletionMethod: string;
  disclosureExempt: string;
  rightsRejection: string;
  organizationalMeasures: string;
  technicalMeasures: string;
  physicalMeasures: string;
  accessControl: string;
  userResponsibility: string;
  auditMeasure: string;
  riskLevel: string;
  status: string;
  departmentId: string;
}

const emptyForm: RopaForm = {
  recordType: 'CONTROLLER',
  purpose: '',
  dataSubject: '',
  processingActivity: '',
  personalDataItems: '',
  dataCategory: '',
  dataType: 'GENERAL',
  collectionMethod: '',
  sourceDirect: true,
  sourceIndirect: '',
  dataSource: '',
  legalBasis: 'CONSENT',
  minorConsent: 'NONE',
  processorAddress: '',
  recipient: '',
  dataProcessor: '',
  transferExists: false,
  transferDestination: '',
  intraGroupTransfer: '',
  transferMethod: '',
  destinationStandard: '',
  article28Exception: '',
  storageType: '',
  storageMethod: '',
  retentionPeriod: '',
  exerciseOfRights: '',
  deletionMethod: '',
  disclosureExempt: '',
  rightsRejection: '',
  organizationalMeasures: '',
  technicalMeasures: '',
  physicalMeasures: '',
  accessControl: '',
  userResponsibility: '',
  auditMeasure: '',
  riskLevel: 'LOW',
  status: 'DRAFT',
  departmentId: '',
};

const LEGAL_BASIS = [
  'CONSENT',
  'CONTRACT',
  'LEGAL_OBLIGATION',
  'VITAL_INTEREST',
  'PUBLIC_TASK',
  'LEGITIMATE_INTEREST',
];
const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH'];
const RECORD_TYPES = ['CONTROLLER', 'PROCESSOR'];
const DATA_TYPES = ['GENERAL', 'SENSITIVE'];
const COLLECTION_FORMATS = ['', 'SOFT_FILE', 'HARD_COPY', 'BOTH'];
const MINOR_CONSENT_OPTIONS = ['NONE', 'UNDER_10', 'BETWEEN_10_AND_20'];

interface DeptOpt {
  id: number;
  name: string;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
    <h2 className="text-lg font-bold text-gray-900 border-b pb-3">{title}</h2>
    {children}
  </div>
);

const Field = ({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) => (
  <div className={full ? 'col-span-2 space-y-1' : 'space-y-1'}>
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    {children}
  </div>
);

const inputCls =
  'w-full rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400';

export default function RopaDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { role } = useRole();

  const id = params?.id;
  const isNew = id === 'new';

  const [form, setForm] = useState<RopaForm>(emptyForm);
  const [departments, setDepartments] = useState<DeptOpt[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [recordMeta, setRecordMeta] = useState<{
    status: string;
    rejectionReason?: string | null;
    createdBy?: { name?: string };
    updatedBy?: { name?: string };
  }>({ status: 'DRAFT' });

  const fetchRecord = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const res = await api.getRopa(id as string);
      const r = res.data;
      setForm({
        recordType: r.recordType || 'CONTROLLER',
        purpose: r.purpose || '',
        dataSubject: r.dataSubject || '',
        processingActivity: r.processingActivity || '',
        personalDataItems: r.personalDataItems || '',
        dataCategory: r.dataCategory || '',
        dataType: r.dataType || 'GENERAL',
        collectionMethod: r.collectionMethod || '',
        sourceDirect: Boolean(r.sourceDirect),
        sourceIndirect: r.sourceIndirect || '',
        dataSource: r.dataSource || '',
        legalBasis: r.legalBasis || 'CONSENT',
        minorConsent: r.minorConsent || 'NONE',
        processorAddress: r.processorAddress || '',
        recipient: r.recipient || '',
        dataProcessor: r.dataProcessor || '',
        transferExists: Boolean(r.transferExists),
        transferDestination: r.transferDestination || '',
        intraGroupTransfer: r.intraGroupTransfer || '',
        transferMethod: r.transferMethod || '',
        destinationStandard: r.destinationStandard || '',
        article28Exception: r.article28Exception || '',
        storageType: r.storageType || '',
        storageMethod: r.storageMethod || '',
        retentionPeriod: r.retentionPeriod || '',
        exerciseOfRights: r.exerciseOfRights || '',
        deletionMethod: r.deletionMethod || '',
        disclosureExempt: r.disclosureExempt || '',
        rightsRejection: r.rightsRejection || '',
        organizationalMeasures: r.organizationalMeasures || '',
        technicalMeasures: r.technicalMeasures || '',
        physicalMeasures: r.physicalMeasures || '',
        accessControl: r.accessControl || '',
        userResponsibility: r.userResponsibility || '',
        auditMeasure: r.auditMeasure || '',
        riskLevel: r.riskLevel || 'LOW',
        status: r.status || 'DRAFT',
        departmentId: r.departmentId ? String(r.departmentId) : '',
      });
      setRecordMeta({
        status: r.status,
        rejectionReason: r.rejectionReason,
        createdBy: r.createdBy,
        updatedBy: r.updatedBy,
      });
    } catch {
      setError('Failed to load ROPA record');
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  const fetchDepts = useCallback(async () => {
    try {
      const res = await api.listDepartments();
      setDepartments(
        Array.isArray(res.data) ? res.data : res.data?.departments || [],
      );
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchDepts();
    fetchRecord();
  }, [fetchDepts, fetchRecord]);

  const handleChange = (k: keyof RopaForm, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const payload = { ...form, departmentId: form.departmentId || null };
      if (isNew) {
        const res = await api.createRopa(payload);
        const newId = res.data?.record?.id;
        setMessage('Record created');
        if (newId) router.replace(`/ropa/${newId}`);
      } else {
        await api.updateRopa(id as string, payload);
        setMessage('Saved successfully');
        fetchRecord();
      }
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (isNew) return;
    try {
      await api.submitRopa(id as string);
      setMessage('Submitted for review');
      fetchRecord();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Submit failed');
    }
  };

  const handleApprove = async () => {
    if (isNew) return;
    try {
      await api.approveRopa(id as string);
      setMessage('Approved');
      fetchRecord();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Approve failed');
    }
  };

  const handleReject = async () => {
    if (isNew) return;
    const reason = window.prompt('Rejection reason:');
    if (!reason) return;
    try {
      await api.rejectRopa(id as string, reason);
      setMessage('Rejected');
      fetchRecord();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Reject failed');
    }
  };

  const handleActivate = async () => {
    if (isNew) return;
    try {
      await api.activateRopa(id as string);
      setMessage('Activated');
      fetchRecord();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Activate failed');
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.deleteRopa(id as string);
      router.replace('/dashboard');
    } catch {
      setError('Delete failed');
    }
  };

  if (loading) return <div className="p-10 text-gray-500">Loading…</div>;

  const canEdit = role === 'Admin' || role === 'DataOwner';
  const canApprove = role === 'Admin' || role === 'DPO';
  const canDelete = role === 'Admin';
  const canSubmit = canEdit && ['DRAFT', 'REJECTED'].includes(recordMeta.status);
  const canActivate = canApprove && recordMeta.status === 'APPROVED';

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? 'Create ROPA Record' : `ROPA Record #${id}`}
          </h1>
          {!isNew && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-200 text-gray-700">
              {recordMeta.status}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A] text-white font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving…' : isNew ? 'Create' : 'Save'}
            </button>
          )}
          {!isNew && canSubmit && (
            <button
              onClick={handleSubmitForReview}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              <Send size={18} />
              Submit for Review
            </button>
          )}
          {!isNew && canApprove && recordMeta.status === 'PENDING_REVIEW' && (
            <>
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700"
              >
                <Check size={18} />
                Approve
              </button>
              <button
                onClick={handleReject}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700"
              >
                <X size={18} />
                Reject
              </button>
            </>
          )}
          {!isNew && canActivate && (
            <button
              onClick={handleActivate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
            >
              <Power size={18} />
              Activate
            </button>
          )}
          {!isNew && canDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 font-medium hover:bg-red-100"
            >
              <Trash2 size={18} />
              Delete
            </button>
          )}
        </div>
      </div>

      {recordMeta.status === 'REJECTED' && recordMeta.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
          <p className="font-semibold">Rejection Reason</p>
          <p>{recordMeta.rejectionReason}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-sm font-medium">
          {message}
        </div>
      )}

      <Section title="Basic Information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Record Type">
            <select
              className={inputCls}
              value={form.recordType}
              onChange={(e) => handleChange('recordType', e.target.value)}
              disabled={!canEdit}
            >
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Department">
            <select
              className={inputCls}
              value={form.departmentId}
              onChange={(e) => handleChange('departmentId', e.target.value)}
              disabled={!canEdit}
            >
              <option value="">Unassigned</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Data Subject *">
            <input
              className={inputCls}
              value={form.dataSubject}
              onChange={(e) => handleChange('dataSubject', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Data Category *">
            <input
              className={inputCls}
              value={form.dataCategory}
              onChange={(e) => handleChange('dataCategory', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Purpose *" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Processing Activity" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.processingActivity}
              onChange={(e) => handleChange('processingActivity', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Personal Data Items" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.personalDataItems}
              onChange={(e) => handleChange('personalDataItems', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Data Type">
            <select
              className={inputCls}
              value={form.dataType}
              onChange={(e) => handleChange('dataType', e.target.value)}
              disabled={!canEdit}
            >
              {DATA_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Risk Level">
            <select
              className={inputCls}
              value={form.riskLevel}
              onChange={(e) => handleChange('riskLevel', e.target.value)}
              disabled={!canEdit}
            >
              {RISK_LEVELS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Source & Legal Basis">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Collection Method">
            <select
              className={inputCls}
              value={form.collectionMethod}
              onChange={(e) => handleChange('collectionMethod', e.target.value)}
              disabled={!canEdit}
            >
              {COLLECTION_FORMATS.map((t) => (
                <option key={t} value={t}>
                  {t || '-'}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Direct Source">
            <select
              className={inputCls}
              value={form.sourceDirect ? 'true' : 'false'}
              onChange={(e) => handleChange('sourceDirect', e.target.value === 'true')}
              disabled={!canEdit}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </Field>
          <Field label="Indirect Source" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.sourceIndirect}
              onChange={(e) => handleChange('sourceIndirect', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Data Source">
            <input
              className={inputCls}
              value={form.dataSource}
              onChange={(e) => handleChange('dataSource', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Legal Basis *">
            <select
              className={inputCls}
              value={form.legalBasis}
              onChange={(e) => handleChange('legalBasis', e.target.value)}
              disabled={!canEdit}
            >
              {LEGAL_BASIS.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Minor Consent">
            <select
              className={inputCls}
              value={form.minorConsent}
              onChange={(e) => handleChange('minorConsent', e.target.value)}
              disabled={!canEdit}
            >
              {MINOR_CONSENT_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Processor Address" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.processorAddress}
              onChange={(e) => handleChange('processorAddress', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
        </div>
      </Section>

      <Section title="Recipient & Processor">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Recipient" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.recipient}
              onChange={(e) => handleChange('recipient', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Data Processor" full>
            <input
              className={inputCls}
              value={form.dataProcessor}
              onChange={(e) => handleChange('dataProcessor', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
        </div>
      </Section>

      <Section title="Cross-Border Transfer">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Transfer Exists">
            <select
              className={inputCls}
              value={form.transferExists ? 'true' : 'false'}
              onChange={(e) => handleChange('transferExists', e.target.value === 'true')}
              disabled={!canEdit}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </Field>
          <Field label="Transfer Destination">
            <input
              className={inputCls}
              value={form.transferDestination}
              onChange={(e) => handleChange('transferDestination', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Intra-Group Transfer" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.intraGroupTransfer}
              onChange={(e) => handleChange('intraGroupTransfer', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Transfer Method" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.transferMethod}
              onChange={(e) => handleChange('transferMethod', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Destination Standard" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.destinationStandard}
              onChange={(e) => handleChange('destinationStandard', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Article 28 Exception" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.article28Exception}
              onChange={(e) => handleChange('article28Exception', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
        </div>
      </Section>

      <Section title="Retention & Rights">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Storage Type">
            <input
              className={inputCls}
              value={form.storageType}
              onChange={(e) => handleChange('storageType', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Retention Period *">
            <input
              className={inputCls}
              value={form.retentionPeriod}
              onChange={(e) => handleChange('retentionPeriod', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Storage Method" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.storageMethod}
              onChange={(e) => handleChange('storageMethod', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Exercise of Rights" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.exerciseOfRights}
              onChange={(e) => handleChange('exerciseOfRights', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Deletion Method" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.deletionMethod}
              onChange={(e) => handleChange('deletionMethod', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Disclosure Exempt" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.disclosureExempt}
              onChange={(e) => handleChange('disclosureExempt', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Rights Rejection" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.rightsRejection}
              onChange={(e) => handleChange('rightsRejection', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
        </div>
      </Section>

      <Section title="Security Measures">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Organizational Measures" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.organizationalMeasures}
              onChange={(e) => handleChange('organizationalMeasures', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Technical Measures" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.technicalMeasures}
              onChange={(e) => handleChange('technicalMeasures', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Physical Measures" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.physicalMeasures}
              onChange={(e) => handleChange('physicalMeasures', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Access Control" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.accessControl}
              onChange={(e) => handleChange('accessControl', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="User Responsibility" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.userResponsibility}
              onChange={(e) => handleChange('userResponsibility', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          <Field label="Audit Measure" full>
            <textarea
              className={inputCls}
              rows={2}
              value={form.auditMeasure}
              onChange={(e) => handleChange('auditMeasure', e.target.value)}
              disabled={!canEdit}
            />
          </Field>
        </div>
      </Section>
    </div>
  );
}
