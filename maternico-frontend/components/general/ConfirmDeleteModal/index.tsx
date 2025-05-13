import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

interface ConfirmDeleteModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmDeleteModal = ({
    visible,
    onClose,
    onConfirm,
    title = "¿Estás seguro de eliminar este elemento?",
    description = "Esta acción no se puede deshacer.",
    confirmText = "Eliminar",
    cancelText = "Cancelar"
}: ConfirmDeleteModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalDescription}>{description}</Text>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>{cancelText}</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.confirmButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.buttonText}>{confirmText}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	modalDescription: {
		fontSize: 16,
		color: "#666",
		marginBottom: 20,
		textAlign: "center",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	button: {
		flex: 1,
		padding: 10,
		borderRadius: 5,
		marginHorizontal: 5,
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#ccc",
	},
	confirmButton: {
		backgroundColor: "#e74c3c",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 15,
    },
});
