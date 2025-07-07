import React, { useEffect } from 'react';
import {
  StatusBar,
  I18nManager,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { QueryClient, QueryClientProvider } from 'react-query';
import Toast from 'react-native-toast-message';
import Orientation from 'react-native-orientation-locker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import AnalyzeScreen from './src/screens/AnalyzeScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import GraphScreen from './src/screens/GraphScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import utilities
import { AppProvider } from './src/context/AppContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { translate } from './src/utils/i18n';
import { COLORS } from './src/styles/theme';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Analyze':
              iconName = 'analytics';
              break;
            case 'Results':
              iconName = 'assessment';
              break;
            case 'Graph':
              iconName = 'insert-chart';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          elevation: 10,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -5,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: translate('home'),
          headerTitle: translate('spermAnalyzerAI'),
        }}
      />
      <Tab.Screen
        name="Analyze"
        component={AnalyzeScreen}
        options={{
          title: translate('analyze'),
          headerTitle: translate('analyzeTitle'),
        }}
      />
      <Tab.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          title: translate('results'),
          headerTitle: translate('resultsTitle'),
        }}
      />
      <Tab.Screen
        name="Graph"
        component={GraphScreen}
        options={{
          title: translate('graph'),
          headerTitle: translate('graphTitle'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: translate('settings'),
          headerTitle: translate('settingsTitle'),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    // Configure orientation
    Orientation.lockToPortrait();

    // Configure RTL support
    if (Platform.OS === 'android') {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(false); // Will be set based on language selection
    }

    // Configure status bar
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(COLORS.primary, true);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <AppProvider>
              <NavigationContainer>
                <StatusBar
                  barStyle="light-content"
                  backgroundColor={COLORS.primary}
                  translucent={false}
                />
                <TabNavigator />
                <Toast />
              </NavigationContainer>
            </AppProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;