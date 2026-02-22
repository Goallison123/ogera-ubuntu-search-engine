// API Service for Ubuntu Search Engine
// Handles communication with backend API and external data sources

const API_BASE_URL = typeof import.meta.env.VITE_API_URL !== 'undefined' ? import.meta.env.VITE_API_URL : 'http://localhost:5000';

export const apiService = {
  /**
   * Fetch search results from the API
   * @param {string} query - Search query
   * @param {string} region - Region filter
   * @returns {Promise<Object>} Search results
   */
  async searchResults(query: string, region = 'All Africa') {
    try {
      if (!query || query.trim().length === 0) {
        return {
          status: 'success',
          results: [],
          totalResults: 0,
          query: '',
        };
      }

      const url = new URL('/api/search', API_BASE_URL);
      url.searchParams.append('q', query);
      url.searchParams.append('region', region);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Search API Error:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        results: [],
        totalResults: 0,
      };
    }
  },

  /**
   * Health check for API server
   * @returns {Promise<boolean>} Server status
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
      });

      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  /**
   * Get API configuration
   * @returns {Object} API configuration
   */
  getConfig() {
    return {
      baseUrl: API_BASE_URL,
      environment: typeof import.meta.env.MODE !== 'undefined' ? import.meta.env.MODE : 'production',
      isDevelopment: typeof import.meta.env.DEV !== 'undefined' ? import.meta.env.DEV : false,
    };
  },
  /**
   * Proxy-fetch an arbitrary http/https URL through the backend
   * The backend enforces SSRF protections and only allows http/https
   */
  async proxyFetch(targetUrl: string) {
    try {
      if (!targetUrl) throw new Error('No target URL provided');
      const url = new URL('/api/proxy', API_BASE_URL);
      url.searchParams.append('url', targetUrl);

      const response = await fetch(url.toString(), { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Proxy error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      return { status: 'success', contentType, body: text };
    } catch (error) {
      console.error('ProxyFetch error:', error);
      return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  },
};

export default apiService;
