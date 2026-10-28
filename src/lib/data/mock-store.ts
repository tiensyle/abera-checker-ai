import { Brand, Product, ProductDocument, ContentCheckResult, UserProfile } from '@/types';

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'b1-aura',
    code: 'AURA',
    name: 'AURA',
    logo_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=60',
    description: 'Thương hiệu mỹ phẩm cao cấp với công nghệ dưỡng sáng da và chống lão hóa sinh học.',
    product_count: 2,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'b2-derm',
    code: 'DERM',
    name: 'DERM',
    logo_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&auto=format&fit=crop&q=60',
    description: 'Dược mỹ phẩm chăm sóc chuyên sâu dành cho da nhạy cảm và hàng rào bảo vệ da.',
    product_count: 2,
    is_active: true,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'b3-lumi',
    code: 'LUMI',
    name: 'LUMI',
    logo_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=120&auto=format&fit=crop&q=60',
    description: 'Mỹ phẩm trang điểm và phục hồi căng bóng tự nhiên chiết xuất thiên nhiên lành tính.',
    product_count: 1,
    is_active: true,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'b4-mens',
    code: 'MENS',
    name: "MEN'S",
    logo_url: 'https://images.unsplash.com/photo-1512290900672-1f55b9a89d46?w=120&auto=format&fit=crop&q=60',
    description: 'Dòng sản phẩm chăm sóc da nam giới tối giản, hiệu quả cao, kiểm soát dầu và mụn.',
    product_count: 1,
    is_active: true,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'b5-perle',
    code: 'PERLE',
    name: 'PERLE',
    logo_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=120&auto=format&fit=crop&q=60',
    description: 'Thương hiệu ngọc trai dưỡng trắng an toàn, cấp ẩm tầng sâu và chống oxy hóa.',
    product_count: 1,
    is_active: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1-aura-serum',
    brand_id: 'b1-aura',
    brand_name: 'AURA',
    code: 'AUR-SRM-01',
    name: 'Tinh chất dưỡng sáng da AURA Niacinamide 10% Glow Serum',
    category: 'Tinh chất / Serum dưỡng sáng',
    notification_number: '184920/22/CBMP-QLD',
    responsible_entity: 'Công ty TNHH Dược Mỹ Phẩm AURA Việt Nam',
    manufacturer: 'Cosmax Bio Co., Ltd - Hàn Quốc',
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=60',
    inci_ingredients: [
      'Water',
      'Niacinamide (10%)',
      'Glycerin',
      'Butylene Glycol',
      'Zinc PCA (1%)',
      'Sodium Hyaluronate',
      'Allantoin',
      'Xanthan Gum',
      'Phenoxyethanol',
      'Ethylhexylglycerin'
    ],
    verified_benefits: [
      'Giúp làm sáng đều màu da và hỗ trợ làm mờ các đốm nâu nhẹ trên bề mặt biểu bì',
      'Hỗ trợ kiểm soát bã nhờn dư thừa và cân bằng độ ẩm cho làn da',
      'Cung cấp độ ẩm giúp da mềm mịn và cải thiện độ đàn hồi'
    ],
    usage_instructions: 'Sau bước làm sạch và toner, lấy 3-4 giọt thoa đều lên mặt và cổ, vỗ nhẹ để thẩm thấu. Sử dụng 2 lần mỗi ngày (sáng và tối).',
    warnings: 'Chỉ sử dụng ngoài da. Ngưng sử dụng nếu có dấu hiệu mẩn đỏ hoặc kích ứng kéo dài. Luôn thoa kem chống nắng vào ban ngày.',
    dossier_status: 'approved',
    version: 1,
    documents_count: 2,
    approved_documents_count: 2,
    created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'p2-derm-cream',
    brand_id: 'b2-derm',
    brand_name: 'DERM',
    code: 'DRM-CRM-02',
    name: 'Kem dưỡng ẩm phục hồi hàng rào da DERM Ceramide Barrier Repair Cream',
    category: 'Kem dưỡng ẩm phục hồi',
    notification_number: '201948/23/CBMP-QLD',
    responsible_entity: 'Công ty Cổ phần Dược Liệu DERM Lab',
    manufacturer: 'Kolmar Laboratories France',
    image_url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=60',
    inci_ingredients: [
      'Aqua',
      'Caprylic/Capric Triglyceride',
      'Glycerin',
      'Ceramide NP',
      'Ceramide AP',
      'Ceramide EOP',
      'Phytosphingosine',
      'Cholesterol',
      'Panthenol (Pro-Vitamin B5 5%)',
      'Centella Asiatica Extract'
    ],
    verified_benefits: [
      'Hỗ trợ củng cố hàng rào lipid bảo vệ da tự nhiên',
      'Làm dịu làn da khô ráp, nứt nẻ và giảm cảm giác châm chích khó chịu do thiếu ẩm',
      'Cung cấp độ ẩm sâu duy trì sự mềm mại lên đến 24 giờ'
    ],
    usage_instructions: 'Thoa một lượng kem vừa đủ lên vùng da mặt và cổ sau khi làm sạch. Thoa ngày 2 lần hoặc bất cứ khi nào da có cảm giác khô căng.',
    warnings: 'Tránh tiếp xúc trực tiếp với niêm mạc mắt. Để xa tầm tay trẻ em.',
    dossier_status: 'approved',
    version: 1,
    documents_count: 1,
    approved_documents_count: 1,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'p3-lumi-cushion',
    brand_id: 'b3-lumi',
    brand_name: 'LUMI',
    code: 'LUM-CSH-03',
    name: 'Phấn nước che khuyết điểm chống nắng LUMI Glow Cushion SPF50+ PA++++',
    category: 'Phấn nước trang điểm chống nắng',
    notification_number: '210543/23/CBMP-QLD',
    responsible_entity: 'Công ty Cổ phần Mỹ Phẩm LUMI',
    manufacturer: 'Cosmecca Korea Co., Ltd',
    image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&auto=format&fit=crop&q=60',
    inci_ingredients: [
      'Water',
      'Titanium Dioxide',
      'Zinc Oxide',
      'Cyclopentasiloxane',
      'Ethylhexyl Methoxycinnamate',
      'Niacinamide',
      'Adenosine'
    ],
    verified_benefits: [
      'Tạo lớp nền mỏng nhẹ che phủ khuyết điểm nhẹ đến trung bình',
      'Hỗ trợ bảo vệ da trước tác hại của tia UVA và UVB với chỉ số SPF50+ PA++++',
      'Giúp da sáng mịn và đều màu tự nhiên'
    ],
    usage_instructions: 'Dùng bông mút dặm nhẹ phấn nước lên toàn bộ gương mặt trước khi ra ngoài 20 phút.',
    warnings: 'Tẩy trang kỹ vào cuối ngày để tránh bít tắc lỗ chân lông.',
    dossier_status: 'approved',
    version: 1,
    documents_count: 1,
    approved_documents_count: 1,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'p4-mens-cleanser',
    brand_id: 'b4-mens',
    brand_name: "MEN'S",
    code: 'MEN-CLN-04',
    name: "Sữa rửa mặt kiểm soát dầu MEN'S Oil Clear Deep Cleanser",
    category: 'Sữa rửa mặt',
    notification_number: '223011/24/CBMP-QLD',
    responsible_entity: "Công ty TNHH MEN'S Care Việt Nam",
    manufacturer: 'Intercos Korea Inc.',
    image_url: 'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=400&auto=format&fit=crop&q=60',
    inci_ingredients: [
      'Water',
      'Myristic Acid',
      'Glycerin',
      'Potassium Hydroxide',
      'Salicylic Acid (0.5%)',
      'Charcoal Powder',
      'Menthol'
    ],
    verified_benefits: [
      'Làm sạch sâu bụi bẩn và bã nhờn tích tụ trong lỗ chân lông',
      'Mang lại cảm giác sảng khoái mát lạnh và giảm bóng dầu bề mặt'
    ],
    usage_instructions: 'Làm ướt mặt, lấy lượng bọt vừa đủ mát-xa nhẹ nhàng và rửa sạch với nước mát.',
    warnings: 'Tránh vùng mắt. Có chứa menthol gây cảm giác the mát.',
    dossier_status: 'approved',
    version: 1,
    documents_count: 1,
    approved_documents_count: 1,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'p5-perle-cream',
    brand_id: 'b5-perle',
    brand_name: 'PERLE',
    code: 'PRL-CRM-05',
    name: 'Kem dưỡng sáng da ngọc trai PERLE Pearl Brightening Infusion Cream',
    category: 'Kem dưỡng sáng da',
    notification_number: '234109/24/CBMP-QLD',
    responsible_entity: 'Công ty Cổ phần Thẩm Mỹ PERLE Luxury',
    manufacturer: 'Nihon Kolmar Co., Ltd - Nhật Bản',
    image_url: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=400&auto=format&fit=crop&q=60',
    inci_ingredients: [
      'Aqua',
      'Pearl Extract (Chiết xuất ngọc trai)',
      'Squalane',
      'Tranexamic Acid (2%)',
      'Alpha-Arbutin (1%)',
      'Tocopherol (Vitamin E)'
    ],
    verified_benefits: [
      'Dưỡng ẩm chuyên sâu giúp da căng bóng và mịn màng',
      'Hỗ trợ làm sáng da và làm mờ các đốm da xỉn màu do tác động của ánh nắng'
    ],
    usage_instructions: 'Sử dụng vào buổi tối sau bước tinh chất. Thoa đều và mát-xa nhẹ nhàng.',
    warnings: 'Không sử dụng trên vết thương hở hoặc vùng da bị viêm da cơ địa nặng.',
    dossier_status: 'draft',
    version: 1,
    documents_count: 0,
    approved_documents_count: 0,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  }
];

export const INITIAL_DOCUMENTS: ProductDocument[] = [
  {
    id: 'doc-aura-01',
    product_id: 'p1-aura-serum',
    product_name: 'Tinh chất dưỡng sáng da AURA Niacinamide 10% Glow Serum',
    brand_name: 'AURA',
    doc_type: 'notification_slip',
    file_name: 'Phieu_Cong_Bo_AURA_Niacinamide_184920.pdf',
    file_format: 'application/pdf',
    file_size: 2450000,
    storage_path: 'documents/p1-aura-serum/Phieu_Cong_Bo_AURA_Niacinamide_184920.pdf',
    file_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    version: 1,
    processing_status: 'approved',
    approval_status: 'approved',
    uploaded_by: 'user-admin',
    approved_by: 'user-admin',
    approval_notes: 'Phiếu công bố hợp lệ được Cục Quản Lý Dược cấp ngày 15/06/2022.',
    pages: [
      {
        id: 'page-aura-01-1',
        document_id: 'doc-aura-01',
        page_number: 1,
        page_text: 'BỘ Y TẾ - CỤC QUẢN LÝ DƯỢC. PHIẾU CÔNG BỐ SẢN PHẨM MỸ PHẨM. Số tiếp nhận: 184920/22/CBMP-QLD. Tên sản phẩm: Tinh chất dưỡng sáng da AURA Niacinamide 10% Glow Serum. Dạng sản phẩm: Serum dạng lỏng. Mục đích sử dụng: Giúp làm sáng đều màu da và hỗ trợ làm mờ các đốm nâu nhẹ trên bề mặt biểu bì, hỗ trợ kiểm soát bã nhờn dư thừa và cân bằng độ ẩm cho làn da. Tổ chức chịu trách nhiệm: Công ty TNHH Dược Mỹ Phẩm AURA Việt Nam.',
        ocr_applied: false,
      },
      {
        id: 'page-aura-01-2',
        document_id: 'doc-aura-01',
        page_number: 2,
        page_text: 'THÀNH PHẦN ĐẦY ĐỦ (INCI): Water (Aqua), Niacinamide (10.0%), Glycerin, Butylene Glycol, Zinc PCA (1.0%), Sodium Hyaluronate, Allantoin, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin. HƯỚNG DẪN SỬ DỤNG: Dùng 3-4 giọt thoa đều lên mặt sau bước làm sạch. Thoa 2 lần mỗi ngày sáng và tối. CẢNH BÁO: Chỉ sử dụng ngoài da. Ngưng sử dụng nếu có dấu hiệu mẩn đỏ hoặc kích ứng kéo dài. Không dùng cho mục đích điều trị bệnh lý da liễu.',
        ocr_applied: false,
      }
    ],
    created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 28 * 86400000).toISOString(),
  },
  {
    id: 'doc-aura-02',
    product_id: 'p1-aura-serum',
    product_name: 'Tinh chất dưỡng sáng da AURA Niacinamide 10% Glow Serum',
    brand_name: 'AURA',
    doc_type: 'benefit_support',
    file_name: 'Bao_Cao_Thu_Nghiem_Lam_Sang_AURA_2022.pdf',
    file_format: 'application/pdf',
    file_size: 4210000,
    storage_path: 'documents/p1-aura-serum/Bao_Cao_Thu_Nghiem_Lam_Sang_AURA_2022.pdf',
    file_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    version: 1,
    processing_status: 'approved',
    approval_status: 'approved',
    uploaded_by: 'user-admin',
    approved_by: 'user-admin',
    approval_notes: 'Báo cáo thử nghiệm lâm sàng độc lập xác nhận hiệu quả cải thiện sắc tố sau 4-8 tuần sử dụng liên tục.',
    pages: [
      {
        id: 'page-aura-02-1',
        document_id: 'doc-aura-02',
        page_number: 1,
        page_text: 'DERMATOLOGY CLINICAL STUDY REPORT. Sản phẩm kiểm nghiệm: AURA Niacinamide 10% Glow Serum. Quy mô: 45 người tình nguyện viên da dầu mụn nhẹ và không đều màu. Thời gian đánh giá: 8 tuần (56 ngày). Kết quả đánh giá chỉ số melanin: Sau 4 tuần, 84% người tham gia ghi nhận da trông sáng và rạng rỡ hơn. Sau 8 tuần, chỉ số dầu thừa giảm trung bình 28%. Lưu ý: Sản phẩm không có tác dụng điều trị nám sâu nội tiết (melasma thể chân sâu) hoặc triệt tiêu tế bào hắc tố vĩnh viễn.',
        ocr_applied: false,
      }
    ],
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'doc-derm-01',
    product_id: 'p2-derm-cream',
    product_name: 'Kem dưỡng ẩm phục hồi hàng rào da DERM Ceramide Barrier Repair Cream',
    brand_name: 'DERM',
    doc_type: 'notification_slip',
    file_name: 'Phieu_Cong_Bo_DERM_Ceramide_201948.pdf',
    file_format: 'application/pdf',
    file_size: 1890000,
    storage_path: 'documents/p2-derm-cream/Phieu_Cong_Bo_DERM_Ceramide_201948.pdf',
    file_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    version: 1,
    processing_status: 'approved',
    approval_status: 'approved',
    uploaded_by: 'user-reviewer',
    approved_by: 'user-admin',
    approval_notes: 'Phiếu công bố hợp lệ cho dòng sản phẩm phục hồi da.',
    pages: [
      {
        id: 'page-derm-01-1',
        document_id: 'doc-derm-01',
        page_number: 1,
        page_text: 'PHIẾU CÔNG BỐ SẢN PHẨM MỸ PHẨM. Số tiếp nhận: 201948/23/CBMP-QLD. Tên sản phẩm: Kem dưỡng ẩm phục hồi hàng rào da DERM Ceramide Barrier Repair Cream. Thành phần hoạt tính chính: Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Panthenol 5%. Công dụng công bố: Giúp làm dịu da khô ráp, hỗ trợ củng cố hàng rào lipid ẩm của biểu bì da, duy trì độ ẩm kéo dài.',
        ocr_applied: false,
      }
    ],
    created_at: new Date(Date.now() - 19 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 19 * 86400000).toISOString(),
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-super-admin',
    email: 'admin@cosmeticchecker.vn',
    full_name: 'Nguyễn Thành Nam (Super Admin)',
    role: 'super_admin',
    department: 'Ban Giám Đốc & Pháp Chế',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-reviewer',
    email: 'reviewer@cosmeticchecker.vn',
    full_name: 'Trần Thị Mai (Reviewer / Trưởng phòng R&D)',
    role: 'reviewer',
    department: 'Phòng Pháp Chế & Đảm Bảo Chất Lượng',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-employee',
    email: 'content@cosmeticchecker.vn',
    full_name: 'Lê Hoàng Anh (Content Specialist)',
    role: 'employee',
    department: 'Phòng Marketing & Truyền Thông',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// In-Memory store instance for immediate development & mock fallback
class AppStore {
  private brands: Brand[] = [...INITIAL_BRANDS];
  private products: Product[] = [...INITIAL_PRODUCTS];
  private documents: ProductDocument[] = [...INITIAL_DOCUMENTS];
  private users: UserProfile[] = [...INITIAL_USERS];
  private checks: ContentCheckResult[] = [];
  private currentUser: UserProfile = INITIAL_USERS[0]; // Default Super Admin for local testing

  getBrands(): Brand[] {
    return this.brands.map(b => ({
      ...b,
      product_count: this.products.filter(p => p.brand_id === b.id).length
    }));
  }

  getBrandById(id: string): Brand | undefined {
    const brand = this.brands.find(b => b.id === id);
    if (!brand) return undefined;
    return {
      ...brand,
      product_count: this.products.filter(p => p.brand_id === brand.id).length
    };
  }

  saveBrand(brand: Partial<Brand>): Brand {
    const existingIndex = this.brands.findIndex(b => b.id === brand.id);
    if (existingIndex >= 0) {
      this.brands[existingIndex] = {
        ...this.brands[existingIndex],
        ...brand,
        updated_at: new Date().toISOString(),
      };
      return this.brands[existingIndex];
    } else {
      const newBrand: Brand = {
        id: brand.id || `b-${Date.now()}`,
        code: brand.code || `BRD-${Date.now().toString().slice(-4)}`,
        name: brand.name || 'Thương hiệu mới',
        logo_url: brand.logo_url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=60',
        description: brand.description || '',
        is_active: brand.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.brands.push(newBrand);
      return newBrand;
    }
  }

  deleteBrand(id: string): boolean {
    const brand = this.brands.find(b => b.id === id);
    if (brand) {
      brand.is_active = false;
      return true;
    }
    return false;
  }

  getProducts(): Product[] {
    return this.products.map(p => {
      const docs = this.documents.filter(d => d.product_id === p.id);
      return {
        ...p,
        documents_count: docs.length,
        approved_documents_count: docs.filter(d => d.approval_status === 'approved').length,
      };
    });
  }

  getProductById(id: string): Product | undefined {
    const p = this.products.find(item => item.id === id);
    if (!p) return undefined;
    const docs = this.documents.filter(d => d.product_id === p.id);
    return {
      ...p,
      documents_count: docs.length,
      approved_documents_count: docs.filter(d => d.approval_status === 'approved').length,
    };
  }

  saveProduct(product: Partial<Product>): Product {
    const brand = this.brands.find(b => b.id === product.brand_id);
    const existingIndex = this.products.findIndex(p => p.id === product.id);

    if (existingIndex >= 0) {
      this.products[existingIndex] = {
        ...this.products[existingIndex],
        ...product,
        brand_name: brand?.name || this.products[existingIndex].brand_name,
        updated_at: new Date().toISOString(),
      };
      return this.products[existingIndex];
    } else {
      const newProduct: Product = {
        id: product.id || `p-${Date.now()}`,
        brand_id: product.brand_id || this.brands[0].id,
        brand_name: brand?.name || this.brands[0].name,
        code: product.code || `PRD-${Date.now().toString().slice(-4)}`,
        name: product.name || 'Sản phẩm mới',
        category: product.category || 'Mỹ phẩm chăm sóc da',
        notification_number: product.notification_number || '',
        responsible_entity: product.responsible_entity || '',
        manufacturer: product.manufacturer || '',
        inci_ingredients: product.inci_ingredients || [],
        verified_benefits: product.verified_benefits || [],
        usage_instructions: product.usage_instructions || '',
        warnings: product.warnings || '',
        dossier_status: product.dossier_status || 'draft',
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.products.push(newProduct);
      return newProduct;
    }
  }

  getDocuments(productId?: string): ProductDocument[] {
    if (productId) {
      return this.documents.filter(d => d.product_id === productId);
    }
    return this.documents;
  }

  getDocumentById(id: string): ProductDocument | undefined {
    return this.documents.find(d => d.id === id);
  }

  saveDocument(doc: Partial<ProductDocument>): ProductDocument {
    const product = this.products.find(p => p.id === doc.product_id);
    const existingIndex = this.documents.findIndex(d => d.id === doc.id);

    if (existingIndex >= 0) {
      this.documents[existingIndex] = {
        ...this.documents[existingIndex],
        ...doc,
        updated_at: new Date().toISOString(),
      };
      return this.documents[existingIndex];
    } else {
      const newDoc: ProductDocument = {
        id: doc.id || `doc-${Date.now()}`,
        product_id: doc.product_id || '',
        product_name: product?.name || '',
        brand_name: product?.brand_name || '',
        doc_type: doc.doc_type || 'other',
        file_name: doc.file_name || 'document.pdf',
        file_format: doc.file_format || 'application/pdf',
        file_size: doc.file_size || 1024000,
        storage_path: doc.storage_path || `documents/${doc.file_name}`,
        file_hash: doc.file_hash || 'hash-' + Date.now(),
        version: 1,
        processing_status: doc.processing_status || 'needs_review',
        approval_status: doc.approval_status || 'pending',
        extracted_text: doc.extracted_text || '',
        pages: doc.pages || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.documents.push(newDoc);
      return newDoc;
    }
  }

  updateDocumentApproval(id: string, approval_status: 'approved' | 'rejected', notes?: string): ProductDocument | undefined {
    const doc = this.documents.find(d => d.id === id);
    if (!doc) return undefined;
    doc.approval_status = approval_status;
    doc.processing_status = approval_status === 'approved' ? 'approved' : 'rejected';
    doc.approval_notes = notes || '';
    doc.updated_at = new Date().toISOString();
    return doc;
  }

  getChecks(): ContentCheckResult[] {
    return this.checks;
  }

  getCheckById(id: string): ContentCheckResult | undefined {
    return this.checks.find(c => c.id === id);
  }

  saveCheck(check: ContentCheckResult): ContentCheckResult {
    const existingIndex = this.checks.findIndex(c => c.id === check.id);
    if (existingIndex >= 0) {
      this.checks[existingIndex] = check;
    } else {
      this.checks.unshift(check);
    }
    return check;
  }

  getUsers(): UserProfile[] {
    return this.users;
  }

  getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  setCurrentUserRole(role: UserProfile['role']) {
    const u = this.users.find(user => user.role === role);
    if (u) {
      this.currentUser = u;
    } else {
      this.currentUser.role = role;
    }
  }

  getDashboardStats() {
    const total_brands = this.brands.filter(b => b.is_active).length;
    const total_products = this.products.length;
    const total_documents = this.documents.length;
    const total_checks = this.checks.length;
    const pending_approval = this.checks.filter(c => c.status === 'pending_approval').length;
    const approved_checks = this.checks.filter(c => c.status === 'approved').length;
    const rejected_checks = this.checks.filter(c => c.status === 'rejected').length;

    return {
      total_brands,
      total_products,
      total_documents,
      total_checks: Math.max(total_checks, 24), // Realistic seed activity
      pending_approval: Math.max(pending_approval, 3),
      approved_checks: Math.max(approved_checks, 18),
      rejected_checks: Math.max(rejected_checks, 3),
      common_issues: [
        { category: 'therapeutic_prohibition', name: 'Từ ngữ mang tính điều trị (trị mụn/nám)', count: 42 },
        { category: 'absolute_claims', name: 'Cam kết tuyệt đối (100%, an toàn tuyệt đối)', count: 28 },
        { category: 'rapid_timeframe', name: 'Hiệu quả thần tốc phi thực tế (sau 3 ngày)', count: 19 },
        { category: 'unsupported_ingredients', name: 'Thành phần không khớp hồ sơ INCI', count: 14 },
        { category: 'mandatory_warnings', name: 'Thiếu cảnh báo chống nắng (AHA/BHA)', count: 9 },
      ],
      recent_activities: this.checks.slice(0, 5).map(c => ({
        id: c.id,
        product_name: c.product_name,
        brand_name: c.brand_name,
        user_name: 'Lê Hoàng Anh',
        status: c.status,
        created_at: c.created_at,
        score: Math.round((c.compliant_claims / (c.total_claims || 1)) * 100),
      }))
    };
  }
}

export const appStore = new AppStore();
