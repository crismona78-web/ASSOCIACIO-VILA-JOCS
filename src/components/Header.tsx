import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageId } from '../types/site';
import { resolveAssetUrl } from '../utils/assetUrl';

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'inici', label: 'Inici' },
  { id: 'ludoteca', label: 'Ludoteca' },
  { id: 'normativa', label: 'Normativa' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'contacte', label: 'Contacte' },
];

export const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Intact VILA JOCS visual logo */}
        <button
          type="button"
          onClick={() => handleNavClick('inici')}
          className="flex items-center shrink-0 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] rounded-md"
          aria-label="Vila Jocs — Anar a la portada"
        >
          <img
            src={resolveAssetUrl('/images/vila-jocs/logo-vila-jocs-transparent.png')}
            alt="Logotip oficial de l'Associació Vila Jocs"
            className="h-11 w-auto object-contain select-none"
          />
        </button>

        {/* 5 clean single-line page links */}
        <nav
          aria-label="Navegació principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`whitespace-nowrap shrink-0 py-1 cursor-pointer transition-colors ${
                  isActive
                    ? 'font-semibold text-[#1C1917] underline decoration-[#DC2626] decoration-2 underline-offset-6'
                    : 'hover:text-[#1C1917] hover:underline hover:decoration-stone-300 hover:underline-offset-6'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex md:hidden items-center justify-center rounded-lg border border-stone-200 p-2 text-stone-700 hover:bg-stone-100 cursor-pointer"
          aria-label={mobileOpen ? 'Tancar menú' : 'Obrir menú'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Navegació mòbil"
          className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer ${
                  isActive
                    ? 'bg-[#F7F7F5] font-semibold text-[#DC2626]'
                    : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
