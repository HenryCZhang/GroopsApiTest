import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  getUserOrders: publicProcedure
    .input(z.object({ user_Clerk_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.order.findMany({
        where: { user_Clerk_id: input.user_Clerk_id },
      });
    }),

    // create a new order api
    createOrder: publicProcedure
  .input(
    z.object({
      user_Clerk_id: z.string(),
      products: z.array(
        z.object({
          product_skuid: z.string(),
          quantity: z.number().min(1),
        })
      ),
      sub_total: z.number().min(0),
      group_code: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { user_Clerk_id, products, sub_total, group_code } = input;
    
    // Create the order without the products
    const newOrder = await ctx.prisma.order.create({
      data: {
        group_code,
        sub_total,
        user_Clerk_id,
        delivery: null,
        refund_amount: null,
        delivery_tip: null,
        green_fee: null,
        payment_intent: null,
        sales_tax: null,
        shipping_address: null,
      },
    });
    
    // Associate the products with the created order
    await Promise.all(products.map(async (product) => {
      await ctx.prisma.orderproducts.create({
        data: {
          order: { connect: { id: newOrder.id } },
          product: { connect: { skuid: product.product_skuid } },
          quantity: product.quantity,
        },
      });
    }));

    return newOrder;
  }),

  

});