import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { ArrowLongLeftIcon } from "react-native-heroicons/solid";
import { Loader } from "@/components";

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const DEFAULT_REGION: Region = {
  latitude: 0, // Fallback
  longitude: 0,
  latitudeDelta: 0.04,
  longitudeDelta: 0.02,
};

const HealthCenters = () => {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);

  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <Text style={styles.title}>Mi ubicación</Text>
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
    gap: 16,
    backgroundColor: "#F392BE",
    paddingTop: "10%",
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
    textAlign: "center",
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
});

export default HealthCenters;
