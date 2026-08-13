import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { bookingService } from "../services/booking.service";
import { toast } from "react-toastify";
import { User, Activity, Search, MapPin, Mail, Phone, Calendar } from "lucide-react";

const PatientsListPage: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data = await bookingService.listDoctorPatients();
        setPatients(data);
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Failed to load patients list.");
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Patients</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Directory of patients you've interacted with.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 dark:text-gray-100 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
            <User className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No patients found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or check back after new bookings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                    {patient.avatar_url ? (
                      <img src={patient.avatar_url} alt={patient.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-7 h-7" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">{patient.full_name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{patient.phone || "No phone provided"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{patient.location || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(patient.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/patients/${patient.id}/readings`)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 active:scale-[0.98]"
                >
                  <Activity className="w-4 h-4" />
                  View Health Readings
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PatientsListPage;
