import { useState, useCallback } from "react";
import {
	getForum,
	getForumComments,
	updateForum,
	deleteForum,
} from "@/services/api";

interface Owner {
    id: number;
    name: string;
    last_name: string;
    mother_last_name: string;
}

interface ForumData {
	id: number;
	title: string;
	text: string;
	owner: Owner;
	comments: Comment[];
}

export const useForum = (forumId: number) => {
	const [forum, setForum] = useState<ForumData | null>(null);
	const [comments, setComments] = useState<Comment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchForum = useCallback(async () => {
		try {
			const forumResponse = await getForum(forumId);
			if (forumResponse.data) {
				setForum(forumResponse.data);
				const commentsResponse = await getForumComments(forumResponse.data.id);
				setComments(commentsResponse.data || []);
			}
		} catch (err) {
			setError("Error al cargar el foro");
		} finally {
			setLoading(false);
		}
	}, [forumId]);

	const updateForumData = async (title: string, text: string) => {
		try {
			await updateForum(forumId, title, text);
			await fetchForum();
		} catch (err) {
			setError("Error al actualizar el foro");
		}
	};

	const deleteForumData = async () => {
		try {
			await deleteForum(forumId);
		} catch (err) {
			setError("Error al eliminar el foro");
		}
	};

	return {
		forum,
		comments,
		loading,
		error,
		fetchForum,
		updateForumData,
		deleteForumData,
		setComments,
	};
};
