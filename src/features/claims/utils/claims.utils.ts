import type { Claim } from '../types/claims.types';
export const getPendingClaims = (claims: Claim[]) => claims.filter((claim) => claim.estado.includes('PENDIENTE'));
