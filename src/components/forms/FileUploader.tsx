'use client';

import { FileUp, X } from 'lucide-react';
import { useId, useRef } from 'react';
import { Button } from '@/components/ui/button';

export function FileUploader({ label = 'Selecciona o arrastra un archivo', accept, maxSizeMb = 5, file, onFileChange, error }: { label?: string; accept?: string; maxSizeMb?: number; file: File | null; onFileChange: (file: File | null) => void; error?: string }) {
  const id = useId(); const inputRef = useRef<HTMLInputElement>(null);
  const select = (candidate?: File) => { if (!candidate) return; if (candidate.size > maxSizeMb * 1024 * 1024) { onFileChange(null); return; } onFileChange(candidate); };
  return <div className="space-y-2"><span className="text-sm font-medium">Archivo</span><input ref={inputRef} id={id} type="file" accept={accept} className="sr-only" onChange={(event) => select(event.target.files?.[0])} aria-describedby={`${id}-help ${id}-error`} /><button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); select(event.dataTransfer.files[0]); }} className="flex min-h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed border-input bg-muted/30 p-5 text-center transition hover:border-primary/60 hover:bg-muted/60"><FileUp className="mb-2 text-primary" /><span className="text-sm font-medium">{file?.name ?? label}</span><span id={`${id}-help`} className="mt-1 text-xs text-muted-foreground">{accept ?? 'Cualquier formato'} · máximo {maxSizeMb} MB</span></button>{file && <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-xs"><span className="truncate">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</span><Button type="button" variant="ghost" size="icon-xs" aria-label="Quitar archivo" onClick={() => onFileChange(null)}><X /></Button></div>}<p id={`${id}-error`} role={error ? 'alert' : undefined} className="text-xs text-destructive">{error ?? ''}</p></div>;
}
