import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useCourseStore } from '../../store/useCourseStore';
import { useAuthStore } from '../../store/useAuthStore';
import { getCourseHtmlTemplate } from '../../utils/courseTemplate';
import { ArrowLeft, RefreshCw, Send, AlertTriangle, CheckCircle2 } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';

export default function CourseWebViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { courses } = useCourseStore();
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const webViewRef = useRef<WebView>(null);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(4);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const course = courses.find((c) => c.id === id);

  
  useEffect(() => {
    SecureStore.getItemAsync('auth_access_token').then((token) => {
      setAccessToken(token);
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: course ? course.title : 'Course Viewer',
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color={isDark ? '#f8fafc' : '#0f172a'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, course, isDark]);

  if (!course) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-red-500 font-bold text-lg">Course Not Found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  
  const handleWebViewMessage = (event: any) => {
    try {
      const messageData = JSON.parse(event.nativeEvent.data);
      
      if (messageData.type === 'lesson_update') {
        setCompletedLessons(messageData.completed);
        setTotalLessons(messageData.total);
      } else if (messageData.type === 'course_completed') {
        Alert.alert(
          '🎓 Course Completed!',
          `Congratulations! You have completed all lessons for "${course.title}". Your certificate of completion has been registered.`,
          [{ text: 'Hooray!' }]
        );
      }
    } catch (err) {
      console.warn('Received unparseable message from WebView:', event.nativeEvent.data);
    }
  };

  
  const injectTip = () => {
    const tips = [
      '💡 Study Tip: Keep notes as you study the fundamentals.',
      '💡 Quick Hint: Make sure to check each lesson checkbox as you complete them!',
      '💡 Pro Tip: Research the topic in real-time to reinforce learning.',
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    webViewRef.current?.injectJavaScript(`onNativeMessage("${randomTip}"); true;`);
  };

  const handleRetry = () => {
    setErrorOccurred(false);
    setWebViewLoading(true);
    webViewRef.current?.reload();
  };

  
  const htmlContent = getCourseHtmlTemplate(course);

  return (
    <View className="flex-1 bg-slate-950">
      
      <View className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex-row items-center justify-between">
        <View className="flex-1 mr-4">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Native Progress Tracker
          </Text>
          <View className="h-2 bg-slate-800 rounded-full w-full mt-2.5 overflow-hidden">
            <View
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
            />
          </View>
        </View>
        <View className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-2xl flex-row items-center">
          <CheckCircle2 size={16} color="#10b981" />
          <Text className="text-emerald-400 text-xs font-bold ml-1.5">
            {completedLessons}/{totalLessons} Done
          </Text>
        </View>
      </View>

      
      <View className="flex-1 relative">
        {errorOccurred ? (
          <View className="flex-1 justify-center items-center px-6">
            <AlertTriangle size={48} color="#ef4444" />
            <Text className="text-white font-bold text-lg mt-4">Failed to load content</Text>
            <Text className="text-slate-400 text-sm text-center mt-2 leading-relaxed">
              We encountered a problem loading the course viewer. Please check your connection and retry.
            </Text>
            <TouchableOpacity
              onPress={handleRetry}
              className="mt-6 bg-blue-600 px-6 py-3 rounded-2xl flex-row items-center space-x-2"
            >
              <RefreshCw size={16} color="#ffffff" />
              <Text className="text-white font-bold ml-2">Retry Loading</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{
              html: htmlContent,
              headers: {
                'X-LMS-Platform': 'Aether-Mobile-App',
                'X-User-Token': accessToken || 'Guest',
              },
            }}
            onMessage={handleWebViewMessage}
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            onError={() => setErrorOccurred(true)}
            onHttpError={() => setErrorOccurred(true)}
            className="flex-1"
            style={{ backgroundColor: '#020617' }}
          />
        )}

        
        {webViewLoading && !errorOccurred && (
          <View className="absolute inset-0 bg-slate-950 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-slate-400 text-xs mt-3">Loading HTML course environment...</Text>
          </View>
        )}
      </View>

      
      <View className="bg-slate-900 border-t border-slate-800 px-6 py-4 flex-row items-center justify-between">
        <Text className="text-slate-400 text-xs font-semibold flex-1 mr-4">
          Send a native progress notification to the active WebView layout:
        </Text>
        <TouchableOpacity
          onPress={injectTip}
          disabled={webViewLoading || errorOccurred}
          className="bg-blue-600 p-3 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/20 active:bg-blue-700"
        >
          <Send size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

import { useLayoutEffect as reactUseLayoutEffect } from 'react';
const useLayoutEffect = reactUseLayoutEffect;
