'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('belt_progress')
          .eq('id', data.user.id)
          .single();

        // Redirect to onboarding if first log date is null
        const firstLogDate = profile?.belt_progress?.firstLogDate;
        if (!firstLogDate) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-black via-zen-darker to-zen-dark relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-dot-pattern bg-dot-pattern-size opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-zen-accent/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-zen-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-zen-accent to-zen-accent-dark shadow-glow mb-4">
            <span className="text-2xl font-bold text-zen-black">H</span>
          </div>
          <h1 className="text-4xl font-bold font-mono mb-2 bg-gradient-to-r from-zen-white via-zen-gray-light to-zen-white bg-clip-text text-transparent">
            QLM Hansei OS
          </h1>
          <p className="text-zen-gray-light">Sign in to your account</p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-zen-dark/80 to-zen-black/80 border border-zen-gray/20 rounded-2xl p-8 shadow-glass">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-500 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border border-zen-gray rounded px-4 py-2 focus:outline-none focus:border-zen-accent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border border-zen-gray rounded px-4 py-2 focus:outline-none focus:border-zen-accent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-gradient text-zen-black font-medium py-3 rounded-xl hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-zen-gray">Don't have an account? </span>
            <Link href="/auth/signup" className="text-zen-accent hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
