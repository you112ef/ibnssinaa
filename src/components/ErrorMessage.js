import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, commonStyles } from '../styles/theme';
import { translate } from '../utils/i18n';

const ErrorMessage = ({ 
  message = translate('unknownError'), 
  onRetry,
  retryText = translate('retry'),
  showRetry = true,
  style,
  iconName = 'error-outline',
  iconSize = 48,
  iconColor = COLORS.error,
}) => {
  return (
    <Animatable.View 
      animation="fadeIn" 
      style={[styles.container, style]}
    >
      <Icon 
        name={iconName} 
        size={iconSize} 
        color={iconColor} 
        style={styles.icon}
      />
      
      <Text style={styles.message}>{message}</Text>
      
      {showRetry && onRetry && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Icon name="refresh" size={20} color={COLORS.white} />
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    margin: SPACING.md,
    ...commonStyles.card,
  },
  icon: {
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: FONTS.body,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  retryText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: FONTS.weights.semibold,
    marginLeft: SPACING.sm,
  },
});

export default ErrorMessage;