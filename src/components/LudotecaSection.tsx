import React, { useMemo, useState } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  MessageCircle,
} from 'lucide-react';
import { BoardGame, GameTrack, SiteData } from '../types/site';
import { EditableText } from './EditableText';

interface LudotecaSectionProps {
  section: SiteData['ludotecaSection'];
  isEditMode: boolean;
  onUpdateSection: (patch: Partial<SiteData['ludotecaSection']>) => void;
  onSaveGame: (game: BoardGame) => void;
  onDeleteGame: (id: string) => void;
  onRequestGameTable: (gameTitle: string) => void;
  externalAddTrigger?: number;
}

const TRACK_LABELS: Record<GameTrack, string> = {
  expert: 'Expert & Heavy',
  strategy: 'Estratègia Mitjana',
  wargame: 'Wargame & Duel',
  gateway: 'Iniciació & Famílies',
};

function matchesPlayerFilter(recommended: string, filter: string): boolean {
  if (filter === 'all') return true;
  const normalized = recommended.replace(/\s+/g, '');
  if (filter === '1') {
    return normalized.startsWith('1');
  }
  if (filter === '2') {
    if (normalized === '2' || normalized === '1,2') return true;
    const match = normalized.match(/^(\d+)-(\d+)$/);
    if (match) {
      return Number(match[1]) <= 2 && Number(match[2]) >= 2;
    }
    return normalized.split(',').includes('2');
  }
  if (filter === '3-4') {
    const match = normalized.match(/^(\d+)-(\d+)$/);
    if (match) {
      return Number(match[1]) <= 4 && Number(match[2]) >= 3;
    }
    return normalized.includes('3') || normalized.includes('4');
  }
  if (filter === '5+') {
    const match = normalized.match(/^(\d+)-(\d+)$/);
    if (match) {
      return Number(match[2]) >= 5;
    }
    return /[5-9]|10|12/.test(normalized);
  }
  return true;
}

export const LudotecaSection: React.FC<LudotecaSectionProps> = ({
  section,
  isEditMode,
  onUpdateSection,
  onSaveGame,
  onDeleteGame,
  onRequestGameTable,
  externalAddTrigger = 0,
}) => {
  const [query, setQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState<'all' | GameTrack>('all');
  const [playerFilter, setPlayerFilter] = useState<'all' | '1' | '2' | '3-4' | '5+'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showAll, setShowAll] = useState(false);

  const [editingGame, setEditingGame] = useState<BoardGame | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  React.useEffect(() => {
    if (externalAddTrigger > 0) {
      setIsAddingNew(true);
      setEditingGame({
        id: `g-${Date.now()}`,
        title: '',
        bestPlayers: '3,4',
        recommendedPlayers: '2-4',
        age: '12+',
        description: '',
        track: 'strategy',
      });
    }
  }, [externalAddTrigger]);

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    return section.games.filter((g) => {
      if (trackFilter !== 'all' && g.track !== trackFilter) return false;
      if (!matchesPlayerFilter(g.recommendedPlayers, playerFilter)) return false;
      if (!q) return true;
      return (
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        TRACK_LABELS[g.track].toLowerCase().includes(q)
      );
    });
  }, [section.games, query, trackFilter, playerFilter]);

  const visibleGames = showAll || query.trim() !== '' || trackFilter !== 'all' || playerFilter !== 'all'
    ? filteredGames
    : filteredGames.slice(0, 18);

  const openNewGameModal = () => {
    setIsAddingNew(true);
    setEditingGame({
      id: `g-${Date.now()}`,
      title: '',
      bestPlayers: '3,4',
      recommendedPlayers: '2-4',
      age: '12+',
      description: '',
      track: 'strategy',
    });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame || !editingGame.title.trim()) return;
    onSaveGame({
      ...editingGame,
      title: editingGame.title.trim(),
      description: editingGame.description.trim() || 'Descripció pendent.',
    });
    setEditingGame(null);
    setIsAddingNew(false);
  };

  return (
    <section id="ludoteca" className="bg-[#F6F7F8] border-b border-neutral-200 py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Header & Intro */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <EditableText
              as="p"
              label="Etiqueta Ludoteca"
              value={section.eyebrow}
              isEditMode={isEditMode}
              onChange={(eyebrow) => onUpdateSection({ eyebrow })}
              className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]"
            />
            <EditableText
              as="h2"
              label="Títol Ludoteca"
              value={section.title}
              isEditMode={isEditMode}
              onChange={(title) => onUpdateSection({ title })}
              className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#111418] [text-wrap:balance]"
            />
            <EditableText
              as="p"
              label="Introducció Ludoteca"
              multiline
              value={section.intro}
              isEditMode={isEditMode}
              onChange={(intro) => onUpdateSection({ intro })}
              className="mt-3 text-base leading-relaxed text-neutral-600"
            />
            <EditableText
              as="p"
              label="Nota portar joc propi"
              value={section.noteBringYourOwn}
              isEditMode={isEditMode}
              onChange={(noteBringYourOwn) => onUpdateSection({ noteBringYourOwn })}
              className="mt-2 text-sm font-medium text-[#111418]"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isEditMode && (
              <button
                type="button"
                onClick={openNewGameModal}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#B91C1C] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Afegir joc nou
              </button>
            )}
            <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'table'
                    ? 'bg-[#111418] text-white'
                    : 'text-neutral-600 hover:text-[#111418]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Taula
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'cards'
                    ? 'bg-[#111418] text-white'
                    : 'text-neutral-600 hover:text-[#111418]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Targetes
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cercar per títol, mecànica o descripció (ex. Hegemony, Mars, 2ª Guerra...)"
                className="w-full rounded-lg border border-neutral-200 bg-[#F8F9FA] pl-9 pr-3 py-2 text-sm text-[#111418] placeholder:text-neutral-400 focus:border-[#111418] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Player Count Filter */}
            <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#F6F7F8] p-1">
              {(
                [
                  { id: 'all', label: 'Tots jug.' },
                  { id: '1', label: 'Solitari (1)' },
                  { id: '2', label: '2 jug.' },
                  { id: '3-4', label: '3–4 jug.' },
                  { id: '5+', label: '5+ jug.' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPlayerFilter(opt.id)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    playerFilter === opt.id
                      ? 'bg-white text-[#111418] shadow-xs'
                      : 'text-neutral-600 hover:text-[#111418]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Track / Complexity Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: 'Totes les categories' },
                  { id: 'expert', label: 'Expert & Heavy' },
                  { id: 'strategy', label: 'Estratègia Mitjana' },
                  { id: 'wargame', label: 'Wargames & Duel' },
                  { id: 'gateway', label: 'Iniciació & Famílies' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTrackFilter(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    trackFilter === tab.id
                      ? 'bg-[#111418] text-white'
                      : 'bg-[#F6F7F8] text-neutral-700 hover:bg-neutral-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <p className="text-xs font-mono text-neutral-500 tabular-nums">
              Mostrant {visibleGames.length} de {filteredGames.length} títols
            </p>
          </div>
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 ? (
          <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-10 text-center">
            <p className="text-base font-semibold text-[#111418]">
              Cap joc coincideix amb aquesta cerca
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Prova d’esborrar els filtres o proposa’ns portar el teu propi exemplar.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setTrackFilter('all');
                setPlayerFilter('all');
              }}
              className="mt-4 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-[#111418] hover:bg-neutral-50 cursor-pointer"
            >
              Netejar filtres
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-[#F8F9FA] text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    <th className="py-3.5 px-4">Joc</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Perfil</th>
                    <th className="py-3.5 px-3 text-center whitespace-nowrap">Millor</th>
                    <th className="py-3.5 px-3 text-center whitespace-nowrap">Recom.</th>
                    <th className="py-3.5 px-3 text-center whitespace-nowrap">Edat</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Descripció</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Acció</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm">
                  {visibleGames.map((game) => (
                    <tr
                      key={game.id}
                      className="hover:bg-neutral-50/90 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#111418] min-w-[180px]">
                        <div>{game.title}</div>
                        <div className="mt-1 text-xs font-normal text-neutral-500 md:hidden">
                          {game.description}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs font-medium text-neutral-600 whitespace-nowrap">
                        {TRACK_LABELS[game.track]}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-xs text-neutral-800 tabular-nums whitespace-nowrap">
                        {game.bestPlayers}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-xs text-neutral-600 tabular-nums whitespace-nowrap">
                        {game.recommendedPlayers}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-xs text-neutral-600 tabular-nums whitespace-nowrap">
                        {game.age}
                      </td>
                      <td className="py-3.5 px-4 text-xs leading-relaxed text-neutral-600 hidden md:table-cell max-w-md">
                        {game.description}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onRequestGameTable(game.title)}
                            className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-[#111418] hover:border-[#DC2626] hover:text-[#DC2626] transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Demanar
                          </button>
                          {isEditMode && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingNew(false);
                                  setEditingGame(game);
                                }}
                                aria-label={`Editar ${game.title}`}
                                className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-[#111418] cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteGame(game.id)}
                                aria-label={`Eliminar ${game.title}`}
                                className="rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards View */
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleGames.map((game) => (
              <article
                key={game.id}
                className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
                    <span className="font-medium text-[#4D7C0F]">
                      {TRACK_LABELS[game.track]}
                    </span>
                    <span className="font-mono tabular-nums">
                      Millor {game.bestPlayers} · {game.recommendedPlayers} jug. · {game.age}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-[#111418] leading-snug">
                    {game.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {game.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onRequestGameTable(game.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111418] hover:text-[#DC2626] transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Demanar per WhatsApp
                  </button>

                  {isEditMode && (
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNew(false);
                          setEditingGame(game);
                        }}
                        className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-[#111418] cursor-pointer"
                        aria-label={`Editar ${game.title}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteGame(game.id)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                        aria-label={`Eliminar ${game.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Show More Toggle */}
        {!showAll &&
          query.trim() === '' &&
          trackFilter === 'all' &&
          playerFilter === 'all' &&
          filteredGames.length > 18 && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold text-[#111418] hover:border-[#111418] transition-colors cursor-pointer"
              >
                Mostrar tots els {filteredGames.length} jocs de la ludoteca
              </button>
            </div>
          )}
      </div>

      {/* Add / Edit Game Modal */}
      {editingGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs"
          onClick={() => setEditingGame(null)}
        >
          <form
            onSubmit={handleSaveModal}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl text-[#111418]"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-5">
              <h3 className="font-display text-lg font-bold">
                {isAddingNew ? 'Afegir nou joc a la Ludoteca' : 'Editar joc'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingGame(null)}
                className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nom del joc *
                </label>
                <input
                  type="text"
                  required
                  value={editingGame.title}
                  onChange={(e) =>
                    setEditingGame({ ...editingGame, title: e.target.value })
                  }
                  placeholder="Ex: Brass: Birmingham"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#111418] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Perfil
                  </label>
                  <select
                    value={editingGame.track}
                    onChange={(e) =>
                      setEditingGame({
                        ...editingGame,
                        track: e.target.value as GameTrack,
                      })
                    }
                    className="w-full rounded-lg border border-neutral-300 px-2.5 py-2 text-xs focus:border-[#111418] focus:outline-none"
                  >
                    <option value="expert">Expert & Heavy</option>
                    <option value="strategy">Estratègia Mitjana</option>
                    <option value="wargame">Wargame & Duel</option>
                    <option value="gateway">Iniciació & Famílies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Millor amb
                  </label>
                  <input
                    type="text"
                    value={editingGame.bestPlayers}
                    onChange={(e) =>
                      setEditingGame({ ...editingGame, bestPlayers: e.target.value })
                    }
                    placeholder="3,4"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs font-mono focus:border-[#111418] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Recomanats
                  </label>
                  <input
                    type="text"
                    value={editingGame.recommendedPlayers}
                    onChange={(e) =>
                      setEditingGame({
                        ...editingGame,
                        recommendedPlayers: e.target.value,
                      })
                    }
                    placeholder="2-4"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs font-mono focus:border-[#111418] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Edat mín.
                  </label>
                  <input
                    type="text"
                    value={editingGame.age}
                    onChange={(e) =>
                      setEditingGame({ ...editingGame, age: e.target.value })
                    }
                    placeholder="14+"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs font-mono focus:border-[#111418] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Descripció breu
                </label>
                <textarea
                  rows={3}
                  value={editingGame.description}
                  onChange={(e) =>
                    setEditingGame({ ...editingGame, description: e.target.value })
                  }
                  placeholder="Temàtica i mecànica principal..."
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#111418] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-200 pt-4">
              <button
                type="button"
                onClick={() => setEditingGame(null)}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel·lar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#111418] px-4 py-2 text-xs font-semibold text-white hover:bg-[#DC2626] transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Desar joc
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
