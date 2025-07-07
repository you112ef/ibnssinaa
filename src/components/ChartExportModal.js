import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, commonStyles } from '../styles/theme';
import { translate } from '../utils/i18n';

const ChartExportModal = ({ 
  visible, 
  onClose, 
  onExport, 
  resultId 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions = [
    {
      id: 'quality_distribution',
      title: translate('qualityDistribution'),
      description: 'Pie chart showing sperm quality distribution',
      icon: 'pie-chart',
      color: COLORS.chart.primary,
    },
    {
      id: 'morphology',
      title: translate('morphologyAnalysis'),
      description: 'Bar chart of morphology categories',
      icon: 'bar-chart',
      color: COLORS.chart.secondary,
    },
    {
      id: 'time_series',
      title: translate('spermCountOverTime'),
      description: 'Line chart of sperm count over time',
      icon: 'timeline',
      color: COLORS.chart.tertiary,
    },
    {
      id: 'motility',
      title: translate('motilityAnalysis'),
      description: 'Motility statistics visualization',
      icon: 'trending-up',
      color: COLORS.chart.quaternary,
    },
    {
      id: 'movement_patterns',
      title: translate('movementPatterns'),
      description: 'Movement pattern distribution',
      icon: 'bubble-chart',
      color: COLORS.primary,
    },
  ];

  const handleExport = async (chartType) => {
    if (!resultId) {
      Alert.alert(translate('error'), 'No analysis selected');
      return;
    }

    setIsExporting(true);
    try {
      await onExport(chartType);
      onClose();
    } catch (error) {
      Alert.alert(translate('error'), translate('exportFailed'));
    } finally {
      setIsExporting(false);
    }
  };

  const exportAllCharts = async () => {
    setIsExporting(true);
    try {
      for (const option of exportOptions) {
        await onExport(option.id);
      }
      Alert.alert(translate('success'), 'All charts exported successfully');
      onClose();
    } catch (error) {
      Alert.alert(translate('error'), 'Failed to export some charts');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modalContent}>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{translate('exportChart')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Export Options */}
        <ScrollView 
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {exportOptions.map((option, index) => (
            <Animatable.View
              key={option.id}
              animation="fadeInUp"
              delay={index * 100}
              style={styles.optionWrapper}
            >
              <TouchableOpacity
                style={styles.exportOption}
                onPress={() => handleExport(option.id)}
                disabled={isExporting}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                  <Icon name={option.icon} size={24} color={COLORS.white} />
                </View>
                
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>

                <Icon 
                  name="file-download" 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>
            </Animatable.View>
          ))}

          {/* Export All Button */}
          <Animatable.View
            animation="fadeInUp"
            delay={exportOptions.length * 100}
            style={styles.exportAllWrapper}
          >
            <TouchableOpacity
              style={styles.exportAllButton}
              onPress={exportAllCharts}
              disabled={isExporting}
              activeOpacity={0.7}
            >
              <Icon name="download" size={24} color={COLORS.white} />
              <Text style={styles.exportAllText}>
                {isExporting ? translate('generating') : 'Export All Charts'}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>

        {/* Modal Footer */}
        <View style={styles.modalFooter}>
          <Text style={styles.footerText}>
            Charts will be saved to your device's downloads folder
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    position: 'absolute',
    top: -SPACING.md,
    left: '50%',
    marginLeft: -20,
  },
  modalTitle: {
    fontSize: FONTS.h5,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: SPACING.xs,
  },
  optionsContainer: {
    padding: SPACING.lg,
  },
  optionWrapper: {
    marginBottom: SPACING.md,
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONTS.body,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  optionDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  exportAllWrapper: {
    marginTop: SPACING.md,
  },
  exportAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  exportAllText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: FONTS.weights.semibold,
    marginLeft: SPACING.sm,
  },
  modalFooter: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default ChartExportModal;