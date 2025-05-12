import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

// 🔹 URL base del backend Laravel (ajústala según la IP de tu servidor)
export const API_URL = "http://192.168.1.74:8000/api";

// INTERFACES
// 🔹 Función para obtener el perfil del usuario autenticado
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

// AUTH
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

// USER
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
	birthDate: string,
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
				birth_date: birthDate,
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
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
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

export const getForumResponses = async (userID: number) => {
	try {
		const response = await fetch(`${API_URL}/forums-responses/${userID}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al obtener las respuestas");

		const {data} = await response.json();
		return data;
	} catch (error) {
		console.error("Error obteniendo respuestas:", error);
		return [];
	}
};

export const markCommentsAsRead = async (userID: number, forumID: number) => {
	try {
		console.log("Marking comments as read for user:", userID, "and forum:", forumID);
		const response = await fetch(`${API_URL}/forum-responses/${userID}/${forumID}`, {
			headers: {
				"Authorization": `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al marcar comentarios como leídos");

		const {data} = await response.json();
		return data;
	} catch (error) {
		console.error("Error marcando comentarios como leídos:", error);
		return null;
	}
}

// FORUM
export const getForum = async (forumID: number) => {
	try {
		const response = await fetch(`${API_URL}/forums/${forumID}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al obtener el foro");

		return await response.json();
	} catch (error) {
		console.error("Error obteniendo foro:", error);
		return { forum: { id: "", title: "", text: "" } };
	}
};

export const getForums = async () => {
	try {
		const response = await fetch(`${API_URL}/forums`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al obtener los foros");

		const data = await response.json();

		return data;
	} catch (error) {
		console.error("Error obteniendo foros apits:", error);
		return [];
	}
};

export const createForum = async (
	userID: number,
	title: string,
	text: string
) => {
	try {
		const response = await fetch(`${API_URL}/forums`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id: userID, title: title, text: text }),
		});
		if (!response.ok) throw new Error("Error al crear el foro");

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error creando foro:", error);
		return [];
	}
};

export const updateForum = async (
	forumID: number,
	title: string,
	text: string
) => {
	try {
		const response = await fetch(`${API_URL}/forums/${forumID}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title, text }),
		});

		if (!response.ok) throw new Error("Error al actualizar el foro");

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Error actualizando foro:", error);
		return null;
	}
};

export const deleteForum = async (forumID: number) => {
	try {
		const response = await fetch(`${API_URL}/forums/${forumID}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ forum_id: forumID }),
		});

		if (!response.ok) throw new Error("Error al eliminar el foro");
		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Error eliminando foro:", error);
		return null;
	}
};

export const createComment = async (
	userID: number,
	forumID: number,
	comment: string
) => {
	try {
		const response = await fetch(`${API_URL}/comments`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id: userID,
				forum_id: forumID,
				text: comment,
			}),
		});
		if (!response.ok) throw new Error("Error al crear el comentario");

		const data = await response.json();

		return data;
	} catch (error) {
		console.error("Error creando comentario:", error);
		return [];
	}
};

export const deleteComment = async (commentID: string) => {
	try {
		const response = await fetch(`${API_URL}/comments/${commentID}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ comment_id: commentID }),
		});
		if (!response.ok) throw new Error("Error al eliminar el comentario");
		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error("Error eliminando comentario:", error);
		return null;
	}
};

export const getForumComments = async (forumID: number) => {
	try {
		const response = await fetch(`${API_URL}/forums/${forumID}/comments`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) throw new Error("Error al obtener los comentarios");

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error obteniendo comentarios:", error);
		return [];
	}
};

// BABY
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

// BABY ALBUM
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

		// Validar y formatear la hora
		const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
		const formattedTime = timeRegex.test(time) ? time : null;

		// Crear objeto de datos
		const requestBody = {
			user_id: userID,
			event_title: eventTitle,
			date: date,
			time: formattedTime, // Enviar null si no es válido
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
		throw error; // Propagar el error para manejar en el componente
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

// CONTENT LIBRARY
export const createMagazine = async (
    title: string,
    magazinePath: string,
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
            body: JSON.stringify({title, magazine_path: magazinePath}),
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
