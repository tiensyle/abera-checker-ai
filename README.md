# COSMETIC CONTENT CHECKER AI (HỆ THỐNG THẨM ĐỊNH NỘI DUNG QUẢNG CÁO MỸ PHẨM)

Hệ thống quản lý hồ sơ sản phẩm mỹ phẩm và sử dụng AI kết hợp cơ chế RAG để kiểm tra, đối chiếu bài viết quảng cáo với tài liệu công bố chính thức, chứng minh công dụng và các quy định pháp lý quảng cáo mỹ phẩm tại Việt Nam (theo **Thông tư 06/2011/TT-BYT**, **Nghị định 181/2013/NĐ-CP** và **Luật Quảng cáo 2012**).

---

## 1. CÔNG NGHỆ CHỦ CHỐT

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & Cơ sở dữ liệu:** Next.js Route Handlers, Supabase PostgreSQL, Row Level Security (RLS), pgvector.
- **AI & RAG:** OpenAI API (Structured Outputs JSON Schema), Text Embeddings, Bộ phân tích ngữ nghĩa và pháp chế kết hợp chống hallucination.
- **Xử lý tài liệu:** Trích xuất văn bản từng trang PDF/DOCX/TXT/Images, gắn cờ OCR, lưu trữ private hash SHA-256.

---

## 2. DỮ LIỆU KHỞI TẠO (5 THƯƠNG HIỆU)

1. **AURA:** Mỹ phẩm cao cấp với công nghệ dưỡng sáng da và chống lão hóa sinh học.
2. **DERM:** Dược mỹ phẩm chăm sóc chuyên sâu dành cho da nhạy cảm và hàng rào bảo vệ da.
3. **LUMI:** Mỹ phẩm trang điểm và phục hồi căng bóng tự nhiên chiết xuất thiên nhiên.
4. **MEN'S:** Dòng sản phẩm chăm sóc da nam giới tối giản, kiểm soát dầu và mụn.
5. **PERLE:** Thương hiệu ngọc trai dưỡng trắng an toàn, cấp ẩm tầng sâu và chống oxy hóa.

---

## 3. CÁC TÍNH NĂNG ĐÃ TRIỂN KHAI HOÀN CHỈNH

1. **Tổng quan (Dashboard):** Thống kê KPI, pipeline duyệt bài, biểu đồ các nhóm lỗi pháp chế thường gặp.
2. **Quản lý thương hiệu:** CRUD 5 thương hiệu, tìm kiếm, lọc trạng thái, soft delete.
3. **Quản lý sản phẩm:** Hồ sơ số tiếp nhận Phiếu công bố, thành phần INCI, công dụng đã được xác minh, cảnh báo bắt buộc.
4. **Kho tài liệu (Dossier Repository):** Upload PDF/DOCX/TXT/Ảnh scan, phân trang, trích xuất text, quy trình phê duyệt tài liệu nguồn trước khi AI được phép đối chiếu.
5. **Kiểm tra bài viết AI (AI Checker Core):**
   - Chọn thương hiệu, sản phẩm, hiển thị cảnh báo nếu chưa có tài liệu duyệt.
   - Bóc tách từng tuyên bố độc lập.
   - Phân loại: **PHÙ HỢP**, **CHƯA ĐỦ CĂN CỨ**, **MÂU THUẪN TÀI LIỆU**, **RỦI RO PHÁP LÝ CAO**.
   - Trích dẫn cụ thể file và số trang tài liệu nguồn.
   - Đề xuất câu viết sửa lại hợp chuẩn (Suggested rewrite) với nút Chấp nhận/Từ chối từng câu hoặc "Áp dụng tất cả".
   - Tích hợp 3 bài viết mẫu để kiểm nghiệm ngay lập tức.
6. **Lịch sử kiểm tra:** Lưu trữ bản ghi bất biến của các lần kiểm tra, xem chi tiết và hỗ trợ in ấn / xuất PDF.
7. **Báo cáo thống kê:** Phân tích độ tuân thủ theo thời gian và thương hiệu.
8. **Quản lý nhân viên (RBAC):** Phân quyền 3 vai trò (Super Admin, Reviewer, Nhân viên) với ma trận quyền hạn nghiêm ngặt (Nhân viên không thể tự duyệt bài viết của chính mình hoặc tài liệu nguồn).
9. **Cài đặt hệ thống:** Cấu hình OpenAI API, pgvector và bật/tắt các điều luật trong bộ quy tắc Thông tư 06/2011/TT-BYT.

---

## 4. HƯỚNG DẪN CHẠY LOCAL

### Bước 1: Di chuyển vào thư mục dự án
```bash
cd "C:\Users\Admin\.gemini\antigravity\scratch\cosmetic-content-checker"
```

### Bước 2: Chạy kiểm thử tự động
```bash
npm test
```
*Kết quả: 6/6 tests passed 100% (Kiểm thử phân quyền RBAC, kiểm tra chống false positive khi thiếu hồ sơ, phát hiện từ cấm trị nám/mụn tận gốc, cam kết 100%).*

### Bước 3: Khởi động máy chủ phát triển
```bash
npm run dev
```
Mở trình duyệt truy cập: **`http://localhost:3000`**

### Bước 4: Kiểm tra bản build production
```bash
npm run build
npm start
```

---

## 5. CẤU HÌNH SUPABASE & OPENAI (.env)

Xem file mẫu tại `.env.example`:
- `NEXT_PUBLIC_SUPABASE_URL`: URL dự án Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anonymous Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key (chỉ đặt ở Server).
- `OPENAI_API_KEY`: API key của OpenAI (chỉ dùng phía Server để chống lộ secret).
- `OPENAI_MODEL`: `gpt-4o` hoặc `gpt-4o-mini`.

*Ghi chú: Khi chưa điền `OPENAI_API_KEY`, ứng dụng tự động kích hoạt **Bộ phân tích lai RAG nội bộ** với đầy đủ các quy tắc Thông tư 06/2011/TT-BYT và đối chiếu hồ sơ thực tế, đảm bảo trải nghiệm đầy đủ mà không bị gián đoạn.*

---

## 6. MIGRATION DATABASE
File migration đầy đủ có sẵn tại:
`supabase/migrations/20261028000000_init_cosmetic_schema.sql`
Bao gồm:
- Toàn bộ 17 bảng theo yêu cầu (profiles, brands, products, product_documents, document_pages, document_chunks với vector 1536 chiều, content_checks, compliance_rules, audit_logs,...).
- Toàn bộ cơ chế RLS (Row Level Security).
- Seed dữ liệu 5 thương hiệu ban đầu và bộ quy tắc quảng cáo mỹ phẩm Việt Nam.
