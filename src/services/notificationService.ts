import { Platform } from 'react-native';
import Constants from 'expo-constants';

let Notifications: any = null;

// Dynamically require expo-notifications only if we are NOT running inside the Expo Go client,
// preventing the SDK 53+ push notification warning crash on startup in Expo Go.
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

    // Configure notification channel for Android
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
      trigger: null, // show immediately
    });
  },

  scheduleIdleReminder: async () => {
    if (!Notifications) return;

    // Request permissions first
    const hasPermission = await notificationService.requestPermissions();
    if (!hasPermission) return;

    // Cancel existing reminder
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule new daily reminder for 24 hours in the future
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 We Miss You!',
        body: 'It has been 24 hours since you last opened your LMS. Check out new courses today!',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 24 * 60 * 60, // 24 hours
        repeats: true,
      },
    });
  },
};
