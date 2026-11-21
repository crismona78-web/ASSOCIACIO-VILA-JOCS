import React, { useState } from 'react';
import { Expand, ImagePlus, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryPhoto, SiteData } from '../types/site';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

interface GaleriaSectionProps {
  section: SiteData['galeriaSection'];
  isEditMode: boolean;
  onUpdateSection: (patch: Partial<SiteData['galeriaSection']>) => void;
  onUpdatePhoto: (id: string, patch: Partial<GalleryPhoto>) => void;
  onAddPhoto: () => void;
  onDeletePhoto: (id: string) => void;
}

export const GaleriaSection: React.FC<GaleriaSectionProps> = ({
  section,
  isEditMode,
  onUpdateSection,
  onUpdatePhoto,
  onAddPhoto,
  onDeletePhoto,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activePhoto =
    lightboxIndex !== null ? section.photos[lightboxIndex] ?? null : null;

  return (
    <section id="galeria" className="bg-[#F6F7F8] border-b border-neutral-200 py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <EditableText
              as="p"
              label="Etiqueta Galeria"
              value={section.eyebrow}
              isEditMode={isEditMode}
              onChange={(eyebrow) => onUpdateSection({ eyebrow })}
              className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]"
            />
            <EditableText
              as="h2"
              label="Títol Galeria"
              value={section.title}
              isEditMode={isEditMode}
              onChange={(title) => onUpdateSection({ title })}
              className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#111418]"
            />
            <EditableText
              as="p"
              label="Subtítol Galeria"
              multiline
              value={section.subtitle}
              isEditMode={isEditMode}
              onChange={(subtitle) => onUpdateSection({ subtitle })}
              className="mt-3 text-base leading-relaxed text-neutral-600"
            />
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={onAddPhoto}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#B91C1C] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ImagePlus className="w-4 h-4" />
              Afegir foto
            </button>
          )}
        </div>

        {/* Clean Responsive Uniform Gallery Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.photos.map((photo, index) => (
            <figure
              key={photo.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white"
            >
              <div className="relative w-full aspect-[4/3] bg-neutral-200">
                <EditableImage
                  src={photo.image}
                  alt={photo.alt}
                  isEditMode={isEditMode}
                  onChange={(image, alt) =>
                    onUpdatePhoto(photo.id, { image, alt })
                  }
                  containerClassName="h-full w-full"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  aspectFallbackLabel={photo.caption}
                />

                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`Ampliar foto: ${photo.caption}`}
                    className="absolute bottom-3 right-3 rounded-lg bg-[#111418]/80 p-2 text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Expand className="w-4 h-4" />
                  </button>
                )}

                {isEditMode && section.photos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDeletePhoto(photo.id)}
                    aria-label="Eliminar foto"
                    className="absolute top-3 left-3 z-20 rounded-lg bg-red-600/90 p-1.5 text-white hover:bg-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <figcaption className="flex items-center justify-between gap-3 px-4 py-3 border-t border-neutral-100">
                <EditableText
                  as="span"
                  label="Peu de foto"
                  value={photo.caption}
                  isEditMode={isEditMode}
                  onChange={(caption) => onUpdatePhoto(photo.id, { caption })}
                  className="text-xs sm:text-sm font-medium text-[#111418]"
                />
                <EditableText
                  as="span"
                  label="Etiqueta joc"
                  value={photo.gameTag}
                  isEditMode={isEditMode}
                  onChange={(gameTag) => onUpdatePhoto(photo.id, { gameTag })}
                  className="text-xs font-mono text-neutral-500 whitespace-nowrap shrink-0"
                />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox Viewer */}
      {activePhoto && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Tancar imatge"
            className="absolute top-4 right-4 rounded-lg bg-white/10 p-2.5 text-white hover:bg-white/20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + section.photos.length) % section.photos.length
              );
            }}
            aria-label="Foto anterior"
            className="absolute left-3 sm:left-6 rounded-lg bg-white/10 p-2.5 text-white hover:bg-white/20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full flex flex-col items-center"
          >
            <img
              src={activePhoto.image}
              alt={activePhoto.alt}
              referrerPolicy="no-referrer"
              className="max-h-[78vh] w-auto rounded-lg object-contain"
            />
            <div className="mt-3 flex items-center gap-3 text-sm text-neutral-200">
              <span>{activePhoto.caption}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-xs text-neutral-400">
                {activePhoto.gameTag}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % section.photos.length);
            }}
            aria-label="Foto següent"
            className="absolute right-3 sm:right-6 rounded-lg bg-white/10 p-2.5 text-white hover:bg-white/20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
};
