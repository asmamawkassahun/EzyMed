import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  FileText,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import Dialog from "../components/common/Dialog";
import ToastBanner from "../components/common/ToastBanner";
import Layout from "../components/layout/Layout";
import { adminService } from "../services/admin.service";
import { ProviderApproval } from "../types";

type ProviderStatus = "pending" | "approved" | "rejected";

const ProviderApprovalsPage: React.FC = () => {
  const [providers, setProviders] = useState<ProviderApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProviderStatus>("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectCandidate, setRejectCandidate] =
    useState<ProviderApproval | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error" | "info";
  } | null>(null);

  const loadProviders = async (
    status: ProviderStatus,
    showRefreshing = false,
  ) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      const response = await adminService.listProviders(status);
      setProviders(response.providers || []);
    } catch (loadError: any) {
      setError(loadError?.response?.data?.error || "Failed to load providers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProviders(statusFilter).catch(() => null);
  }, [statusFilter]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredProviders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return providers;

    return providers.filter((provider) => {
      const requestedRole = provider.extra?.requested_role || provider.role;

      return [
        provider.full_name,
        provider.email,
        provider.role,
        provider.role_status,
        requestedRole,
        provider.phone,
        provider.location,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [providers, searchQuery]);

  const handleApprove = async (provider: ProviderApproval) => {
    try {
      setProcessingId(provider.id);
      await adminService.approveProvider(provider.id);
      setProviders((current) =>
        current.filter((item) => item.id !== provider.id),
      );
      setToast({
        message: `${provider.full_name} was approved successfully.`,
        variant: "success",
      });
    } catch (approveError: any) {
      setToast({
        message:
          approveError?.response?.data?.error || "Failed to approve provider",
        variant: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectCandidate || !rejectReason.trim()) return;

    try {
      setProcessingId(rejectCandidate.id);
      await adminService.rejectProvider(
        rejectCandidate.id,
        rejectReason.trim(),
      );
      setProviders((current) =>
        current.filter((item) => item.id !== rejectCandidate.id),
      );
      setToast({
        message: `${rejectCandidate.full_name} was rejected.`,
        variant: "success",
      });
      setRejectCandidate(null);
      setRejectReason("");
    } catch (rejectError: any) {
      setToast({
        message:
          rejectError?.response?.data?.error || "Failed to reject provider",
        variant: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-br from-primary-600 via-primary-700 to-slate-900 p-6 text-white shadow-lg shadow-primary-900/15 sm:p-8 dark:border-slate-700/50">
          <div
            className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_100%_0%,rgba(244,63,94,0.35),transparent_45%)]"
            aria-hidden
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-100/90">
                Approvals
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Provider applications
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/85">
                Review doctor and provider submissions, documents, and status.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search providers"
                  className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/60 backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as ProviderStatus)
                }
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="pending" className="text-slate-900">
                  Pending
                </option>
                <option value="approved" className="text-slate-900">
                  Approved
                </option>
                <option value="rejected" className="text-slate-900">
                  Rejected
                </option>
              </select>

              <button
                type="button"
                onClick={() => loadProviders(statusFilter, true)}
                disabled={loading || refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary-800 shadow-md transition hover:bg-primary-50 disabled:opacity-60"
              >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            </div>
          </div>
        </div>

        {toast && (
          <ToastBanner
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        )}

        {error && !toast && <ToastBanner message={error} variant="error" />}

        {loading ? (
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            Loading providers...
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-10 text-center dark:border-slate-600 dark:bg-slate-900/50">
            <FileText className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-slate-500" />
            <p className="text-slate-700 dark:text-slate-300">
              No providers found for this filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredProviders.map((provider) => {
              const requestedRole =
                provider.extra?.requested_role || provider.role;
              const documents = Array.isArray(
                provider.extra?.verification_documents,
              )
                ? provider.extra.verification_documents
                : Array.isArray(provider.extra?.documents)
                  ? provider.extra.documents
                  : [];

              return (
                <div
                  key={provider.id}
                  className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {provider.full_name}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {provider.email}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-primary-200/90 bg-primary-100 px-3 py-1 font-medium text-primary-900 dark:border-primary-700 dark:bg-primary-950 dark:text-primary-100">
                          Requested: {requestedRole}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                          Current role: {provider.role}
                        </span>
                        <span className="rounded-full bg-yellow-100 px-3 py-1 font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                          Status: {provider.role_status || statusFilter}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                        <p>Phone: {provider.phone || "-"}</p>
                        <p>Location: {provider.location || "-"}</p>
                        <p>
                          Submitted:{" "}
                          {new Date(
                            provider.updated_at || provider.created_at,
                          ).toLocaleString()}
                        </p>
                        <p>ID: {provider.id}</p>
                      </div>

                      {provider.bio && (
                        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                          {provider.bio}
                        </div>
                      )}

                      <div>
                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          Submitted Documents
                        </p>
                        {documents.length === 0 ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            No documents attached.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {documents.map((documentUrl, index) => (
                              <a
                                key={`${provider.id}-${index}`}
                                href={documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-900 hover:bg-primary-200 dark:bg-primary-950/40 dark:text-primary-200 dark:hover:bg-primary-950/60"
                              >
                                Document {index + 1}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      {provider.extra?.rejection_reason && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                          Rejection reason: {provider.extra.rejection_reason}
                        </div>
                      )}
                    </div>

                    {statusFilter === "pending" && (
                      <div className="flex shrink-0 flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleApprove(provider)}
                          disabled={processingId === provider.id}
                          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectCandidate(provider)}
                          disabled={processingId === provider.id}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-60"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog
          isOpen={!!rejectCandidate}
          onClose={() => {
            if (!processingId) {
              setRejectCandidate(null);
              setRejectReason("");
            }
          }}
          title="Reject Provider Request"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Add a rejection reason for{" "}
              <span className="font-medium">{rejectCandidate?.full_name}</span>.
            </p>
            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReject}
                disabled={
                  !rejectReason.trim() || processingId === rejectCandidate?.id
                }
                className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-60"
              >
                {processingId === rejectCandidate?.id
                  ? "Rejecting..."
                  : "Reject provider"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRejectCandidate(null);
                  setRejectReason("");
                }}
                disabled={processingId === rejectCandidate?.id}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ProviderApprovalsPage;
