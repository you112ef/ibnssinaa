import axios from 'axios';
import { Platform } from 'react-native';

// Base URL configuration
const getBaseURL = () => {
  if (__DEV__) {
    // Development configuration
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000'; // Android emulator
    } else {
      return 'http://localhost:8000'; // iOS simulator
    }
  } else {
    // Production configuration
    return 'https://your-production-api.com'; // Replace with your production URL
  }
};

const BASE_URL = getBaseURL();

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access - implement token refresh logic');
    } else if (error.response?.status === 404) {
      console.warn('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

class ApiService {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // File upload
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || 'image.jpg',
      });

      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 1 minute timeout for uploads
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Start analysis
  async analyzeFile(fileId) {
    try {
      const response = await api.post(`/api/analyze/${fileId}`, {}, {
        timeout: 300000, // 5 minutes timeout for analysis
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get analysis results
  async getResults(resultId) {
    try {
      const response = await api.get(`/api/results/${resultId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get chart data
  async getChartData(resultId) {
    try {
      const response = await api.get(`/api/charts/${resultId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Export chart as image
  async exportChart(resultId, chartType = 'line') {
    try {
      const response = await api.get(`/api/export/chart/${resultId}`, {
        params: { chart_type: chartType },
        responseType: 'blob',
      });

      // Create blob URL for sharing
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);

      return {
        success: true,
        chartUrl: url,
        blob: blob,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get analysis history
  async getAnalysisHistory() {
    try {
      const response = await api.get('/api/history');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete analysis results
  async deleteResults(resultId) {
    try {
      const response = await api.delete(`/api/results/${resultId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Advanced analysis with custom parameters
  async analyzeWithParams(fileId, params = {}) {
    try {
      const response = await api.post(`/api/analyze/${fileId}`, params, {
        timeout: 300000, // 5 minutes timeout
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Batch upload multiple files
  async batchUpload(files) {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file));
      const results = await Promise.allSettled(uploadPromises);
      
      return results.map((result, index) => ({
        file: files[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Batch analysis
  async batchAnalyze(fileIds) {
    try {
      const analyzePromises = fileIds.map(fileId => this.analyzeFile(fileId));
      const results = await Promise.allSettled(analyzePromises);
      
      return results.map((result, index) => ({
        fileId: fileIds[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get model information
  async getModelInfo() {
    try {
      const response = await api.get('/api/model/info');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get system statistics
  async getSystemStats() {
    try {
      const response = await api.get('/api/system/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Real-time analysis status
  async getAnalysisStatus(analysisId) {
    try {
      const response = await api.get(`/api/analysis/status/${analysisId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Cancel ongoing analysis
  async cancelAnalysis(analysisId) {
    try {
      const response = await api.post(`/api/analysis/cancel/${analysisId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search analysis results
  async searchResults(query, filters = {}) {
    try {
      const response = await api.get('/api/results/search', {
        params: {
          q: query,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generate analysis report
  async generateReport(resultId, format = 'pdf') {
    try {
      const response = await api.get(`/api/reports/${resultId}`, {
        params: { format },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { 
        type: format === 'pdf' ? 'application/pdf' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);

      return {
        success: true,
        reportUrl: url,
        blob: blob,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Compare multiple analysis results
  async compareResults(resultIds) {
    try {
      const response = await api.post('/api/results/compare', {
        result_ids: resultIds,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get analysis insights
  async getAnalysisInsights(resultId) {
    try {
      const response = await api.get(`/api/insights/${resultId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update analysis metadata
  async updateAnalysisMetadata(resultId, metadata) {
    try {
      const response = await api.patch(`/api/results/${resultId}/metadata`, metadata);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get analysis recommendations
  async getRecommendations(resultId) {
    try {
      const response = await api.get(`/api/recommendations/${resultId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Share analysis results
  async shareResults(resultId, shareOptions) {
    try {
      const response = await api.post(`/api/results/${resultId}/share`, shareOptions);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling utility
  handleError(error) {
    const errorMessage = {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: null,
    };

    if (error.response) {
      // Server responded with error status
      errorMessage.message = error.response.data?.error || error.response.statusText;
      errorMessage.code = error.response.data?.error_code || `HTTP_${error.response.status}`;
      errorMessage.details = error.response.data?.details || null;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage.message = 'Network error - please check your connection';
      errorMessage.code = 'NETWORK_ERROR';
    } else {
      // Error in request configuration
      errorMessage.message = error.message;
      errorMessage.code = 'REQUEST_ERROR';
    }

    return errorMessage;
  }

  // Utility method to check if API is reachable
  async isApiReachable() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get base URL for external use
  getBaseUrl() {
    return BASE_URL;
  }

  // Update base URL dynamically
  setBaseUrl(newUrl) {
    api.defaults.baseURL = newUrl;
  }

  // Set authentication token
  setAuthToken(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }

  // File validation before upload
  validateFile(file) {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/bmp',
      'image/tiff',
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/mkv',
      'video/wmv',
    ];

    if (file.fileSize && file.fileSize > maxSize) {
      throw new Error('File size too large. Maximum size is 100MB.');
    }

    if (file.type && !allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only images and videos are supported.');
    }

    return true;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();

// Export individual methods for convenience
export const {
  healthCheck,
  uploadFile,
  analyzeFile,
  getResults,
  getChartData,
  exportChart,
  getAnalysisHistory,
  deleteResults,
} = apiService;

export default apiService;