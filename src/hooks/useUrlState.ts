"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface UseUrlStateOptions {
  /**
   * Whether to scroll to top when updating state
   * @default false
   */
  scrollToTop?: boolean;
  /**
   * Whether to replace the current history entry instead of adding a new one
   * @default false
   */
  replace?: boolean;
}

export function useUrlState(options: UseUrlStateOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const setUrlState = useCallback(
    (params: Record<string, string | null>) => {
      const queryString = createQueryString(params);
      const url = `${pathname}${queryString ? `?${queryString}` : ""}`;

      if (options.replace) {
        router.replace(url, { scroll: options.scrollToTop });
      } else {
        router.push(url, { scroll: options.scrollToTop });
      }
    },
    [pathname, router, createQueryString, options.replace, options.scrollToTop]
  );

  const getUrlState = useCallback(
    (key: string, defaultValue: string = "") => {
      return searchParams.get(key) || defaultValue;
    },
    [searchParams]
  );

  return {
    setUrlState,
    getUrlState,
    searchParams,
  };
}
