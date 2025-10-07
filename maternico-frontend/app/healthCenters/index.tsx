import React, { useEffect, useState, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Platform,
	Linking,
	Alert,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
	ArrowLongLeftIcon,
	BuildingStorefrontIcon,
} from "react-native-heroicons/solid";
import { Loader, PrimaryButton } from "@/components";

type Region = {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
};

const DEFAULT_REGION: Region = {
	latitude: 0,
	longitude: 0,
	latitudeDelta: 0.04,
	longitudeDelta: 0.02,
};

const HealthCenters = () => {
	const router = useRouter();
	const mapRef = useRef<MapView | null>(null);

	const [region, setRegion] = useState<Region>(DEFAULT_REGION);
	const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [userLocation, setUserLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				setError(null);

				// Pedir permisos
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== "granted") {
					setPermissionGranted(false);
					setLoading(false);
					return;
				}

				setPermissionGranted(true);

				// Obtener ubicación actual
				const loc = await Location.getCurrentPositionAsync({});
				const newRegion: Region = {
					latitude: loc.coords.latitude,
					longitude: loc.coords.longitude,
					latitudeDelta: 0.04,
					longitudeDelta: 0.02,
				};

				setRegion(newRegion);
				setUserLocation({
					latitude: loc.coords.latitude,
					longitude: loc.coords.longitude,
				});

				// Animar el mapa
				if (mapRef.current) {
					mapRef.current.animateToRegion(newRegion, 1000);
				}
			} catch (err) {
				console.error("Error obteniendo ubicación:", err);
				setError("No fue posible obtener tu ubicación");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	// Función para abrir Maps con filtro de hospitales
	const openMapsWithHospitalFilter = () => {
		if (!userLocation) {
			Alert.alert("Error", "No se pudo obtener tu ubicación");
			return;
		}

		const { latitude, longitude } = userLocation;

		// Diferentes URLs para iOS y Android
		let mapsUrl = "";

		if (Platform.OS === "ios") {
			// Apple Maps - hospital search near location
			mapsUrl = `http://maps.apple.com/?q=hospital&sll=${latitude},${longitude}&z=12`;
		} else {
			// Google Maps - hospital search near location
			mapsUrl = `https://www.google.com/maps/search/hospital/@${latitude},${longitude},12z`;
		}

		Linking.openURL(mapsUrl).catch(() => {
			Alert.alert("Error", "No se pudo abrir la aplicación de mapas");
		});
	};

	// Función alternativa con más opciones de filtro
	const openMapsWithAdvancedFilter = () => {
		if (!userLocation) {
			Alert.alert("Error", "No se pudo obtener tu ubicación");
			return;
		}

		const { latitude, longitude } = userLocation;
		let mapsUrl = "";

		// Términos de búsqueda en español para México
		const searchTerms = [
			"hospital",
			"clínica",
			"centro de salud",
			"urgencias",
			"emergencias médicas",
		].join("+");

		if (Platform.OS === "ios") {
			// Apple Maps
			mapsUrl = `http://maps.apple.com/?q=${searchTerms}&ll=${latitude},${longitude}&z=13`;
		} else {
			// Google Maps
			mapsUrl = `https://www.google.com/maps/search/${searchTerms}/@${latitude},${longitude},13z`;
		}

		Linking.openURL(mapsUrl).catch(() => {
			Alert.alert("Error", "No se pudo abrir la aplicación de mapas");
		});
	};

	// Función para abrir Waze con filtro de hospitales
	const openWazeWithHospitalFilter = () => {
		if (!userLocation) {
			Alert.alert("Error", "No se pudo obtener tu ubicación");
			return;
		}

		const { latitude, longitude } = userLocation;
		const wazeUrl = `https://www.waze.com/ul?q=hospital&ll=${latitude},${longitude}&navigate=yes`;

		Linking.openURL(wazeUrl).catch(() => {
			Alert.alert("Error", "No se pudo abrir Waze");
		});
	};

	if (loading) return <Loader />;

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Pressable
					onPress={() => router.push("/healthCenters")}
					style={styles.iconButton}
				>
					<ArrowLongLeftIcon size={24} color="#FEFEFE" />
				</Pressable>
				<Text style={styles.title}>Centros de Salud</Text>
			</View>

			{error && (
				<View style={styles.errorBox}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			)}

			<View style={styles.mapWrapper}>
				<MapView
					ref={(r) => (mapRef.current = r)}
					style={styles.map}
					initialRegion={region}
					showsUserLocation
					showsMyLocationButton
					provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
				/>

				<View style={styles.floatingButtons}>
					<PrimaryButton
						text="Buscar hospitales en Maps"
						onPress={openMapsWithHospitalFilter}
						style={styles.mapButton}
						icon={<BuildingStorefrontIcon size={20} color="#FFF" />}
					/>

					{Platform.OS === "android" && (
						<Pressable
							style={styles.wazeButton}
							onPress={openWazeWithHospitalFilter}
						>
							<Text style={styles.wazeButtonText}>Buscar en Waze</Text>
						</Pressable>
					)}
				</View>

				{permissionGranted === false && (
					<View style={styles.permissionHint}>
						<Text style={styles.permissionText}>
							Activa los permisos de ubicación para ver tu posición.
						</Text>
					</View>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#FEFEFE" },
	header: {
		flexDirection: "row",
		alignItems: "center",
    justifyContent: "flex-start",
		gap: 16,
		backgroundColor: "#F392BE",
		paddingTop: "15%",
		paddingBottom: "5%",
		paddingHorizontal: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	iconButton: { padding: 6 },
	title: {
		flex: 1,
		fontSize: 20,
		color: "#FEFEFE",
		fontWeight: "700",
	},
	mapWrapper: { flex: 1, padding: 12 },
	map: { flex: 1, borderRadius: 12, overflow: "hidden" },
	permissionHint: {
		position: "absolute",
		left: 16,
		right: 16,
		bottom: 16,
		backgroundColor: "#F392BE",
		padding: 10,
		borderRadius: 10,
		alignItems: "center",
	},
	permissionText: { color: "#fff", textAlign: "center" },
	errorBox: { padding: 12 },
	errorText: { color: "red", textAlign: "center" },

	// Botones flotantes
	floatingButtons: {
		position: "absolute",
		bottom: 20,
		left: 16,
		right: 16,
		gap: 10,
	},
	mapButton: {
		backgroundColor: "#F392BE",
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	alternativeButton: {
		backgroundColor: "rgba(255, 255, 255, 0.95)",
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 20,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#F392BE",
	},
	alternativeButtonText: {
		color: "#F392BE",
		fontSize: 14,
		fontWeight: "600",
	},
	wazeButton: {
		backgroundColor: "#33CCFF",
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 20,
		alignItems: "center",
	},
	wazeButtonText: {
		color: "#FFF",
		fontSize: 14,
		fontWeight: "600",
	},
});

export default HealthCenters;
