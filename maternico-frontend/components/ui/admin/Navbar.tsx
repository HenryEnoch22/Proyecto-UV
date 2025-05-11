import { View, StyleSheet, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { CloudArrowUpIcon, BookOpenIcon, VideoCameraIcon } from "react-native-heroicons/outline";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (routePath: string) => pathname === routePath;

  return (
    <View style={styles.container}>
      <Pressable 
        onPress={() => router.push("/admin/file-management")} 
        style={styles.navItem}
      >
        <View style={styles.iconContainer}>
          <CloudArrowUpIcon size={24} color="#F392BE" />
          {(isActive("/admin/file-management") || isActive("/")) && <View style={styles.activeIndicator} />}
        </View>
      </Pressable>
      
      <Pressable 
        onPress={() => router.push("/admin/magazines")} 
        style={styles.navItem}
      >
        <View style={styles.iconContainer}>
          <BookOpenIcon size={24} color="#F392BE" />
          {isActive("/admin/magazines") && <View style={styles.activeIndicator} />}
        </View>
      </Pressable>
      
      <Pressable 
        onPress={() => router.push("/admin/videos")} 
        style={styles.navItem}
      >
        <View style={styles.iconContainer}>
          <VideoCameraIcon size={24} color="#F392BE" />
          {isActive("/admin/videos") && <View style={styles.activeIndicator} />}
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
    width: '80%',
    backgroundColor: '#F392BE',
    borderRadius: 2,
  },
});

export default Navbar;