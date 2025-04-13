import {
	Dimensions,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { PencilSquareIcon, TrashIcon } from "react-native-heroicons/solid";

interface ForumOptionsMenuProps {
	visible: boolean;
	position: { top: number; right: number };
	onClose: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

const ForumOptionsMenu = ({
	visible,
	position,
	onClose,
	onEdit,
	onDelete,
}: ForumOptionsMenuProps) => (
	<Modal
		animationType="fade"
		transparent={true}
		visible={visible}
		onRequestClose={onClose}
	>
		<Pressable style={styles.dropdownOverlay} onPress={onClose}>
			<View
				style={[
					styles.dropdownMenu,
					{
						position: "absolute",
						top: position.top,
						right: position.right,
					},
				]}
			>
				<Pressable
					style={styles.optionItem}
					onPress={() => {
						onClose();
						onEdit();
					}}
				>
					<PencilSquareIcon size={20} color="#F392BE" />
					<Text style={styles.optionText}>Editar foro</Text>
				</Pressable>

				<View style={styles.optionDivider} />

				<Pressable
					style={styles.optionItem}
					onPress={() => {
						onClose();
						onDelete();
					}}
				>
					<TrashIcon size={20} color="#e11d48" />
					<Text style={[styles.optionText, styles.deleteText]}>
						Eliminar foro
					</Text>
				</Pressable>
			</View>
		</Pressable>
	</Modal>
);

const styles = StyleSheet.create({
	dropdownOverlay: {
		flex: 1,
		backgroundColor: "transparent",
	},
	dropdownMenu: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 4,
		width: 180,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 10,
		elevation: 5,
	},
	optionItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		borderRadius: 4,
	},
	optionText: {
		marginLeft: 12,
		fontSize: 16,
	},
	deleteText: {
		color: "#e11d48",
	},
	optionDivider: {
		height: 1,
		backgroundColor: "#e5e5e5",
	},
});

export default ForumOptionsMenu;
