import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import AuthShell from "../components/layout/AuthShell";

const fieldClass =
  "w-full bg-transparent border-0 border-b-2 border-slate-300 dark:border-slate-600 py-3 text-slate-900 dark:text-slate-100 text-[15px] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary-600 dark:focus:border-primary-400 focus:ring-0 outline-none transition-colors";

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
          Sign in to continue consults, messages, Drug Finder, and health
          tracking—one account, role-based access.
        </>
      }
    >
      <div className="animate-auth-card w-full max-w-[420px]">
        <div className="h-1 w-full bg-linear-to-r from-primary-600 via-secondary to-accent mb-0" />
        <div className="border border-slate-300/90 dark:border-slate-600/90 bg-white dark:bg-[#12101c] px-8 py-10 shadow-[8px_8px_0_0_rgba(124,58,237,0.12)] dark:shadow-[8px_8px_0_0_rgba(124,58,237,0.25)]">
          <div className="mb-10">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              New here?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline underline-offset-4"
              >
                Register
              </Link>
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClass}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-sm font-bold uppercase tracking-[0.2em] text-white bg-slate-900 dark:bg-primary-600 hover:bg-primary-700 dark:hover:bg-primary-500 border-2 border-transparent transition-all disabled:opacity-45 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Enter"}
            </button>

            <p className="text-center text-sm">
              <Link
                to="/forgot-password"
                className="text-slate-600 dark:text-slate-400 hover:text-secondary dark:hover:text-secondary-light font-medium underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthShell>
  );
};

export default LoginPage;
