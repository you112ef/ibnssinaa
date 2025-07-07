import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

const DetailedAnalysisView = ({ analysisResult, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!analysisResult) return null;

  const { spermAnalysis, detailedAnalysis } = analysisResult;

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>نظرة عامة على التحليل</Text>
      
      {/* إحصائيات سريعة */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{spermAnalysis.count.total}</Text>
          <Text style={styles.statLabel}>العدد الإجمالي (مليون)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{spermAnalysis.count.concentration}</Text>
          <Text style={styles.statLabel}>التركيز (مليون/مل)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{spermAnalysis.motility.progressive}%</Text>
          <Text style={styles.statLabel}>الحركة التقدمية</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{spermAnalysis.morphology.normal}%</Text>
          <Text style={styles.statLabel}>الشكل الطبيعي</Text>
        </View>
      </View>

      {/* مطابقة معايير WHO */}
      <View style={styles.whoSection}>
        <Text style={styles.sectionTitle}>مطابقة معايير منظمة الصحة العالمية</Text>
        {Object.entries(spermAnalysis.whoCompliance).map(([key, value]) => (
          <View key={key} style={styles.whoItem}>
            <Text style={styles.whoLabel}>{getWHOLabel(key)}</Text>
            <View style={[styles.whoStatus, { backgroundColor: value ? '#4CAF50' : '#F44336' }]}>
              <Text style={styles.whoStatusText}>{value ? '✓' : '✗'}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderMotilityAnalysis = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>تحليل الحركة المفصل</Text>
      
      {/* رسم بياني للحركة */}
      <PieChart
        data={[
          { name: 'تقدمية', population: spermAnalysis.motility.progressive, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'غير تقدمية', population: spermAnalysis.motility.nonProgressive, color: '#FF9800', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'ثابتة', population: spermAnalysis.motility.immotile, color: '#F44336', legendFontColor: '#333', legendFontSize: 12 }
        ]}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      {/* تفاصيل الحركة */}
      {detailedAnalysis?.motilityDetails && (
        <View style={styles.detailsList}>
          <Text style={styles.subsectionTitle}>تفاصيل الحيوانات المنوية المكتشفة</Text>
          {detailedAnalysis.motilityDetails.slice(0, 10).map((detail, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.detailText}>الحيوان المنوي #{index + 1}</Text>
              <Text style={styles.detailValue}>النوع: {getMotilityTypeArabic(detail.type)}</Text>
              <Text style={styles.detailValue}>السرعة: {detail.velocity?.toFixed(1) || 'N/A'} μm/s</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderMorphologyAnalysis = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>تحليل الشكل المفصل</Text>
      
      {/* رسم بياني للشكل */}
      <BarChart
        data={{
          labels: ['طبيعي', 'عيوب الرأس', 'عيوب العنق', 'عيوب الذيل'],
          datasets: [{
            data: [
              spermAnalysis.morphology.normal,
              spermAnalysis.morphology.headDefects,
              spermAnalysis.morphology.neckDefects,
              spermAnalysis.morphology.tailDefects
            ]
          }]
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
      />

      {/* تفاصيل الشكل */}
      {detailedAnalysis?.morphologyDetails && (
        <View style={styles.detailsList}>
          <Text style={styles.subsectionTitle}>تحليل تفصيلي للأشكال</Text>
          {detailedAnalysis.morphologyDetails.slice(0, 10).map((detail, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.detailText}>الحيوان المنوي #{index + 1}</Text>
              <Text style={[styles.detailValue, { color: detail.overall === 'normal' ? '#4CAF50' : '#F44336' }]}>
                الحالة: {detail.overall === 'normal' ? 'طبيعي' : 'غير طبيعي'}
              </Text>
              {detail.headShape?.defects?.length > 0 && (
                <Text style={styles.defectText}>عيوب الرأس: {detail.headShape.defects.join(', ')}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderSpermCells = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>الحيوانات المنوية المكتشفة</Text>
      
      <View style={styles.spermGrid}>
        {detailedAnalysis?.spermCells?.slice(0, 20).map((sperm, index) => (
          <View key={sperm.id} style={styles.spermCard}>
            <View style={styles.spermHeader}>
              <Text style={styles.spermId}>#{index + 1}</Text>
              <Text style={[styles.confidenceScore, { 
                color: sperm.confidence > 0.8 ? '#4CAF50' : sperm.confidence > 0.6 ? '#FF9800' : '#F44336' 
              }]}>
                {Math.round(sperm.confidence * 100)}%
              </Text>
            </View>
            
            <View style={styles.spermDetails}>
              <Text style={styles.spermDetailText}>الموقع: ({Math.round(sperm.position.x)}, {Math.round(sperm.position.y)})</Text>
              <Text style={styles.spermDetailText}>الرأس: {sperm.head?.radius?.toFixed(1) || 'N/A'} μm</Text>
              <Text style={styles.spermDetailText}>الذيول: {sperm.tails?.length || 0}</Text>
            </View>
            
            <View style={styles.spermVisualization}>
              <View style={[styles.spermHead, { 
                width: Math.max(8, Math.min(20, (sperm.head?.radius || 2) * 4)),
                height: Math.max(8, Math.min(20, (sperm.head?.radius || 2) * 4))
              }]} />
              {sperm.tails?.map((tail, tailIndex) => (
                <View key={tailIndex} style={styles.spermTail} />
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const getWHOLabel = (key) => {
    const labels = {
      concentration: 'التركيز',
      totalCount: 'العدد الإجمالي',
      progressiveMotility: 'الحركة التقدمية',
      totalMotility: 'إجمالي الحركة',
      normalMorphology: 'الشكل الطبيعي',
      vitality: 'الحيوية'
    };
    return labels[key] || key;
  };

  const getMotilityTypeArabic = (type) => {
    const types = {
      progressive: 'تقدمية',
      'non-progressive': 'غير تقدمية',
      immotile: 'ثابتة'
    };
    return types[type] || type;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>التحليل التفصيلي</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* التبويبات */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>نظرة عامة</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'motility' && styles.activeTab]}
          onPress={() => setActiveTab('motility')}
        >
          <Text style={[styles.tabText, activeTab === 'motility' && styles.activeTabText]}>الحركة</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'morphology' && styles.activeTab]}
          onPress={() => setActiveTab('morphology')}
        >
          <Text style={[styles.tabText, activeTab === 'morphology' && styles.activeTabText]}>الشكل</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cells' && styles.activeTab]}
          onPress={() => setActiveTab('cells')}
        >
          <Text style={[styles.tabText, activeTab === 'cells' && styles.activeTabText]}>الخلايا</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'motility' && renderMotilityAnalysis()}
        {activeTab === 'morphology' && renderMorphologyAnalysis()}
        {activeTab === 'cells' && renderSpermCells()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'right',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  whoSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  whoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  whoLabel: {
    fontSize: 14,
    color: '#333',
  },
  whoStatus: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whoStatusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  detailsList: {
    marginTop: 20,
  },
  detailItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  defectText: {
    fontSize: 12,
    color: '#F44336',
    fontStyle: 'italic',
  },
  spermGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  spermCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  spermHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spermId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  confidenceScore: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  spermDetails: {
    marginBottom: 8,
  },
  spermDetailText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  spermVisualization: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  spermHead: {
    backgroundColor: '#2196F3',
    borderRadius: 50,
  },
  spermTail: {
    width: 15,
    height: 2,
    backgroundColor: '#666',
    marginLeft: 2,
  },
});

export default DetailedAnalysisView;