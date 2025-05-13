import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Pressable,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { getBabyByMother, getLastEvents, getProfile } from "@/services/api";
import { BellIcon, UserCircleIcon } from "react-native-heroicons/solid";
import { CardNoBaby, BabyCard, ResponseCard, EventCard } from "@/components";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

interface Event {
	id: number;
	user_id: number;
	event_title: string;
	date: string;
	time: string;
	type: string;
	notifiable: string;
}

interface Baby {
	user_id: number;
	id: string;
	name: string;
	birth_date: string;
	height?: string;
	weight?: string;
	blood_type?: string;
}

export default function HomeScreen() {
	const { user, setUser } = useAuth();
	const [events, setEvents] = useState<Event[]>();
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
					setUser({ ...user });

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

	useEffect(() => {
		const fetchData = async () => {
			try {
				const eventsData = await getLastEvents(Number(user?.id));
				setEvents(eventsData);
			} catch (error) {
				console.error("Error fetching eventos:", error);
				setEvents([]);
			}
		};

		if (user) {
			fetchData();
		}
	}, [user]);

	function leftDays(eventDate: string): number {
		const today = new Date();
		const futureDate = new Date(eventDate);

		today.setHours(0, 0, 0, 0);
		futureDate.setHours(0, 0, 0, 0);

		const millisecondsDaily = 1000 * 60 * 60 * 24;
		const rest = futureDate.getTime() - today.getTime();
		const remainingDays = Math.ceil(rest / millisecondsDaily);

		return remainingDays +1;
	}

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
						{events?.length ? (
							<FlatList
								data={events}
								horizontal
								showsHorizontalScrollIndicator={false}
								renderItem={({ item }) => (
									<Pressable onPress={() => router.push("/calendar")}>
										<EventCard
											text={item.event_title}
											days={leftDays(item.date)}
											type={item.type}
										/>
									</Pressable>
								)}
								keyExtractor={(item) => item.id.toString()}
							/>
						) : (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size="large" color="#f283b5" />
								<Text style={styles.loadingText}>No hay eventos</Text>
							</View>
						)}
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
});
