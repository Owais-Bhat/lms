import { Platform } from 'react-native';
import Constants from 'expo-constants';

let Notifications: any = null;

if (Platform.OS !== 'web' && Constants.appOwnership !== 'expo') {
  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      } as any),
    });
  } catch (err) {
    console.warn('Failed to dynamically import expo-notifications', err);
  }
}

export const notificationService = {
  requestPermissions: async (): Promise<boolean> => {
    if (!Notifications) {
      console.log('Notifications are disabled in Expo Go. Use a development build for native notification features.');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3b82f6',
      });
    }

    return true;
  },

  showBookmarkMilestone: async (count: number) => {
    if (!Notifications) return;

    const hasPermission = await notificationService.requestPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌟 Learning Milestone!',
        body: `You have bookmarked ${count} courses. Start learning today!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, 
    });
  },

  scheduleIdleReminder: async () => {
    if (!Notifications) return;

    
    const hasPermission = await notificationService.requestPermissions();
    if (!hasPermission) return;

    
    await Notifications.cancelAllScheduledNotificationsAsync();

    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 We Miss You!',
        body: 'It has been 24 hours since you last opened your LMS. Check out new courses today!',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 24 * 60 * 60, 
        repeats: true,
      },
    });
  },

  registerForPushNotificationsAsync: async (): Promise<string | null> => {
    if (!Notifications) {
      console.log('Notifications are disabled in Expo Go. Use a development build (eas build / prebuild) for remote push notifications.');
      return null;
    }

    try {
      const hasPermission = await notificationService.requestPermissions();
      if (!hasPermission) {
        console.log('Failed to get push token: Permission not granted');
        return null;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) {
        console.warn(
          'Project ID not found in app.json. Please run "npx eas project:init" to link your project on Expo Dev.'
        );
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      
      console.log('====================================');
      console.log('🚀 EXPO PUSH TOKEN:', tokenData.data);
      console.log('====================================');
      return tokenData.data;
    } catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;
    }
  },
};

