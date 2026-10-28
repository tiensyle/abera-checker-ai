import test from 'node:test';
import assert from 'node:assert';
import { canApproveDocument, canApproveContent } from '../src/lib/permissions';
import { evaluateVietnameseAdvertisingRules } from '../src/lib/compliance/rules';
import { runDeterministicHybridCheck, runCosmeticContentCheck } from '../src/lib/ai/checker';
import { Product, ProductDocument } from '../src/types';

test('1. Kiểm thử phân quyền: Nhân viên KHÔNG được duyệt tài liệu nguồn', () => {
  assert.strictEqual(canApproveDocument('employee'), false);
  assert.strictEqual(canApproveDocument('reviewer'), true);
  assert.strictEqual(canApproveDocument('super_admin'), true);
});

test('2. Kiểm thử an toàn: Người dùng KHÔNG được tự phê duyệt bài viết của chính mình', () => {
  const authorId = 'user-123';
  const reviewerId = 'user-123'; // Trùng với tác giả
  assert.strictEqual(canApproveContent('reviewer', authorId, reviewerId), false);
  assert.strictEqual(canApproveContent('super_admin', authorId, reviewerId), false);

  const anotherReviewerId = 'user-456';
  assert.strictEqual(canApproveContent('reviewer', authorId, anotherReviewerId), true);
});

test('3. Sản phẩm chưa có tài liệu ĐÃ DUYỆT KHÔNG ĐƯỢC kết luận đạt (Chống false positive)', async () => {
  const unapprovedProduct: Product = {
    id: 'p-test-no-docs',
    brand_id: 'b-test',
    brand_name: 'TEST_BRAND',
    code: 'TEST-01',
    name: 'Sản phẩm thử nghiệm không có hồ sơ',
    category: 'Kem dưỡng',
    inci_ingredients: ['Aqua'],
    verified_benefits: ['Dưỡng ẩm'],
    dossier_status: 'draft',
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const result = await runCosmeticContentCheck({
    product: unapprovedProduct,
    documents: [], // Không có tài liệu nào được duyệt
    title: 'Bài viết thử nghiệm',
    content: 'Kem dưỡng này giúp dưỡng ẩm sâu và làm trắng da.',
    userId: 'user-employee'
  });

  assert.strictEqual(result.overall_status, 'insufficient_dossier');
  assert.strictEqual(result.compliant_claims, 0);
  assert.ok(result.insufficient_claims > 0);
});

test('4. Phát hiện từ cấm mang tính điều trị (Trị nám tận gốc) theo Thông tư 06/2011/TT-BYT', () => {
  const sampleText = 'Sản phẩm này giúp điều trị nám tận gốc và chữa khỏi mụn nhanh chóng.';
  const violations = evaluateVietnameseAdvertisingRules(sampleText);
  assert.ok(violations.length > 0);
  assert.ok(violations.some(v => v.rule.category === 'therapeutic_prohibition'));
});

test('5. Phát hiện cam kết tuyệt đối 100% và an toàn tuyệt đối', () => {
  const sampleText = 'Cam kết hiệu quả 100% và hoàn toàn không kích ứng.';
  const violations = evaluateVietnameseAdvertisingRules(sampleText);
  assert.ok(violations.some(v => v.rule.category === 'absolute_claims'));
});

test('6. Tuyên bố thiếu căn cứ hồ sơ KHÔNG ĐƯỢC đánh dấu là phù hợp', () => {
  const product: Product = {
    id: 'p-aura',
    brand_id: 'b-aura',
    brand_name: 'AURA',
    code: 'AUR-01',
    name: 'Tinh chất AURA',
    category: 'Serum',
    inci_ingredients: ['Aqua', 'Niacinamide'],
    verified_benefits: ['Giúp làm sáng đều màu da nhẹ nhàng'],
    dossier_status: 'approved',
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const approvedDocs: ProductDocument[] = [
    {
      id: 'doc-1',
      product_id: 'p-aura',
      file_name: 'Phieu_Cong_Bo.pdf',
      doc_type: 'notification_slip',
      file_format: 'application/pdf',
      file_size: 1000,
      storage_path: 'doc1.pdf',
      file_hash: 'hash1',
      version: 1,
      processing_status: 'approved',
      approval_status: 'approved',
      pages: [
        {
          id: 'page-1',
          document_id: 'doc-1',
          page_number: 1,
          page_text: 'Mục đích sử dụng: Giúp làm sáng đều màu da nhẹ nhàng.',
          ocr_applied: false,
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  // Bài viết tuyên bố "nâng cơ mặt vĩnh viễn" (hoàn toàn không có trong hồ sơ)
  const result = runDeterministicHybridCheck(
    product,
    approvedDocs,
    'Tiêu đề',
    'Sản phẩm giúp nâng cơ mặt vĩnh viễn và triệt tiêu mỡ thừa.'
  );

  const claim = result.claims[0];
  assert.notStrictEqual(claim.evidence_status, 'compliant');
  assert.strictEqual(claim.evidence_status, 'insufficient');
});
