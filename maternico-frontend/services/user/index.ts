import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/env";
import { Platform } from "react-native";
import { uriToBlob } from "../album";
import * as ImagePicker from "expo-image-picker";

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
  profilePhoto?: ImagePicker.ImagePickerAsset,
) => {
  try {
	const formData = new FormData();
	formData.append("name", name);
	formData.append("last_name", lastName);
	formData.append("mother_last_name", motherLastName);
	formData.append("email", email);
	if (password) formData.append("password", password);

	console.log("URI de la foto de perfil:", profilePhoto?.uri);
	if (profilePhoto?.uri) {
		const uri = profilePhoto.uri;
		const filename = uri.split("/").pop()!;
		const ext = filename.split(".").pop()!.toLowerCase();
		const mime = ext === "png" ? "image/png" : "image/jpeg";

		// Manejo diferente para web y móvil
		if (Platform.OS === "web") {
			const blob = await uriToBlob(uri);
			formData.append("profile_photo", blob, filename);
		} else {
			// En React Native, adjunta el objeto de archivo directamente
			formData.append("profile_photo", {
				uri: uri,
				name: filename,
				type: mime,
			} as unknown as Blob); // Cast necesario por diferencias en FormData
		}
	}

    const token = await AsyncStorage.getItem("token");
	const res = await fetch(`${API_URL}/profile/${userID}`, {
	  method: "POST",
	  headers: {
		Authorization: `Bearer ${token}`,
	  },
	  body: formData,
	});
	const json = await res.json();
	console.log("Respuesta de actualización de usuario:", json);
	if (!res.ok) throw new Error(json.message || "Error actualizando usuario");
	return json;
  } catch (e) {
	console.error("Error actualizando usuario:", e);
	return null;
  }
}


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