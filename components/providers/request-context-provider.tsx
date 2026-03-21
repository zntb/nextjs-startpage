'use client';

/**
 * Request Context Isolation - Client Side
 *
 * This module provides React Context-based request context management
 * for client components, fixing the AsyncLocalStorage context contamination
 * vulnerability in React 18+ concurrent rendering.
 */

import { createContext, useContext, ReactNode } from 'react';

/**
 * Request context interface for storing request-scoped data
 */
export interface RequestContextData {
  requestId: string;
  userId?: string;
  timestamp: number;
  correlationId?: string;
}

/**
 * Creates a typed React context with undefined as default
 * This ensures proper type safety and forces providers to be set
 */
function createSecureContext<T>() {
  return createContext<T | undefined>(undefined);
}

/**
 * Custom hook to safely consume request context
 * Throws error if used outside provider (fail-fast)
 */
function useSecureContext<T>(
  context: React.Context<T | undefined>,
  contextName: string,
): T {
  const value = useContext(context);
  if (value === undefined) {
    throw new Error(
      `${contextName} must be used within a ${contextName}Provider. ` +
        `This error indicates that the context provider is missing in the component tree.`,
    );
  }
  return value;
}

/**
 * Request Context Provider Props
 */
interface RequestContextProviderProps {
  children: ReactNode;
  value: RequestContextData;
}

/**
 * Request Context for Client Components
 *
 * Use this provider at the root of your application to ensure
 * request-scoped context is properly isolated in concurrent rendering
 */
const RequestContext = createSecureContext<RequestContextData>();

export function RequestContextProvider({
  children,
  value,
}: RequestContextProviderProps) {
  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
}

/**
 * Hook to access request context in client components
 *
 * @example
 * ```tsx
 * const { requestId, userId } = useRequestContext();
 * ```
 */
export function useRequestContext() {
  return useSecureContext(RequestContext, 'RequestContext');
}
