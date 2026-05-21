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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { BookOpen, Mail, User, Lock, AlertCircle } from 'lucide-react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  // Clear errors on mount
  useEffect(() => {
    clearError();
  }, []);

  const handleLogin = async () => {
    if (isEmailLogin && !email.trim()) return;
    if (!isEmailLogin && !username.trim()) return;
    if (!password) return;

    try {
      if (isEmailLogin) {
        await login('', email.trim(), password);
      } else {
        await login(username.trim(), '', password);
      }
      router.replace('/(tabs)');
    } catch (e) {
      // Handled in store error
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-950"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-6 justify-center"
      >
        <View className="items-center mb-8">
          <View className="h-16 w-16 bg-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/50 mb-4">
            <BookOpen size={36} color="#ffffff" />
          </View>
          <Text className="text-3xl font-bold text-white text-center">
            Aether LMS
          </Text>
          <Text className="text-slate-400 text-center mt-2 text-sm">
            Learn anything, anywhere, anytime
          </Text>
        </View>

        <View className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <Text className="text-xl font-semibold text-white mb-6">
            Sign In
          </Text>

          {error && (
            <View className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex-row items-center space-x-3">
              <AlertCircle size={20} color="#ef4444" />
              <Text className="text-red-400 text-sm flex-1 ml-2">{error}</Text>
            </View>
          )}

          {/* Login Type Switch */}
          <View className="flex-row bg-slate-950 rounded-xl p-1 mb-6">
            <TouchableOpacity
              onPress={() => {
                setIsEmailLogin(false);
                clearError();
              }}
              className={`flex-1 py-2.5 rounded-lg items-center ${
                !isEmailLogin ? 'bg-blue-600' : ''
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  !isEmailLogin ? 'text-white' : 'text-slate-400'
                }`}
              >
                Username
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsEmailLogin(true);
                clearError();
              }}
              className={`flex-1 py-2.5 rounded-lg items-center ${
                isEmailLogin ? 'bg-blue-600' : ''
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  isEmailLogin ? 'text-white' : 'text-slate-400'
                }`}
              >
                Email Address
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          <View className="space-y-4">
            {!isEmailLogin ? (
              <View>
                <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Username
                </Text>
                <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5">
                  <User size={20} color="#64748b" />
                  <TextInput
                    placeholder="Enter your username"
                    placeholderTextColor="#475569"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 text-white ml-3 text-base"
                  />
                </View>
              </View>
            ) : (
              <View>
                <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Email Address
                </Text>
                <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5">
                  <Mail size={20} color="#64748b" />
                  <TextInput
                    placeholder="Enter your email"
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
            )}

            <View className="mt-4">
              <Text className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </Text>
              <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5">
                <Lock size={20} color="#64748b" />
                <TextInput
                  placeholder="Enter your password"
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
            onPress={handleLogin}
            disabled={isLoading}
            className="bg-blue-600 rounded-xl py-4 items-center justify-center mt-8 active:bg-blue-700 shadow-md shadow-blue-500/20"
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text className="text-white text-base font-bold">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <View className="flex-row justify-center items-center mt-8">
          <Text className="text-slate-400 text-sm">Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-blue-500 text-sm font-semibold ml-1.5 active:underline">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
