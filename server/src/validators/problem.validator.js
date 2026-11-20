import { z } from 'zod';

export const listProblemsQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  topic: z.string().trim().max(80).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
