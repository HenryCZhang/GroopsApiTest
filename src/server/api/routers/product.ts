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
      category_id:z.number().optional(),
      description: z.string().optional(),
      english_product_name: z.string(),
      chinese_product_name: z.string().optional(),
      french_product_name: z.string().optional(),
      cost_price: z.number().optional(),
      retail_price: z.number(),
      stock: z.number(),
      alcohol: z.boolean().optional(),
      alcohol_percentage: z.number().optional(),
      nutrition_fact: z.string().optional(),
      place_of_origin: z.string().optional(),
      product_weight: z.string().optional(),
      specification: z.string().optional(),
      primary_image_url: z.string(),
    })).mutation(async ({ ctx, input }) => {
      
       // Reset the ID index of the product table if no records exist
       const existingProducts = await ctx.prisma.product.count();
       if (existingProducts === 0) {
         await ctx. prisma.$executeRaw`ALTER TABLE \`Product\` AUTO_INCREMENT = 1;`;
       }

      if ( !input.skuid || !input.english_product_name || !input.primary_image_url || !input.retail_price) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Product's skuid, English Product Name, Image, and Retail Price are required",
        });
      }

  // Check if a product with the same skuid already exists
  const existingProduct = await ctx.prisma.product.findUnique({
    where: { skuid: input.skuid },
  });
  if (existingProduct) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: `A product with skuid '${input.skuid}' already exists.`,
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

    deleteProduct: publicProcedure
    .input(z.object({ skuid: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.delete({
        where: { ...input },
      });
    }),

});