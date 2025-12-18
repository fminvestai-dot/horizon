'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import WelcomeScreen from '../components/onboarding/WelcomeScreen';
import HorizonSetupStep from '../components/onboarding/HorizonSetupStep';
import FIRESetupStep from '../components/onboarding/FIRESetupStep';
import { Horizon } from '@/types/horizon';

type OnboardingStep = 'welcome' | 'h3' | 'h2' | 'h1' | 'fire' | 'complete';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [h3Horizons, setH3Horizons] = useState<Partial<Horizon>[]>([]);
  const [h2Horizons, setH2Horizons] = useState<Partial<Horizon>[]>([]);
  const [h1Horizons, setH1Horizons] = useState<Partial<Horizon>[]>([]);
  const [peiThreshold, setPeiThreshold] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleWelcomeContinue = () => {
    setCurrentStep('h3');
  };

  const handleH3Complete = (horizons: Partial<Horizon>[]) => {
    setH3Horizons(horizons);
    setCurrentStep('h2');
  };

  const handleH2Complete = (horizons: Partial<Horizon>[]) => {
    setH2Horizons(horizons);
    setCurrentStep('h1');
  };

  const handleH1Complete = (horizons: Partial<Horizon>[]) => {
    setH1Horizons(horizons);
    setCurrentStep('fire');
  };

  const handleFIREComplete = async (threshold: number) => {
    setPeiThreshold(threshold);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      // Create all horizons in database
      const allHorizons = [
        ...h3Horizons.map((h, i) => ({
          ...h,
          id: `H3-${String(i + 1).padStart(2, '0')}`,
          level: 'H3' as const,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active' as const,
        })),
        ...h2Horizons.map((h, i) => ({
          ...h,
          id: `H2-${String(i + 1).padStart(2, '0')}`,
          level: 'H2' as const,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active' as const,
        })),
        ...h1Horizons.map((h, i) => ({
          ...h,
          id: `H1-${String(i + 1).padStart(2, '0')}`,
          level: 'H1' as const,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active' as const,
        })),
      ];

      // Insert horizons
      const { error: horizonsError } = await supabase
        .from('horizons')
        .insert(allHorizons);

      if (horizonsError) throw horizonsError;

      // Update user profile with preferences and first log date
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          preferences: {
            peiThresholdIshikawa: threshold,
            fireReminders: true,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: 'en',
          },
          belt_progress: {
            currentBelt: 'white',
            currentBeltAwardedAt: new Date().toISOString(),
            daysConsecutive: 0,
            totalDaysLogged: 0,
            firstLogDate: new Date().toISOString(),
            achievedGoals: [],
            progressToNext: {
              daysRemaining: 180,
              monthsRemaining: 12,
              goalsRemaining: { h1: 1, h2: 0 },
              peiAverage: 0,
              isEligible: false,
            },
          },
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      setCurrentStep('complete');

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Onboarding error:', error);
      alert('Failed to complete onboarding: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps: Record<OnboardingStep, number> = {
    welcome: 0,
    h3: 1,
    h2: 2,
    h1: 3,
    fire: 4,
    complete: 5,
  };

  const totalSteps = 5;
  const progressPercent = (steps[currentStep] / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-zen-black p-4">
      {/* Progress bar */}
      {currentStep !== 'complete' && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="h-1 bg-zen-gray rounded-full overflow-hidden">
            <div
              className="h-full bg-zen-accent transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-center text-sm text-zen-gray mt-2">
            Step {steps[currentStep]} of {totalSteps}
          </p>
        </div>
      )}

      {/* Steps */}
      {currentStep === 'welcome' && (
        <WelcomeScreen onContinue={handleWelcomeContinue} />
      )}

      {currentStep === 'h3' && (
        <HorizonSetupStep
          level="H3"
          label="Vision"
          timeframe="10+ years"
          description="Define your long-term vision. Where do you want to be in 10+ years?"
          examples={[
            'Build a successful company',
            'Achieve financial freedom',
            'Master a craft or skill',
          ]}
          onComplete={handleH3Complete}
          onBack={() => setCurrentStep('welcome')}
        />
      )}

      {currentStep === 'h2' && (
        <HorizonSetupStep
          level="H2"
          label="Strategy"
          timeframe="3-4 years"
          description="Define your strategic goals. What major milestones will lead to your vision?"
          examples={[
            'Launch a product with 10,000 users',
            'Save $100,000',
            'Complete advanced training',
          ]}
          parentHorizons={h3Horizons}
          onComplete={handleH2Complete}
          onBack={() => setCurrentStep('h3')}
        />
      )}

      {currentStep === 'h1' && (
        <HorizonSetupStep
          level="H1"
          label="Tactics"
          timeframe="1 year"
          description="Define your tactical goals for this year. What can you accomplish in the next 12 months?"
          examples={[
            'Ship MVP by Q2',
            'Save $10,000',
            'Complete certification',
          ]}
          parentHorizons={h2Horizons}
          onComplete={handleH1Complete}
          onBack={() => setCurrentStep('h2')}
        />
      )}

      {currentStep === 'fire' && (
        <FIRESetupStep
          onComplete={handleFIREComplete}
          onBack={() => setCurrentStep('h1')}
          loading={loading}
        />
      )}

      {currentStep === 'complete' && (
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold font-mono mb-4">Welcome to Hansei OS!</h1>
          <p className="text-zen-gray mb-8">
            Your journey begins now. Redirecting to dashboard...
          </p>
          <div className="animate-spin w-8 h-8 border-2 border-zen-accent border-t-transparent rounded-full mx-auto" />
        </div>
      )}
    </div>
  );
}
