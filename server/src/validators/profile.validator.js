import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(120, 'Full name cannot exceed 120 characters')
    .optional(),
  preferredLanguage: z
    .string()
    .trim()
    .max(30, 'Preferred language cannot exceed 30 characters')
    .optional(),
  learningGoal: z
    .string()
    .trim()
    .max(100, 'Learning goal cannot exceed 100 characters')
    .optional(),
  bio: z
    .string()
    .trim()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional(),
});
