// src/lib/api/dailyLogs.ts
/**
 * API helpers for managing daily logs
 */

import { createClient } from '../supabase/client';
import { DailyLog } from '@/types/hansei';
import { format, subDays } from 'date-fns';

/**
 * Get today's daily log
 */
export async function getTodayLog(): Promise<DailyLog | null> {
  const today = format(new Date(), 'yyyy-MM-dd');
  return getDailyLog(today);
}

/**
 * Get daily log for a specific date
 */
export async function getDailyLog(date: string): Promise<DailyLog | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No log for this date
    throw error;
  }

  return data;
}

/**
 * Get daily logs for a date range
 */
export async function getDailyLogsRange(startDate: string, endDate: string): Promise<DailyLog[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get last N days of logs
 */
export async function getRecentLogs(days: number = 7): Promise<DailyLog[]> {
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');
  return getDailyLogsRange(startDate, endDate);
}

/**
 * Create or update a daily log
 */
export async function saveDailyLog(log: Omit<DailyLog, 'userId' | 'createdAt'>): Promise<DailyLog> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_logs')
    .upsert({
      user_id: user.id,
      ...log,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Calculate PEI average for a date range
 */
export async function calculatePEIAverage(startDate: string, endDate: string): Promise<number> {
  const logs = await getDailyLogsRange(startDate, endDate);

  if (logs.length === 0) return 0;

  const totalPEI = logs.reduce((sum, log) => sum + log.pei.total, 0);
  return totalPEI / logs.length;
}

/**
 * Calculate 90-day PEI average (for belt progression)
 */
export async function calculate90DayPEI(): Promise<number> {
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(subDays(new Date(), 90), 'yyyy-MM-dd');
  return calculatePEIAverage(startDate, endDate);
}

/**
 * Check if user logged yesterday (for streak calculation)
 */
export async function hasLoggedYesterday(): Promise<boolean> {
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const log = await getDailyLog(yesterday);
  return log !== null;
}

/**
 * Get total count of all daily logs
 */
export async function getTotalDaysLogged(): Promise<number> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { count, error } = await supabase
    .from('daily_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) throw error;
  return count || 0;
}

/**
 * Get logs linked to a specific horizon
 */
export async function getLogsForHorizon(horizonId: string, days: number = 30): Promise<DailyLog[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .contains('horizon_sync', [horizonId])
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}
