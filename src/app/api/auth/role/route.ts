import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/data/mock-store';
import { UserRole } from '@/types';

export async function GET() {
  const user = appStore.getCurrentUser();
  return NextResponse.json({ user });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role } = body as { role: UserRole };

    if (!['super_admin', 'reviewer', 'employee'].includes(role)) {
      return NextResponse.json({ error: 'Vai trò không hợp lệ' }, { status: 400 });
    }

    appStore.setCurrentUserRole(role);
    return NextResponse.json({ success: true, user: appStore.getCurrentUser() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
