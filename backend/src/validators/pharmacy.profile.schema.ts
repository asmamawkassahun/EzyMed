import { z } from "zod";

export const upsertPharmacyProfileSchema = z.object({
  business_name: z.string().min(2).max(255).optional(),
  license_number: z.string().min(2).max(100).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(255).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type UpsertPharmacyProfileInput = z.infer<typeof upsertPharmacyProfileSchema>;
