// src/lib/api/horizons.ts
/**
 * API helpers for managing user-defined Horizons
 */

import { createClient } from '../supabase/client';
import { Horizon } from '@/types/horizon';

/**
 * Fetch all horizons for the current user
 */
export async function getUserHorizons(): Promise<Horizon[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('horizons')
    .select('*')
    .eq('user_id', user.id)
    .order('level', { ascending: false }) // H3 → H2 → H1
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch horizons filtered by level (H3, H2, or H1)
 */
export async function getHorizonsByLevel(level: 'H3' | 'H2' | 'H1'): Promise<Horizon[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('horizons')
    .select('*')
    .eq('user_id', user.id)
    .eq('level', level)
    .eq('status', 'active')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Create a new horizon
 */
export async function createHorizon(horizon: Omit<Horizon, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Horizon> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Generate horizon ID based on level and existing count
  const existingHorizons = await getHorizonsByLevel(horizon.level);
  const count = existingHorizons.length + 1;
  const id = `${horizon.level}-${String(count).padStart(2, '0')}`;

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('horizons')
    .insert({
      id,
      user_id: user.id,
      ...horizon,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing horizon
 */
export async function updateHorizon(id: string, updates: Partial<Horizon>): Promise<Horizon> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('horizons')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a horizon (soft delete by setting status to 'archived')
 */
export async function archiveHorizon(id: string): Promise<void> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('horizons')
    .update({
      status: 'archived',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

/**
 * Mark a horizon as achieved
 */
export async function markHorizonAchieved(id: string): Promise<Horizon> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('horizons')
    .update({
      status: 'achieved',
      achieved_at: now,
      updated_at: now,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get child horizons (e.g., all H1 goals linked to a specific H2)
 */
export async function getChildHorizons(parentId: string): Promise<Horizon[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('horizons')
    .select('*')
    .eq('user_id', user.id)
    .eq('parent_horizon_id', parentId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}
