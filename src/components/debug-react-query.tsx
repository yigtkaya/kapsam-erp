"use client";

import { useState, useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";

// Extend Window interface to accommodate our checks
declare global {
  interface Window {
    ReactQuery?: unknown;
    __REACT_QUERY_GLOBALS__?: unknown;
    React?: {
      useState?: Function;
      useQueryClient?: Function;
    };
    __QUERY_PROVIDERS?: Array<{
      id: string;
      mountTime: string;
      client: unknown;
    }>;
  }
}

/**
 * A diagnostic component that helps debug React Query setup issues
 * Add this to your page for temporary debugging
 */
export function DebugReactQuery() {
  const [diagnostics, setDiagnostics] = useState<{
    providers: number;
    mounted: boolean;
    hasTanstackQuery: boolean;
    devtoolsDetected: boolean;
    issues: string[];
  }>({
    providers: 0,
    mounted: false,
    hasTanstackQuery: false,
    devtoolsDetected: false,
    issues: [],
  });

  // Run diagnostics only client-side
  useEffect(() => {
    // Exit early if not in browser environment
    if (typeof window === "undefined") return;

    const runDiagnostics = () => {
      // Run diagnostics
      const issues: string[] = [];

      // Check if @tanstack/react-query is loaded in various ways
      const queryClientExists = typeof QueryClient === "function";

      // Look for React Query in global scope
      const hasTanstackQuery = !!(
        queryClientExists ||
        window.ReactQuery ||
        typeof window.__REACT_QUERY_GLOBALS__ !== "undefined"
      );

      if (!hasTanstackQuery) {
        issues.push("React Query library not detected in global scope");
      }

      // Check for React Query DevTools
      const devtoolsElements = document.querySelectorAll(
        "[data-rq-devtools], [data-testid='rq-devtools']"
      );
      const devtoolsDetected = devtoolsElements.length > 0;

      if (!devtoolsDetected && process.env.NODE_ENV === "development") {
        issues.push("React Query DevTools not detected in DOM");
      }

      // Check for QueryClientProvider
      const providers = document.querySelectorAll("[data-rq-client]").length;

      if (providers === 0) {
        issues.push("No QueryClientProvider instances found in DOM");

        // Try to find providers that might be there but not properly attributed
        const possibleProviders = Array.from(
          document.querySelectorAll("div")
        ).filter((el) => {
          const attrs = Array.from(el.attributes).map((attr) => attr.name);
          return attrs.some(
            (attr) =>
              attr.includes("query") ||
              attr.includes("rq") ||
              attr.includes("react-query")
          );
        });

        if (possibleProviders.length > 0) {
          issues.push(
            `Found ${possibleProviders.length} possible React Query elements without proper data-rq-client attribute`
          );
        }
      } else if (providers > 1) {
        issues.push(
          `Multiple QueryClientProvider instances (${providers}) found - may cause issues`
        );
      }

      // Update diagnostics
      setDiagnostics({
        providers,
        mounted: true,
        hasTanstackQuery: queryClientExists,
        devtoolsDetected,
        issues,
      });

      // Log diagnostics
      console.log("[DebugReactQuery] Diagnostics:", {
        providers,
        hasTanstackQuery,
        devtoolsDetected,
        queryClientExists,
        issues,
        queryProviders: window.__QUERY_PROVIDERS || [],
      });
    };

    // Delay diagnostics a bit to ensure DOM has fully loaded
    const timer = setTimeout(runDiagnostics, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!diagnostics.mounted) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white p-2 text-xs font-mono overflow-auto max-h-40">
      <div className="flex justify-between mb-1">
        <span className="font-bold">React Query Diagnostics</span>
        <button
          onClick={() =>
            setDiagnostics((prev) => ({ ...prev, mounted: false }))
          }
          className="px-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <div>Library loaded: {diagnostics.hasTanstackQuery ? "✅" : "❌"}</div>
        <div>DevTools: {diagnostics.devtoolsDetected ? "✅" : "❌"}</div>
        <div>QueryClientProvider instances: {diagnostics.providers}</div>
      </div>

      {diagnostics.issues.length > 0 && (
        <div className="mt-1 pt-1 border-t border-gray-700">
          <div className="font-bold text-red-400">Issues:</div>
          <ul className="list-disc pl-4">
            {diagnostics.issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
