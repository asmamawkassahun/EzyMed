import { z } from "zod";

export const healthReadingSchema = z.object({
  reading_type: z.enum(["blood_pressure", "heart_rate", "blood_sugar", "weight", "temperature"]),
  value: z.string(), // String to support complex values like "120/80"
  unit: z.string(),
  notes: z.string().optional(),
  recorded_at: z.string().optional(),
});

export type HealthReadingInput = z.infer<typeof healthReadingSchema>;
