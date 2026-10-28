import { UserRole } from '@/types';

export const PERMISSIONS = {
  MANAGE_USERS: ['super_admin'] as UserRole[],
  MANAGE_COMPLIANCE_RULES: ['super_admin'] as UserRole[],
  MANAGE_BRANDS: ['super_admin', 'reviewer'] as UserRole[],
  MANAGE_PRODUCTS: ['super_admin', 'reviewer'] as UserRole[],
  APPROVE_DOCUMENTS: ['super_admin', 'reviewer'] as UserRole[],
  APPROVE_CONTENT_CHECKS: ['super_admin', 'reviewer'] as UserRole[],
  RUN_CONTENT_CHECK: ['super_admin', 'reviewer', 'employee'] as UserRole[],
  SUBMIT_FOR_APPROVAL: ['super_admin', 'reviewer', 'employee'] as UserRole[],
  VIEW_AUDIT_LOGS: ['super_admin'] as UserRole[],
};

export function hasPermission(role: UserRole | undefined, requiredRoles: UserRole[]): boolean {
  if (!role) return false;
  return requiredRoles.includes(role);
}

export function canApproveDocument(role: UserRole | undefined): boolean {
  return hasPermission(role, PERMISSIONS.APPROVE_DOCUMENTS);
}

export function canApproveContent(
  role: UserRole | undefined, 
  authorId: string, 
  currentUserId: string
): boolean {
  if (!role) return false;
  // Nguyên tắc: Không ai được tự phê duyệt bài viết của chính mình
  if (authorId === currentUserId) return false;
  return hasPermission(role, PERMISSIONS.APPROVE_CONTENT_CHECKS);
}
