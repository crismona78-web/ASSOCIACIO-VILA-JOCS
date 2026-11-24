import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Link as LinkIcon, Check, X } from 'lucide-react';
import { AVAILABLE_CLUB_IMAGES } from '../data/defaultSiteData';
import { resolveAssetUrl } from '../utils/assetUrl';

interface EditableImageProps {
  src: string;
  alt: string;
  isEditMode: boolean;
  onChange: (nextSrc: string, nextAlt: string) => void;
  className?: string;
  containerClassName?: string;
  aspectFallbackLabel?: string;
}

function resizeImageToDataUrl(file: File, maxWidth = 1280): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No s’ha pogut llegir el fitxer'));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Format d’imatge no vàlid'));
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  isEditMode,
  onChange,
  className = '',
  containerClassName = '',
  aspectFallbackLabel = 'Imatge VILA JOCS',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(src);
  const [altDraft, setAltDraft] = useState(alt);
  const [uploadError, setUploadError] = useState('');

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUrlDraft(src);
    setAltDraft(alt);
    setUploadError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadError('');
      const dataUrl = await resizeImageToDataUrl(file);
      setUrlDraft(dataUrl);
      setHasError(false);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error pujant la imatge');
    }
  };

  const handleApply = () => {
    const nextUrl = urlDraft.trim() || src;
    const nextAlt = altDraft.trim() || alt;
    setHasError(false);
    onChange(nextUrl, nextAlt);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`relative overflow-hidden ${containerClassName}`}>
        {hasError || !src ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-200 text-neutral-600 p-6 text-center">
            <ImageIcon className="w-8 h-8 mb-2 opacity-60" />
            <span className="text-xs font-medium">{aspectFallbackLabel}</span>
          </div>
        ) : (
          <img
            src={resolveAssetUrl(src)}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className={className}
          />
        )}

        {isEditMode && (
          <button
            type="button"
            onClick={openModal}
            className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-lg bg-[#111418]/90 px-3 py-1.5 text-xs font-medium text-white shadow-md ring-1 ring-white/25 hover:bg-[#DC2626] transition-colors cursor-pointer whitespace-nowrap"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Canviar imatge
          </button>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl text-[#111418]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-5">
              <div>
                <h3 className="font-display text-lg font-semibold">Editar imatge</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Puja una fotografia del teu dispositiu, enganxa una URL o tria de l’arxiu del club.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer"
                aria-label="Tancar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="h-44 w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 flex items-center justify-center">
                {urlDraft ? (
                  <img
                    src={resolveAssetUrl(urlDraft)}
                    alt={altDraft}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-neutral-500">Vista prèvia</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-2.5 text-xs font-medium text-neutral-800 hover:border-[#DC2626] hover:bg-neutral-100 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-[#DC2626]" />
                  <span>Pujar fitxer local</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>

                <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
                  <LinkIcon className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="url"
                    value={urlDraft.startsWith('data:') ? '' : urlDraft}
                    placeholder="O enganxa URL (https://...)"
                    onChange={(e) => setUrlDraft(e.target.value)}
                    className="w-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              {uploadError && (
                <p className="text-xs font-medium text-red-600">{uploadError}</p>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  O selecciona una imatge existent del club
                </label>
                <select
                  value={AVAILABLE_CLUB_IMAGES.some((i) => i.path === urlDraft) ? urlDraft : ''}
                  onChange={(e) => {
                    if (e.target.value) setUrlDraft(e.target.value);
                  }}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 focus:border-[#111418] focus:outline-none"
                >
                  <option value="">-- Galeria interna de VILA JOCS --</option>
                  {AVAILABLE_CLUB_IMAGES.map((item) => (
                    <option key={item.path} value={item.path}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Descripció de la imatge (text alternatiu)
                </label>
                <input
                  type="text"
                  value={altDraft}
                  onChange={(e) => setAltDraft(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-900 focus:border-[#111418] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-200 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel·lar
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#111418] px-4 py-2 text-xs font-medium text-white hover:bg-[#DC2626] transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Desar imatge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
