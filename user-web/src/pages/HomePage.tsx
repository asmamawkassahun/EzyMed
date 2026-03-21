import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const featureCards = [
    {
      title: "Telehealth consultations",
      description:
        "Book providers, join video or audio, chat in-session—meeting links and session controls included.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      ),
    },
    {
      title: "Drug Finder",
      description:
        "Search by medicine name, compare pharmacy stock, location, availability, and phone—partial search supported.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      ),
    },
    {
      title: "Remote health monitoring",
      description:
        "Log BP, heart rate, temperature, glucose, and weight; providers review trends after consults.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      ),
    },
  ];

  const testimonials = [
    {
      quote:
        "I want one place to talk to my doctor, know where my medicine is in stock, and log how I’m doing between visits.",
      name: "Patient journey",
      role: "User design target",
    },
    {
      quote:
        "Consults, notes, prescriptions, and readings should live in one workflow—not scattered threads.",
      name: "Clinical ops",
      role: "Healthcare provider",
    },
    {
      quote:
        "Stock, availability, and patient questions should stay tied to the same order and Rx context.",
      name: "Fulfillment",
      role: "Pharmacy",
    },
  ];

  const workflowSteps = [
    "Register",
    "Find provider",
    "Book consult",
    "Video / chat",
    "Prescription",
    "Drug Finder",
    "Log readings",
    "Follow-up",
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 opacity-100 dark:opacity-80 bg-[linear-gradient(165deg,rgba(124,58,237,0.07)_0%,transparent_42%),linear-gradient(215deg,rgba(244,63,94,0.05)_0%,transparent_38%)] dark:bg-[linear-gradient(165deg,rgba(124,58,237,0.15)_0%,transparent_45%),linear-gradient(215deg,rgba(244,63,94,0.08)_0%,transparent_40%)]"
        aria-hidden
      />
      <Navbar onMenuClick={() => undefined} />

      <main className="grow pt-16 relative z-10">
        {/* Hero — editorial stack + tags (no illustration column) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-12 bg-primary-600 dark:bg-primary-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary-700 dark:text-primary-300">
                EzyMed
              </span>
            </div>

            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight">
              Telehealth, medicines,
              <span className="block text-primary-600 dark:text-primary-400 mt-1">
                and monitoring—wired together.
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              Connect patients, providers, and pharmacies on one path: consult,
              prescribe, find stock, track vitals, follow up.
            </p>

            <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300 border-l-2 border-secondary pl-4 max-w-xl">
              Reduce gaps between consult, Rx, and pickup.
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {["Telehealth", "Drug Finder", "Health monitoring"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 border-slate-900/15 dark:border-white/20 bg-white/60 dark:bg-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center min-w-[200px] px-8 py-4 text-sm font-bold uppercase tracking-widest bg-slate-900 dark:bg-primary-600 text-white hover:bg-primary-700 dark:hover:bg-primary-500 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center min-w-[200px] px-8 py-4 text-sm font-bold uppercase tracking-widest bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center min-w-[200px] px-8 py-4 text-sm font-bold uppercase tracking-widest border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Bento metrics */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { k: "01", v: "3 services", d: "One product surface" },
              { k: "02", v: "Accessible", d: "Easy to use" },
              { k: "03", v: "Patient First", d: "Patient → Doctor / Pharmacy" },
              { k: "04", v: "Security", d: "Secure sessions" },
            ].map((cell) => (
              <div
                key={cell.k}
                className="border-2 border-slate-900/10 dark:border-white/10 bg-white/70 dark:bg-[#12101c]/90 p-5 sm:p-6 flex flex-col justify-between min-h-[140px] hover:border-primary-500/40 transition-colors"
              >
                <span className="font-mono text-xs text-secondary font-bold">
                  {cell.k}
                </span>
                <div>
                  <p className="font-display text-lg sm:text-xl font-bold">
                    {cell.v}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">
                    {cell.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Full-bleed workflow ticker */}
        <section className="border-y-2 border-slate-900/10 dark:border-white/10 bg-slate-900 text-slate-100 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-300 mb-3">
              Core workflow
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px] sm:text-xs text-slate-300">
              {workflowSteps.map((step, i) => (
                <React.Fragment key={step}>
                  {i > 0 && (
                    <span className="text-secondary hidden sm:inline">→</span>
                  )}
                  <span className="whitespace-nowrap">{step}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Bento features */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 lg:items-stretch">
            <div className="lg:col-span-5 flex flex-col border-2 border-slate-900/10 dark:border-white/10 bg-linear-to-br from-primary-600 to-primary-800 text-white p-8 md:p-10 min-h-[280px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                Why EzyMed
              </p>
              <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold leading-tight">
                Fewer gaps between consult, Rx, and pickup.
              </h2>
              <p className="mt-6 text-sm text-white/85 leading-relaxed flex-1">
                EzyMed ties three problems into one loop: access to doctors,
                finding medicines, and monitoring after treatment.
              </p>
              <div className="mt-8 pt-6 border-t border-white/20 font-mono text-[10px] text-white/60">
                Consultation → Prescription → Drug Finder → Monitoring
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              {featureCards.slice(0, 2).map(({ title, description, icon }) => (
                <article
                  key={title}
                  className="border-2 border-slate-900/10 dark:border-white/10 bg-white dark:bg-[#12101c] p-7 flex flex-col hover:shadow-[6px_6px_0_0_rgba(124,58,237,0.2)] dark:hover:shadow-[6px_6px_0_0_rgba(167,139,250,0.25)] transition-shadow"
                >
                  <div className="w-11 h-11 border-2 border-primary-600/30 flex items-center justify-center mb-6">
                    <svg
                      className="w-5 h-5 text-primary-600 dark:text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {icon}
                    </svg>
                  </div>
                  <h3 className="font-display text-lg font-bold">{title}</h3>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                    {description}
                  </p>
                </article>
              ))}
            </div>

            <article className="lg:col-span-12 border-2 border-slate-900/10 dark:border-white/10 bg-white dark:bg-[#12101c] p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8">
              <div className="w-14 h-14 shrink-0 border-2 border-secondary/40 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {featureCards[2].icon}
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold">
                  {featureCards[2].title}
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                  {featureCards[2].description}
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Roles — horizontal cards */}
        <section className="border-t-2 border-slate-900/10 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <h2 className="font-display text-2xl md:text-3xl font-bold max-w-xl">
              Who the platform is shaped for
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl">
              Four roles in the spec—each with a clear job in the same system.
            </p>
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((item, index) => (
                <article
                  key={item.name}
                  className="relative pl-6 border-l-2 border-primary-600/50"
                >
                  <span className="absolute -left-[5px] top-0 font-display text-4xl font-bold text-primary-600/25 dark:text-primary-400/30 leading-none">
                    {String(index + 1)}
                  </span>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="mt-6 text-xs font-bold uppercase tracking-widest text-secondary">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {item.role}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — outline block */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-32">
          <div className="border-2 border-dashed border-primary-600/50 dark:border-primary-400/40 p-10 md:p-14 text-center bg-white/50 dark:bg-[#12101c]/50">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              {user ? "Continue in your workspace" : "Open an account for the pilot"}
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Same app for every role—registration picks patient, provider, or
              pharmacy; admins operate from their tools.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex px-10 py-4 text-sm font-bold uppercase tracking-widest bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex px-10 py-4 text-sm font-bold uppercase tracking-widest bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex px-10 py-4 text-sm font-bold uppercase tracking-widest border-2 border-slate-900 dark:border-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 bg-primary-950 text-violet-100 border-t-4 border-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-10 w-10 items-center justify-center bg-white text-primary-900 text-xs font-bold">
                  EZ
                </span>
                <span className="font-display text-xl font-bold text-white">
                  EzyMed
                </span>
              </div>
              <p className="text-sm text-violet-200/80 leading-relaxed">
                Telehealth, Drug Finder, and remote monitoring.
              </p>
              <div className="flex gap-2 mt-6">
                {[
                  { key: "mail", label: "Email" },
                  { key: "twitter", label: "Twitter" },
                  { key: "instagram", label: "Instagram" },
                  { key: "linkedin", label: "LinkedIn" },
                ].map(({ key, label }) => (
                  <a
                    key={key}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center border border-violet-400/30 text-violet-200 hover:bg-white/10 transition-colors"
                    aria-label={label}
                  >
                    {key === "mail" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8.5v7A2.5 2.5 0 005.5 18h13a2.5 2.5 0 002.5-2.5v-7"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 8.5L12 13 3 8.5"
                        />
                      </svg>
                    )}
                    {key === "twitter" && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 7v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                      </svg>
                    )}
                    {key === "instagram" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.5 6.5h.01"
                        />
                      </svg>
                    )}
                    {key === "linkedin" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 11v5M8 8v.01M12 16v-4a2 2 0 012-2c1.2 0 2 1 2 2v4"
                        />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-violet-300 mb-4">
                Quick links
              </h4>
              <ul className="space-y-2">
                {["Home", "About", "Services", "Contact", "Blog"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                        className="text-sm text-violet-200/90 hover:text-white transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-violet-300 mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                {[
                  "Help Center",
                  "Community",
                  "Privacy Policy",
                  "Terms of Service",
                  "FAQ",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-violet-200/90 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-violet-300 mb-4">
                Contact
              </h4>
              <ul className="space-y-3 text-sm text-violet-200/85">
                <li className="flex items-start gap-2">
                  <span className="text-secondary shrink-0">●</span>
                  Addis Ababa, Ethiopia
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary shrink-0">●</span>
                  +251 XX XXX XXXX
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary shrink-0">●</span>
                  support@ezymed.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-violet-500/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-violet-300/80">
            <p>© {currentYear} EzyMed. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
