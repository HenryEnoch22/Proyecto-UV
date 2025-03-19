import { useLocalSearchParams } from "expo-router";
import WebView from "react-native-webview";
import { useEffect, useState } from "react";
import { getMagazine } from "../../services/api";
import { ActivityIndicator, View, Text } from "react-native";

const MagazineView = () => {
    const { id } = useLocalSearchParams();
    const [magazine, setMagazine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMagazine = async () => {
            try {
                const data = await getMagazine(id);
                console.log('revista: ', data);
                if (data) {
                    setMagazine(data);
                } else {
                    setError("Revista no encontrada");
                }
            } catch (err) {
                setError("Error al cargar la revista");
            } finally {
                setLoading(false);
            }
        };

        fetchMagazine();
    }, [id]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#F283B5" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#F283B5", fontSize: 18 }}>{error}</Text>
            </View>
        );
    }

    return (
        <WebView 
            style={{ flex: 1, marginTop: "10%" }}
            source={{ uri: magazine.magazine_path }}
            startInLoadingState={true}
            renderLoading={() => (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <ActivityIndicator size="large" color="#F283B5" />
                </View>
            )}
        />
    );
};

export default MagazineView;