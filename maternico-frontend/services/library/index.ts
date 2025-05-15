import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/env";

// INTERFACES
interface Magazine {
	id: string;
	title: string;
	magazine_path: string;
}

interface Video {
	id: string;
	title: string;
	video_path: string;
}

// CONTENT LIBRARY
export const createMagazine = async (
    title: string,
    magazinePath: string,
	category: string
) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/magazines`, {
            method: "POST",
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title, magazine_path: magazinePath, category}),
        });
        if (!response.ok) throw new Error("Error al crear la revista");

        const { data } = await response.json();
        
        return {data};
    } catch (e) {
        console.error("Error creando revista:", e);
        return null;
    }
}
export const getMagazines = async () => {
	try {
		const token = await AsyncStorage.getItem("token");
        if (!token) return;
        
		const response = await fetch(`${API_URL}/magazines`, {
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Error al obtener revistas");
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		return [];
	}
};

export const getMagazine = async (
	magazineID: number
): Promise<{ magazine: Magazine }> => {
	try {
		const response = await fetch(`${API_URL}/magazines/${magazineID}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al obtener las revistas");

		const { data } = await response.json(); // Extraer data
		return data;
	} catch (error) {
		console.error("Error obteniendo revistas:", error);
		return { magazine: { id: "", title: "", magazine_path: "" } };
	}
};

export const getAllMagazines = async () => {
	try {
		const token = await AsyncStorage.getItem("token");
		if (!token) return;

		const response = await fetch(`${API_URL}/all-magazines`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al obtener revistas");
		const { data } = await response.json();
		return data;
	} catch (error) {
		return [];
	}
}

export const deleteMagazine = async (magazineID: number) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/magazines/${magazineID}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) throw new Error("Error al eliminar la revista");

        const { success } = await response.json();
        return success;
    } catch (error) {
        console.error("Error eliminando revista:", error);
        return null;
    }
}

export const createVideo = async (
    title: string,
    videoPath: string
) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/videos`, {
            method: "POST",
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, video_path: videoPath }),
        });
        if (!response.ok) throw new Error("Error al crear el video");

        const { data } = await response.json();

        return { data };
    } catch (e) {
        console.error("Error creando video:", e);
        return null;
    }
};

export const getVideos = async () => {
	try {
		const token = await AsyncStorage.getItem("token");
		const response = await fetch(`${API_URL}/videos`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al obtener videos");
		const { data } = await response.json();
		return data;
	} catch (error) {
		return [];
	}
};

export const getVideo = async (videoID: string): Promise<{ video: Video }> => {
	try {
		const response = await fetch(`${API_URL}/videos/${videoID}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		const { data } = await response.json();
		if (!response.ok) throw new Error("Error al obtener el video");

		return data;
	} catch (error) {
		console.error("Error obteniendo video:", error);
		return { video: { id: "", title: "", video_path: "" } };
	}
};

export const deleteVideo = async (videoID: number) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/videos/${videoID}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) throw new Error("Error al eliminar el video");

        const { success } = await response.json();
        return success;
    } catch (error) {
        console.error("Error eliminando video:", error);
        return null;
    }
}

export const getHealthCenters = async () => {
	try {
		const response = await fetch(`${API_URL}/health-centers`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al obtener los centros de salud");

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error obteniendo centros de salud:", error);
		return [];
	}
};
