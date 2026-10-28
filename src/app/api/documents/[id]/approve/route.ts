import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/data/mock-store';
import { canApproveDocument } from '@/lib/permissions';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    const body = await req.json();
    const { action, notes } = body; // action: 'approve' | 'reject'

    const currentUser = appStore.getCurrentUser();

    // Kiểm tra phân quyền: Nhân viên KHÔNG được duyệt tài liệu nguồn
    if (!canApproveDocument(currentUser.role)) {
      return NextResponse.json(
        { error: 'Bạn không có quyền phê duyệt tài liệu nguồn này' },
        { status: 403 }
      );
    }

    const updated = appStore.updateDocumentApproval(
      documentId,
      action === 'approve' ? 'approved' : 'rejected',
      notes
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Không tìm thấy tài liệu' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, document: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Lỗi cập nhật trạng thái tài liệu: ' + err.message },
      { status: 500 }
    );
  }
}
