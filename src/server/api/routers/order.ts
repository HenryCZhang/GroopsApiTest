import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  // getUserOrders: publicProcedure
  //   .input(z.object({ user_Clerk_id: z.string() }))
  //   .query(({ ctx, input }) => {
  //     return ctx.prisma.order.findMany({
  //       where: { user_Clerk_id: input.user_Clerk_id },
  //       include: {
  //         products: true, // Include the associated products
  //       },
  //     });
  //   }),

  getUserOrders: publicProcedure
    .input(z.object({ user_Clerk_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.prisma.order.findMany({
        where: { user_Clerk_id: input.user_Clerk_id },
        include: {
          products: true, // Include the associated products
        },
        orderBy: { order_date: "desc" },
      });

      // Fetch product details for each order
      const ordersWithProductDetails = await Promise.all(
        orders.map(async (order) => {
          const productIds = order.products.map(
            (product) => product.product_id
          );
          const products = await ctx.prisma.product.findMany({
            where: { skuid: { in: productIds } },
          });

          return {
            ...order,
            products: products,
          };
        })
      );

      return ordersWithProductDetails;
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
        total_items: z.number().min(1),
        sub_total: z.number().min(0),
        group_code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user_Clerk_id, products, total_items, sub_total, group_code } =
        input;

      // Reset the ID index of the order table if no records exist
      const existingOrders = await ctx.prisma.order.count();
      if (existingOrders === 0) {
        await ctx. prisma.$executeRaw`ALTER TABLE \`Order\` AUTO_INCREMENT = 1;`;
      }

      // Create the order without the products
      const newOrder = await ctx.prisma.order.create({
        data: {
          group_code,
          total_items,
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
      await Promise.all(
        products.map(async (product) => {
          await ctx.prisma.orderproducts.create({
            data: {
              order: { connect: { id: newOrder.id } },
              product: { connect: { skuid: product.product_skuid } },
              quantity: product.quantity,
            },
          });
        })
      );

      return newOrder;
    }),

  deleteOrder: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findUnique({
        where: { id: input.id },
        include: { products: true }, // Include related products
      });

      if (!order) {
        throw new Error("Order not found");
      }

      // Delete related order products
      await ctx.prisma.orderproducts.deleteMany({
        where: { order_id: order.id },
      });

      // Delete the order itself
      const deletedOrder = await ctx.prisma.order.delete({
        where: { id: input.id },
      });

      return deletedOrder;
    }),
});
