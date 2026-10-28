-- ==============================================================================
-- COSMETIC CONTENT CHECKER AI - CƠ SỞ DỮ LIỆU ĐẦY ĐỦ VÀ PHÂN QUYỀN RLS
-- Tuân thủ Thông tư 06/2011/TT-BYT, Nghị định 181/2013/NĐ-CP & Luật Quảng cáo VN
-- ==============================================================================

-- 1. KÍCH HOẠT EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'reviewer', 'employee');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM (
        'notification_slip',   -- Phiếu công bố sản phẩm mỹ phẩm
        'inci_sheet',          -- Bảng thành phần INCI chi tiết
        'benefit_support',     -- Tài liệu chứng minh công dụng lâm sàng/thử nghiệm
        'usage_guide',         -- Tài liệu hướng dẫn sử dụng & cảnh báo
        'clinical_study',      -- Nghiên cứu kiểm nghiệm da liễu
        'other'                -- Tài liệu bổ trợ khác
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_processing_status AS ENUM (
        'uploaded',
        'processing',
        'needs_review',
        'approved',
        'rejected',
        'failed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_approval_status AS ENUM (
        'pending',
        'approved',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_check_status AS ENUM (
        'draft',
        'checking',
        'needs_revision',
        'pending_approval',
        'approved',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE evidence_status AS ENUM (
        'compliant',     -- Phù hợp: Có tài liệu phê duyệt hỗ trợ
        'insufficient',  -- Chưa đủ căn cứ: Không tìm thấy bằng chứng phù hợp
        'contradictory'  -- Mâu thuẫn: Trái ngược với tài liệu trong hồ sơ
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level AS ENUM (
        'none',
        'low',
        'medium',
        'high'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'employee',
    department TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. BẢNG THƯƠNG HIỆU (BRANDS)
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMPTZ
);

-- 5. BẢNG SẢN PHẨM (PRODUCTS)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL,
    notification_number TEXT, -- Số tiếp nhận Phiếu công bố sản phẩm mỹ phẩm
    responsible_entity TEXT, -- Tổ chức/cá nhân chịu trách nhiệm đưa sản phẩm ra thị trường
    manufacturer TEXT,       -- Nhà sản xuất & xuất xứ
    inci_ingredients TEXT[] DEFAULT '{}', -- Danh sách thành phần INCI chính thức
    verified_benefits TEXT[] DEFAULT '{}', -- Công dụng được xác minh theo phiếu công bố
    usage_instructions TEXT, -- Hướng dẫn sử dụng chuẩn mực
    warnings TEXT,           -- Cảnh báo bắt buộc
    dossier_status TEXT NOT NULL DEFAULT 'draft', -- draft, reviewing, approved, rejected
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMPTZ
);

-- 6. BẢNG TÀI LIỆU SẢN PHẨM (PRODUCT_DOCUMENTS)
CREATE TABLE IF NOT EXISTS public.product_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    doc_type document_type NOT NULL,
    file_name TEXT NOT NULL,
    file_format TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    file_hash TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    processing_status document_processing_status NOT NULL DEFAULT 'uploaded',
    approval_status document_approval_status NOT NULL DEFAULT 'pending',
    extracted_text TEXT,
    uploaded_by UUID REFERENCES public.profiles(id),
    approved_by UUID REFERENCES public.profiles(id),
    approval_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deleted_at TIMESTAMPTZ
);

-- 7. BẢNG LỊCH SỬ PHIÊN BẢN TÀI LIỆU BẤT BIẾN (DOCUMENT_VERSIONS)
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.product_documents(id) ON DELETE CASCADE,
    version INT NOT NULL,
    storage_path TEXT NOT NULL,
    file_hash TEXT NOT NULL,
    extracted_text TEXT,
    is_immutable BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. BẢNG TRANG TÀI LIỆU (DOCUMENT_PAGES)
CREATE TABLE IF NOT EXISTS public.document_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.product_documents(id) ON DELETE CASCADE,
    document_version_id UUID REFERENCES public.document_versions(id) ON DELETE SET NULL,
    page_number INT NOT NULL,
    page_text TEXT NOT NULL,
    ocr_applied BOOLEAN NOT NULL DEFAULT false,
    ocr_confidence NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_doc_page UNIQUE (document_id, page_number)
);

-- 9. BẢNG ĐOẠN TÀI LIỆU & VECTOR EMBEDDINGS (DOCUMENT_CHUNKS)
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.product_documents(id) ON DELETE CASCADE,
    page_id UUID REFERENCES public.document_pages(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    token_count INT,
    embedding vector(1536), -- Kích thước embedding OpenAI text-embedding-3-small
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. BẢNG CÔNG DỤNG XÁC MINH CỦA SẢN PHẨM (PRODUCT_CLAIMS)
CREATE TABLE IF NOT EXISTS public.product_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    claim_text TEXT NOT NULL,
    claim_category TEXT NOT NULL, -- 'efficacy', 'ingredient', 'usage', 'safety'
    is_verified BOOLEAN NOT NULL DEFAULT true,
    supporting_document_id UUID REFERENCES public.product_documents(id) ON DELETE SET NULL,
    supporting_page_number INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. BẢNG BỘ QUY TẮC QUẢNG CÁO MỸ PHẨM VIỆT NAM (COMPLIANCE_RULES)
CREATE TABLE IF NOT EXISTS public.compliance_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_code TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- therapeutic, absolute, definition, ingredient, warning
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    legal_reference TEXT NOT NULL, -- Thông tư 06/2011/TT-BYT Phụ lục 03-MP, v.v.
    severity risk_level NOT NULL DEFAULT 'high',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. PHIÊN BẢN BỘ QUY TẮC (COMPLIANCE_RULE_VERSIONS)
CREATE TABLE IF NOT EXISTS public.compliance_rule_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_number TEXT NOT NULL UNIQUE,
    effective_date DATE NOT NULL,
    rules_snapshot JSONB NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. BẢNG LỊCH SỬ KIỂM TRA BÀI VIẾT (CONTENT_CHECKS)
CREATE TABLE IF NOT EXISTS public.content_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    original_content TEXT NOT NULL,
    revised_content TEXT,
    status content_check_status NOT NULL DEFAULT 'draft',
    total_claims INT NOT NULL DEFAULT 0,
    compliant_claims INT NOT NULL DEFAULT 0,
    insufficient_claims INT NOT NULL DEFAULT 0,
    contradictory_claims INT NOT NULL DEFAULT 0,
    legal_risk_claims INT NOT NULL DEFAULT 0,
    ai_model TEXT NOT NULL DEFAULT 'gpt-4o',
    rule_version TEXT NOT NULL DEFAULT 'v1.0-VN-2024',
    documents_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
    reviewer_id UUID REFERENCES public.profiles(id),
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. BẢNG CHI TIẾT TỪNG TUYÊN BỐ TRONG BÀI (CONTENT_CHECK_CLAIMS)
CREATE TABLE IF NOT EXISTS public.content_check_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_id UUID NOT NULL REFERENCES public.content_checks(id) ON DELETE CASCADE,
    claim_order INT NOT NULL,
    original_text TEXT NOT NULL,
    category TEXT NOT NULL, -- product_identity, ingredient, efficacy, usage, rule_violation
    evidence_status evidence_status NOT NULL,
    risk_level risk_level NOT NULL DEFAULT 'none',
    issues JSONB NOT NULL DEFAULT '[]'::jsonb,
    suggested_rewrite TEXT,
    requires_human_review BOOLEAN NOT NULL DEFAULT false,
    user_action TEXT DEFAULT 'pending', -- accepted, rejected, modified, pending
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. BẢNG DẪN CHỨNG CỦA TUYÊN BỐ (CLAIM_EVIDENCE)
CREATE TABLE IF NOT EXISTS public.claim_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_claim_id UUID NOT NULL REFERENCES public.content_check_claims(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES public.product_documents(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    chunk_id UUID REFERENCES public.document_chunks(id) ON DELETE SET NULL,
    quoted_text TEXT NOT NULL,
    relevance_score NUMERIC(5,4),
    verification_status TEXT NOT NULL DEFAULT 'verified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. BẢNG LỊCH SỬ CHỈNH SỬA BÀI VIẾT (CONTENT_REVISIONS)
CREATE TABLE IF NOT EXISTS public.content_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_id UUID NOT NULL REFERENCES public.content_checks(id) ON DELETE CASCADE,
    revision_number INT NOT NULL,
    content_text TEXT NOT NULL,
    changes_summary TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. BẢNG YÊU CẦU PHÊ DUYỆT (APPROVAL_REQUESTS)
CREATE TABLE IF NOT EXISTS public.approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_id UUID NOT NULL REFERENCES public.content_checks(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES public.profiles(id),
    target_status content_check_status NOT NULL DEFAULT 'pending_approval',
    submission_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. BẢNG HÀNH ĐỘNG DUYỆT (APPROVAL_ACTIONS)
CREATE TABLE IF NOT EXISTS public.approval_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.approval_requests(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'approve', 'reject', 'request_changes'
    actor_id UUID NOT NULL REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 19. BẢNG NHẬT KÝ KIỂM TOÁN HỆ THỐNG (AUDIT_LOGS)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id UUID,
    payload JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 20. CHỈ MỤC TỐI ƯU TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_documents_product_id ON public.product_documents(product_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_doc_pages_doc_id ON public.document_pages(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_doc_id ON public.document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_content_checks_product ON public.content_checks(product_id);
CREATE INDEX IF NOT EXISTS idx_content_checks_user ON public.content_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_content_check_claims_check ON public.content_check_claims(check_id);

-- Vector search index với HNSW (Cosine distance)
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding
ON public.document_chunks
USING hnsw (embedding vector_cosine_ops);

-- 21. HÀM TÌM KIẾM NGỮ NGHĨA VECTOR KẾT HỢP SẢN PHẨM
CREATE OR REPLACE FUNCTION search_product_document_chunks (
    query_embedding vector(1536),
    filter_product_id UUID,
    match_count INT DEFAULT 5,
    similarity_threshold FLOAT DEFAULT 0.60
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    page_id UUID,
    chunk_index INT,
    chunk_text TEXT,
    page_number INT,
    file_name TEXT,
    doc_type document_type,
    similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.document_id,
        c.page_id,
        c.chunk_index,
        c.chunk_text,
        p.page_number,
        d.file_name,
        d.doc_type,
        1 - (c.embedding <=> query_embedding) AS similarity
    FROM public.document_chunks c
    JOIN public.product_documents d ON c.document_id = d.id
    JOIN public.document_pages p ON c.page_id = p.id
    WHERE d.product_id = filter_product_id
      AND d.approval_status = 'approved'
      AND d.deleted_at IS NULL
      AND 1 - (c.embedding <=> query_embedding) > similarity_threshold
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 22. DỮ LIỆU BAN ĐẦU: 5 THƯƠNG HIỆU THEO YÊU CẦU
INSERT INTO public.brands (code, name, description, is_active)
VALUES
    ('AURA', 'AURA', 'Thương hiệu mỹ phẩm cao cấp với công nghệ dưỡng sáng da và chống lão hóa sinh học.', true),
    ('DERM', 'DERM', 'Dược mỹ phẩm chăm sóc chuyên sâu dành cho da nhạy cảm và hàng rào bảo vệ da.', true),
    ('LUMI', 'LUMI', 'Mỹ phẩm trang điểm và phục hồi căng bóng tự nhiên chiết xuất thiên nhiên lành tính.', true),
    ('MENS', 'MEN''S', 'Dòng sản phẩm chăm sóc da nam giới tối giản, hiệu quả cao, kiểm soát dầu và mụn.', true),
    ('PERLE', 'PERLE', 'Thương hiệu ngọc trai dưỡng trắng an toàn, cấp ẩm tầng sâu và chống oxy hóa.', true)
ON CONFLICT (code) DO NOTHING;

-- 23. BỘ QUY TẮC QUẢNG CÁO MỸ PHẨM VIỆT NAM (THEO THÔNG TƯ 06/2011/TT-BYT)
INSERT INTO public.compliance_rules (rule_code, category, title, description, keywords, legal_reference, severity, is_active)
VALUES
    ('R_THERAPEUTIC_CURE', 'therapeutic_prohibition', 'Cấm quảng cáo trị dứt điểm / chữa khỏi bệnh',
     'Mỹ phẩm không phải là thuốc, tuyệt đối không sử dụng các từ điều trị, trị dứt điểm, chữa khỏi, tiệt căn nám/mụn/sẹo.',
     ARRAY['trị dứt điểm', 'chữa khỏi', 'điều trị nám', 'điều trị mụn', 'trị tận gốc', 'tiệt căn', 'đặc trị', 'thuốc', 'chữa lành vết thương'],
     'Thông tư 06/2011/TT-BYT Phụ lục 03-MP', 'high', true),

    ('R_ABSOLUTE_CLAIMS', 'absolute_claims', 'Cấm khẳng định tuyệt đối hoặc cam kết 100%',
     'Nghiêm cấm các khẳng định mang tính tuyệt đối hóa công dụng, hiệu quả không có kiểm chứng như 100%, vĩnh viễn, an toàn tuyệt đối.',
     ARRAY['100%', 'hiệu quả 100%', 'hoàn toàn không kích ứng', 'an toàn tuyệt đối', 'không có tác dụng phụ', 'vĩnh viễn', 'xóa sẹo hoàn toàn'],
     'Luật Quảng cáo 2012 Điều 8 Khoản 9', 'high', true),

    ('R_INSTANT_TIMEFRAME', 'absolute_claims', 'Cấm khẳng định kết quả thần tốc phi thực tế',
     'Không được đưa ra các mốc thời gian thần tốc như trắng da sau 3 ngày, trẻ hóa 10 tuổi ngay lập tức nếu không có chứng minh lâm sàng.',
     ARRAY['sau 3 ngày', 'trắng sau 3 ngày', 'trẻ hóa 10 tuổi', 'ngay tức thì vĩnh viễn', 'bật 5 tông sau 1 đêm'],
     'Nghị định 181/2013/NĐ-CP Điều 4', 'high', true),

    ('R_CELL_REGENERATION', 'cosmetic_definition', 'Cấm tuyên bố can thiệp cấu trúc sâu/tế bào',
     'Mỹ phẩm chỉ tác động lên các bộ phận bên ngoài cơ thể. Không được quảng cáo làm thay đổi cấu trúc tế bào, tái tạo mô sâu.',
     ARRAY['tái tạo tế bào gốc', 'thay đổi cấu trúc da vĩnh viễn', 'tái sinh mô', 'làm đầy sẹo rỗ vĩnh viễn'],
     'Thông tư 06/2011/TT-BYT Điều 2 Khoản 1', 'high', true),

    ('R_MANDATORY_WARNINGS', 'mandatory_warnings', 'Cảnh báo bắt buộc khi có hoạt chất đặc thù',
     'Các sản phẩm chứa AHA, BHA, Retinol hoặc hương liệu phải có cảnh báo che chắn ánh nắng hoặc nguy cơ kích ứng cho da nhạy cảm.',
     ARRAY['retinol', 'aha', 'bha', 'glycolic acid', 'salicylic acid'],
     'Thông tư 06/2011/TT-BYT Điều 18', 'medium', true)
ON CONFLICT (rule_code) DO NOTHING;

-- 24. CƠ CHẾ ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_check_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Hàm trợ giúp lấy vai trò của người dùng hiện tại
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- POLICIES CHO PROFILES
CREATE POLICY "Người dùng có thể xem hồ sơ của mình"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.current_user_role() = 'super_admin');

CREATE POLICY "Chỉ super admin hoặc chính người dùng cập nhật hồ sơ"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.current_user_role() = 'super_admin');

-- POLICIES CHO BRANDS
CREATE POLICY "Mọi người dùng đã đăng nhập đều xem được thương hiệu"
    ON public.brands FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "Chỉ Admin và Super Admin quản lý thương hiệu"
    ON public.brands FOR ALL
    TO authenticated
    USING (public.current_user_role() IN ('super_admin', 'reviewer'));

-- POLICIES CHO PRODUCTS
CREATE POLICY "Mọi người dùng đã đăng nhập đều xem được sản phẩm"
    ON public.products FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "Chỉ Admin và Super Admin thêm sửa xóa sản phẩm"
    ON public.products FOR ALL
    TO authenticated
    USING (public.current_user_role() IN ('super_admin', 'reviewer'));

-- POLICIES CHO PRODUCT_DOCUMENTS
-- Nhân viên chỉ xem được tài liệu ĐÃ ĐƯỢC PHÊ DUYỆT
CREATE POLICY "Phân quyền xem tài liệu sản phẩm"
    ON public.product_documents FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NULL AND (
            public.current_user_role() IN ('super_admin', 'reviewer')
            OR approval_status = 'approved'
        )
    );

-- Nhân viên KHÔNG được duyệt tài liệu nguồn; chỉ Reviewer/Super Admin
CREATE POLICY "Chỉ Reviewer và Super Admin quản lý tài liệu"
    ON public.product_documents FOR ALL
    TO authenticated
    USING (public.current_user_role() IN ('super_admin', 'reviewer'));

-- POLICIES CHO CONTENT_CHECKS
-- Nhân viên xem bài viết của mình; Admin/Reviewer xem tất cả
CREATE POLICY "Xem bài viết kiểm tra"
    ON public.content_checks FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR public.current_user_role() IN ('super_admin', 'reviewer')
    );

CREATE POLICY "Tạo bài viết kiểm tra mới"
    ON public.content_checks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Cập nhật bài viết kiểm tra"
    ON public.content_checks FOR UPDATE
    TO authenticated
    USING (
        user_id = auth.uid() OR public.current_user_role() IN ('super_admin', 'reviewer')
    );

-- POLICIES CHO COMPLIANCE_RULES
CREATE POLICY "Mọi người dùng xem bộ quy tắc"
    ON public.compliance_rules FOR SELECT
    TO authenticated
    USING (is_active = true OR public.current_user_role() = 'super_admin');

CREATE POLICY "Chỉ Super Admin chỉnh sửa bộ quy tắc"
    ON public.compliance_rules FOR ALL
    TO authenticated
    USING (public.current_user_role() = 'super_admin');
