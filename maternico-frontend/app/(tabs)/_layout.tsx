import { Stack } from "expo-router";
import { View } from "react-native";
import BottomNavbar from "@/components/ui/BottomNavbar";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FEFEFE" },
        }}
      >
        <Stack.Screen name="home" options={{headerShown: false}} />
        <Stack.Screen name="calendar" options={{headerShown: false}} />
        <Stack.Screen name="forum" options={{headerShown: false}} />
        <Stack.Screen name="notifications" options={{headerShown: false}} />
      </Stack>
      <BottomNavbar />
    </View>
  );
}