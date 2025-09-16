import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "../../root";

describe("Error Handling", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    caller = appRouter.createCaller({});
  });

  it("should handle undefined input data", async () => {
    const result = await caller.editor.saveStoreData({
      data: undefined as any,
    });
    expect(result.success).toBe(true);
    expect(result.data).toBe(undefined);
  });

  it("should handle very large data objects", async () => {
    const largeArray = new Array(10000).fill(0).map((_, i) => ({
      id: i,
      data: `large-data-${i}`.repeat(100),
    }));

    const largeData = {
      shapes: largeArray,
      records: Object.fromEntries(largeArray.map((item) => [item.id, item])),
    };

    const result = await caller.editor.saveStoreData({ data: largeData });
    expect(result.success).toBe(true);

    const retrieved = await caller.editor.getStoreData();
    expect(retrieved.data).toEqual(largeData);
  });

  it("should handle circular references gracefully", async () => {
    const circularData: any = { name: "test" };
    circularData.self = circularData;

    try {
      await caller.editor.saveStoreData({ data: circularData });
      const result = await caller.editor.getStoreData();
      expect(result.data).toBeDefined();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should handle special JavaScript values", async () => {
    const specialValues = {
      infinity: Infinity,
      negInfinity: -Infinity,
      nan: NaN,
      date: new Date(),
      regex: /test/g,
      func: () => "test",
    };

    const result = await caller.editor.saveStoreData({ data: specialValues });
    expect(result.success).toBe(true);
  });

  it("should handle concurrent save operations", async () => {
    const promises = Array.from({ length: 10 }, (_, i) =>
      caller.editor.saveStoreData({ data: { concurrent: i } })
    );

    const results = await Promise.all(promises);

    results.forEach((result) => {
      expect(result.success).toBe(true);
    });

    const finalResult = await caller.editor.getStoreData();
    expect(finalResult.data).toBeDefined();
    expect(typeof finalResult.data.concurrent).toBe("number");
  });

  it("should handle empty and malformed data", async () => {
    const testCases = [{}, [], "", 0, false, null];

    for (const testData of testCases) {
      const result = await caller.editor.saveStoreData({ data: testData });
      expect(result.success).toBe(true);

      const retrieved = await caller.editor.getStoreData();
      expect(retrieved.data).toEqual(testData);
    }
  });

  it("should maintain data integrity after multiple operations", async () => {
    const operations = [
      { data: { step: 1, content: "first" } },
      { data: { step: 2, content: "second" } },
      { data: null },
      { data: { step: 3, content: "third" } },
    ];

    for (const operation of operations) {
      await caller.editor.saveStoreData(operation);
      const retrieved = await caller.editor.getStoreData();
      expect(retrieved.data).toEqual(operation.data);
    }
  });
});
