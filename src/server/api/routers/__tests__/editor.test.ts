import { describe, it, expect } from 'vitest';
import { appRouter } from '../../root';

describe('editorRouter', () => {
  it('should return null for initial store data', async () => {
    const caller = appRouter.createCaller({});

    const result = await caller.editor.getStoreData();

    expect(result).toEqual({ data: null });
  });

  it('should save and retrieve store data', async () => {
    const caller = appRouter.createCaller({});
    const testData = { shapes: [], records: {} };

    await caller.editor.saveStoreData({ data: testData });
    const result = await caller.editor.getStoreData();

    expect(result).toEqual({ data: testData });
  });

  it('should return success when saving data', async () => {
    const caller = appRouter.createCaller({});
    const testData = { shapes: [], records: {} };

    const result = await caller.editor.saveStoreData({ data: testData });

    expect(result).toEqual({ success: true, data: testData });
  });
});
