'use client';
import { useQuery } from '@tanstack/react-query';
import { servicesService } from '../services/services.service';
import { SERVICES_QUERY_KEY } from '../constants/services.constants';
export function useActiveServices() { return useQuery({ queryKey: [...SERVICES_QUERY_KEY, 'active'], queryFn: servicesService.listActive }); }
