import { View, Pressable, Text, StyleSheet, Linking } from "react-native";
import { TrashIcon, DocumentTextIcon } from "react-native-heroicons/outline";
import { useState } from "react";

interface FileCardProps {
	item: {
		id: number;
		title: string;
		file_path: string;
	};
	handleDelete: (id: number) => void;
}
const FileCard = ({ item, handleDelete }: FileCardProps) => {
	const [error, setError] = useState<string>("");
	
    const openDocument = (url: string) => {
		Linking.openURL(url).catch((err) => {
			console.error("Error al abrir el enlace:", err);
			setError("No se pudo abrir el documento");
		});
	};

	return (
		<View style={styles.card}>
			<Pressable
				style={styles.documentContainer}
				onPress={() => openDocument(item.file_path)}
			>
				<DocumentTextIcon size={24} color="#F392BE" />
				<Text style={styles.documentText}>Abrir documento</Text>
			</Pressable>

			<Text style={styles.videoTitle}>{item.title}</Text>

			<Pressable
				style={styles.deleteButton}
				onPress={() => handleDelete(item.id)}
			>
				<TrashIcon size={20} color="#FF4444" />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	documentContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	documentText: {
		color: "#F392BE",
		marginLeft: 8,
		fontWeight: "500",
	},
	videoTitle: {
		fontSize: 16,
		color: "#343434",
		marginBottom: 10,
	},
	deleteButton: {
		alignSelf: "flex-end",
		padding: 8,
	},
});

export default FileCard;
