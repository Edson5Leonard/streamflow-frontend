import { StatisticsCards } from '@/features/statistics/components/StatisticsCards';
import type { GlobalStatistics } from '@/features/statistics/types/statistics.types';
export function GlobalStats({ data }: { data: GlobalStatistics }) { return <StatisticsCards variant="global" data={data} />; }
