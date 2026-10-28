'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  Sparkles, 
  ShieldAlert, 
  UserCheck, 
  Briefcase,
  Layers
} from 'lucide-react';
import { UserRole, UserProfile } from '@/types';

export function Header() {
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch('/api/auth/role')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          setCurrentRole(data.user.role);
        }
      })
      .catch(() => {});
  }, []);

  const handleRoleChange = async (newRole: UserRole) => {
    try {
      const res = await fetch('/api/auth/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrentRole(data.user.role);
        setCurrentUser(data.user);
        window.location.reload(); // Refresh state across page
      }
    } catch (err) {
      console.error(err);
    }
  };

  const roleLabels: Record<UserRole, { label: string; color: string; icon: any }> = {
    super_admin: { label: 'SUPER ADMIN', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: ShieldAlert },
    reviewer: { label: 'REVIEWER / PHÁP CHẾ', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: UserCheck },
    employee: { label: 'NHÂN VIÊN (CONTENT)', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Briefcase },
  };

  const currentRoleConfig = roleLabels[currentRole] || roleLabels.super_admin;
  const RoleIcon = currentRoleConfig.icon;

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      {/* Search Input */}
      <div className="flex items-center gap-3 lg:w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, thương hiệu, số công bố..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-4 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Action Area & Role Switcher */}
      <div className="flex items-center gap-4">
        {/* Quick Check Button */}
        <Link
          href="/dashboard/checker"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Kiểm tra bài viết AI</span>
        </Link>

        {/* Live Role Switcher (Cho phép test trực tiếp các phân quyền RBAC) */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
          <Layers className="h-3.5 w-3.5 text-slate-400 ml-1.5" />
          <span className="text-[11px] font-medium text-slate-500 hidden md:inline">Vai trò:</span>
          <select
            value={currentRole}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            className="rounded border-0 bg-transparent py-0.5 pl-1 pr-6 text-xs font-semibold text-slate-800 focus:ring-0 cursor-pointer"
          >
            <option value="super_admin">Super Admin (Toàn quyền)</option>
            <option value="reviewer">Reviewer / Thẩm định</option>
            <option value="employee">Nhân viên (Content)</option>
          </select>
        </div>

        {/* Current Role Badge */}
        <div className={`hidden lg:flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold border ${currentRoleConfig.color}`}>
          <RoleIcon className="h-3 w-3" />
          <span>{currentRoleConfig.label}</span>
        </div>

        {/* Notifications */}
        <button 
          title="Thông báo"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
          <img
            src={currentUser?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"}
            alt="User avatar"
            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
          />
          <div className="hidden text-left xl:block">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {currentUser?.full_name || 'Admin'}
            </div>
            <div className="text-[10px] text-slate-400">
              {currentUser?.department || 'Ban Pháp Chế'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
