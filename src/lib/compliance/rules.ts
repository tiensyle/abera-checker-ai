import { ComplianceRule } from '@/types';

export const INITIAL_COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'rule-01',
    rule_code: 'R_THERAPEUTIC_CLAIM',
    category: 'therapeutic_prohibition',
    title: 'Cấm quảng cáo điều trị hoặc mang tính chữa bệnh',
    description: 'Mỹ phẩm chỉ dùng bên ngoài để làm sạch, làm đẹp, bảo vệ. Tuyệt đối không dùng từ điều trị, trị dứt điểm, đặc trị, chữa khỏi, tiệt căn.',
    keywords: [
      'điều trị', 'trị dứt điểm', 'đặc trị', 'chữa khỏi', 'tiệt căn', 
      'chữa lành', 'thuốc', 'trị mụn tận gốc', 'trị nám tận gốc', 
      'kháng viêm', 'tiêu viêm', 'diệt khuẩn yếm khí'
    ],
    legal_reference: 'Thông tư 06/2011/TT-BYT Phụ lục số 03-MP',
    severity: 'high',
    is_active: true,
  },
  {
    id: 'rule-02',
    rule_code: 'R_ABSOLUTE_GUARANTEE',
    category: 'absolute_claims',
    title: 'Cấm cam kết tuyệt đối hóa hiệu quả 100%',
    description: 'Không được cam kết hiệu quả tuyệt đối 100%, an toàn tuyệt đối, hoàn toàn không kích ứng, hoặc không có tác dụng phụ.',
    keywords: [
      '100%', 'hiệu quả 100%', 'an toàn tuyệt đối', 'cam kết không kích ứng', 
      'không có tác dụng phụ', 'hoàn toàn vô hại', 'vĩnh viễn không tái phát',
      'xóa sẹo hoàn toàn', 'cam kết hoàn tiền'
    ],
    legal_reference: 'Luật Quảng cáo 2012 Điều 8 Khoản 9',
    severity: 'high',
    is_active: true,
  },
  {
    id: 'rule-03',
    rule_code: 'R_RAPID_TIMEFRAME',
    category: 'absolute_claims',
    title: 'Cấm tuyên bố hiệu quả thần tốc phi thực tế',
    description: 'Không được tuyên bố kết quả thần tốc không có căn cứ lâm sàng như trắng da sau 3 ngày, trẻ hóa 10 tuổi sau 1 tuần.',
    keywords: [
      'sau 3 ngày', 'trắng sau 3 ngày', 'bật tông sau 1 đêm', 
      'trẻ hóa 10 tuổi', 'giảm 5cm ngay tức thì', 'sau 24h sạch mụn'
    ],
    legal_reference: 'Nghị định 181/2013/NĐ-CP Điều 4',
    severity: 'high',
    is_active: true,
  },
  {
    id: 'rule-04',
    rule_code: 'R_CELLULAR_REGEN',
    category: 'cosmetic_definition',
    title: 'Cấm tuyên bố can thiệp tế bào gốc / cấu trúc sâu',
    description: 'Mỹ phẩm không thể thay đổi cấu trúc tế bào gốc, làm đầy sẹo vĩnh viễn hoặc biến đổi gen tế bào biểu bì.',
    keywords: [
      'tái tạo tế bào gốc', 'biến đổi gen', 'thay đổi ADN', 
      'tái sinh mô sâu', 'làm đầy mô vĩnh viễn'
    ],
    legal_reference: 'Thông tư 06/2011/TT-BYT Điều 2 Khoản 1',
    severity: 'high',
    is_active: true,
  },
  {
    id: 'rule-05',
    rule_code: 'R_MANDATORY_WARNING',
    category: 'mandatory_warnings',
    title: 'Thiếu cảnh báo bắt buộc cho hoạt chất acid/retinoid',
    description: 'Khi sản phẩm chứa AHA, BHA, Retinol, bài viết bắt buộc phải lưu ý chống nắng hoặc thử nghiệm trên vùng da nhỏ.',
    keywords: ['retinol', 'aha', 'bha', 'glycolic acid', 'salicylic acid', 'tretinoin'],
    legal_reference: 'Thông tư 06/2011/TT-BYT Điều 18',
    severity: 'medium',
    is_active: true,
  }
];

export function evaluateVietnameseAdvertisingRules(text: string): {
  rule: ComplianceRule;
  matchedKeyword: string;
}[] {
  const violations: { rule: ComplianceRule; matchedKeyword: string }[] = [];
  const lowerText = text.toLowerCase();

  for (const rule of INITIAL_COMPLIANCE_RULES) {
    if (!rule.is_active) continue;
    for (const keyword of rule.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        violations.push({ rule, matchedKeyword: keyword });
        break; // Match rule once
      }
    }
  }

  return violations;
}
