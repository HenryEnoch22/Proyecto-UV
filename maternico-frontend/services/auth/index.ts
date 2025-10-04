import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/env";

const validateUserLocation = async (userLat: number, userLng: number, localityId: number): Promise<boolean> => {
	try {
		const response = await fetch(`${API_URL}/validate-location/${userLat}/${userLng}/${localityId}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) throw new Error("Error al validar ubicación");

		const data = await response.json();
		console.log("validateUserLocation response:", data);
		return data;
	} catch (error) {
		console.error("Error en validateUserLocation:", error);
		throw error;
	}
};

export const register = async (data: {
    name: string;
    last_name: string;
    mother_last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    is_rural: boolean;
    user_lat: number;
    user_lng: number;
    locality_state?: string;
    locality_municipality?: string;
    locality_name?: string;
}) => {
    try {
		console.log("register data:", data);
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
		console.log("register response status:", response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el registro");
        }

        const responseData = await response.json();
        if (!responseData.token) throw new Error("No se recibió el token");

        await AsyncStorage.setItem("token", responseData.token);
        return responseData;
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