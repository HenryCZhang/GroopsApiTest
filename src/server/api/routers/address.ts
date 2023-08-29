import { z } from "zod";
import type { address } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

export const addressRouter = createTRPCRouter({

  getAllAddresses: publicProcedure.query( async({ctx}) => {
    return ctx.prisma.address.findMany();
  }),

  getAddressesByUserId: publicProcedure
    .input(
      z.object({
        user_Clerk_id: z.string(),
      })
    )
    .query(({ ctx, input }) =>
      {
        try {
          return ctx.prisma.address.findMany({
            where: {
              user_Clerk_id: input.user_Clerk_id,
            },
            take: 3,
            orderBy: [{ created_at: "desc" }],
          })
        } catch (error) {
          console.error(error)
        }
      }
    ),

  createAddress: publicProcedure
    .input(
      z.object({
        is_primary_: z.boolean(),
        street: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        postal_code: z.string(),
        user_Clerk_id: z.string(),
        email: z.string(),
        phone: z.string(),
      })
    )
    .mutation(async({ ctx, input }) => {
        // Reset the ID index of the address table if no records exist
        const existingAddresses = await ctx.prisma.address.count();
        if (existingAddresses === 0) {
          await ctx. prisma.$executeRaw`ALTER TABLE \`Address\` AUTO_INCREMENT = 1;`;
        }
      return ctx.prisma.address.create({
        data: {
          is_primary_: input.is_primary_,
          street: input.street,
          city: input.city,
          state: input.state,
          country: input.country,
          first_name: input.first_name,
          last_name: input.last_name,
          postal_code: input.postal_code,
          user_Clerk_id: input.user_Clerk_id,
          email: input.email,
          phone: input.phone,
        },
      });
    }),

  updateAddress: publicProcedure
    .input(
      z.object({
        address_id: z.number(),
        is_primary_: z.boolean(),
        street: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        postal_code: z.string(),
        user_Clerk_id: z.string(),
        email: z.string(),
        phone: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { address_id, ...updateData } = input;
      // Retrieve the existing address record
      const existingAddress = await ctx.prisma.address.findUnique({
        where: {
          id: address_id,
        },
      });
      if (!existingAddress) {
        throw new Error(`Address with ID ${address_id} not found`);
      }
      // Update the address record
      const updatedAddress = await ctx.prisma.address.update({
        where: {
          id: address_id,
        },
        data: updateData,
      });
      return updatedAddress;
    }),

  deleteAddress: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.address.delete({
        where: { ...input },
      });
    }),
});
