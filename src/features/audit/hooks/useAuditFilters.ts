'use client';
import { useMemo } from 'react';
import { useAuditStore } from '../stores/audit.store';
import { filterAudit } from '../utils/audit.utils';
import type { AuditEvent } from '../types/audit.types';
export function useAuditFilters(events: AuditEvent[]) { const search = useAuditStore((state) => state.search); const status = useAuditStore((state) => state.status); const setSearch = useAuditStore((state) => state.setSearch); const setStatus = useAuditStore((state) => state.setStatus); const resetFilters = useAuditStore((state) => state.resetFilters); const filtered = useMemo(() => filterAudit(events, search, status), [events, search, status]); return { search, status, setSearch, setStatus, resetFilters, filtered }; }
