'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  Calendar, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock,
  PieChart
} from 'lucide-react';
import { appStore } from '@/lib/data/mock-store';

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('30days');
  const stats = appStore.getDashboardStats();
  const brands = appStore.getBrands();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Báo Cáo & Thống Kê Tuân Thủ Quảng Cáo
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Phân tích tỷ lệ vi phạm, xu hướng tuân thủ và tần suất cảnh báo theo quy định
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 text-xs">
            <Calendar className="h-4 w-4 text-slate-400 ml-1" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border-0 bg-transparent py-1 pr-6 text-xs font-semibold text-slate-700 focus:ring-0 cursor-pointer"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="90days">Quý này</option>
              <option value="year">Cả năm</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Xuất báo cáo PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Tỷ lệ tuân thủ bình quân</span>
          <div className="mt-2 text-2xl font-black text-emerald-600">82.4%</div>
          <p className="text-[11px] text-slate-400 mt-1">+4.2% so với tháng trước</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Tổng bài viết kiểm tra</span>
          <div className="mt-2 text-2xl font-black text-slate-900">{stats.total_checks}</div>
          <p className="text-[11px] text-slate-400 mt-1">Trung bình 6 bài / tuần</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Vi phạm từ cấm điều trị</span>
          <div className="mt-2 text-2xl font-black text-rose-600">42 lần</div>
          <p className="text-[11px] text-slate-400 mt-1">Trị nám, trị mụn, chữa khỏi</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Tỷ lệ sửa đổi thành công</span>
          <div className="mt-2 text-2xl font-black text-blue-600">96.8%</div>
          <p className="text-[11px] text-slate-400 mt-1">Sau khi áp dụng gợi ý AI</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Category Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">
            Phân bổ nhóm lỗi pháp chế phát hiện
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Căn cứ theo Thông tư 06/2011/TT-BYT và Luật Quảng cáo
          </p>

          <div className="space-y-4">
            {stats.common_issues.map((issue, idx) => (
              <div key={issue.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{issue.name}</span>
                  <span className="font-bold text-slate-900">{issue.count} lần</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-rose-500' : idx === 1 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, (issue.count / 45) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Compliance Comparison */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">
            Độ tuân thủ hồ sơ theo thương hiệu
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Đánh giá mức độ đồng bộ giữa bài viết truyền thông và tài liệu công bố
          </p>

          <div className="space-y-4">
            {brands.map((brand, i) => {
              const rates = [92, 88, 76, 85, 60];
              const rate = rates[i % rates.length];

              return (
                <div key={brand.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{brand.name}</span>
                    <span className="font-semibold text-emerald-700">{rate}% phù hợp</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
