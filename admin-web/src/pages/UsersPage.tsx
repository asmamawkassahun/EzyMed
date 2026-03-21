import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { UsersPageSkeleton } from "../components/common/PageSkeletons";
import Dialog from "../components/common/Dialog";
import ToastBanner from "../components/common/ToastBanner";
import { adminService } from "../services/admin.service";
import { useAdminStore } from "../stores/admin.store";
import { Trash2, Search } from "lucide-react";

const UsersPage: React.FC = () => {
  const users = useAdminStore((state) => state.users);
  const loading = useAdminStore((state) => state.usersLoading);
  const usersLoaded = useAdminStore((state) => state.usersLoaded);
  const fetchUsers = useAdminStore((state) => state.fetchUsers);
  const fetchOverview = useAdminStore((state) => state.fetchOverview);
  const removeUserFromCache = useAdminStore(
    (state) => state.removeUserFromCache,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<{
    id: string;
    fullName: string;
  } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!usersLoaded) {
      fetchUsers();
    }
  }, [usersLoaded, fetchUsers]);

  const handleDeleteUser = async (userId: string) => {
    try {
      setDeleting(userId);
      await adminService.deleteUser(userId);
      removeUserFromCache(userId);
      await fetchOverview(true);
      setDeleteCandidate(null);
      setToast({
        message: "User deleted successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      setToast({
        message: "Failed to delete user",
        variant: "error",
      });
    } finally {
      setDeleting(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <Layout>
        <UsersPageSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto w-full min-w-0 max-w-7xl overflow-x-hidden">
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-br from-primary-600 via-primary-700 to-slate-900 p-6 text-white shadow-lg shadow-primary-900/15 sm:p-8 dark:border-slate-700/50">
          <div
            className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_100%_0%,rgba(56,189,248,0.35),transparent_45%)]"
            aria-hidden
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-100/90">
              Directory
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Users
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/85">
              Search, review, and remove accounts. Changes apply immediately.
            </p>
          </div>
        </div>

        {toast && (
          <ToastBanner
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
            className="mb-4"
          />
        )}

        <div className="mb-6 w-full min-w-0 max-w-full">
          <div className="relative w-full min-w-0 max-w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-w-0 max-w-full rounded-2xl border border-slate-200/90 bg-white py-3.5 pl-12 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-900/70 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <div className="w-full max-w-full overflow-x-auto">
            <table className="w-max min-w-[760px]">
              <thead className="border-b border-slate-200/80 bg-slate-50/90 dark:border-slate-700 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user.full_name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {user.email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full border border-primary-200/90 bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-900 dark:border-primary-700 dark:bg-primary-950 dark:text-primary-100">
                        {user.role === "patient" ? "patient" : user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.role_status === "approved"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : user.role_status === "pending"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                              : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {user.role_status || "active"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteCandidate({
                            id: user.id,
                            fullName: user.full_name,
                          })
                        }
                        disabled={deleting === user.id}
                        className="cursor-pointer text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No users found
            </p>
          </div>
        )}

        <Dialog
          isOpen={!!deleteCandidate}
          onClose={() => !deleting && setDeleteCandidate(null)}
          title="Delete user"
        >
          <div className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              Are you sure you want to delete{" "}
              <strong>{deleteCandidate?.fullName}</strong>?
            </p>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  deleteCandidate && handleDeleteUser(deleteCandidate.id)
                }
                disabled={!!deleting}
                className="flex-1 cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                disabled={!!deleting}
                className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
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

export default UsersPage;
