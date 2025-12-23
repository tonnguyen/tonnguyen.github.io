/**
 * API utility functions
 * Supports calling API routes from GitHub Pages (static) to Vercel (serverless)
 */

/**
 * Get the base URL for API calls
 * - If NEXT_PUBLIC_API_URL is set, use it (points to Vercel)
 * - Otherwise, use relative paths (works for same-origin)
 */
export function getApiBaseUrl() {
  // In browser environment
  if (typeof window !== 'undefined') {
    // Use Vercel API URL if configured (for GitHub Pages deployment)
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    // Fallback to relative path (works for same-origin, e.g., Vercel full deployment)
    return '';
  }
  // Server-side: use relative path or configured URL
  return process.env.NEXT_PUBLIC_API_URL || '';
}

/**
 * Build full API URL
 */
export function getApiUrl(path) {
  const baseUrl = getApiBaseUrl();
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Remove trailing slash from baseUrl and ensure single slash between baseUrl and path
  const cleanBaseUrl = baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
  return `${cleanBaseUrl}${cleanPath}`;
}

