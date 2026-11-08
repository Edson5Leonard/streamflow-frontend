'use client';

import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = useMemo(() => items.slice((currentPage - 1) * pageSize, currentPage * pageSize), [items, currentPage, pageSize]);
  return { page: currentPage, pageSize, pageCount, pageItems, total: items.length, setPage: (next: number) => setPage(Math.max(1, Math.min(next, pageCount))), nextPage: () => setPage((current) => Math.min(current + 1, pageCount)), previousPage: () => setPage((current) => Math.max(current - 1, 1)) };
}
