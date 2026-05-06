"use client";

import { useEffect } from "react";
import { useDoIt } from "@/lib/store";

export function StoreHydrator() {
  useEffect(() => {
    useDoIt.persist.rehydrate();
    // Mark as hydrated even if no persisted state exists
    setTimeout(() => useDoIt.getState().setHydrated(), 0);
  }, []);
  return null;
}
