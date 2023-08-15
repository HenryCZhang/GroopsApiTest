import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateCode } from "~/utils/groupCode";


export const groupRouter = createTRPCRouter({
  getAllGroups: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany();
  }),

  getGroupByGroupCode: publicProcedure
    .input(z.object({ group_code: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.group.findUnique({
        where: { group_code: input.group_code },
      });
    }),


    //check if user owns an active group or not
    getActiveGroupByOwnerId: publicProcedure
    .input(z.object({ owner_Clerk_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const activeOwnedGroup = await ctx.prisma.group.findMany({
        where: { 
          owner_Clerk_id: input.owner_Clerk_id ?? "",
          is_active_: true,
       },
      });
      if (activeOwnedGroup.length > 0) {
        return activeOwnedGroup;
      }else{
        return null;
      }
    }),

    //need to change the parameters
  createGroup: publicProcedure
    .input(
      z.object({
        owner_Clerk_id: z.string(),
        group_name: z.string(),
        primary_image_url: z.string(),
        duration: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
        const {owner_Clerk_id, group_name, primary_image_url, duration} = input;
      return ctx.prisma.group.create({
        data: {
        owner_Clerk_id,
        group_name,
        primary_image_url,
        duration,
        group_code: generateCode(),
        },
      });
    }),

  deleteGroup: publicProcedure
    .input(z.object({ group_code: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.group.delete({
        where: { group_code: input.group_code },
      });
    }),
});
