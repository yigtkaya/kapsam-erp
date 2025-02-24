"use client";

import { useParams } from "next/navigation";

/**
 * A hook that wraps the useParams hook from next/navigation to make it easier to use in client components.
 * In Next.js 15, params should be awaited before using its properties.
 * This hook provides a type-safe way to access route parameters.
 *
 * @returns The route parameters
 *
 * @example
 * ```tsx
 * // In a client component
 * const { id } = useRouteParams();
 * const numericId = Number(id);
 * ```
 */
export function useRouteParams<
  T extends Record<string, string> = Record<string, string>
>() {
  const params = useParams();
  return params as T;
}
