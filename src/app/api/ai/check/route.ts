import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/data/mock-store';
import { runCosmeticContentCheck } from '@/lib/ai/checker';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, title, content } = body;

    if (!productId || !content) {
      return NextResponse.json(
        { error: 'Thiếu thông tin sản phẩm hoặc nội dung bài viết cần kiểm tra' },
        { status: 400 }
      );
    }

    const product = appStore.getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Không tìm thấy sản phẩm trong cơ sở dữ liệu' },
        { status: 404 }
      );
    }

    const documents = appStore.getDocuments(productId);
    const currentUser = appStore.getCurrentUser();

    // Thực thi quy trình RAG & AI Verification
    const result = await runCosmeticContentCheck({
      product,
      documents,
      title: title || `Bài viết kiểm tra: ${product.name}`,
      content,
      userId: currentUser.id,
    });

    // Lưu kết quả vào store
    appStore.saveCheck(result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Lỗi API Check:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình kiểm tra AI: ' + error.message },
      { status: 500 }
    );
  }
}
