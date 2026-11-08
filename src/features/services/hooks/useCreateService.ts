'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SERVICES_QUERY_KEY } from '../constants/services.constants';
import { servicesService } from '../services/services.service';
export function useCreateService() { const client = useQueryClient(); return useMutation({ mutationFn: servicesService.create, onSuccess: () => client.invalidateQueries({ queryKey: SERVICES_QUERY_KEY }) }); }
