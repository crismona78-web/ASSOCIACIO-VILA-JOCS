import React, { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, Plus, ImagePlus, CheckCircle2 } from 'lucide-react';

interface EditToolbarProps {
  onAddGame: () => void;
  onAddPhoto: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onResetDefaults: () => void;
  lastSavedAt: string | null;
}

export const EditToolbar: React.FC<EditToolbarProps> = ({
  onAddGame,
  onAddPhoto,
  onExportJson,
  onImportJson,
  onResetDefaults,
  lastSavedAt,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="border-b border-amber-300/70 bg-amber-50 text-[#111418]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="text-xs font-semibold text-amber-900">
            Mode d’edició manual actiu
          </span>
          <span className="text-xs text-amber-800/80">
            Clica qualsevol text per modificar-lo o «Canviar imatge» per pujar fotos noves. El logotip oficial es manté protegit.
          </span>
          {lastSavedAt && (
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Desat ({lastSavedAt})
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAddGame}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-[#111418] hover:bg-amber-100/70 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-[#DC2626]" />
            Afegir joc
          </button>

          <button
            type="button"
            onClick={onAddPhoto}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-[#111418] hover:bg-amber-100/70 transition-colors cursor-pointer whitespace-nowrap"
          >
            <ImagePlus className="w-3.5 h-3.5 text-[#DC2626]" />
            Afegir foto
          </button>

          <button
            type="button"
            onClick={onExportJson}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar JSON
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            Importar JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onImportJson(file);
                e.target.value = '';
              }
            }}
            className="sr-only"
          />

          {confirmReset ? (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-2.5 py-1">
              <span className="text-xs font-medium text-red-800">Segur?</span>
              <button
                type="button"
                onClick={() => {
                  onResetDefaults();
                  setConfirmReset(false);
                }}
                className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
              >
                Restaurar
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded px-2 py-0.5 text-xs text-neutral-700 hover:bg-white cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar original
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
