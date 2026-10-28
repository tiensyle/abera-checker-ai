import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/data/mock-store';
import { processDocumentFile } from '@/lib/documents/processor';
import { DocumentType } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const productId = formData.get('productId') as string;
    const docType = (formData.get('docType') as DocumentType) || 'other';

    if (!file || !productId) {
      return NextResponse.json(
        { error: 'Vui lòng chọn file và sản phẩm liên kết' },
        { status: 400 }
      );
    }

    const product = appStore.getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const documentId = `doc-${Date.now()}`;

    // Xử lý trích xuất văn bản / phân trang / mã hóa hash
    const processed = await processDocumentFile(
      buffer,
      file.name,
      file.type,
      documentId
    );

    // Lưu tài liệu vào kho hồ sơ
    const savedDoc = appStore.saveDocument({
      id: documentId,
      product_id: productId,
      product_name: product.name,
      brand_name: product.brand_name,
      doc_type: docType,
      file_name: file.name,
      file_format: file.type || 'application/octet-stream',
      file_size: file.size,
      storage_path: `documents/${productId}/${file.name}`,
      file_hash: processed.file_hash,
      version: 1,
      processing_status: 'needs_review', // Chờ Admin xác nhận nội dung trích xuất
      approval_status: 'pending',
      extracted_text: processed.extracted_text,
      pages: processed.pages,
    });

    return NextResponse.json({
      success: true,
      document: savedDoc,
      warnings: processed.warnings,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Không thể xử lý file tải lên: ' + err.message },
      { status: 500 }
    );
  }
}
