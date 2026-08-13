import api from "./api";

export type ReadingType = "blood_pressure" | "heart_rate" | "blood_sugar" | "weight" | "temperature";

export interface HealthReading {
  id: string;
  user_id: string;
  reading_type: ReadingType;
  value: string;
  unit: string;
  notes?: string;
  recorded_at: string;
  created_at: string;
}

export interface AddReadingPayload {
  reading_type: ReadingType;
  value: string;
  unit: string;
  notes?: string;
  recorded_at?: string;
}

export const healthService = {
  async addReading(payload: AddReadingPayload): Promise<HealthReading> {
    const response = await api.post("/health-readings", payload);
    return response.data;
  },

  async getMyReadings(type?: ReadingType): Promise<HealthReading[]> {
    const response = await api.get("/health-readings/my", {
      params: { type },
    });
    return response.data;
  },

  async getPatientReadings(patientId: string): Promise<HealthReading[]> {
    const response = await api.get(`/health-readings/patient/${patientId}`);
    return response.data;
  },
};
