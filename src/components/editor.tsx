'use client';

import { Tldraw, getSnapshot, loadSnapshot, TLEditorSnapshot } from 'tldraw';
import 'tldraw/tldraw.css';
import { trpc } from '@/lib/trpc';
import debounce from 'lodash.debounce';
import { useCallback, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';

export const EditorComponent = () => {
  const editorRef = useRef<any>(null);
  const {
    data: storeData,
    isLoading,
    error,
    refetch,
  } = trpc.editor.getStoreData.useQuery();
  const saveStoreData = trpc.editor.saveStoreData.useMutation();
  const clearStore = trpc.editor.clearStore.useMutation();

  const saveFunction = useCallback(
    (store: TLEditorSnapshot) => {
      saveStoreData.mutate(
        { data: store },
        {
          onError: (error) => {
            console.error('Failed to save store data:', error);
          },
        }
      );
    },
    [saveStoreData]
  );

  const handlePersistanceChange = useMemo(
    () => debounce(saveFunction, 500),
    [saveFunction]
  );

  const handleClearStore = useCallback(async () => {
    try {
      await clearStore.mutateAsync();
      if (editorRef.current) {
        // Use selectAll and deleteShapes instead of store.clear()
        const allShapeIds = editorRef.current.getCurrentPageShapeIds();
        if (allShapeIds.size > 0) {
          editorRef.current.deleteShapes([...allShapeIds]);
        }
      }
      await refetch();
    } catch (error) {
      console.error('Failed to clear store:', error);
    }
  }, [clearStore, refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Loading editor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">
          Error loading editor: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-9 z-50">
        <Button
          onClick={handleClearStore}
          disabled={clearStore.isPending}
          variant="ghost"
          size="sm"
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 border-0"
        >
          {clearStore.isPending ? 'Clearing...' : 'Clear All'}
        </Button>
      </div>
      <Tldraw
        persistenceKey="vidext-editor"
        onMount={(editor) => {
          editorRef.current = editor;

          if (storeData?.data) {
            loadSnapshot(editor.store, storeData.data);
          }

          editor.store.listen(() => {
            const snapshot = getSnapshot(editor.store);

            handlePersistanceChange(snapshot);
          });
        }}
      />
    </div>
  );
};
