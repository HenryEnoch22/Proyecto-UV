import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/env";

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

export const getForumResponses = async (userID: number) => {
	try {
		const response = await fetch(`${API_URL}/forum-responses/${userID}`, {
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