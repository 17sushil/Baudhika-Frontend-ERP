"use client";

import * as React from "react";
import {
  Users,
  Briefcase,
  Banknote,
  CalendarCheck2,
  UserCheck,
  Receipt,
  FileCheck2,
  Calendar,
} from "lucide-react";
import { cn } from "cn";

interface DashboardContentProps {
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
}

export function DashboardContent({
  selectedBranchId,
  onSelectBranch,
}: DashboardContentProps) {
  // Chart points across 7 days matching the screenshot
  const days = ["D01", "D02", "D03", "D04", "D05", "D06", "D07"];
  const presentData = [145, 185, 170, 195, 160, 182, 194];
  const absentData = [32, 22, 26, 16, 28, 20, 14];
  const lateData = [14, 18, 12, 10, 17, 13, 8];

  // SVG dimensions for attendance chart
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;
  const maxY = 220;

  const getPoints = (data: number[]) => {
    return data.map((val, idx) => {
      const x = paddingX + (idx / (data.length - 1)) * graphWidth;
      const y = height - paddingY - (val / maxY) * graphHeight;
      return { x, y, val };
    });
  };

  const presentPoints = getPoints(presentData);
  const absentPoints = getPoints(absentData);

  // Smooth SVG curve generator
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const presentLinePath = createSmoothPath(presentPoints);
  const absentLinePath = createSmoothPath(absentPoints);

  const presentAreaPath = `${presentLinePath} L ${presentPoints[presentPoints.length - 1].x} ${height - paddingY} L ${presentPoints[0].x} ${height - paddingY} Z`;
  const absentAreaPath = `${absentLinePath} L ${absentPoints[absentPoints.length - 1].x} ${height - paddingY} L ${absentPoints[0].x} ${height - paddingY} Z`;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 4 Solid Colorful KPI Cards Matching the Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Students (Vibrant Blue) */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1E88E5] to-[#1565C0] p-6 text-white shadow-sm flex flex-col justify-between">
          <p className="text-sm font-medium text-white/90">Total Students</p>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold tracking-tight text-white">
              1,248
            </h3>
          </div>
        </div>

        {/* Card 2: Total Staff (Vibrant Emerald Green) */}
        <div className="rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] p-6 text-white shadow-sm flex flex-col justify-between">
          <p className="text-sm font-medium text-white/90">Total Staff</p>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold tracking-tight text-white">
              186
            </h3>
          </div>
        </div>

        {/* Card 3: Pending Fees (Vibrant Orange / Amber) */}
        <div className="rounded-2xl bg-gradient-to-br from-[#FB8C00] to-[#E65100] p-6 text-white shadow-sm flex flex-col justify-between">
          <p className="text-sm font-medium text-white/90">Pending Fees</p>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold tracking-tight text-white">
              ₹ 3,45,000
            </h3>
          </div>
        </div>

        {/* Card 4: Today's Attendance (Vibrant Purple) */}
        <div className="rounded-2xl bg-gradient-to-br from-[#8E24AA] to-[#6A1B9A] p-6 text-white shadow-sm flex flex-col justify-between">
          <p className="text-sm font-medium text-white/90">Today's Attendance</p>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold tracking-tight text-white">
              92%
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Attendance Overview (Left) + Recent Activities (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Attendance Overview Chart Card (~65% width) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E8EFF7] bg-white p-6 shadow-2xs">
          {/* Card Header with Title and Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#0F243E]">
              Attendance Overview
            </h2>

            {/* Legend dots matching the screenshot */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FB8C00]" />
                <span>Late</span>
              </div>
            </div>
          </div>

          {/* Smooth Spline Chart */}
          <div className="mt-4 w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto overflow-visible"
            >
              <defs>
                {/* Present Green Gradient */}
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>

                {/* Absent Red Gradient */}
                <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              {[50, 100, 150, 200].map((val) => {
                const y = height - paddingY - (val / maxY) * graphHeight;
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="#F1F5F9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      fill="#94A3B8"
                      fontSize="10"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area Fills */}
              <path d={presentAreaPath} fill="url(#presentGrad)" />
              <path d={absentAreaPath} fill="url(#absentGrad)" />

              {/* Line Strokes */}
              <path
                d={presentLinePath}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={absentLinePath}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Present Point Dots */}
              {presentPoints.map((p, i) => (
                <circle
                  key={`pres-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#10B981"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              ))}

              {/* Absent Point Dots */}
              {absentPoints.map((p, i) => (
                <circle
                  key={`abs-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              ))}

              {/* X-axis Day Labels */}
              {days.map((day, idx) => {
                const x = paddingX + (idx / (days.length - 1)) * graphWidth;
                return (
                  <text
                    key={day}
                    x={x}
                    y={height - 8}
                    fill="#94A3B8"
                    fontSize="11"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {day}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Column: Recent Activities Card (~35% width) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E8EFF7] bg-white p-6 shadow-2xs">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#0F243E]">
              Recent Activities
            </h2>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {/* Activity 1: New Admission */}
            <div className="py-3.5 flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1E6DEB]">
                <UserCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0F243E] leading-tight">
                  New admission received
                </p>
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  Class 10th - Aarav Sharma
                </p>
              </div>
            </div>

            {/* Activity 2: Fee payment */}
            <div className="py-3.5 flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1E6DEB]">
                <Receipt className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0F243E] leading-tight">
                  Fee payment received
                </p>
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  Receipt #40291 • ₹ 45,000
                </p>
              </div>
            </div>

            {/* Activity 3: Exam result */}
            <div className="py-3.5 flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1E6DEB]">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0F243E] leading-tight">
                  Exam result published
                </p>
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  Class 9th Term 1 finalized
                </p>
              </div>
            </div>

            {/* Activity 4: Leave request */}
            <div className="py-3.5 flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1E6DEB]">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0F243E] leading-tight">
                  Leave request approved
                </p>
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  Sunil Thapa • 2 days medical leave
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
