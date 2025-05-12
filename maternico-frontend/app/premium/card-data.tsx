import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
	CreditCardIcon,
	LockClosedIcon,
	CpuChipIcon,
	CalendarDaysIcon,
	SignalIcon,
} from "react-native-heroicons/outline";
import { ChevronRightIcon } from "react-native-heroicons/solid";
import { useEffect, useState } from "react";
import { becomePremium, getProfile } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

const CardData = () => {
	const [cardNumber, setCardNumber] = useState("");
	const [expiry, setExpiry] = useState("");
	const { user, setUser } = useAuth();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await getProfile();

				if (userData?.user) {
					const { user } = userData;
					setUser({ ...user });
				}
			} catch (error) {
				console.error("Error al cargar el usuario:", error);
			}
		};
		fetchUser();
	}, []);

	const formatCardNumber = (input: string) => {
		const numeric = input.replace(/[^0-9]/g, "").slice(0, 16);
		let formatted = "";

		for (let i = 0; i < numeric.length; i += 4) {
			formatted += numeric.slice(i, i + 4);
			if (i + 4 < numeric.length) formatted += " - ";
		}

		return formatted;
	};

	const getMaskedCardDisplay = (input: string) => {
		const numeric = input.replace(/[^0-9]/g, "").slice(0, 16);
		const lastFour = numeric.slice(-4).padStart(4, "•");
		return input.length >= 13 ? `•••• - •••• - •••• - ${lastFour}` : '•••• - •••• - •••• - 1234';
	};

	const formatExpiry = (input: string) => {
		const numeric = input.replace(/[^0-9]/g, "").slice(0, 4);
		if (numeric.length > 2) {
			return `${numeric.slice(0, 2)}/${numeric.slice(2, 4)}`;
		}
		return numeric;
	};

	const handleSubmit = () => {
		becomePremium(Number(user?.id))
			.then((response) => {
                setUser({...response});
				router.push("/(tabs)/home");
			})
			.catch((error) => {
				console.error("Error al procesar la tarjeta:", error);
			});
	};

	return (
		<View style={styles.container}>
			<LinearGradient
				colors={["#f392be", "#f4d18a"]}
				style={styles.card}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
			>
				<View style={styles.cardHeader}>
					<CpuChipIcon size={40} color="rgba(255,255,255,0.8)" />
					<SignalIcon size={40} color="rgba(255,255,255,0.8)" />
				</View>

				<Text style={styles.cardNumber}>
					{getMaskedCardDisplay(cardNumber)}
				</Text>

				<View style={styles.cardDetails}>
					<View>
						<Text style={styles.cardLabel}>Dueño</Text>
						<Text style={styles.cardHolder}>MÓNICA GARCÍA</Text>
					</View>
					<View>
						<Text style={styles.cardLabel}>Fecha de expiración</Text>
						<Text style={styles.cardExpiry}>09/27</Text>
					</View>
				</View>

				<Text style={styles.bankLogo}>VISA</Text>
			</LinearGradient>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel}>Número de la tarjeta</Text>
				<TextInput
					style={styles.input}
					placeholder="1234 - 5678 - 9012 - 3456"
					keyboardType="numeric"
					maxLength={25}
					value={formatCardNumber(cardNumber)}
					onChangeText={(text) => setCardNumber(text.replace(/[^0-9]/g, ""))}
				/>
				<CreditCardIcon size={24} style={styles.inputIcon} color="#999" />
			</View>

			<View style={styles.row}>
				<View style={[styles.inputContainer, { flex: 2, marginRight: 15 }]}>
					<Text style={styles.inputLabel}>Fecha de expiración</Text>
					<TextInput
						style={styles.input}
						placeholder="MM / YY"
						keyboardType="numeric"
						maxLength={5}
						value={formatExpiry(expiry)}
						onChangeText={(text) => setExpiry(text.replace(/[^0-9]/g, ""))}
					/>
					<CalendarDaysIcon size={24} style={styles.inputIcon} color="#999" />
				</View>

				<View style={[styles.inputContainer, { flex: 1 }]}>
					<Text style={styles.inputLabel}>CVV</Text>
					<TextInput
						style={styles.input}
						placeholder="•••"
						keyboardType="numeric"
						maxLength={4}
						secureTextEntry
					/>
					<LockClosedIcon size={24} style={styles.inputIcon} color="#999" />
				</View>
			</View>

			<Pressable style={styles.button} onPress={handleSubmit}>
				<Text style={styles.buttonText}>Pagar $129.00MXN</Text>
				<ChevronRightIcon size={20} color="#FEFEFE" style={styles.buttonIcon} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		padding: 25,
	},
	card: {
		height: 220,
		borderRadius: 20,
		padding: 25,
		marginBottom: 35,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.2,
		shadowRadius: 20,
		elevation: 10,
		overflow: "hidden",
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 30,
	},
	cardNumber: {
		color: "white",
		fontSize: 20,
		marginBottom: 25,
		fontFamily: "Courier New",
		fontWeight: "600",
	},
	cardDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
	},
	cardLabel: {
		color: "rgba(255,255,255,0.6)",
		fontSize: 12,
		marginBottom: 4,
	},
	cardHolder: {
		color: "white",
		fontSize: 16,
		letterSpacing: 0.5,
		fontWeight: "500",
	},
	cardExpiry: {
		color: "white",
		fontSize: 16,
		fontWeight: "500",
	},
	bankLogo: {
		position: "absolute",
		right: 25,
		bottom: 25,
		color: "white",
		fontSize: 24,
		fontWeight: "bold",
		fontStyle: "italic",
	},
	inputContainer: {
		marginBottom: 20,
		position: "relative",
	},
	inputLabel: {
		color: "#666",
		fontSize: 14,
		marginBottom: 8,
		fontWeight: "500",
	},
	input: {
		backgroundColor: "white",
		borderColor: "#e0e0e0",
		borderWidth: 1.5,
		borderRadius: 12,
		padding: 16,
		paddingLeft: 50,
		fontSize: 16,
		fontWeight: "500",
		color: "#333",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 6,
		elevation: 2,
	},
	inputIcon: {
		position: "absolute",
		left: 16,
		top: 45,
		zIndex: 1,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	button: {
		backgroundColor: "#F392BE",
		padding: 18,
		borderRadius: 14,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
	},
	buttonText: {
		color: "#FEFEFE",
		fontSize: 18,
		fontWeight: "600",
		marginRight: 10,
	},
	buttonIcon: {
		marginTop: 2,
	},
});

export default CardData;
