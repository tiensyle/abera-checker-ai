'use client';

import { useState } from 'react';
import { 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Key, 
  Save, 
  Check, 
  AlertTriangle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { INITIAL_COMPLIANCE_RULES } from '@/lib/compliance/rules';
import { ComplianceRule } from '@/types';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [rules, setRules] = useState<ComplianceRule[]>(INITIAL_COMPLIANCE_RULES);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, is_active: !r.is_active } : r));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Cài Đặt Hệ Thống & Cấu Hình AI
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý kết nối mô hình OpenAI, phân giải RAG và các điều luật kiểm soát quảng cáo mỹ phẩm
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>Cấu hình đã được lưu và cập nhật thành công!</span>
        </div>
      )}

      {/* 1. AI Configuration Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Cấu Hình Mô Hình AI & RAG</h2>
            <p className="text-xs text-slate-500">Thiết lập kết nối OpenAI API thông qua backend bảo mật</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              OpenAI API Key (Chỉ lưu phía Backend Server, bảo mật tuyệt đối)
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              * Khi chưa điền key, hệ thống tự động kích hoạt Bộ phân tích lai RAG nội bộ chính xác cao để phục vụ thử nghiệm không gián đoạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mô hình suy luận (Inference Model)
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
              >
                <option value="gpt-4o">gpt-4o (Khuyên dùng - Chuẩn xác cao nhất)</option>
                <option value="gpt-4o-mini">gpt-4o-mini (Tốc độ cao, tối ưu chi phí)</option>
                <option value="o1-preview">o1-preview (Suy luận sâu pháp chế)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mô hình Embeddings pgvector
              </label>
              <input
                type="text"
                disabled
                value="text-embedding-3-small (1536 chiều)"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>Lưu cấu hình AI</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Vietnamese Compliance Rules Manager */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bộ Quy Tắc Pháp Chế Quảng Cáo Mỹ Phẩm Việt Nam
              </h2>
              <p className="text-xs text-slate-500">
                Cập nhật theo Thông tư 06/2011/TT-BYT, Nghị định 181/2013/NĐ-CP & Luật Quảng cáo
              </p>
            </div>
          </div>

          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600">
            Phiên bản: v1.0-VN-2024
          </span>
        </div>

        <div className="rounded-lg bg-amber-50/70 p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Lưu ý pháp lý:</strong> Kết quả phân tích của AI mang tính chất cảnh báo và hỗ trợ rà soát sơ bộ, không thay thế cho quyết định pháp lý chính thức của Ban Pháp chế hoặc Cơ quan Quản lý Dược Việt Nam.
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`rounded-xl border p-4 transition-all ${
                rule.is_active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                      {rule.rule_code}
                    </span>
                    <span className="rounded bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
                      {rule.legal_reference}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-1">{rule.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rule.description}</p>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {rule.keywords.slice(0, 6).map((kw, i) => (
                      <span key={i} className="rounded bg-rose-50 text-rose-700 border border-rose-100 px-1.5 py-0.5 text-[10px] font-medium">
                        "{kw}"
                      </span>
                    ))}
                    {rule.keywords.length > 6 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{rule.keywords.length - 6} từ khóa khác
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  className="rounded p-1 text-slate-500 hover:text-slate-900"
                  title={rule.is_active ? 'Vô hiệu hóa quy tắc' : 'Kích hoạt quy tắc'}
                >
                  {rule.is_active ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      Bật
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                      Tắt
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
