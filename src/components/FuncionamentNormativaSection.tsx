import React, { useEffect, useState } from 'react';
import { FileText, ExternalLink, Upload, Download, Eye, X, Check } from 'lucide-react';
import { RuleDocument, SiteData } from '../types/site';
import { EditableText } from './EditableText';

interface FuncionamentNormativaSectionProps {
  section: SiteData['funcionamentSection'];
  isEditMode: boolean;
  onUpdateSection: (patch: Partial<SiteData['funcionamentSection']>) => void;
  onUpdateDocument: (id: string, patch: Partial<RuleDocument>) => void;
}

function dataUrlToBlobUrl(dataUrl: string): string {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/data:([^;]+)/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mime });
  return URL.createObjectURL(blob);
}

export const FuncionamentNormativaSection: React.FC<FuncionamentNormativaSectionProps> = ({
  section,
  isEditMode,
  onUpdateSection,
  onUpdateDocument,
}) => {
  const [viewerDoc, setViewerDoc] = useState<RuleDocument | null>(null);
  const [viewerBlobUrl, setViewerBlobUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!viewerDoc?.externalUrl) {
      setViewerBlobUrl(null);
      return;
    }
    if (viewerDoc.externalUrl.startsWith('data:')) {
      try {
        const objectUrl = dataUrlToBlobUrl(viewerDoc.externalUrl);
        setViewerBlobUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      } catch {
        setViewerBlobUrl(null);
      }
    } else {
      setViewerBlobUrl(viewerDoc.externalUrl);
    }
  }, [viewerDoc]);

  const handleAttachPdf = (doc: RuleDocument, file: File) => {
    setUploadError(null);
    if (file.type && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Només es poden adjuntar fitxers en format PDF.');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => {
      setUploadError('No s’ha pogut llegir el fitxer PDF seleccionat.');
    };
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        onUpdateDocument(doc.id, {
          externalUrl: result,
          fileName: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="normativa" className="bg-white border-b border-neutral-200 py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl border-b border-neutral-200 pb-8">
          <EditableText
            as="p"
            label="Etiqueta Normativa"
            value={section.eyebrow}
            isEditMode={isEditMode}
            onChange={(eyebrow) => onUpdateSection({ eyebrow })}
            className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]"
          />
          <EditableText
            as="h2"
            label="Títol Normativa"
            value={section.normativaTitle}
            isEditMode={isEditMode}
            onChange={(normativaTitle) => onUpdateSection({ normativaTitle })}
            className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#111418]"
          />
          <EditableText
            as="p"
            label="Introducció Normativa"
            multiline
            value={section.normativaIntro}
            isEditMode={isEditMode}
            onChange={(normativaIntro) => onUpdateSection({ normativaIntro })}
            className="mt-3 text-base leading-relaxed text-neutral-600"
          />
        </div>

        {uploadError && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {uploadError}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {section.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-[#F7F7F5] p-6 sm:p-7"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <div className="rounded-lg border border-neutral-200 bg-white p-2.5 text-[#DC2626] shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <EditableText
                      as="h3"
                      label="Títol document"
                      value={doc.title}
                      isEditMode={isEditMode}
                      onChange={(title) => onUpdateDocument(doc.id, { title })}
                      className="font-display text-lg font-bold text-[#111418]"
                    />
                    <EditableText
                      as="p"
                      label="Subtítol document"
                      value={doc.subtitle}
                      isEditMode={isEditMode}
                      onChange={(subtitle) => onUpdateDocument(doc.id, { subtitle })}
                      className="mt-1 text-xs text-neutral-500"
                    />
                  </div>
                </div>

                <EditableText
                  as="p"
                  label="Resum document"
                  multiline
                  value={doc.summary}
                  isEditMode={isEditMode}
                  onChange={(summary) => onUpdateDocument(doc.id, { summary })}
                  className="mt-4 text-sm leading-relaxed text-neutral-700"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {doc.externalUrl ? (
                    <button
                      type="button"
                      onClick={() => setViewerDoc(doc)}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C] transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Veure document PDF</span>
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-neutral-500">
                      Cap PDF adjuntat encara
                    </span>
                  )}

                  {doc.externalUrl && (
                    <a
                      href={doc.externalUrl}
                      download={doc.fileName || `${doc.id}.pdf`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111418] hover:text-[#DC2626] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descarregar PDF</span>
                    </a>
                  )}
                </div>

                {isEditMode && (
                  <div className="rounded-lg border border-amber-300/80 bg-amber-50/70 p-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-amber-950">
                      <span className="font-semibold">Fitxer PDF: </span>
                      <span className="font-mono text-[11px] break-all">
                        {doc.fileName ||
                          (doc.externalUrl
                            ? doc.externalUrl.split('/').pop()
                            : 'Sense fitxer')}
                      </span>
                    </div>

                    <label className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#111418] hover:border-[#DC2626] hover:text-[#DC2626] transition-colors cursor-pointer whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>{doc.externalUrl ? 'Canviar PDF' : 'Adjuntar PDF'}</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleAttachPdf(doc, file);
                            e.target.value = '';
                          }
                        }}
                        className="sr-only"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded In-Page PDF Viewer Modal (works reliably inside iframes) */}
      {viewerDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-xs"
          onClick={() => setViewerDoc(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl text-[#111418]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-3.5 bg-[#F7F7F5]">
              <div className="min-w-0">
                <h3 className="font-display text-base sm:text-lg font-bold truncate">
                  {viewerDoc.title}
                </h3>
                {viewerDoc.fileName && (
                  <p className="text-[11px] font-mono text-neutral-500 flex items-center gap-1 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-600" />
                    {viewerDoc.fileName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={viewerBlobUrl || viewerDoc.externalUrl}
                  download={viewerDoc.fileName || `${viewerDoc.id}.pdf`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#111418] hover:border-[#111418]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descarregar
                </a>
                {!viewerDoc.externalUrl.startsWith('data:') && (
                  <a
                    href={viewerDoc.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#B91C1C]"
                  >
                    Obrir en pestanya nova
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setViewerDoc(null)}
                  aria-label="Tancar visor PDF"
                  className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-200/70 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-neutral-200">
              {viewerBlobUrl ? (
                <iframe
                  title={viewerDoc.title}
                  src={viewerBlobUrl}
                  className="h-full w-full border-0 bg-white"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-sm text-neutral-600">
                  <p>No s’ha pogut previsualitzar el PDF dins del navegador.</p>
                  <a
                    href={viewerDoc.externalUrl}
                    download={viewerDoc.fileName || `${viewerDoc.id}.pdf`}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white"
                  >
                    <Download className="w-4 h-4" />
                    Descarregar document PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
