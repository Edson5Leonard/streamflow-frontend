import { create } from 'zustand';
type ClaimsState = { selectedClaimId: string | null; selectClaim: (id: string | null) => void };
export const useClaimsStore = create<ClaimsState>((set) => ({ selectedClaimId: null, selectClaim: (selectedClaimId) => set({ selectedClaimId }) }));
