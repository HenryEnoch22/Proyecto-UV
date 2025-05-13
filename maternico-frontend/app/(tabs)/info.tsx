import { getHealthCenters, getMagazines, getProfile, getVideos } from "@/services/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	Pressable,
	StyleSheet,
	ScrollView,
	Linking,
} from "react-native";
import {
	ArrowLongLeftIcon,
	ChevronRightIcon,
} from "react-native-heroicons/solid";
import { useAuth } from "@/contexts/AuthContext";
import {Loader} from "@/components";
import { CategoryMagazineCard, HealthCenterCard } from "@/components";

const Info = () => {
	const [dataHealthCenter, setDataHealthCenter] = useState([]);
	const [dataMagazine, setDataMagazine] = useState([]);
	const [dataVideo, setDataVideo] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { user, setUser } = useAuth();

	useEffect(() => {
		setError(null);
		const fetchUser = async () => {
			try {
				const userData = await getProfile();

				if (userData?.user) {
					const { user } = userData;
					setUser({...user});
				}
			} catch (error) {
				console.error("Error al cargar el usuario:", error);
			}
		};
		fetchUser();
	}, []);
	
	interface Video {
		id: number;
		title: string;
		video_path: string;
	}
	
	const videoCover = require("../../assets/images/logo/MaternicoLogo.png")

	// Para revistas
	interface MagazineCategory {
		id: number;
		title: string;
		magazine_path: string;
	}

	const magazineCover = require("../../assets/images/portada.png")
	interface HealthCenter {
		id: number;
		name: string;
		address: string;
        city: string;
        state: string;
		phone_number: string;
	}

	// Para revistas
	useEffect(() => {
		setError(null);
		const fetchMagazines = async () => {
			try {
				setLoading(true);
				const magazinesData = await getMagazines();
				setDataMagazine(magazinesData);
			} catch (error) {
				setError("Error al cargar las revistas");
				console.error("Error cargando revistas:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchMagazines();
	}, []);

	// Para videos
	useEffect(() => {
		setError(null);
		const fetchVideos = async () => {
			try {
				setLoading(true);
				const videosData = await getVideos();
				setDataVideo(videosData);
			} catch (error) {
				setError("Error al cargar los videos");
				console.error("Error cargando videos:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchVideos();
	}, []);

	useEffect(() => {
		setError(null);
		const fetchHealthCenters = async () => {
			try {
				setLoading(true);
				const healthCenterData = await getHealthCenters();
				if (healthCenterData.data) {
					setDataHealthCenter(healthCenterData.data);
				} else {
					setError("Centros de salud no encontrados");
				}
			} catch (err) {
				setError("Error al cargar los centros de salud");
			} finally {
				setLoading(false);
			}
		};

		fetchHealthCenters();
		}, []);

	const router = useRouter();

	const openDocument = (url: string) => {
		setError(null);
		if (user?.is_premium) {
			Linking.openURL(url).catch((err) => {
				console.error("Error al abrir el enlace:", err);
				setError("No se pudo abrir el documento");
			});
		} else {
			setError("Debes ser usuario premium para acceder a este contenido");
		}
	};

	if (loading) {
		return (
			<Loader />
		);
	}

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Pressable onPress={() => router.back()}>
						<ArrowLongLeftIcon size={24} color="#FEFEFE" />
					</Pressable>
					<Text style={styles.title}>Sección informativa</Text>
				</View>

				{error && (
					<View style={{ padding: 20 }}>
						<Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
						<Pressable
							onPress={() => {
								setError(null);
								router.push("/premium/card-data");
							}}
							style={{
								backgroundColor: "#F392BE",
								padding: 10,
								borderRadius: 8,
								marginTop: 10,
							}}
						>
							<Text style={{ color: "#fff", textAlign: "center" }}>
								Convertirme en premium
							</Text>
						</Pressable>
					</View>
				)}

				<View style={styles.contentWrapper}>
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Revistas</Text>
							<ChevronRightIcon size={24} color="#F392BE" />
						</View>
						<View style={styles.listContainer}>
							<FlatList
								data={dataMagazine}
								horizontal
								showsHorizontalScrollIndicator={false}
								renderItem={({ item }) => (
									<Pressable
										onPress={() => openDocument(item.magazine_path)}
										style={styles.cardPressable}
									>
										<CategoryMagazineCard
											category={item.title}
											cover={magazineCover}
											key={item.id}
										/>
									</Pressable>
								)}
								keyExtractor={(item) => item.id.toString()}
								contentContainerStyle={styles.listContent}
							/>
						</View>
					</View>

					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Videos</Text>
							<ChevronRightIcon size={24} color="#F392BE" />
						</View>
						<View style={styles.listContainer}>
							<FlatList
								data={dataVideo}
								horizontal
								showsHorizontalScrollIndicator={false}
								renderItem={({ item }) => (
									<Pressable onPress={() => openDocument(item.video_path)}
										style={styles.cardPressable}>
										<CategoryMagazineCard
											category={item.title}
											cover={videoCover}
											key={item.id}
										/>
									</Pressable>
								)}
								keyExtractor={(item) => item.id.toString()}
								contentContainerStyle={styles.listContent}
							/>
						</View>
					</View>

					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Centros de salud</Text>
							<ChevronRightIcon size={24} color="#F392BE" />
						</View>
						<View style={[styles.listContainer, { height: "20%" }]}>
							<FlatList
								data={dataHealthCenter}
								horizontal
								showsHorizontalScrollIndicator={false}
								renderItem={({ item }) => (
									<HealthCenterCard {...item} />
								)}
								keyExtractor={(item) => item.id}
								contentContainerStyle={styles.listContent}
							/>
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

// TODO: refactorizar esta cochinada que estira las cards bien feo
const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		minHeight: "90%",
	},
	container: {
		flex: 1,
		backgroundColor: "#FEFEFE",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
		backgroundColor: "#F392BE",
		paddingTop: "10%",
		paddingBottom: "5%",
		paddingHorizontal: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	title: {
		fontSize: 24,
		color: "#FEFEFE",
		fontWeight: "700",
	},
	contentWrapper: {
		flex: 1,
		justifyContent: "space-evenly",
		paddingVertical: 20,
	},
	section: {
		flex: 1,
		marginVertical: 15,
		paddingHorizontal: 15,
		maxHeight: "30%",
		minHeight: 180,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 15,
	},
	sectionTitle: {
		fontSize: 20,
		color: "#343434",
		fontWeight: "500",
	},
	listContainer: {
		flex: 1,
		maxHeight: 180,
	},
	listContent: {
		paddingHorizontal: 8,
	},
	cardPressable: {
		marginHorizontal: 8,
	},
	healthCenterCard: {
		backgroundColor: "#F392BE",
		padding: 15,
		marginHorizontal: 8,
		borderRadius: 12,
		width: 160,
		justifyContent: "center",
	},
	healthCenterTitle: {
		color: "#FFF",
		fontWeight: "600",
		fontSize: 16,
	},
	healthCenterLocation: {
		color: "#FFF",
		fontSize: 14,
		opacity: 0.9,
		marginTop: 5,
	},
});

export default Info;
