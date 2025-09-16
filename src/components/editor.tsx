'use client';

import { Tldraw, getSnapshot, loadSnapshot, TLEditorSnapshot } from 'tldraw';
import 'tldraw/tldraw.css';
import { trpc } from '@/lib/trpc';
import debounce from 'lodash.debounce';
import { useCallback, useMemo } from 'react';

export const EditorComponent = () => {
  const {
    data: storeData,
    isLoading,
    error,
  } = trpc.editor.getStoreData.useQuery();
  const saveStoreData = trpc.editor.saveStoreData.useMutation();

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
      <Tldraw
        persistenceKey="vidext-editor"
        onMount={(editor) => {
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
