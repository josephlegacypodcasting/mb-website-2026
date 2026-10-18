"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { RoiSnapshot } from "@/lib/roi";

/*
 * Carries what a prospect modelled in the ROI calculator over to the contact
 * form, which lives in a different part of the tree — the footer on Mike's
 * version, a CTA section on the in-house one.
 *
 * Mounted in the root layout so the snapshot survives client-side navigation:
 * someone can model their numbers on the ROI page, click through to Pricing,
 * and submit there. sessionStorage covers the one case React state does not,
 * a full page reload. It is per-tab and never leaves the browser except on an
 * actual submission.
 */

const STORAGE_KEY = "mb:roi-snapshot";

type RoiContextValue = {
  snapshot: RoiSnapshot | null;
  reportRoi: (snapshot: RoiSnapshot) => void;
};

const RoiContext = createContext<RoiContextValue | null>(null);

export function RoiProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<RoiSnapshot | null>(null);

  // Read after mount, not in the initializer: sessionStorage does not exist
  // during SSR, and seeding state from it would break hydration.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setSnapshot(JSON.parse(stored) as RoiSnapshot);
    } catch {
      // Private mode, or a stale value we cannot parse. Carry on without it.
    }
  }, []);

  const reportRoi = useCallback((next: RoiSnapshot) => {
    setSnapshot(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable or full — the in-memory snapshot still works for
      // this page view, which is the common case.
    }
  }, []);

  const value = useMemo(() => ({ snapshot, reportRoi }), [snapshot, reportRoi]);

  return <RoiContext.Provider value={value}>{children}</RoiContext.Provider>;
}

export function useRoi(): RoiContextValue {
  const context = useContext(RoiContext);
  if (!context) {
    throw new Error("useRoi must be used inside a RoiProvider");
  }
  return context;
}
