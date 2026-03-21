import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const featureCards = [
    {
      title: "Unified care journey",
      description:
        "Patients stay oriented with clear next steps, messaging, and health tracking in one calm interface.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      ),
    },
    {
      title: "Secure real-time consults",
      description:
        "Chat and video built for clinical workflows—fast handoffs, fewer missed touchpoints, less friction.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      ),
    },
    {
      title: "Operations that scale",
      description:
        "Doctors and pharmacy teams get structured bookings, orders, and visibility without spreadsheet chaos.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      ),
    },
  ];

  const testimonials = [
    {
      quote:
        "Response times and clarity improved immediately—we finally have one thread for questions and follow-up.",
      name: "Nadia M.",
      role: "Patient",
    },
    {
      quote:
        "I see updates and bookings in context. Less admin, more time with patients.",
      name: "Dr. T. Mensah",
      role: "Clinician",
    },
    {
      quote:
        "Our team coordinates fulfillment and patient questions without losing the trail.",
      name: "Lina K.",
      role: "Pharmacy lead",
    },
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300 flex flex-col relative overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 opacity-100 dark:opacity-60 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(5,150,105,0.12)_0%,transparent_50%),radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(14,165,233,0.08)_0%,transparent_45%)] dark:bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(5,150,105,0.2)_0%,transparent_55%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.12)_0%,transparent_40%)]"
        aria-hidden
      />
      <Navbar onMenuClick={() => undefined} />

      <main className="grow pt-16 relative z-10">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 min-h-[calc(100vh-8rem)] flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="stagger-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 dark:border-primary-700/60 bg-white/90 dark:bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-800 dark:text-primary-200 backdrop-blur-sm shadow-sm">
                Clinical-grade telehealth
              </span>

              <h1 className="mt-6 text-4xl sm:text-5xl xl:text-[3.25rem] font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                Care that bridges
                <span className="block mt-1 bg-linear-to-r from-primary-600 to-secondary bg-clip-text text-transparent dark:from-primary-400 dark:to-secondary">
                  patients, clinicians & pharmacy
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                EzyMed is a single workspace for remote consultations,
                secure messaging, and coordinated follow-up—designed for trust,
                speed, and continuity.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-7 py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-primary-600/25 dark:shadow-primary-900/50 transition-all hover:-translate-y-0.5"
                  >
                    Open dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-7 py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-primary-600/25 dark:shadow-primary-900/50 transition-all hover:-translate-y-0.5"
                    >
                      Start free
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center bg-white/95 dark:bg-slate-800/90 text-primary-800 dark:text-primary-200 border border-slate-200 dark:border-slate-600 px-7 py-3.5 rounded-xl text-base font-semibold hover:border-primary-300 dark:hover:border-primary-600 transition-all hover:-translate-y-0.5"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: "3K+", label: "People on the platform" },
                  { value: "98%", label: "Satisfaction (rolling)" },
                  { value: "24/7", label: "Always-on access" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md px-4 py-4 shadow-sm"
                  >
                    <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                      {item.value}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="relative isolate min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]"
              aria-hidden
            >
              <div className="absolute -inset-6 rounded-[2.5rem] bg-linear-to-br from-primary-500/20 via-secondary/15 to-transparent dark:from-primary-500/25 dark:via-secondary/20 blur-3xl opacity-80" />

              <div className="relative z-10 h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] rounded-3xl overflow-hidden ring-1 ring-slate-200/90 dark:ring-slate-700/90 shadow-2xl shadow-slate-900/10 dark:shadow-black/50">
                <div className="absolute inset-0 hero-mesh" />
                <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/50" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,420px)] aspect-square">
                  <div className="absolute inset-0 rounded-full border border-primary-400/25 dark:border-primary-500/30 animate-hero-orbit" />
                  <div className="absolute inset-4 rounded-full border border-dashed border-secondary/35 dark:border-secondary/25 animate-hero-orbit-reverse" />
                  <div className="absolute inset-[18%] rounded-full border border-primary-500/20 dark:border-primary-400/20" />
                  <span className="hero-pulse-ring absolute inset-[22%] rounded-full border-2 border-primary-400/50" />
                  <span className="hero-pulse-ring-delay absolute inset-[22%] rounded-full border-2 border-secondary/40" />
                </div>

                <div className="absolute w-40 h-40 -top-4 -right-2 rounded-full bg-secondary/30 dark:bg-secondary/20 blur-3xl animate-soft-float" />
                <div className="absolute w-48 h-48 bottom-0 left-0 rounded-full bg-primary-400/25 dark:bg-primary-600/20 blur-3xl animate-hero-float-alt" />

                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="hero-connect-path"
                    d="M 72 200 Q 200 120 200 200 Q 200 280 328 200"
                    stroke="url(#heroGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient
                      id="heroGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="rgb(5, 150, 105)" />
                      <stop offset="100%" stopColor="rgb(14, 165, 233)" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute left-[10%] top-[42%] flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 dark:bg-slate-800/95 shadow-lg ring-1 ring-slate-200/80 dark:ring-slate-600 animate-soft-float">
                  <svg
                    className="h-7 w-7 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-xl shadow-primary-900/30 animate-pulse-slow">
                  <span className="text-xs font-bold tracking-wider">HB</span>
                </div>
                <div className="absolute right-[10%] top-[42%] flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 dark:bg-slate-800/95 shadow-lg ring-1 ring-slate-200/80 dark:ring-slate-600 animate-badge-bounce-delay">
                  <svg
                    className="h-7 w-7 text-sky-500 dark:text-sky-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  <div className="absolute inset-y-0 w-1/3 bg-linear-to-r from-white/0 via-white/40 to-white/0 dark:from-transparent dark:via-white/5 dark:to-transparent hero-shimmer opacity-60 dark:opacity-100" />
                </div>

                <div className="absolute z-20 top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto rounded-2xl bg-white/85 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-600 px-4 py-2.5 text-sm font-semibold text-primary-800 dark:text-primary-200 shadow-lg backdrop-blur-md animate-badge-bounce">
                  Live across 12+ regions
                </div>
                <div className="absolute z-20 bottom-4 right-4 rounded-2xl bg-white/90 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-600 px-4 py-3 shadow-xl backdrop-blur-md">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Session quality
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                    4.9 / 5.0
                  </div>
                </div>
                <div className="absolute z-20 bottom-4 left-4 max-w-[200px] rounded-2xl bg-slate-900/85 dark:bg-white/10 px-4 py-3 text-white dark:text-slate-100 backdrop-blur-md border border-white/10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary-300">
                    Privacy-first
                  </p>
                  <p className="text-xs font-medium mt-1 leading-snug opacity-95">
                    Video, chat & records—one workspace
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="border-y border-slate-200/70 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 md:mb-14">
              <div className="max-w-2xl">
                <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest">
                  Platform
                </p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Everything your care team needs to stay aligned
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 max-w-md text-base leading-relaxed lg:text-right">
                Fewer handoffs, clearer accountability, and a experience that
                feels intentional—not like generic chat software.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {featureCards.map(({ title, description, icon }, i) => (
                <div
                  key={title}
                  className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 p-8 shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="absolute left-0 top-8 bottom-8 w-1 rounded-r-full bg-linear-to-b from-primary-500 to-secondary opacity-90"
                    aria-hidden
                  />
                  <div className="pl-5">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform ring-1 ring-primary-100/80 dark:ring-primary-800/50">
                      <svg
                        className="w-6 h-6 text-primary-600 dark:text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {icon}
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-white shadow-2xl">
            <div className="px-8 sm:px-10 lg:px-14 py-10 lg:py-12 bg-linear-to-br from-slate-900 via-slate-900 to-primary-950">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div>
                  <p className="text-primary-300 font-semibold text-sm uppercase tracking-widest">
                    Proof
                  </p>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold max-w-xl leading-tight">
                    Teams adopt EzyMed because it respects how care
                    actually works
                  </h2>
                </div>
                <p className="text-slate-400 max-w-md text-base leading-relaxed">
                  From first contact to follow-up, people stay in sync—without
                  sacrificing compliance or clarity.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
                {testimonials.map((item, index) => (
                  <article
                    key={item.name}
                    className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm animate-rise-in hover:bg-white/[0.07] transition-colors"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <p className="text-slate-200 leading-relaxed text-[0.95rem]">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <p className="mt-6 font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-primary-300">{item.role}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary-200/60 dark:border-primary-800/40">
            <div
              className="absolute inset-0 bg-linear-to-br from-primary-600 via-primary-700 to-slate-900"
              aria-hidden
            />
            <div
              className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_45%)]"
              aria-hidden
            />
            <div className="relative px-8 sm:px-10 lg:px-14 py-12 lg:py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Ready to run a tighter, kinder front door to care?
                </h2>
                <p className="mt-3 text-primary-100/90 text-base leading-relaxed">
                  Onboard your organization in minutes. Keep every role in the
                  same secure loop—patients included.
                </p>
              </div>
              {user ? (
                <Link
                  to="/dashboard"
                  className="shrink-0 inline-flex items-center justify-center bg-white text-primary-800 hover:bg-primary-50 px-8 py-3.5 rounded-xl text-base font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Go to dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="shrink-0 inline-flex items-center justify-center bg-white text-primary-800 hover:bg-primary-50 px-8 py-3.5 rounded-xl text-base font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Create an account
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md text-slate-800 dark:text-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-bold shadow-md shadow-primary-900/20">
                  HB
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  EzyMed
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-sm">
                Remote consultations, pharmacy coordination, and patient
                engagement—built for teams who take duty of care seriously.
              </p>
              <div className="flex gap-3">
                {[
                  { key: "mail", label: "Email" },
                  { key: "twitter", label: "Twitter" },
                  { key: "instagram", label: "Instagram" },
                  { key: "linkedin", label: "LinkedIn" },
                ].map(({ key, label }) => (
                  <a
                    key={key}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
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
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Quick links
              </h4>
              <ul className="space-y-2.5">
                {["Home", "About", "Services", "Contact", "Blog"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                        className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Resources
              </h4>
              <ul className="space-y-2.5">
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
                      className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Contact
              </h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  123 Healthcare St, Medical City
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  +1 (555) 123-4567
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  support@healthbridge.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 dark:text-slate-500 text-sm text-center md:text-left">
              © {currentYear} EzyMed. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
