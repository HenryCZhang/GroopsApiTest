import { z } from "zod";
import type { address } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

export const groupRouter = createTRPCRouter({
    getAllGroups: publicProcedure.query(({ ctx }) => {
      return ctx.prisma.group.findMany();
    }),
  
    getByCode: publicProcedure
      .input(z.object({ groupId: z.string() }))
      .query(({ ctx, input }) => {
        return ctx.prisma.group.findUnique({
          where: { group_code: input.groupId },
        });
      }),
  
    getByOwnerId: publicProcedure
      .input(z.object({ ownerId: z.string() }))
      .query(({ ctx, input }) => {
        return ctx.prisma.group.findMany({
          where: { owner_Clerk_id: input.ownerId },
        });
      }),

    createGroup: publicProcedure
      .input(
        z.object({
            description: z.string(),
            duration: z.number(),
            final_discount: z.number(),
            group_code: z.string(),
            group_name: z.string(),
            is_active_: z.boolean(),
            start_date: z.date(),
            tag_1: z.string(),
            tag_2: z.string(),
            owner_Clerk_id: z.string(),
            primary_image_url: z.string(),
        })
      )
      .mutation(({ ctx, input }) => {
        return ctx.prisma.group.create({
          data: {
            description: input.description,
            duration: input.duration,
            final_discount: input.final_discount,
            group_code: input.group_code,
            group_name: input.group_name,
            is_active_: input.is_active_,
            start_date: input.start_date,
            tag_1: input.tag_1,
            tag_2: input.tag_2,
            owner_Clerk_id: input.owner_Clerk_id,
            primary_image_url: input.primary_image_url,
          },
        });
      }),
  
    updateGroup: publicProcedure
    .input(
        z.object({
            description: z.string(),
            duration: z.number(),
            final_discount: z.number(),
            group_code: z.string(),
            group_name: z.string(),
            is_active_: z.boolean(),
            start_date: z.date(),
            tag_1: z.string(),
            tag_2: z.string(),
            owner_Clerk_id: z.string(),
            primary_image_url: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { group_code, ...updateData } = input;
        // Retrieve the existing address record
        const existingGroup = await ctx.prisma.group.findUnique({
          where: {
            group_code: group_code,
          },
        });
        if (!existingGroup) {
          throw new Error(`Address with ID ${group_code} not found`);
        }
        // Update the address record
        const updatedGroup = await ctx.prisma.group.update({
          where: {
            group_code: group_code,
          },
          data: updateData,
        });
        return updatedGroup;
      }),
    
    deleteGroup: publicProcedure
      .input(z.object({ groupId: z.string() }))
      .mutation(({ ctx, input }) => {
        return ctx.prisma.group.delete({
          where: { group_code: input.groupId },
        });
      }),
  });