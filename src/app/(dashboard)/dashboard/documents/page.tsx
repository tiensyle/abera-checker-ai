'use client';

import { useState } from 'react';
import { 
  FolderArchive, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Check, 
  X, 
  AlertTriangle,
  ShieldCheck,
  FileCode,
  BookOpen,
  Filter
} from 'lucide-react';
import { appStore } from '@/lib/data/mock-store';
import { ProductDocument, Product, DocumentType } from '@/types';
import { formatBytes, formatDate } from '@/lib/utils';
import { canApproveDocument } from '@/lib/permissions';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<ProductDocument[]>(() => appStore.getDocuments());
  const [products] = useState<Product[]>(() => appStore.getProducts());
  const [selectedProductId, setSelectedProductId] = useState<string>('all');
  const [viewingDoc, setViewingDoc] = useState<ProductDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form states
  const [uploadProductId, setUploadProductId] = useState(products[0]?.id || '');
  const [docType, setDocType] = useState<DocumentType>('notification_slip');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const currentUser = appStore.getCurrentUser();
  const canApprove = canApproveDocument(currentUser.role);

  const filteredDocs = selectedProductId === 'all' 
    ? documents 
    : documents.filter(d => d.product_id === selectedProductId);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadProductId) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('productId', uploadProductId);
      formData.append('docType', docType);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi upload tài liệu');
      }

      setDocuments(appStore.getDocuments());
      setIsUploadModalOpen(false);
      setUploadFile(null);
      
      // Auto open document to review extracted text
      if (data.document) {
        setViewingDoc(data.document);
      }
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApproveAction = async (docId: string, action: 'approve' | 'reject') => {
    if (!canApprove) {
      alert('Nhân viên không có thẩm quyền phê duyệt tài liệu nguồn. Vui lòng chuyển sang vai trò Reviewer hoặc Super Admin trên thanh Header.');
      return;
    }

    try {
      const res = await fetch(`/api/documents/${docId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }

      setDocuments(appStore.getDocuments());
      if (viewingDoc && viewingDoc.id === docId) {
        setViewingDoc(data.document);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const docTypeLabels: Record<DocumentType, string> = {
    notification_slip: 'Phiếu công bố mỹ phẩm',
    inci_sheet: 'Bảng thành phần INCI',
    benefit_support: 'Chứng minh công dụng / Thử nghiệm',
    usage_guide: 'Hướng dẫn sử dụng & Cảnh báo',
    clinical_study: 'Nghiên cứu kiểm nghiệm da liễu',
    other: 'Tài liệu khác',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kho Tài Liệu & Hồ Sơ Nguồn
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Số hóa, trích xuất văn bản từng trang và lưu trữ hồ sơ phục vụ RAG AI đối chiếu
          </p>
        </div>

        <button
          onClick={() => {
            setUploadError('');
            setIsUploadModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          <Upload className="h-4 w-4" />
          <span>Upload tài liệu mới</span>
        </button>
      </div>

      {/* Filter and Product Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Lọc theo sản phẩm:</span>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-xs truncate"
          >
            <option value="all">Tất cả sản phẩm ({products.length})</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>[{p.brand_name}] {p.name}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Tổng số: <span className="font-bold text-slate-800">{filteredDocs.length}</span> tài liệu hồ sơ
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Tên tài liệu / File</th>
                <th className="py-3 px-4">Sản phẩm liên kết</th>
                <th className="py-3 px-4">Loại tài liệu</th>
                <th className="py-3 px-4">Số trang</th>
                <th className="py-3 px-4">Trạng thái phê duyệt</th>
                <th className="py-3 px-4">Ngày nạp</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => setViewingDoc(doc)}>
                          {doc.file_name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {formatBytes(doc.file_size)} • Phiên bản {doc.version}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800 max-w-[200px] truncate">
                      {doc.product_name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold">
                      {doc.brand_name}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      {docTypeLabels[doc.doc_type]}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">
                      {doc.pages?.length || 1} trang
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {doc.approval_status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Đã duyệt RAG
                      </span>
                    ) : doc.approval_status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3" />
                        Chờ Admin xác nhận
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 border border-rose-200">
                        <XCircle className="h-3 w-3" />
                        Đã từ chối
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {formatDate(doc.created_at)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingDoc(doc)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>Xem chi tiết</span>
                      </button>

                      {canApprove && doc.approval_status === 'pending' && (
                        <button
                          onClick={() => handleApproveAction(doc.id, 'approve')}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
                        >
                          Duyệt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Upload Document */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Nạp Tài Liệu Hồ Sơ Sản Phẩm
                </h3>
                <p className="text-xs text-slate-500">
                  Hỗ trợ định dạng PDF, DOCX, TXT và Hình ảnh scan (JPG/PNG)
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              {uploadError && (
                <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                  {uploadError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Chọn sản phẩm gắn liền hồ sơ *
                </label>
                <select
                  value={uploadProductId}
                  onChange={(e) => setUploadProductId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>[{p.brand_name}] {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Phân loại tài liệu pháp lý *
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="notification_slip">Phiếu công bố sản phẩm mỹ phẩm (CBMP)</option>
                  <option value="inci_sheet">Bảng thành phần INCI chính thức</option>
                  <option value="benefit_support">Tài liệu chứng minh công dụng lâm sàng/thử nghiệm</option>
                  <option value="usage_guide">Tài liệu hướng dẫn sử dụng & Cảnh báo an toàn</option>
                  <option value="clinical_study">Báo cáo kiểm nghiệm da liễu độc lập</option>
                  <option value="other">Tài liệu pháp lý khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Chọn file đính kèm *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Dung lượng tối đa: 25MB. Mã băm SHA-256 sẽ tự động được tạo để chống trùng lặp.
                </p>
              </div>

              <div className="rounded-lg bg-blue-50/70 p-3 text-xs text-blue-900 border border-blue-200">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Quy trình kiểm soát tài liệu:
                </div>
                <div className="mt-1 text-[11px] text-blue-800 leading-relaxed">
                  Sau khi nạp, hệ thống sẽ tự động trích xuất văn bản từng trang hoặc nhận diện OCR. Reviewer / Super Admin cần kiểm tra và bấm "Duyệt" trước khi AI được phép sử dụng làm căn cứ đối chiếu.
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUploading ? 'Đang trích xuất văn bản...' : 'Tải lên & Xử lý'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View Document Details & Extracted Pages */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-bold">
                    {docTypeLabels[viewingDoc.doc_type]}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    SHA-256: {viewingDoc.file_hash.slice(0, 16)}...
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {viewingDoc.file_name}
                </h3>
                <p className="text-xs text-slate-500">
                  Thuộc sản phẩm: <span className="font-semibold text-slate-800">{viewingDoc.product_name}</span> ({viewingDoc.brand_name})
                </p>
              </div>

              <button
                onClick={() => setViewingDoc(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body: Pages Viewer */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Nội dung đã trích xuất ({viewingDoc.pages?.length || 1} trang):</span>
                <span className="text-[11px] text-slate-400">
                  Trạng thái: <strong className="text-slate-800 uppercase">{viewingDoc.approval_status}</strong>
                </span>
              </div>

              {(viewingDoc.pages || []).map((page) => (
                <div
                  key={page.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      Trang {page.page_number}
                    </span>
                    {page.ocr_applied && (
                      <span className="rounded bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                        OCR Scan ({page.ocr_confidence || 70}%)
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
                    {page.page_text}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer with Approval Controls */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                {viewingDoc.approval_notes && (
                  <p className="text-[11px] text-slate-500 italic">
                    Ghi chú duyệt: {viewingDoc.approval_notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {canApprove && viewingDoc.approval_status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApproveAction(viewingDoc.id, 'reject')}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      Từ chối tài liệu
                    </button>
                    <button
                      onClick={() => handleApproveAction(viewingDoc.id, 'approve')}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700"
                    >
                      Xác nhận & Phê duyệt RAG
                    </button>
                  </>
                )}

                <button
                  onClick={() => setViewingDoc(null)}
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
