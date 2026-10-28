'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Package, 
  FileText, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { appStore } from '@/lib/data/mock-store';
import { formatDate } from '@/lib/utils';

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState(() => appStore.getDashboardStats());

  useEffect(() => {
    setStats(appStore.getDashboardStats());
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hệ Thống Thẩm Định Nội Dung Mỹ Phẩm AI
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý hồ sơ công bố và tự động phát hiện rủi ro quảng cáo theo Thông tư 06/2011/TT-BYT
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/documents"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nạp tài liệu hồ sơ</span>
          </Link>
          <Link
            href="/dashboard/checker"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/25 hover:bg-blue-700 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Kiểm tra bài viết mới</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Thương hiệu</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.total_brands}</span>
            <span className="text-xs text-emerald-600 font-medium">Hoạt động</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">AURA, DERM, LUMI, MEN'S, PERLE</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sản phẩm quản lý</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.total_products}</span>
            <span className="text-xs text-slate-500 font-medium">sản phẩm</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Đã nạp hồ sơ thành phần & công dụng</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Hồ sơ & Tài liệu nguồn</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.total_documents}</span>
            <span className="text-xs text-amber-600 font-medium">Đã số hóa RAG</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Phiếu công bố, INCI, Thử nghiệm</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Bài viết đã kiểm tra</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.total_checks}</span>
            <span className="text-xs text-emerald-600 font-medium">lượt AI check</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tỷ lệ phù hợp đạt ~82%</p>
        </div>
      </div>

      {/* Audit Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2.5 text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-900 uppercase">Chờ phê duyệt</div>
              <div className="text-lg font-bold text-amber-900">{stats.pending_approval} bài viết</div>
            </div>
          </div>
          <Link href="/dashboard/history" className="text-xs font-semibold text-amber-700 hover:underline">
            Xem ngay &rarr;
          </Link>
        </div>

        <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-900 uppercase">Đã phê duyệt đạt</div>
              <div className="text-lg font-bold text-emerald-900">{stats.approved_checks} bài viết</div>
            </div>
          </div>
          <span className="text-xs font-medium text-emerald-600">Sẵn sàng xuất bản</span>
        </div>

        <div className="rounded-xl border border-rose-200/70 bg-rose-50/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-rose-100 p-2.5 text-rose-700">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-rose-900 uppercase">Yêu cầu sửa lại</div>
              <div className="text-lg font-bold text-rose-900">{stats.rejected_checks} bài viết</div>
            </div>
          </div>
          <span className="text-xs font-medium text-rose-600">Vi phạm pháp chế</span>
        </div>
      </div>

      {/* Main Content: Common Violations & Legal Safety Guard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Common Violations */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Các nhóm lỗi quảng cáo thường gặp (Theo Thông tư 06/2011/TT-BYT)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Thống kê tần suất vi phạm được AI phát hiện trong các bài viết quảng cáo gần đây
              </p>
            </div>
            <Link
              href="/dashboard/reports"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Xem báo cáo</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4 pt-2">
            {stats.common_issues.map((issue, index) => {
              const maxCount = 50;
              const percent = Math.min(100, Math.round((issue.count / maxCount) * 100));
              return (
                <div key={issue.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-800">{index + 1}. {issue.name}</span>
                    <span className="font-bold text-slate-900">{issue.count} lần</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-rose-500' : index === 1 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: AI Compliance Guidelines */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Tiêu chuẩn thẩm định 4 tầng</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hệ thống kết hợp kiểm tra quy chuẩn Pháp lý Việt Nam và truy xuất tài liệu gốc (RAG) để đảm bảo:
            </p>

            <ul className="mt-4 space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="rounded bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] font-bold">TẦNG 1</span>
                <span>Đối chiếu tên, thương hiệu & số tiếp nhận Phiếu công bố.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="rounded bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] font-bold">TẦNG 2</span>
                <span>Kiểm tra danh mục thành phần INCI chính thức & nồng độ.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="rounded bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] font-bold">TẦNG 3</span>
                <span>Đối chiếu công dụng đã được cơ quan quản lý xác minh.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="rounded bg-rose-100 text-rose-700 px-1.5 py-0.5 text-[10px] font-bold">TẦNG 4</span>
                <span>Quét từ cấm, cam kết 100%, trị mụn/nám tận gốc, thần tốc.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/dashboard/checker"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-50 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
            >
              <span>Thử nghiệm phân tích bài viết ngay</span>
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
