import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/env";

type Baby = {
	id: string;
	user_id: number;
	name: string;
	last_name: string;
	mother_last_name: string;
	birth_date: string;
	height: string;
	weight: string;
	blood_type: string;
};

export const getBaby = async (babyID: number) => {
	try {
		const response = await fetch(`${API_URL}/babies/${babyID}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al obtener el bebé");

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error obteniendo bebé:", error);
		return [];
	}
};

export const getBabyByMother = async (
	motherID: number
): Promise<Baby | null> => {
	try {
		const response = await fetch(`${API_URL}/baby-mother/${motherID}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al obtener el bebé por madre");

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Error obteniendo bebé por madre:", error);
		return null;
	}
};

export const registerBaby = async (
	userID: number | undefined,
	name: string,
	lastName: string,
	motherLastName: string,
	birthDate: string,
	weight: number,
	height: number,
	bloodType: string
) => {
	try {
		const response = await fetch(`${API_URL}/babies`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id: userID,
				name,
				last_name: lastName,
				mother_last_name: motherLastName,
				weight,
				height,
				blood_type: bloodType,
				birth_date: birthDate,
			}),
		});

		if (!response.ok) throw new Error("Error al registrar el bebé");

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error registrando bebé:", error);
		return [];
	}
};

export const updateBaby = async (
	babyID: string,
	name: string,
	lastName: string,
	motherLastName: string,
	birthDate: string,
	bloodType: string,
	weight: number,
	height: number
) => {
	try {
		const response = await fetch(`${API_URL}/babies/${babyID}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				last_name: lastName,
				mother_last_name: motherLastName,
				birth_date: birthDate,
				blood_type: bloodType,
				weight,
				height,
			}),
		});

		if (!response.ok) throw new Error("Error al actualizar el bebé");

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error actualizando bebé:", error);
		return [];
	}
};
