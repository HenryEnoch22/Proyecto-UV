import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Modal,
	StyleSheet,
	Pressable,
	TextInput,
} from "react-native";
import { XCircleIcon } from "react-native-heroicons/solid";
import * as ImagePicker from "expo-image-picker";
import { DatePicker, PrimaryButton } from "@/components";

interface EventModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (data: {
		event_title: string;
		description?: string;
		date: string;
		photo_path: ImagePicker.ImagePickerAsset;
	}) => void;
}

export const AlbumEventModal = ({
	visible,
	onClose,
	onSubmit,
}: EventModalProps) => {
	const [eventTitle, setEventTitle] = useState("");
	const [description, setDescription] = useState("");
	const [selectedDate, setSelectedDate] = useState("");
	const [showCalendar, setShowCalendar] = useState(false);

	const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
	const [imagePickerText, setImagePickerText] =
		useState<string>("Seleccionar imagen");

	// Función para obtener la fecha actual en formato YYYY-MM-DD en horario de México
	const getTodayInMexico = (): string => {
		const now = new Date();
		
		// México tiene diferentes zonas horarias, pero la mayoría usa UTC-6 o UTC-5
		// Para asegurarnos, usamos toLocaleDateString con la zona horaria de México
		const options: Intl.DateTimeFormatOptions = {
			timeZone: 'America/Mexico_City',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		};
		
		const formatter = new Intl.DateTimeFormat('es-MX', options);
		const parts = formatter.formatToParts(now);
		
		const year = parts.find(part => part.type === 'year')?.value;
		const month = parts.find(part => part.type === 'month')?.value;
		const day = parts.find(part => part.type === 'day')?.value;
		
		return `${year}-${month}-${day}`;
	};

	// Efecto para establecer la fecha actual cuando el modal se abre
	useEffect(() => {
		if (visible) {
			const today = getTodayInMexico();
			setSelectedDate(today);
		}
	}, [visible]);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled && result.assets[0]) {
			setImage(result.assets[0]);
			setImagePickerText("Imagen seleccionada");
		} else {
			setImage(null);
			setImagePickerText("Seleccionar imagen");
		}
	};

	const handleSubmit = () => {
		if (!eventTitle.trim() || !selectedDate) {
			alert("Campos requeridos faltantes");
			return;
		}

		if (!image) {
			alert("¡Selecciona una imagen primero!");
			return;
		}

		onSubmit({
			event_title: eventTitle,
			description: description.trim(),
			date: selectedDate,
			photo_path: image,
		});

		// No resetear la fecha aquí para mantenerla cuando se reabra el modal
		setEventTitle("");
		setDescription("");
		setImage(null);
		setImagePickerText("Seleccionar imagen");

		onClose();
	};

	const handleClose = () => {
		// Al cerrar, mantenemos la fecha actual para la próxima vez que se abra
		onClose();
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={handleClose}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Pressable style={styles.closeIcon} onPress={handleClose}>
						<XCircleIcon size={24} color="#F392BE" />
					</Pressable>

					<Text style={styles.modalTitle}>Nuevo Evento</Text>

					<View style={styles.formContainer}>
						<TextInput
							style={styles.input}
							placeholder="Título del evento*"
							value={eventTitle}
							onChangeText={setEventTitle}
							autoFocus
						/>

						<TextInput
							style={[styles.input, { height: 80 }]}
							placeholder="Descripción"
							value={description}
							onChangeText={setDescription}
							multiline
						/>

						<DatePicker
							value={selectedDate ? new Date(selectedDate) : new Date()}
							onChange={(date) => {
								setSelectedDate(date.toISOString().split("T")[0]);
								setShowCalendar(false);
							}}
						/>

						<Pressable style={styles.imagePicker} onPress={pickImage}>
							<Text>{imagePickerText}</Text>
						</Pressable>
					</View>

					<PrimaryButton
						text="Crear Evento"
						onPress={handleSubmit}
					></PrimaryButton>
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
		backgroundColor: "#FFF",
		width: "90%",
		borderRadius: 16,
		padding: 24,
		maxWidth: 400,
	},
	modalTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: "#343434",
		marginBottom: 20,
		textAlign: "center",
	},
	closeIcon: {
		position: "absolute",
		top: 16,
		right: 16,
		zIndex: 1,
	},
	formContainer: {
		marginBottom: 16,
	},
	input: {
		height: 48,
		borderColor: "#E2E8F0",
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		backgroundColor: "#F8FAFC",
		fontSize: 16,
		color: "#343434",
	},
	dateInput: {
		height: 48,
		borderColor: "#E2E8F0",
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		justifyContent: "center",
		backgroundColor: "#F8FAFC",
	},
	dateText: {
		color: "#343434",
		fontSize: 16,
	},
	placeholderText: {
		color: "#888",
		fontSize: 16,
	},
	actionButton: {
		backgroundColor: "#F392BE",
		borderRadius: 8,
		paddingVertical: 14,
		marginTop: 16,
	},
	actionButtonText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "600",
		textAlign: "center",
	},
	calendar: {
		marginBottom: 16,
		borderRadius: 12,
		overflow: "hidden",
	},
	imagePicker: {
		height: 48,
		borderColor: "#E2E8F0",
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		justifyContent: "center",
		backgroundColor: "#F8FAFC",
		alignItems: "center",
	},
});