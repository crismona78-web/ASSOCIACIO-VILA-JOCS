/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { DEFAULT_SITE_DATA } from './data/defaultSiteData';
import {
  BoardGame,
  FeaturedGame,
  GalleryPhoto,
  PageId,
  PlayerTrack,
  RuleDocument,
  SiteData,
} from './types/site';
import { Header } from './components/Header';
import { EditToolbar } from './components/EditToolbar';
import { HomePage } from './components/HomePage';
import { LudotecaSection } from './components/LudotecaSection';
import { FuncionamentNormativaSection } from './components/FuncionamentNormativaSection';
import { GaleriaSection } from './components/GaleriaSection';
import { ContacteSection } from './components/ContacteSection';
import { Footer } from './components/Footer';

const STORAGE_KEY = 'vilajocs_cms_v3';

function sanitizeLegacy2026Text(text: string | undefined, fallback: string): string {
  if (!text) return fallback;
  if (/2026|gratu[ïi]t|sense cost|cap cost/i.test(text)) {
    return fallback;
  }
  return text;
}

function normalizeGameKey(title: string): string {
  const clean = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
  if (clean.startsWith('juegodetronoseljuegodetablero')) return 'juegodetronoseljuegodetablero';
  if (clean.startsWith('twilightstruggleredsea')) return 'twilightstruggleredsea';
  return clean;
}

function migrateStoredSiteData(parsed: Partial<SiteData>): SiteData {
  const merged: SiteData = {
    ...DEFAULT_SITE_DATA,
    ...parsed,
    home: {
      ...DEFAULT_SITE_DATA.home,
      ...(parsed.home ?? {}),
    },
    ludotecaSection: {
      ...DEFAULT_SITE_DATA.ludotecaSection,
      ...(parsed.ludotecaSection ?? {}),
    },
    funcionamentSection: {
      ...DEFAULT_SITE_DATA.funcionamentSection,
      ...(parsed.funcionamentSection ?? {}),
    },
    galeriaSection: {
      ...DEFAULT_SITE_DATA.galeriaSection,
      ...(parsed.galeriaSection ?? {}),
    },
    contacteSection: {
      ...DEFAULT_SITE_DATA.contacteSection,
      ...(parsed.contacteSection ?? {}),
    },
  };

  // Preserve custom user edits, only clean up old default "2026 gratuïta" texts
  merged.home.quotaTitle = sanitizeLegacy2026Text(
    merged.home.quotaTitle,
    DEFAULT_SITE_DATA.home.quotaTitle
  );
  merged.home.quotaNote = sanitizeLegacy2026Text(
    merged.home.quotaNote,
    DEFAULT_SITE_DATA.home.quotaNote
  );
  merged.contacteSection.contactNote = sanitizeLegacy2026Text(
    merged.contacteSection.contactNote,
    DEFAULT_SITE_DATA.contacteSection.contactNote
  );

  // Separate Stone Age & Splendor and add Arnak if still using legacy combined fg-4
  const existingFeatured = merged.home.featuredGames ?? [];
  const nextFeatured: FeaturedGame[] = [];
  for (const fg of existingFeatured) {
    if (fg.id === 'fg-4' && /stone age.*splendor|splendor.*stone age/i.test(fg.title)) {
      const stoneAgeDefault = DEFAULT_SITE_DATA.home.featuredGames.find((d) => d.id === 'fg-4');
      const splendorDefault = DEFAULT_SITE_DATA.home.featuredGames.find((d) => d.id === 'fg-5');
      if (stoneAgeDefault) nextFeatured.push(stoneAgeDefault);
      if (splendorDefault) nextFeatured.push(splendorDefault);
    } else {
      const defaultMatch = DEFAULT_SITE_DATA.home.featuredGames.find((d) => d.id === fg.id);
      const isLegacyUntouchedDesc =
        fg.description.startsWith('Dirigeixes una aerolínia emergent') ||
        fg.description.startsWith('Dirigeix una aerolínia als anys daurats') ||
        fg.description.startsWith('Cada torn robes una lloseta') ||
        fg.description.startsWith('Competeix per aixecar els gratacels més alts del nou barri urbà') ||
        fg.description.startsWith('Envia els membres de la teva tribu') ||
        fg.description.startsWith("Envia la teva tribu a recollir fusta, argila") ||
        fg.description.startsWith("Posa't a la pell d'un mercader renaixentista") ||
        fg.description.startsWith('Lidera una expedició arqueològica en una illa desconeguda') ||
        fg.description.startsWith('Lidera una expedició arqueològica combinant construcció');
      nextFeatured.push({
        ...fg,
        description:
          isLegacyUntouchedDesc && defaultMatch ? defaultMatch.description : fg.description,
        imageFit: fg.imageFit ?? defaultMatch?.imageFit ?? 'cover',
      });
    }
  }
  if (!nextFeatured.some((g) => /arnak/i.test(g.title))) {
    const arnakDefault = DEFAULT_SITE_DATA.home.featuredGames.find((d) => d.id === 'fg-6');
    if (arnakDefault) nextFeatured.push(arnakDefault);
  }
  merged.home.featuredGames = nextFeatured;

  // Merge all 150 games from official catalog while preserving any manual user game edits/additions
  const existingGames = merged.ludotecaSection.games ?? [];
  const existingGameKeys = new Set(existingGames.map((g) => normalizeGameKey(g.title)));
  const missingGames = DEFAULT_SITE_DATA.ludotecaSection.games.filter(
    (g) => !existingGameKeys.has(normalizeGameKey(g.title))
  );
  if (missingGames.length > 0) {
    merged.ludotecaSection.games = [...existingGames, ...missingGames].map((g, idx) => ({
      ...g,
      id: g.id || `g-merged-${idx}`,
    }));
  }

  // Ensure official PDF links and fileNames on Estatuts and RRI are attached if empty
  merged.funcionamentSection.eyebrow =
    merged.funcionamentSection.eyebrow === 'Organització i normativa'
      ? DEFAULT_SITE_DATA.funcionamentSection.eyebrow
      : merged.funcionamentSection.eyebrow;
  if (/punts clau/i.test(merged.funcionamentSection.normativaIntro)) {
    merged.funcionamentSection.normativaIntro = DEFAULT_SITE_DATA.funcionamentSection.normativaIntro;
  }
  merged.funcionamentSection.documents = merged.funcionamentSection.documents.map((doc) => {
    const defaultDoc = DEFAULT_SITE_DATA.funcionamentSection.documents.find((d) => d.id === doc.id);
    if (!doc.externalUrl && defaultDoc?.externalUrl) {
      return {
        ...doc,
        externalUrl: defaultDoc.externalUrl,
        fileName: doc.fileName || defaultDoc.fileName,
      };
    }
    return {
      ...doc,
      fileName: doc.fileName || defaultDoc?.fileName,
    };
  });

  // Merge newly uploaded club photos into gallery without overwriting user photos
  const existingPhotos = merged.galeriaSection.photos ?? [];
  const existingPaths = new Set(existingPhotos.map((p) => p.image));
  const missingNewPhotos = DEFAULT_SITE_DATA.galeriaSection.photos.filter(
    (p) => p.image.startsWith('/assets/aistudio/') && !existingPaths.has(p.image)
  );
  if (missingNewPhotos.length > 0) {
    merged.galeriaSection.photos = [...missingNewPhotos, ...existingPhotos];
  }

  return merged;
}

function loadInitialData(): { data: SiteData; modified: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { data: DEFAULT_SITE_DATA, modified: false };
    const parsed = JSON.parse(raw) as Partial<SiteData>;
    if (parsed && parsed.home && parsed.ludotecaSection && parsed.contacteSection) {
      return {
        data: migrateStoredSiteData(parsed),
        modified: true,
      };
    }
  } catch {
    // Fallback cleanly to default data if stored JSON is corrupted
  }
  return { data: DEFAULT_SITE_DATA, modified: false };
}

export default function App() {
  const initial = loadInitialData();
  const [siteData, setSiteData] = useState<SiteData>(initial.data);
  const [activePage, setActivePage] = useState<PageId>('inici');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(initial.modified);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [requestedGame, setRequestedGame] = useState<string>('');
  const [addGameTrigger, setAddGameTrigger] = useState<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const navigateTo = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const persistData = (next: SiteData) => {
    setSiteData(next);
    setHasUnsavedChanges(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      const now = new Date();
      setLastSavedAt(
        now.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
      );
    } catch {
      showToast('Avís: emmagatzematge local ple; exporta un JSON per desar còpia.');
    }
  };

  const handleRequestGameTable = (gameTitle: string) => {
    setRequestedGame(gameTitle);
    navigateTo('contacte');
  };

  const handleUpdateHome = (patch: Partial<SiteData['home']>) => {
    persistData({ ...siteData, home: { ...siteData.home, ...patch } });
  };

  const handleUpdateFeaturedGame = (id: string, patch: Partial<FeaturedGame>) => {
    persistData({
      ...siteData,
      home: {
        ...siteData.home,
        featuredGames: siteData.home.featuredGames.map((fg) =>
          fg.id === id ? { ...fg, ...patch } : fg
        ),
      },
    });
  };

  const handleUpdateTrack = (id: string, patch: Partial<PlayerTrack>) => {
    persistData({
      ...siteData,
      home: {
        ...siteData.home,
        tracks: siteData.home.tracks.map((tr) =>
          tr.id === id ? { ...tr, ...patch } : tr
        ),
      },
    });
  };

  const handleUpdateLudotecaSection = (
    patch: Partial<SiteData['ludotecaSection']>
  ) => {
    persistData({
      ...siteData,
      ludotecaSection: { ...siteData.ludotecaSection, ...patch },
    });
  };

  const handleSaveGame = (game: BoardGame) => {
    const exists = siteData.ludotecaSection.games.some((g) => g.id === game.id);
    const nextGames = exists
      ? siteData.ludotecaSection.games.map((g) => (g.id === game.id ? game : g))
      : [game, ...siteData.ludotecaSection.games];
    persistData({
      ...siteData,
      ludotecaSection: {
        ...siteData.ludotecaSection,
        games: nextGames,
      },
    });
    showToast(exists ? `Joc «${game.title}» actualitzat.` : `Joc «${game.title}» afegit.`);
  };

  const handleDeleteGame = (id: string) => {
    const target = siteData.ludotecaSection.games.find((g) => g.id === id);
    persistData({
      ...siteData,
      ludotecaSection: {
        ...siteData.ludotecaSection,
        games: siteData.ludotecaSection.games.filter((g) => g.id !== id),
      },
    });
    if (target) showToast(`Eliminat «${target.title}» de la ludoteca.`);
  };

  const handleUpdateFuncionamentSection = (
    patch: Partial<SiteData['funcionamentSection']>
  ) => {
    persistData({
      ...siteData,
      funcionamentSection: { ...siteData.funcionamentSection, ...patch },
    });
  };

  const handleUpdateDocument = (id: string, patch: Partial<RuleDocument>) => {
    persistData({
      ...siteData,
      funcionamentSection: {
        ...siteData.funcionamentSection,
        documents: siteData.funcionamentSection.documents.map((d) =>
          d.id === id ? { ...d, ...patch } : d
        ),
      },
    });
  };

  const handleUpdateGaleriaSection = (
    patch: Partial<SiteData['galeriaSection']>
  ) => {
    persistData({
      ...siteData,
      galeriaSection: { ...siteData.galeriaSection, ...patch },
    });
  };

  const handleUpdatePhoto = (id: string, patch: Partial<GalleryPhoto>) => {
    persistData({
      ...siteData,
      galeriaSection: {
        ...siteData.galeriaSection,
        photos: siteData.galeriaSection.photos.map((p) =>
          p.id === id ? { ...p, ...patch } : p
        ),
      },
    });
  };

  const handleAddPhoto = () => {
    const newPhoto: GalleryPhoto = {
      id: `ph-${Date.now()}`,
      image: '/images/vila-jocs/galeria-5.jpg',
      alt: 'Nova foto de sessió a Vila Jocs',
      caption: 'Nova sessió de joc al local (clica per editar)',
      gameTag: 'Sessió',
    };
    persistData({
      ...siteData,
      galeriaSection: {
        ...siteData.galeriaSection,
        photos: [newPhoto, ...siteData.galeriaSection.photos],
      },
    });
    navigateTo('galeria');
    showToast('Foto nova afegida a la galeria. Clica «Canviar imatge» per pujar-ne una.');
  };

  const handleDeletePhoto = (id: string) => {
    persistData({
      ...siteData,
      galeriaSection: {
        ...siteData.galeriaSection,
        photos: siteData.galeriaSection.photos.filter((p) => p.id !== id),
      },
    });
    showToast('Foto eliminada de la galeria.');
  };

  const handleUpdateContacteSection = (
    patch: Partial<SiteData['contacteSection']>
  ) => {
    persistData({
      ...siteData,
      contacteSection: { ...siteData.contacteSection, ...patch },
    });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(siteData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vila-jocs-contingut-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Còpia JSON exportada correctament.');
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as SiteData;
        if (!parsed.home || !parsed.ludotecaSection || !parsed.contacteSection) {
          showToast('El fitxer JSON no té l’estructura de Vila Jocs.');
          return;
        }
        persistData(parsed);
        showToast('Contingut importat i aplicat correctament.');
      } catch {
        showToast('Error en llegir el fitxer JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSiteData(DEFAULT_SITE_DATA);
    setHasUnsavedChanges(false);
    setLastSavedAt(null);
    showToast('Contingut restaurat als valors originals.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#1C1917]">
      <Header
        activePage={activePage}
        onNavigate={navigateTo}
        isEditMode={isEditMode}
        onToggleEditMode={() => {
          setIsEditMode((prev) => !prev);
        }}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {isEditMode && (
        <EditToolbar
          onAddGame={() => {
            navigateTo('ludoteca');
            window.setTimeout(() => setAddGameTrigger((c) => c + 1), 60);
          }}
          onAddPhoto={handleAddPhoto}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          onResetDefaults={handleResetDefaults}
          lastSavedAt={lastSavedAt}
        />
      )}

      <main className="flex-1">
        {activePage === 'inici' && (
          <HomePage
            home={siteData.home}
            contacte={siteData.contacteSection}
            isEditMode={isEditMode}
            onUpdateHome={handleUpdateHome}
            onUpdateContacte={handleUpdateContacteSection}
            onUpdateTrack={handleUpdateTrack}
            onUpdateFeaturedGame={handleUpdateFeaturedGame}
            onNavigate={navigateTo}
            onRequestGameTable={handleRequestGameTable}
            onActivateEditMode={() => {
              setIsEditMode(true);
              showToast('Mode d’edició activat. Fes clic a «Canviar imatge» per pujar la foto.');
            }}
          />
        )}

        {activePage === 'ludoteca' && (
          <LudotecaSection
            section={siteData.ludotecaSection}
            isEditMode={isEditMode}
            onUpdateSection={handleUpdateLudotecaSection}
            onSaveGame={handleSaveGame}
            onDeleteGame={handleDeleteGame}
            onRequestGameTable={handleRequestGameTable}
            externalAddTrigger={addGameTrigger}
          />
        )}

        {activePage === 'normativa' && (
          <FuncionamentNormativaSection
            section={siteData.funcionamentSection}
            isEditMode={isEditMode}
            onUpdateSection={handleUpdateFuncionamentSection}
            onUpdateDocument={handleUpdateDocument}
          />
        )}

        {activePage === 'galeria' && (
          <GaleriaSection
            section={siteData.galeriaSection}
            isEditMode={isEditMode}
            onUpdateSection={handleUpdateGaleriaSection}
            onUpdatePhoto={handleUpdatePhoto}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        )}

        {activePage === 'contacte' && (
          <ContacteSection
            section={siteData.contacteSection}
            isEditMode={isEditMode}
            onUpdateSection={handleUpdateContacteSection}
            requestedGame={requestedGame}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Quiet Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 rounded-lg border border-stone-200 bg-white px-4 py-3 text-xs font-semibold text-[#1C1917] shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
