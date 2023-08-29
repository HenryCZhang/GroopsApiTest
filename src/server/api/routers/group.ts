import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateCode } from "~/utils/groupCode";

export const groupRouter = createTRPCRouter({
  getAllGroups: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany(
      {orderBy: { start_date: "desc" }}
    );
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
      } else {
        return null;
      }
    }),

  //need to change the parameters
  createGroup: publicProcedure
    .input(
      z.object({
        owner_Clerk_id: z.string(),
        group_name: z.string(),
        description: z.string(),
        owner_image_url: z.string(),
        group_image_url: z.string(),
        duration: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      
         // Reset the ID index of the product table if no records exist
         const existingGroups = await ctx.prisma.group.count();
         if (existingGroups === 0) {
           await ctx. prisma.$executeRaw`ALTER TABLE \`Group\` AUTO_INCREMENT = 1;`;
         }

      return ctx.prisma.group.create({
        data: {
          ...input,
          group_code: generateCode(),
        },
      });
    }),

  // EditGroup: publicProcedure
  // .input(z.object({ group_code: z.string() }))
  // .mutation(({ ctx, input }) => {
  //   return ctx.prisma.group.update({
  //     where: { group_code: input.group_code },
  //   });
  // }),

  deleteGroup: publicProcedure
  .input(z.object({ group_code: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Delete groupcohost and groupmember records related to the group
    await ctx.prisma.groupcohost.deleteMany({
      where: {
        group_code: input.group_code,
      },
    });
    await ctx.prisma.groupcomission.deleteMany({
      where: {
        group_code: input.group_code,
      },
    });
    await ctx.prisma.groupmember.deleteMany({
      where: {
        group_code: input.group_code,
      },
    });

    // Delete the group record
    return ctx.prisma.group.delete({
      where: { group_code: input.group_code },
    });
  }),

});
