import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Circle, Bar } from 'react-native-progress';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

import { COLORS, FONTS, SPACING, BORDER_RADIUS, commonStyles } from '../styles/theme';
import { translate } from '../utils/i18n';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const { width: screenWidth } = Dimensions.get('window');

const ResultsScreen = () => {
  const { latestAnalysisResult, analysisHistory, isAnalyzing } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('motility');

  if (isAnalyzing) {
    return <LoadingSpinner message={translate('analyzingData')} />;
  }

  if (!latestAnalysisResult) {
    return (
      <View style={[commonStyles.container, commonStyles.center]}>
        <Icon name="analytics" size={64} color={COLORS.textSecondary} />
        <Text style={styles.noDataText}>{translate('noAnalysisData')}</Text>
        <Text style={styles.noDataSubtext}>{translate('performAnalysisFirst')}</Text>
      </View>
    );
  }

  const { spermAnalysis, qualityScore, recommendations, fertilityAssessment, advancedAnalysis } = latestAnalysisResult;

  const shareResults = async () => {
    try {
      const shareText = generateShareText();
      await Share.share({
        message: shareText,
        title: translate('spermAnalysisResults'),
      });
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };

  const generateShareText = () => {
    const { motility, morphology, vitality, count } = spermAnalysis;
    
    return `${translate('spermAnalysisResults')}

${translate('concentration')}: ${count.concentration} ${translate('millionPerMl')}
${translate('totalCount')}: ${count.total} ${translate('million')}
${translate('progressiveMotility')}: ${motility.progressive}%
${translate('totalMotility')}: ${motility.total}%
${translate('normalMorphology')}: ${morphology.normal}%
${translate('vitality')}: ${vitality.alive}%
${translate('qualityScore')}: ${qualityScore}/100

${translate('analyzedWith')} ${translate('appName')}`;
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {[
        { key: 'overview', icon: 'dashboard', label: 'overview' },
        { key: 'details', icon: 'analytics', label: 'details' },
        { key: 'charts', icon: 'bar-chart', label: 'charts' },
        { key: 'recommendations', icon: 'lightbulb', label: 'recommendations' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab,
          ]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Icon
            name={tab.icon}
            size={20}
            color={activeTab === tab.key ? COLORS.white : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {translate(tab.label)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverview = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Quality Score */}
      <Animatable.View animation="fadeInUp" delay={100} style={styles.scoreCard}>
        <LinearGradient
          colors={getScoreGradient(qualityScore)}
          style={styles.scoreGradient}
        >
          <Text style={styles.scoreTitle}>{translate('qualityScore')}</Text>
          <View style={styles.scoreCircle}>
            <Circle
              size={120}
              progress={qualityScore / 100}
              thickness={8}
              color={COLORS.white}
              unfilledColor="rgba(255,255,255,0.3)"
              borderWidth={0}
              showsText={true}
              textStyle={styles.scoreText}
              formatText={() => `${qualityScore}`}
            />
          </View>
          <Text style={styles.scoreLabel}>{getQualityLabel(qualityScore)}</Text>
        </LinearGradient>
      </Animatable.View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        {[
          {
            key: 'concentration',
            value: spermAnalysis.count.concentration,
            unit: translate('millionPerMl'),
            icon: 'scatter-plot',
            color: COLORS.primary,
            normal: spermAnalysis.whoCompliance.concentration
          },
          {
            key: 'motility',
            value: spermAnalysis.motility.progressive,
            unit: '%',
            icon: 'trending-up',
            color: COLORS.secondary,
            normal: spermAnalysis.whoCompliance.progressiveMotility
          },
          {
            key: 'morphology',
            value: spermAnalysis.morphology.normal,
            unit: '%',
            icon: 'category',
            color: COLORS.accent,
            normal: spermAnalysis.whoCompliance.normalMorphology
          },
          {
            key: 'vitality',
            value: spermAnalysis.vitality.alive,
            unit: '%',
            icon: 'favorite',
            color: COLORS.error,
            normal: spermAnalysis.whoCompliance.vitality
          },
        ].map((metric, index) => (
          <Animatable.View
            key={metric.key}
            animation="fadeInUp"
            delay={200 + index * 100}
            style={styles.metricCard}
          >
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: metric.color }]}>
                <Icon name={metric.icon} size={24} color={COLORS.white} />
              </View>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: metric.normal ? COLORS.success : COLORS.error }
              ]}>
                <Icon 
                  name={metric.normal ? 'check' : 'close'} 
                  size={12} 
                  color={COLORS.white} 
                />
              </View>
            </View>
            <Text style={styles.metricValue}>
              {metric.value}{metric.unit}
            </Text>
            <Text style={styles.metricLabel}>{translate(metric.key)}</Text>
          </Animatable.View>
        ))}
      </View>

      {/* Fertility Assessment */}
      {fertilityAssessment && (
        <Animatable.View animation="fadeInUp" delay={600} style={styles.fertilityCard}>
          <Text style={styles.sectionTitle}>{translate('fertilityAssessment')}</Text>
          <View style={styles.fertilityContent}>
            <View style={styles.fertilityScore}>
              <Circle
                size={80}
                progress={fertilityAssessment.score / 100}
                thickness={6}
                color={getFertilityColor(fertilityAssessment.category)}
                unfilledColor={COLORS.border}
                borderWidth={0}
                showsText={true}
                textStyle={styles.fertilityScoreText}
                formatText={() => `${fertilityAssessment.score}`}
              />
            </View>
            <View style={styles.fertilityInfo}>
              <Text style={styles.fertilityCategory}>
                {translate(fertilityAssessment.category)}
              </Text>
              <Text style={styles.fertilityDescription}>
                {translate(`${fertilityAssessment.category}Description`)}
              </Text>
            </View>
          </View>
        </Animatable.View>
      )}

      {/* WHO Compliance */}
      <Animatable.View animation="fadeInUp" delay={700} style={styles.complianceCard}>
        <Text style={styles.sectionTitle}>{translate('whoCompliance')}</Text>
        <View style={styles.complianceList}>
          {Object.entries(spermAnalysis.whoCompliance).map(([key, value], index) => (
            <View key={key} style={styles.complianceItem}>
              <Icon
                name={value ? 'check-circle' : 'cancel'}
                size={20}
                color={value ? COLORS.success : COLORS.error}
              />
              <Text style={styles.complianceText}>{translate(key)}</Text>
              <Text style={[
                styles.complianceStatus,
                { color: value ? COLORS.success : COLORS.error }
              ]}>
                {translate(value ? 'normal' : 'abnormal')}
              </Text>
            </View>
          ))}
        </View>
      </Animatable.View>
    </ScrollView>
  );

  const renderDetails = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Detailed Analysis */}
      <View style={styles.detailsContainer}>
        {/* Count Analysis */}
        <Animatable.View animation="fadeInUp" delay={100} style={styles.detailCard}>
          <Text style={styles.detailTitle}>{translate('spermCount')}</Text>
          <View style={styles.detailContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{translate('totalCount')}</Text>
              <Text style={styles.detailValue}>
                {spermAnalysis.count.total} {translate('million')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{translate('concentration')}</Text>
              <Text style={styles.detailValue}>
                {spermAnalysis.count.concentration} {translate('millionPerMl')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{translate('volume')}</Text>
              <Text style={styles.detailValue}>
                {spermAnalysis.count.volume} ml
              </Text>
            </View>
          </View>
        </Animatable.View>

        {/* Motility Analysis */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.detailCard}>
          <Text style={styles.detailTitle}>{translate('motilityAnalysis')}</Text>
          <View style={styles.detailContent}>
            <View style={styles.motilityBar}>
              <Text style={styles.detailLabel}>{translate('progressive')}</Text>
              <View style={styles.progressContainer}>
                <Bar
                  progress={spermAnalysis.motility.progressive / 100}
                  width={200}
                  height={8}
                  color={COLORS.primary}
                  unfilledColor={COLORS.border}
                  borderWidth={0}
                />
                <Text style={styles.progressText}>
                  {spermAnalysis.motility.progressive}%
                </Text>
              </View>
            </View>
            <View style={styles.motilityBar}>
              <Text style={styles.detailLabel}>{translate('nonProgressive')}</Text>
              <View style={styles.progressContainer}>
                <Bar
                  progress={spermAnalysis.motility.nonProgressive / 100}
                  width={200}
                  height={8}
                  color={COLORS.secondary}
                  unfilledColor={COLORS.border}
                  borderWidth={0}
                />
                <Text style={styles.progressText}>
                  {spermAnalysis.motility.nonProgressive}%
                </Text>
              </View>
            </View>
            <View style={styles.motilityBar}>
              <Text style={styles.detailLabel}>{translate('immotile')}</Text>
              <View style={styles.progressContainer}>
                <Bar
                  progress={spermAnalysis.motility.immotile / 100}
                  width={200}
                  height={8}
                  color={COLORS.error}
                  unfilledColor={COLORS.border}
                  borderWidth={0}
                />
                <Text style={styles.progressText}>
                  {spermAnalysis.motility.immotile}%
                </Text>
              </View>
            </View>
          </View>
        </Animatable.View>

        {/* Morphology Analysis */}
        <Animatable.View animation="fadeInUp" delay={300} style={styles.detailCard}>
          <Text style={styles.detailTitle}>{translate('morphologyAnalysis')}</Text>
          <View style={styles.detailContent}>
            {Object.entries(spermAnalysis.morphology).map(([key, value]) => (
              <View key={key} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{translate(key)}</Text>
                <Text style={styles.detailValue}>{value}%</Text>
              </View>
            ))}
          </View>
        </Animatable.View>

        {/* Advanced Analysis */}
        {advancedAnalysis && (
          <Animatable.View animation="fadeInUp" delay={400} style={styles.detailCard}>
            <Text style={styles.detailTitle}>{translate('advancedAnalysis')}</Text>
            <View style={styles.detailContent}>
              {Object.entries(advancedAnalysis).map(([key, value]) => (
                <View key={key} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{translate(key)}</Text>
                  <Text style={styles.detailValue}>{value}%</Text>
                </View>
              ))}
            </View>
          </Animatable.View>
        )}
      </View>
    </ScrollView>
  );

  const renderCharts = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Chart Type Selector */}
      <View style={styles.chartSelector}>
        {[
          { key: 'motility', label: 'motility', icon: 'trending-up' },
          { key: 'morphology', label: 'morphology', icon: 'category' },
          { key: 'overview', label: 'overview', icon: 'pie-chart' },
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.chartOption,
              selectedMetric === option.key && styles.activeChartOption,
            ]}
            onPress={() => setSelectedMetric(option.key)}
          >
            <Icon
              name={option.icon}
              size={20}
              color={selectedMetric === option.key ? COLORS.white : COLORS.text}
            />
            <Text
              style={[
                styles.chartOptionText,
                selectedMetric === option.key && styles.activeChartOptionText,
              ]}
            >
              {translate(option.label)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Charts */}
      <View style={styles.chartsContainer}>
        {selectedMetric === 'motility' && renderMotilityChart()}
        {selectedMetric === 'morphology' && renderMorphologyChart()}
        {selectedMetric === 'overview' && renderOverviewChart()}
      </View>
    </ScrollView>
  );

  const renderMotilityChart = () => {
    const data = {
      labels: [translate('progressive'), translate('nonProgressive'), translate('immotile')],
      datasets: [{
        data: [
          spermAnalysis.motility.progressive,
          spermAnalysis.motility.nonProgressive,
          spermAnalysis.motility.immotile
        ]
      }]
    };

    return (
      <Animatable.View animation="fadeIn" style={styles.chartCard}>
        <Text style={styles.chartTitle}>{translate('motilityDistribution')}</Text>
        <BarChart
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: COLORS.surface,
            backgroundGradientFrom: COLORS.surface,
            backgroundGradientTo: COLORS.surface,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(66, 139, 202, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
      </Animatable.View>
    );
  };

  const renderMorphologyChart = () => {
    const data = [
      {
        name: translate('normal'),
        population: spermAnalysis.morphology.normal,
        color: COLORS.success,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
      },
      {
        name: translate('headDefects'),
        population: spermAnalysis.morphology.headDefects,
        color: COLORS.error,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
      },
      {
        name: translate('tailDefects'),
        population: spermAnalysis.morphology.tailDefects,
        color: COLORS.warning,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
      },
      {
        name: translate('neckDefects'),
        population: spermAnalysis.morphology.neckDefects,
        color: COLORS.info,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
      },
    ];

    return (
      <Animatable.View animation="fadeIn" style={styles.chartCard}>
        <Text style={styles.chartTitle}>{translate('morphologyDistribution')}</Text>
        <PieChart
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute
        />
      </Animatable.View>
    );
  };

  const renderOverviewChart = () => {
    const data = [
      { name: translate('qualityScore'), value: qualityScore, color: COLORS.primary },
      { name: translate('motility'), value: spermAnalysis.motility.total, color: COLORS.secondary },
      { name: translate('morphology'), value: spermAnalysis.morphology.normal * 10, color: COLORS.accent },
      { name: translate('vitality'), value: spermAnalysis.vitality.alive, color: COLORS.success },
    ];

    return (
      <Animatable.View animation="fadeIn" style={styles.chartCard}>
        <Text style={styles.chartTitle}>{translate('overallAssessment')}</Text>
        <PieChart
          data={data.map(item => ({
            name: item.name,
            population: item.value,
            color: item.color,
            legendFontColor: COLORS.text,
            legendFontSize: 12,
          }))}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute
        />
      </Animatable.View>
    );
  };

  const renderRecommendations = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.recommendationsContainer}>
        {recommendations.map((recommendation, index) => (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            delay={100 + index * 100}
            style={[
              styles.recommendationCard,
              { borderLeftColor: getPriorityColor(recommendation.priority) }
            ]}
          >
            <View style={styles.recommendationHeader}>
              <View style={[
                styles.priorityIndicator,
                { backgroundColor: getPriorityColor(recommendation.priority) }
              ]}>
                <Icon name="priority-high" size={16} color={COLORS.white} />
              </View>
              <Text style={styles.recommendationTitle}>
                {translate(recommendation.titleKey)}
              </Text>
            </View>
            <Text style={styles.recommendationDescription}>
              {translate(recommendation.descriptionKey)}
            </Text>
            <Text style={styles.recommendationPriority}>
              {translate('priority')}: {translate(recommendation.priority)}
            </Text>
          </Animatable.View>
        ))}

        {fertilityAssessment?.recommendations && (
          <Animatable.View animation="fadeInUp" delay={500} style={styles.fertilityRecommendationsCard}>
            <Text style={styles.sectionTitle}>{translate('fertilityRecommendations')}</Text>
            {fertilityAssessment.recommendations.map((rec, index) => (
              <View key={index} style={styles.fertilityRecommendationItem}>
                <Icon name="lightbulb" size={16} color={COLORS.accent} />
                <Text style={styles.fertilityRecommendationText}>
                  {translate(rec)}
                </Text>
              </View>
            ))}
          </Animatable.View>
        )}
      </View>
    </ScrollView>
  );

  const getScoreGradient = (score) => {
    if (score >= 80) return [COLORS.success, '#27AE60'];
    if (score >= 60) return [COLORS.warning, '#F39C12'];
    if (score >= 40) return [COLORS.accent, '#E67E22'];
    return [COLORS.error, '#E74C3C'];
  };

  const getQualityLabel = (score) => {
    if (score >= 80) return translate('excellent');
    if (score >= 60) return translate('good');
    if (score >= 40) return translate('fair');
    if (score >= 20) return translate('poor');
    return translate('veryPoor');
  };

  const getFertilityColor = (category) => {
    const colors = {
      excellent: COLORS.success,
      good: COLORS.info,
      fair: COLORS.warning,
      poor: COLORS.accent,
      veryPoor: COLORS.error
    };
    return colors[category] || COLORS.textSecondary;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: COLORS.error,
      medium: COLORS.warning,
      low: COLORS.info
    };
    return colors[priority] || COLORS.textSecondary;
  };

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translate('analysisResults')}</Text>
        <TouchableOpacity onPress={shareResults} style={styles.shareButton}>
          <Icon name="share" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      {renderTabs()}

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'details' && renderDetails()}
      {activeTab === 'charts' && renderCharts()}
      {activeTab === 'recommendations' && renderRecommendations()}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  shareButton: {
    padding: SPACING.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    marginHorizontal: SPACING.xs,
    marginVertical: SPACING.xs,
  },
  tabText: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontWeight: FONTS.weights.medium,
  },
  activeTabText: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  noDataText: {
    fontSize: FONTS.h5,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  scoreCard: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...commonStyles.card,
  },
  scoreGradient: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: FONTS.h5,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.white,
    marginBottom: SPACING.lg,
  },
  scoreCircle: {
    marginBottom: SPACING.md,
  },
  scoreText: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  scoreLabel: {
    fontSize: FONTS.body,
    fontWeight: FONTS.weights.medium,
    color: COLORS.white,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...commonStyles.card,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  metricLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },
  fertilityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...commonStyles.card,
  },
  sectionTitle: {
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  fertilityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fertilityScore: {
    marginRight: SPACING.lg,
  },
  fertilityScoreText: {
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  fertilityInfo: {
    flex: 1,
  },
  fertilityCategory: {
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  fertilityDescription: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  complianceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...commonStyles.card,
  },
  complianceList: {
    gap: SPACING.sm,
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  complianceText: {
    flex: 1,
    fontSize: FONTS.body,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  complianceStatus: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.weights.medium,
  },
  detailsContainer: {
    gap: SPACING.md,
  },
  detailCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...commonStyles.card,
  },
  detailTitle: {
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  detailContent: {
    gap: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  detailLabel: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: FONTS.body,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
  },
  motilityBar: {
    marginBottom: SPACING.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  progressText: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  chartSelector: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
  },
  chartOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  activeChartOption: {
    backgroundColor: COLORS.primary,
  },
  chartOptionText: {
    fontSize: FONTS.caption,
    color: COLORS.text,
    marginLeft: SPACING.xs,
    fontWeight: FONTS.weights.medium,
  },
  activeChartOptionText: {
    color: COLORS.white,
  },
  chartsContainer: {
    gap: SPACING.lg,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...commonStyles.card,
  },
  chartTitle: {
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  chart: {
    borderRadius: BORDER_RADIUS.sm,
  },
  recommendationsContainer: {
    gap: SPACING.md,
  },
  recommendationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    ...commonStyles.card,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  priorityIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  recommendationTitle: {
    flex: 1,
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
  },
  recommendationDescription: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  recommendationPriority: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },
  fertilityRecommendationsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...commonStyles.card,
  },
  fertilityRecommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  fertilityRecommendationText: {
    flex: 1,
    fontSize: FONTS.body,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
});

export default ResultsScreen;