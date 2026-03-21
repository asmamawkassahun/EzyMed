import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

const UnauthorizedPage: React.FC = () => {
  return (
    <Layout>
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center border-2 border-red-300 bg-red-50 dark:border-red-800/60 dark:bg-red-950/40">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
          Access denied
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          You need admin privileges to access this panel.
        </p>
        <Link
          to="/login"
          className="mt-10 inline-flex px-10 py-4 text-sm font-bold uppercase tracking-widest bg-primary-600 text-white hover:bg-primary-700 transition-colors"
        >
          Go to login
        </Link>
      </div>
    </Layout>
  );
};

export default UnauthorizedPage;
