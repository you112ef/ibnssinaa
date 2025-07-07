export const COLORS = {
  // Primary dark blue theme
  primary: '#1E3A8A',      // Dark blue
  primaryDark: '#1E40AF',   // Darker blue
  primaryLight: '#3B82F6',  // Lighter blue
  
  // Secondary colors
  secondary: '#10B981',     // Green for success
  accent: '#F59E0B',        // Amber for warnings
  
  // Status colors
  success: '#10B981',       // Green
  warning: '#F59E0B',       // Amber
  error: '#EF4444',         // Red
  info: '#3B82F6',          // Blue
  
  // Background colors
  background: '#F8FAFC',    // Light gray background
  surface: '#FFFFFF',       // White surface
  surfaceSecondary: '#F1F5F9', // Light gray surface
  
  // Text colors
  text: '#1F2937',          // Dark gray text
  textSecondary: '#6B7280', // Medium gray text
  textLight: '#9CA3AF',     // Light gray text
  white: '#FFFFFF',
  black: '#000000',
  
  // Border and divider colors
  border: '#E5E7EB',        // Light border
  divider: '#F3F4F6',       // Very light divider
  
  // Chart colors
  chart: {
    primary: '#1E3A8A',
    secondary: '#10B981',
    tertiary: '#F59E0B',
    quaternary: '#EF4444',
    gradient: ['#1E3A8A', '#3B82F6', '#10B981'],
  },
  
  // Quality indicators
  quality: {
    excellent: '#10B981',   // Green
    good: '#3B82F6',        // Blue
    fair: '#F59E0B',        // Amber
    poor: '#EF4444',        // Red
  },
  
  // Motility indicators
  motility: {
    normal: '#10B981',      // Green
    belowNormal: '#F59E0B', // Amber
    low: '#FB923C',         // Orange
    veryLow: '#EF4444',     // Red
  },
  
  // Transparency levels
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
};

export const FONTS = {
  // Font families
  primary: 'System',
  secondary: 'System',
  
  // Font sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tiny: 10,
  
  // Font weights
  weights: {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 999,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  heavy: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const ANIMATIONS = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Common styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    ...SHADOWS.light,
  },
  
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: FONTS.weights.semibold,
  },
  
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.body,
    backgroundColor: COLORS.surface,
  },
  
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  flex1: {
    flex: 1,
  },
  
  textCenter: {
    textAlign: 'center',
  },
  
  textRight: {
    textAlign: 'right',
  },
  
  textLeft: {
    textAlign: 'left',
  },
  
  marginTop: {
    marginTop: SPACING.md,
  },
  
  marginBottom: {
    marginBottom: SPACING.md,
  },
  
  marginHorizontal: {
    marginHorizontal: SPACING.md,
  },
  
  marginVertical: {
    marginVertical: SPACING.md,
  },
  
  paddingHorizontal: {
    paddingHorizontal: SPACING.md,
  },
  
  paddingVertical: {
    paddingVertical: SPACING.md,
  },
};

// Chart theme configuration
export const chartTheme = {
  backgroundColor: COLORS.surface,
  backgroundGradientFrom: COLORS.surface,
  backgroundGradientTo: COLORS.surface,
  color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`, // Primary blue
  strokeWidth: 2,
  barPercentage: 0.7,
  fillShadowGradient: COLORS.primaryLight,
  fillShadowGradientOpacity: 0.3,
  useShadowColorFromDataset: false,
  decimalPlaces: 1,
  style: {
    borderRadius: BORDER_RADIUS.md,
  },
  propsForLabels: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.weights.medium,
    fill: COLORS.text,
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: COLORS.border,
    strokeWidth: 1,
  },
  propsForVerticalLabels: {
    fontSize: FONTS.caption,
    fill: COLORS.textSecondary,
  },
  propsForHorizontalLabels: {
    fontSize: FONTS.caption,
    fill: COLORS.textSecondary,
  },
};

export default {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATIONS,
  commonStyles,
  chartTheme,
};