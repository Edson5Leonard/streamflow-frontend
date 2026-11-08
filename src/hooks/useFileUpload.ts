'use client';

import { useCallback, useState } from 'react';
import { validateUpload, type UploadOptions } from '@/services/upload.service';

export function useFileUpload(options: UploadOptions = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selectFile = useCallback((next: File | null) => {
    if (!next) { setFile(null); setError(null); return; }
    try { validateUpload(next, options); setFile(next); setError(null); }
    catch (reason) { setFile(null); setError(reason instanceof Error ? reason.message : 'Archivo no válido.'); }
  }, [options.maxSizeBytes, options.accept?.join('|')]);
  return { file, error, selectFile, clear: () => selectFile(null) };
}
