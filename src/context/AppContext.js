import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  lastAnalysisResult: null,
  uploadedFiles: [],
  analysisHistory: [],
  currentAnalysis: null,
  isAnalyzing: false,
  uploadProgress: 0,
  analysisProgress: 0,
  settings: {
    notifications: true,
    autoSave: true,
    defaultTheme: 'light',
    dataRetention: 30, // days
  },
  networkStatus: 'online',
  apiStatus: 'connected',
};

// Action types
const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_LAST_ANALYSIS_RESULT: 'SET_LAST_ANALYSIS_RESULT',
  ADD_UPLOADED_FILE: 'ADD_UPLOADED_FILE',
  REMOVE_UPLOADED_FILE: 'REMOVE_UPLOADED_FILE',
  CLEAR_UPLOADED_FILES: 'CLEAR_UPLOADED_FILES',
  SET_ANALYSIS_HISTORY: 'SET_ANALYSIS_HISTORY',
  ADD_ANALYSIS_TO_HISTORY: 'ADD_ANALYSIS_TO_HISTORY',
  SET_CURRENT_ANALYSIS: 'SET_CURRENT_ANALYSIS',
  SET_ANALYZING_STATUS: 'SET_ANALYZING_STATUS',
  SET_UPLOAD_PROGRESS: 'SET_UPLOAD_PROGRESS',
  SET_ANALYSIS_PROGRESS: 'SET_ANALYSIS_PROGRESS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RESET_SETTINGS: 'RESET_SETTINGS',
  SET_NETWORK_STATUS: 'SET_NETWORK_STATUS',
  SET_API_STATUS: 'SET_API_STATUS',
  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case ActionTypes.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };

    case ActionTypes.SET_LAST_ANALYSIS_RESULT:
      return {
        ...state,
        lastAnalysisResult: action.payload,
      };

    case ActionTypes.ADD_UPLOADED_FILE:
      return {
        ...state,
        uploadedFiles: [...state.uploadedFiles, action.payload],
      };

    case ActionTypes.REMOVE_UPLOADED_FILE:
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.filter(
          file => file.id !== action.payload
        ),
      };

    case ActionTypes.CLEAR_UPLOADED_FILES:
      return {
        ...state,
        uploadedFiles: [],
      };

    case ActionTypes.SET_ANALYSIS_HISTORY:
      return {
        ...state,
        analysisHistory: action.payload,
      };

    case ActionTypes.ADD_ANALYSIS_TO_HISTORY:
      return {
        ...state,
        analysisHistory: [action.payload, ...state.analysisHistory],
      };

    case ActionTypes.SET_CURRENT_ANALYSIS:
      return {
        ...state,
        currentAnalysis: action.payload,
      };

    case ActionTypes.SET_ANALYZING_STATUS:
      return {
        ...state,
        isAnalyzing: action.payload,
      };

    case ActionTypes.SET_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: action.payload,
      };

    case ActionTypes.SET_ANALYSIS_PROGRESS:
      return {
        ...state,
        analysisProgress: action.payload,
      };

    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case ActionTypes.RESET_SETTINGS:
      return {
        ...state,
        settings: initialState.settings,
      };

    case ActionTypes.SET_NETWORK_STATUS:
      return {
        ...state,
        networkStatus: action.payload,
      };

    case ActionTypes.SET_API_STATUS:
      return {
        ...state,
        apiStatus: action.payload,
      };

    case ActionTypes.CLEAR_ALL_DATA:
      return {
        ...initialState,
        settings: state.settings, // Keep settings
      };

    default:
      return state;
  }
};

// Context Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted data on app start
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Save critical data to AsyncStorage
  useEffect(() => {
    savePersistedData();
  }, [state.settings, state.lastAnalysisResult]);

  const loadPersistedData = async () => {
    try {
      // Load settings
      const savedSettings = await AsyncStorage.getItem('app_settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        dispatch({
          type: ActionTypes.UPDATE_SETTINGS,
          payload: settings,
        });
      }

      // Load last analysis result
      const lastResult = await AsyncStorage.getItem('last_analysis_result');
      if (lastResult) {
        const result = JSON.parse(lastResult);
        dispatch({
          type: ActionTypes.SET_LAST_ANALYSIS_RESULT,
          payload: result,
        });
      }

      console.log('✅ Persisted data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load persisted data:', error);
    }
  };

  const savePersistedData = async () => {
    try {
      // Save settings
      await AsyncStorage.setItem('app_settings', JSON.stringify(state.settings));

      // Save last analysis result (if exists)
      if (state.lastAnalysisResult) {
        await AsyncStorage.setItem(
          'last_analysis_result',
          JSON.stringify(state.lastAnalysisResult)
        );
      }
    } catch (error) {
      console.error('❌ Failed to save persisted data:', error);
    }
  };

  // Action creators
  const actions = {
    setUser: (user) => {
      dispatch({ type: ActionTypes.SET_USER, payload: user });
    },

    setAuthenticated: (isAuthenticated) => {
      dispatch({ type: ActionTypes.SET_AUTHENTICATED, payload: isAuthenticated });
    },

    setLastAnalysisResult: (result) => {
      dispatch({ type: ActionTypes.SET_LAST_ANALYSIS_RESULT, payload: result });
    },

    addUploadedFile: (file) => {
      dispatch({ type: ActionTypes.ADD_UPLOADED_FILE, payload: file });
    },

    removeUploadedFile: (fileId) => {
      dispatch({ type: ActionTypes.REMOVE_UPLOADED_FILE, payload: fileId });
    },

    clearUploadedFiles: () => {
      dispatch({ type: ActionTypes.CLEAR_UPLOADED_FILES });
    },

    setAnalysisHistory: (history) => {
      dispatch({ type: ActionTypes.SET_ANALYSIS_HISTORY, payload: history });
    },

    addAnalysisToHistory: (analysis) => {
      dispatch({ type: ActionTypes.ADD_ANALYSIS_TO_HISTORY, payload: analysis });
    },

    setCurrentAnalysis: (analysis) => {
      dispatch({ type: ActionTypes.SET_CURRENT_ANALYSIS, payload: analysis });
    },

    setAnalyzingStatus: (isAnalyzing) => {
      dispatch({ type: ActionTypes.SET_ANALYZING_STATUS, payload: isAnalyzing });
    },

    setUploadProgress: (progress) => {
      dispatch({ type: ActionTypes.SET_UPLOAD_PROGRESS, payload: progress });
    },

    setAnalysisProgress: (progress) => {
      dispatch({ type: ActionTypes.SET_ANALYSIS_PROGRESS, payload: progress });
    },

    updateSettings: (settings) => {
      dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings });
    },

    resetSettings: () => {
      dispatch({ type: ActionTypes.RESET_SETTINGS });
    },

    setNetworkStatus: (status) => {
      dispatch({ type: ActionTypes.SET_NETWORK_STATUS, payload: status });
    },

    setApiStatus: (status) => {
      dispatch({ type: ActionTypes.SET_API_STATUS, payload: status });
    },

    clearAllData: () => {
      dispatch({ type: ActionTypes.CLEAR_ALL_DATA });
      // Clear AsyncStorage
      AsyncStorage.multiRemove(['last_analysis_result']);
    },

    // Complex actions
    startAnalysis: (fileData) => {
      dispatch({ type: ActionTypes.SET_ANALYZING_STATUS, payload: true });
      dispatch({ type: ActionTypes.SET_ANALYSIS_PROGRESS, payload: 0 });
      dispatch({ type: ActionTypes.SET_CURRENT_ANALYSIS, payload: {
        fileId: fileData.file_id,
        startTime: new Date().toISOString(),
        status: 'started',
      }});
    },

    completeAnalysis: (result) => {
      dispatch({ type: ActionTypes.SET_ANALYZING_STATUS, payload: false });
      dispatch({ type: ActionTypes.SET_ANALYSIS_PROGRESS, payload: 100 });
      dispatch({ type: ActionTypes.SET_LAST_ANALYSIS_RESULT, payload: result });
      dispatch({ type: ActionTypes.ADD_ANALYSIS_TO_HISTORY, payload: result });
      dispatch({ type: ActionTypes.SET_CURRENT_ANALYSIS, payload: null });
    },

    failAnalysis: (error) => {
      dispatch({ type: ActionTypes.SET_ANALYZING_STATUS, payload: false });
      dispatch({ type: ActionTypes.SET_ANALYSIS_PROGRESS, payload: 0 });
      dispatch({ type: ActionTypes.SET_CURRENT_ANALYSIS, payload: {
        ...state.currentAnalysis,
        status: 'failed',
        error: error,
      }});
    },
  };

  // Computed values
  const computed = {
    hasUploadedFiles: state.uploadedFiles.length > 0,
    hasAnalysisHistory: state.analysisHistory.length > 0,
    canAnalyze: !state.isAnalyzing && state.networkStatus === 'online',
    isOffline: state.networkStatus === 'offline',
    totalAnalyses: state.analysisHistory.length,
    lastAnalysisDate: state.lastAnalysisResult?.analysis_time || null,
  };

  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Computed values
    ...computed,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Export action types for external use
export { ActionTypes };

export default AppContext;