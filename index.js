/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { logger } from './src/shared/utils/logger';

// Guard in case native Firebase module is missing (e.g., app hasn't been natively rebuilt yet)
try {
  if (messaging && typeof messaging === 'function') {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      logger.info('Message handled in the background!', remoteMessage);
    });
  }
} catch (error) {
  console.warn("Firebase messaging not initialized natively yet.");
}

AppRegistry.registerComponent(appName, () => App);

