import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Circle } from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';

import { COLORS, FONTS, SPACING, BORDER_RADIUS, commonStyles } from '../styles/theme';
import { translate } from '../utils/i18n';
import { useAppContext } from '../context/AppContext';
import { OfflineAIService } from '../services/offlineAIService';
import LoadingSpinner from '../components/LoadingSpinner';

const AnalyzeScreen = () => {
  const navigation = useNavigation();
  const {
    addUploadedFile,
    clearUploadedFiles,
    setAnalyzingStatus,
    setAnalysisProgress,
    completeAnalysis,
    failAnalysis,
    uploadProgress,
    analysisProgress,
    isAnalyzing,
  } = useAppContext();

  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisStage, setAnalysisStage] = useState('idle'); // idle, processing, complete
  const [currentStage, setCurrentStage] = useState('');

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
        const storageGranted = granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === 'granted';

        if (!cameraGranted || !storageGranted) {
          Alert.alert(
            translate('permissionRequired'),
            translate('grantPermission'),
            [{ text: translate('confirm') }]
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const selectFromGallery = () => {
    const options = {
      mediaType: 'mixed',
      quality: 0.8,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const file = response.assets[0];
        setSelectedFile({
          uri: file.uri,
          type: file.type,
          name: file.fileName || 'selected_file',
          size: file.fileSize,
        });
      }
    });
  };

  const takePhoto = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const file = response.assets[0];
        setSelectedFile({
          uri: file.uri,
          type: file.type,
          name: file.fileName || 'camera_photo.jpg',
          size: file.fileSize,
        });
      }
    });
  };

  const recordVideo = () => {
    const options = {
      mediaType: 'video',
      quality: 'medium',
      durationLimit: 30, // 30 seconds max
    };

    launchCamera(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const file = response.assets[0];
        setSelectedFile({
          uri: file.uri,
          type: file.type,
          name: file.fileName || 'recorded_video.mp4',
          size: file.fileSize,
        });
      }
    });
  };

  const selectDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.video],
      });

      if (result && result[0]) {
        setSelectedFile({
          uri: result[0].uri,
          type: result[0].type,
          name: result[0].name,
          size: result[0].size,
        });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled
      } else {
        Alert.alert(translate('error'), translate('fileNotSupported'));
      }
    }
  };

  const analyzeFile = async () => {
    if (!selectedFile) {
      Alert.alert(translate('error'), translate('noFileSelected'));
      return;
    }

    // Check file size (max 50MB for offline processing)
    const maxSize = 50 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      Alert.alert(translate('error'), translate('fileTooLarge'));
      return;
    }

    setAnalyzingStatus(true);
    setAnalysisStage('processing');
    setAnalysisProgress(0);

    try {
      // Stage 1: File preparation
      setCurrentStage(translate('preparingFile'));
      setAnalysisProgress(10);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Stage 2: AI Model Loading
      setCurrentStage(translate('loadingAIModel'));
      setAnalysisProgress(20);
      await OfflineAIService.initializeModel();
      
      // Stage 3: Image/Video Processing
      setCurrentStage(translate('processingMedia'));
      setAnalysisProgress(40);
      
      let analysisResult;
      if (selectedFile.type.startsWith('image/')) {
        analysisResult = await OfflineAIService.analyzeImage(selectedFile.uri);
      } else if (selectedFile.type.startsWith('video/')) {
        analysisResult = await OfflineAIService.analyzeVideo(selectedFile.uri);
      } else {
        throw new Error('Unsupported file type');
      }

      // Stage 4: AI Analysis
      setCurrentStage(translate('analyzingSperm'));
      setAnalysisProgress(70);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Stage 5: Generating Results
      setCurrentStage(translate('generatingResults'));
      setAnalysisProgress(90);
      
      // Process and enhance results
      const enhancedResult = await OfflineAIService.enhanceResults(analysisResult);
      
      setAnalysisProgress(100);
      setCurrentStage(translate('analysisComplete'));

      // Complete analysis and navigate to results
      completeAnalysis(enhancedResult);
      setAnalysisStage('complete');
      
      setTimeout(() => {
        navigation.navigate('Results');
      }, 1000);

    } catch (error) {
      console.error('Analysis failed:', error);
      failAnalysis(error.message);
      setAnalysisStage('idle');
      Alert.alert(translate('error'), translate('analysisFailed'));
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setAnalysisStage('idle');
    setAnalysisProgress(0);
    setAnalyzingStatus(false);
    clearUploadedFiles();
  };

  const renderFileSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.sectionTitle}>{translate('selectImageOrVideo')}</Text>
      
      <View style={styles.optionsGrid}>
        <TouchableOpacity style={styles.optionCard} onPress={takePhoto}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.optionGradient}
          >
            <Icon name="photo-camera" size={32} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.optionText}>{translate('camera')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={selectFromGallery}>
          <LinearGradient
            colors={[COLORS.secondary, '#16A085']}
            style={styles.optionGradient}
          >
            <Icon name="photo-library" size={32} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.optionText}>{translate('gallery')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={recordVideo}>
          <LinearGradient
            colors={[COLORS.accent, '#E67E22']}
            style={styles.optionGradient}
          >
            <Icon name="videocam" size={32} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.optionText}>{translate('recordVideo')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={selectDocument}>
          <LinearGradient
            colors={[COLORS.error, '#C0392B']}
            style={styles.optionGradient}
          >
            <Icon name="folder-open" size={32} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.optionText}>{translate('selectFile')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSelectedFile = () => {
    if (!selectedFile) return null;

    return (
      <Animatable.View animation="fadeInUp" style={styles.selectedFileContainer}>
        <Text style={styles.sectionTitle}>{translate('fileSelected')}</Text>
        
        <View style={styles.filePreview}>
          {selectedFile.type.startsWith('image/') && (
            <Image source={{ uri: selectedFile.uri }} style={styles.previewImage} />
          )}
          
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>{selectedFile.name}</Text>
            <Text style={styles.fileSize}>
              {selectedFile.type.startsWith('image/') ? translate('imageFile') : translate('videoFile')} • 
              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
            </Text>
          </View>

          <TouchableOpacity onPress={resetAnalysis} style={styles.removeButton}>
            <Icon name="close" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        {!isAnalyzing && (
          <TouchableOpacity style={styles.analyzeButton} onPress={analyzeFile}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.analyzeButtonGradient}
            >
              <Icon name="analytics" size={24} color={COLORS.white} />
              <Text style={styles.analyzeButtonText}>{translate('analyzeNow')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </Animatable.View>
    );
  };

  const renderAnalysisProgress = () => {
    if (!isAnalyzing) return null;

    return (
      <Animatable.View animation="fadeIn" style={styles.progressContainer}>
        <Text style={styles.progressTitle}>{translate('analyzing')}</Text>
        
        <View style={styles.progressCircle}>
          <Circle
            size={120}
            progress={analysisProgress / 100}
            thickness={8}
            color={COLORS.primary}
            unfilledColor={COLORS.border}
            borderWidth={0}
            showsText={true}
            textStyle={styles.progressText}
            formatText={() => `${Math.round(analysisProgress)}%`}
          />
        </View>

        <Text style={styles.currentStage}>{currentStage}</Text>
        
        <View style={styles.stageIndicators}>
          {[
            { key: 'prep', label: translate('preparation') },
            { key: 'load', label: translate('loading') },
            { key: 'process', label: translate('processing') },
            { key: 'analyze', label: translate('analyzing') },
            { key: 'results', label: translate('results') },
          ].map((stage, index) => (
            <View key={stage.key} style={styles.stageIndicator}>
              <View style={[
                styles.stageCircle,
                analysisProgress > (index * 20) && styles.stageCircleActive
              ]}>
                <Text style={[
                  styles.stageNumber,
                  analysisProgress > (index * 20) && styles.stageNumberActive
                ]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={styles.stageLabel}>{stage.label}</Text>
            </View>
          ))}
        </View>
      </Animatable.View>
    );
  };

  const renderOfflineIndicator = () => (
    <View style={styles.offlineIndicator}>
      <Icon name="offline-bolt" size={16} color={COLORS.success} />
      <Text style={styles.offlineText}>{translate('offlineMode')}</Text>
    </View>
  );

  return (
    <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
      {renderOfflineIndicator()}
      
      {!selectedFile && !isAnalyzing && renderFileSelector()}
      {selectedFile && !isAnalyzing && renderSelectedFile()}
      {isAnalyzing && renderAnalysisProgress()}
      
      {analysisStage === 'complete' && (
        <Animatable.View animation="bounceIn" style={styles.completionContainer}>
          <Icon name="check-circle" size={64} color={COLORS.success} />
          <Text style={styles.completionText}>{translate('analysisComplete')}</Text>
          <Text style={styles.completionSubtext}>{translate('redirectingToResults')}</Text>
        </Animatable.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  offlineText: {
    color: COLORS.white,
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.weights.medium,
    marginLeft: SPACING.xs,
  },
  selectorContainer: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.h5,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  optionGradient: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...commonStyles.card,
  },
  optionText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: FONTS.weights.medium,
  },
  selectedFileContainer: {
    padding: SPACING.md,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...commonStyles.card,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.md,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: FONTS.body,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  fileSize: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  analyzeButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  analyzeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  analyzeButtonText: {
    color: COLORS.white,
    fontSize: FONTS.body,
    fontWeight: FONTS.weights.semibold,
    marginLeft: SPACING.sm,
  },
  progressContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  progressCircle: {
    marginBottom: SPACING.lg,
  },
  progressText: {
    fontSize: FONTS.h6,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  currentStage: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  stageIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SPACING.sm,
  },
  stageIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stageCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  stageCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stageNumber: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textSecondary,
  },
  stageNumberActive: {
    color: COLORS.white,
  },
  stageLabel: {
    fontSize: FONTS.tiny,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  completionContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  completionText: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.weights.bold,
    color: COLORS.success,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  completionSubtext: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default AnalyzeScreen;