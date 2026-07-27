import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Image } from 'expo-image';
import { useCourseStore } from '../../store/useCourseStore';
import { Bookmark, Star, User2, PlayCircle, ShieldCheck, ArrowLeft } from 'lucide-react-native';

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { courses, bookmarks, enrolled, toggleBookmark, enrollInCourse } = useCourseStore();
  
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const course = courses.find((c) => c.id === id);
  const isBookmarked = bookmarks.includes(id || '');
  const isEnrolled = enrolled.includes(id || '');

  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: course ? course.title : 'Course Details',
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color={isDark ? '#f8fafc' : '#0f172a'} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => course && toggleBookmark(course.id)}
          className="p-2"
        >
          <Bookmark
            size={22}
            color={isBookmarked ? '#3b82f6' : isDark ? '#f8fafc' : '#0f172a'}
            fill={isBookmarked ? '#3b82f6' : 'transparent'}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, course, isBookmarked, isDark]);

  if (!course) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-red-500 font-bold text-lg">Course Not Found</Text>
        <Text className="text-slate-400 text-sm text-center mt-2">
          The course you are looking for does not exist or has been removed.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleEnroll = () => {
    enrollInCourse(course.id);
    Alert.alert(
      '🎉 Enrollment Successful!',
      `You have enrolled in "${course.title}". You can now start learning.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View className="flex-1 bg-slate-950">
      <ScrollView className="flex-1">
        
        <View className="h-60 bg-slate-800 relative">
          <Image
            source={course.thumbnail}
            contentFit="cover"
            className="h-full w-full"
          />
          <View className="absolute inset-0 bg-slate-950/20" />
        </View>

        
        <View className="p-6">
          
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-blue-600/20 px-3 py-1 rounded-full border border-blue-500/30">
              <Text className="text-blue-400 text-xs font-bold capitalize">
                {course.category}
              </Text>
            </View>
            <View className="flex-row items-center bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-full">
              <Star size={12} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-white text-xs font-semibold ml-1">
                {course.rating.toFixed(1)} / 5.0
              </Text>
            </View>
          </View>

          
          <Text className={`text-2xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {course.title}
          </Text>

          
          <View className={`flex-row items-center border-y border-slate-900 py-4 mb-6`}>
            <Image
              source={course.instructor.avatar}
              contentFit="cover"
              className="h-10 w-10 rounded-full bg-slate-800 border border-blue-500/20"
            />
            <View className="ml-3 flex-1">
              <Text className="text-slate-400 text-xs font-semibold">Course Instructor</Text>
              <Text className={`text-sm font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {course.instructor.name}
              </Text>
            </View>
          </View>

          
          <Text className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            About This Course
          </Text>
          <Text className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {course.description}
          </Text>
        </View>
      </ScrollView>

      
      <View className={`px-6 py-5 border-t flex-row items-center justify-between ${
        isDark ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-100'
      }`}>
        <View className="flex-col">
          <Text className="text-slate-400 text-xs font-semibold">Course Cost</Text>
          <Text className={`text-2xl font-black mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            ${course.price.toFixed(2)}
          </Text>
        </View>

        {!isEnrolled ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleEnroll}
            className="bg-blue-600 px-8 py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <ShieldCheck size={18} color="#ffffff" />
            <Text className="text-white font-bold ml-2 text-sm">Enroll Now</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: '/course/view',
              params: { id: course.id }
            })}
            className="bg-emerald-600 px-8 py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            <PlayCircle size={18} color="#ffffff" />
            <Text className="text-white font-bold ml-2 text-sm">Start Learning</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
