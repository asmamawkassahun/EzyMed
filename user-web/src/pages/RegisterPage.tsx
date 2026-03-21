import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import AuthShell from "../components/layout/AuthShell";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"patient" | "doctor" | "pharmacy">(
    "patient",
  );
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(email, password, fullName, role);
      toast.success("Please check your email to verify your account.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      if (err?.code === "ECONNABORTED") {
        toast.error(
          "Registration request timed out. If you received a confirmation email, verify it and then log in.",
        );
        return;
      }
      toast.error(
        err.response?.data?.error || "Failed to register. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Join EzyMed"
      subtitle={
        <>
          Register as a patient, clinician, or pharmacy to access the tools
          built for your role—same platform, appropriate permissions.
        </>
      }
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl shadow-slate-900/5 dark:shadow-black/40 p-8 sm:p-9 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Create account
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950/50 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm outline-none transition"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                I am registering as
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "patient" | "doctor" | "pharmacy")
                }
                className="block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950/50 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm outline-none transition"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="pharmacy">Pharmacy</option>
              </select>
            </div>

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
                autoComplete="email"
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950/50 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm outline-none transition"
                placeholder="Create a strong password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/25 dark:shadow-primary-900/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </AuthShell>
  );
};

export default RegisterPage;
