"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// Define a minimal interface for Query objects
interface QueryLike {
  state?: {
    status?: string;
  };
}

export function QueryStatus() {
  const [error, setError] = useState<string | null>(null);
  const [queryData, setQueryData] = useState<{
    activeQueries: number;
    totalQueries: number;
    isReady: boolean;
  }>({
    activeQueries: 0,
    totalQueries: 0,
    isReady: false,
  });

  // We need to handle server-side rendering
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't try to use React Query hooks during server-side rendering
  if (!isClient) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-600 text-white p-2 rounded shadow-lg z-50 text-xs">
        QueryClient: Initializing...
      </div>
    );
  }

  // Move the hook call to the component body - hooks can only be called at the top level
  let queryClient = null;
  try {
    // This hook must be called directly in component body, not inside useEffect
    // And only on the client side
    queryClient = useQueryClient();
  } catch (err) {
    console.error("QueryStatus: Error accessing QueryClient:", err);
    setError(err instanceof Error ? err.message : String(err));
  }

  // Update query information periodically
  useEffect(() => {
    if (!queryClient) return;

    console.log("QueryStatus: QueryClient successfully acquired", queryClient);

    const updateQueryInfo = () => {
      try {
        const cache = queryClient.getQueryCache();
        const queries = cache?.getAll() || [];

        console.log("QueryStatus: Query cache accessed", {
          cacheExists: !!cache,
          queryCount: queries.length,
        });

        const activeCount = queries.filter((q: QueryLike) => {
          // Safely access the status property
          try {
            return q.state && q.state.status === "loading";
          } catch (err) {
            console.error("QueryStatus: Error checking query status", err);
            return false;
          }
        }).length;

        setQueryData({
          activeQueries: activeCount,
          totalQueries: queries.length,
          isReady: true,
        });
      } catch (err) {
        console.error("QueryStatus: Error updating query info", err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    // Update immediately and then set interval
    updateQueryInfo();
    const interval = setInterval(updateQueryInfo, 1000);

    return () => clearInterval(interval);
  }, [queryClient]);

  // Display error state
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-600 text-white p-2 rounded shadow-lg z-50 text-xs max-w-xs">
        <div className="font-bold mb-1">QueryClient Error:</div>
        <div className="overflow-auto max-h-20">{error}</div>
      </div>
    );
  }

  // Display initializing state
  if (!queryClient || !queryData.isReady) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-600 text-white p-2 rounded shadow-lg z-50 text-xs">
        QueryClient: Initializing...
      </div>
    );
  }

  // Display active state
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded shadow-lg z-50 text-xs">
      <div className="mb-1">
        <span className="font-bold">QueryClient:</span> Active ✅
      </div>
      <div>
        <span className="font-bold">Queries:</span> {queryData.activeQueries}{" "}
        active / {queryData.totalQueries} total
      </div>
    </div>
  );
}
