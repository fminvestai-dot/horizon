// src/types/verification.d.ts

/**
 * Goal Achievement Documentation & Verification System
 * Enables users to document goal achievements and generate verifiable Mastery Tokens
 */

import { BeltLevel } from './belt';

/**
 * Structured documentation of goal achievement
 */
export interface GoalProof {
  id: string; // GP-YYYYMMDD-UUID format
  userId: string;
  horizonId: string; // Which horizon goal was achieved
  goalDescription: string; // What was the goal?
  achievementDate: string; // ISO timestamp of achievement
  metrics: GoalProofMetric[]; // Quantifiable results
  evidence: GoalProofEvidence[]; // Qualitative support
  reflection: string; // Hansei reflection on the achievement process
  createdAt: string; // ISO timestamp
  verifiedAt?: string; // Timestamp when included in Mastery Token
}

export interface GoalProofMetric {
  key: string; // e.g., "Revenue", "Marathon Time", "Books Read"
  value: string; // e.g., "10000", "3:45:00", "52"
  unit?: string; // e.g., "USD", "hours", "books"
}

export interface GoalProofEvidence {
  type: 'text' | 'image' | 'link' | 'file';
  content: string; // Text description, image URL, external link, or file reference
  description?: string; // Optional context for the evidence
}

/**
 * Mastery Token for public verification
 * JWT-based token proving belt achievement
 */
export interface MasteryToken {
  tokenId: string; // Unique token identifier
  userId: string; // Reference to user (hashed for privacy)
  beltLevel: BeltLevel;
  issuedAt: string; // ISO timestamp
  achievements: {
    goalProofIds: string[]; // References to documented achievements
    totalDaysLogged: number; // Total days of practice
    peiAverage: number; // 90-day PEI average at time of token generation
    firstLogDate: string; // Journey start date
    beltAwardedDate: string; // When this belt was achieved
  };
  signature: string; // JWT signature for verification
}

/**
 * Public verification result
 * Returned when validating a Mastery Token
 */
export interface PublicVerification {
  tokenId: string;
  isValid: boolean;
  beltLevel?: BeltLevel;
  issuedAt?: string;
  achievementSummary?: {
    totalGoals: number; // Number of documented goals
    totalDays: number; // Days of practice
    averagePEI: number; // PEI average (0-100 for display)
    journeyDuration: string; // e.g., "3 years, 2 months"
  };
  error?: string; // Error message if invalid
}

/**
 * Request to generate a Mastery Token
 */
export interface GenerateTokenRequest {
  userId: string;
  beltLevel: BeltLevel;
}

/**
 * Request to verify a Mastery Token
 */
export interface VerifyTokenRequest {
  token: string; // JWT token string
}
