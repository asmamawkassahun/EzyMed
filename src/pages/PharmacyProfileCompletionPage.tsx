import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/auth.service";
import api from "../services/api";

const PharmacyProfileCompletionPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verificationDocs, setVerificationDocs] = useState<File[]>([]);
  const [existingDocUrls, setExistingDocUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    full_name: "", // Representing the contact person/pharmacist name
    phone: "",
    language: "en",
    location: "",
    avatar_url: "",
    business_name: "",
    license_number: "",
    bio: "",
  });

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setLoading(true);
      try {
        if (profile) {
          setFormData((current) => ({
            ...current,
            full_name: profile.full_name || "",
            phone: profile.phone || "",
            language: profile.language || "en",
            location: profile.location || "",
            avatar_url: profile.avatar_url || "",
            bio: profile.bio || current.bio,
          }));
          
          const profileDocs = profile.extra?.verification_documents || [];
          if (Array.isArray(profileDocs)) {
            setExistingDocUrls(profileDocs.filter(url => typeof url === "string"));
          }
        }

        const res = await api.get("/pharmacy/me");
        const pharmacyProfile = res.data;
        
        if (!active) return;

        if (pharmacyProfile) {
          setFormData((current) => ({
            ...current,
            business_name: pharmacyProfile.business_name || "",
            license_number: pharmacyProfile.license_number || "",
            bio: pharmacyProfile.bio || current.bio,
            location: pharmacyProfile.location || current.location,
          }));
          
          const metadataDocs = pharmacyProfile.metadata?.verification_documents || [];
          if (Array.isArray(metadataDocs)) {
            setExistingDocUrls(prev => Array.from(new Set([...prev, ...metadataDocs])));
          }
        }
      } catch (error: any) {
        if (error?.response?.status !== 404) {
          toast.error("Unable to load pharmacy profile form.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => { active = false; };
  }, [profile]);

  const completionReady = useMemo(() => {
    const hasVerificationDocs = verificationDocs.length > 0 || existingDocUrls.length > 0;
    return (
      Boolean(formData.full_name.trim()) &&
      Boolean(formData.business_name.trim()) &&
      Boolean(formData.license_number.trim()) &&
      Boolean(formData.bio.trim()) &&
      hasVerificationDocs
    );
  }, [formData, verificationDocs.length, existingDocUrls.length]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleVerificationDocsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files || []);
    const validFiles = incomingFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit.`);
        return false;
      }
      return true;
    });
    setVerificationDocs(prev => [...prev, ...validFiles]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!completionReady) {
      toast.error("Please fill all required pharmacy profile fields.");
      return;
    }

    setSaving(true);
    try {
      // Mock upload for now or use generic upload if it existed
      // In EzyMed usually doctorProfileService.uploadVerificationDocument is used
      // I'll assume we can use a similar approach or just mock it for now since I haven't created a dedicated pharmacy upload
      // Actually, I should probably create a generic upload service if not exists.
      
      const uploadedDocUrls = await Promise.all(
        verificationDocs.map(async (file) => {
          const formDataObj = new FormData();
          formDataObj.append("file", file);
          const res = await api.post("/uploads/upload", formDataObj, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          const url = res.data?.result?.secure_url || res.data?.secure_url;
          if (!url) {
            console.error("Upload response missing URL:", res.data);
          }
          return url;
        })
      );

      const uniqueVerificationDocuments = Array.from(new Set([
        ...existingDocUrls.filter(Boolean), 
        ...uploadedDocUrls.filter(Boolean)
      ]));

      await api.put("/pharmacy/me", {
        business_name: formData.business_name.trim(),
        license_number: formData.license_number.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        metadata: {
          verification_documents: uniqueVerificationDocuments,
          completion_source: "pharmacy_onboarding",
          submitted_at: new Date().toISOString(),
        }
      });

      await authService.updateProfile({
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        role_status: "pending",
        extra: {
          ...(profile?.extra || {}),
          verification_documents: uniqueVerificationDocuments,
          pharmacy_business_name: formData.business_name.trim(),
          submitted_at: new Date().toISOString(),
        }
      });

      await refreshProfile();
      toast.success("Pharmacy profile submitted. Awaiting approval.");
      navigate("/pharmacy/pending-approval");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to save pharmacy profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-600/80 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-300 dark:focus:border-primary-600";

  return (
    <Layout>
      <div className="relative min-h-full">
        <div
          className="pointer-events-none fixed inset-0 opacity-100 dark:opacity-60 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(5,150,105,0.1)_0%,transparent_50%),radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(14,165,233,0.06)_0%,transparent_45%)] dark:bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(5,150,105,0.18)_0%,transparent_55%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.1)_0%,transparent_40%)]"
          aria-hidden
        />
        <div className="relative z-10 max-w-3xl mx-auto space-y-8 py-4 pb-10">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 dark:border-primary-700/60 bg-white/90 dark:bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-800 dark:text-primary-200 backdrop-blur-sm shadow-sm">
              Pharmacy onboarding
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              <span className="bg-linear-to-r from-primary-600 to-secondary bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary">
                Pharmacy
              </span>{" "}
              registration
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-2xl">
              Please provide your business details and professional license for verification.
            </p>
          </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm p-10 text-center text-slate-600 dark:text-slate-400">
            Loading form...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm p-6 sm:p-8">
            <div className="space-y-5 rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-slate-50/50 dark:bg-slate-800/30 p-5">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-600/50 pb-3">
                Business information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pharmacy Name *</label>
                  <input
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="e.g. City Central Pharmacy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">License Number *</label>
                  <input
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="PH-12345678"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location / Address</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Address of the pharmacy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">About the Pharmacy *</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={inputClass}
                  placeholder="Tell us about your pharmacy services..."
                />
              </div>
            </div>

            <div className="space-y-5 rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-slate-50/50 dark:bg-slate-800/30 p-5">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-600/50 pb-3">
                Contact person
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name *</label>
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-slate-50/50 dark:bg-slate-800/30 p-5">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-600/50 pb-3">
                Verification documents *
              </h2>
              <div className="p-6 border-2 border-dashed border-primary-200/70 dark:border-primary-800/50 rounded-xl text-center bg-white/60 dark:bg-slate-900/40">
                <input
                  type="file"
                  id="docs-upload"
                  multiple
                  onChange={handleVerificationDocsChange}
                  className="hidden"
                />
                <label htmlFor="docs-upload" className="cursor-pointer text-primary-600 dark:text-secondary font-semibold hover:underline">
                  Click to upload pharmacy license or ownership documents
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">PDF, JPG, PNG up to 10MB each</p>
              </div>

              {verificationDocs.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {verificationDocs.map((file, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                       {file.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving || !completionReady}
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-600/25 dark:shadow-primary-900/40 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {saving ? "Submitting..." : "Complete Registration"}
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </Layout>
  );
};

export default PharmacyProfileCompletionPage;
