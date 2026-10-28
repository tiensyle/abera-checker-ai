'use client';

import { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  UserCheck, 
  Briefcase, 
  Plus, 
  Check, 
  X,
  Mail,
  Building,
  Lock
} from 'lucide-react';
import { appStore } from '@/lib/data/mock-store';
import { UserProfile, UserRole } from '@/types';
import { PERMISSIONS } from '@/lib/permissions';

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>(() => appStore.getUsers());
  const currentUser = appStore.getCurrentUser();

  const roleMeta: Record<UserRole, { label: string; color: string; desc: string }> = {
    super_admin: {
      label: 'Super Admin',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      desc: 'Toàn quyền cấu hình AI, quản trị người dùng, quản trị thương hiệu và bộ quy tắc pháp lý.',
    },
    reviewer: {
      label: 'Admin / Reviewer',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      desc: 'Quản lý sản phẩm, nạp và phê duyệt tài liệu nguồn, thẩm định và phê duyệt bài viết.',
    },
    employee: {
      label: 'Nhân viên (Content)',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      desc: 'Xem sản phẩm được phân quyền, kiểm tra bài viết AI, chỉnh sửa nội dung và gửi yêu cầu phê duyệt.',
    },
  };

  const permissionsMatrix = [
    { name: 'Quản trị người dùng & phân quyền', roles: ['super_admin'] },
    { name: 'Quản trị bộ quy tắc pháp lý (Thông tư 06)', roles: ['super_admin'] },
    { name: 'Quản lý thương hiệu (CRUD)', roles: ['super_admin', 'reviewer'] },
    { name: 'Quản lý sản phẩm & số công bố', roles: ['super_admin', 'reviewer'] },
    { name: 'Phê duyệt tài liệu nguồn (Dossier RAG)', roles: ['super_admin', 'reviewer'] },
    { name: 'Phê duyệt bài viết của người khác', roles: ['super_admin', 'reviewer'] },
    { name: 'Thực thi kiểm tra AI bài viết', roles: ['super_admin', 'reviewer', 'employee'] },
    { name: 'Áp dụng gợi ý sửa và gửi duyệt', roles: ['super_admin', 'reviewer', 'employee'] },
    { name: 'Tự phê duyệt bài viết của chính mình', roles: [] }, // Tuyệt đối không cho phép
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Quản Lý Nhân Viên & Phân Quyền (RBAC)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quy định phân quyền 3 tầng: Super Admin, Reviewer Thẩm Định và Nhân Viên Content
          </p>
        </div>

        <button
          onClick={() => alert('Chức năng thêm tài khoản thành viên liên kết qua Supabase Auth.')}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Mời thành viên mới</span>
        </button>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {users.map((u) => {
          const meta = roleMeta[u.role];
          const isMe = u.id === currentUser.id;

          return (
            <div
              key={u.id}
              className={`rounded-2xl border p-5 bg-white shadow-sm flex flex-col justify-between transition-all ${
                isMe ? 'ring-2 ring-blue-500 border-blue-200' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold border ${meta.color}`}>
                    {meta.label}
                  </span>
                  {isMe && (
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                      Tài khoản đang đăng nhập
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={u.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"}
                    alt={u.full_name}
                    className="h-12 w-12 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{u.full_name}</h2>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <Mail className="h-3 w-3 text-slate-400" />
                      <span>{u.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-slate-400" />
                    <span>Bộ phận: <strong>{u.department}</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {meta.desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Trạng thái: Hoạt động</span>
                <span className="text-emerald-600 font-bold">Xác thực Supabase</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-600" />
            <span>Ma Trận Quyền Hạn Chi Tiết (Role-Based Access Control)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quy định nghiêm ngặt: Nhân viên không thể tự duyệt tài liệu nguồn và không thể tự duyệt bài viết của chính mình
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-3 px-4">Quyền hạn / Hành động</th>
                <th className="py-3 px-4 text-center">Super Admin</th>
                <th className="py-3 px-4 text-center">Reviewer / Pháp chế</th>
                <th className="py-3 px-4 text-center">Nhân viên (Content)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.roles.includes('super_admin') ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.roles.includes('reviewer') ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.roles.includes('employee') ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
