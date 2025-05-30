import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/env";
import * as ImagePicker from "expo-image-picker";

export const getAlbumEvents = async (babyID: number) => {
	try {
		const response = await fetch(`${API_URL}/baby-events-get/${babyID}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${await AsyncStorage.getItem("token")}`,
			},
		});
		if (!response.ok) throw new Error("Error al obtener los eventos del álbum");

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Error obteniendo eventos del álbum:", error);
		return [];
	}
};

async function uriToBlob(uri: string): Promise<Blob> {
	// En web, los data: URIs funcionan con fetch
	if (uri.startsWith("data:") || uri.startsWith("http")) {
		const resp = await fetch(uri);
		return await resp.blob();
	}
	// En iOS/Android – React Native – usa XMLHttpRequest para file://
	return await new Promise<Blob>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = () => resolve(xhr.response);
		xhr.onerror = () => reject(new Error("No se pudo leer el archivo"));
		xhr.responseType = "blob";
		xhr.open("GET", uri, true);
		xhr.send(null);
	});
}

export const createAlbumEvent = async (
	babyID: number,
	eventTitle: string,
	description: string,
	date: string,
	photoPath?: ImagePicker.ImagePickerAsset
) => {
	try {
		const formData = new FormData();
		formData.append("baby_id", babyID.toString());
		formData.append("event_title", eventTitle);
		formData.append("description", description);
		formData.append("date", date);

		if (photoPath?.uri) {
			const uri = photoPath.uri; // ← sin “file://”
			const name = uri.split("/").pop()!;
			const ext = name.split(".").pop()!.toLowerCase();
			const mime = ext === "png" ? "image/png" : "image/jpeg";

			// convierte a Blob de forma cross‑platform
			const blob = await uriToBlob(uri);
			formData.append("photo_path", blob, name);
		}

		const token = await AsyncStorage.getItem("token");
		const res = await fetch(`${API_URL}/baby-events`, {
			method: "POST",
			headers: { Authorization: `Bearer ${token}` },
			body: formData,
		});

		const json = await res.json();
		if (!res.ok) throw new Error(json.message || "Error creando evento");
		return json.data;
	} catch (e) {
		console.error("Error creando evento del álbum:", e);
		return null;
	}
};

export const deleteAlbumEvent = async (eventID: number) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/baby-events/${eventID}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) throw new Error("Error al eliminar el evento del álbum");

        const { success } = await response.json();
        return success;
    } catch (error) {
        console.error("Error eliminando evento del álbum:", error);
        return null;
    }
}