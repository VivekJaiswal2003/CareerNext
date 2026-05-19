"use client";

import { useEffect, useState } from "react";
import type { DetailedResumeAnalysis } from "@/lib/resume-analysis";
import { normalizeAnalysis } from "@/lib/resume-analysis";

const storageKey = "careernext.latestResumeAnalysis";

export function useResumeAnalysis() {
  const [analysis, setAnalysisState] = useState<DetailedResumeAnalysis | null>(null);

  useEffect(() => {
    async function loadAnalysis() {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        try {
          setAnalysisState(normalizeAnalysis(JSON.parse(stored)));
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }

      try {
        const response = await fetch("/api/resume/latest");
        if (!response.ok) return;
        const payload = await response.json();
        if (payload.analysis) {
          const normalized = normalizeAnalysis(payload.analysis);
          setAnalysisState(normalized);
          window.localStorage.setItem(storageKey, JSON.stringify(normalized));
        }
      } catch {
        // Keep cached state if server is unavailable.
      }
    }

    loadAnalysis();

    function sync(event: StorageEvent) {
      if (event.key !== storageKey) return;
      if (!event.newValue) {
        setAnalysisState(null);
        return;
      }

      try {
        setAnalysisState(normalizeAnalysis(JSON.parse(event.newValue)));
      } catch {
        setAnalysisState(null);
      }
    }

    function customSync() {
      const next = window.localStorage.getItem(storageKey);
      if (!next) {
        setAnalysisState(null);
        return;
      }

      try {
        setAnalysisState(normalizeAnalysis(JSON.parse(next)));
      } catch {
        setAnalysisState(null);
      }
    }

    window.addEventListener("storage", sync);
    window.addEventListener("careernext:resume-analysis", customSync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("careernext:resume-analysis", customSync);
    };
  }, []);

  function setAnalysis(next: DetailedResumeAnalysis) {
    const normalized = normalizeAnalysis(next);
    setAnalysisState(normalized);
    window.localStorage.setItem(storageKey, JSON.stringify(normalized));
    window.dispatchEvent(new Event("careernext:resume-analysis"));
  }

  return { analysis, setAnalysis };
}
