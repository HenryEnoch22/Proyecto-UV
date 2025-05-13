import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/env";

// CALENDAR
export const getEvents = async (
	userID: number,
	year: number,
	month: number
) => {
	try {
		const token = await AsyncStorage.getItem("token");
		if (!token) return;

		const response = await fetch(`${API_URL}/get-events`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id: userID, year, month }),
		});
		if (!response.ok) throw new Error("Error al obtener los eventos");

		return await response.json();
	} catch (error) {
		console.error("Error obteniendo eventos:", error);
		return [];
	}
};

export const createEvent = async (
	userID: number,
	eventTitle: string,
	date: string,
	time: string,
	notifiable: boolean,
	type: number
) => {
	try {
		const token = await AsyncStorage.getItem("token");
		if (!token) return;

		const types: { [key: number]: string } = {
			1: "Vacunación",
			2: "Alimentación",
			3: "Desarrollo",
			4: "Cita médica",
			5: "Cumpleaños",
		};

		const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
		const formattedTime = timeRegex.test(time) ? time : null;

		const requestBody = {
			user_id: userID,
			event_title: eventTitle,
			date: date,
			time: formattedTime, 
			notifiable: notifiable,
			type: types[type],
		};

		const response = await fetch(`${API_URL}/events`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Error al crear evento");
		}

		return await response.json();
	} catch (error) {
		console.error("Error creando evento:", error);
	}
};

export const deleteEvent = async (eventID: string | undefined) => {
	try {
		const token = await AsyncStorage.getItem("token");
		if (!token) return;

		const response = await fetch(`${API_URL}/events/${eventID}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al eliminar el evento");

		return await response.json();
	} catch (error) {
		console.error("Error eliminando evento:", error);
		return [];
	}
};

export const updateEvent = async (
	eventID: string | undefined,
	eventTitle: string,
	date: string,
	time: string,
	notifiable: boolean,
	type: number
) => {
	try {
		const token = await AsyncStorage.getItem("token");
		if (!token) return;

		const response = await fetch(`${API_URL}/events/${eventID}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				event_title: eventTitle,
				date,
				time,
				notifiable,
				type,
			}),
		});

		if (!response.ok) throw new Error("Error al actualizar el evento");

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Error actualizando evento:", error);
		return null;
	}
};

export const getLastEvents = async (userID: number) => {
	try {
		const token = await AsyncStorage.getItem("token");
		if (!token) return;

		const response = await fetch(`${API_URL}/get-last-events/${userID}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al obtener los últimos eventos");

		const { data } = await response.json();
		return data.reverse();
	} catch (error) {
		console.error("Error obteniendo últimos eventos:", error);
		return [];
	}
}