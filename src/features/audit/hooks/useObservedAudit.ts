'use client';
import { useQuery } from '@tanstack/react-query';
import { auditService } from '../services/audit.service';
import { AUDIT_QUERY_KEY } from '../constants/audit.constants';
export function useObservedAudit() { return useQuery({ queryKey: [...AUDIT_QUERY_KEY, 'observed'], queryFn: auditService.listObservedClaims }); }
