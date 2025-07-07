import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useQuery } from 'react-query';
import { useNavigation } from '@react-navigation/native';

import { COLORS, FONTS, SPACING, BORDER_RADIUS, commonStyles } from '../styles/theme';
import { translate, formatDate } from '../utils/i18n';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/apiService';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { lastAnalysisResult, setLastAnalysisResult } = useAppContext();

  // Fetch recent analyses
  const {
    data: analysisHistory,
    isLoading,
    refetch,
    isRefreshing,
  } = useQuery('analysisHistory', apiService.getAnalysisHistory, {
    refetchOnMount: true,
    staleTime: 60000, // 1 minute
  });

  const quickActions = [
    {
      id: 'analyze',
      title: translate('startNewAnalysis'),
      icon: 'analytics',
      color: COLORS.primary,
      screen: 'Analyze',
    },
    {
      id: 'results',
      title: translate('viewRecentResults'),
      icon: 'assessment',
      color: COLORS.secondary,
      screen: 'Results',
    },
    {
      id: 'charts',
      title: translate('viewCharts'),
      icon: 'insert-chart',
      color: COLORS.accent,
      screen: 'Graph',
    },
  ];

  const handleQuickAction = (action) => {
    navigation.navigate(action.screen);
  };

  const handleViewAnalysis = (analysis) => {
    setLastAnalysisResult(analysis);
    navigation.navigate('Results');
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryLight]}
      style={styles.headerGradient}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>{translate('welcome')}</Text>
          <Text style={styles.appTitle}>{translate('spermAnalyzerAI')}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Icon name="account-circle" size={40} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <Text style={styles.appDescription}>
        {translate('appDescription')}
      </Text>
    </LinearGradient>
  );

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{translate('quickActions')}</Text>
      <View style={styles.quickActionsContainer}>
        {quickActions.map((action, index) => (
          <Animatable.View
            key={action.id}
            animation="fadeInUp"
            delay={index * 100}
            style={styles.quickActionWrapper}
          >
            <TouchableOpacity
              style={[styles.quickActionCard, { borderLeftColor: action.color }]}
              onPress={() => handleQuickAction(action)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Icon name={action.icon} size={28} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Icon name="arrow-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    </View>
  );

  const renderRecentAnalyses = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{translate('recentAnalyses')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Results')}>
          <Text style={styles.viewAllButton}>{translate('viewAll')}</Text>
        </TouchableOpacity>
      </View>

      {!analysisHistory?.history?.length ? (
        <View style={styles.emptyState}>
          <Icon name="analytics" size={60} color={COLORS.textLight} />
          <Text style={styles.emptyStateTitle}>{translate('noRecentAnalyses')}</Text>
          <Text style={styles.emptyStateText}>{translate('performFirstAnalysis')}</Text>
          <TouchableOpacity
            style={styles.startAnalysisButton}
            onPress={() => navigation.navigate('Analyze')}
          >
            <Icon name="add" size={20} color={COLORS.white} />
            <Text style={styles.startAnalysisButtonText}>
              {translate('startNewAnalysis')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentAnalysesContainer}
        >
          {analysisHistory.history.slice(0, 5).map((analysis, index) => (
            <Animatable.View
              key={analysis.result_id}
              animation="fadeInRight"
              delay={index * 50}
            >
              <TouchableOpacity
                style={styles.analysisCard}
                onPress={() => handleViewAnalysis(analysis)}
              >
                <View style={styles.analysisCardHeader}>
                  <Icon
                    name={analysis.type === 'video_analysis' ? 'videocam' : 'photo-camera'}
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.analysisType}>
                    {translate(analysis.type === 'video_analysis' ? 'videoAnalysis' : 'imageAnalysis')}
                  </Text>
                </View>
                
                <View style={styles.analysisStats}>
                  {analysis.summary?.sperm_count !== undefined && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{analysis.summary.sperm_count}</Text>
                      <Text style={styles.statLabel}>{translate('spermCount')}</Text>
                    </View>
                  )}
                  {analysis.summary?.motility_percentage !== undefined && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {analysis.summary.motility_percentage.toFixed(1)}%
                      </Text>
                      <Text style={styles.statLabel}>{translate('motility')}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.analysisDate}>
                  {formatDate(analysis.timestamp)}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderStatsOverview = () => {
    if (!analysisHistory?.history?.length) return null;

    const totalAnalyses = analysisHistory.history.length;
    const videoAnalyses = analysisHistory.history.filter(a => a.type === 'video_analysis').length;
    const imageAnalyses = totalAnalyses - videoAnalyses;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{translate('overview')}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="assessment" size={32} color={COLORS.primary} />
            <Text style={styles.statNumber}>{totalAnalyses}</Text>
            <Text style={styles.statTitle}>{translate('totalAnalyses')}</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="photo-camera" size={32} color={COLORS.secondary} />
            <Text style={styles.statNumber}>{imageAnalyses}</Text>
            <Text style={styles.statTitle}>{translate('imageAnalysis')}</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="videocam" size={32} color={COLORS.accent} />
            <Text style={styles.statNumber}>{videoAnalyses}</Text>
            <Text style={styles.statTitle}>{translate('videoAnalysis')}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={commonStyles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refetch} />
      }
      showsVerticalScrollIndicator={false}
    >
      {renderHeader()}
      {renderQuickActions()}
      {renderStatsOverview()}
      {renderRecentAnalyses()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  welcomeText: {
    fontSize: FONTS.body,
    color: COLORS.white,
    opacity: 0.9,
  },
  appTitle: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  profileButton: {
    marginTop: SPACING.xs,
  },
  appDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.white,
    opacity: 0.8,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.h5,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
  },
  viewAllButton: {
    fontSize: FONTS.bodySmall,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
  quickActionsContainer: {
    gap: SPACING.sm,
  },
  quickActionWrapper: {
    marginBottom: SPACING.sm,
  },
  quickActionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    ...commonStyles.card,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  quickActionTitle: {
    flex: 1,
    fontSize: FONTS.body,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    ...commonStyles.card,
  },
  emptyStateTitle: {
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  startAnalysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  startAnalysisButtonText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: FONTS.weights.semibold,
    marginLeft: SPACING.sm,
  },
  recentAnalysesContainer: {
    paddingRight: SPACING.md,
  },
  analysisCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    width: screenWidth * 0.7,
    ...commonStyles.card,
  },
  analysisCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  analysisType: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.weights.medium,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  analysisStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  analysisDate: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
    ...commonStyles.card,
  },
  statNumber: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  statTitle: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

export default HomeScreen;