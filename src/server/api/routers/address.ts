import { z } from "zod";
import type { address } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

const addUserDataToAddresses = async (addresses: address[]) => {
  const user_Clerk_id = addresses.map((address) => address.user_Clerk_id);
  const users = await clerkClient.users.getUserList({
    userId: user_Clerk_id,
    limit: 110,
  });
  return addresses.map((address) => {
    const user = users.find((user) => user.id === address.user_Clerk_id);

    if (!user) {
      console.error("USER NOT FOUND", address);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `USER for address not found. ADDRESS ID: ${address.id}, USER ID: ${address.user_Clerk_id}`,
      });
    }
    return {
      address,
      user: {
        ...user,
        username: user.username ?? "(username not found)",
      },
    };
  });
};

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
            orderBy: [{ createdAt: "desc" }],
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
    .mutation(({ ctx, input }) => {
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
