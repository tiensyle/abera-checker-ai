'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Check, 
  X, 
  Copy, 
  Send, 
  Printer, 
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Upload,
  Info
} from 'lucide-react';
import { appStore } from '@/lib/data/mock-store';
import { Brand, Product, ContentCheckResult, AnalyzedClaim } from '@/types';

// Preset test articles for instant demonstration
const PRESET_ARTICLES = [
  {
    name: 'Mẫu 1: Bài viết có nhiều vi phạm pháp chế điển hình (Trị nám tận gốc, 100%)',
    productId: 'p1-aura-serum',
    title: 'Siêu phẩm Serum AURA - Đặc trị nám tận gốc chỉ sau 3 ngày!',
    content: `Tinh chất AURA Niacinamide 10% Glow Serum là bước đột phá mới giúp điều trị nám tận gốc và xóa sạch mụn hoàn toàn.
Sản phẩm cam kết hiệu quả 100%, an toàn tuyệt đối và hoàn toàn không kích ứng cho mọi loại da.
Chỉ sau 3 ngày sử dụng, làn da sẽ bật 5 tông và tái tạo tế bào gốc sâu bên trong biểu bì da.
Nhờ chứa Niacinamide 10% và Zinc PCA 1%, serum giúp làm sáng đều màu da và hỗ trợ kiểm soát bã nhờn dư thừa.
Hãy thoa 2 lần mỗi ngày để sở hữu làn da không tì vết mãi mãi!`
  },
  {
    name: 'Mẫu 2: Bài viết chuẩn mực tuân thủ Thông tư 06/2011/TT-BYT',
    productId: 'p1-aura-serum',
    title: 'Dưỡng sáng và cân bằng dầu thừa cùng Tinh chất AURA Niacinamide 10% Glow Serum',
    content: `Tinh chất dưỡng sáng da AURA Niacinamide 10% Glow Serum (Số công bố: 184920/22/CBMP-QLD) là giải pháp chăm sóc làn da xỉn màu và dầu nhờn.
Với công thức kết hợp Niacinamide 10% và Zinc PCA 1%, sản phẩm giúp làm sáng đều màu da và hỗ trợ làm mờ các đốm nâu nhẹ trên bề mặt biểu bì.
Đồng thời, serum hỗ trợ kiểm soát bã nhờn dư thừa và cân bằng độ ẩm cho làn da luôn thông thoáng.
Sử dụng 3-4 giọt thoa đều lên mặt và cổ sau bước làm sạch, dùng 2 lần mỗi ngày (sáng và tối) và kết hợp thoa kem chống nắng vào ban ngày để bảo vệ da tối ưu.`
  },
  {
    name: 'Mẫu 3: Sản phẩm chưa có tài liệu duyệt (Kiểm tra chống hallucination)',
    productId: 'p5-perle-cream',
    title: 'Kem dưỡng sáng da ngọc trai PERLE',
    content: `Kem dưỡng ngọc trai PERLE giúp làm sáng da và mờ vết thâm hiệu quả nhờ chiết xuất ngọc trai và tranexamic acid.`
  }
];

function AiCheckerContent() {
  const searchParams = useSearchParams();
  const urlProductId = searchParams.get('productId');

  const [brands] = useState<Brand[]>(() => appStore.getBrands());
  const [products] = useState<Product[]>(() => appStore.getProducts());

  const [selectedBrandId, setSelectedBrandId] = useState<string>(brands[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState<string>(urlProductId || products[0]?.id || '');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<ContentCheckResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync selected product
  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];

  useEffect(() => {
    if (urlProductId) {
      const p = products.find(prod => prod.id === urlProductId);
      if (p) {
        setSelectedProductId(p.id);
        setSelectedBrandId(p.brand_id);
      }
    }
  }, [urlProductId, products]);

  // Handle preset selection
  const handleSelectPreset = (index: number) => {
    const preset = PRESET_ARTICLES[index];
    if (preset) {
      const p = products.find(prod => prod.id === preset.productId);
      if (p) {
        setSelectedProductId(p.id);
        setSelectedBrandId(p.brand_id);
      }
      setTitle(preset.title);
      setContent(preset.content);
      setCheckResult(null);
    }
  };

  // Word & Char counts
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const handleRunCheck = async () => {
    if (!currentProduct || !content.trim()) return;

    setIsChecking(true);
    try {
      const res = await fetch('/api/ai/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: currentProduct.id,
          title: title || `Bài viết kiểm tra: ${currentProduct.name}`,
          content,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi kiểm tra AI');
      }

      setCheckResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  // Accept single suggested rewrite
  const handleAcceptSuggestion = (claimId: string, suggestedText: string) => {
    if (!checkResult) return;

    const updatedClaims = checkResult.claims.map(c => {
      if (c.id === claimId) {
        return { ...c, user_action: 'accepted' as const, modified_text: suggestedText };
      }
      return c;
    });

    setCheckResult({
      ...checkResult,
      claims: updatedClaims,
    });

    // Replace in content
    const claim = checkResult.claims.find(c => c.id === claimId);
    if (claim) {
      setContent(prev => prev.replace(claim.original_text, suggestedText));
    }
  };

  // Reject suggestion
  const handleRejectSuggestion = (claimId: string) => {
    if (!checkResult) return;
    const updatedClaims = checkResult.claims.map(c => {
      if (c.id === claimId) {
        return { ...c, user_action: 'rejected' as const };
      }
      return c;
    });
    setCheckResult({ ...checkResult, claims: updatedClaims });
  };

  // Apply all valid suggestions
  const handleApplyAllValid = () => {
    if (!checkResult) return;
    let newContent = content;

    const updatedClaims = checkResult.claims.map(c => {
      if (c.suggested_rewrite && c.evidence_status !== 'compliant') {
        newContent = newContent.replace(c.original_text, c.suggested_rewrite);
        return { ...c, user_action: 'accepted' as const, modified_text: c.suggested_rewrite };
      }
      return c;
    });

    setContent(newContent);
    setCheckResult({ ...checkResult, claims: updatedClaims });
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasApprovedDocuments = (currentProduct?.approved_documents_count || 0) > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span>Kiểm Tra Nội Dung Quảng Cáo AI</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Đối chiếu tự động từng tuyên bố với hồ sơ đã duyệt & Thông tư 06/2011/TT-BYT
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Mẫu thử nghiệm:</span>
          <select
            onChange={(e) => handleSelectPreset(Number(e.target.value))}
            defaultValue=""
            className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-blue-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
          >
            <option value="" disabled>-- Chọn bài viết mẫu --</option>
            {PRESET_ARTICLES.map((preset, idx) => (
              <option key={idx} value={idx}>{preset.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Two Column Layout: Editor (Left) & AI Result (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* KHU VỰC BÊN TRÁI – NHẬP BÀI VIẾT (5 Cols)                                 */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              1. Thông Tin & Bài Viết Cần Kiểm Tra
            </h2>
          </div>

          {/* Product & Brand Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Thương hiệu
              </label>
              <select
                value={selectedBrandId}
                onChange={(e) => {
                  setSelectedBrandId(e.target.value);
                  const firstOfBrand = products.find(p => p.brand_id === e.target.value);
                  if (firstOfBrand) setSelectedProductId(firstOfBrand.id);
                }}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
              >
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Sản phẩm đối chiếu
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs font-semibold focus:border-blue-500 focus:outline-none truncate"
              >
                {products
                  .filter(p => p.brand_id === selectedBrandId)
                  .map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Dossier Status Alert */}
          {currentProduct && (
            <div className={`rounded-xl p-3 border text-xs ${
              hasApprovedDocuments 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  {hasApprovedDocuments ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  )}
                  {hasApprovedDocuments ? 'Hồ sơ đã sẵn sàng đối chiếu' : 'CẢNH BÁO: Chưa có tài liệu duyệt'}
                </span>
                <span className="text-[11px] font-mono font-bold">
                  {currentProduct.approved_documents_count || 0} tài liệu
                </span>
              </div>
              <p className="mt-1 text-[11px] opacity-90 leading-relaxed">
                {hasApprovedDocuments
                  ? `Số tiếp nhận CBMP: ${currentProduct.notification_number || '184920/22/CBMP-QLD'}. Có đầy đủ thành phần INCI và thử nghiệm lâm sàng.`
                  : 'Sản phẩm này chưa có tài liệu hồ sơ nào được duyệt. AI sẽ cảnh báo không đủ căn cứ đối chiếu.'}
              </p>
            </div>
          )}

          {/* Article Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Tiêu đề bài viết quảng cáo
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Tinh chất AURA Niacinamide dưỡng sáng da..."
              className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Article Content Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Nội dung bài viết (Có thể dán văn bản dài)
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {wordCount} từ • {charCount} ký tự
              </span>
            </div>
            <textarea
              rows={11}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập hoặc dán nội dung bài quảng cáo, bài PR báo chí, kịch bản video hoặc bài post Facebook cần kiểm tra..."
              className="w-full rounded-lg border border-slate-200 p-3 text-xs leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunCheck}
            disabled={isChecking || !content.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            {isChecking ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Đang phân tích từng tuyên bố & đối chiếu RAG...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>KIỂM TRA BẰNG AI</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* KHU VỰC BÊN PHẢI – KẾT QUẢ AI (7 Cols)                                     */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                2. Kết Quả Thẩm Định & Đối Chiếu AI
              </h2>
              {checkResult && (
                <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold">
                  {checkResult.ai_model}
                </span>
              )}
            </div>

            {checkResult && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyContent}
                  title="Sao chép bài viết"
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-1 font-medium"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  title="Xuất báo cáo PDF"
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-1 font-medium"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>In / PDF</span>
                </button>
              </div>
            )}
          </div>

          {!checkResult ? (
            <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400 space-y-3">
              <div className="rounded-full bg-slate-50 p-4 border border-slate-100">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-sm font-semibold text-slate-700">
                Chưa có kết quả kiểm tra
              </div>
              <p className="text-xs text-slate-400 max-w-sm">
                Nhập nội dung bài viết và bấm <strong>"KIỂM TRA BẰNG AI"</strong> hoặc chọn bài mẫu bên trên để bắt đầu phân tích đối chiếu.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Overall Status Banner */}
              <div className={`rounded-xl p-4 border flex items-center justify-between ${
                checkResult.overall_status === 'compliant'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : checkResult.overall_status === 'insufficient_dossier'
                  ? 'bg-slate-50 border-slate-300 text-slate-800'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center gap-3">
                  {checkResult.overall_status === 'compliant' ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  ) : checkResult.overall_status === 'insufficient_dossier' ? (
                    <AlertTriangle className="h-6 w-6 text-slate-600" />
                  ) : (
                    <ShieldAlert className="h-6 w-6 text-rose-600" />
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      {checkResult.overall_status === 'compliant'
                        ? 'ĐẠT TIÊU CHUẨN PHÁP CHẾ'
                        : checkResult.overall_status === 'insufficient_dossier'
                        ? 'KHÔNG ĐỦ CĂN CỨ HỒ SƠ'
                        : 'PHÁT HIỆN RỦI RO QUẢNG CÁO & MÂU THUẪN'}
                    </div>
                    <div className="text-xs opacity-80 mt-0.5">
                      {checkResult.overall_status === 'compliant'
                        ? 'Tất cả các tuyên bố đều có tài liệu công bố chứng minh và tuân thủ quy định.'
                        : checkResult.overall_status === 'insufficient_dossier'
                        ? 'Sản phẩm chưa có tài liệu duyệt để đối chiếu. Cần nạp hồ sơ trước.'
                        : 'Phát hiện các từ ngữ mang tính điều trị hoặc tuyên bố chưa được kiểm chứng.'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black font-mono">
                    {Math.round((checkResult.compliant_claims / (checkResult.total_claims || 1)) * 100)}%
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Độ phù hợp
                  </div>
                </div>
              </div>

              {/* Counter Pills Grid */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2">
                  <div className="text-base font-bold text-emerald-700">{checkResult.compliant_claims}</div>
                  <div className="text-[10px] font-semibold text-emerald-800 uppercase">Phù hợp</div>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-2">
                  <div className="text-base font-bold text-amber-700">{checkResult.insufficient_claims}</div>
                  <div className="text-[10px] font-semibold text-amber-800 uppercase">Chưa đủ căn cứ</div>
                </div>
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-2">
                  <div className="text-base font-bold text-rose-700">{checkResult.contradictory_claims}</div>
                  <div className="text-[10px] font-semibold text-rose-800 uppercase">Mâu thuẫn</div>
                </div>
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-2">
                  <div className="text-base font-bold text-purple-700">{checkResult.legal_risk_claims}</div>
                  <div className="text-[10px] font-semibold text-purple-800 uppercase">Rủi ro pháp lý</div>
                </div>
              </div>

              {/* Global Quick Action Toolbar */}
              {checkResult.claims.some(c => c.suggested_rewrite && c.user_action !== 'accepted') && (
                <div className="flex items-center justify-between bg-blue-50/60 p-3 rounded-xl border border-blue-200">
                  <span className="text-xs font-semibold text-blue-900">
                    Có gợi ý chỉnh sửa chuẩn hóa theo hồ sơ công bố:
                  </span>
                  <button
                    onClick={handleApplyAllValid}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                  >
                    Áp dụng tất cả gợi ý hợp lệ
                  </button>
                </div>
              )}

              {/* Claims Analysis List */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Chi tiết từng tuyên bố ({checkResult.claims.length} câu phân tích):
                </div>

                {checkResult.claims.map((claim) => {
                  const isAccepted = claim.user_action === 'accepted';
                  const isRejected = claim.user_action === 'rejected';

                  return (
                    <div
                      key={claim.id}
                      className={`rounded-xl border p-4 transition-all ${
                        claim.risk_level === 'high'
                          ? 'border-rose-200 bg-rose-50/30'
                          : claim.evidence_status === 'insufficient'
                          ? 'border-amber-200 bg-amber-50/20'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      {/* Claim Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-600">
                            #{claim.order}
                          </span>

                          {/* Evidence Badge */}
                          {claim.evidence_status === 'compliant' ? (
                            <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                              PHÙ HỢP
                            </span>
                          ) : claim.evidence_status === 'contradictory' ? (
                            <span className="rounded-md bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold">
                              MÂU THUẪN TÀI LIỆU
                            </span>
                          ) : (
                            <span className="rounded-md bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                              CHƯA ĐỦ CĂN CỨ
                            </span>
                          )}

                          {/* Risk Badge */}
                          {claim.risk_level === 'high' && (
                            <span className="rounded-md bg-rose-600 text-white px-2 py-0.5 text-[10px] font-bold">
                              RỦI RO CAO
                            </span>
                          )}
                        </div>

                        {claim.requires_human_review && (
                          <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                            <HelpCircle className="h-3 w-3" />
                            Cần nhân sự thẩm định
                          </span>
                        )}
                      </div>

                      {/* Original Text */}
                      <p className="mt-2 text-xs font-semibold text-slate-900 leading-relaxed bg-white/70 p-2 rounded-lg border border-slate-100">
                        "{claim.original_text}"
                      </p>

                      {/* Issues list */}
                      {claim.issues && claim.issues.length > 0 && (
                        <div className="mt-2.5 space-y-1">
                          {claim.issues.map((issue, i) => (
                            <div key={i} className="text-xs text-rose-700 flex items-start gap-1.5">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-500" />
                              <span>{issue}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Document Citations */}
                      {claim.citations && claim.citations.length > 0 && (
                        <div className="mt-3 rounded-lg bg-blue-50/70 p-2.5 border border-blue-100 text-xs">
                          <div className="font-bold text-blue-900 flex items-center gap-1 mb-1">
                            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                            <span>Dẫn chứng tài liệu hồ sơ:</span>
                          </div>
                          {claim.citations.map((cite, i) => (
                            <div key={i} className="text-[11px] text-blue-800 space-y-0.5">
                              <div>
                                File: <strong>{cite.document_name}</strong> • <strong>Trang {cite.page_number}</strong>
                              </div>
                              <div className="italic text-slate-600 bg-white/80 p-1.5 rounded border border-blue-100 mt-1">
                                "{cite.quoted_text}"
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggested Rewrite */}
                      {claim.suggested_rewrite && (
                        <div className="mt-3 rounded-lg bg-emerald-50/70 p-2.5 border border-emerald-200">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                            <span>Gợi ý chỉnh sửa hợp chuẩn:</span>
                            {isAccepted ? (
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                                Đã áp dụng
                              </span>
                            ) : isRejected ? (
                              <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                                Đã từ chối
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleAcceptSuggestion(claim.id, claim.suggested_rewrite!)}
                                  className="inline-flex items-center gap-1 rounded bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold hover:bg-emerald-700"
                                >
                                  <Check className="h-3 w-3" />
                                  <span>Chấp nhận</span>
                                </button>
                                <button
                                  onClick={() => handleRejectSuggestion(claim.id)}
                                  className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white text-slate-600 px-2 py-0.5 text-[10px] font-bold hover:bg-slate-50"
                                >
                                  <X className="h-3 w-3" />
                                  <span>Bỏ qua</span>
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-emerald-800 italic">
                            "{claim.suggested_rewrite}"
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Submit for Approval */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handleRunCheck}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Kiểm tra lại</span>
                </button>

                <button
                  onClick={() => {
                    alert('Bài viết đã được gửi vào danh sách chờ Duyệt Pháp Chế thành công!');
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Gửi duyệt bài viết</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AiCheckerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Đang tải bộ thẩm định AI...</div>}>
      <AiCheckerContent />
    </Suspense>
  );
}
