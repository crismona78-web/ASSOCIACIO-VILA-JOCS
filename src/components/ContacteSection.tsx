import React, { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { SiteData } from '../types/site';
import { EditableText } from './EditableText';

interface ContacteSectionProps {
  section: SiteData['contacteSection'];
  isEditMode: boolean;
  onUpdateSection: (patch: Partial<SiteData['contacteSection']>) => void;
  requestedGame: string;
}

function normalizePhoneForWa(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('34')) return digits;
  return `34${digits}`;
}

export const ContacteSection: React.FC<ContacteSectionProps> = ({
  section,
  isEditMode,
  onUpdateSection,
  requestedGame,
}) => {
  const [name, setName] = useState('');
  const [contactInput, setContactInput] = useState('');
  const [level, setLevel] = useState<'adults' | 'newcomer' | 'family'>('adults');
  const [gameInterest, setGameInterest] = useState(requestedGame);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (requestedGame) {
      setGameInterest(requestedGame);
      setSubmitted(false);
    }
  }, [requestedGame]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Introdueix el teu nom per poder dirigir-nos a tu.');
      return;
    }
    if (!contactInput.trim() || contactInput.trim().length < 5) {
      setError('Indica un telèfon de WhatsApp o un correu electrònic vàlid.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const targetPhone =
    level === 'family' ? section.phoneKids : section.phoneAdults;

  const composedText = [
    `Hola VILA JOCS! Em dic ${name.trim() || 'un jugador'}.`,
    `Perfil: ${
      level === 'adults'
        ? 'Adults / estratègia'
        : level === 'newcomer'
        ? 'Jove a partir de 12 anys (autònom)'
        : 'Família'
    }.`,
    gameInterest.trim() ? `Joc d'interès: ${gameInterest.trim()}.` : '',
    message.trim() ? `Comentari: ${message.trim()}` : '',
    `Contacte: ${contactInput.trim()}`,
  ]
    .filter(Boolean)
    .join(' ');

  const waLink = `https://wa.me/${normalizePhoneForWa(
    targetPhone
  )}?text=${encodeURIComponent(composedText)}`;

  const mailtoLink = `mailto:${section.email}?subject=${encodeURIComponent(
    gameInterest
      ? `Sol·licitud de partida: ${gameInterest}`
      : 'Contacte Associació VILA JOCS'
  )}&body=${encodeURIComponent(composedText)}`;

  return (
    <section id="contacte" className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <EditableText
            as="p"
            label="Etiqueta Contacte"
            value={section.eyebrow}
            isEditMode={isEditMode}
            onChange={(eyebrow) => onUpdateSection({ eyebrow })}
            className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]"
          />
          <EditableText
            as="h2"
            label="Títol Contacte"
            value={section.title}
            isEditMode={isEditMode}
            onChange={(title) => onUpdateSection({ title })}
            className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#111418]"
          />
          <EditableText
            as="p"
            label="Subtítol Contacte"
            multiline
            value={section.subtitle}
            isEditMode={isEditMode}
            onChange={(subtitle) => onUpdateSection({ subtitle })}
            className="mt-3 text-base leading-relaxed text-neutral-600"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Direct Channels & Location Map Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border border-neutral-200 bg-[#F8F9FA] p-6 space-y-5">
              <div>
                <h3 className="font-display text-lg font-bold text-[#111418]">
                  Canals directes
                </h3>
                <EditableText
                  as="p"
                  label="Nota de contacte"
                  value={section.contactNote}
                  isEditMode={isEditMode}
                  onChange={(contactNote) => onUpdateSection({ contactNote })}
                  className="mt-1 text-xs text-neutral-500"
                />
              </div>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Telèfon / WhatsApp (Adults)
                    </div>
                    <div className="mt-0.5 flex items-center gap-3">
                      <EditableText
                        as="span"
                        label="Telèfon Adults"
                        value={section.phoneAdults}
                        isEditMode={isEditMode}
                        onChange={(phoneAdults) => onUpdateSection({ phoneAdults })}
                        className="font-mono font-semibold text-[#111418] tabular-nums"
                      />
                      {!isEditMode && (
                        <a
                          href={`https://wa.me/${normalizePhoneForWa(section.phoneAdults)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[#DC2626] hover:underline"
                        >
                          Obrir WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-neutral-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Telèfon / WhatsApp (Nens i Famílies)
                    </div>
                    <div className="mt-0.5 flex items-center gap-3">
                      <EditableText
                        as="span"
                        label="Telèfon Nens"
                        value={section.phoneKids}
                        isEditMode={isEditMode}
                        onChange={(phoneKids) => onUpdateSection({ phoneKids })}
                        className="font-mono font-semibold text-[#111418] tabular-nums"
                      />
                      {!isEditMode && (
                        <a
                          href={`https://wa.me/${normalizePhoneForWa(section.phoneKids)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-neutral-700 hover:underline"
                        >
                          Obrir WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-neutral-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Correu electrònic
                    </div>
                    <EditableText
                      as="div"
                      label="Correu electrònic"
                      value={section.email}
                      isEditMode={isEditMode}
                      onChange={(email) => onUpdateSection({ email })}
                      className="mt-0.5 font-medium text-[#111418] break-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex flex-wrap items-center gap-4 text-xs font-semibold">
                <a
                  href={section.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#111418] hover:text-[#DC2626]"
                >
                  Instagram ({section.instagramHandle})
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span aria-hidden="true" className="text-neutral-300">
                  ·
                </span>
                <a
                  href={section.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#111418] hover:text-[#DC2626]"
                >
                  Facebook ({section.facebookLabel})
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="rounded-xl border border-neutral-200 bg-[#F8F9FA] overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#DC2626] mt-1 shrink-0" />
                  <div>
                    <EditableText
                      as="h4"
                      label="Nom del local"
                      value={section.venueName}
                      isEditMode={isEditMode}
                      onChange={(venueName) => onUpdateSection({ venueName })}
                      className="font-display text-base font-bold text-[#111418]"
                    />
                    <EditableText
                      as="p"
                      label="Adreça del local"
                      value={section.address}
                      isEditMode={isEditMode}
                      onChange={(address) => onUpdateSection({ address })}
                      className="mt-0.5 text-xs leading-relaxed text-neutral-600"
                    />
                  </div>
                </div>
              </div>

              {/* Clean Architectural Vector Map of Vilafortuny Venue */}
              <div className="relative h-44 w-full border-t border-neutral-200 bg-[#ECEFF2] overflow-hidden">
                <svg
                  viewBox="0 0 400 180"
                  className="h-full w-full"
                  role="img"
                  aria-label="Mapa esquemàtic del Centre Cívic Vilafortuny a Cambrils"
                >
                  <rect width="400" height="180" fill="#ECEFF2" />
                  {/* Roads */}
                  <path d="M-20,30 L180,190" stroke="#FFFFFF" strokeWidth="10" fill="none" />
                  <path d="M120,185 L370,15" stroke="#D1D5DB" strokeWidth="14" fill="none" />
                  <path d="M120,185 L370,15" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
                  <path d="M290,-10 L355,140" stroke="#9CA3AF" strokeWidth="12" fill="none" />
                  <circle cx="325" cy="60" r="22" fill="#ECEFF2" stroke="#9CA3AF" strokeWidth="10" />
                  {/* Civic Center Footprint */}
                  <polygon
                    points="200,70 250,45 275,92 225,118"
                    fill="#D8DEE4"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                  />
                  {/* Labels */}
                  <text x="26" y="135" fontSize="9" fill="#6B7280" fontFamily="Plus Jakarta Sans, sans-serif">
                    Escola Mas Clariana
                  </text>
                  <text x="265" y="128" fontSize="9" fill="#374151" fontWeight="600" fontFamily="JetBrains Mono, monospace">
                    T-325
                  </text>
                  <text x="155" y="165" fontSize="8.5" fill="#4B5563" fontFamily="Plus Jakarta Sans, sans-serif">
                    Av. del Castell de Vilafortuny, 33
                  </text>
                  {/* Pin */}
                  <circle cx="238" cy="78" r="14" fill="#DC2626" fillOpacity="0.18" />
                  <circle cx="238" cy="78" r="6" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                <a
                  href={section.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-[#111418] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#DC2626] transition-colors"
                >
                  Obrir a Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Table / Game Request Form */}
          <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-[#F8F9FA] p-6 sm:p-8">
            <h3 className="font-display text-2xl font-bold text-[#111418]">
              Proposa una partida o vine a provar
            </h3>
            <p className="mt-1.5 text-sm text-neutral-600">
              Omple aquest formulari ràpid per preparar el missatge directe cap al grup de coordinació o el correu de l’associació.
            </p>

            {submitted ? (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-white p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display text-lg font-bold text-[#111418]">
                      Sol·licitud preparada per enviar
                    </h4>
                    <p className="mt-1 text-sm text-neutral-600">
                      Tria com vols fer arribar la teva petició a VILA JOCS (es preomplirà automàticament amb les teves dades):
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-[#F8F9FA] border border-neutral-200 p-3.5 text-xs text-neutral-700 font-mono">
                  {composedText}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#DC2626] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#B91C1C] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar per WhatsApp ({targetPhone})
                  </a>
                  <a
                    href={mailtoLink}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-[#111418] hover:bg-neutral-50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Enviar per correu
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-medium text-neutral-500 hover:text-[#111418] underline underline-offset-4 cursor-pointer"
                  >
                    Modificar dades
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="vj-name"
                      className="block text-xs font-semibold text-neutral-700 mb-1.5"
                    >
                      El teu nom *
                    </label>
                    <input
                      id="vj-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Marc Rovira"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-[#111418] focus:border-[#111418] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="vj-contact"
                      className="block text-xs font-semibold text-neutral-700 mb-1.5"
                    >
                      WhatsApp o Correu electrònic *
                    </label>
                    <input
                      id="vj-contact"
                      type="text"
                      required
                      value={contactInput}
                      onChange={(e) => setContactInput(e.target.value)}
                      placeholder="Ex: 600 123 456 / marc@..."
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-[#111418] focus:border-[#111418] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Tipus de taula que busques
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'adults', label: 'Adults / Estratègia' },
                        { id: 'newcomer', label: 'Joves (12+ autònoms)' },
                        { id: 'family', label: 'Famílies' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setLevel(opt.id)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          level === opt.id
                            ? 'border-[#111418] bg-[#111418] text-white'
                            : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="vj-game"
                    className="block text-xs font-semibold text-neutral-700 mb-1.5"
                  >
                    Joc de la ludoteca que t’agradaria provar (opcional)
                  </label>
                  <input
                    id="vj-game"
                    type="text"
                    value={gameInterest}
                    onChange={(e) => setGameInterest(e.target.value)}
                    placeholder="Ex: Terraforming Mars, Hegemony, Catan, Twilight Struggle..."
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-[#111418] focus:border-[#111418] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vj-msg"
                    className="block text-xs font-semibold text-neutral-700 mb-1.5"
                  >
                    Disponibilitat o comentari
                  </label>
                  <textarea
                    id="vj-msg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex: Som 2 jugadors interessats en provar un eurogame aquest divendres o dissabte..."
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-[#111418] focus:border-[#111418] focus:outline-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-red-600" role="alert">
                    {error}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#DC2626] px-5 py-3 text-sm font-semibold text-white hover:bg-[#B91C1C] transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Preparar sol·licitud de partida
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
