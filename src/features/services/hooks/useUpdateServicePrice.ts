'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SERVICES_QUERY_KEY } from '../constants/services.constants';
import { servicesService } from '../services/services.service';
export function useUpdateServicePrice() { const client = useQueryClient(); return useMutation({ mutationFn: servicesService.updatePrice, onSuccess: () => client.invalidateQueries({ queryKey: SERVICES_QUERY_KEY }) }); }
