/**
 * API Rules for Kapsam ERP Frontend
 *
 * These guidelines ensure consistent API calls, error handling, and user feedback
 * across the entire application.
 */

import { toast } from "sonner";
import { ApiError } from "@/api/errors";

/**
 * Standard error handler that displays toast messages from API responses
 */
export function handleApiError(
  error: unknown,
  defaultMessage = "İşlem sırasında bir hata oluştu"
) {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    toast.error(error.message || defaultMessage);
    return error.message;
  }

  if (error instanceof Error) {
    toast.error(error.message || defaultMessage);
    return error.message;
  }

  toast.error(defaultMessage);
  return defaultMessage;
}

/**
 * Standard success handler that displays toast messages from API responses
 */
export function handleApiSuccess(
  message?: string,
  defaultMessage = "İşlem başarıyla tamamlandı"
) {
  const successMessage = message || defaultMessage;
  toast.success(successMessage);
  return successMessage;
}

/**
 * Hook builder for creating API mutation hooks with consistent error and success handling
 * To be used with React Query's useMutation
 */
export function createMutationOptions<TData, TError, TVariables, TContext>({
  mutationFn,
  onSuccess,
  onError,
  successMessage = "İşlem başarıyla tamamlandı",
  errorMessage = "İşlem sırasında bir hata oluştu",
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext | undefined
  ) => void | Promise<unknown>;
  onError?: (
    error: TError,
    variables: TVariables,
    context: TContext | undefined
  ) => void | Promise<unknown>;
  successMessage?: string;
  errorMessage?: string;
}) {
  return {
    mutationFn,
    onSuccess: async (
      data: TData,
      variables: TVariables,
      context: TContext | undefined
    ) => {
      // If the data contains a message field, use it for the toast
      const message =
        typeof data === "object" && data !== null && "message" in data
          ? String(data.message)
          : successMessage;

      handleApiSuccess(message);

      if (onSuccess) {
        await onSuccess(data, variables, context);
      }
    },
    onError: async (
      error: TError,
      variables: TVariables,
      context: TContext | undefined
    ) => {
      handleApiError(error, errorMessage);

      if (onError) {
        await onError(error, variables, context);
      }
    },
  };
}

/**
 * API Response Guidelines
 *
 * All API responses should follow these formats for consistency:
 *
 * 1. Success responses:
 *    {
 *      success: true,
 *      data: any,           // The actual data returned
 *      message?: string     // Optional success message to display to the user
 *    }
 *
 * 2. Error responses:
 *    {
 *      success: false,
 *      error: string,       // Error message to display to the user
 *      details?: any        // Optional detailed error information for debugging
 *    }
 *
 * 3. Validation errors:
 *    {
 *      success: false,
 *      error: string,       // General error message
 *      validation: {        // Field-specific validation errors
 *        [fieldName]: string | string[]
 *      }
 *    }
 */
