import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, commonStyles } from '../styles/theme';

const ThemeContext = createContext();

// Theme configurations
const lightTheme = {
  colors: {
    ...COLORS,
    // Override for light theme if needed
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
  },
  fonts: FONTS,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  commonStyles,
  isDark: false,
  name: 'light',
};

const darkTheme = {
  colors: {
    ...COLORS,
    // Dark theme colors
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    primaryLight: '#60A5FA',
    background: '#111827',
    surface: '#1F2937',
    surfaceSecondary: '#374151',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textLight: '#9CA3AF',
    border: '#374151',
    divider: '#4B5563',
  },
  fonts: FONTS,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: {
    ...SHADOWS,
    light: {
      ...SHADOWS.light,
      shadowColor: '#000000',
      shadowOpacity: 0.3,
    },
    medium: {
      ...SHADOWS.medium,
      shadowColor: '#000000',
      shadowOpacity: 0.4,
    },
    heavy: {
      ...SHADOWS.heavy,
      shadowColor: '#000000',
      shadowOpacity: 0.5,
    },
  },
  commonStyles: {
    ...commonStyles,
    container: {
      ...commonStyles.container,
      backgroundColor: '#111827',
    },
    card: {
      ...commonStyles.card,
      backgroundColor: '#1F2937',
      shadowColor: '#000000',
    },
  },
  isDark: true,
  name: 'dark',
};

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeTheme();
    
    // Listen to system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (isSystemTheme) {
        handleSystemThemeChange(colorScheme);
      }
    });

    return () => subscription?.remove();
  }, [isSystemTheme]);

  useEffect(() => {
    // Update status bar style when theme changes
    updateStatusBar();
  }, [currentTheme]);

  const initializeTheme = async () => {
    try {
      // Load saved theme preference
      const savedTheme = await AsyncStorage.getItem('selectedTheme');
      const savedSystemPreference = await AsyncStorage.getItem('useSystemTheme');
      
      const useSystem = savedSystemPreference !== null ? 
        JSON.parse(savedSystemPreference) : true;
      
      setIsSystemTheme(useSystem);

      if (useSystem) {
        // Use system theme
        const systemColorScheme = Appearance.getColorScheme();
        handleSystemThemeChange(systemColorScheme);
      } else if (savedTheme && themes[savedTheme]) {
        // Use saved theme
        applyTheme(savedTheme, false);
      } else {
        // Default to light theme
        applyTheme('light', true);
      }

      setIsInitialized(true);
      console.log('✅ Theme initialized:', currentTheme);
    } catch (error) {
      console.error('❌ Failed to initialize theme:', error);
      setCurrentTheme('light');
      setIsDarkMode(false);
      setIsInitialized(true);
    }
  };

  const handleSystemThemeChange = (colorScheme) => {
    const systemTheme = colorScheme === 'dark' ? 'dark' : 'light';
    applyTheme(systemTheme, false);
  };

  const applyTheme = async (themeName, shouldSave = true) => {
    try {
      if (!themes[themeName]) {
        throw new Error(`Theme "${themeName}" not found`);
      }

      setCurrentTheme(themeName);
      setIsDarkMode(themeName === 'dark');

      if (shouldSave) {
        await AsyncStorage.setItem('selectedTheme', themeName);
      }

      console.log(`✅ Theme applied: ${themeName}`);
    } catch (error) {
      console.error('❌ Failed to apply theme:', error);
    }
  };

  const changeTheme = async (themeName) => {
    setIsSystemTheme(false);
    await AsyncStorage.setItem('useSystemTheme', 'false');
    await applyTheme(themeName, true);
  };

  const toggleTheme = async () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    await changeTheme(newTheme);
  };

  const useSystemTheme = async () => {
    setIsSystemTheme(true);
    await AsyncStorage.setItem('useSystemTheme', 'true');
    
    const systemColorScheme = Appearance.getColorScheme();
    handleSystemThemeChange(systemColorScheme);
  };

  const updateStatusBar = () => {
    const theme = themes[currentTheme];
    StatusBar.setBarStyle(
      theme.isDark ? 'light-content' : 'dark-content',
      true
    );
  };

  // Helper functions for styling
  const getThemedStyle = (lightStyle, darkStyle) => {
    return isDarkMode ? darkStyle : lightStyle;
  };

  const getThemedColor = (colorKey) => {
    const theme = themes[currentTheme];
    return theme.colors[colorKey] || colorKey;
  };

  const createThemedStyles = (styleFunction) => {
    const theme = themes[currentTheme];
    return styleFunction(theme);
  };

  const interpolateColor = (lightColor, darkColor, opacity = 1) => {
    const color = isDarkMode ? darkColor : lightColor;
    if (opacity < 1) {
      // Convert hex to rgba
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  };

  // Card styles with theme support
  const getCardStyle = (customStyle = {}) => {
    const theme = themes[currentTheme];
    return {
      ...theme.commonStyles.card,
      ...customStyle,
    };
  };

  // Button styles with theme support
  const getButtonStyle = (variant = 'primary', customStyle = {}) => {
    const theme = themes[currentTheme];
    
    const variants = {
      primary: {
        backgroundColor: theme.colors.primary,
        ...theme.commonStyles.button,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        ...theme.commonStyles.button,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
        ...theme.commonStyles.button,
      },
      ghost: {
        backgroundColor: 'transparent',
        ...theme.commonStyles.button,
      },
    };

    return {
      ...variants[variant],
      ...customStyle,
    };
  };

  // Text styles with theme support
  const getTextStyle = (variant = 'body', customStyle = {}) => {
    const theme = themes[currentTheme];
    
    const variants = {
      h1: { fontSize: theme.fonts.h1, fontWeight: theme.fonts.weights.bold, color: theme.colors.text },
      h2: { fontSize: theme.fonts.h2, fontWeight: theme.fonts.weights.bold, color: theme.colors.text },
      h3: { fontSize: theme.fonts.h3, fontWeight: theme.fonts.weights.bold, color: theme.colors.text },
      h4: { fontSize: theme.fonts.h4, fontWeight: theme.fonts.weights.semibold, color: theme.colors.text },
      h5: { fontSize: theme.fonts.h5, fontWeight: theme.fonts.weights.semibold, color: theme.colors.text },
      h6: { fontSize: theme.fonts.h6, fontWeight: theme.fonts.weights.semibold, color: theme.colors.text },
      body: { fontSize: theme.fonts.body, color: theme.colors.text },
      bodySmall: { fontSize: theme.fonts.bodySmall, color: theme.colors.text },
      caption: { fontSize: theme.fonts.caption, color: theme.colors.textSecondary },
      label: { fontSize: theme.fonts.bodySmall, fontWeight: theme.fonts.weights.medium, color: theme.colors.text },
    };

    return {
      ...variants[variant],
      ...customStyle,
    };
  };

  // Animation helper
  const getAnimationConfig = (type = 'default') => {
    const configs = {
      default: {
        duration: 300,
        useNativeDriver: true,
      },
      fast: {
        duration: 150,
        useNativeDriver: true,
      },
      slow: {
        duration: 500,
        useNativeDriver: true,
      },
    };

    return configs[type] || configs.default;
  };

  const contextValue = {
    // Current theme state
    currentTheme,
    isDarkMode,
    isSystemTheme,
    isInitialized,
    theme: themes[currentTheme],
    
    // Theme actions
    changeTheme,
    toggleTheme,
    useSystemTheme,
    
    // Helper functions
    getThemedStyle,
    getThemedColor,
    createThemedStyles,
    interpolateColor,
    getCardStyle,
    getButtonStyle,
    getTextStyle,
    getAnimationConfig,
    
    // Available themes
    availableThemes: Object.keys(themes),
    themes,
    
    // Quick access to current theme properties
    colors: themes[currentTheme].colors,
    fonts: themes[currentTheme].fonts,
    spacing: themes[currentTheme].spacing,
    borderRadius: themes[currentTheme].borderRadius,
    shadows: themes[currentTheme].shadows,
    commonStyles: themes[currentTheme].commonStyles,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// HOC for automatic theme support
export const withTheme = (Component) => {
  return (props) => {
    const theme = useTheme();
    
    return (
      <Component
        {...props}
        theme={theme}
      />
    );
  };
};

export default ThemeContext;