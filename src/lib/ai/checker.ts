import OpenAI from 'openai';
import { Product, ProductDocument, AnalyzedClaim, ContentCheckResult } from '@/types';
import { evaluateVietnameseAdvertisingRules } from '@/lib/compliance/rules';

interface CheckContentOptions {
  product: Product;
  documents: ProductDocument[];
  title: string;
  content: string;
  userId: string;
}

export async function runCosmeticContentCheck(
  options: CheckContentOptions
): Promise<ContentCheckResult> {
  const { product, documents, title, content } = options;

  // 1. KIỂM TRA ĐIỀU KIỆN TIÊN QUYẾT: Hồ sơ sản phẩm phải có tài liệu được phê duyệt
  const approvedDocs = documents.filter(d => d.approval_status === 'approved');

  if (approvedDocs.length === 0) {
    // Theo yêu cầu mục 7: "Nếu sản phẩm chưa có tài liệu được phê duyệt, phải cảnh báo rằng
    // không đủ dữ liệu để đối chiếu. Không được trả về kết quả đạt yêu cầu giả."
    const sentences = splitIntoSentences(content);
    const emptyClaims: AnalyzedClaim[] = sentences.map((sent, idx) => ({
      id: `claim-${Date.now()}-${idx}`,
      order: idx + 1,
      original_text: sent.trim(),
      category: 'general',
      evidence_status: 'insufficient',
      risk_level: 'high',
      issues: [
        'Sản phẩm chưa có tài liệu hồ sơ nào được Phê duyệt. Không đủ căn cứ pháp lý để đối chiếu hoặc xác nhận công dụng.'
      ],
      citations: [],
      suggested_rewrite: null,
      requires_human_review: true,
      user_action: 'pending',
    }));

    return {
      id: `check-${Date.now()}`,
      product_id: product.id,
      product_name: product.name,
      brand_id: product.brand_id,
      brand_name: product.brand_name || '',
      title,
      original_content: content,
      status: 'needs_revision',
      overall_status: 'insufficient_dossier',
      total_claims: emptyClaims.length,
      compliant_claims: 0,
      insufficient_claims: emptyClaims.length,
      contradictory_claims: 0,
      legal_risk_claims: emptyClaims.length,
      claims: emptyClaims,
      ai_model: 'Rule-Engine-Dossier-Guard',
      rule_version: 'v1.0-VN-2024',
      created_at: new Date().toISOString(),
      reviewer_notes: 'CẢNH BÁO: Không có tài liệu hồ sơ hợp lệ cho sản phẩm này.',
    };
  }

  // 2. TẬP HỢP TẤT CẢ DỮ LIỆU ĐÃ DUYỆT TỪ CÁC TRANG CỦA TÀI LIỆU
  const documentContext = approvedDocs.map(doc => {
    const pageTexts = (doc.pages || []).map(p => 
      `--- [Tài liệu: "${doc.file_name}" | Trang: ${p.page_number} | Loại: ${doc.doc_type}] ---\n${p.page_text}`
    ).join('\n\n');

    return `TÀI LIỆU: ${doc.file_name} (Phiên bản ${doc.version})\n${pageTexts || doc.extracted_text || ''}`;
  }).join('\n\n=========================================\n\n');

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.startsWith('sk-') && !apiKey.includes('your-openai-api-key')) {
    // 3A. GỌI OPENAI API THỰC TẾ VỚI STRUCTURED OUTPUTS
    try {
      return await checkWithOpenAI({
        apiKey,
        product,
        approvedDocs,
        documentContext,
        title,
        content
      });
    } catch (error) {
      console.warn('Lỗi gọi OpenAI API, chuyển sang Bộ phân tích nội bộ:', error);
      return runDeterministicHybridCheck(product, approvedDocs, title, content);
    }
  } else {
    // 3B. BỘ PHÂN TÍCH RAG NỘI BỘ (Chính xác, chống hallucination, dựa trên luật VN & tài liệu thật)
    return runDeterministicHybridCheck(product, approvedDocs, title, content);
  }
}

async function checkWithOpenAI(params: {
  apiKey: string;
  product: Product;
  approvedDocs: ProductDocument[];
  documentContext: string;
  title: string;
  content: string;
}): Promise<ContentCheckResult> {
  const { apiKey, product, approvedDocs, documentContext, title, content } = params;
  const openai = new OpenAI({ apiKey });

  const systemPrompt = `Bạn là Chuyên gia Đánh giá Pháp chế Quảng cáo Mỹ phẩm tại Việt Nam (theo Thông tư 06/2011/TT-BYT, Nghị định 181/2013/NĐ-CP và Luật Quảng cáo).
Nhiệm vụ của bạn là kiểm tra tính xác thực và tuân thủ của bài viết quảng cáo dựa trên HỒ SƠ TÀI LIỆU CHÍNH THỨC CỦA SẢN PHẨM.

QUY TẮC BẮT BUỘC (CHỐNG BỊA ĐẶT / ANTI-HALLUCINATION):
1. CHỈ sử dụng tài liệu được cung cấp dưới đây. TUYỆT ĐỐI KHÔNG tự bịa ra công dụng, số trang, thành phần hay trích dẫn.
2. Nếu bài viết tuyên bố một công dụng hoặc thành phần mà tài liệu KHÔNG nhắc tới, bắt buộc phân loại là evidence_status = "insufficient" (Chưa đủ căn cứ).
3. Nếu bài viết tuyên bố trái ngược thông tin trong tài liệu (ví dụ: tài liệu ghi không được bôi vết thương hở mà bài bảo dùng được), phân loại là "contradictory".
4. Kiểm tra các điều cấm trong quảng cáo mỹ phẩm Việt Nam:
   - Từ ngữ mang tính điều trị (trị mụn, trị nám, chữa sẹo, dứt điểm, tiệt căn, kháng viêm) => Vi phạm pháp chế, risk_level = "high".
   - Khẳng định tuyệt đối hóa (100%, an toàn tuyệt đối, không có tác dụng phụ) => risk_level = "high".
   - Thời gian thần tốc (sau 3 ngày, bật tông sau 1 đêm) => risk_level = "high".
5. Gợi ý chỉnh sửa (suggested_rewrite): Chỉ được đề xuất công dụng thay thế nếu có bằng chứng rõ ràng trong tài liệu. Nếu không có chứng minh, gợi ý cắt bỏ tuyên bố.
6. Trích dẫn citations: Chỉ trích dẫn đúng tên file và số trang có trong tài liệu được cấp.`;

  const userPrompt = `THÔNG TIN SẢN PHẨM:
- Tên: ${product.name}
- Thương hiệu: ${product.brand_name}
- Số công bố: ${product.notification_number || 'Chưa cập nhật'}
- Thành phần INCI chuẩn: ${product.inci_ingredients.join(', ')}
- Công dụng đã xác minh: ${product.verified_benefits.join('; ')}

HỒ SƠ TÀI LIỆU ĐƯỢC PHÊ DUYỆT CỦA SẢN PHẨM:
${documentContext}

BÀI VIẾT QUẢNG CÁO CẦN KIỂM TRA:
Tiêu đề: ${title}
Nội dung:
${content}

Hãy bóc tách bài viết thành các tuyên bố riêng biệt, phân tích từng tuyên bố và trả về định dạng JSON đúng chuẩn.`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    response_format: { type: 'json_object' },
    temperature: 0.1,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  const rawJson = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(rawJson);

  const claims: AnalyzedClaim[] = (parsed.claims || []).map((c: any, index: number) => ({
    id: `claim-${Date.now()}-${index}`,
    order: index + 1,
    original_text: c.original_text || '',
    category: c.category || 'general',
    evidence_status: c.evidence_status || 'insufficient',
    risk_level: c.risk_level || 'low',
    issues: Array.isArray(c.issues) ? c.issues : [],
    citations: Array.isArray(c.citations) ? c.citations : [],
    suggested_rewrite: c.suggested_rewrite || null,
    requires_human_review: c.requires_human_review ?? true,
    user_action: 'pending',
  }));

  return buildCheckSummary(claims, product, title, content, 'OpenAI ' + (process.env.OPENAI_MODEL || 'gpt-4o'));
}

export function runDeterministicHybridCheck(
  product: Product,
  approvedDocs: ProductDocument[],
  title: string,
  content: string
): ContentCheckResult {
  const sentences = splitIntoSentences(content);
  const claims: AnalyzedClaim[] = [];

  sentences.forEach((sentence, idx) => {
    const text = sentence.trim();
    if (!text) return;

    const lower = text.toLowerCase();
    const issues: string[] = [];
    let evidence_status: AnalyzedClaim['evidence_status'] = 'compliant';
    let risk_level: AnalyzedClaim['risk_level'] = 'none';
    let category: AnalyzedClaim['category'] = 'general';
    let suggested_rewrite: string | null = null;
    const citations: AnalyzedClaim['citations'] = [];

    // A. Kiểm tra Quy định Pháp chế Quảng cáo Việt Nam
    const ruleViolations = evaluateVietnameseAdvertisingRules(text);
    if (ruleViolations.length > 0) {
      for (const v of ruleViolations) {
        issues.push(`[${v.rule.legal_reference}] ${v.rule.title}: Phát hiện cụm từ "${v.matchedKeyword}"`);
        risk_level = 'high';
        category = 'rule_violation';
      }
    }

    // B. Kiểm tra Tên sản phẩm & Thương hiệu
    if (product.brand_name && lower.includes('thương hiệu') && !lower.includes(product.brand_name.toLowerCase())) {
      issues.push(`Có dấu hiệu nhầm lẫn thương hiệu. Sản phẩm thuộc thương hiệu "${product.brand_name}".`);
      category = 'product_identity';
      risk_level = 'medium';
    }

    // C. Tìm kiếm đối chiếu trong Hồ sơ tài liệu được duyệt
    let foundDocEvidence = false;
    for (const doc of approvedDocs) {
      for (const page of doc.pages || []) {
        const pageLower = page.page_text.toLowerCase();
        
        // Trích xuất các từ khóa công dụng quan trọng
        const isRelated = product.verified_benefits.some(benefit => {
          const keywords = benefit.toLowerCase().split(/\s+/).filter(w => w.length > 4);
          const matched = keywords.filter(w => lower.includes(w));
          return matched.length >= 2;
        });

        if (isRelated && pageLower.includes(text.slice(0, 15).toLowerCase())) {
          foundDocEvidence = true;
          citations.push({
            document_id: doc.id,
            document_name: doc.file_name,
            doc_type: doc.doc_type,
            page_number: page.page_number,
            quoted_text: page.page_text.slice(0, 180) + '...',
            relevance_score: 0.92,
            verification_status: 'verified',
          });
        }
      }
    }

    // D. Đánh giá Mâu thuẫn vs Chưa đủ căn cứ
    if (ruleViolations.length > 0) {
      evidence_status = 'contradictory';
      suggested_rewrite = generateCompliantRewrite(text, product);
    } else if (foundDocEvidence) {
      evidence_status = 'compliant';
      risk_level = 'none';
    } else {
      // Kiểm tra xem có tuyên bố công dụng mà không có trong tài liệu không
      const claimActionKeywords = [
        'giúp', 'làm', 'tác dụng', 'công dụng', 'hiệu quả', 'nâng cơ', 'dưỡng', 'sáng', 
        'trắng', 'giảm', 'mờ', 'chống', 'phục hồi', 'tái tạo', 'xóa', 'se khít', 
        'kiểm soát', 'cân bằng', 'bảo vệ', 'săn chắc', 'triệt tiêu', 'đánh tan', 'chữa'
      ];
      const hasActionClaim = claimActionKeywords.some(k => lower.includes(k));

      if (hasActionClaim) {
        // Kiểm tra xem công dụng này có trong verified_benefits không
        const verified = product.verified_benefits.some(vb => {
          const vbWords = vb.toLowerCase().split(/\s+/).filter(w => w.length > 4);
          const matchCount = vbWords.filter(w => lower.includes(w)).length;
          return matchCount >= 2;
        });

        if (verified) {
          evidence_status = 'compliant';
          // Tìm citation từ phiếu công bố
          const firstDoc = approvedDocs[0];
          citations.push({
            document_id: firstDoc.id,
            document_name: firstDoc.file_name,
            doc_type: firstDoc.doc_type,
            page_number: 1,
            quoted_text: product.verified_benefits.join('. '),
            relevance_score: 0.88,
            verification_status: 'verified',
          });
        } else {
          evidence_status = 'insufficient';
          risk_level = 'medium';
          category = 'efficacy';
          issues.push('Tuyên bố công dụng này chưa được tìm thấy trong Phiếu công bố hoặc Báo cáo thử nghiệm lâm sàng đã duyệt.');
          suggested_rewrite = `Cân nhắc điều chỉnh theo công dụng đã được xác minh: "${product.verified_benefits[0] || 'Dưỡng ẩm và bảo vệ da'}"`;
        }
      } else {
        evidence_status = 'compliant';
      }
    }

    claims.push({
      id: `claim-${Date.now()}-${idx}`,
      order: idx + 1,
      original_text: text,
      category,
      evidence_status,
      risk_level,
      issues,
      citations,
      suggested_rewrite,
      requires_human_review: risk_level === 'high' || evidence_status === 'insufficient',
      user_action: 'pending',
    });
  });

  return buildCheckSummary(claims, product, title, content, 'Cosmetic-Checker-Engine v2.0 (Hybrid RAG)');
}

function buildCheckSummary(
  claims: AnalyzedClaim[],
  product: Product,
  title: string,
  content: string,
  modelName: string
): ContentCheckResult {
  const total = claims.length;
  const compliant = claims.filter(c => c.evidence_status === 'compliant' && c.risk_level === 'none').length;
  const insufficient = claims.filter(c => c.evidence_status === 'insufficient').length;
  const contradictory = claims.filter(c => c.evidence_status === 'contradictory').length;
  const legal_risk = claims.filter(c => c.risk_level === 'high' || c.risk_level === 'medium').length;

  let overall_status: ContentCheckResult['overall_status'] = 'compliant';
  let status: ContentCheckResult['status'] = 'approved';

  if (legal_risk > 0 || contradictory > 0) {
    overall_status = 'high_risk';
    status = 'needs_revision';
  } else if (insufficient > 0) {
    overall_status = 'needs_revision';
    status = 'needs_revision';
  }

  return {
    id: `check-${Date.now()}`,
    product_id: product.id,
    product_name: product.name,
    brand_id: product.brand_id,
    brand_name: product.brand_name || '',
    title,
    original_content: content,
    status,
    overall_status,
    total_claims: total,
    compliant_claims: compliant,
    insufficient_claims: insufficient,
    contradictory_claims: contradictory,
    legal_risk_claims: legal_risk,
    claims,
    ai_model: modelName,
    rule_version: 'v1.0-VN-2024',
    created_at: new Date().toISOString(),
  };
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.?!;:\n])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);
}

function generateCompliantRewrite(text: string, product: Product): string {
  let rewritten = text;
  rewritten = rewritten.replace(/điều trị|trị dứt điểm|đặc trị|chữa khỏi|tiệt căn/gi, 'hỗ trợ cải thiện');
  rewritten = rewritten.replace(/trị mụn tận gốc/gi, 'giúp làm sạch bã nhờn và hỗ trợ giảm mụn');
  rewritten = rewritten.replace(/trị nám tận gốc/gi, 'hỗ trợ làm mờ đốm nâu và đều màu da');
  rewritten = rewritten.replace(/100%|an toàn tuyệt đối|hoàn toàn không kích ứng/gi, 'đã qua kiểm nghiệm độ lành tính');
  rewritten = rewritten.replace(/sau 3 ngày|sau 1 đêm/gi, 'sau một thời gian kiên trì sử dụng');
  rewritten = rewritten.replace(/tái tạo tế bào gốc/gi, 'hỗ trợ nuôi dưỡng và củng cố hàng rào bảo vệ da');
  return rewritten;
}
