import {
	View,
	StyleSheet,
	Pressable,
	Text,
	ScrollView,
	Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { registerBaby, getProfile } from "@/services/api";
import { useUser } from "@/hooks/useUser";
import { FormTextField, PrimaryButton, DatePicker } from "@/components";

export default function RegisterBaby() {
	const [formData, setFormData] = useState({
		name: "",
		lastName: "",
		motherLastName: "",
		birthDate: "",
		weight: 0.0,
		height: 0.0,
		bloodType: "",
	});
	const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

	const { user, setUser } = useAuth();
    const {user: userFetched} = useUser();
	const router = useRouter();

	const handleRegister = async () => {
		setErrors({});
		const newErrors: Record<string, string[]> = {};
		if (!formData.name) newErrors.name = ["Por favor ingresa tu nombre"];
		if (!formData.lastName)
			newErrors.last_name = ["Por favor ingresa su apellido paterno"];
		if (!formData.motherLastName)
			newErrors.motherLastName = ["Por favor ingresa su apellido materno"];
		if (!formData.birthDate)
			newErrors.birthDate = ["Por favor selecciona su fecha de nacimiento"];
		if (!formData.weight) newErrors.weight = ["Por favor ingresa su peso"];
		if (!formData.height) newErrors.height = ["Por favor ingresa su altura"];
		if (!formData.bloodType)
			newErrors.bloodType = ["Por favor ingresa su tipo de sangre"];

        if (selectedDate) {
            setFormData(prev => ({
                ...prev,
                birthDate: selectedDate.toISOString().split('T')[0]
            }));
        }

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			const newBaby = await registerBaby(
                userFetched?.id,
				formData.name,
				formData.lastName,
				formData.motherLastName,
				formData.birthDate,
				formData.weight,
				formData.height,
				formData.bloodType
			);
			console.log("Nuevo bebé registrado:", newBaby);

			const userData = await getProfile();

			if (userData?.user) {
				const { user } = userData;
				setUser({ ...user });
			}
			if(newBaby) router.push(`/baby/${newBaby.data.id}`);
		} catch (e: any) {
			if (e.response?.status === 422) {
				setErrors(e.response.data.errors);
			} else {
				Alert.alert(
					"Error de registro",
					"Hubo un problema al registrar tu bebé. Por favor intenta más tarde."
				);
			}
		}
	};

	return (
		<View style={styles.mainContainer}>
			<View style={styles.topSection}>
				<Text style={styles.greet}>¡Regístralo ahora!</Text>
				<Text style={styles.greetFoot}>
					Y accede a todos los beneficios y seguimiento de su crecimiento
				</Text>
			</View>

			<View style={styles.bottomSection}>
				<Text style={styles.title}>Registra a tu bebe</Text>

				<ScrollView
					style={styles.formContainer}
					showsVerticalScrollIndicator={false}
				>
					<FormTextField
						label="Nombre"
						value={formData.name}
						onChangeText={(text: string) =>
							setFormData((prev) => ({ ...prev, name: text }))
						}
						errors={errors.name || []}
						style={styles.customInput}
						placeholder="Alexis Yahir"
					/>

					<FormTextField
						label="Apellido Paterno"
						value={formData.lastName}
						onChangeText={(text: string) =>
							setFormData((prev) => ({ ...prev, lastName: text }))
						}
						errors={errors.last_name || []}
						style={styles.customInput}
						placeholder="Amaro"
					/>

					<FormTextField
						label="Apellido Materno"
						value={formData.motherLastName}
						onChangeText={(text: string) =>
							setFormData((prev) => ({ ...prev, motherLastName: text }))
						}
						errors={errors.motherLastName || []}
						style={styles.customInput}
						placeholder="Moreno"
					/>
					
					<DatePicker
						label="Fecha de nacimiento"
						value={selectedDate}
						onChange={(date: Date) => {
							setSelectedDate(date);
							setFormData((prev) => ({
								...prev,
								birthDate: date.toISOString().split("T")[0],
							}));
						}}
					/>

					<FormTextField
						label="Peso (kg)"
						value={formData.weight}
						onChangeText={(text: number) =>
							setFormData((prev) => ({
								...prev,
								weight: text || 0,
							}))
						}
						errors={errors.weight || []}
						style={styles.customInput}
						keyboardType="decimal"
						placeholder="4.75"
					/>

					<FormTextField
						label="Altura (cm)"
						value={formData.height}
						onChangeText={(text: number) =>
							setFormData((prev) => ({
								...prev,
								height: text || 0,
							}))
						}
						errors={errors.height || []}
						style={styles.customInput}
						keyboardType="decimal"
						placeholder="53.2"
					/>

					<FormTextField
						label="Tipo de sangre (A+, B-, etc.)"
						value={formData.bloodType}
						onChangeText={(text: string) =>
							setFormData((prev) => ({ ...prev, bloodType: text }))
						}
						errors={errors.bloodType || []}
						style={styles.customInput}
						placeholder="A+"
					/>

					<PrimaryButton onPress={handleRegister} text="Registrar bebé" />
					<View style={styles.bottomSpacing} />
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: "#F283B5",
	},
	topSection: {
		height: "25%",
		paddingHorizontal: 30,
		paddingTop: 50,
		position: "relative",
	},
	greet: {
		color: "white",
		fontWeight: "bold",
		fontSize: 44,
		marginBottom: 4,
	},
	greetFoot: {
		color: "white",
		fontSize: 16,
		marginBottom: 20,
	},
	bottomSection: {
		flex: 1,
		backgroundColor: "white",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingHorizontal: 30,
		paddingTop: 30,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 20,
	},
	formContainer: {
		flex: 1,
		paddingTop: 5,
		paddingBottom: 20,
	},
	customInput: {
		padding: 16,
		backgroundColor: "#FFFFFF",
		borderColor: "#E5E5E5",
		borderWidth: 1,
		borderRadius: 8,
		fontSize: 16,
		marginVertical: 8,
	},
	inputText: {
		fontSize: 16,
		color: "#333333",
	},
	placeholderText: {
		fontSize: 16,
		color: "#AAAAAA",
	},
	errorText: {
		color: "#FF3B30",
		fontSize: 12,
		marginTop: 4,
	},
	passwordTip: {
		fontSize: 14,
		color: "#666666",
		marginTop: 4,
		marginBottom: 24,
	},
	loginContainer: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		gap: 8,
		paddingBottom: 30,
	},
	loginText: {
		color: "#666666",
		fontSize: 16,
	},
	loginLink: {
		color: "#F283B5",
		fontWeight: "bold",
		fontSize: 16,
	},
	bottomSpacing: {
		height: 50,
	},
    calendar: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    dateInput: {
        height: 48,
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
    },
    dateText: {
        color: '#4A5568',
        fontSize: 16,
    },
});
