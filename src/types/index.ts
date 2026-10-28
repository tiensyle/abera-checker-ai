export type UserRole = 'super_admin' | 'reviewer' | 'employee';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  code: string;
  name: string;
  logo_url?: string;
  description?: string;
  product_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type DossierStatus = 'draft' | 'reviewing' | 'approved' | 'rejected';

export interface Product {
  id: string;
  brand_id: string;
  brand_name?: string;
  code: string;
  name: string;
  image_url?: string;
  category: string;
  notification_number?: string;
  responsible_entity?: string;
  manufacturer?: string;
  inci_ingredients: string[];
  verified_benefits: string[];
  usage_instructions?: string;
  warnings?: string;
  dossier_status: DossierStatus;
  version: number;
  documents_count?: number;
  approved_documents_count?: number;
  created_at: string;
  updated_at: string;
}

export type DocumentType = 
  | 'notification_slip' 
  | 'inci_sheet' 
  | 'benefit_support' 
  | 'usage_guide' 
  | 'clinical_study' 
  | 'other';

export type DocumentProcessingStatus = 
  | 'uploaded' 
  | 'processing' 
  | 'needs_review' 
  | 'approved' 
  | 'rejected' 
  | 'failed';

export type DocumentApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface DocumentPage {
  id: string;
  document_id: string;
  page_number: number;
  page_text: string;
  ocr_applied: boolean;
  ocr_confidence?: number;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  page_id: string;
  chunk_index: number;
  chunk_text: string;
  token_count?: number;
  similarity?: number;
}

export interface ProductDocument {
  id: string;
  product_id: string;
  product_name?: string;
  brand_name?: string;
  doc_type: DocumentType;
  file_name: string;
  file_format: string;
  file_size: number;
  storage_path: string;
  file_hash: string;
  version: number;
  processing_status: DocumentProcessingStatus;
  approval_status: DocumentApprovalStatus;
  extracted_text?: string;
  uploaded_by?: string;
  approved_by?: string;
  approval_notes?: string;
  pages?: DocumentPage[];
  created_at: string;
  updated_at: string;
}

export type RiskLevel = 'none' | 'low' | 'medium' | 'high';
export type EvidenceStatus = 'compliant' | 'insufficient' | 'contradictory';

export interface ComplianceRule {
  id: string;
  rule_code: string;
  category: string;
  title: string;
  description: string;
  keywords: string[];
  legal_reference: string;
  severity: RiskLevel;
  is_active: boolean;
}

export interface ClaimEvidence {
  id?: string;
  document_id: string;
  document_name: string;
  doc_type: DocumentType;
  page_number: number;
  chunk_id?: string;
  quoted_text: string;
  relevance_score?: number;
  verification_status: 'verified' | 'unverified';
}

export interface AnalyzedClaim {
  id: string;
  order: number;
  original_text: string;
  category: 'product_identity' | 'ingredient' | 'efficacy' | 'usage' | 'rule_violation' | 'general';
  evidence_status: EvidenceStatus;
  risk_level: RiskLevel;
  issues: string[];
  citations: ClaimEvidence[];
  suggested_rewrite?: string | null;
  requires_human_review: boolean;
  user_action?: 'accepted' | 'rejected' | 'modified' | 'pending';
  modified_text?: string;
}

export type ContentCheckStatus = 
  | 'draft' 
  | 'checking' 
  | 'needs_revision' 
  | 'pending_approval' 
  | 'approved' 
  | 'rejected';

export interface ContentCheckResult {
  id: string;
  product_id: string;
  product_name: string;
  brand_id: string;
  brand_name: string;
  title: string;
  original_content: string;
  revised_content?: string;
  status: ContentCheckStatus;
  overall_status: 'compliant' | 'needs_revision' | 'high_risk' | 'insufficient_dossier';
  total_claims: number;
  compliant_claims: number;
  insufficient_claims: number;
  contradictory_claims: number;
  legal_risk_claims: number;
  claims: AnalyzedClaim[];
  ai_model: string;
  rule_version: string;
  created_at: string;
  reviewer_notes?: string;
  reviewer_name?: string;
}

export interface DashboardStats {
  total_brands: number;
  total_products: number;
  total_documents: number;
  total_checks: number;
  pending_approval: number;
  approved_checks: number;
  rejected_checks: number;
  common_issues: { category: string; count: number; name: string }[];
  recent_activities: {
    id: string;
    product_name: string;
    brand_name: string;
    user_name: string;
    status: ContentCheckStatus;
    created_at: string;
    score: number;
  }[];
}
