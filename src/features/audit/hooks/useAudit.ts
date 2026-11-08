'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AUDIT_QUERY_KEY } from '../constants/audit.constants';
import { auditService } from '../services/audit.service';
import { useObservedAudit } from './useObservedAudit';
export function useAudit() {
  const query = useObservedAudit();
  const client = useQueryClient();
  const invalidate = async () => { await Promise.all([client.invalidateQueries({ queryKey: AUDIT_QUERY_KEY }), client.invalidateQueries({ queryKey: ['claims'] }), client.invalidateQueries({ queryKey: ['accounts'] })]); };
  const discard = useMutation({ mutationFn: auditService.discard, onSuccess: invalidate });
  const recover = useMutation({ mutationFn: ({ id, password }: { id: string; password: string }) => auditService.recover(id, password), onSuccess: invalidate });
  return { ...query, discard, recover };
}
