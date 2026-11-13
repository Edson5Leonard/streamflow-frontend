'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { STORES_QUERY_KEY } from '../constants/stores.constants';

export function useStoreSettingsMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (action: () => Promise<unknown>) => action(),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: STORES_QUERY_KEY });
    },
  });
}
