/**
 * Normalizes root-relative public asset paths (`/images/...`, `/assets/...`)
 * into relative `./...` paths so assets load properly both at domain root `/`
 * and on GitHub Pages repository subpaths (e.g. `/ASSOCIACIO-VILA-JOCS/`).
 */
export function resolveAssetUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('/images/') || url.startsWith('/assets/')) {
    return `.${url}`;
  }
  return url;
}
