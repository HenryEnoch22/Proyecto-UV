import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { useAuth } from "../contexts/AuthContext";
import HomeScreen from "./(tabs)/home";
import { getProfile } from "@/services/api";
import BottomNavbar from "@/components/ui/BottomNavbar";

export default function Index() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await getProfile();
        
        if (userData) {
          setUser({
            id: userData.id.toString(),
            name: userData.name,
            email: userData.email,
            last_name: userData.last_name,
            mother_last_name: userData.mother_last_name,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return user ? <>
    <HomeScreen />
    <BottomNavbar />
    </> : <LoginScreen />;
}