import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import * as Animatable from 'react-native-animatable';
import { useQuery } from 'react-query';

import { COLORS, FONTS, SPACING, BORDER_RADIUS, commonStyles, chartTheme } from '../styles/theme';
import { translate } from '../utils/i18n';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ChartExportModal from '../components/ChartExportModal';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - (SPACING.md * 2);

const GraphScreen = () => {
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { lastAnalysisResult } = useAppContext();

  // Fetch chart data
  const {
    data: chartData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['chartData', selectedResultId],
    () => apiService.getChartData(selectedResultId),
    {
      enabled: !!selectedResultId,
      refetchOnMount: true,
    }
  );

  // Fetch analysis history for result selection
  const {
    data: analysisHistory,
    isLoading: historyLoading,
  } = useQuery('analysisHistory', apiService.getAnalysisHistory);

  useEffect(() => {
    // Auto-select the last analysis result if available
    if (lastAnalysisResult?.result_id) {
      setSelectedResultId(lastAnalysisResult.result_id);
    } else if (analysisHistory?.history?.length > 0) {
      setSelectedResultId(analysisHistory.history[0].result_id);
    }
  }, [lastAnalysisResult, analysisHistory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleExportChart = async (chartType) => {
    try {
      const response = await apiService.exportChart(selectedResultId, chartType);
      if (response.success) {
        const shareOptions = {
          title: translate('shareChart'),
          url: response.chartUrl,
          type: 'image/png',
        };
        await Share.open(shareOptions);
      }
    } catch (error) {
      Alert.alert(translate('error'), translate('exportFailed'));
    }
  };

  const renderResultSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>{translate('selectAnalysis')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {analysisHistory?.history?.map((item, index) => (
          <TouchableOpacity
            key={item.result_id}
            style={[
              styles.resultItem,
              selectedResultId === item.result_id && styles.selectedResultItem,
            ]}
            onPress={() => setSelectedResultId(item.result_id)}
          >
            <Text style={[
              styles.resultText,
              selectedResultId === item.result_id && styles.selectedResultText,
            ]}>
              {translate('analysis')} {index + 1}
            </Text>
            <Text style={styles.resultDate}>
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderChartTypeSelector = () => (
    <View style={styles.chartTypeContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {chartTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.chartTypeButton,
              selectedChartType === type.id && styles.selectedChartType,
            ]}
            onPress={() => setSelectedChartType(type.id)}
          >
            <Icon
              name={type.icon}
              size={20}
              color={selectedChartType === type.id ? COLORS.white : COLORS.primary}
            />
            <Text style={[
              styles.chartTypeText,
              selectedChartType === type.id && styles.selectedChartTypeText,
            ]}>
              {translate(type.label)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderOverviewCharts = () => {
    if (!chartData) return null;

    const analysisType = chartData.analysis_type;
    
    return (
      <ScrollView style={styles.chartsContainer}>
        {analysisType === 'image_analysis' && renderImageAnalysisCharts()}
        {analysisType === 'video_analysis' && renderVideoAnalysisCharts()}
      </ScrollView>
    );
  };

  const renderImageAnalysisCharts = () => (
    <View>
      {/* Quality Distribution Pie Chart */}
      <Animatable.View animation="fadeInUp" delay={100} style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>{translate('qualityDistribution')}</Text>
          <TouchableOpacity onPress={() => handleExportChart('quality_distribution')}>
            <Icon name="share" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        {renderQualityPieChart()}
      </Animatable.View>

      {/* Morphology Bar Chart */}
      <Animatable.View animation="fadeInUp" delay={200} style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>{translate('morphologyAnalysis')}</Text>
          <TouchableOpacity onPress={() => handleExportChart('morphology')}>
            <Icon name="share" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        {renderMorphologyBarChart()}
      </Animatable.View>

      {/* Viability Progress Chart */}
      <Animatable.View animation="fadeInUp" delay={300} style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>{translate('viabilityScore')}</Text>
        </View>
        {renderViabilityProgressChart()}
      </Animatable.View>
    </View>
  );

  const renderVideoAnalysisCharts = () => (
    <View>
      {/* Sperm Count Over Time Line Chart */}
      <Animatable.View animation="fadeInUp" delay={100} style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>{translate('spermCountOverTime')}</Text>
          <TouchableOpacity onPress={() => handleExportChart('time_series')}>
            <Icon name="share" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        {renderTimeSeriesChart()}
      </Animatable.View>

      {/* Motility Analysis Bar Chart */}
      <Animatable.View animation="fadeInUp" delay={200} style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>{translate('motilityAnalysis')}</Text>
          <TouchableOpacity onPress={() => handleExportChart('motility')}>
            <Icon name="share" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        {renderMotilityBarChart()}
      </Animatable.View>

      {/* Movement Patterns Pie Chart */}
      <Animatable.View animation="fadeInUp" delay={300} style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>{translate('movementPatterns')}</Text>
          <TouchableOpacity onPress={() => handleExportChart('movement_patterns')}>
            <Icon name="share" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        {renderMovementPatternsChart()}
      </Animatable.View>
    </View>
  );

  const renderQualityPieChart = () => {
    const data = [
      {
        name: translate('excellent'),
        population: 15,
        color: COLORS.quality.excellent,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
      },
      {
        name: translate('good'),
        population: 30,
        color: COLORS.quality.good,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
      },
      {
        name: translate('fair'),
        population: 35,
        color: COLORS.quality.fair,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
      },
      {
        name: translate('poor'),
        population: 20,
        color: COLORS.quality.poor,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
      },
    ];

    return (
      <PieChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={{
          ...chartTheme,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  };

  const renderMorphologyBarChart = () => {
    const data = {
      labels: [translate('normal'), translate('acceptable'), translate('abnormal')],
      datasets: [
        {
          data: [45, 35, 20],
          colors: [
            () => COLORS.quality.excellent,
            () => COLORS.quality.good,
            () => COLORS.quality.poor,
          ],
        },
      ],
    };

    return (
      <BarChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={chartTheme}
        verticalLabelRotation={0}
        withCustomBarColorFromData={true}
        flatColor={true}
        showBarTops={false}
      />
    );
  };

  const renderViabilityProgressChart = () => {
    const data = {
      labels: [translate('viability')],
      data: [0.75], // 75% viability
    };

    return (
      <ProgressChart
        data={data}
        width={chartWidth}
        height={220}
        strokeWidth={16}
        radius={60}
        chartConfig={{
          ...chartTheme,
          color: (opacity = 1) => COLORS.primary,
        }}
        hideLegend={false}
      />
    );
  };

  const renderTimeSeriesChart = () => {
    const data = {
      labels: ['0s', '10s', '20s', '30s', '40s', '50s'],
      datasets: [
        {
          data: [12, 15, 14, 18, 16, 17],
          color: (opacity = 1) => COLORS.primary,
          strokeWidth: 3,
        },
      ],
    };

    return (
      <LineChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={chartTheme}
        bezier
        style={styles.chart}
        fromZero={true}
        yAxisLabel=""
        yAxisSuffix=""
        segments={4}
      />
    );
  };

  const renderMotilityBarChart = () => {
    const data = {
      labels: [translate('motile'), translate('nonMotile')],
      datasets: [
        {
          data: [65, 35],
          colors: [
            () => COLORS.motility.normal,
            () => COLORS.motility.veryLow,
          ],
        },
      ],
    };

    return (
      <BarChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={chartTheme}
        verticalLabelRotation={0}
        withCustomBarColorFromData={true}
        flatColor={true}
        showBarTops={false}
      />
    );
  };

  const renderMovementPatternsChart = () => {
    const data = [
      {
        name: translate('linear'),
        population: 40,
        color: COLORS.chart.primary,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
      },
      {
        name: translate('circular'),
        population: 35,
        color: COLORS.chart.secondary,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
      },
      {
        name: translate('erratic'),
        population: 25,
        color: COLORS.chart.tertiary,
        legendFontColor: COLORS.text,
        legendFontSize: 12,
      },
    ];

    return (
      <PieChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={{
          ...chartTheme,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="insert-chart" size={80} color={COLORS.textLight} />
      <Text style={styles.emptyStateTitle}>{translate('noAnalysisData')}</Text>
      <Text style={styles.emptyStateSubtitle}>{translate('performAnalysisFirst')}</Text>
      <TouchableOpacity style={styles.analyzeButton}>
        <Text style={styles.analyzeButtonText}>{translate('startAnalysis')}</Text>
      </TouchableOpacity>
    </View>
  );

  if (historyLoading) {
    return <LoadingSpinner message={translate('loadingCharts')} />;
  }

  if (!analysisHistory?.history?.length) {
    return renderEmptyState();
  }

  return (
    <View style={commonStyles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{translate('analysisCharts')}</Text>
          <TouchableOpacity onPress={() => setShowExportModal(true)}>
            <Icon name="more-vert" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderResultSelector()}
        {renderChartTypeSelector()}
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>{translate('loadingCharts')}</Text>
          </View>
        ) : error ? (
          <ErrorMessage
            message={translate('chartLoadError')}
            onRetry={refetch}
          />
        ) : (
          renderOverviewCharts()
        )}
      </ScrollView>

      <ChartExportModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportChart}
        resultId={selectedResultId}
      />
    </View>
  );
};

const chartTypes = [
  { id: 'overview', label: 'overview', icon: 'dashboard' },
  { id: 'quality', label: 'quality', icon: 'star' },
  { id: 'motility', label: 'motility', icon: 'trending-up' },
  { id: 'morphology', label: 'morphology', icon: 'bubble-chart' },
  { id: 'temporal', label: 'temporal', icon: 'timeline' },
];

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  selectorContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  selectorTitle: {
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  resultItem: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
    minWidth: 100,
  },
  selectedResultItem: {
    backgroundColor: COLORS.primary,
  },
  resultText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedResultText: {
    color: COLORS.white,
  },
  resultDate: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  chartTypeContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chartTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
  },
  selectedChartType: {
    backgroundColor: COLORS.primary,
  },
  chartTypeText: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.weights.medium,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  selectedChartTypeText: {
    color: COLORS.white,
  },
  chartsContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...commonStyles.card,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  chartTitle: {
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
  },
  chart: {
    borderRadius: BORDER_RADIUS.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  emptyStateSubtitle: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  analyzeButton: {
    ...commonStyles.button,
    paddingHorizontal: SPACING.xl,
  },
  analyzeButtonText: {
    ...commonStyles.buttonText,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
});

export default GraphScreen;