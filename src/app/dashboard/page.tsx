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
    <div className="min-h-screen bg-gradient-to-br from-zen-black via-zen-darker to-zen-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-dot-pattern bg-dot-pattern-size opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-zen-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-zen-accent/5 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative border-b border-zen-gray/20 backdrop-blur-xl bg-zen-dark/50 sticky top-0 z-50 shadow-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zen-accent to-zen-accent-dark flex items-center justify-center shadow-glow">
                <span className="text-xl font-bold text-zen-black">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold font-mono bg-gradient-to-r from-zen-white to-zen-gray-light bg-clip-text text-transparent">
                  QLM Hansei OS
                </h1>
                <p className="text-sm text-zen-gray">Welcome back, {profile?.display_name || 'User'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/daily"
                className="group relative px-6 py-2.5 bg-accent-gradient text-zen-black font-medium rounded-xl hover:shadow-glow transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Daily Cockpit</span>
                <div className="absolute inset-0 bg-gradient-to-r from-zen-accent-light to-zen-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="p-2.5 text-zen-gray hover:text-zen-white hover:bg-zen-gray-dark/30 rounded-xl transition-all duration-300"
                  title="Sign out"
                >
                  <LogOut size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 animate-fade-in">
          {/* Left column: Belt Progress */}
          <div className="lg:col-span-1 animate-slide-up">
            <BeltProgressTracker beltProgress={profile?.belt_progress} />
          </div>

          {/* Right column: Horizon Dashboard */}
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <HorizonDashboard horizons={horizons || []} />
          </div>
        </div>
      </main>
    </div>
  );
}
