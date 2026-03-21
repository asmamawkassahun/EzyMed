import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { healthService, HealthReading, ReadingType } from "../services/health.service";
import { toast } from "react-toastify";
import { Activity, Heart, Thermometer, Scale, Droplets, Clock, ChevronLeft, User } from "lucide-react";

const readingTypeInfo: Record<ReadingType, { label: string; icon: any; unit: string; color: string }> = {
  blood_pressure: { label: "Blood Pressure", icon: Activity, unit: "mmHg", color: "text-red-500" },
  heart_rate: { label: "Heart Rate", icon: Heart, unit: "bpm", color: "text-pink-500" },
  blood_sugar: { label: "Blood Sugar", icon: Droplets, unit: "mg/dL", color: "text-blue-500" },
  weight: { label: "Weight", icon: Scale, unit: "kg", color: "text-orange-500" },
  temperature: { label: "Temperature", icon: Thermometer, unit: "°C", color: "text-yellow-500" },
};

const PatientReadingsPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReadings = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        const data = await healthService.getPatientReadings(patientId);
        setReadings(data);
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Failed to load patient health readings.");
      } finally {
        setLoading(false);
      }
    };

    loadReadings();
  }, [patientId]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/doctor/bookings" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Health Readings</h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Reviewing vitals for Patient #{patientId?.slice(0, 8)}</p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading readings...</div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(Object.keys(readingTypeInfo) as ReadingType[]).map((type) => {
                const typeReadings = readings.filter(r => r.reading_type === type);
                const latest = typeReadings[0];
                const Info = readingTypeInfo[type];
                
                return (
                  <div key={type} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center">
                    <div className={`p-2 rounded-full bg-gray-50 dark:bg-gray-800 ${Info.color} mb-2`}>
                      <Info.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{Info.label}</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                      {latest ? `${latest.value} ${latest.unit}` : "N/A"}
                    </span>
                    {latest && (
                      <span className="text-[10px] text-gray-400 mt-1">
                         {new Date(latest.recorded_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Readings History Table */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Timeline of Readings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Metric</th>
                      <th className="px-6 py-4">Value</th>
                      <th className="px-6 py-4">Recorded At</th>
                      <th className="px-6 py-4">Patient Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {readings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No health data found for this patient.
                        </td>
                      </tr>
                    ) : (
                      readings.map((reading) => {
                        const Info = readingTypeInfo[reading.reading_type];
                        return (
                          <tr key={reading.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${Info.color}`}>
                                  <Info.icon className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{Info.label}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-gray-900 dark:text-white">
                                {reading.value} <span className="text-gray-400 font-normal text-xs">{reading.unit}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(reading.recorded_at).toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm max-w-xs truncate">
                              {reading.notes || "-"}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default PatientReadingsPage;
