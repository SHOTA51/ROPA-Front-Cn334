'use client';

import React, { useEffect, useState } from 'react';
import * as api from '../../../lib/api';

interface Bucket {
  label: string;
  value: number;
}

interface AnalyticsData {
  total: number;
  complianceScore: number;
  pendingReview: number;
  highRiskCount: number;
  sensitiveCount: number;
  crossBorderCount: number;
  statusDistribution: Bucket[];
  riskDistribution: Bucket[];
  legalBasisDistribution: Bucket[];
  recordTypeDistribution: Bucket[];
  dataTypeDistribution: Bucket[];
  departmentDistribution: Bucket[];
  categoryDistribution: Bucket[];
  crossBorderDistribution: Bucket[];
  recordsByMonth: Bucket[];
}

const PALETTE = [
  '#2563eb',
  '#16a34a',
  '#dc2626',
  '#f59e0b',
  '#9333ea',
  '#0891b2',
  '#db2777',
  '#4f46e5',
  '#65a30d',
  '#ea580c',
];

const formatLabel = (s: string) =>
  s.toString().replace(/_/g, ' ').toLowerCase();

const BarList = ({ data, color }: { data: Bucket[]; color: string }) => {
  if (!data?.length) return <p className="text-sm text-gray-500">No data</p>;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span className="capitalize">{formatLabel(d.label)}</span>
            <span className="font-bold">{d.value}</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} rounded-full transition-all`}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({
  data,
  centerLabel,
}: {
  data: Bucket[];
  centerLabel?: string;
}) => {
  if (!data?.length) return <p className="text-sm text-gray-500">No data</p>;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return <p className="text-sm text-gray-500">No data</p>;

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 80;
  const inner = 50;

  let cumulative = 0;
  const slices = data.map((d, i) => {
    const startAngle = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
    cumulative += d.value;
    const endAngle = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const xi1 = cx + inner * Math.cos(endAngle);
    const yi1 = cy + inner * Math.sin(endAngle);
    const xi2 = cx + inner * Math.cos(startAngle);
    const yi2 = cy + inner * Math.sin(startAngle);
    const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${inner} ${inner} 0 ${large} 0 ${xi2} ${yi2} Z`;
    return {
      path,
      color: PALETTE[i % PALETTE.length],
      label: d.label,
      value: d.value,
      pct: ((d.value / total) * 100).toFixed(1),
    };
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-48 h-48 flex-none">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="1.5" />
        ))}
        {centerLabel && (
          <text
            x={cx}
            y={cy + 6}
            textAnchor="middle"
            className="fill-gray-900 font-bold"
            fontSize="18"
          >
            {centerLabel}
          </text>
        )}
      </svg>
      <div className="flex-1 w-full space-y-2">
        {slices.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <span
              className="h-3 w-3 rounded-sm flex-none"
              style={{ backgroundColor: s.color }}
            />
            <span className="capitalize flex-1 truncate">{formatLabel(s.label)}</span>
            <span className="font-bold text-gray-900">{s.value}</span>
            <span className="text-xs text-gray-500 w-10 text-right">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Gauge = ({ value, label }: { value: number; label: string }) => {
  const pct = Math.max(0, Math.min(100, value));
  const size = 180;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const radius = 70;
  const stroke = 14;
  const circ = Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  const color = pct >= 80 ? '#16a34a' : pct >= 60 ? '#f59e0b' : '#dc2626';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-48 h-40">
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fontSize="32"
          className="fill-gray-900 font-bold"
        >
          {pct}%
        </text>
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          fontSize="12"
          className="fill-gray-500"
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

const AreaLineChart = ({ data }: { data: Bucket[] }) => {
  if (!data?.length) return <p className="text-sm text-gray-500">No data</p>;
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 800;
  const h = 220;
  const stepX = data.length > 1 ? w / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: i * stepX,
    y: h - (d.value / max) * (h - 30) - 10,
    d,
  }));

  const linePath = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPath =
    `M ${points[0].x},${h} ` +
    points.map((p) => `L ${p.x},${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x},${h} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h + 40}`} className="w-full h-[280px]">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGrad)" />
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          points={linePath}
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#2563eb" />
            <text
              x={p.x}
              y={h + 20}
              textAnchor="middle"
              fontSize="12"
              className="fill-gray-600"
            >
              {p.d.label}
            </text>
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fontSize="11"
              className="fill-gray-700 font-bold"
            >
              {p.d.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const HorizontalBarChart = ({
  data,
  color = '#2563eb',
}: {
  data: Bucket[];
  color?: string;
}) => {
  if (!data?.length) return <p className="text-sm text-gray-500">No data</p>;
  const max = Math.max(...data.map((d) => d.value), 1);
  const rowH = 34;
  const w = 600;
  const h = data.length * rowH + 10;
  const labelW = 140;
  const barW = w - labelW - 40;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        {data.map((d, i) => {
          const y = i * rowH + 6;
          const width = (d.value / max) * barW;
          return (
            <g key={d.label}>
              <text
                x={labelW - 8}
                y={y + 16}
                textAnchor="end"
                fontSize="12"
                className="fill-gray-700 font-medium capitalize"
              >
                {formatLabel(d.label).slice(0, 18)}
              </text>
              <rect
                x={labelW}
                y={y + 4}
                width={barW}
                height={18}
                fill="#e5e7eb"
                rx="4"
              />
              <rect
                x={labelW}
                y={y + 4}
                width={width}
                height={18}
                fill={color}
                rx="4"
              />
              <text
                x={labelW + width + 6}
                y={y + 18}
                fontSize="12"
                className="fill-gray-800 font-bold"
              >
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const StatBox = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) => (
  <div className={`rounded-2xl p-6 border ${accent}`}>
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
  </div>
);

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getAnalytics();
        setData(res.data);
      } catch {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-10 text-gray-500">Loading analytics…</div>;
  if (error || !data) return <div className="p-10 text-red-600">{error || 'No data'}</div>;

  return (
    <div className="flex flex-col space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Analytics</h1>
        <p className="text-lg text-gray-600 mt-1">Overview of RoPA records and compliance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <StatBox label="Total Records" value={data.total} accent="bg-blue-50 border-blue-100" />
        <StatBox
          label="Compliance Score"
          value={`${data.complianceScore}%`}
          accent="bg-green-50 border-green-100"
        />
        <StatBox
          label="Pending Review"
          value={data.pendingReview}
          accent="bg-yellow-50 border-yellow-100"
        />
        <StatBox
          label="High Risk"
          value={data.highRiskCount}
          accent="bg-red-50 border-red-100"
        />
        <StatBox
          label="Sensitive Data"
          value={data.sensitiveCount}
          accent="bg-purple-50 border-purple-100"
        />
        <StatBox
          label="Cross-Border"
          value={data.crossBorderCount}
          accent="bg-orange-50 border-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col items-center">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Compliance Score</h2>
          <Gauge value={data.complianceScore} label="approved / total" />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Status Distribution</h2>
          <DonutChart data={data.statusDistribution} centerLabel={`${data.total}`} />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Risk Level</h2>
          <DonutChart data={data.riskDistribution} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Record Type (Controller / Processor)</h2>
          <DonutChart data={data.recordTypeDistribution} />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Cross-Border Transfer</h2>
          <DonutChart data={data.crossBorderDistribution} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-3">สัดส่วนฐานทางกฎหมาย</h2>
          <HorizontalBarChart data={data.legalBasisDistribution} color="#2563eb" />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-3">ประเภทของข้อมูล</h2>
          <HorizontalBarChart data={data.dataTypeDistribution} color="#9333ea" />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Records by Department</h2>
          <HorizontalBarChart data={data.departmentDistribution} color="#4f46e5" />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Top Data Categories</h2>
          <BarList data={data.categoryDistribution} color="bg-teal-500" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-2xl font-medium text-gray-700">
          แนวโน้มการเพิ่มขึ้นของข้อมูลในระบบ (12 เดือนย้อนหลัง)
        </span>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <AreaLineChart data={data.recordsByMonth} />
        </div>
      </div>
    </div>
  );
}
