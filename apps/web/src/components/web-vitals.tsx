import * as React from "react";

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, unknown>) => void };
  }
}

interface ReportedMetric {
  name: string;
  value: number;
  rating?: string;
  id: string;
}

/**
 * Field Core Web Vitals (RUM). Reports INP/LCP/CLS/TTFB/FCP for real sessions to
 * the existing umami instance (umami.heyclau.de is already allowed by CSP, so no
 * policy change). Renders nothing; the web-vitals library is dynamically imported
 * inside the effect so it never enters the SSR path or the universal client chunk.
 */
export function WebVitals() {
  React.useEffect(() => {
    let cancelled = false;
    void import("web-vitals").then(({ onCLS, onINP, onLCP, onTTFB, onFCP }) => {
      if (cancelled) return;
      const report = (metric: ReportedMetric) => {
        // umami loads async; if it isn't ready yet, drop the sample rather than queue.
        if (typeof window === "undefined" || !window.umami) return;
        window.umami.track("web-vital", {
          metric: metric.name,
          // CLS is unitless (scale ×1000 to keep it an integer); the rest are ms.
          value: metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value),
          rating: metric.rating,
          id: metric.id,
          path: window.location.pathname,
        });
      };
      onCLS(report);
      onINP(report);
      onLCP(report);
      onTTFB(report);
      onFCP(report);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
