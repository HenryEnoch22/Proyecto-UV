import { View, StyleSheet, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { 
  HomeIcon, 
  CalendarIcon, 
  InformationCircleIcon, 
  ChatBubbleBottomCenterTextIcon 
} from "react-native-heroicons/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { getProfile } from "@/services/api";
import Navbar from "./admin/Navbar";

const BottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (routePath: string) => pathname === routePath;
  const { user, setUser } = useAuth();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await getProfile();
        if (userData?.user) {
          setUser({ ...userData.user });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  if (user?.role_id === 1) {
    return <Navbar />;
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/home")} style={styles.navItem}>
        <View style={styles.iconContainer}>
          <HomeIcon size={24} color="#F392BE" />
          {(isActive("/home") || isActive("/")) && <View style={styles.activeIndicator} />}
        </View>
      </Pressable>

      <Pressable onPress={() => router.push("/calendar")} style={styles.navItem}>
        <View style={styles.iconContainer}>
          <CalendarIcon size={24} color="#F392BE" />
          {isActive("/calendar") && <View style={styles.activeIndicator} />}
        </View>
      </Pressable>

      <Pressable onPress={() => router.push("/(tabs)/info")} style={styles.navItem}>
        <View style={styles.iconContainer}>
          <InformationCircleIcon size={32} color="#F392BE" />
          {isActive("/info") && <View style={[styles.activeIndicator, { bottom: -6 }]} />}
        </View>
      </Pressable>

      <Pressable onPress={() => router.push("/forum")} style={styles.navItem}>
        <View style={styles.iconContainer}>
          <ChatBubbleBottomCenterTextIcon size={24} color="#F392BE" />
          {isActive("/forum") && <View style={styles.activeIndicator} />}
        </View>
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
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -5,
    height: 2,
    width: '70%',
    backgroundColor: '#F392BE',
    borderRadius: 2,
  },
});

export default BottomNavbar;