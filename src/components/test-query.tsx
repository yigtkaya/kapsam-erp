"use client";

import { useState } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// Basic test query that just returns a timestamp
function useTestQuery() {
  return useQuery({
    queryKey: ["test-query"],
    queryFn: async () => {
      // Simple async function that returns the current time
      return {
        timestamp: new Date().toISOString(),
        random: Math.random(),
      };
    },
    staleTime: 5000, // 5 seconds
  });
}

function TestQueryInner() {
  const [error, setError] = useState<string | null>(null);

  try {
    // Try to use the query hook
    const { data, isLoading, isError, refetch } = useTestQuery();

    return (
      <div className="p-2 border border-gray-200 rounded bg-gray-50 text-sm">
        <div className="font-bold mb-1">React Query Test</div>
        <div className="flex flex-col gap-1">
          <div>
            <span className="font-semibold">Status:</span>{" "}
            {isLoading ? "Loading..." : "Ready ✅"}
          </div>
          <div>
            <span className="font-semibold">Data:</span>{" "}
            {data ? JSON.stringify(data) : "None"}
          </div>
          <div>
            <span className="font-semibold">Error:</span>{" "}
            {isError ? "Error occurred" : "None"}
          </div>
          <button
            onClick={() => refetch()}
            className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Refetch Data
          </button>
        </div>
      </div>
    );
  } catch (err) {
    // Log the error and show error state
    console.error("Error in TestQueryInner:", err);
    setError(err instanceof Error ? err.message : String(err));

    return (
      <div className="p-2 border border-red-200 rounded bg-red-50 text-sm">
        <div className="font-bold text-red-600 mb-1">React Query Error</div>
        <div>{error || "Unknown error occurred"}</div>
      </div>
    );
  }
}

// Standalone test component with its own QueryClient
export function TestQuery() {
  const [hasError, setHasError] = useState(false);

  // If there's an error, we'll avoid rendering the inner query component
  if (hasError) {
    return (
      <div className="p-2 border border-red-200 rounded bg-red-50 text-sm">
        <div className="font-bold text-red-600 mb-1">
          React Query Initialization Error
        </div>
        <div>QueryClient could not be created. Check console for details.</div>
      </div>
    );
  }

  try {
    // Create a fresh QueryClient for this test
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
        },
      },
    });

    return (
      <QueryClientProvider client={queryClient}>
        <TestQueryInner />
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("Error creating QueryClient in TestQuery:", error);
    setHasError(true);
    return null;
  }
}
