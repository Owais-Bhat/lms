import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/useAuthStore';
import { useCourseStore } from '../../store/useCourseStore';
import { LogOut, BookOpen, Bookmark, Award, Clock, Camera, Mail, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout, updateProfileImage } = useAuthStore();
  const { enrolled, bookmarks } = useCourseStore();
  
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Aether LMS?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handlePickImage = async () => {
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required to change profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      await updateProfileImage(result.assets[0].uri);
    }
  };

  
  const avatarUrl = user?.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';

  return (
    <ScrollView className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      <View className={`items-center pt-8 pb-6 px-6 border-b ${
        isDark ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
      }`}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePickImage}
          className="relative h-28 w-28 rounded-full border-4 border-blue-500 overflow-hidden mb-4"
        >
          <Image
            source={avatarUrl}
            contentFit="cover"
            className="h-full w-full bg-slate-800"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-slate-950/70 py-1 items-center justify-center">
            <Camera size={14} color="#ffffff" />
          </View>
        </TouchableOpacity>

        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {user?.fullName || 'Academic Explorer'}
        </Text>
        <Text className="text-blue-500 text-sm font-semibold mt-1">
          @{user?.username || 'username'}
        </Text>
      </View>

      
      <View className="p-4 mt-2">
        <View className={`rounded-3xl p-5 border ${
          isDark ? 'bg-slate-900/80 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <Text className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Account Information
          </Text>
          
          <View className="flex-row items-center space-x-3 mb-4">
            <Mail size={18} color="#3b82f6" />
            <View className="ml-3 flex-1">
              <Text className="text-slate-400 text-xs font-semibold">Email Address</Text>
              <Text className={`text-sm font-medium mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {user?.email || 'student@aether.com'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-3">
            <Shield size={18} color="#3b82f6" />
            <View className="ml-3 flex-1">
              <Text className="text-slate-400 text-xs font-semibold">Account Role</Text>
              <Text className={`text-sm font-medium mt-0.5 capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {user?.role || 'STUDENT'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      
      <View className="px-4">
        <Text className={`text-sm font-bold uppercase tracking-wider mb-3 ml-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Learning Statistics
        </Text>

        <View className="flex-row flex-wrap justify-between">
          
          <View className={`w-[48%] mb-4 rounded-3xl p-4 border ${
            isDark ? 'bg-slate-900/80 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <View className="h-9 w-9 bg-blue-500/10 rounded-xl items-center justify-center mb-3">
              <BookOpen size={18} color="#3b82f6" />
            </View>
            <Text className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {enrolled.length}
            </Text>
            <Text className="text-slate-400 text-xs font-medium mt-0.5">
              Enrolled Courses
            </Text>
          </View>

          
          <View className={`w-[48%] mb-4 rounded-3xl p-4 border ${
            isDark ? 'bg-slate-900/80 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <View className="h-9 w-9 bg-amber-500/10 rounded-xl items-center justify-center mb-3">
              <Bookmark size={18} color="#f59e0b" />
            </View>
            <Text className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {bookmarks.length}
            </Text>
            <Text className="text-slate-400 text-xs font-medium mt-0.5">
              Bookmarked
            </Text>
          </View>

          
          <View className={`w-[48%] mb-4 rounded-3xl p-4 border ${
            isDark ? 'bg-slate-900/80 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <View className="h-9 w-9 bg-emerald-500/10 rounded-xl items-center justify-center mb-3">
              <Award size={18} color="#10b981" />
            </View>
            <Text className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {enrolled.length > 0 ? Math.floor(enrolled.length * 0.4) : 0}
            </Text>
            <Text className="text-slate-400 text-xs font-medium mt-0.5">
              Completed
            </Text>
          </View>

          
          <View className={`w-[48%] mb-4 rounded-3xl p-4 border ${
            isDark ? 'bg-slate-900/80 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <View className="h-9 w-9 bg-purple-500/10 rounded-xl items-center justify-center mb-3">
              <Clock size={18} color="#a855f7" />
            </View>
            <Text className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {enrolled.length * 4.5} hrs
            </Text>
            <Text className="text-slate-400 text-xs font-medium mt-0.5">
              Study Duration
            </Text>
          </View>
        </View>
      </View>

      
      <View className="p-4 mb-10">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          className="bg-red-500/10 border border-red-500/20 rounded-3xl py-4 flex-row justify-center items-center space-x-3 active:bg-red-500/20"
        >
          <LogOut size={18} color="#ef4444" />
          <Text className="text-red-500 font-semibold text-base ml-2">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
