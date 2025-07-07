import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Linking,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { COLORS, FONTS, SPACING, BORDER_RADIUS, commonStyles } from '../styles/theme';
import { translate, getCurrentLanguage } from '../utils/i18n';
import { useLanguageContext } from '../context/LanguageContext';
import { useThemeContext } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';

const SettingsScreen = () => {
  const { language, changeLanguage } = useLanguageContext();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { clearAnalysisHistory, analysisHistory } = useAppContext();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSaveResults, setAutoSaveResults] = useState(true);
  const [highQualityAnalysis, setHighQualityAnalysis] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);

  const handleLanguageChange = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    changeLanguage(newLanguage);
  };

  const handleClearData = () => {
    Alert.alert(
      translate('clearDataTitle'),
      translate('clearDataMessage'),
      [
        {
          text: translate('cancel'),
          style: 'cancel',
        },
        {
          text: translate('confirm'),
          style: 'destructive',
          onPress: () => {
            clearAnalysisHistory();
            Alert.alert(translate('success'), translate('dataCleared'));
          },
        },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: translate('shareAppMessage'),
        title: translate('shareApp'),
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const handleContactSupport = () => {
    const email = 'support@spermanalyzer.com';
    const subject = translate('supportSubject');
    const body = translate('supportBody');
    
    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  const handleRateApp = () => {
    // يمكن استبدال هذا برابط متجر التطبيقات الفعلي
    Alert.alert(
      translate('rateApp'),
      translate('rateAppMessage'),
      [
        { text: translate('cancel'), style: 'cancel' },
        { text: translate('rateNow'), onPress: () => {} },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>{translate('settings')}</Text>
        <Text style={styles.headerSubtitle}>{translate('customizeApp')}</Text>
      </LinearGradient>
    </View>
  );

  const renderSection = (title, children) => (
    <Animatable.View animation="fadeInUp" style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </Animatable.View>
  );

  const renderSettingItem = ({
    icon,
    title,
    subtitle,
    value,
    onPress,
    rightComponent,
    iconColor = COLORS.primary,
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: iconColor }]}>
          <Icon name={icon} size={24} color={COLORS.white} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          {value && <Text style={styles.settingValue}>{value}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent || <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  const renderLanguageSettings = () => renderSection(
    translate('languageAndRegion'),
    <>
      {renderSettingItem({
        icon: 'language',
        title: translate('language'),
        subtitle: translate('changeAppLanguage'),
        value: language === 'ar' ? 'العربية' : 'English',
        onPress: handleLanguageChange,
        iconColor: COLORS.secondary,
      })}
      {renderSettingItem({
        icon: 'format-textdirection-r-to-l',
        title: translate('textDirection'),
        subtitle: translate('currentDirection'),
        value: language === 'ar' ? translate('rightToLeft') : translate('leftToRight'),
        iconColor: COLORS.info,
      })}
    </>
  );

  const renderAppearanceSettings = () => renderSection(
    translate('appearance'),
    <>
      {renderSettingItem({
        icon: 'dark-mode',
        title: translate('darkMode'),
        subtitle: translate('toggleDarkMode'),
        onPress: toggleTheme,
        rightComponent: (
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={isDarkMode ? COLORS.white : COLORS.textSecondary}
          />
        ),
        iconColor: COLORS.accent,
      })}
      {renderSettingItem({
        icon: 'palette',
        title: translate('theme'),
        subtitle: translate('appTheme'),
        value: translate('darkBlue'),
        iconColor: COLORS.primary,
      })}
    </>
  );

  const renderAnalysisSettings = () => renderSection(
    translate('analysisSettings'),
    <>
      {renderSettingItem({
        icon: 'offline-bolt',
        title: translate('offlineMode'),
        subtitle: translate('enableOfflineAnalysis'),
        onPress: () => setOfflineMode(!offlineMode),
        rightComponent: (
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: COLORS.border, true: COLORS.success }}
            thumbColor={offlineMode ? COLORS.white : COLORS.textSecondary}
          />
        ),
        iconColor: COLORS.success,
      })}
      {renderSettingItem({
        icon: 'high-quality',
        title: translate('highQualityAnalysis'),
        subtitle: translate('moreAccurateResults'),
        onPress: () => setHighQualityAnalysis(!highQualityAnalysis),
        rightComponent: (
          <Switch
            value={highQualityAnalysis}
            onValueChange={setHighQualityAnalysis}
            trackColor={{ false: COLORS.border, true: COLORS.warning }}
            thumbColor={highQualityAnalysis ? COLORS.white : COLORS.textSecondary}
          />
        ),
        iconColor: COLORS.warning,
      })}
      {renderSettingItem({
        icon: 'save',
        title: translate('autoSave'),
        subtitle: translate('automaticallySaveResults'),
        onPress: () => setAutoSaveResults(!autoSaveResults),
        rightComponent: (
          <Switch
            value={autoSaveResults}
            onValueChange={setAutoSaveResults}
            trackColor={{ false: COLORS.border, true: COLORS.info }}
            thumbColor={autoSaveResults ? COLORS.white : COLORS.textSecondary}
          />
        ),
        iconColor: COLORS.info,
      })}
    </>
  );

  const renderNotificationSettings = () => renderSection(
    translate('notifications'),
    <>
      {renderSettingItem({
        icon: 'notifications',
        title: translate('enableNotifications'),
        subtitle: translate('receiveImportantUpdates'),
        onPress: () => setNotificationsEnabled(!notificationsEnabled),
        rightComponent: (
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={notificationsEnabled ? COLORS.white : COLORS.textSecondary}
          />
        ),
        iconColor: COLORS.primary,
      })}
      {renderSettingItem({
        icon: 'schedule',
        title: translate('reminderNotifications'),
        subtitle: translate('remindMeToAnalyze'),
        iconColor: COLORS.secondary,
      })}
    </>
  );

  const renderDataSettings = () => renderSection(
    translate('dataManagement'),
    <>
      {renderSettingItem({
        icon: 'storage',
        title: translate('analysisHistory'),
        subtitle: translate('manageStoredResults'),
        value: `${analysisHistory.length} ${translate('results')}`,
        iconColor: COLORS.info,
      })}
      {renderSettingItem({
        icon: 'delete',
        title: translate('clearData'),
        subtitle: translate('deleteAllResults'),
        onPress: handleClearData,
        iconColor: COLORS.error,
      })}
      {renderSettingItem({
        icon: 'download',
        title: translate('exportData'),
        subtitle: translate('exportAllResults'),
        iconColor: COLORS.success,
      })}
    </>
  );

  const renderAboutSettings = () => renderSection(
    translate('aboutApp'),
    <>
      {renderSettingItem({
        icon: 'info',
        title: translate('appVersion'),
        subtitle: translate('currentVersion'),
        value: '1.0.0',
        iconColor: COLORS.primary,
      })}
      {renderSettingItem({
        icon: 'share',
        title: translate('shareApp'),
        subtitle: translate('tellFriendsAboutApp'),
        onPress: handleShareApp,
        iconColor: COLORS.secondary,
      })}
      {renderSettingItem({
        icon: 'star',
        title: translate('rateApp'),
        subtitle: translate('rateInStore'),
        onPress: handleRateApp,
        iconColor: COLORS.warning,
      })}
      {renderSettingItem({
        icon: 'support',
        title: translate('contactSupport'),
        subtitle: translate('getHelpAndSupport'),
        onPress: handleContactSupport,
        iconColor: COLORS.accent,
      })}
    </>
  );

  const renderPrivacySettings = () => renderSection(
    translate('privacyAndSecurity'),
    <>
      {renderSettingItem({
        icon: 'privacy-tip',
        title: translate('privacyPolicy'),
        subtitle: translate('readPrivacyPolicy'),
        iconColor: COLORS.error,
      })}
      {renderSettingItem({
        icon: 'description',
        title: translate('termsOfService'),
        subtitle: translate('readTermsOfService'),
        iconColor: COLORS.info,
      })}
      {renderSettingItem({
        icon: 'security',
        title: translate('dataSecurity'),
        subtitle: translate('yourDataIsSecure'),
        iconColor: COLORS.success,
      })}
    </>
  );

  return (
    <View style={commonStyles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderLanguageSettings()}
        {renderAppearanceSettings()}
        {renderAnalysisSettings()}
        {renderNotificationSettings()}
        {renderDataSettings()}
        {renderAboutSettings()}
        {renderPrivacySettings()}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {translate('madeWith')} ❤️ {translate('for')} {translate('reproductiveHealth')}
          </Text>
          <Text style={styles.versionText}>
            {translate('version')} 1.0.0 • {translate('offlineCapable')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    margin: SPACING.md,
    marginBottom: SPACING.lg,
    ...commonStyles.card,
  },
  headerGradient: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONTS.body,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  section: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
  },
  sectionContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...commonStyles.card,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONTS.body,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  settingSubtitle: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  settingValue: {
    fontSize: FONTS.caption,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
    marginTop: SPACING.xs,
  },
  settingRight: {
    marginLeft: SPACING.md,
  },
  footer: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  versionText: {
    fontSize: FONTS.tiny,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SettingsScreen;