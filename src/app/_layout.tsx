import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
          },
          headerTintColor: isDark ? "#f8fafc" : "#0f172a",
          headerTitleStyle: {
            fontWeight: "600",
          },
          contentStyle: {
            backgroundColor: isDark ? "#0f172a" : "#f8fafc",
          },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="course/[id]" options={{ title: "Course Details" }} />
        <Stack.Screen name="course/view" options={{ title: "Embedded Course" }} />
      </Stack>
    </>
  );
}
