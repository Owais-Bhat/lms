import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { LegendList } from '@legendapp/list';
import { useCourseStore, Course } from '../../store/useCourseStore';
import { CourseCard } from '../../components/CourseCard';
import { Bookmark } from 'lucide-react-native';

export default function BookmarksScreen() {
  const { courses, bookmarks, toggleBookmark } = useCourseStore();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bookmarkedCourses = courses.filter((course) =>
    bookmarks.includes(course.id)
  );

  return (
    <View className="flex-1">
      {bookmarkedCourses.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20 px-8">
          <View className="h-16 w-16 bg-blue-600/10 rounded-full items-center justify-center mb-4 border border-blue-500/20">
            <Bookmark size={28} color="#3b82f6" />
          </View>
          <Text className={`text-base font-bold text-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
            No bookmarked courses
          </Text>
          <Text className="text-slate-400 text-xs text-center mt-1 leading-relaxed">
            Courses you bookmark will appear here. Tap the bookmark icon on any course card to save it.
          </Text>
        </View>
      ) : (
        <LegendList
          data={bookmarkedCourses}
          keyExtractor={(item: Course) => item.id}
          estimatedItemSize={320}
          recycleItems
          className="pt-4"
          renderItem={({ item }: { item: Course }) => (
            <CourseCard
              course={item}
              isBookmarked={true}
              onPress={() => router.push(`/course/${item.id}`)}
              onBookmarkToggle={() => toggleBookmark(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}
