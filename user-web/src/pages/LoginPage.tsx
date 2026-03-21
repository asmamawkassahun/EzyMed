import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import AuthShell from "../components/layout/AuthShell";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profile = await login(email, password);
      toast.success("Logged in successfully.");

      if (profile?.role === "doctor" && profile.role_status !== "approved") {
        const hasDoctorSubmission =
          Boolean(profile.extra?.doctor_profile) ||
          Boolean(profile.extra?.completion_submitted_at) ||
          (Array.isArray(profile.extra?.verification_documents) &&
            profile.extra.verification_documents.length > 0);

        navigate(
          hasDoctorSubmission
            ? "/doctor/pending-approval"
            : "/doctor/complete-profile",
        );
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        "Failed to login. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle={
        <>
          Sign in to continue consultations, messages, and care workflows in
          one secure place.
        </>
      }
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl shadow-slate-900/5 dark:shadow-black/40 p-8 sm:p-9 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            No account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950/50 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm outline-none transition"
                placeholder="you@organization.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950/50 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/25 dark:shadow-primary-900/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            <Link
              to="/forgot-password"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </form>
      </div>
    </AuthShell>
  );
};

export default LoginPage;
