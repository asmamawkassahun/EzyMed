import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

const UnauthorizedPage: React.FC = () => {
  return (
    <Layout>
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30">
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Access denied
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          You need admin privileges to access this panel.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition hover:bg-primary-700"
        >
          Go to login
        </Link>
      </div>
    </Layout>
  );
};

export default UnauthorizedPage;
