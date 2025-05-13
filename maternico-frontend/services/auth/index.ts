import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/env";

export const register = async (
	name: string,
	lastName: string,
	motherLastName: string,
	email: string,
	password: string,
	confirmPassword: string
) => {
	try {
		const response = await fetch(`${API_URL}/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				last_name: lastName,
				mother_last_name: motherLastName,
				email,
				password,
				password_confirmation: confirmPassword,
			}),
		});

		if (!response.ok) throw new Error("Error en el registro");

		const data = await response.json();
		if (!data.token) throw new Error("No se recibió el token");

		await AsyncStorage.setItem("token", data.token);
		return data;
	} catch (error) {
		console.error("Error en registro:", error);
		throw error;
	}
};

export const login = async (email: string, password: string) => {
	try {
		const response = await fetch(`${API_URL}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) throw new Error("Error en la autenticación");

		const data = await response.json();
		if (!data.token) throw new Error("No se recibió el token");

		await AsyncStorage.setItem("token", data.token);
		return data;
	} catch (error) {
		console.error("Error en login:", error);
		throw error;
	}
};

export const logout = async () => {
	try {
		const token = await AsyncStorage.getItem("token");
		if (!token) return;

		await fetch(`${API_URL}/logout`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		await AsyncStorage.removeItem("token");
	} catch (error) {
		console.error("Error en logout:", error);
	}
};