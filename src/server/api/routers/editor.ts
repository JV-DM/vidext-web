import { z } from "zod";
import { router, publicProcedure } from "../trpc";

let storeData: any = null;

export const editorRouter = router({
  getStoreData: publicProcedure.query(async () => {
    console.log("getStoreData requested - current store:", storeData);
    return { data: storeData };
  }),

  saveStoreData: publicProcedure
    .input(
      z.object({
        data: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      storeData = input.data;
      return { success: true, data: storeData };
    }),
});
