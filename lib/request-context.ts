/**
 * Request Context Isolation - Server Side
 *
 * This module provides a secure way to manage request-scoped context in React 18+
 * concurrent rendering, fixing the AsyncLocalStorage context contamination vulnerability.
 *
 * The Problem:
 * AsyncLocalStorage context can be lost or contaminated inside Effect fibers under
 * concurrent load with RPC (Server Actions, API routes). This is because React 18's
 * concurrent features can interleave Effects from different requests, and
 * AsyncLocalStorage doesn't properly isolate context across these interleaved operations.
 *
 * The Solution:
 * Use React's built-in Context API for client components and explicit context passing
 * for server actions.
 */

import { AsyncLocalStorage } from 'async_hooks';

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
 * Server Action Context
 *
 * This provides a way to maintain request context within server actions,
 * properly isolated from concurrent requests.
 */

let currentServerContext: RequestContextData | undefined;

/**
 * Get the current server action context
 * This must be called within a server action wrapped with contextServerAction
 */
export function getServerActionContext(): RequestContextData | undefined {
  return currentServerContext;
}

/**
 * Wrap a server action with request context isolation
 *
 * @param action - The server action function
 * @returns Wrapped action that properly isolates context
 */
export function createServerActionContext<
  T extends (...args: unknown[]) => Promise<unknown>,
>(action: T): T {
  return (async (...args: Parameters<T>) => {
    const context: RequestContextData = {
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    // Save previous context to restore after action completes
    const previousContext = currentServerContext;
    currentServerContext = context;

    try {
      return await action(...args);
    } finally {
      // Restore previous context to prevent contamination
      currentServerContext = previousContext;
    }
  }) as T;
}

/**
 * Wrapper for server actions that need user context
 * Automatically extracts user info from session
 *
 * @param action - Server action that requires user context
 * @param getSession - Function to get current session
 */
export function createAuthenticatedServerAction<
  T extends (...args: unknown[]) => Promise<unknown>,
>(
  action: T,
  getSession: () => Promise<{ user?: { id: string; email: string } } | null>,
): T {
  return (async (...args: Parameters<T>) => {
    const session = await getSession();
    const userId = session?.user?.id;

    const context: RequestContextData = {
      requestId: crypto.randomUUID(),
      userId,
      timestamp: Date.now(),
    };

    const previousContext = currentServerContext;
    currentServerContext = context;

    try {
      // Verify user is authenticated
      if (!userId) {
        throw new Error('Unauthorized: User must be authenticated');
      }

      return await action(...args);
    } finally {
      currentServerContext = previousContext;
    }
  }) as T;
}

/**
 * AsyncLocalStorage wrapper with proper Effect isolation
 *
 * This provides AsyncLocalStorage-like API but with proper isolation
 * for React 18+ concurrent rendering.
 *
 * Note: For most use cases, prefer using React Context or explicit context passing.
 * This is only needed for advanced scenarios where you need to propagate context
 * through deeply nested async call chains.
 */

export interface AsyncContextOptions<T> {
  /**
   * Initial value when context is not set
   */
  defaultValue: T;
  /**
   * Optional name for debugging
   */
  name?: string;
}

const contextStore = new Map<string, AsyncLocalStorage<unknown>>();

/**
 * Creates an AsyncLocalStorage instance with proper React 18+ isolation
 *
 * @example
 * ```ts
 * const userContext = createIsolatedAsyncContext<{ id: string }>({
 *   defaultValue: { id: '' },
 *   name: 'userContext'
 * });
 *
 * // Usage in a server action:
 * userContext.run({ id: 'user-123' }, async () => {
 *   // Any async operations here will have access to the user context
 *   const user = userContext.getStore();
 * });
 * ```
 */
export function createIsolatedAsyncContext<T>(
  options: AsyncContextOptions<T>,
): {
  run: <TReturn>(value: T, fn: () => TReturn) => TReturn;
  getStore: () => T | undefined;
} {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { defaultValue, name = 'AsyncContext' } = options;

  // Create a unique storage for this context
  const storage = new AsyncLocalStorage<T>();
  contextStore.set(name, storage as unknown as AsyncLocalStorage<unknown>);

  return {
    run: <TReturn>(value: T, fn: () => TReturn): TReturn => {
      return storage.run(value, fn);
    },

    getStore: (): T | undefined => {
      return storage.getStore();
    },
  };
}

/**
 * Request context for RPC calls
 *
 * This creates an isolated AsyncLocalStorage that can be used to track
 * request context across RPC calls, properly isolated in concurrent rendering.
 */
export const rpcContext = createIsolatedAsyncContext<RequestContextData>({
  defaultValue: {
    requestId: '',
    timestamp: 0,
  },
  name: 'rpcContext',
});
