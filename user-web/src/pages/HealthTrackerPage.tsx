import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { healthService, HealthReading, ReadingType } from "../services/health.service";
import { toast } from "react-toastify";
import { Activity, Heart, Thermometer, Scale, Droplets, Plus, Clock } from "lucide-react";

const readingTypeInfo: Record<ReadingType, { label: string; icon: any; unit: string; color: string }> = {
  blood_pressure: { label: "Blood Pressure", icon: Activity, unit: "mmHg", color: "text-red-500" },
  heart_rate: { label: "Heart Rate", icon: Heart, unit: "bpm", color: "text-pink-500" },
  blood_sugar: { label: "Blood Sugar", icon: Droplets, unit: "mg/dL", color: "text-blue-500" },
  weight: { label: "Weight", icon: Scale, unit: "kg", color: "text-orange-500" },
  temperature: { label: "Temperature", icon: Thermometer, unit: "°C", color: "text-yellow-500" },
};

const HealthTrackerPage: React.FC = () => {
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    reading_type: "blood_pressure" as ReadingType,
    value: "",
    notes: "",
    recorded_at: new Date().toISOString().slice(0, 16),
  });

  const loadReadings = async () => {
    try {
      const data = await healthService.getMyReadings();
      setReadings(data);
    } catch (error) {
      toast.error("Failed to load health readings.");
    }
  };

  useEffect(() => {
    loadReadings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await healthService.addReading({
        reading_type: formData.reading_type,
        value: formData.value,
        unit: readingTypeInfo[formData.reading_type].unit,
        notes: formData.notes,
        recorded_at: new Date(formData.recorded_at).toISOString(),
      });
      toast.success("Reading added successfully!");
      setShowAddModal(false);
      setFormData({
        reading_type: "blood_pressure",
        value: "",
        notes: "",
        recorded_at: new Date().toISOString().slice(0, 16),
      });
      loadReadings();
    } catch (error) {
      toast.error("Failed to add reading.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Health Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your vital signs and health metrics.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" /> Add Reading
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(Object.keys(readingTypeInfo) as ReadingType[]).map((type) => {
            const latest = readings.find(r => r.reading_type === type);
            const Info = readingTypeInfo[type];
            return (
              <div key={type} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center">
                <div className={`p-2 rounded-full bg-gray-50 dark:bg-gray-800 ${Info.color} mb-2`}>
                  <Info.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{Info.label}</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {latest ? `${latest.value} ${latest.unit}` : "No data"}
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

        {/* Readings History */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Metric</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {readings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No readings recorded yet.
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

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-800">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Reading</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Metric Type</label>
                  <select
                    value={formData.reading_type}
                    onChange={(e) => setFormData({ ...formData, reading_type: e.target.value as ReadingType })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white outline-none ring-primary/20 focus:ring-4 focus:border-primary"
                  >
                    {(Object.keys(readingTypeInfo) as ReadingType[]).map((type) => (
                      <option key={type} value={type}>{readingTypeInfo[type].label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Value ({readingTypeInfo[formData.reading_type].unit})
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.reading_type === "blood_pressure" ? "e.g. 120/80" : "e.g. 72"}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white outline-none ring-primary/20 focus:ring-4 focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.recorded_at}
                    onChange={(e) => setFormData({ ...formData, recorded_at: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white outline-none ring-primary/20 focus:ring-4 focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white outline-none ring-primary/20 focus:ring-4 focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 mt-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Reading"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HealthTrackerPage;
