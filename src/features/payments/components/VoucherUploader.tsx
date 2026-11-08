'use client';
import { FileUploader } from '@/components/forms/FileUploader';
export function VoucherUploader({ file, onChange, error }: { file: File | null; onChange: (file: File | null) => void; error?: string }) { return <FileUploader label="Selecciona o arrastra tu comprobante" accept="image/png,image/jpeg,application/pdf" maxSizeMb={5} file={file} onFileChange={onChange} error={error} />; }
