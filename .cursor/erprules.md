# Kapsam ERP Frontend Development Rules

These are guidelines for developing features in the Kapsam ERP frontend application.

## API Communication

1. **Message-Based Responses**: All responses from the backend must contain message fields to be displayed to the user. Never hardcode response messages in the frontend.

2. **Error Handling Structure**:

   - Use the `handleApiError` function from `src/rules/api.ts` for all error handling
   - Display error messages directly from the API response
   - All API errors should use the Turkish language for user-facing messages

3. **Response Format**:

   - Success responses should follow the format: `{ success: true, data: any, message?: string }`
   - Error responses should follow the format: `{ success: false, error: string, details?: any }`
   - Validation errors should include field-specific errors: `{ success: false, error: string, validation: { [fieldName]: string | string[] } }`

4. **TypeScript Typing**:
   - All API responses must be properly typed
   - Use the generic types defined in the API helpers for consistency

## Authentication

1. **Role-Based Access Control**:

   - Use the `useAuth` hook for all authentication checks
   - Implement `hasRole` and `hasPermission` functions for authorization
   - Define required roles for protected routes

2. **Session Management**:
   - Use cookies for session storage
   - Implement proper session timeout handling
   - Refresh tokens when appropriate

## UI/UX Guidelines

1. **Form Design**:

   - All forms should have clear labels
   - Use validation messages from the backend
   - Implement loading states during submissions
   - Disable form controls during submission

2. **Toast Messages**:

   - Use toast messages for all user notifications
   - Display success messages from API responses
   - Display error messages from API responses
   - Keep messages concise and actionable

3. **Layout Consistency**:

   - Maintain consistent spacing and layout
   - Use the defined color palette
   - Ensure all UI elements are responsive
   - Follow the established component patterns

4. **Accessibility**:
   - Ensure all interactive elements are keyboard accessible
   - Use ARIA attributes appropriately
   - Maintain sufficient color contrast
   - Test with screen readers

## Performance Considerations

1. **Data Fetching**:

   - Use React Query for all data fetching
   - Implement proper caching strategies
   - Use stale-while-revalidate patterns
   - Optimize refetch intervals

2. **Rendering Optimization**:
   - Use React Server Components where appropriate
   - Minimize client-side JavaScript
   - Implement lazy loading for heavy components
   - Use pagination for large data sets

## Coding Standards

1. **Component Structure**:

   - Implement proper separation of concerns
   - Create reusable components
   - Use TypeScript for type safety
   - Document complex logic

2. **State Management**:
   - Use local state for UI-specific state
   - Use React Query for server state
   - Implement proper loading and error states
   - Use context sparingly and purposefully
