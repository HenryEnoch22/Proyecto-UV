import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile } from "@/services/api";

export const useUser = () => {
	const { user, setUser } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				if (!user?.id) {
					const userData = await getProfile();
					if (userData?.user) {
						setUser(userData.user);
					}
				}
			} catch (err) {
				setError("Error al cargar usuario");
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	return { user, loading, error };
};