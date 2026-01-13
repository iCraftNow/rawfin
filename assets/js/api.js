/**
 * API Client Module
 * Centralized API communication for Rawfin
 */

(function() {
  'use strict';

  /**
   * Main API Client Class
   */
  class RawfinAPI {
    constructor() {
      this.baseURL = 'https://rawfin.tv/api';
      this.timeout = 10000; // 10 seconds
      this.retryAttempts = 3;
      this.retryDelay = 1000; // 1 second

      // Initialize sub-modules
      this.newsletter = new NewsletterAPI(this);
      this.search = new SearchAPI(this);
      this.episodes = new EpisodesAPI(this);
      this.contact = new ContactAPI(this);
      this.auth = new AuthAPI(this);
      this.telegram = new TelegramAPI(this);
      this.analytics = new AnalyticsAPI(this);
    }

    /**
     * Make an API request
     */
    async request(endpoint, options = {}) {
      const config = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      };

      // Add auth token if available
      const token = this.getAuthToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      config.signal = controller.signal;

      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, config);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new APIError(
            `API Error: ${response.status}`,
            response.status,
            await response.json().catch(() => ({}))
          );
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
          throw new APIError('Request timeout', 408);
        }

        console.error('API Request Failed:', error);
        throw error;
      }
    }

    /**
     * Request with retry logic
     */
    async requestWithRetry(endpoint, options = {}, attempt = 1) {
      try {
        return await this.request(endpoint, options);
      } catch (error) {
        if (attempt < this.retryAttempts && this.shouldRetry(error)) {
          console.log(`Retrying request (attempt ${attempt + 1})...`);
          await this.delay(this.retryDelay * attempt);
          return this.requestWithRetry(endpoint, options, attempt + 1);
        }
        throw error;
      }
    }

    /**
     * Check if error should trigger retry
     */
    shouldRetry(error) {
      if (error instanceof APIError) {
        // Retry on 5xx errors and rate limiting
        return error.status >= 500 || error.status === 429;
      }
      return false;
    }

    /**
     * Delay utility
     */
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get authentication token
     */
    getAuthToken() {
      return localStorage.getItem('rawfin_auth_token');
    }

    /**
     * Set authentication token
     */
    setAuthToken(token) {
      if (token) {
        localStorage.setItem('rawfin_auth_token', token);
      } else {
        localStorage.removeItem('rawfin_auth_token');
      }
    }

    /**
     * Get user data from localStorage
     */
    getUserData() {
      const data = localStorage.getItem('rawfin_user_data');
      return data ? JSON.parse(data) : null;
    }

    /**
     * Set user data in localStorage
     */
    setUserData(data) {
      if (data) {
        localStorage.setItem('rawfin_user_data', JSON.stringify(data));
      } else {
        localStorage.removeItem('rawfin_user_data');
      }
    }
  }

  /**
   * Newsletter API
   */
  class NewsletterAPI {
    constructor(client) {
      this.client = client;
    }

    async subscribe(email) {
      return this.client.request('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    }

    async unsubscribe(token) {
      return this.client.request('/newsletter/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
    }

    async getStatus(email) {
      return this.client.request(`/newsletter/status?email=${encodeURIComponent(email)}`);
    }
  }

  /**
   * Search API
   */
  class SearchAPI {
    constructor(client) {
      this.client = client;
    }

    async search(query, filters = {}) {
      const params = new URLSearchParams({
        q: query,
        ...filters
      });
      return this.client.request(`/search?${params}`);
    }

    async suggestions(query) {
      const params = new URLSearchParams({ q: query });
      return this.client.request(`/search/suggestions?${params}`);
    }
  }

  /**
   * Episodes API
   */
  class EpisodesAPI {
    constructor(client) {
      this.client = client;
    }

    async getRecent(limit = 6) {
      return this.client.request(`/episodes/recent?limit=${limit}`);
    }

    async getById(id) {
      return this.client.request(`/episodes/${id}`);
    }

    async getFeatured() {
      return this.client.request('/episodes/featured');
    }

    async getByCategory(category, page = 1, limit = 10) {
      return this.client.request(`/episodes/category/${category}?page=${page}&limit=${limit}`);
    }
  }

  /**
   * Contact API
   */
  class ContactAPI {
    constructor(client) {
      this.client = client;
    }

    async submit(data) {
      return this.client.request('/contact', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }
  }

  /**
   * Authentication API
   */
  class AuthAPI {
    constructor(client) {
      this.client = client;
    }

    async login(provider) {
      // Redirect to OAuth provider
      window.location.href = `${this.client.baseURL}/auth/${provider}`;
    }

    async logout() {
      this.client.setAuthToken(null);
      this.client.setUserData(null);

      try {
        return await this.client.request('/auth/logout', {
          method: 'POST'
        });
      } catch (error) {
        console.error('Logout API error:', error);
        // Continue with client-side logout even if API fails
      }
    }

    async getProfile() {
      try {
        const data = await this.client.request('/auth/profile');
        this.client.setUserData(data);
        return data;
      } catch (error) {
        // If profile fetch fails, clear auth
        this.logout();
        throw error;
      }
    }

    async refreshToken() {
      try {
        const data = await this.client.request('/auth/refresh', {
          method: 'POST'
        });
        this.client.setAuthToken(data.token);
        return data;
      } catch (error) {
        // If refresh fails, logout
        this.logout();
        throw error;
      }
    }

    isAuthenticated() {
      return !!this.client.getAuthToken();
    }

    getCurrentUser() {
      return this.client.getUserData();
    }
  }

  /**
   * Telegram API
   */
  class TelegramAPI {
    constructor(client) {
      this.client = client;
      this.botUsername = 'rawfin_bot';
    }

    async getBotInfo() {
      return this.client.request('/telegram/bot-info');
    }

    async sendMessage(chatId, message) {
      return this.client.request('/telegram/send', {
        method: 'POST',
        body: JSON.stringify({ chatId, message })
      });
    }

    openBot() {
      window.open(`https://t.me/${this.botUsername}`, '_blank');
    }

    getBotLink() {
      return `https://t.me/${this.botUsername}`;
    }
  }

  /**
   * Analytics API
   */
  class AnalyticsAPI {
    constructor(client) {
      this.client = client;
    }

    async track(event, data = {}) {
      // Use sendBeacon for better reliability
      if (navigator.sendBeacon) {
        const blob = new Blob(
          [JSON.stringify({ event, data, timestamp: Date.now() })],
          { type: 'application/json' }
        );
        navigator.sendBeacon(`${this.client.baseURL}/analytics/track`, blob);
      } else {
        // Fallback to regular request
        return this.client.request('/analytics/track', {
          method: 'POST',
          body: JSON.stringify({ event, data })
        });
      }
    }

    async trackPageView(url = window.location.pathname) {
      return this.track('page_view', { url });
    }

    async trackEvent(category, action, label = '', value = 0) {
      return this.track('event', { category, action, label, value });
    }
  }

  /**
   * Custom API Error Class
   */
  class APIError extends Error {
    constructor(message, status, data = {}) {
      super(message);
      this.name = 'APIError';
      this.status = status;
      this.data = data;
    }
  }

  /**
   * Initialize and expose globally
   */
  const api = new RawfinAPI();

  // Handle OAuth callback
  if (window.location.pathname.includes('/auth/callback')) {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      api.setAuthToken(token);
      api.auth.getProfile().then(() => {
        window.location.href = '/';
      });
    } else if (error) {
      console.error('Auth error:', error);
      window.showNotification('Authentication failed. Please try again.', 'error');
      setTimeout(() => window.location.href = '/', 3000);
    }
  }

  // Expose globally
  window.RawfinAPI = api;
  window.APIError = APIError;

  console.log('✅ API Client initialized');

})();
