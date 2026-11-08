export type UploadOptions = { maxSizeBytes?: number; accept?: string[] };

export function validateUpload(file: File, options: UploadOptions = {}) {
  if (options.maxSizeBytes && file.size > options.maxSizeBytes) throw new Error('El archivo supera el tamaño permitido.');
  if (options.accept?.length && !options.accept.includes(file.type)) throw new Error('El formato del archivo no está permitido.');
}

export function createLocalFileUrl(file: File) { return URL.createObjectURL(file); }
export function revokeLocalFileUrl(url: string) { URL.revokeObjectURL(url); }
