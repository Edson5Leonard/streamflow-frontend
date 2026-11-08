import { StatisticsCards } from '@/features/statistics/components/StatisticsCards';
import type { DistributorStatistics } from '@/features/statistics/types/statistics.types';
export function DistributorStats({ data }: { data: DistributorStatistics }) { return <StatisticsCards variant="distributor" data={data} />; }
