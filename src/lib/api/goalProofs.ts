// src/lib/api/goalProofs.ts
/**
 * API helpers for managing goal achievement proofs
 */

import { createClient } from '../supabase/client';
import { GoalProof } from '@/types/verification';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

/**
 * Get all goal proofs for the current user
 */
export async function getUserGoalProofs(): Promise<GoalProof[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('goal_proofs')
    .select('*')
    .eq('user_id', user.id)
    .order('achievement_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get goal proofs for a specific horizon
 */
export async function getProofsForHorizon(horizonId: string): Promise<GoalProof[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('goal_proofs')
    .select('*')
    .eq('user_id', user.id)
    .eq('horizon_id', horizonId)
    .order('achievement_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Create a new goal proof
 */
export async function createGoalProof(
  proof: Omit<GoalProof, 'id' | 'userId' | 'createdAt'>
): Promise<GoalProof> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Generate proof ID: GP-YYYYMMDD-UUID
  const dateStr = format(new Date(proof.achievementDate), 'yyyyMMdd');
  const id = `GP-${dateStr}-${uuidv4().split('-')[0]}`;

  const { data, error } = await supabase
    .from('goal_proofs')
    .insert({
      id,
      user_id: user.id,
      ...proof,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing goal proof
 */
export async function updateGoalProof(
  id: string,
  updates: Partial<GoalProof>
): Promise<GoalProof> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('goal_proofs')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a goal proof
 */
export async function deleteGoalProof(id: string): Promise<void> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('goal_proofs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

/**
 * Count achieved goals by horizon level (for belt progression)
 */
export async function countAchievedGoalsByLevel(): Promise<{ h1: number; h2: number; h3: number }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get all goal proofs
  const proofs = await getUserGoalProofs();

  // Get horizons to determine levels
  const { data: horizons, error } = await supabase
    .from('horizons')
    .select('id, level')
    .eq('user_id', user.id);

  if (error) throw error;

  // Create a map of horizon ID to level
  const horizonLevelMap = new Map<string, string>();
  horizons?.forEach((h) => horizonLevelMap.set(h.id, h.level));

  // Count proofs by level
  const counts = { h1: 0, h2: 0, h3: 0 };

  proofs.forEach((proof) => {
    const level = horizonLevelMap.get(proof.horizonId);
    if (level === 'H1') counts.h1++;
    else if (level === 'H2') counts.h2++;
    else if (level === 'H3') counts.h3++;
  });

  return counts;
}

/**
 * Mark a goal proof as verified (included in Mastery Token)
 */
export async function markProofVerified(id: string): Promise<void> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('goal_proofs')
    .update({ verified_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}
