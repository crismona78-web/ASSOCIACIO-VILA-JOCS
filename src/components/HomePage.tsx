import React from 'react';
import {
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  BookOpen,
  Images,
  FileCheck2,
  Building2,
} from 'lucide-react';
import { FeaturedGame, PageId, PlayerTrack, SiteData } from '../types/site';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

interface HomePageProps {
  home: SiteData['home'];
  contacte: SiteData['contacteSection'];
  isEditMode: boolean;
  onUpdateHome: (patch: Partial<SiteData['home']>) => void;
  onUpdateContacte: (patch: Partial<SiteData['contacteSection']>) => void;
  onUpdateTrack: (id: string, patch: Partial<PlayerTrack>) => void;
  onUpdateFeaturedGame: (id: string, patch: Partial<FeaturedGame>) => void;
  onNavigate: (page: PageId) => void;
  onRequestGameTable: (gameTitle: string) => void;
  onActivateEditMode: () => void;
}

function normalizePhoneForWa(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('34') ? digits : `34${digits}`;
}

export const HomePage: React.FC<HomePageProps> = ({
  home,
  contacte,
  isEditMode,
  onUpdateHome,
  onUpdateContacte,
  onUpdateTrack,
  onUpdateFeaturedGame,
  onNavigate,
  onRequestGameTable,
  onActivateEditMode,
}) => {
  return (
    <div className="bg-[#F7F7F5] text-[#1C1917]">
      {/* 1. Light Editorial Portada / Presentació */}
      <section className="bg-white border-b border-stone-200">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left: Humanized Association Introduction */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <EditableText
                  as="p"
                  label="Línia superior portada"
                  value={home.kicker}
                  isEditMode={isEditMode}
                  onChange={(kicker) => onUpdateHome({ kicker })}
                  className="text-xs font-semibold uppercase tracking-widest text-[#4D7C0F]"
                />

                <EditableText
                  as="h1"
                  label="Titular principal portada"
                  multiline
                  value={home.headline}
                  isEditMode={isEditMode}
                  onChange={(headline) => onUpdateHome({ headline })}
                  className="mt-3 font-display text-[clamp(2.1rem,3.6vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-[#1C1917] [text-wrap:balance]"
                />

                <div className="mt-5 space-y-3.5 text-base leading-relaxed text-stone-600">
                  <EditableText
                    as="p"
                    label="Primer paràgraf de benvinguda"
                    multiline
                    value={home.introParagraph1}
                    isEditMode={isEditMode}
                    onChange={(introParagraph1) => onUpdateHome({ introParagraph1 })}
                  />
                  <EditableText
                    as="p"
                    label="Segon paràgraf de comunitat"
                    multiline
                    value={home.introParagraph2}
                    isEditMode={isEditMode}
                    onChange={(introParagraph2) => onUpdateHome({ introParagraph2 })}
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('ludoteca')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#DC2626] px-5 py-3 text-sm font-semibold text-white hover:bg-[#B91C1C] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <EditableText
                    as="span"
                    label="Botó principal portada"
                    value={home.primaryCta}
                    isEditMode={isEditMode}
                    onChange={(primaryCta) => onUpdateHome({ primaryCta })}
                  />
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Tabletop-only photo (ZERO people) + Vine a provar callout */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-4">
              <div className="relative flex-1 min-h-[290px] lg:min-h-[380px] rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                <EditableImage
                  src={home.tabletopImage}
                  alt={home.tabletopImageAlt}
                  isEditMode={isEditMode}
                  onChange={(tabletopImage, tabletopImageAlt) =>
                    onUpdateHome({ tabletopImage, tabletopImageAlt })
                  }
                  containerClassName="h-full w-full"
                  className="h-full w-full object-cover object-center"
                  aspectFallbackLabel="Tauler de joc a Vila Jocs"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 pt-12">
                  <div className="pointer-events-auto">
                    <EditableText
                      as="p"
                      label="Peu de foto tauler"
                      value={home.tabletopImageCaption}
                      isEditMode={isEditMode}
                      onChange={(tabletopImageCaption) =>
                        onUpdateHome({ tabletopImageCaption })
                      }
                      className="text-xs sm:text-sm font-medium text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Clean Light Visit / Trial Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-stone-200 bg-[#F7F7F5] px-5 py-4">
                <div>
                  <EditableText
                    as="p"
                    label="Títol benvinguda"
                    value={home.quotaTitle}
                    isEditMode={isEditMode}
                    onChange={(quotaTitle) => onUpdateHome({ quotaTitle })}
                    className="font-display text-base font-bold text-[#DC2626]"
                  />
                  <EditableText
                    as="p"
                    label="Nota benvinguda"
                    value={home.quotaNote}
                    isEditMode={isEditMode}
                    onChange={(quotaNote) => onUpdateHome({ quotaNote })}
                    className="text-xs sm:text-sm text-stone-600 mt-0.5"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('contacte')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#DC2626] hover:text-[#B91C1C] underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
                >
                  <span>Contacta per provar un dia</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Section Navigation Hub (Multi-Page Entry Buttons) */}
          <div className="mt-12 pt-8 border-t border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-5">
            <button
              type="button"
              onClick={() => onNavigate('ludoteca')}
              className="group flex items-start justify-between gap-4 rounded-xl border border-stone-200 bg-[#F7F7F5] p-5 text-left hover:border-stone-400 hover:bg-white transition-colors cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4D7C0F]">
                  <BookOpen className="w-4 h-4" />
                  <span>Catàleg interactiu</span>
                </div>
                <h2 className="mt-2 font-display text-lg font-bold text-[#1C1917]">
                  Ludoteca de jocs
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-stone-600">
                  Cerca entre més de 150 jocs per nivell d’estratègia o jugadors i demana’ns el que vulguis provar.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#DC2626] shrink-0 mt-1 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('normativa')}
              className="group flex items-start justify-between gap-4 rounded-xl border border-stone-200 bg-[#F7F7F5] p-5 text-left hover:border-stone-400 hover:bg-white transition-colors cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4D7C0F]">
                  <FileCheck2 className="w-4 h-4" />
                  <span>Documentació oficial</span>
                </div>
                <h2 className="mt-2 font-display text-lg font-bold text-[#1C1917]">
                  Normativa
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-stone-600">
                  Consulta la normativa de l’associació, els Estatuts de constitució i el Reglament de Règim Intern.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#DC2626] shrink-0 mt-1 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('galeria')}
              className="group flex items-start justify-between gap-4 rounded-xl border border-stone-200 bg-[#F7F7F5] p-5 text-left hover:border-stone-400 hover:bg-white transition-colors cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4D7C0F]">
                  <Images className="w-4 h-4" />
                  <span>Ambient del local</span>
                </div>
                <h2 className="mt-2 font-display text-lg font-bold text-[#1C1917]">
                  Galeria de sessions
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-stone-600">
                  Descobreix fotografies reals de les nostres tardes de joc i els taulers que despleguem.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#DC2626] shrink-0 mt-1 transition-colors" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Ubicació, Horari, Dades de Contacte + Espai per a la foto de l'edifici */}
      <section className="border-b border-stone-200 py-14 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
              Informació pràctica
            </p>
            <EditableText
              as="h2"
              label="Títol ubicació i horari"
              value={home.buildingSectionTitle}
              isEditMode={isEditMode}
              onChange={(buildingSectionTitle) =>
                onUpdateHome({ buildingSectionTitle })
              }
              className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1C1917]"
            />
            <EditableText
              as="p"
              label="Subtítol foto edifici"
              multiline
              value={home.buildingSectionSubtitle}
              isEditMode={isEditMode}
              onChange={(buildingSectionSubtitle) =>
                onUpdateHome({ buildingSectionSubtitle })
              }
              className="mt-2.5 text-base leading-relaxed text-stone-600"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Dedicated Building Photo Space */}
            <div className="lg:col-span-6 flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
              <div className="relative flex-1 min-h-[260px] sm:min-h-[320px] bg-stone-100">
                {home.buildingImage || isEditMode ? (
                  <EditableImage
                    src={home.buildingImage}
                    alt={home.buildingImageAlt}
                    isEditMode={isEditMode}
                    onChange={(buildingImage, buildingImageAlt) =>
                      onUpdateHome({ buildingImage, buildingImageAlt })
                    }
                    containerClassName="h-full w-full"
                    className="h-full w-full object-cover"
                    aspectFallbackLabel="Espai per a la foto de l'edifici · Clica «Canviar imatge» per pujar-la"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-[#F1F0EC]">
                    <div className="rounded-full border border-stone-300 bg-white p-4 text-stone-500">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-[#1C1917]">
                      Espai reservat per a la foto de l’edifici
                    </h3>
                    <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-stone-600">
                      Puja aquí una fotografia del Centre Cívic Vilafortuny perquè els nous visitants reconeguin fàcilment l’entrada.
                    </p>
                    <button
                      type="button"
                      onClick={onActivateEditMode}
                      className="mt-4 rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-[#1C1917] hover:border-[#DC2626] hover:text-[#DC2626] transition-colors cursor-pointer"
                    >
                      Pujar foto de l’edifici
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-stone-200 px-5 py-3.5 flex items-center justify-between gap-3 bg-white">
                <EditableText
                  as="p"
                  label="Peu foto edifici"
                  value={home.buildingCaption}
                  isEditMode={isEditMode}
                  onChange={(buildingCaption) => onUpdateHome({ buildingCaption })}
                  className="text-xs font-medium text-stone-600"
                />
                <a
                  href={contacte.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#DC2626] hover:underline whitespace-nowrap shrink-0"
                >
                  Veure mapa
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right: Ubicació, Horari i Dades de Contacte */}
            <div className="lg:col-span-6 rounded-xl border border-stone-200 bg-white p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                {/* Ubicació */}
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Ubicació
                    </h3>
                    <EditableText
                      as="p"
                      label="Nom del local"
                      value={contacte.venueName}
                      isEditMode={isEditMode}
                      onChange={(venueName) => onUpdateContacte({ venueName })}
                      className="mt-1 font-display text-lg font-bold text-[#1C1917]"
                    />
                    <EditableText
                      as="p"
                      label="Adreça"
                      value={contacte.address}
                      isEditMode={isEditMode}
                      onChange={(address) => onUpdateContacte({ address })}
                      className="mt-0.5 text-sm text-stone-600"
                    />
                  </div>
                </div>

                {/* Horari */}
                <div className="flex items-start gap-3.5 pt-5 border-t border-stone-100">
                  <Clock className="w-5 h-5 text-[#4D7C0F] shrink-0 mt-0.5" />
                  <div>
                    <EditableText
                      as="h3"
                      label="Títol horari"
                      value={home.scheduleTitle}
                      isEditMode={isEditMode}
                      onChange={(scheduleTitle) => onUpdateHome({ scheduleTitle })}
                      className="text-xs font-semibold uppercase tracking-wider text-stone-500"
                    />
                    <EditableText
                      as="p"
                      label="Horari principal"
                      value={home.scheduleText}
                      isEditMode={isEditMode}
                      onChange={(scheduleText) => onUpdateHome({ scheduleText })}
                      className="mt-1 text-sm font-semibold text-[#1C1917]"
                    />
                    <EditableText
                      as="p"
                      label="Detall horari"
                      multiline
                      value={home.scheduleSubnote}
                      isEditMode={isEditMode}
                      onChange={(scheduleSubnote) =>
                        onUpdateHome({ scheduleSubnote })
                      }
                      className="mt-1 text-xs leading-relaxed text-stone-600"
                    />
                  </div>
                </div>

                {/* Dades de contacte */}
                <div className="flex items-start gap-3.5 pt-5 border-t border-stone-100">
                  <Phone className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                  <div className="w-full space-y-2.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Dades de contacte
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-stone-200 bg-[#F7F7F5] px-3.5 py-2.5">
                        <div className="text-[11px] font-medium text-stone-500">
                          WhatsApp Adults
                        </div>
                        <div className="mt-0.5 flex items-center justify-between gap-2">
                          <EditableText
                            as="span"
                            label="Telèfon Adults"
                            value={contacte.phoneAdults}
                            isEditMode={isEditMode}
                            onChange={(phoneAdults) =>
                              onUpdateContacte({ phoneAdults })
                            }
                            className="font-mono font-semibold text-[#1C1917] tabular-nums"
                          />
                          {!isEditMode && (
                            <a
                              href={`https://wa.me/${normalizePhoneForWa(
                                contacte.phoneAdults
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-[#DC2626] hover:underline"
                            >
                              Xat
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border border-stone-200 bg-[#F7F7F5] px-3.5 py-2.5">
                        <div className="text-[11px] font-medium text-stone-500">
                          WhatsApp Nens / Famílies
                        </div>
                        <div className="mt-0.5 flex items-center justify-between gap-2">
                          <EditableText
                            as="span"
                            label="Telèfon Nens"
                            value={contacte.phoneKids}
                            isEditMode={isEditMode}
                            onChange={(phoneKids) =>
                              onUpdateContacte({ phoneKids })
                            }
                            className="font-mono font-semibold text-[#1C1917] tabular-nums"
                          />
                          {!isEditMode && (
                            <a
                              href={`https://wa.me/${normalizePhoneForWa(
                                contacte.phoneKids
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-[#4D7C0F] hover:underline"
                            >
                              Xat
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-stone-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-stone-500" />
                        <EditableText
                          as="span"
                          label="Correu electrònic"
                          value={contacte.email}
                          isEditMode={isEditMode}
                          onChange={(email) => onUpdateContacte({ email })}
                          className="font-medium text-[#1C1917]"
                        />
                      </span>
                      <span aria-hidden="true">·</span>
                      <a
                        href={contacte.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#1C1917] hover:text-[#DC2626]"
                      >
                        Instagram ({contacte.instagramHandle})
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('contacte')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1C1917] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#DC2626] transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Anar al formulari de contacte
                </button>
                <span className="text-xs text-stone-500">
                  Vine a provar sense compromís
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Perfils de comunitat + Mostra de jocs sense persones */}
      <section className="bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          {/* 3-tier Tracks */}
          <div>
            <EditableText
              as="h2"
              label="Títol perfils portada"
              value={home.tracksTitle}
              isEditMode={isEditMode}
              onChange={(tracksTitle) => onUpdateHome({ tracksTitle })}
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917]"
            />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
              {home.tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex flex-col justify-between rounded-xl border border-stone-200 bg-[#F7F7F5] p-5"
                >
                  <div>
                    <EditableText
                      as="h3"
                      label="Nom del perfil"
                      value={track.title}
                      isEditMode={isEditMode}
                      onChange={(title) => onUpdateTrack(track.id, { title })}
                      className="font-display text-lg font-bold text-[#1C1917]"
                    />
                    <EditableText
                      as="p"
                      label="Subtítol perfil"
                      value={track.audience}
                      isEditMode={isEditMode}
                      onChange={(audience) => onUpdateTrack(track.id, { audience })}
                      className="mt-0.5 text-xs font-medium text-[#4D7C0F]"
                    />
                    <EditableText
                      as="p"
                      label="Descripció perfil"
                      multiline
                      value={track.description}
                      isEditMode={isEditMode}
                      onChange={(description) =>
                        onUpdateTrack(track.id, { description })
                      }
                      className="mt-2.5 text-sm leading-relaxed text-stone-600"
                    />
                  </div>
                  <p className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-500">
                    <span className="font-semibold text-stone-700">Jocs coneguts: </span>
                    <EditableText
                      as="span"
                      label="Referències de jocs"
                      value={track.examples}
                      isEditMode={isEditMode}
                      onChange={(examples) =>
                        onUpdateTrack(track.id, { examples })
                      }
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 6 Uniform Featured Game Cards (NO people in images) */}
          <div className="mt-14 pt-12 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <EditableText
                  as="h2"
                  label="Títol taules destacades"
                  value={home.tabletopHighlightsTitle}
                  isEditMode={isEditMode}
                  onChange={(tabletopHighlightsTitle) =>
                    onUpdateHome({ tabletopHighlightsTitle })
                  }
                  className="font-display text-2xl sm:text-3xl font-bold text-[#1C1917]"
                />
                <EditableText
                  as="p"
                  label="Subtítol taules destacades"
                  value={home.tabletopHighlightsSubtitle}
                  isEditMode={isEditMode}
                  onChange={(tabletopHighlightsSubtitle) =>
                    onUpdateHome({ tabletopHighlightsSubtitle })
                  }
                  className="mt-1 text-sm text-stone-600"
                />
              </div>
              <button
                type="button"
                onClick={() => onNavigate('ludoteca')}
                className="text-xs font-semibold text-[#DC2626] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Veure tota la ludoteca →
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
              {home.featuredGames.map((game) => (
                <article
                  key={game.id}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-[#F7F7F5]"
                >
                  <div
                    className={`h-36 sm:h-40 w-full shrink-0 ${
                      game.imageFit === 'contain' ? 'bg-[#F1F0EC] p-2' : 'bg-stone-200'
                    }`}
                  >
                    <EditableImage
                      src={game.image}
                      alt={game.imageAlt}
                      isEditMode={isEditMode}
                      onChange={(image, imageAlt) =>
                        onUpdateFeaturedGame(game.id, { image, imageAlt })
                      }
                      containerClassName="h-full w-full"
                      className={`h-full w-full ${
                        game.imageFit === 'contain' ? 'object-contain' : 'object-cover'
                      }`}
                      aspectFallbackLabel={game.title}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <p className="text-[11px] font-mono text-stone-500 tabular-nums">
                        {game.players} jug. · {game.duration}
                      </p>
                      <EditableText
                        as="h3"
                        label="Nom del joc"
                        value={game.title}
                        isEditMode={isEditMode}
                        onChange={(title) =>
                          onUpdateFeaturedGame(game.id, { title })
                        }
                        className="mt-0.5 font-display text-[15px] font-bold leading-snug text-[#1C1917]"
                      />
                      <EditableText
                        as="p"
                        label="Descripció curta joc"
                        multiline
                        value={game.description}
                        isEditMode={isEditMode}
                        onChange={(description) =>
                          onUpdateFeaturedGame(game.id, { description })
                        }
                        className="mt-1.5 text-xs leading-snug text-stone-600"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => onRequestGameTable(game.title)}
                      className="mt-3 pt-2.5 border-t border-stone-200 text-left text-xs font-semibold text-[#1C1917] hover:text-[#DC2626] cursor-pointer"
                    >
                      Demanar partida →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
