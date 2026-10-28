'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Edit,
  X,
  Sparkles
} from 'lucide-react';
import { appStore } from '@/lib/data/mock-store';
import { Product, Brand } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(() => appStore.getProducts());
  const [brands] = useState<Brand[]>(() => appStore.getBrands());
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [brandId, setBrandId] = useState(brands[0]?.id || '');
  const [category, setCategory] = useState('');
  const [notificationNumber, setNotificationNumber] = useState('');
  const [responsibleEntity, setResponsibleEntity] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [inciText, setInciText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [warnings, setWarnings] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const filtered = products.filter(p => {
    const matchBrand = selectedBrand === 'all' || p.brand_id === selectedBrand;
    const matchSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.notification_number && p.notification_number.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchBrand && matchSearch;
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCode(`PRD-${Math.floor(1000 + Math.random() * 9000)}`);
    setBrandId(brands[0]?.id || '');
    setCategory('Tinh chất / Serum dưỡng sáng');
    setNotificationNumber('');
    setResponsibleEntity('');
    setManufacturer('');
    setInciText('Water, Glycerin, Niacinamide, Butylene Glycol');
    setBenefitsText('Hỗ trợ làm sáng da và đều màu biểu bì\nCung cấp độ ẩm duy trì sự mềm mại');
    setUsageInstructions('Thoa 2 lần mỗi ngày sau bước làm sạch.');
    setWarnings('Chỉ dùng ngoài da. Ngưng dùng nếu kích ứng.');
    setImageUrl('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=60');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCode(p.code);
    setBrandId(p.brand_id);
    setCategory(p.category);
    setNotificationNumber(p.notification_number || '');
    setResponsibleEntity(p.responsible_entity || '');
    setManufacturer(p.manufacturer || '');
    setInciText(p.inci_ingredients.join(', '));
    setBenefitsText(p.verified_benefits.join('\n'));
    setUsageInstructions(p.usage_instructions || '');
    setWarnings(p.warnings || '');
    setImageUrl(p.image_url || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const incis = inciText.split(',').map(s => s.trim()).filter(Boolean);
    const benefits = benefitsText.split('\n').map(s => s.trim()).filter(Boolean);

    appStore.saveProduct({
      id: editingProduct?.id,
      name,
      code,
      brand_id: brandId,
      category,
      notification_number: notificationNumber,
      responsible_entity: responsibleEntity,
      manufacturer,
      inci_ingredients: incis,
      verified_benefits: benefits,
      usage_instructions: usageInstructions,
      warnings,
      image_url: imageUrl,
      dossier_status: 'approved',
    });

    setProducts(appStore.getProducts());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hồ Sơ Sản Phẩm Mỹ Phẩm
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý số tiếp nhận Phiếu công bố, thành phần INCI và công dụng đã được xác minh
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm sản phẩm mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, mã, hoặc số công bố..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-4 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Thương hiệu:</span>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Tất cả thương hiệu ({brands.length})</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => {
          const hasApprovedDocs = (product.approved_documents_count || 0) > 0;

          return (
            <div
              key={product.id}
              className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Product Card Header */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=60'}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur-xs">
                      {product.brand_name}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {hasApprovedDocs ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/95 text-white px-2 py-0.5 text-[10px] font-semibold shadow-xs">
                        <CheckCircle2 className="h-3 w-3" />
                        Hồ sơ hợp lệ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/95 text-white px-2 py-0.5 text-[10px] font-semibold shadow-xs">
                        <AlertCircle className="h-3 w-3" />
                        Chưa có tài liệu duyệt
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="text-[11px] font-mono font-medium text-slate-400">
                    Mã: {product.code}
                  </div>
                  <h2 className="mt-1 text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {product.name}
                  </h2>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Số tiếp nhận CB:</span>
                      <span className="font-semibold text-slate-800 font-mono text-[11px]">
                        {product.notification_number || 'Chưa cập nhật'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Loại mỹ phẩm:</span>
                      <span className="font-medium text-slate-700">{product.category}</span>
                    </div>
                  </div>

                  {/* Verified Claims Preview */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Công dụng đã xác minh ({product.verified_benefits.length}):
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {product.verified_benefits.slice(0, 2).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span className="line-clamp-1">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* INCI Ingredients tags */}
                  <div className="mt-3">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Thành phần chính:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.inci_ingredients.slice(0, 4).map((ing, i) => (
                        <span key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                          {ing}
                        </span>
                      ))}
                      {product.inci_ingredients.length > 4 && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{product.inci_ingredients.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>{product.approved_documents_count || 0} tài liệu</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
                    title="Chỉnh sửa sản phẩm"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/dashboard/checker?productId=${product.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Kiểm tra</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Chỉnh sửa hồ sơ sản phẩm' : 'Thêm sản phẩm mỹ phẩm mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thương hiệu *
                  </label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã sản phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên sản phẩm đầy đủ (Theo Phiếu công bố) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Tinh chất dưỡng sáng da AURA Niacinamide 10% Glow Serum"
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số tiếp nhận Phiếu công bố CBMP *
                  </label>
                  <input
                    type="text"
                    required
                    value={notificationNumber}
                    onChange={(e) => setNotificationNumber(e.target.value)}
                    placeholder="Ví dụ: 184920/22/CBMP-QLD"
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Loại mỹ phẩm (Dạng sản phẩm)
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Serum, Kem dưỡng, Sữa rửa mặt..."
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tổ chức/Doanh nghiệp chịu trách nhiệm
                  </label>
                  <input
                    type="text"
                    value={responsibleEntity}
                    onChange={(e) => setResponsibleEntity(e.target.value)}
                    placeholder="Công ty TNHH..."
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nhà sản xuất & Nước xuất xứ
                  </label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="Cosmax Bio Co., Ltd - Hàn Quốc"
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Danh mục thành phần INCI (Phân cách bằng dấu phẩy)
                </label>
                <textarea
                  rows={2}
                  value={inciText}
                  onChange={(e) => setInciText(e.target.value)}
                  placeholder="Water, Niacinamide, Glycerin, Zinc PCA, Sodium Hyaluronate..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Công dụng đã được cơ quan chức năng xác minh (Mỗi dòng một công dụng)
                </label>
                <textarea
                  rows={3}
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  placeholder="Giúp làm sáng đều màu da...&#10;Hỗ trợ kiểm soát bã nhờn dư thừa..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-amber-600 mt-1">
                  * Lưu ý: Không tự suy luận thêm công dụng ngoài phạm vi phiếu công bố.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hướng dẫn sử dụng chuẩn
                  </label>
                  <textarea
                    rows={2}
                    value={usageInstructions}
                    onChange={(e) => setUsageInstructions(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cảnh báo bắt buộc
                  </label>
                  <textarea
                    rows={2}
                    value={warnings}
                    onChange={(e) => setWarnings(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Hình ảnh sản phẩm
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700"
                >
                  {editingProduct ? 'Cập nhật hồ sơ' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
