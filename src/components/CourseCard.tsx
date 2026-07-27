import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { Bookmark, Star, User } from 'lucide-react-native';
import { Course } from '../store/useCourseStore';

interface CourseCardProps {
  course: Course;
  isBookmarked: boolean;
  onPress: () => void;
  onBookmarkToggle: () => void;
}

export const CourseCard = React.memo(({
  course,
  isBookmarked,
  onPress,
  onBookmarkToggle
}: CourseCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`mx-4 mb-4 rounded-3xl border overflow-hidden ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
      }`}
    >
      
      <View className="relative h-44 w-full bg-slate-800">
        <Image
          source={course.thumbnail}
          contentFit="cover"
          transition={200}
          className="h-full w-full"
        />
        
        <View className="absolute top-3 left-3 flex-row space-x-2">
          <View className="bg-slate-950/80 px-2.5 py-1 rounded-full flex-row items-center border border-slate-800">
            <Star size={12} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-white text-xs font-semibold ml-1">
              {course.rating.toFixed(1)}
            </Text>
          </View>
          <View className="bg-blue-600/95 px-2.5 py-1 rounded-full border border-blue-400/20 ml-2">
            <Text className="text-white text-xs font-semibold capitalize">
              {course.category}
            </Text>
          </View>
        </View>

        
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBookmarkToggle}
          className="absolute top-3 right-3 h-9 w-9 bg-slate-950/80 rounded-full items-center justify-center border border-slate-800"
        >
          <Bookmark
            size={16}
            color={isBookmarked ? '#3b82f6' : '#ffffff'}
            fill={isBookmarked ? '#3b82f6' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      
      <View className="p-4">
        
        <View className="flex-row items-center space-x-2.5 mb-2.5">
          <Image
            source={course.instructor.avatar}
            contentFit="cover"
            className="h-7 w-7 rounded-full bg-slate-800"
          />
          <Text className={`text-xs font-semibold ml-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {course.instructor.name}
          </Text>
        </View>

        
        <Text className={`text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`} numberOfLines={2}>
          {course.title}
        </Text>

        
        <Text className={`text-xs mb-3.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`} numberOfLines={2}>
          {course.description}
        </Text>

        
        <View className="flex-row justify-between items-center pt-3 border-t border-slate-800/20 dark:border-slate-800">
          <Text className={`text-lg font-extrabold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            ${course.price.toFixed(2)}
          </Text>
          <Text className="text-blue-500 text-xs font-bold uppercase tracking-wider">
            View details
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

CourseCard.displayName = 'CourseCard';
