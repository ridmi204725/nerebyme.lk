/**
 * Central API base URL resolver.
 *
 * Local development:
 *   http://localhost:5001
 *
 * Production:
 *   https://api.nearbyme.lk
 */

const getApiBaseUrl = () => {
  // Explicit environment variable takes priority
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Local development
  if (import.meta.env.DEV) {
    return `${window.location.protocol}//${window.location.hostname}:5001`;
  }

  // Production
  return 'https://api.nearbyme.lk';
};

export const API_BASE_URL = getApiBaseUrl();
