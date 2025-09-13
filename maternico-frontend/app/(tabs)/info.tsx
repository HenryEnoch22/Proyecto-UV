import {
	getHealthCenters,
	getProfile,
	getVideos,
} from "@/services/api";
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
	DocumentTextIcon,
} from "react-native-heroicons/solid";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components";
import { HealthCenterCard, VideoCard } from "@/components";

interface Video {
	id: string;
	title: string;
	video_path: string;
}

interface HealthCenter {
    id: number;
    name: string;
    address: string;
    phone_number: string;
    city: string;
    state: string;
}

const Info = () => {
	const [dataHealthCenter, setDataHealthCenter] = useState<HealthCenter[]>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { user, setUser } = useAuth();
	const [dataVideo, setDataVideo] = useState<Video[]>();

	useEffect(() => {
		setError(null);
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
	const videoCover = require("../../assets/images/logo/MaternicoLogo.png")

	// Para videos
	useEffect(() => {
		setError(null);
		const fetchVideos = async () => {
			try {
				setLoading(true);
				const videosData = await getVideos();
				if (videosData) {
					setDataVideo(videosData);
				}
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
				console.error("Error al abrir el documento:", err);
				setError("No se pudo abrir el documento");
			});
		} else {
			setError("Debes ser usuario premium para acceder a este contenido");
		}
	}

	if (loading) {
		return <Loader />;
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
					{/* Sección de Revistas */}
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Revistas</Text>
						</View>
						<Pressable
							onPress={() => router.push("/magazine/index-magazines")}
							style={styles.card}
						>
							<View style={styles.cardContent}>
								<View style={styles.iconContainer}>
									<DocumentTextIcon size={24} color="#F392BE" />
								</View>
								<View style={styles.textContainer}>
									<Text style={styles.cardTitle}>Catálogo de revistas</Text>
									<Text style={styles.cardSubtitle}>
										Explora todas las revistas educativas disponibles
									</Text>
								</View>
								<ChevronRightIcon size={20} color="#F392BE" />
							</View>
						</Pressable>
					</View>

					{/* Sección de Videos */}
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Videos</Text>
						</View>
						<View style={styles.listContainer}>
							<FlatList
								data={dataVideo}
								horizontal
								showsHorizontalScrollIndicator={false}
								renderItem={({ item }) => (
									<Pressable onPress={() => openDocument(item.video_path)}
										style={styles.cardPressable}>
										<VideoCard
											title={item.title}
											cover={videoCover}
											key={item.id}
										/>
									</Pressable>
								)}
								keyExtractor={(item) => item.id}
								contentContainerStyle={styles.listContent}
							/>
						</View>
					</View>

					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Centros de salud</Text>
							<Pressable
								onPress={() => router.push("/healthCenters")}
							>
								<ChevronRightIcon size={24} color="#F392BE" />
							</Pressable>
						</View>
						<View style={[styles.listContainer, { height: "20%" }]}>
							<FlatList
								data={dataHealthCenter}
								horizontal
								showsHorizontalScrollIndicator={false}
								renderItem={({ item }) => <HealthCenterCard {...item} />}
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
		maxHeight: 200,
	},
	listContent: {
		paddingHorizontal: 8,
	},
	cardPressable: {
		marginHorizontal: 8,
	},
	 card: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        backgroundColor: '#F392BE30',
        borderRadius: 8,
        padding: 12,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#64748b',
    },
	seeMoreButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	seeMoreText: {
		color: "#F392BE",
		fontWeight: "500",
	},
});

export default Info;
