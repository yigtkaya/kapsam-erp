# Next.js 15 Params Migration Guide

In Next.js 15, the way route parameters are handled has changed. Now, `params` should be awaited before using its properties. This document explains how we've updated our codebase to support this change.

## Server Components

In server components, we now use the `useParams` hook from `next/navigation` and await it before using its properties:

```tsx
import { useParams } from "next/navigation";

export default async function MyPage({ params: pageParams }: MyPageProps) {
  const params = await useParams();
  const id = Number(params.id);

  // Rest of the component
}
```

## Client Components

For client components, we've created a custom hook called `useRouteParams` that wraps the `useParams` hook from `next/navigation`:

```tsx
// src/hooks/useRouteParams.ts
"use client";

import { useParams } from "next/navigation";

export function useRouteParams<
  T extends Record<string, string> = Record<string, string>
>() {
  const params = useParams();
  return params as T;
}
```

This hook can be used in client components to access route parameters:

```tsx
import { useRouteParams } from "@/hooks/useRouteParams";

export function MyComponent() {
  const params = useRouteParams<{ id: string }>();
  const id = Number(params.id);

  // Rest of the component
}
```

## Component Props

We've also updated our components to make route parameter props optional, so they can be derived from the route if not provided:

```tsx
interface MyComponentProps {
  id?: number; // Make id optional
}

export function MyComponent({ id: propId }: MyComponentProps = {}) {
  const params = useRouteParams<{ id: string }>();
  const id = propId || Number(params.id);

  // Rest of the component
}
```

This approach allows components to be used in both server and client contexts, and with or without explicit props.

## Files Updated

We've updated the following files to support this change:

- `src/app/boms/details/[id]/page.tsx`
- `src/app/boms/components/[id]/page.tsx`
- `src/app/manufacturing/processes/details/[id]/page.tsx`
- `src/app/manufacturing/machines/details/[id]/page.tsx`
- `src/app/boms/components/[id]/components/bom-components-table.tsx`
- `src/app/boms/components/[id]/components/add-component-button.tsx`
- `src/hooks/useRouteParams.ts` (new file)

## References

- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [Next.js Documentation on Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
