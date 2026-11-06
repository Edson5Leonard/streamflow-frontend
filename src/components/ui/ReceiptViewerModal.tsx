'use client';

import { useState } from 'react';
import { RotateCcw, RotateCw, X, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';

interface ReceiptViewerModalProps {
  open: boolean;
  src: string | null;
  mimeType?: string;
  onClose: () => void;
}

export function ReceiptViewerModal({ open, src, mimeType, onClose }: ReceiptViewerModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!open || !src) return null;

  const pdf = mimeType === 'application/pdf' || src.toLowerCase().includes('.pdf');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Visor de comprobante"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <p className="text-sm font-semibold text-slate-200">Comprobante de pago</p>
          <div className="flex items-center gap-1">
            {!pdf && (
              <>
                <button aria-label="Alejar" onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))} className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><ZoomOut size={17} /></button>
                <button aria-label="Acercar" onClick={() => setZoom((value) => Math.min(3, value + 0.25))} className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><ZoomIn size={17} /></button>
                <button aria-label="Rotar a la izquierda" onClick={() => setRotation((value) => value - 90)} className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><RotateCcw size={17} /></button>
                <button aria-label="Rotar a la derecha" onClick={() => setRotation((value) => value + 90)} className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><RotateCw size={17} /></button>
              </>
            )}
            <button aria-label="Cerrar" onClick={onClose} className="ml-2 rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X size={18} /></button>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-auto bg-slate-950 p-4">
          {pdf ? (
            <iframe title="Comprobante PDF" src={src} className="h-[75vh] w-full rounded-lg bg-white" />
          ) : (
            <div className="flex min-h-full items-center justify-center overflow-auto">
              <Image
                src={src}
                alt="Captura del comprobante"
                width={1600}
                height={1200}
                unoptimized
                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                className="max-h-[72vh] max-w-full object-contain transition-transform duration-200"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
