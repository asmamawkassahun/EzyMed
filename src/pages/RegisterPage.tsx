import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import AuthShell from "../components/layout/AuthShell";

const fieldClass =
  "w-full bg-transparent border-0 border-b-2 border-slate-300 dark:border-slate-600 py-3 text-slate-900 dark:text-slate-100 text-[15px] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary-600 dark:focus:border-primary-400 focus:ring-0 outline-none transition-colors";

const selectClass =
  "w-full bg-white dark:bg-[#12101c] border-2 border-slate-300 dark:border-slate-600 py-3 px-3 text-slate-900 dark:text-slate-100 text-sm focus:border-primary-600 dark:focus:border-primary-400 focus:ring-0 outline-none transition-colors cursor-pointer";

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
          Patients, providers, and pharmacies share one responsive app—pick your
          role at signup; permissions follow automatically.
        </>
      }
    >
      <div className="animate-auth-card w-full max-w-[420px]">
        <div className="h-1 w-full bg-linear-to-r from-secondary via-primary-600 to-accent mb-0" />
        <div className="border border-slate-300/90 dark:border-slate-600/90 bg-white dark:bg-[#12101c] px-8 py-10 shadow-[8px_8px_0_0_rgba(244,63,94,0.15)] dark:shadow-[8px_8px_0_0_rgba(244,63,94,0.2)]">
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Register
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-7" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={fieldClass}
                  placeholder="Full legal name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "patient" | "doctor" | "pharmacy")
                  }
                  className={selectClass}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Healthcare provider</option>
                  <option value="pharmacy">Pharmacy</option>
                </select>
              </div>

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
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                  placeholder="you@example.com"
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClass}
                  placeholder="Strong password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-sm font-bold uppercase tracking-[0.2em] text-white bg-primary-600 hover:bg-primary-700 border-2 border-transparent transition-all disabled:opacity-45 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting…" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </AuthShell>
  );
};

export default RegisterPage;
