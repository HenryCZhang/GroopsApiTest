
import { addressRouter } from "~/server/api/routers/address";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  address: addressRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
