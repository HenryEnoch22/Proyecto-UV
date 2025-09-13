import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { TrashIcon, UserCircleIcon } from "react-native-heroicons/solid";
import { API_URL } from "@/constants/env";

interface CommentItemProps {
	comment: {
		id: string;
		text: string;
		owner: {
			id: number;
			name: string;
			last_name: string;
			mother_last_name: string;
		};
	};
	currentUserId?: number;
	onDelete: (commentId: string) => void;
}

export const CommentItem = ({comment, currentUserId, onDelete}: CommentItemProps) => {
	const LOCAL_API_URL = API_URL?.split("/api")[0];
	const isOwner = String(currentUserId) === String(comment.owner.id);

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.header}>
					{comment.owner.profile_photo_path ? (
						<Image
							source={{ uri: `${LOCAL_API_URL + '/storage/' + comment.owner.profile_photo_path}` }}
							style={{ width: 36, height: 36, borderRadius: 24 }}
						/>
					) : (
						<UserCircleIcon size={36} color="#000" />
					)}
					<Text style={styles.name}>
						{`${comment.owner.name} ${comment.owner.last_name} ${comment.owner.mother_last_name}:`}
					</Text>
					{isOwner && (
						<Pressable
							onPress={() => onDelete(comment.id)}
							style={styles.deleteButton}
						>
							<TrashIcon size={16} color="#e11d48" />
						</Pressable>
					)}
				</View>
				<Text style={styles.text}>{comment.text}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e5e5",
	},
	content: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 4,
		width: "100%",
	},
	name: {
		fontWeight: "bold",
	},
	text: {
		fontSize: 15,
		lineHeight: 20,
	},
	deleteButton: {
		marginLeft: "auto",
		padding: 4,
	},
});