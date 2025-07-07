import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLanguage, getCurrentLanguage, isRTL, getAvailableLanguages } from '../utils/i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isRightToLeft, setIsRightToLeft] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      // Load saved language preference
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      
      if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
        await changeLanguage(savedLanguage, false); // Don't save again
      } else {
        // Use device default or fallback to English
        const deviceLanguage = getCurrentLanguage();
        await changeLanguage(deviceLanguage, true); // Save the default
      }
      
      setIsInitialized(true);
      console.log('✅ Language initialized:', currentLanguage);
    } catch (error) {
      console.error('❌ Failed to initialize language:', error);
      setCurrentLanguage('en');
      setIsRightToLeft(false);
      setIsInitialized(true);
    }
  };

  const changeLanguage = async (languageCode, shouldSave = true) => {
    try {
      // Validate language code
      if (!['en', 'ar'].includes(languageCode)) {
        throw new Error(`Unsupported language: ${languageCode}`);
      }

      // Set language in i18n system
      setLanguage(languageCode);
      
      // Update local state
      setCurrentLanguage(languageCode);
      const rtl = languageCode === 'ar';
      setIsRightToLeft(rtl);

      // Configure RTL layout
      if (I18nManager.isRTL !== rtl) {
        I18nManager.forceRTL(rtl);
        // Note: In a real app, you'd need to restart the app for RTL to take effect
        console.log(`RTL layout ${rtl ? 'enabled' : 'disabled'}. App restart may be required.`);
      }

      // Save to storage
      if (shouldSave) {
        await AsyncStorage.setItem('selectedLanguage', languageCode);
      }

      console.log(`✅ Language changed to: ${languageCode}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to change language:', error);
      return false;
    }
  };

  const toggleLanguage = async () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    return await changeLanguage(newLanguage);
  };

  const getLanguageInfo = (langCode = currentLanguage) => {
    const languages = getAvailableLanguages();
    return languages.find(lang => lang.code === langCode) || languages[0];
  };

  const formatTextDirection = (text) => {
    // Handle mixed text direction for better readability
    if (isRightToLeft && text) {
      // Add RTL markers for Arabic text
      return `\u202B${text}\u202C`;
    }
    return text;
  };

  const getLocalizedNumber = (number) => {
    if (isRightToLeft && typeof number === 'number') {
      // Convert to Arabic-Indic numerals
      const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
      return number.toString().replace(/[0-9]/g, (digit) => {
        return arabicNumerals[parseInt(digit)];
      });
    }
    return number.toString();
  };

  const getLocalizedDate = (date, options = {}) => {
    const locale = isRightToLeft ? 'ar-SA' : 'en-US';
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    };
    
    try {
      return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date));
    } catch (error) {
      console.error('Date formatting error:', error);
      return date.toString();
    }
  };

  const getFlexDirection = () => {
    return isRightToLeft ? 'row-reverse' : 'row';
  };

  const getTextAlign = (alignment = 'auto') => {
    if (alignment === 'auto') {
      return isRightToLeft ? 'right' : 'left';
    }
    if (alignment === 'start') {
      return isRightToLeft ? 'right' : 'left';
    }
    if (alignment === 'end') {
      return isRightToLeft ? 'left' : 'right';
    }
    return alignment; // center, justify
  };

  const getWritingDirection = () => {
    return isRightToLeft ? 'rtl' : 'ltr';
  };

  // Helper function to get margin/padding with RTL support
  const getDirectionalStyle = (style) => {
    if (!isRightToLeft) return style;

    const rtlStyle = { ...style };
    
    // Swap left/right margins
    if (style.marginLeft !== undefined) {
      rtlStyle.marginRight = style.marginLeft;
      delete rtlStyle.marginLeft;
    }
    if (style.marginRight !== undefined) {
      rtlStyle.marginLeft = style.marginRight;
      delete rtlStyle.marginRight;
    }
    
    // Swap left/right padding
    if (style.paddingLeft !== undefined) {
      rtlStyle.paddingRight = style.paddingLeft;
      delete rtlStyle.paddingLeft;
    }
    if (style.paddingRight !== undefined) {
      rtlStyle.paddingLeft = style.paddingRight;
      delete rtlStyle.paddingRight;
    }

    // Swap left/right positioning
    if (style.left !== undefined) {
      rtlStyle.right = style.left;
      delete rtlStyle.left;
    }
    if (style.right !== undefined) {
      rtlStyle.left = style.right;
      delete rtlStyle.right;
    }

    return rtlStyle;
  };

  const contextValue = {
    // State
    currentLanguage,
    isRightToLeft,
    isRTL: isRightToLeft, // Alias for convenience
    isInitialized,
    
    // Actions
    changeLanguage,
    toggleLanguage,
    
    // Utilities
    getLanguageInfo,
    formatTextDirection,
    getLocalizedNumber,
    getLocalizedDate,
    getFlexDirection,
    getTextAlign,
    getWritingDirection,
    getDirectionalStyle,
    
    // Available languages
    availableLanguages: getAvailableLanguages(),
    
    // Language-specific helpers
    isArabic: currentLanguage === 'ar',
    isEnglish: currentLanguage === 'en',
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// HOC for automatic RTL support
export const withRTL = (Component) => {
  return (props) => {
    const { isRTL, getDirectionalStyle } = useLanguage();
    
    return (
      <Component
        {...props}
        isRTL={isRTL}
        getDirectionalStyle={getDirectionalStyle}
      />
    );
  };
};

export default LanguageContext;