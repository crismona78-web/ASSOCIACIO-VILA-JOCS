/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { DEFAULT_SITE_DATA } from './data/defaultSiteData';
import { PageId } from './types/site';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LudotecaSection } from './components/LudotecaSection';
import { FuncionamentNormativaSection } from './components/FuncionamentNormativaSection';
import { GaleriaSection } from './components/GaleriaSection';
import { ContacteSection } from './components/ContacteSection';
import { Footer } from './components/Footer';

const noop = () => {};

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('inici');
  const [requestedGame, setRequestedGame] = useState<string>('');
  const siteData = DEFAULT_SITE_DATA;

  const navigateTo = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestGameTable = (gameTitle: string) => {
    setRequestedGame(gameTitle);
    navigateTo('contacte');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#1C1917]">
      <Header activePage={activePage} onNavigate={navigateTo} />

      <main className="flex-1">
        {activePage === 'inici' && (
          <HomePage
            home={siteData.home}
            contacte={siteData.contacteSection}
            isEditMode={false}
            onUpdateHome={noop}
            onUpdateContacte={noop}
            onUpdateTrack={noop}
            onUpdateFeaturedGame={noop}
            onNavigate={navigateTo}
            onRequestGameTable={handleRequestGameTable}
          />
        )}

        {activePage === 'ludoteca' && (
          <LudotecaSection
            section={siteData.ludotecaSection}
            isEditMode={false}
            onUpdateSection={noop}
            onSaveGame={noop}
            onDeleteGame={noop}
            onRequestGameTable={handleRequestGameTable}
          />
        )}

        {activePage === 'normativa' && (
          <FuncionamentNormativaSection
            section={siteData.funcionamentSection}
            isEditMode={false}
            onUpdateSection={noop}
            onUpdateDocument={noop}
          />
        )}

        {activePage === 'galeria' && (
          <GaleriaSection
            section={siteData.galeriaSection}
            isEditMode={false}
            onUpdateSection={noop}
            onUpdatePhoto={noop}
            onAddPhoto={noop}
            onDeletePhoto={noop}
          />
        )}

        {activePage === 'contacte' && (
          <ContacteSection
            section={siteData.contacteSection}
            isEditMode={false}
            onUpdateSection={noop}
            requestedGame={requestedGame}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
