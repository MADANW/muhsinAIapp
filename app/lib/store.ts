import { create } from "zustand";
import { Storage } from "./storage";

type State = {
  isPro: boolean;
  usageCount: number;
  setPro: (v: boolean) => Promise<void>;
  setUsageCount: (count: number) => Promise<void>;
  incUsage: () => Promise<void>;
  resetUsage: () => Promise<void>;
};

const STORAGE_KEYS = {
  isPro: "muhsin:isPro",
  usageCount: "muhsin:usageCount",
};

export const useStore = create<State>((set, get) => {
  // hydrate from AsyncStorage on init
  (async () => {
    try {
      const [isProRaw, usageRaw] = await Promise.all([
        Storage.getItem(STORAGE_KEYS.isPro),
        Storage.getItem(STORAGE_KEYS.usageCount),
      ]);

      const isPro = isProRaw === "true";
      const usageCount = usageRaw ? Number(usageRaw) : 0;

      set({ isPro, usageCount });
    } catch (e) {
      // ignore hydration errors for now
      // console.warn('store hydration failed', e);
    }
  })();

  return {
    isPro: false,
    usageCount: 0,
    setPro: async (v: boolean) => {
      set({ isPro: v });
      try {
        await Storage.setItem(STORAGE_KEYS.isPro, v ? "true" : "false");
      } catch {}
    },
    setUsageCount: async (count: number) => {
      set({ usageCount: count });
      try {
        await Storage.setItem(STORAGE_KEYS.usageCount, String(count));
      } catch {}
    },
    incUsage: async () => {
      const next = (get().usageCount || 0) + 1;
      set({ usageCount: next });
      try {
        await Storage.setItem(STORAGE_KEYS.usageCount, String(next));
      } catch {}
    },
    resetUsage: async () => {
      set({ usageCount: 0 });
      try {
        await Storage.setItem(STORAGE_KEYS.usageCount, "0");
      } catch {}
    },
  };
});
