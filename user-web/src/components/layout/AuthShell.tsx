import React from "react";
import { Link } from "react-router-dom";

type AuthShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
};

const AuthShell: React.FC<AuthShellProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-surface dark:bg-surface-dark transition-colors duration-300">
      <aside className="relative hidden lg:flex lg:w-[44%] xl:w-[42%] flex-col justify-between p-10 xl:p-12 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-linear-to-br from-primary-700 via-primary-600 to-slate-900"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(255,255,255,0.25)_0%,transparent_55%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_100%_100%,rgba(56,189,248,0.35)_0%,transparent_45%)]"
          aria-hidden
        />
        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-white/95 hover:text-white transition"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20 text-sm font-bold">
              HB
            </span>
            EzyMed
          </Link>
          <h1 className="mt-14 text-3xl xl:text-4xl font-bold leading-tight tracking-tight max-w-md">
            {title}
          </h1>
          <div className="mt-4 text-base text-white/85 leading-relaxed max-w-sm">
            {subtitle}
          </div>
          <ul className="mt-10 space-y-3 text-sm text-white/80">
            {[
              "Encrypted messaging and video consults",
              "One workspace for patients, clinicians, and pharmacy",
              "Designed for continuity of care",
            ].map((line) => (
              <li key={line} className="flex gap-2 items-start">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-xs text-white/55">
          © {new Date().getFullYear()} EzyMed. Remote care, responsibly
          delivered.
        </p>
      </aside>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md mb-8 lg:hidden text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-semibold text-primary-700 dark:text-primary-300"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/50 text-sm font-bold text-primary-700 dark:text-primary-200">
              HB
            </span>
            EzyMed
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthShell;
