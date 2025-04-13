// app/components/ui/BottomNavbar.tsx
import { View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { HomeIcon, CalendarIcon, InformationCircleIcon, ChatBubbleBottomCenterTextIcon } from "react-native-heroicons/outline";

const BottomNavbar = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/home")} style={styles.navItem}>
        <HomeIcon size={24} color="#F392BE" />
      </Pressable>
      
      <Pressable onPress={() => router.push("/calendar")} style={styles.navItem}>
        <CalendarIcon size={24} color="#F392BE" />
      </Pressable>
      
      <Pressable onPress={() => router.push("/(tabs)/info")} style={styles.navItem}>
        <InformationCircleIcon size={32} color="#F392BE" />
      </Pressable>
      
      <Pressable onPress={() => router.push("/forum")} style={styles.navItem}>
        <ChatBubbleBottomCenterTextIcon size={24} color="#F392BE" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FEFEFE",
    paddingVertical: 12,
    paddingHorizontal: 20,
    height: 70,
    elevation: 15,
    shadowColor: "#343434",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  navItem: {
    padding: 10,
    borderRadius: 20,
  },
});

export default BottomNavbar;