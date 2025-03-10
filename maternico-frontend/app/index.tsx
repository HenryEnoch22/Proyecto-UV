import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { useAuth } from "../contexts/AuthContext";
import HomeScreen from "./(tabs)/home";
import { getProfile } from "@/services/api";
import BottomNavbar from "@/components/ui/BottomNavbar";
import { UserResponse } from "../services/api";

export default function Index() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData: UserResponse | null = await getProfile();

        if (userData?.user) {
          console.log("Usuario autenticado:", userData.user);
          const { user } = userData;
          console.log("Usuario", user);
          setUser({
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            last_name: user.last_name,
            mother_last_name: user.mother_last_name,
            birth_date: user.birth_date,
            profile_photo: user.profile_photo,
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