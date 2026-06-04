/**
 * Normalize a user-entered external URL so it always resolves absolutely.
 *
 * Admin forms often capture a bare domain ("resume.conradpetrich.me") without a
 * scheme. A browser treats a schemeless href as *relative*, so it gets tacked
 * onto the current origin (e.g. https://localhost:3001/resume.conradpetrich.me).
 * Prefixing https:// makes it an absolute link.
 *
 * Anchors, mailto:, tel:, and links that already carry a scheme are left alone.
 */
export function externalUrl(href: string): string {
  const trimmed = href.trim();
  if (!trimmed) return trimmed;
  // Already absolute (http://, https://, mailto:, tel:, etc.) or a page anchor.
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) || trimmed.startsWith("#")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
