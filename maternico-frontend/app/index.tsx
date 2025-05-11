import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { useAuth } from "../contexts/AuthContext";
import HomeScreen from "./(tabs)/home";
import { getProfile } from "@/services/api";
import BottomNavbar from "@/components/ui/BottomNavbar";
import { UserResponse } from "../services/api";
import FileManagement from "./admin/file-management";
import Navbar from "@/components/ui/admin/Navbar";

export default function Index() {
	const { user, setUser } = useAuth();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const userData: UserResponse | null = await getProfile();

				if (userData?.user) {
					const { user } = userData;
					setUser({
						id: user.id,
						role_id: user.role_id,
						name: user.name,
						email: user.email,
						last_name: user.last_name,
						mother_last_name: user.mother_last_name,
						birth_date: user.birth_date,
						profile_photo_path: user.profile_photo_path,
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

	return !user ? (
		<LoginScreen />
	) : user.role_id == 1 ? (
		<>
      <FileManagement />
      <Navbar />
    </>
	) : (
		<>
			<HomeScreen />
			<BottomNavbar />
		</>
	);
}
