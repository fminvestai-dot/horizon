import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DailyCockpit from '../components/DailyCockpit';

export default async function DailyPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch today's log (if exists)
  const today = new Date().toISOString().split('T')[0];
  const { data: todayLog } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single();

  // Fetch user's H1 horizons for selection
  const { data: h1Horizons } = await supabase
    .from('horizons')
    .select('*')
    .eq('user_id', user.id)
    .eq('level', 'H1')
    .eq('status', 'active')
    .order('created_at', { ascending: true });

  return <DailyCockpit initialLog={todayLog} horizons={h1Horizons || []} />;
}
