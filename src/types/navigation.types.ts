import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '@/constants/roles.constants';

export type NavigationLink = { label: string; href: string; icon: LucideIcon; roles: UserRole[]; children?: NavigationLink[] };
