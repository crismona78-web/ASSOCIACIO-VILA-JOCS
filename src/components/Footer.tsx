import React from 'react';
import { PageId } from '../types/site';
import { resolveAssetUrl } from '../utils/assetUrl';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#F1F0EC] text-stone-600 border-t border-stone-200">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={resolveAssetUrl('/images/vila-jocs/logo-vila-jocs-transparent.png')}
              alt="Associació Vila Jocs"
              className="h-10 w-auto object-contain select-none"
            />
            <div className="text-xs leading-relaxed">
              <div className="font-semibold text-[#1C1917]">
                Associació Cultural de Jocs de Taula Vila Jocs
              </div>
              <div>Centre Cívic Vilafortuny · Cambrils, Tarragona</div>
            </div>
          </div>

          <nav
            aria-label="Enllaços del peu de pàgina"
            className="flex flex-wrap items-center gap-5 text-xs font-medium text-stone-700"
          >
            {(
              [
                { id: 'inici', label: 'Inici' },
                { id: 'ludoteca', label: 'Ludoteca' },
                { id: 'normativa', label: 'Normativa' },
                { id: 'galeria', label: 'Galeria' },
                { id: 'contacte', label: 'Contacte' },
              ] as const
            ).map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className="hover:text-[#DC2626] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-300/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Associació Vila Jocs · Centre Cívic Vilafortuny</p>
          <p>associaciovilajocs@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};
