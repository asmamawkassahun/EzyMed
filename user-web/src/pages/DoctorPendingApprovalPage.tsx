import React, { useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Hourglass, Sparkles } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/auth.service";
import { doctorProfileService } from "../services/doctor-profile.service";
import { DoctorProfile } from "../types";

const statusTone = (status?: string) => {
  switch (status) {
    case "approved":
      return "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200";
    case "rejected":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-primary-100 text-primary-900 dark:bg-primary-950/40 dark:text-primary-200";
  }
};

const DoctorPendingApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, refreshProfile, logout } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  const doctorVerificationStatus =
    doctorProfile?.verification_status || profile?.role_status || "pending";

  const profileStatus = profile?.role_status || "pending";

  const justSubmitted = Boolean((location.state as any)?.justSubmitted);

  const effectiveProfileStatus = justSubmitted ? "pending" : profileStatus;
  const effectiveVerificationStatus = justSubmitted
    ? "pending"
    : doctorVerificationStatus;

  const isApproved = useMemo(
    () =>
      effectiveProfileStatus === "approved" ||
      effectiveVerificationStatus === "approved",
    [effectiveProfileStatus, effectiveVerificationStatus],
  );

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
      const refreshedProfile = await authService.getProfile();
      const data = await doctorProfileService.getMyDoctorProfile();
      setDoctorProfile(data);

      if (
        data?.verification_status === "approved" ||
        refreshedProfile?.role_status === "approved"
      ) {
        toast.success("Approval confirmed. Redirecting to dashboard.");
        navigate("/dashboard", { replace: true });
      } else {
        toast.info("Your account is still pending review.");
      }
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        toast.error("Unable to refresh doctor approval status.");
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Signed out successfully.");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  if (isApproved) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="relative min-h-full">
        <div
          className="pointer-events-none fixed inset-0 opacity-100 dark:opacity-60 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(5,150,105,0.1)_0%,transparent_50%),radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(14,165,233,0.06)_0%,transparent_45%)] dark:bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(5,150,105,0.18)_0%,transparent_55%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.1)_0%,transparent_40%)]"
          aria-hidden
        />
        <div className="relative z-10 max-w-3xl mx-auto space-y-8 pb-8">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-linear-to-br from-primary-50 via-white to-secondary-lighter dark:from-primary-950/35 dark:via-slate-900 dark:to-slate-900 p-8 sm:p-10 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col items-center text-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/90 dark:bg-slate-800/80 border border-primary-200/60 dark:border-primary-800/50 shadow-md flex items-center justify-center">
              <Hourglass className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 dark:border-primary-700/60 bg-white/90 dark:bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-800 dark:text-primary-200">
              Awaiting verification
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your application is{" "}
              <span className="bg-linear-to-r from-primary-600 to-secondary bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary">
                under review
              </span>
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Your doctor profile has been submitted successfully. Our team is
              currently verifying your credentials and uploaded documents.
              Approval usually happens quickly, and you can check your status
              anytime from this page.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/80 shadow-sm">
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              We will activate your doctor dashboard once verified.
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Account status:
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusTone(effectiveProfileStatus)}`}
            >
              {effectiveProfileStatus}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Verification status:
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusTone(effectiveVerificationStatus)}`}
            >
              {effectiveVerificationStatus}
            </span>
          </div>

          {effectiveProfileStatus === "rejected" && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Your profile review is rejected. Please update your profile and
              contact support.
            </p>
          )}

          <div className="rounded-xl border border-dashed border-primary-200/80 dark:border-primary-800/50 bg-primary-50/50 dark:bg-primary-950/20 p-4 text-sm text-slate-700 dark:text-slate-300">
            Status checks are manual. Click <strong className="text-primary-800 dark:text-primary-200">Check Status</strong> when
            you want to refresh approval.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleRefreshStatus}
              disabled={refreshing}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-600/25 dark:shadow-primary-900/40 transition-all disabled:opacity-60"
            >
              {refreshing ? "Checking..." : "Check Status"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/doctor/complete-profile")}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-200/90 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-semibold transition-colors"
            >
              Edit Doctor Profile
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorPendingApprovalPage;
