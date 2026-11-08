'use client';
import { useQuery } from '@tanstack/react-query';
import { SERVICES_QUERY_KEY } from '../constants/services.constants';
import { servicesService } from '../services/services.service';
export function useServices() { return useQuery({ queryKey: [...SERVICES_QUERY_KEY, 'all'], queryFn: servicesService.list }); }
