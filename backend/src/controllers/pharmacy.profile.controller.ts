import { Request, Response } from "express";
import { supabaseAdmin } from "../configs/supabase.js";
import { upsertPharmacyProfileSchema } from "../validators/pharmacy.profile.schema.js";

export const pharmacyProfileController = {
  async getMyPharmacyProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { data, error } = await supabaseAdmin
        .from("pharmacy_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        return res.status(500).json({ error: error.message });
      }

      return res.json(data || {});
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async upsertMyPharmacyProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const validatedData = upsertPharmacyProfileSchema.parse(req.body);

      const { data, error } = await supabaseAdmin
        .from("pharmacy_profiles")
        .upsert(
          {
            user_id: userId,
            ...validatedData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Also update the role_status in the main profiles table if needed
      // Typically, when they update their profile, it stays in the current status
      // or moves to pending if it was rejected?
      // Logic from doctor profile:
      await supabaseAdmin
        .from("profiles")
        .update({ role_status: "pending" }) // Ensure it's pending for review if they update critical info?
        .eq("id", userId)
        .eq("role_status", "rejected"); // only reset if previously rejected

      return res.json(data);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  },

  async uploadVerificationDocument(req: Request, res: Response) {
    // This would typically involve uploading to a storage bucket
    // For now, it's a placeholder returning a mock URL or handled by a generic storage controller
    return res.status(501).json({ error: "Not implemented. Use generic upload." });
  }
};
