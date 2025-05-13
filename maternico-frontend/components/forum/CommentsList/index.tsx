import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { CommentItem } from "@/components";

interface CommentsListProps {
	comments: Array<{
		id: string;
		text: string;
		owner: {
			id: number;
			name: string;
			last_name: string;
			mother_last_name: string;
		};
	}>;
	currentUserId?: number;
	onDeleteComment: (commentId: string) => void;
}

export const CommentsList = ({
	comments,
	currentUserId,
	onDeleteComment,
}: CommentsListProps) => {
	if (comments.length === 0) {
		return <Text style={styles.noComments}>Sé el primero en responder</Text>;
	}

	return (
		<View>
            <Text style={styles.commentsTitle}>Respuestas</Text>
			{comments.map((comment) => (
				<Pressable 
					key={comment.id}
					onPress={() => alert(`Comment ID: ${comment.id}`)}>
					<CommentItem
						comment={comment}
						currentUserId={currentUserId}
						onDelete={onDeleteComment}
					/>
				</Pressable>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	commentsTitle: {
		fontSize: 18,
		fontWeight: "bold",
		paddingVertical: 16,
	},
	noComments: {
		color: "#657786",
		textAlign: "center",
		marginTop: 16,
	},
});
