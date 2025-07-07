import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONTS, SPACING, commonStyles } from '../styles/theme';
import { translate } from '../utils/i18n';

const { width: screenWidth } = Dimensions.get('window');

const LoadingSpinner = ({ 
  message = translate('loading'), 
  size = 'large',
  color = COLORS.primary,
  showMessage = true,
  style,
  overlay = false,
}) => {
  if (overlay) {
    return (
      <View style={[styles.overlay, style]}>
        <View style={styles.overlayContent}>
          <ActivityIndicator size={size} color={color} />
          {showMessage && (
            <Animatable.Text 
              animation="pulse" 
              iterationCount="infinite"
              style={styles.overlayMessage}
            >
              {message}
            </Animatable.Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {showMessage && (
        <Animatable.Text 
          animation="pulse" 
          iterationCount="infinite"
          style={styles.message}
        >
          {message}
        </Animatable.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  message: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.xl,
    alignItems: 'center',
    minWidth: screenWidth * 0.4,
    ...commonStyles.card,
  },
  overlayMessage: {
    fontSize: FONTS.body,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});

export default LoadingSpinner;