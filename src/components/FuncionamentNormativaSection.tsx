import React, { useEffect, useState } from 'react';
import {
  FileText,
  ExternalLink,
  Upload,
  Download,
  Eye,
  X,
  Check,
  BookOpen,
} from 'lucide-react';
import { RuleDocument, SiteData } from '../types/site';
import { EditableText } from './EditableText';
import { resolveAssetUrl } from '../utils/assetUrl';
import { OFFICIAL_DOCUMENTS_TEXT } from '../data/officialDocumentsText';

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

function isEmbeddedInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export const FuncionamentNormativaSection: React.FC<FuncionamentNormativaSectionProps> = ({
  section,
  isEditMode,
  onUpdateSection,
  onUpdateDocument,
}) => {
  const [viewerDoc, setViewerDoc] = useState<RuleDocument | null>(null);
  const [viewerBlobUrl, setViewerBlobUrl] = useState<string | null>(null);
  const [viewerTab, setViewerTab] = useState<'text' | 'pdf'>('pdf');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const openDocumentModal = (doc: RuleDocument) => {
    const hasOfficialText =
      Boolean(OFFICIAL_DOCUMENTS_TEXT[doc.id]) && !doc.externalUrl.startsWith('data:');
    // Embedded iframes (e.g. preview frames) often block browser PDF plugins; default to clean readable text there.
    setViewerTab(hasOfficialText && isEmbeddedInIframe() ? 'text' : 'pdf');
    setViewerDoc(doc);
  };

  useEffect(() => {
    if (!viewerDoc?.externalUrl) {
      setViewerBlobUrl(null);
      return;
    }

    let cancelled = false;
    let createdObjectUrl: string | null = null;

    if (viewerDoc.externalUrl.startsWith('data:')) {
      try {
        createdObjectUrl = dataUrlToBlobUrl(viewerDoc.externalUrl);
        setViewerBlobUrl(createdObjectUrl);
      } catch {
        setViewerBlobUrl(null);
      }
    } else {
      const resolvedUrl = resolveAssetUrl(viewerDoc.externalUrl);
      setViewerBlobUrl(resolvedUrl);

      // Also fetch as Blob so embedded PDF viewer gets a same-origin blob URL when possible
      fetch(resolvedUrl)
        .then((res) => (res.ok ? res.blob() : null))
        .then((blob) => {
          if (!cancelled && blob) {
            createdObjectUrl = URL.createObjectURL(
              new Blob([blob], { type: 'application/pdf' })
            );
            setViewerBlobUrl(createdObjectUrl);
          }
        })
        .catch(() => {
          // Keep resolvedUrl fallback if fetch fails
        });
    }

    return () => {
      cancelled = true;
      if (createdObjectUrl) {
        URL.revokeObjectURL(createdObjectUrl);
      }
    };
  }, [viewerDoc]);

  const handleAttachPdf = (doc: RuleDocument, file: File) => {
    setUploadError(null);
    if (
      file.type &&
      file.type !== 'application/pdf' &&
      !file.name.toLowerCase().endsWith('.pdf')
    ) {
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

  const officialText =
    viewerDoc && !viewerDoc.externalUrl.startsWith('data:')
      ? OFFICIAL_DOCUMENTS_TEXT[viewerDoc.id]
      : undefined;

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
                      onClick={() => openDocumentModal(doc)}
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
                      href={resolveAssetUrl(doc.externalUrl)}
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

      {/* Embedded Document & PDF Viewer Modal */}
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

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {officialText && (
                  <div className="inline-flex items-center rounded-lg border border-neutral-300 bg-white p-0.5 mr-1">
                    <button
                      type="button"
                      onClick={() => setViewerTab('text')}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                        viewerTab === 'text'
                          ? 'bg-[#111418] text-white'
                          : 'text-neutral-600 hover:text-[#111418]'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Lectura directa
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewerTab('pdf')}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                        viewerTab === 'pdf'
                          ? 'bg-[#111418] text-white'
                          : 'text-neutral-600 hover:text-[#111418]'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      PDF original
                    </button>
                  </div>
                )}

                <a
                  href={viewerBlobUrl || resolveAssetUrl(viewerDoc.externalUrl)}
                  download={viewerDoc.fileName || `${viewerDoc.id}.pdf`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#111418] hover:border-[#111418]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descarregar
                </a>

                {!viewerDoc.externalUrl.startsWith('data:') && (
                  <a
                    href={resolveAssetUrl(viewerDoc.externalUrl)}
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

            <div className="flex-1 overflow-hidden bg-neutral-100">
              {viewerTab === 'text' && officialText ? (
                <div className="h-full overflow-y-auto bg-white px-5 py-8 sm:px-10">
                  <div className="mx-auto max-w-3xl space-y-8">
                    <div className="border-b border-neutral-200 pb-5">
                      <h4 className="font-display text-xl sm:text-2xl font-bold text-[#111418]">
                        {officialText.title}
                      </h4>
                      <p className="mt-1 text-xs font-mono text-neutral-500">
                        {officialText.subtitle}
                      </p>
                    </div>

                    {officialText.sections.map((sec) => (
                      <article key={sec.heading} className="space-y-3">
                        <h5 className="font-display text-base sm:text-lg font-bold text-[#DC2626]">
                          {sec.heading}
                        </h5>
                        <div className="space-y-2.5 text-sm leading-relaxed text-neutral-700">
                          {sec.paragraphs.map((p, idx) => (
                            <p key={idx}>{p}</p>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : viewerBlobUrl ? (
                <object
                  data={viewerBlobUrl}
                  type="application/pdf"
                  aria-label={viewerDoc.title}
                  className="h-full w-full bg-white"
                >
                  <iframe
                    title={viewerDoc.title}
                    src={viewerBlobUrl}
                    className="h-full w-full border-0 bg-white"
                  />
                </object>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-sm text-neutral-600">
                  <p>No s’ha pogut previsualitzar el PDF dins del navegador.</p>
                  <a
                    href={resolveAssetUrl(viewerDoc.externalUrl)}
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

