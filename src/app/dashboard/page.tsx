import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import HorizonDashboard from '../components/dashboard/HorizonDashboard';
import BeltProgressTracker from '../components/dashboard/BeltProgressTracker';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch user's horizons
  const { data: horizons } = await supabase
    .from('horizons')
    .select('*')
    .eq('user_id', user.id)
    .order('level', { ascending: false }) // H3 → H2 → H1
    .order('created_at', { ascending: true });

  return (
    <div className="min-h-screen bg-dot-pattern bg-dot-pattern-size">
      {/* Header */}
      <header className="border-b border-zen-gray bg-zen-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono">QLM Hansei OS</h1>
            <p className="text-sm text-zen-gray">Welcome back, {profile?.display_name || 'User'}</p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/daily"
              className="px-4 py-2 bg-zen-accent text-zen-black font-medium rounded hover:opacity-90 transition-opacity"
            >
              Daily Cockpit
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="p-2 text-zen-gray hover:text-zen-white transition-colors"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Belt Progress */}
          <div className="lg:col-span-1">
            <BeltProgressTracker beltProgress={profile?.belt_progress} />
          </div>

          {/* Right column: Horizon Dashboard */}
          <div className="lg:col-span-2">
            <HorizonDashboard horizons={horizons || []} />
          </div>
        </div>
      </main>
    </div>
  );
}
