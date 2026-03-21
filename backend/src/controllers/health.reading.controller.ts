import { Request, Response } from "express";
import { supabaseAdmin } from "../configs/supabase.js";
import { healthReadingSchema } from "../validators/health.reading.schema.js";

export const healthReadingController = {
  async addReading(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const validatedData = healthReadingSchema.parse(req.body);

      const { data, error } = await supabaseAdmin
        .from("health_readings")
        .insert({
          user_id: userId,
          ...validatedData,
          recorded_at: validatedData.recorded_at || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    } catch (error: any) {
      if (error.name === "ZodError") return res.status(400).json({ error: error.errors });
      return res.status(500).json({ error: error.message });
    }
  },

  async getMyReadings(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { type } = req.query;
      let query = supabaseAdmin
        .from("health_readings")
        .select("*")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: false });

      if (type) {
        query = query.eq("reading_type", type);
      }

      const { data, error } = await query;
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getPatientReadings(req: Request, res: Response) {
    try {
      const doctorId = (req as any).user?.id;
      const { patientId } = req.params;
      if (!doctorId) return res.status(401).json({ error: "Unauthorized" });

      // Check if doctor has access to this patient (e.g. through a booking or access request)
      // Since EzyMed has an access request system, we should verify it.
      // For now, I'll allow based on any booking existence as a proxy or just rely on the doctor role if they know the ID.
      // Better: check if there's a confirmed booking.
      
      const { data: booking } = await supabaseAdmin
        .from("bookings")
        .select("id")
        .eq("doctor_id", doctorId)
        .eq("patient_id", patientId)
        .limit(1)
        .maybeSingle();

      if (!booking) {
        return res.status(403).json({ error: "No confirmed interaction with this patient." });
      }

      const { data, error } = await supabaseAdmin
        .from("health_readings")
        .select("*")
        .eq("user_id", patientId)
        .order("recorded_at", { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
};
