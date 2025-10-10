import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";

type State = {
  isPro: boolean;
  usageCount: number;
  setPro: (v: boolean) => Promise<void>;
  setUsageCount: (count: number) => Promise<void>;
  incUsage: () => Promise<void>;
  resetUsage: () => Promise<void>;
};

// Resolve the actual create function in a safe way so both CommonJS/ESM
// interop shapes are supported at runtime.
function resolveCreate(m: any) {
  if (typeof m === "function") return m;
  if (m && typeof m.default === "function") return m.default;
  if (m && typeof m.create === "function") return m.create;
  throw new Error("zustand create() export not found");
}

const createFn = resolveCreate(create as any);

const STORAGE_KEYS = {
  isPro: "muhsin:isPro",
  usageCount: "muhsin:usageCount",
};

export const useStore = createFn((set: any, get: any) => {
  // hydrate from AsyncStorage on init
  (async () => {
    try {
      const [isProRaw, usageRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.isPro),
        AsyncStorage.getItem(STORAGE_KEYS.usageCount),
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
        await AsyncStorage.setItem(STORAGE_KEYS.isPro, v ? "true" : "false");
      } catch {}
    },
    setUsageCount: async (count: number) => {
      set({ usageCount: count });
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.usageCount, String(count));
      } catch {}
    },
    incUsage: async () => {
      const next = (get().usageCount || 0) + 1;
      set({ usageCount: next });
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.usageCount, String(next));
      } catch {}
    },
    resetUsage: async () => {
      set({ usageCount: 0 });
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.usageCount, "0");
      } catch {}
    },
  };
});
