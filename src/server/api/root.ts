
import { addressRouter } from "~/server/api/routers/address";
import { createTRPCRouter } from "~/server/api/trpc";
import { ShoppingCartRouter } from "./routers/cart";
import { productRouter } from "./routers/product";
import { groupRouter } from "./routers/group";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  address: addressRouter,
  cart: ShoppingCartRouter,
  product: productRouter,
  group: groupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
