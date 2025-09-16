import { describe, it, expect, beforeEach } from 'vitest'
import { appRouter } from '@/server/api/root'

describe('tRPC Integration', () => {
  let caller: ReturnType<typeof appRouter.createCaller>

  beforeEach(() => {
    caller = appRouter.createCaller({})
  })

  it('should handle complete save and retrieve flow', async () => {
    const testData = {
      shapes: [{ id: '1', type: 'rectangle', x: 100, y: 100 }],
      records: { '1': { id: '1', data: 'test' } }
    }

    const saveResult = await caller.editor.saveStoreData({ data: testData })
    expect(saveResult).toEqual({ success: true, data: testData })

    const retrieveResult = await caller.editor.getStoreData()
    expect(retrieveResult).toEqual({ data: testData })
  })

  it('should handle null data correctly', async () => {
    const saveResult = await caller.editor.saveStoreData({ data: null })
    expect(saveResult).toEqual({ success: true, data: null })

    const retrieveResult = await caller.editor.getStoreData()
    expect(retrieveResult).toEqual({ data: null })
  })

  it('should overwrite existing data when saving new data', async () => {
    const firstData = { shapes: ['shape1'] }
    const secondData = { shapes: ['shape2'] }

    await caller.editor.saveStoreData({ data: firstData })
    await caller.editor.saveStoreData({ data: secondData })

    const result = await caller.editor.getStoreData()
    expect(result).toEqual({ data: secondData })
  })

  it('should handle complex nested data structures', async () => {
    const complexData = {
      shapes: [
        { id: '1', type: 'rectangle', props: { width: 100, height: 50 } },
        { id: '2', type: 'circle', props: { radius: 25 } }
      ],
      records: {
        '1': { type: 'shape', data: { color: 'red' } },
        '2': { type: 'shape', data: { color: 'blue' } }
      },
      metadata: {
        version: '1.0',
        created: new Date().toISOString()
      }
    }

    await caller.editor.saveStoreData({ data: complexData })
    const result = await caller.editor.getStoreData()

    expect(result.data).toEqual(complexData)
  })

  it('should preserve data types correctly', async () => {
    const typedData = {
      string: 'test',
      number: 42,
      boolean: true,
      array: [1, 2, 3],
      object: { nested: 'value' },
      null: null,
      undefined: undefined
    }

    await caller.editor.saveStoreData({ data: typedData })
    const result = await caller.editor.getStoreData()

    expect(result.data).toEqual(typedData)
  })
})