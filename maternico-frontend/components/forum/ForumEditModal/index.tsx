import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { FormTextField } from "@/components";

interface ForumEditModalProps {
	visible: boolean;
	onClose: () => void;
	editedTitle: string;
	editedText: string;
	onTitleChange: (text: string) => void;
	onTextChange: (text: string) => void;
	onSave: () => void;
	error?: string;
}

export const ForumEditModal = ({
	visible,
	onClose,
	editedTitle,
	editedText,
	onTitleChange,
	onTextChange,
	onSave,
	error,
}: ForumEditModalProps) => (
	<Modal
		animationType="slide"
		transparent={true}
		visible={visible}
		onRequestClose={onClose}
	>
		<View style={styles.modalOverlay}>
			<View style={styles.modalContent}>
				<Text style={styles.modalTitle}>Editar Foro</Text>

				<FormTextField
					label="Título"
					value={editedTitle}
					onChangeText={onTitleChange}
					style={styles.modalInput}
				/>

				<FormTextField
					label="Contenido"
					multiline
					numberOfLines={4}
					value={editedText}
					onChangeText={onTextChange}
					style={[styles.modalInput, styles.textArea]}
				/>

				{error && <Text style={styles.errorText}>{error}</Text>}

				<View style={styles.modalButtons}>
					<Pressable onPress={onSave} style={styles.saveButton}>
						<Text>Guardar</Text>
					</Pressable>
					<Pressable onPress={onClose} style={styles.cancelButton}>
						<Text style={styles.cancelText}>Cancelar</Text>
					</Pressable>
				</View>
			</View>
		</View>
	</Modal>
);

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 24,
		width: "90%",
		maxWidth: 500,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#1f2937",
		marginBottom: 16,
		textAlign: "center",
	},
	modalInput: {
		backgroundColor: "#f8fafc",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		marginBottom: 16,
		marginTop: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	textArea: {
		minHeight: 100,
		textAlignVertical: "top",
	},
	modalButtons: {
		flexDirection: "row",
		gap: 12,
		marginTop: 8,
	},
	saveButton: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: "#f392be",
	},
	cancelButton: {
		backgroundColor: "#DA4D3C",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
	},
	cancelText: {
		color: "#fefefe",
		fontWeight: "bold",
	},
	errorText: {
		color: "red",
		marginHorizontal: 16,
		marginTop: 8,
		fontSize: 14,
	},
});
