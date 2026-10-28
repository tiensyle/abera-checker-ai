'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Eye, 
  Sparkles,
  FileCheck,
  User,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { appStore } from '@/lib/data/mock-store';
import { ContentCheckResult } from '@/types';
import { formatDate } from '@/lib/utils';
import { canApproveContent } from '@/lib/permissions';

export default function HistoryPage() {
  const [checks, setChecks] = useState<ContentCheckResult[]>(() => appStore.getChecks());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewingCheck, setViewingCheck] = useState<ContentCheckResult | null>(null);

  const currentUser = appStore.getCurrentUser();

  const filtered = checks.filter(c => {
    const matchSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.brand_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const handleApprove = (checkId: string, status: 'approved' | 'rejected') => {
    const check = appStore.getCheckById(checkId);
    if (!check) return;

    if (!canApproveContent(currentUser.role, 'user-employee', currentUser.id)) {
      alert('Không thể tự phê duyệt bài viết của chính mình hoặc chưa có quyền Reviewer!');
      return;
    }

    check.status = status;
    check.reviewer_notes = `Phê duyệt bởi ${currentUser.full_name} (${currentUser.role}) lúc ${formatDate(new Date().toISOString())}`;
    appStore.saveCheck(check);
    setChecks([...appStore.getChecks()]);
    if (viewingCheck && viewingCheck.id === checkId) {
      setViewingCheck({ ...check });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Lịch Sử Kiểm Tra & Phê Duyệt Bài Viết
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bản ghi bất biến của tất cả các lần AI thẩm định nội dung và hành động kiểm duyệt
          </p>
        </div>

        <Link
          href="/dashboard/checker"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          <Sparkles className="h-4 w-4" />
          <span>Kiểm tra bài viết mới</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tiêu đề, tên sản phẩm, thương hiệu..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-4 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Trạng thái:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả ({checks.length})</option>
            <option value="approved">Đã duyệt (Approved)</option>
            <option value="needs_revision">Cần sửa đổi (Needs Revision)</option>
            <option value="pending_approval">Chờ duyệt (Pending)</option>
            <option value="rejected">Bị từ chối (Rejected)</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <History className="h-8 w-8 mx-auto text-slate-300" />
            <div className="text-xs font-medium text-slate-600">Chưa có lịch sử kiểm tra bài viết nào</div>
            <p className="text-[11px] text-slate-400">
              Hãy thực hiện kiểm tra bài viết tại mục "Kiểm tra bài viết AI"
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Tiêu đề bài viết</th>
                  <th className="py-3 px-4">Sản phẩm & Thương hiệu</th>
                  <th className="py-3 px-4 text-center">Tuyên bố (Claims)</th>
                  <th className="py-3 px-4">Kết luận AI</th>
                  <th className="py-3 px-4">Trạng thái duyệt</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filtered.map((check) => (
                  <tr key={check.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-[280px]">
                        {check.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ID: {check.id} • Model: {check.ai_model}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 max-w-[220px] truncate">
                        {check.product_name}
                      </div>
                      <div className="text-[10px] text-blue-600 font-bold">
                        {check.brand_name}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 font-bold font-mono">
                        <span className="text-emerald-600" title="Phù hợp">{check.compliant_claims}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-amber-600" title="Chưa đủ căn cứ">{check.insufficient_claims}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-rose-600" title="Mâu thuẫn">{check.contradictory_claims}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 uppercase">Hợp / Chưa đủ / Sai</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {check.overall_status === 'compliant' ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                          <CheckCircle2 className="h-3 w-3" />
                          Phù hợp
                        </span>
                      ) : check.overall_status === 'insufficient_dossier' ? (
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-bold">
                          Thiếu hồ sơ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-50 text-rose-700 px-2 py-0.5 text-[10px] font-bold">
                          <AlertTriangle className="h-3 w-3" />
                          Rủi ro pháp lý
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {check.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Đã duyệt
                        </span>
                      ) : check.status === 'needs_revision' ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                          Cần sửa đổi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                          Bị từ chối
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {formatDate(check.created_at)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setViewingCheck(check)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>Xem</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal View Detail Check Record */}
      {viewingCheck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-slate-400">
                  MÃ KIỂM TRA: {viewingCheck.id} • PHIÊN BẢN QUY TẮC: {viewingCheck.rule_version}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {viewingCheck.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Sản phẩm: <strong>{viewingCheck.product_name}</strong> ({viewingCheck.brand_name})
                </p>
              </div>
              <button
                onClick={() => setViewingCheck(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-700 mb-1">Nội dung bài viết:</div>
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-800 leading-relaxed border border-slate-200 whitespace-pre-wrap">
                  {viewingCheck.original_content}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">
                  Danh sách tuyên bố và dẫn chứng pháp lý ({viewingCheck.claims.length}):
                </div>
                <div className="space-y-3">
                  {viewingCheck.claims.map((claim) => (
                    <div key={claim.id} className="rounded-xl border border-slate-200 p-3.5 bg-white space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-bold">
                          #{claim.order}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          claim.evidence_status === 'compliant' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {claim.evidence_status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-900 font-medium">"{claim.original_text}"</p>
                      {claim.issues && claim.issues.length > 0 && (
                        <div className="text-xs text-rose-600 space-y-1">
                          {claim.issues.map((iss, i) => (
                            <div key={i}>• {iss}</div>
                          ))}
                        </div>
                      )}
                      {claim.citations && claim.citations.length > 0 && (
                        <div className="text-[11px] text-blue-700 bg-blue-50 p-2 rounded">
                          Nguồn: {claim.citations[0].document_name} (Trang {claim.citations[0].page_number})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {viewingCheck.reviewer_notes && (
                <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-xs text-amber-900">
                  <strong>Ghi chú người duyệt:</strong> {viewingCheck.reviewer_notes}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Xuất PDF / In ấn</span>
              </button>

              <div className="flex items-center gap-2">
                {viewingCheck.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(viewingCheck.id, 'approved')}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700"
                  >
                    Phê duyệt bài viết này
                  </button>
                )}
                <button
                  onClick={() => setViewingCheck(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
