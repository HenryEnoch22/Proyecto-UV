import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Pressable,
	FlatList,
    ActivityIndicator
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import {
	getBabyByMother,
	getProfile,
} from "@/services/api";
import {
	BellIcon,
	UserCircleIcon,
	HeartIcon,
} from "react-native-heroicons/solid";
import BabyCard from "../../components/BabyCard";
import ResponseCard from "../../components/ResponseCard";
import EventCard from "../../components/EventCard";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

interface Event {
	id: number;
	name: string;
	leftDays: number;
	typeEvent: "vaccine" | "appointment" | "birthday";
}

const data: Event[] = [
	{ id: 1, name: "No tienes nuevos eventos", leftDays: 0, typeEvent: "vaccine" },
	// { id: 2, name: "Cita médica", leftDays: 8, typeEvent: "appointment" },
	// { id: 3, name: "Cita médica", leftDays: 11, typeEvent: "appointment" },
	// { id: 4, name: "Cita médica", leftDays: 18, typeEvent: "appointment" },
	// { id: 5, name: "Cumpleaños", leftDays: 83, typeEvent: "birthday" },
];

const CardNoBaby = () => {
	const router = useRouter();

	return (
		<View style={styles.cardContainer}>
			<View style={styles.cardHeader}>
				<HeartIcon size={30} color="#f392be" style={styles.icon} />
				<Text style={styles.title}>Registra a tu bebé!</Text>
			</View>
			<Text style={styles.description}>
				Completa su registro para acceder a todos los beneficios y seguimiento
				de su crecimiento
			</Text>
			<Pressable
				onPress={() => router.push("/baby/register")}
				style={styles.button}
			>
				<Text style={styles.cardText}>Registrar ahora!</Text>
			</Pressable>
		</View>
	);
};

export default function HomeScreen() {
	const { user, setUser } = useAuth();
	interface Baby {
		user_id: number;
		id: string;
		name: string;
		birth_date: string;
		height?: string;
		weight?: string;
		blood_type?: string;
	}

	const [baby, setBaby] = useState<Baby | null>(null);
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const userData = await getProfile();

				if (userData?.user) {
					const { user } = userData;
					setUser({
						id: user.id,
						name: user.name,
						email: user.email,
						last_name: user.last_name,
						mother_last_name: user.mother_last_name,
						birth_date: user.birth_date,
						profile_photo_path: user.profile_photo_path,
					});

					const babyResponse = await getBabyByMother(user.id);
					setBaby(babyResponse);
				} else {
					setUser(null);
					setBaby(null);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				setUser(null);
				setBaby(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#f283b5" />
				<Text style={styles.loadingText}>Cargando datos...</Text>
			</View>
		);
	}

	return (
		<ScrollView>
			<View style={styles.topView}>
				<View style={styles.iconsContainer}>
					<Pressable onPress={() => router.push("/notifications")}>
						<BellIcon size="32" color="#fefefe" />
					</Pressable>
					<Pressable onPress={() => router.push("/profiles/profile")}>
						<UserCircleIcon size="32" color="#fefefe" />
					</Pressable>
				</View>
				<View style={styles.greetContainer}>
					<Text style={styles.greetTitle}>
						Hola,{" "}
						<Text style={{ fontWeight: "bold" }}>
							{user?.name || "Usuario"}!
						</Text>
					</Text>
					<Text style={styles.greetFoot}>Bienvenida</Text>
				</View>
			</View>

			<View style={styles.bottomView}>
				<View style={styles.eventsContainer}>
					<Text style={styles.sectionTitle}>Próximos Eventos</Text>
					<View style={styles.events}>
						<FlatList
							data={data}
							horizontal
							showsHorizontalScrollIndicator={false}
							renderItem={({ item }) => (
								<Pressable onPress={() => router.push("/calendar")}>
									<EventCard
										text={item.name}
										days={item.leftDays}
										typeEvent={item.typeEvent}
									/>
								</Pressable>
							)}
							keyExtractor={(item) => item.id.toString()}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Respuestas</Text>
					<Pressable onPress={() => router.push("/forum")}>
						<ResponseCard />
					</Pressable>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Tu bebé</Text>
					{baby ? (
						<Pressable onPress={() => router.push(`/baby/${baby.id}`)}>
							<BabyCard
								name={baby?.name || "Nombre no disponible"}
								birthDate={baby?.birth_date || "Fecha no disponible"}
								height={baby?.height ? parseFloat(baby.height) : 0}
								weight={baby?.weight ? parseFloat(baby.weight) : 0}
							/>
						</Pressable>
					) : (
						<CardNoBaby />
					)}
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    },
	topView: {
		backgroundColor: "#f283b5",
		color: "#fefefe",
		paddingHorizontal: 20,
		paddingVertical: 30,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		height: "30%",
		justifyContent: "flex-end",
		marginBottom: 30,
	},
	iconsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 20,
	},
	greetContainer: {
		flexDirection: "column",
	},
	greetTitle: {
		fontSize: 32,
		color: "#fefefe",
	},
	greetFoot: {
		fontSize: 20,
		fontWeight: "200",
		color: "#fefefe",
	},
	bottomView: {
		justifyContent: "space-evenly",
		paddingHorizontal: 20,
		paddingVertical: 30,
	},
	eventsContainer: {
		gap: 12,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 12,
		color: "#343434",
	},
	events: {
		marginBottom: 40,
	},
	section: {
		marginBottom: 40,
	},
	cardContainer: {
		backgroundColor: "#fefefe",
		borderRadius: 12,
		padding: 20,
		marginVertical: 10,
		shadowColor: "#676767",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderLeftColor: "#f392be",
		borderLeftWidth: 4,
		borderStyle: "solid",
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		gap: 10,
	},
	icon: {
		marginRight: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#343434",
	},
	description: {
		fontSize: 16,
		color: "#343434",
		marginBottom: 10,
	},
	button: {
		backgroundColor: "#f392be",
		width: 160,
		height: 30,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
		color: "#fefefe",
		fontSize: 16,
		fontWeight: "bold",
	},
	cardText: {
		color: "#fefefe",
		fontSize: 14,
		fontWeight: "bold",
	},
});
