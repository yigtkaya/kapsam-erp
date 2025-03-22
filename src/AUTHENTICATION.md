# Authentication System

This document outlines the authentication system for the Kapsam ERP Frontend.

## Authentication Flow

1. **Login**: Users log in through the `/login` page, which calls the server action to authenticate.
2. **Session Management**: Once authenticated, cookies (`sessionid` and `csrftoken`) are set by the server.
3. **Route Protection**: Next.js middleware protects routes based on authentication status.
4. **API Calls**: Middleware automatically adds authentication headers to API requests.

## Architecture

### Middleware (middleware.ts)

The middleware handles:

- Route protection for authenticated and unauthenticated routes
- Adding authentication headers to API requests
- Redirecting unauthenticated users to the login page
- Redirecting authenticated users away from public pages

### Route Groups

- **(auth)**: Contains authentication-related pages (login, forgot-password)
- **(protected)**: Contains all application pages that require authentication

> **Important**: When using route groups, parentheses `()` in the directory name are removed from the actual URL. For example, `src/app/(protected)/dashboard/page.tsx` maps to the URL path `/dashboard`. Never have the same page path in both a route group and outside of it.

### Layouts

- **Root Layout**: Server component that provides basic HTML structure
- **Auth Layout**: Client component that handles auth-specific styling
- **Protected Layout**: Client component that includes the dashboard structure with sidebar and header

### API Helpers

The `api-helpers.ts` file provides utility functions for making authenticated API calls:

- `fetchApi`: For GET requests
- `postApi`: For POST requests
- `updateApi`: For PATCH requests
- `deleteApi`: For DELETE requests

These helpers automatically handle authentication and error handling.

## Usage

### Protected Routes

Place any authenticated pages in the `src/app/(protected)` directory. They will automatically be protected by the middleware.

### Public Routes

Place any public pages in the `src/app/(auth)` directory or at the root level. The middleware will redirect authenticated users away from these pages.

### API Calls

Use the API helper functions to make authenticated API calls:

```typescript
// Example GET request
const data = await fetchApi<YourType>("/api/endpoint");

// Example POST request
const result = await postApi<ResponseType>("/api/endpoint", requestData);

// Example PATCH request
const updated = await updateApi<ResponseType>("/api/endpoint", updateData);

// Example DELETE request
await deleteApi("/api/endpoint");
```

### Server Actions

When creating server actions (files with `"use server"` directive), remember these important rules:

1. **All exports must be async functions**: Next.js requires that all exports from server action files must be async functions. You cannot export constants, variables, or regular functions:

```typescript
// ✅ Correct - async function in a server file
"use server";
export async function myServerAction() {
  // Implementation
}

// ❌ Incorrect - will cause build error
("use server");
export function myHelperFunction() {
  // Missing async!
  // Implementation
}

// ❌ Incorrect - will cause build error
("use server");
export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Constants can't be exported

// ❌ Incorrect - will cause build error
("use server");
export const myFunction = async () => {
  // Arrow functions can't be exported (even async ones)
  // Implementation
};

// ✅ Correct - non-exported constants are fine
("use server");
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Private constant
export async function getApiUrl() {
  // Accessor function
  return API_URL;
}
```

2. **Keep "use server" directive at the top**: The directive must be the first statement in the file.

3. **Consider function boundaries**: Server actions cannot directly use client-side APIs, DOM, or browser-specific features.

## Authentication Hooks

The `useAuth` hook provides authentication state and methods:

```typescript
const { user, isAuthenticated, isLoading, login, logout } = useAuth();
```

This hook is used in components that need to access authentication state.
