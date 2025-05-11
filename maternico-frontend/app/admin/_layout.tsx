import { Stack } from "expo-router";
import { View } from "react-native";
import Navbar from "@/components/ui/admin/Navbar";

export default function AdminLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FEFEFE" },
        }}
      >
        <Stack.Screen name="file-management" options={{headerShown: false}} />
        <Stack.Screen name="magazines" options={{headerShown: false}} />
        <Stack.Screen name="videos" options={{headerShown: false}} />
      </Stack>
      <Navbar />
    </View>
  );
}