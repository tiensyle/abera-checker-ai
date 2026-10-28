'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Building2,
  Package,
  FolderArchive,
  History,
  BarChart3,
  Users,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const NAV_ITEMS = [
  {
    title: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'Thương hiệu',
    href: '/dashboard/brands',
    icon: Building2,
    badge: '5',
  },
  {
    title: 'Sản phẩm',
    href: '/dashboard/products',
    icon: Package,
    badge: null,
  },
  {
    title: 'Kho tài liệu',
    href: '/dashboard/documents',
    icon: FolderArchive,
    badge: null,
  },
  {
    title: 'Kiểm tra bài viết AI',
    href: '/dashboard/checker',
    icon: Sparkles,
    badge: 'AI Core',
    highlight: true,
  },
  {
    title: 'Lịch sử kiểm tra',
    href: '/dashboard/history',
    icon: History,
    badge: null,
  },
  {
    title: 'Báo cáo thống kê',
    href: '/dashboard/reports',
    icon: BarChart3,
    badge: null,
  },
  {
    title: 'Quản lý nhân viên',
    href: '/dashboard/users',
    icon: Users,
    badge: null,
  },
  {
    title: 'Cài đặt hệ thống',
    href: '/dashboard/settings',
    icon: Settings,
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white shadow-sm lg:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-slate-900 uppercase">
            Cosmetic AI
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            Content Checker VN
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Danh mục quản lý
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900',
                  item.highlight && !isActive && 'text-blue-600 hover:bg-blue-50/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive
                        ? 'text-blue-600'
                        : 'text-slate-400 group-hover:text-slate-700',
                      item.highlight && !isActive && 'text-blue-500'
                    )}
                  />
                  <span>{item.title}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      item.highlight
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Legal Standard Badge */}
      <div className="border-t border-slate-100 p-4 m-3 rounded-xl bg-slate-50 border">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Quy chuẩn pháp chế:
        </div>
        <div className="mt-1 text-[11px] text-slate-500 leading-relaxed">
          TT 06/2011/TT-BYT & NĐ 181/2013/NĐ-CP
        </div>
      </div>
    </aside>
  );
}
