import React from "react";

type AdminAuthShellProps = {
  children: React.ReactNode;
};

const AdminAuthShell: React.FC<AdminAuthShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface dark:bg-surface-dark transition-colors duration-300">
      <div className="relative lg:w-[min(38%,420px)] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-300/60 dark:border-slate-700/80 bg-slate-900 text-white overflow-hidden min-h-[200px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-10">
        <div
          className="absolute inset-0 bg-linear-to-b from-primary-700 via-primary-900 to-slate-950 opacity-95"
          aria-hidden
        />
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full bg-secondary/30 blur-[80px] auth-ambient-orb"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-accent/25 blur-[70px] auth-ambient-orb-delay"
          aria-hidden
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 font-semibold tracking-tight text-white">
            <span className="flex h-11 w-11 items-center justify-center bg-white/10 border border-white/20 text-sm font-bold tracking-tighter">
              EZ
            </span>
            <span className="font-display text-lg lg:text-xl">EzyMed Admin</span>
          </div>

          <div className="mt-10 lg:mt-16 space-y-4 max-w-xs">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
              Console
            </p>
            <h1 className="font-display text-2xl lg:text-3xl font-bold leading-tight">
              Operations
            </h1>
            <p className="text-sm text-white/75 leading-relaxed">
              Approve providers and pharmacies, manage users, and view
              analytics—authorized administrators only.
            </p>
          </div>
        </div>

        <div className="relative z-10 hidden lg:block space-y-4 text-[11px] text-white/45 uppercase tracking-widest">
          <p className="font-mono text-[10px] tracking-normal normal-case text-white/55 leading-relaxed">
            Users · Provider approvals · Pharmacy approvals · Dashboard
          </p>
          <p>JWT · Role: admin</p>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col min-h-[calc(100vh-200px)] lg:min-h-screen auth-page-grid">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_70%_0%,rgba(124,58,237,0.08)_0%,transparent_55%)] dark:bg-[radial-gradient(ellipse_90%_60%_at_70%_0%,rgba(167,139,250,0.12)_0%,transparent_55%)]"
          aria-hidden
        />

        <header className="relative z-10 flex items-center justify-between px-6 pt-6 lg:px-10 lg:pt-8">
          <span className="lg:hidden inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span className="flex h-8 w-8 items-center justify-center bg-primary-600 text-[10px] font-bold text-white">
              EZ
            </span>
            Admin
          </span>
          <span className="hidden lg:inline text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Secure admin channel
          </span>
          <span className="hidden lg:block w-10" aria-hidden />
        </header>

        <div className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12 pt-4 lg:px-12 lg:pb-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminAuthShell;
