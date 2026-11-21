import React, { useState } from 'react';
import { Menu, Pencil, Check, X } from 'lucide-react';
import { PageId } from '../types/site';
import { resolveAssetUrl } from '../utils/assetUrl';

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  hasUnsavedChanges: boolean;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'inici', label: 'Inici' },
  { id: 'ludoteca', label: 'Ludoteca' },
  { id: 'normativa', label: 'Normativa' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'contacte', label: 'Contacte' },
];

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  isEditMode,
  onToggleEditMode,
  hasUnsavedChanges,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Intact VILA JOCS visual logo */}
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

        {/* Zone 2: 5 clean single-line page links */}
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

        {/* Zone 3: 1 primary action (Manual Edit Mode button) + mobile hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleEditMode}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              isEditMode
                ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C] focus-visible:ring-[#DC2626]'
                : 'bg-[#1C1917] text-white hover:bg-stone-800 focus-visible:ring-[#1C1917]'
            }`}
          >
            {isEditMode ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Desar i sortir</span>
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5" />
                <span>{hasUnsavedChanges ? 'Editar web (editat)' : 'Editar web'}</span>
              </>
            )}
          </button>

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
