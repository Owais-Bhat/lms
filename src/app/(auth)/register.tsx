import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { BookOpen, Mail, User, Lock, AlertCircle, Smile } from 'lucide-react-native';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    clearError();
  }, []);

  const handleRegister = async () => {
    setLocalError(null);
    clearError();

    if (!fullName.trim()) {
      setLocalError('Full Name is required');
      return;
    }
    if (!username.trim()) {
      setLocalError('Username is required');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(username.trim(), email.trim(), password, fullName.trim());
      Alert.alert(
        'Success!',
        'Your account has been created. Please sign in with your credentials.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (e) {
      // Backend error is handled by store
    }
  };

  const displayError = localError || error;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-950"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-6 justify-center py-10"
      >
        <View className="items-center mb-6">
          <View className="h-14 w-14 bg-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/50 mb-3">
            <BookOpen size={30} color="#ffffff" />
          </View>
          <Text className="text-2xl font-bold text-white text-center">
            Create Account
          </Text>
          <Text className="text-slate-400 text-center mt-1 text-xs">
            Start your learning journey with us
          </Text>
        </View>

        <View className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          {displayError && (
            <View className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5 flex-row items-center space-x-3">
              <AlertCircle size={20} color="#ef4444" />
              <Text className="text-red-400 text-sm flex-1 ml-2">{displayError}</Text>
            </View>
          )}

          <View className="space-y-4">
            {/* Full Name */}
            <View>
              <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Full Name
              </Text>
              <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
                <Smile size={18} color="#64748b" />
                <TextInput
                  placeholder="John Doe"
                  placeholderTextColor="#475569"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  className="flex-1 text-white ml-3 text-base"
                />
              </View>
            </View>

            {/* Username */}
            <View className="mt-3">
              <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Username
              </Text>
              <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
                <User size={18} color="#64748b" />
                <TextInput
                  placeholder="johndoe12"
                  placeholderTextColor="#475569"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 text-white ml-3 text-base"
                />
              </View>
            </View>

            {/* Email Address */}
            <View className="mt-3">
              <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Email Address
              </Text>
              <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
                <Mail size={18} color="#64748b" />
                <TextInput
                  placeholder="john@example.com"
                  placeholderTextColor="#475569"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 text-white ml-3 text-base"
                />
              </View>
            </View>

            {/* Password */}
            <View className="mt-3">
              <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </Text>
              <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
                <Lock size={18} color="#64748b" />
                <TextInput
                  placeholder="At least 6 characters"
                  placeholderTextColor="#475569"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 text-white ml-3 text-base"
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            className="bg-blue-600 rounded-xl py-4 items-center justify-center mt-6 active:bg-blue-700 shadow-md shadow-blue-500/20"
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text className="text-white text-base font-bold">Register</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-slate-400 text-sm">Already have an account?</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text className="text-blue-500 text-sm font-semibold ml-1.5 active:underline">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
