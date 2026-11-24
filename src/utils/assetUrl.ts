/**
 * Normalizes root-relative public asset paths (`/images/...`, `/assets/...`)
 * against Vite's configured `BASE_URL` so assets load properly both at domain
 * root (`./`) and on GitHub Pages repository subpaths (`/ASSOCIACIO-VILA-JOCS/`).
 */
export function resolveAssetUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('/images/') || url.startsWith('/assets/')) {
    const base = import.meta.env.BASE_URL || './';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    return `${normalizedBase}${url.slice(1)}`;
  }
  return url;
}
