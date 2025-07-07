import I18n from 'react-native-i18n';
import { I18nManager } from 'react-native';

// Import translation files
const translations = {
  en: {
    // App title and main navigation
    spermAnalyzerAI: 'Sperm Analyzer AI',
    home: 'Home',
    analyze: 'Analyze',
    results: 'Results',
    graph: 'Graph',
    settings: 'Settings',
    
    // Screen titles
    analyzeTitle: 'Sperm Analysis',
    resultsTitle: 'Analysis Results',
    graphTitle: 'Analysis Charts',
    settingsTitle: 'Settings',
    
    // Home screen
    welcome: 'Welcome',
    appDescription: 'Advanced AI-powered sperm analysis for medical professionals',
    quickActions: 'Quick Actions',
    startNewAnalysis: 'Start New Analysis',
    viewRecentResults: 'View Recent Results',
    viewCharts: 'View Charts',
    recentAnalyses: 'Recent Analyses',
    noRecentAnalyses: 'No recent analyses',
    performFirstAnalysis: 'Perform your first analysis to see results here',
    
    // Analysis screen
    uploadFile: 'Upload File',
    selectImageOrVideo: 'Select Image or Video',
    camera: 'Camera',
    gallery: 'Gallery',
    videoLibrary: 'Video Library',
    analyzeNow: 'Analyze Now',
    analyzing: 'Analyzing...',
    uploadProgress: 'Upload Progress',
    analysisProgress: 'Analysis Progress',
    pleaseWait: 'Please wait while we analyze your sample',
    
    // Results screen
    analysisComplete: 'Analysis Complete',
    spermCount: 'Sperm Count',
    spermCountArabic: 'عدد الحيوانات المنوية',
    density: 'Density',
    densityArabic: 'الكثافة',
    motility: 'Motility',
    motilityArabic: 'الحركة',
    morphology: 'Morphology',
    quality: 'Quality',
    viability: 'Viability',
    concentration: 'Concentration',
    
    // Chart screen
    analysisCharts: 'Analysis Charts',
    selectAnalysis: 'Select Analysis',
    analysis: 'Analysis',
    overview: 'Overview',
    temporal: 'Temporal',
    noAnalysisData: 'No Analysis Data',
    performAnalysisFirst: 'Please perform an analysis first to view charts',
    startAnalysis: 'Start Analysis',
    loadingCharts: 'Loading Charts...',
    chartLoadError: 'Failed to load charts',
    
    // Chart types
    qualityDistribution: 'Quality Distribution',
    qualityDistributionArabic: 'توزيع الجودة',
    morphologyAnalysis: 'Morphology Analysis',
    morphologyAnalysisArabic: 'تحليل الشكل',
    viabilityScore: 'Viability Score',
    viabilityScoreArabic: 'نقاط القابلية للحياة',
    spermCountOverTime: 'Sperm Count Over Time',
    spermCountOverTimeArabic: 'عدد الحيوانات المنوية عبر الزمن',
    motilityAnalysis: 'Motility Analysis',
    motilityAnalysisArabic: 'تحليل الحركة',
    movementPatterns: 'Movement Patterns',
    movementPatternsArabic: 'أنماط الحركة',
    
    // Quality levels
    excellent: 'Excellent',
    excellentArabic: 'ممتاز',
    good: 'Good',
    goodArabic: 'جيد',
    fair: 'Fair',
    fairArabic: 'مقبول',
    poor: 'Poor',
    poorArabic: 'ضعيف',
    
    // Morphology types
    normal: 'Normal',
    normalArabic: 'طبيعي',
    acceptable: 'Acceptable',
    acceptableArabic: 'مقبول',
    abnormal: 'Abnormal',
    abnormalArabic: 'غير طبيعي',
    
    // Motility types
    motile: 'Motile',
    motileArabic: 'متحرك',
    nonMotile: 'Non-Motile',
    nonMotileArabic: 'غير متحرك',
    
    // Movement patterns
    linear: 'Linear',
    linearArabic: 'خطي',
    circular: 'Circular',
    circularArabic: 'دائري',
    erratic: 'Erratic',
    erraticArabic: 'عشوائي',
    
    // Time units
    time: 'Time',
    timeArabic: 'الزمن',
    seconds: 'seconds',
    secondsArabic: 'ثانية',
    minutes: 'minutes',
    minutesArabic: 'دقيقة',
    
    // Settings screen
    language: 'Language',
    languageArabic: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    theme: 'Theme',
    notifications: 'Notifications',
    about: 'About',
    version: 'Version',
    contact: 'Contact',
    help: 'Help',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    share: 'Share',
    export: 'Export',
    retry: 'Retry',
    refresh: 'Refresh',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    confirm: 'Confirm',
    
    // Sharing and exporting
    shareChart: 'Share Chart',
    exportChart: 'Export Chart',
    exportFailed: 'Export failed',
    shareResults: 'Share Results',
    generateReport: 'Generate Report',
    downloadReport: 'Download Report',
    
    // Error messages
    error: 'Error',
    networkError: 'Network Error',
    uploadFailed: 'Upload Failed',
    analysisFailed: 'Analysis Failed',
    fileNotSupported: 'File not supported',
    fileTooLarge: 'File too large',
    invalidFile: 'Invalid file',
    connectionTimeout: 'Connection timeout',
    serverError: 'Server error',
    unknownError: 'Unknown error',
    
    // Success messages
    success: 'Success',
    uploadSuccessful: 'Upload successful',
    analysisSuccessful: 'Analysis successful',
    exportSuccessful: 'Export successful',
    
    // Validation messages
    required: 'This field is required',
    invalidEmail: 'Invalid email format',
    passwordTooShort: 'Password too short',
    passwordsDoNotMatch: 'Passwords do not match',
    
    // File handling
    selectFile: 'Select File',
    chooseFromGallery: 'Choose from Gallery',
    takePhoto: 'Take Photo',
    recordVideo: 'Record Video',
    fileSelected: 'File Selected',
    noFileSelected: 'No file selected',
    
    // Analysis details
    analysisDate: 'Analysis Date',
    analysisTime: 'Analysis Time',
    sampleType: 'Sample Type',
    imageAnalysis: 'Image Analysis',
    videoAnalysis: 'Video Analysis',
    processingTime: 'Processing Time',
    modelVersion: 'Model Version',
    confidence: 'Confidence',
    
    // Clinical information
    clinicalInterpretation: 'Clinical Interpretation',
    recommendations: 'Recommendations',
    normalRange: 'Normal Range',
    referenceValues: 'Reference Values',
    whoStandards: 'WHO Standards',
    consultPhysician: 'Consult your physician for detailed interpretation',
    
    // Statistics
    totalAnalyses: 'Total Analyses',
    averageQuality: 'Average Quality',
    trendAnalysis: 'Trend Analysis',
    comparison: 'Comparison',
    historicalData: 'Historical Data',
    
    // Loading states
    loading: 'Loading...',
    processing: 'Processing...',
    uploading: 'Uploading...',
    saving: 'Saving...',
    generating: 'Generating...',
    
    // Empty states
    noResults: 'No Results',
    noData: 'No Data Available',
    noCharts: 'No Charts Available',
    noHistory: 'No History',
    emptyState: 'Nothing to show here',
    
    // Permissions
    cameraPermission: 'Camera Permission',
    storagePermission: 'Storage Permission',
    permissionRequired: 'Permission Required',
    grantPermission: 'Grant Permission',
    permissionDenied: 'Permission Denied',
    
    // Connectivity
    offline: 'Offline',
    online: 'Online',
    reconnecting: 'Reconnecting...',
    noInternet: 'No Internet Connection',
    checkConnection: 'Please check your internet connection',

    // Additional Analysis Terms
    vitality: 'Vitality',
    qualityScore: 'Quality Score',
    totalCount: 'Total Count',
    progressiveMotility: 'Progressive Motility',
    totalMotility: 'Total Motility',
    normalMorphology: 'Normal Morphology',
    millionPerMl: 'million/ml',
    million: 'million',
    analyzedWith: 'Analyzed with',
    fertilityAssessment: 'Fertility Assessment',
    whoCompliance: 'WHO Compliance',
    veryPoor: 'Very Poor',
    details: 'Details',
    charts: 'Charts',
    spermAnalysisResults: 'Sperm Analysis Results',
    excellentDescription: 'Excellent results indicating high fertility',
    goodDescription: 'Good results with normal fertility',
    fairDescription: 'Fair results that may need improvement',
    poorDescription: 'Poor results requiring medical attention',
    veryPoorDescription: 'Very poor results requiring immediate medical consultation',
    advancedAnalysis: 'Advanced Analysis',
    dnaFragmentation: 'DNA Fragmentation',
    oxidativeStress: 'Oxidative Stress',
    capacitation: 'Capacitation',
    acrosomeReaction: 'Acrosome Reaction',
    progressive: 'Progressive',
    nonProgressive: 'Non-progressive',
    immotile: 'Immotile',
    headDefects: 'Head Defects',
    tailDefects: 'Tail Defects',
    neckDefects: 'Neck Defects',
    alive: 'Alive',
    dead: 'Dead',
    volume: 'Volume',
    motilityDistribution: 'Motility Distribution',
    morphologyDistribution: 'Morphology Distribution',
    overallAssessment: 'Overall Assessment',
    
    // Analysis Process Terms
    preparingFile: 'Preparing file...',
    loadingAIModel: 'Loading AI model...',
    processingMedia: 'Processing media...',
    analyzingSperm: 'Analyzing sperm...',
    generatingResults: 'Generating results...',
    redirectingToResults: 'Redirecting to results...',
    offlineMode: 'Offline Mode',
    preparation: 'Preparation',
    imageFile: 'Image file',
    videoFile: 'Video file',
    noFileSelected: 'No file selected',

    // Recommendations
    lowMotilityWarning: 'Low Motility Warning',
    motilityRecommendation: 'Exercise regularly and improve diet',
    abnormalMorphologyWarning: 'Abnormal Morphology Warning',
    morphologyRecommendation: 'Avoid smoking and alcohol, follow healthy diet',
    lowVitalityWarning: 'Low Vitality Warning',
    vitalityRecommendation: 'Reduce stress and take antioxidant supplements',
    normalResultsTitle: 'Normal Results',
    maintainHealthyLifestyle: 'Maintain healthy lifestyle',
    priority: 'Priority',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    fertilityRecommendations: 'Fertility Recommendations',
    maintainCurrentLifestyle: 'Maintain current lifestyle',
    regularCheckups: 'Regular checkups',
    maintainDiet: 'Maintain diet',
    exerciseRegularly: 'Exercise regularly',
    improveDiet: 'Improve diet',
    reduceStress: 'Reduce stress',
    avoidSmoking: 'Avoid smoking',
    consultSpecialist: 'Consult specialist',
    lifestyleChanges: 'Lifestyle changes',
    supplementation: 'Supplementation',
    urgentConsultation: 'Urgent consultation',
    comprehensiveTesting: 'Comprehensive testing',
    treatmentOptions: 'Treatment options',

    // Settings Extended
    customizeApp: 'Customize App',
    languageAndRegion: 'Language & Region',
    changeAppLanguage: 'Change app language',
    textDirection: 'Text Direction',
    currentDirection: 'Current direction',
    rightToLeft: 'Right to Left',
    leftToRight: 'Left to Right',
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    toggleDarkMode: 'Toggle dark mode',
    appTheme: 'App theme',
    darkBlue: 'Dark Blue',
    analysisSettings: 'Analysis Settings',
    enableOfflineAnalysis: 'Enable offline analysis',
    highQualityAnalysis: 'High Quality Analysis',
    moreAccurateResults: 'More accurate results',
    autoSave: 'Auto Save',
    automaticallySaveResults: 'Automatically save results',
    enableNotifications: 'Enable Notifications',
    receiveImportantUpdates: 'Receive important updates',
    reminderNotifications: 'Reminder Notifications',
    remindMeToAnalyze: 'Remind me to analyze',
    dataManagement: 'Data Management',
    analysisHistory: 'Analysis History',
    manageStoredResults: 'Manage stored results',
    clearData: 'Clear Data',
    deleteAllResults: 'Delete all results',
    exportData: 'Export Data',
    exportAllResults: 'Export all results',
    aboutApp: 'About App',
    appVersion: 'App Version',
    currentVersion: 'Current version',
    shareApp: 'Share App',
    tellFriendsAboutApp: 'Tell friends about app',
    rateApp: 'Rate App',
    rateInStore: 'Rate in store',
    contactSupport: 'Contact Support',
    getHelpAndSupport: 'Get help and support',
    privacyAndSecurity: 'Privacy & Security',
    privacyPolicy: 'Privacy Policy',
    readPrivacyPolicy: 'Read privacy policy',
    termsOfService: 'Terms of Service',
    readTermsOfService: 'Read terms of service',
    dataSecurity: 'Data Security',
    yourDataIsSecure: 'Your data is secure',
    clearDataTitle: 'Clear Data',
    clearDataMessage: 'Are you sure you want to delete all data?',
    dataCleared: 'Data cleared',
    shareAppMessage: 'Try Sperm Analyzer AI for accurate and advanced analysis',
    supportSubject: 'Support Request - Sperm Analyzer AI',
    supportBody: 'Hello, I need help with...',
    rateAppMessage: 'Enjoying the app? Please rate it in the store',
    rateNow: 'Rate Now',
    madeWith: 'Made with',
    for: 'for',
    reproductiveHealth: 'Reproductive Health',
    offlineCapable: 'Offline Capable',
    results: 'Results',
  },
  
  ar: {
    // App title and main navigation
    spermAnalyzerAI: 'محلل الحيوانات المنوية بالذكاء الاصطناعي',
    home: 'الرئيسية',
    analyze: 'تحليل',
    results: 'النتائج',
    graph: 'الرسوم البيانية',
    settings: 'الإعدادات',
    
    // Screen titles
    analyzeTitle: 'تحليل الحيوانات المنوية',
    resultsTitle: 'نتائج التحليل',
    graphTitle: 'الرسوم البيانية للتحليل',
    settingsTitle: 'الإعدادات',
    
    // Home screen
    welcome: 'مرحباً',
    appDescription: 'تحليل متقدم للحيوانات المنوية بالذكاء الاصطناعي للمهنيين الطبيين',
    quickActions: 'الإجراءات السريعة',
    startNewAnalysis: 'بدء تحليل جديد',
    viewRecentResults: 'عرض النتائج الحديثة',
    viewCharts: 'عرض الرسوم البيانية',
    recentAnalyses: 'التحاليل الحديثة',
    noRecentAnalyses: 'لا توجد تحاليل حديثة',
    performFirstAnalysis: 'قم بإجراء التحليل الأول لرؤية النتائج هنا',
    
    // Analysis screen
    uploadFile: 'رفع ملف',
    selectImageOrVideo: 'اختر صورة أو فيديو',
    camera: 'الكاميرا',
    gallery: 'المعرض',
    videoLibrary: 'مكتبة الفيديو',
    analyzeNow: 'تحليل الآن',
    analyzing: 'جاري التحليل...',
    uploadProgress: 'تقدم الرفع',
    analysisProgress: 'تقدم التحليل',
    pleaseWait: 'يرجى الانتظار بينما نحلل العينة',
    
    // Results screen
    analysisComplete: 'اكتمل التحليل',
    spermCount: 'عدد الحيوانات المنوية',
    spermCountArabic: 'عدد الحيوانات المنوية',
    density: 'الكثافة',
    densityArabic: 'الكثافة',
    motility: 'الحركة',
    motilityArabic: 'الحركة',
    morphology: 'الشكل',
    quality: 'الجودة',
    viability: 'القابلية للحياة',
    concentration: 'التركيز',
    
    // Chart screen
    analysisCharts: 'رسوم التحليل البيانية',
    selectAnalysis: 'اختر التحليل',
    analysis: 'التحليل',
    overview: 'نظرة عامة',
    temporal: 'زمني',
    noAnalysisData: 'لا توجد بيانات تحليل',
    performAnalysisFirst: 'يرجى إجراء التحليل أولاً لعرض الرسوم البيانية',
    startAnalysis: 'بدء التحليل',
    loadingCharts: 'تحميل الرسوم البيانية...',
    chartLoadError: 'فشل في تحميل الرسوم البيانية',
    
    // Chart types
    qualityDistribution: 'توزيع الجودة',
    qualityDistributionArabic: 'توزيع الجودة',
    morphologyAnalysis: 'تحليل الشكل',
    morphologyAnalysisArabic: 'تحليل الشكل',
    viabilityScore: 'نقاط القابلية للحياة',
    viabilityScoreArabic: 'نقاط القابلية للحياة',
    spermCountOverTime: 'عدد الحيوانات المنوية عبر الزمن',
    spermCountOverTimeArabic: 'عدد الحيوانات المنوية عبر الزمن',
    motilityAnalysis: 'تحليل الحركة',
    motilityAnalysisArabic: 'تحليل الحركة',
    movementPatterns: 'أنماط الحركة',
    movementPatternsArabic: 'أنماط الحركة',
    
    // Quality levels
    excellent: 'ممتاز',
    excellentArabic: 'ممتاز',
    good: 'جيد',
    goodArabic: 'جيد',
    fair: 'مقبول',
    fairArabic: 'مقبول',
    poor: 'ضعيف',
    poorArabic: 'ضعيف',
    
    // Morphology types
    normal: 'طبيعي',
    normalArabic: 'طبيعي',
    acceptable: 'مقبول',
    acceptableArabic: 'مقبول',
    abnormal: 'غير طبيعي',
    abnormalArabic: 'غير طبيعي',
    
    // Motility types
    motile: 'متحرك',
    motileArabic: 'متحرك',
    nonMotile: 'غير متحرك',
    nonMotileArabic: 'غير متحرك',
    
    // Movement patterns
    linear: 'خطي',
    linearArabic: 'خطي',
    circular: 'دائري',
    circularArabic: 'دائري',
    erratic: 'عشوائي',
    erraticArabic: 'عشوائي',
    
    // Time units
    time: 'الزمن',
    timeArabic: 'الزمن',
    seconds: 'ثانية',
    secondsArabic: 'ثانية',
    minutes: 'دقيقة',
    minutesArabic: 'دقيقة',
    
    // Settings screen
    language: 'اللغة',
    languageArabic: 'اللغة',
    english: 'الإنجليزية',
    arabic: 'العربية',
    theme: 'المظهر',
    notifications: 'الإشعارات',
    about: 'حول',
    version: 'الإصدار',
    contact: 'اتصل بنا',
    help: 'المساعدة',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    
    // Actions
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    share: 'مشاركة',
    export: 'تصدير',
    retry: 'إعادة المحاولة',
    refresh: 'تحديث',
    back: 'العودة',
    next: 'التالي',
    done: 'تم',
    confirm: 'تأكيد',
    
    // Sharing and exporting
    shareChart: 'مشاركة الرسم البياني',
    exportChart: 'تصدير الرسم البياني',
    exportFailed: 'فشل التصدير',
    shareResults: 'مشاركة النتائج',
    generateReport: 'إنشاء تقرير',
    downloadReport: 'تحميل التقرير',
    
    // Error messages
    error: 'خطأ',
    networkError: 'خطأ في الشبكة',
    uploadFailed: 'فشل الرفع',
    analysisFailed: 'فشل التحليل',
    fileNotSupported: 'الملف غير مدعوم',
    fileTooLarge: 'الملف كبير جداً',
    invalidFile: 'ملف غير صالح',
    connectionTimeout: 'انتهت مهلة الاتصال',
    serverError: 'خطأ في الخادم',
    unknownError: 'خطأ غير معروف',
    
    // Success messages
    success: 'نجح',
    uploadSuccessful: 'تم الرفع بنجاح',
    analysisSuccessful: 'تم التحليل بنجاح',
    exportSuccessful: 'تم التصدير بنجاح',
    
    // Validation messages
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'تنسيق البريد الإلكتروني غير صالح',
    passwordTooShort: 'كلمة المرور قصيرة جداً',
    passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
    
    // File handling
    selectFile: 'اختر ملف',
    chooseFromGallery: 'اختر من المعرض',
    takePhoto: 'التقط صورة',
    recordVideo: 'سجل فيديو',
    fileSelected: 'تم اختيار الملف',
    noFileSelected: 'لم يتم اختيار ملف',
    
    // Analysis details
    analysisDate: 'تاريخ التحليل',
    analysisTime: 'وقت التحليل',
    sampleType: 'نوع العينة',
    imageAnalysis: 'تحليل الصورة',
    videoAnalysis: 'تحليل الفيديو',
    processingTime: 'وقت المعالجة',
    modelVersion: 'إصدار النموذج',
    confidence: 'الثقة',
    
    // Clinical information
    clinicalInterpretation: 'التفسير السريري',
    recommendations: 'التوصيات',
    normalRange: 'المعدل الطبيعي',
    referenceValues: 'القيم المرجعية',
    whoStandards: 'معايير منظمة الصحة العالمية',
    consultPhysician: 'استشر طبيبك للحصول على تفسير مفصل',
    
    // Statistics
    totalAnalyses: 'إجمالي التحاليل',
    averageQuality: 'متوسط الجودة',
    trendAnalysis: 'تحليل الاتجاه',
    comparison: 'المقارنة',
    historicalData: 'البيانات التاريخية',
    
    // Loading states
    loading: 'جاري التحميل...',
    processing: 'جاري المعالجة...',
    uploading: 'جاري الرفع...',
    saving: 'جاري الحفظ...',
    generating: 'جاري الإنشاء...',
    
    // Empty states
    noResults: 'لا توجد نتائج',
    noData: 'لا توجد بيانات متاحة',
    noCharts: 'لا توجد رسوم بيانية متاحة',
    noHistory: 'لا يوجد تاريخ',
    emptyState: 'لا يوجد شيء للعرض هنا',
    
    // Permissions
    cameraPermission: 'إذن الكاميرا',
    storagePermission: 'إذن التخزين',
    permissionRequired: 'إذن مطلوب',
    grantPermission: 'منح الإذن',
    permissionDenied: 'تم رفض الإذن',
    
    // Connectivity
    offline: 'غير متصل',
    online: 'متصل',
    reconnecting: 'إعادة الاتصال...',
    noInternet: 'لا يوجد اتصال بالإنترنت',
    checkConnection: 'يرجى التحقق من اتصال الإنترنت',

    // Additional Analysis Terms
    vitality: 'الحيوية',
    qualityScore: 'درجة الجودة',
    totalCount: 'العدد الإجمالي',
    progressiveMotility: 'الحركة التقدمية',
    totalMotility: 'الحركة الإجمالية',
    normalMorphology: 'الشكل الطبيعي',
    millionPerMl: 'مليون/مل',
    million: 'مليون',
    analyzedWith: 'تم التحليل باستخدام',
    fertilityAssessment: 'تقييم الخصوبة',
    whoCompliance: 'مطابقة معايير WHO',
    veryPoor: 'ضعيف جداً',
    details: 'التفاصيل',
    charts: 'الرسوم البيانية',
    spermAnalysisResults: 'نتائج تحليل الحيوانات المنوية',
    excellentDescription: 'نتائج ممتازة تشير إلى خصوبة عالية',
    goodDescription: 'نتائج جيدة مع خصوبة طبيعية',
    fairDescription: 'نتائج مقبولة قد تحتاج إلى تحسين',
    poorDescription: 'نتائج تحتاج إلى انتباه طبي',
    veryPoorDescription: 'نتائج تتطلب استشارة طبية فورية',
    advancedAnalysis: 'التحليل المتقدم',
    dnaFragmentation: 'تجزؤ الحمض النووي',
    oxidativeStress: 'الإجهاد التأكسدي',
    capacitation: 'قدرة التخصيب',
    acrosomeReaction: 'تفاعل الأكروسوم',
    progressive: 'تقدمية',
    nonProgressive: 'غير تقدمية',
    immotile: 'ثابتة',
    headDefects: 'عيوب الرأس',
    tailDefects: 'عيوب الذيل',
    neckDefects: 'عيوب الرقبة',
    alive: 'حية',
    dead: 'ميتة',
    volume: 'الحجم',
    motilityDistribution: 'توزيع الحركة',
    morphologyDistribution: 'توزيع الشكل',
    overallAssessment: 'التقييم الإجمالي',
    
    // Analysis Process Terms
    preparingFile: 'تحضير الملف...',
    loadingAIModel: 'تحميل نموذج الذكاء الاصطناعي...',
    processingMedia: 'معالجة الوسائط...',
    analyzingSperm: 'تحليل الحيوانات المنوية...',
    generatingResults: 'إنتاج النتائج...',
    redirectingToResults: 'توجيه إلى النتائج...',
    offlineMode: 'وضع بدون اتصال',
    preparation: 'التحضير',
    imageFile: 'ملف صورة',
    videoFile: 'ملف فيديو',
    noFileSelected: 'لم يتم اختيار ملف',

    // Recommendations
    lowMotilityWarning: 'تحذير من انخفاض الحركة',
    motilityRecommendation: 'يُنصح بممارسة الرياضة وتحسين النظام الغذائي',
    abnormalMorphologyWarning: 'تحذير من شكل غير طبيعي',
    morphologyRecommendation: 'تجنب التدخين والكحول واتبع نظاماً غذائياً صحياً',
    lowVitalityWarning: 'تحذير من انخفاض الحيوية',
    vitalityRecommendation: 'قلل من التوتر وتناول مكملات مضادة للأكسدة',
    normalResultsTitle: 'نتائج طبيعية',
    maintainHealthyLifestyle: 'حافظ على نمط حياة صحي',
    priority: 'الأولوية',
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
    fertilityRecommendations: 'توصيات الخصوبة',
    maintainCurrentLifestyle: 'حافظ على نمط الحياة الحالي',
    regularCheckups: 'فحوصات دورية',
    maintainDiet: 'حافظ على النظام الغذائي',
    exerciseRegularly: 'مارس الرياضة بانتظام',
    improveDiet: 'حسن النظام الغذائي',
    reduceStress: 'قلل التوتر',
    avoidSmoking: 'تجنب التدخين',
    consultSpecialist: 'استشر أخصائي',
    lifestyleChanges: 'تغييرات نمط الحياة',
    supplementation: 'المكملات الغذائية',
    urgentConsultation: 'استشارة عاجلة',
    comprehensiveTesting: 'فحوصات شاملة',
    treatmentOptions: 'خيارات العلاج',

    // Settings Extended
    customizeApp: 'تخصيص التطبيق',
    languageAndRegion: 'اللغة والمنطقة',
    changeAppLanguage: 'تغيير لغة التطبيق',
    textDirection: 'اتجاه النص',
    currentDirection: 'الاتجاه الحالي',
    rightToLeft: 'من اليمين إلى اليسار',
    leftToRight: 'من اليسار إلى اليمين',
    appearance: 'المظهر',
    darkMode: 'الوضع المظلم',
    toggleDarkMode: 'تبديل الوضع المظلم',
    appTheme: 'سمة التطبيق',
    darkBlue: 'أزرق غامق',
    analysisSettings: 'إعدادات التحليل',
    enableOfflineAnalysis: 'تمكين التحليل بدون اتصال',
    highQualityAnalysis: 'تحليل عالي الجودة',
    moreAccurateResults: 'نتائج أكثر دقة',
    autoSave: 'الحفظ التلقائي',
    automaticallySaveResults: 'حفظ النتائج تلقائياً',
    enableNotifications: 'تمكين الإشعارات',
    receiveImportantUpdates: 'تلقي التحديثات المهمة',
    reminderNotifications: 'إشعارات التذكير',
    remindMeToAnalyze: 'ذكرني بإجراء التحليل',
    dataManagement: 'إدارة البيانات',
    analysisHistory: 'سجل التحليل',
    manageStoredResults: 'إدارة النتائج المحفوظة',
    clearData: 'مسح البيانات',
    deleteAllResults: 'حذف جميع النتائج',
    exportData: 'تصدير البيانات',
    exportAllResults: 'تصدير جميع النتائج',
    aboutApp: 'حول التطبيق',
    appVersion: 'إصدار التطبيق',
    currentVersion: 'الإصدار الحالي',
    shareApp: 'مشاركة التطبيق',
    tellFriendsAboutApp: 'أخبر أصدقاءك عن التطبيق',
    rateApp: 'تقييم التطبيق',
    rateInStore: 'تقييم في المتجر',
    contactSupport: 'التواصل مع الدعم',
    getHelpAndSupport: 'احصل على المساعدة والدعم',
    privacyAndSecurity: 'الخصوصية والأمان',
    privacyPolicy: 'سياسة الخصوصية',
    readPrivacyPolicy: 'اقرأ سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    readTermsOfService: 'اقرأ شروط الخدمة',
    dataSecurity: 'أمان البيانات',
    yourDataIsSecure: 'بياناتك آمنة',
    clearDataTitle: 'مسح البيانات',
    clearDataMessage: 'هل أنت متأكد من رغبتك في حذف جميع البيانات؟',
    dataCleared: 'تم مسح البيانات',
    shareAppMessage: 'جرب تطبيق محلل الحيوانات المنوية AI للحصول على تحليل دقيق ومتقدم',
    supportSubject: 'طلب دعم - محلل الحيوانات المنوية AI',
    supportBody: 'مرحباً، أحتاج مساعدة في...',
    rateAppMessage: 'هل تستمتع بالتطبيق؟ يرجى تقييمه في المتجر',
    rateNow: 'قيم الآن',
    madeWith: 'صُنع بـ',
    for: 'لأجل',
    reproductiveHealth: 'الصحة الإنجابية',
    offlineCapable: 'يعمل بدون اتصال',
    results: 'النتائج',
  },
};

// Configure I18n
I18n.fallbacks = true;
I18n.translations = translations;

// Set default locale
const getCurrentLocale = () => {
  return I18n.currentLocale().split('-')[0]; // Get language code without region
};

// Set initial locale
const currentLocale = getCurrentLocale();
I18n.locale = ['en', 'ar'].includes(currentLocale) ? currentLocale : 'en';

// Language management functions
export const setLanguage = (languageCode) => {
  I18n.locale = languageCode;
  
  // Configure RTL layout for Arabic
  const isRTL = languageCode === 'ar';
  I18nManager.forceRTL(isRTL);
  
  // Save preference to storage (you can implement AsyncStorage here)
  // AsyncStorage.setItem('selectedLanguage', languageCode);
};

export const getCurrentLanguage = () => {
  return I18n.locale;
};

export const isRTL = () => {
  return I18n.locale === 'ar';
};

export const getAvailableLanguages = () => {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ];
};

// Translation function with fallback
export const translate = (key, options = {}) => {
  try {
    const translation = I18n.t(key, options);
    
    // If translation is the same as key, it means translation is missing
    if (translation === key) {
      console.warn(`Translation missing for key: ${key}`);
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
    
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return key;
  }
};

// Shorthand for translate function
export const t = translate;

// Format numbers for RTL languages
export const formatNumber = (number) => {
  if (isRTL()) {
    // Use Arabic-Indic digits for Arabic
    return number.toString().replace(/[0-9]/g, (digit) => {
      const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
      return arabicDigits[parseInt(digit)];
    });
  }
  return number.toString();
};

// Format dates for different locales
export const formatDate = (date, format = 'short') => {
  const locale = isRTL() ? 'ar' : 'en';
  
  if (format === 'short') {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  } else if (format === 'long') {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }
  
  return new Intl.DateTimeFormat(locale).format(new Date(date));
};

// Format time for different locales
export const formatTime = (time) => {
  const locale = isRTL() ? 'ar' : 'en';
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(time));
};

// Pluralization helper
export const pluralize = (count, singular, plural) => {
  const countText = formatNumber(count);
  
  if (isRTL()) {
    // Arabic pluralization rules (simplified)
    if (count === 0) return `لا ${plural}`;
    if (count === 1) return `${singular} واحد`;
    if (count === 2) return `${singular}ان`;
    if (count >= 3 && count <= 10) return `${countText} ${plural}`;
    return `${countText} ${singular}`;
  } else {
    // English pluralization
    if (count === 1) return `${countText} ${singular}`;
    return `${countText} ${plural || singular + 's'}`;
  }
};

// Get localized chart labels
export const getChartLabels = () => {
  return {
    quality: {
      excellent: translate('excellent'),
      good: translate('good'),
      fair: translate('fair'),
      poor: translate('poor'),
    },
    morphology: {
      normal: translate('normal'),
      acceptable: translate('acceptable'),
      abnormal: translate('abnormal'),
    },
    motility: {
      motile: translate('motile'),
      nonMotile: translate('nonMotile'),
    },
    movement: {
      linear: translate('linear'),
      circular: translate('circular'),
      erratic: translate('erratic'),
    },
    time: {
      seconds: translate('seconds'),
      minutes: translate('minutes'),
      time: translate('time'),
    },
  };
};

// Initialize language from stored preference
export const initializeLanguage = async () => {
  try {
    // const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
    // if (storedLanguage && ['en', 'ar'].includes(storedLanguage)) {
    //   setLanguage(storedLanguage);
    // }
  } catch (error) {
    console.error('Failed to initialize language:', error);
  }
};

export default {
  translate,
  t,
  setLanguage,
  getCurrentLanguage,
  isRTL,
  getAvailableLanguages,
  formatNumber,
  formatDate,
  formatTime,
  pluralize,
  getChartLabels,
  initializeLanguage,
};