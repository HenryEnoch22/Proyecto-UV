import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Pressable,
	Image,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLongLeftIcon, CameraIcon } from "react-native-heroicons/solid";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { updateUser } from "@/services/api";
import { router } from "expo-router";
import { FormTextField, PrimaryButton } from "@/components";
import { API_URL } from "@/constants/env";

const EditProfileScreen = () => {
	const LOCAL_API_URL = API_URL?.split("/api")[0];
	const { user, setUser } = useAuth();
	const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
	const [formData, setFormData] = useState({
		id: user?.id || "",
		name: user?.name || "",
		last_name: user?.last_name || "",
		mother_last_name: user?.mother_last_name || "",
		email: user?.email || "",
		password: "",
		profile_photo: user?.profile_photo || "",
	});

	useEffect(() => {
		if (user) {
			setFormData({
				id: user.id,
				name: user.name,
				last_name: user.last_name,
				mother_last_name: user.mother_last_name,
				email: user.email,
				password: "",
				profile_photo: user.profile_photo,
			});
		}
	}, [user]);

	const handleImagePicker = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setSelectedImage(result.assets[0]);
		}
	};

	const handleSubmit = async () => {
		if (!user?.id) return;

		try {
			// Llamamos a updateUser pasándole la URI (o URL remota si no cambió)
			const response = await updateUser(
				String(formData.id),
				formData.name,
				formData.last_name,
				formData.mother_last_name,
				formData.email,
				formData.password,
				selectedImage
			);
			if (response?.success) {
				setUser(response.data);
				router.back();
			} else {
				alert("Error al actualizar perfil");
			}
		} catch (e) {
			console.error("Error al actualizar perfil:", e);
			alert("Error al actualizar perfil");
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<ArrowLongLeftIcon size={24} color="#FEFEFE" />
				</Pressable>
				<Text style={styles.title}>Editar perfil</Text>
			</View>

			<View style={styles.formContainer}>
				<Text style={styles.sectionTitle}>Foto de perfil</Text>
				<Pressable onPress={handleImagePicker} style={styles.imageContainer}>
					<Image source={{
						uri: selectedImage
						? selectedImage.uri
						: user?.profile_photo_path
						? `${LOCAL_API_URL + '/storage/' + user.profile_photo_path}`
						: undefined
					}} style={styles.profileImage} />
					<View style={styles.cameraIcon}>
						<CameraIcon size={20} color="#FEFEFE" />
					</View>
				</Pressable>
			</View>

			<View style={styles.formContainer}>
				<Text style={styles.sectionTitle}>Datos personales</Text>

				<FormTextField
					label="Nombre(s)"
					placeholder="Nombre(s)"
					value={formData.name}
					onChangeText={(text: string) =>
						setFormData({ ...formData, name: text })
					}
					style={styles.input}
					errors={[]}
				/>

				<FormTextField
					label="Apellido paterno"
					placeholder="Apellido paterno"
					value={formData.last_name}
					onChangeText={(text: string) =>
						setFormData({ ...formData, last_name: text })
					}
					style={styles.input}
					errors={[]}
				/>

				<FormTextField
					label="Apellido materno"
					placeholder="Apellido materno"
					value={formData.mother_last_name}
					onChangeText={(text: string) =>
						setFormData({ ...formData, mother_last_name: text })
					}
					style={styles.input}
					errors={[]}
				/>

				<FormTextField
					label="Correo electrónico"
					placeholder="Correo electrónico"
					value={formData.email}
					onChangeText={(text: string) =>
						setFormData({ ...formData, email: text })
					}
					keyboardType="email-address"
					style={styles.input}
					errors={[]}
				/>

				<PrimaryButton
					text="Guardar cambios"
					onPress={handleSubmit}
					style={{ marginTop: 24 }}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FEFEFE",
	},
	header: {
		flexDirection: "row",
		justifyContent: "flex-start",
		gap: 16,
		alignItems: "center",
		backgroundColor: "#F392BE",
		paddingTop: "10%",
		paddingBottom: 16,
		paddingHorizontal: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	backButton: {
		padding: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		color: "#FEFEFE",
	},
	saveButton: {
		padding: 8,
	},
	formContainer: {
		padding: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#F392BE",
		marginVertical: 16,
	},
	input: {
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: 12,
		padding: 16,
		fontSize: 16,
		backgroundColor: "#F8FAFC",
		marginBottom: 12,
	},
	profileImage: {
		width: 120,
		height: 120,
		borderRadius: 60,
		alignSelf: "center",
		marginBottom: 20,
	},
	imageContainer: {
		position: "relative",
		alignSelf: "center",
	},
	cameraIcon: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: "#f283b5",
		borderRadius: 20,
		padding: 8,
	},
});

export default EditProfileScreen;
