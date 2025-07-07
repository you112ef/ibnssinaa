/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Initialize TensorFlow.js for React Native
import '@tensorflow/tfjs-react-native';

AppRegistry.registerComponent(appName, () => App);