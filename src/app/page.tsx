import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Not authenticated, redirect to login
    redirect('/auth/login');
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('belt_progress')
    .eq('id', user.id)
    .single();

  const firstLogDate = profile?.belt_progress?.firstLogDate;

  if (!firstLogDate) {
    // User hasn't completed onboarding
    redirect('/onboarding');
  }

  // User is authenticated and onboarded, go to dashboard
  redirect('/dashboard');
}
