import { z } from "zod";
import { TRPCError, initTRPC } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({

  getAllProducts: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.product.findMany();
    }),

  getById: publicProcedure
    .input(z.object({ skuid: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: { ...input }
      })
    }),

  createProduct: publicProcedure
    .input(z.object({
      skuid: z.string(),
      category_id:z.number(),
      description: z.string(),
      english_product_name: z.string(),
      chinese_product_name: z.string(),
      french_product_name: z.string(),
      cost_price: z.number(),
      retail_price: z.number(),
      stock: z.number(),
      alcohol: z.boolean(),
      alcohol_percentage: z.number(),
      nutrition_fact: z.string(),
      place_of_origin: z.string(),
      product_weight: z.string(),
      specification: z.string(),
      primary_image_url: z.string(),
    })).mutation(({ ctx, input }) => {
      
      if (!input.english_product_name || !input.product_weight || !input.primary_image_url || !input.retail_price || !input.category_id) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "English Product Name, Product Weight, Image, Price, and Category ID are required",
        });
      }
      return ctx.prisma.product.create({ data: {
        //skuid String @id @default(cuid())
        skuid: input.skuid,
        category_id: input.category_id,
        description: input.description,
        english_product_name: input.english_product_name,
        chinese_product_name: input.chinese_product_name,
        french_product_name: input.french_product_name,
        cost_price: input.cost_price,
        retail_price: input.retail_price,
        stock: input.stock,
        alcohol: input.alcohol,
        alcohol_percentage: input.alcohol_percentage,
        nutrition_fact: input.nutrition_fact,
        place_of_origin: input.place_of_origin,
        product_weight: input.product_weight,
        specification: input.specification,
        primary_image_url: input.primary_image_url,
      } })
    }),

});