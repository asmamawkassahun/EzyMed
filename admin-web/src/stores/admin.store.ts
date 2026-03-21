import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { adminService } from "../services/admin.service";
import { OverviewStats, Profile } from "../types";

interface AdminStoreState {
  overview: OverviewStats | null;
  overviewLoaded: boolean;
  overviewLoading: boolean;
  overviewError: string;

  users: Profile[];
  usersLoaded: boolean;
  usersLoading: boolean;
  usersError: string;

  fetchUsers: (force?: boolean) => Promise<void>;
  removeUserFromCache: (userId: string) => void;
  invalidateOverview: () => void;
  clearAdminCache: () => void;

  fetchOverview: (force?: boolean) => Promise<void>;
}

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set, get) => ({
      overview: null,
      overviewLoaded: false,
      overviewLoading: false,
      overviewError: "",

      users: [],
      usersLoaded: false,
      usersLoading: false,
      usersError: "",

      fetchOverview: async (force = false) => {
        const { overviewLoaded, overviewLoading } = get();

        if (!force && (overviewLoaded || overviewLoading)) {
          return;
        }

        set({ overviewLoading: true, overviewError: "" });

        try {
          const data = await adminService.getOverview();
          set({
            overview: data || null,
            overviewLoaded: true,
            overviewLoading: false,
            overviewError: "",
          });
        } catch (error: any) {
          set({
            overviewLoading: false,
            overviewError:
              error?.response?.data?.error || "Failed to load overview",
          });
        }
      },

      fetchUsers: async (force = false) => {
        const { usersLoaded, usersLoading } = get();

        if (!force && (usersLoaded || usersLoading)) {
          return;
        }

        set({ usersLoading: true, usersError: "" });

        try {
          const data = await adminService.listUsers();
          set({
            users: data.users || [],
            usersLoaded: true,
            usersLoading: false,
            usersError: "",
          });
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error?.response?.data?.error || "Failed to load users",
          });
        }
      },

      removeUserFromCache: (userId: string) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
        }));
      },

      invalidateOverview: () => {
        set({
          overviewLoaded: false,
          overviewError: "",
        });
      },

      clearAdminCache: () => {
        set({
          overview: null,
          overviewLoaded: false,
          overviewLoading: false,
          overviewError: "",
          users: [],
          usersLoaded: false,
          usersLoading: false,
          usersError: "",
        });
      },
    }),
    {
      name: "admin-zustand-cache",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        overview: state.overview,
        overviewLoaded: state.overviewLoaded,
        users: state.users,
        usersLoaded: state.usersLoaded,
      }),
    },
  ),
);
