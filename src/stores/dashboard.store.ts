import { create } from "zustand";
import { shopService } from "../services/shop.service";
import { Product } from "../types";

type DashboardStore = {
  previewProducts: Product[];
  loading: boolean;
  error: string | null;
  lastFetched: Record<string, number | null>;
  requests: Record<string, Promise<void> | null>;
  currentKey: string;
  fetchDashboardData: (
    canManageContent: boolean,
    canManageHospitals: boolean,
    force?: boolean,
  ) => Promise<void>;
  clearError: () => void;
};

const STALE_TIME_MS = 60_000;

const getKey = (canManageContent: boolean, canManageHospitals: boolean) => {
  return `${canManageContent ? "my-content" : "all-content"}|${canManageHospitals ? "my-hospitals" : "all-hospitals"}`;
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  previewProducts: [],
  previewContents: [],
  previewHospitals: [],
  loading: false,
  error: null,
  lastFetched: {},
  requests: {},
  currentKey: "",

  fetchDashboardData: async (
    canManageContent,
    canManageHospitals,
    force = false,
  ) => {
    const state = get();
    const key = getKey(canManageContent, canManageHospitals);
    const inFlight = state.requests[key];

    if (inFlight) {
      return inFlight;
    }

    const lastFetchedAt = state.lastFetched[key] ?? null;
    const isFresh =
      lastFetchedAt !== null && Date.now() - lastFetchedAt < STALE_TIME_MS;
    const hasCachedData =
      state.currentKey === key &&
      state.previewProducts.length > 0 

    if (!force && isFresh && hasCachedData) {
      return;
    }

    const request = (async () => {
      set({ loading: true, error: null });
      try {
        const [productsRes ] = await Promise.all([
          shopService.getProducts({ page: 1, limit: 6 }),
         
        ]);

        set((current) => ({
          previewProducts: productsRes.products || [],
          loading: false,
          currentKey: key,
          lastFetched: {
            ...current.lastFetched,
            [key]: Date.now(),
          },
        }));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        set({ loading: false, error: "Failed to load dashboard data" });
        throw error;
      } finally {
        set((current) => ({
          requests: {
            ...current.requests,
            [key]: null,
          },
        }));
      }
    })();

    set((current) => ({
      requests: {
        ...current.requests,
        [key]: request,
      },
    }));

    return request;
  },

  clearError: () => set({ error: null }),
}));
