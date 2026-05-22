import { useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { useCourseStore } from '../store/useCourseStore';
import { notificationService } from '../services/notificationService';

export default function AppEntry() {
  const { initialize, isLoading, isAuthenticated } = useAuthStore();
  const initializeStore = useCourseStore((state) => state.initializeStore);

  useEffect(() => {
    const start = async () => {
      await initialize();
      await initializeStore();
      await notificationService.scheduleIdleReminder();
      await notificationService.registerForPushNotificationsAsync();
    };
    start();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <View className="items-center space-y-4">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-slate-400 font-medium text-base mt-4 animate-pulse">
            Loading your LMS...
          </Text>
        </View>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
