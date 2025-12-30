import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import DashboardClient from './DashboardClient';
import { getStatsWithRealTotalNotes } from '@/data/mockStats';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  const stats = await getStatsWithRealTotalNotes(userId);

  return <DashboardClient stats={stats} />;
}
