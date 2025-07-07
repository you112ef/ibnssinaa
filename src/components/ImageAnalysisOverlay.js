import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import Svg, { Circle, Ellipse, Line, Text as SvgText, G } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImageAnalysisOverlay = ({ imageUri, analysisResult, onClose }) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedSperm, setSelectedSperm] = useState(null);

  if (!analysisResult || !imageUri) return null;

  const { detailedAnalysis } = analysisResult;
  const spermCells = detailedAnalysis?.spermCells || [];

  const imageWidth = screenWidth - 40;
  const imageHeight = (imageWidth * 3) / 4; // نسبة 4:3

  const renderSpermOverlay = () => {
    if (!showOverlay || spermCells.length === 0) return null;

    // تحويل إحداثيات الصورة الأصلية إلى إحداثيات العرض
    const scaleX = imageWidth / 1920; // افتراض عرض الصورة الأصلية 1920
    const scaleY = imageHeight / 1080; // افتراض ارتفاع الصورة الأصلية 1080

    return (
      <Svg style={StyleSheet.absoluteFill} width={imageWidth} height={imageHeight}>
        {spermCells.map((sperm, index) => {
          const x = sperm.position.x * scaleX;
          const y = sperm.position.y * scaleY;
          const radius = (sperm.head?.radius || 2) * Math.min(scaleX, scaleY);
          
          const isSelected = selectedSperm === index;
          const confidence = sperm.confidence || 0.7;
          
          // لون بناءً على الثقة
          let color = '#4CAF50'; // أخضر للثقة العالية
          if (confidence < 0.8) color = '#FF9800'; // برتقالي للثقة المتوسطة
          if (confidence < 0.6) color = '#F44336'; // أحمر للثقة المنخفضة

          return (
            <G key={sperm.id}>
              {/* رأس الحيوان المنوي */}
              <Circle
                cx={x}
                cy={y}
                r={radius}
                stroke={color}
                strokeWidth={isSelected ? 3 : 2}
                fill="none"
                opacity={0.8}
              />
              
              {/* الذيل */}
              {sperm.tails?.map((tail, tailIndex) => (
                <Line
                  key={tailIndex}
                  x1={x + radius}
                  y1={y}
                  x2={x + radius + 20}
                  y2={y + (Math.random() - 0.5) * 10}
                  stroke={color}
                  strokeWidth={1}
                  opacity={0.6}
                />
              ))}
              
              {/* رقم الحيوان المنوي */}
              <SvgText
                x={x}
                y={y - radius - 5}
                fontSize="10"
                fill={color}
                textAnchor="middle"
                fontWeight="bold"
              >
                {index + 1}
              </SvgText>
              
              {/* دائرة اختيار */}
              <Circle
                cx={x}
                cy={y}
                r={radius + 5}
                fill="transparent"
                onPress={() => setSelectedSperm(isSelected ? null : index)}
              />
            </G>
          );
        })}
      </Svg>
    );
  };

  const renderSpermInfo = () => {
    if (selectedSperm === null) return null;
    
    const sperm = spermCells[selectedSperm];
    if (!sperm) return null;

    return (
      <View style={styles.spermInfo}>
        <Text style={styles.spermInfoTitle}>الحيوان المنوي #{selectedSperm + 1}</Text>
        
        <View style={styles.spermInfoContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الموقع:</Text>
            <Text style={styles.infoValue}>
              ({Math.round(sperm.position.x)}, {Math.round(sperm.position.y)})
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>حجم الرأس:</Text>
            <Text style={styles.infoValue}>
              {sperm.head?.radius?.toFixed(1) || 'N/A'} μm
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>عدد الذيول:</Text>
            <Text style={styles.infoValue}>{sperm.tails?.length || 0}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>دقة الكشف:</Text>
            <Text style={[styles.infoValue, { 
              color: sperm.confidence > 0.8 ? '#4CAF50' : 
                     sperm.confidence > 0.6 ? '#FF9800' : '#F44336'
            }]}>
              {Math.round((sperm.confidence || 0.7) * 100)}%
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.closeInfoButton}
          onPress={() => setSelectedSperm(null)}
        >
          <Text style={styles.closeInfoText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLegend = () => (
    <View style={styles.legend}>
      <Text style={styles.legendTitle}>دليل الألوان</Text>
      <View style={styles.legendItems}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>ثقة عالية (80%+)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>ثقة متوسطة (60-80%)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
          <Text style={styles.legendText}>ثقة منخفضة (&lt;60%)</Text>
        </View>
      </View>
    </View>
  );

  const renderControls = () => (
    <View style={styles.controls}>
      <TouchableOpacity 
        style={[styles.controlButton, showOverlay && styles.activeControlButton]}
        onPress={() => setShowOverlay(!showOverlay)}
      >
        <Text style={[styles.controlButtonText, showOverlay && styles.activeControlButtonText]}>
          {showOverlay ? 'إخفاء التحليل' : 'إظهار التحليل'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.controlButton}
        onPress={() => setSelectedSperm(null)}
      >
        <Text style={styles.controlButtonText}>إلغاء التحديد</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsOverlay}>
      <Text style={styles.statsTitle}>إحصائيات الكشف</Text>
      <View style={styles.statsContent}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{spermCells.length}</Text>
          <Text style={styles.statLabel}>حيوان منوي مكتشف</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {spermCells.filter(s => (s.confidence || 0.7) > 0.8).length}
          </Text>
          <Text style={styles.statLabel}>ثقة عالية</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Math.round(spermCells.reduce((sum, s) => sum + (s.confidence || 0.7), 0) / spermCells.length * 100) || 0}%
          </Text>
          <Text style={styles.statLabel}>متوسط الثقة</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>معاينة التحليل</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.image}
            resizeMode="contain"
          />
          {renderSpermOverlay()}
        </View>

        {renderControls()}
        {renderStats()}
        {renderLegend()}
        {renderSpermInfo()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: screenWidth - 40,
    height: (screenWidth - 40) * 3 / 4,
    borderRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeControlButton: {
    backgroundColor: '#2196F3',
  },
  controlButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  activeControlButtonText: {
    color: '#ffffff',
  },
  statsOverlay: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
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
  legend: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  legendItems: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  spermInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  spermInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'right',
  },
  spermInfoContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  closeInfoButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeInfoText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ImageAnalysisOverlay;