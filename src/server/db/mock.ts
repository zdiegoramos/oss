import type { drizzle } from "drizzle-orm/postgres-js";
import type schemaType from "./schema";

type Db = ReturnType<typeof drizzle<typeof schemaType>>;

/**
 * A recursive Proxy that satisfies the Drizzle query-builder chain interface
 * without touching the database. Every property access and function call
 * returns the same proxy; when the chain is finally awaited it resolves to [].
 *
 * This means all inserts, selects, updates, and deletes are no-ops that return
 * empty result sets, which is what you want when DB_MOCK=true.
 */
// biome-ignore lint/suspicious/noExplicitAny: self-referential proxy requires any
let mockBuilder: any;

mockBuilder = new Proxy(
  // biome-ignore lint/suspicious/noExplicitAny: function target is required for the apply trap
  (() => undefined) as any,
  {
    get(_target: unknown, prop: string | symbol): unknown {
      if (prop === "then") {
        // Make the chain thenable so `await db.select()...` resolves to [].
        return (
          resolve: (v: unknown) => unknown,
          reject?: (e: unknown) => unknown
        ) => Promise.resolve([]).then(resolve, reject);
      }
      if (prop === "catch") {
        return (onRejected: (e: unknown) => unknown) =>
          Promise.resolve([]).catch(onRejected);
      }
      if (prop === "finally") {
        return (onFinally: () => void) =>
          Promise.resolve([]).finally(onFinally);
      }
      return mockBuilder;
    },
    apply(): unknown {
      return mockBuilder;
    },
  }
);

export const mockDb = new Proxy({} as unknown as Db, {
  get(): unknown {
    return mockBuilder;
  },
});
