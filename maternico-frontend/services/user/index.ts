import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/env";

type User = {
	id: number;
	role_id: number;
	name: string;
	email: string;
	last_name: string;
	mother_last_name: string;
	birth_date: string;
	profile_photo_path: string;
	is_premium: number;
};

export type UserResponse = {
	success: boolean;
	user: User;
};

export const getProfile = async (): Promise<UserResponse | null> => {
	try {
		const token = await AsyncStorage.getItem("token");
		if (!token) throw new Error("No hay token almacenado");

		const response = await fetch(`${API_URL}/user`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) return null;
		const data = response.json();
		return (await data) as UserResponse;
	} catch (error) {
		console.error("Error obteniendo el perfil:", error);
		return null;
	}
};

export const updateUser = async (
	userID: string,
	name: string,
	lastName: string,
	motherLastName: string,
	email: string,
	password: string,
	profilePhoto: string | undefined
) => {
	try {
		const response = await fetch(`${API_URL}/profile/${userID}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				last_name: lastName,
				mother_last_name: motherLastName,
				email,
				password,
				profile_photo: profilePhoto,
			}),
		});

		if (!response.ok) throw new Error("Error al actualizar el usuario");

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error actualizando usuario:", error);
		return [];
	}
};

export const becomePremium = async (userID: number) => {
	try {
		const response = await fetch(`${API_URL}/become-premium/${userID}`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) throw new Error("Error al convertir a premium");

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error convirtiendo a premium:", error);
		return [];
	}
}