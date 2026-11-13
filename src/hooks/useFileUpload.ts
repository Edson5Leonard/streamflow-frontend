'use client';

import { useCallback, useState } from 'react';
import { validateUpload, type UploadOptions } from '@/services/upload.service';

export function useFileUpload(options: UploadOptions = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const maxSizeBytes = options.maxSizeBytes;
  const acceptedTypes = options.accept?.join('|');
  const selectFile = useCallback((next: File | null) => {
    if (!next) { setFile(null); setError(null); return; }
    const accept = acceptedTypes === undefined ? undefined : acceptedTypes ? acceptedTypes.split('|') : [];
    try { validateUpload(next, { maxSizeBytes, accept }); setFile(next); setError(null); }
    catch (reason) { setFile(null); setError(reason instanceof Error ? reason.message : 'Archivo no válido.'); }
  }, [maxSizeBytes, acceptedTypes]);
  return { file, error, selectFile, clear: () => selectFile(null) };
}
