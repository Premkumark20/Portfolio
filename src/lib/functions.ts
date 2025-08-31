// Utility functions for interacting with Netlify Functions

const API_BASE = '/.netlify/functions';

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface AnalyticsData {
  page: string;
  referrer?: string;
  userAgent?: string;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
}

// Portfolio data functions
export const fetchPortfolioDataFromAPI = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/portfolio-data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/csv',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching portfolio data from API:', error);
    throw error;
  }
};

// Contact form functions
export const submitContactForm = async (formData: ContactFormData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

// Analytics functions
export const trackPageView = async (data: AnalyticsData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE}/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Error tracking page view:', error);
    // Don't throw for analytics errors, just log them
    return { success: false, error: error.message };
  }
};

export const getAnalytics = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE}/analytics`, {
      method: 'GET',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

// Health check functions
export const checkHealth = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

// Utility function to check if running on Netlify
export const isNetlify = (): boolean => {
  return typeof window !== 'undefined' && 
         (window.location.hostname.includes('netlify.app') || 
          window.location.hostname.includes('netlify.com') ||
          process.env.NETLIFY === 'true');
};
