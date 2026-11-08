import { create } from 'zustand';
type StatisticsState = { range: '7d' | '30d' | '90d' | '12m'; setRange: (range: StatisticsState['range']) => void };
export const useStatisticsStore = create<StatisticsState>((set) => ({ range: '30d', setRange: (range) => set({ range }) }));
