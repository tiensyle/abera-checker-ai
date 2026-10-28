'use client';

import { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink,
  PackageCheck,
  CheckCircle,
  X
} from 'lucide-react';
import { appStore } from '@/lib/data/mock-store';
import { Brand } from '@/types';
import { formatDate } from '@/lib/utils';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(() => appStore.getBrands());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingBrand(null);
    setName('');
    setCode('');
    setDescription('');
    setLogoUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setCode(b.code);
    setDescription(b.description || '');
    setLogoUrl(b.logo_url || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    appStore.saveBrand({
      id: editingBrand?.id,
      name,
      code,
      description,
      logo_url: logoUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=60',
    });

    setBrands(appStore.getBrands());
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn ngưng hoạt động thương hiệu này không?')) {
      appStore.deleteBrand(id);
      setBrands(appStore.getBrands());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Quản Lý Thương Hiệu Mỹ Phẩm
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách 5 thương hiệu chiến lược ban đầu và các thương hiệu mở rộng
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm thương hiệu mới</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên thương hiệu hoặc mã..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Hiển thị: <span className="font-bold text-slate-800">{filteredBrands.length}</span> thương hiệu
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-100 shadow-xs"
                  />
                  <div>
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {brand.name}
                    </h2>
                    <span className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-600">
                      Mã: {brand.code}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(brand)}
                    title="Chỉnh sửa thương hiệu"
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    title="Xóa / Ngưng hoạt động"
                    className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {brand.description || 'Chưa có mô tả chi tiết cho thương hiệu này.'}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                <PackageCheck className="h-4 w-4 text-blue-500" />
                <span>{brand.product_count || 0} sản phẩm</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Hoạt động</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên thương hiệu *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: AURA, DERM..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã thương hiệu (Code) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ví dụ: AURA, DERM, LUMI..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono uppercase focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Logo / Hình ảnh
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả định vị thương hiệu
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả danh mục mỹ phẩm, đối tượng khách hàng..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
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
                  {editingBrand ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
