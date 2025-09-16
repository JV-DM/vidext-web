import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

type StoreData = Record<string, unknown> | null;

let storeData: StoreData = null;

export const editorRouter = router({
  getStoreData: publicProcedure.query(async () => {
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
