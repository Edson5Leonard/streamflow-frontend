import { NAVIGATION_ITEMS } from '@/constants/navigation.constants';
import type { UserRole } from '@/constants/roles.constants';

export function getNavigationForRole(role: UserRole) {
  return NAVIGATION_ITEMS.filter((item) => item.roles.includes(role));
}
