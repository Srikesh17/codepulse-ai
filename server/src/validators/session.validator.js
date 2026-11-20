import { z } from 'zod';

export const startSessionSchema = z.object({
  problemId: z.string().min(1, 'problemId is required').max(100),
});

export const saveDraftSchema = z.object({
  code: z.string().max(50000, 'Code cannot exceed 50 000 characters'),
  version: z.number().int().min(0),
  language: z.string().max(30).default('python'),
});

export const createAttemptSchema = z.object({
  code: z.string().max(50000, 'Code cannot exceed 50 000 characters'),
  attemptType: z.enum(['manual_snapshot', 'evaluated_submission']).default('manual_snapshot'),
  language: z.string().max(30).default('python'),
});
