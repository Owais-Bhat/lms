import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LegendList } from '@legendapp/list';
import { useCourseStore, Course } from '../../store/useCourseStore';
import { useNetwork } from '../../hooks/useNetwork';
import { CourseCard } from '../../components/CourseCard';
import { Search, WifiOff, RefreshCw, BookOpen } from 'lucide-react-native';

export default function CourseCatalogScreen() {
  const {
    courses,
    bookmarks,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    fetchCourses,
    toggleBookmark,
    setSearchQuery,
  } = useCourseStore();

  const isOffline = useNetwork();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleRefresh = () => {
    fetchCourses(true);
  };

  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.instructor.name.toLowerCase().includes(query)
    );
  });

  return (
    <View className="flex-1">
      {/* Offline Banner */}
      {isOffline && (
        <View className="bg-amber-600/90 py-2.5 px-4 flex-row items-center justify-center space-x-2 border-b border-amber-500/20">
          <WifiOff size={16} color="#ffffff" />
          <Text className="text-white text-xs font-semibold ml-2">
            You are currently offline. Running in cache mode.
          </Text>
        </View>
      )}

      {/* Error Banner */}
      {error && !isOffline && (
        <View className="bg-red-500/10 border-b border-red-500/20 py-2.5 px-4 flex-row justify-between items-center">
          <Text className="text-red-400 text-xs font-medium flex-1 mr-2" numberOfLines={1}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => fetchCourses()}
            className="bg-red-500/20 px-3 py-1 rounded-full flex-row items-center"
          >
            <RefreshCw size={10} color="#f87171" />
            <Text className="text-red-400 text-[10px] font-bold ml-1">Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Bar Header */}
      <View className={`px-4 py-3 border-b ${isDark ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'}`}>
        <View className={`flex-row items-center px-4 py-2.5 rounded-xl border ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <Search size={18} color={isDark ? '#64748b' : '#94a3b8'} />
          <TextInput
            placeholder="Search courses, instructors, categories..."
            placeholderTextColor={isDark ? '#475569' : '#94a3b8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className={`flex-1 ml-2.5 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Course List / Loader */}
      {isLoading && courses.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-slate-400 text-xs font-semibold mt-3 animate-pulse">
            Fetching course catalog...
          </Text>
        </View>
      ) : (
        <LegendList
          data={filteredCourses}
          keyExtractor={(item: Course) => item.id}
          estimatedItemSize={320}
          recycleItems
          className="pt-4"
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          renderItem={({ item }: { item: Course }) => (
            <CourseCard
              course={item}
              isBookmarked={bookmarks.includes(item.id)}
              onPress={() => router.push(`/course/${item.id}`)}
              onBookmarkToggle={() => toggleBookmark(item.id)}
            />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-20 px-8">
              <View className="h-16 w-16 bg-slate-900 rounded-full items-center justify-center mb-4 border border-slate-800">
                <BookOpen size={28} color="#64748b" />
              </View>
              <Text className={`text-base font-bold text-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
                No courses found
              </Text>
              <Text className="text-slate-400 text-xs text-center mt-1">
                Try searching for something else or refreshing the feed.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
