import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const PharmacyPendingApprovalPage: React.FC = () => {
  const { profile } = useAuth();
  
  const status = profile?.role_status || "pending";
  
  const renderStatus = () => {
    switch (status) {
      case "approved":
        return (
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/40 border border-primary-200/60 dark:border-primary-800/50 flex items-center justify-center shadow-sm">
                <CheckCircle className="w-11 h-11 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Profile approved
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Your pharmacy profile has been verified. You can now start managing your products and orders.
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/25 dark:shadow-primary-900/40 transition-all hover:-translate-y-0.5"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        );
      case "rejected":
        return (
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/40 flex items-center justify-center shadow-sm">
                <XCircle className="w-11 h-11 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Profile rejected
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Unfortunately, your pharmacy profile verification was not successful.
            </p>
            {profile?.extra?.rejection_reason && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200/90 dark:border-red-800/60 rounded-xl text-red-800 dark:text-red-300 text-sm text-left">
                <strong>Reason:</strong> {profile.extra.rejection_reason}
              </div>
            )}
            <div className="pt-2">
              <Link
                to="/pharmacy/complete-profile"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/25 dark:shadow-primary-900/40 transition-all hover:-translate-y-0.5"
              >
                Update Profile
              </Link>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-secondary-lighter dark:bg-sky-950/40 border border-sky-200/70 dark:border-sky-800/50 flex items-center justify-center shadow-sm">
                <Clock className="w-11 h-11 text-secondary dark:text-sky-400" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Verification pending
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Your pharmacy profile is currently being reviewed by our administrative team.
              This process typically takes 24-48 hours.
            </p>
            <div className="p-4 bg-secondary-lighter/80 dark:bg-sky-950/25 border border-sky-200/80 dark:border-sky-800/50 rounded-xl text-slate-700 dark:text-slate-200 text-sm flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-secondary" />
              <p>
                You will receive an email notification once your profile status has been updated.
                In the meantime, you can explore other features of EzyMed.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center justify-center text-primary-600 dark:text-secondary font-semibold hover:underline"
              >
                Return to Home
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="relative min-h-full">
        <div
          className="pointer-events-none fixed inset-0 opacity-100 dark:opacity-60 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(5,150,105,0.1)_0%,transparent_50%),radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(14,165,233,0.06)_0%,transparent_45%)] dark:bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(5,150,105,0.18)_0%,transparent_55%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.1)_0%,transparent_40%)]"
          aria-hidden
        />
        <div className="relative z-10 max-w-xl mx-auto py-10 sm:py-14 px-4">
          <div className="mb-8 text-center space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 dark:border-primary-700/60 bg-white/90 dark:bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-800 dark:text-primary-200 backdrop-blur-sm shadow-sm">
              Pharmacy status
            </span>
          </div>
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-700/80 p-8 sm:p-10">
            {renderStatus()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PharmacyPendingApprovalPage;
