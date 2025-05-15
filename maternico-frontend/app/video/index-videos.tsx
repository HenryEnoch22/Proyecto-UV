import { useEffect, useState } from "react";
import { getVideos, getProfile } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { View, Text, FlatList, Pressable, StyleSheet, Linking } from "react-native";
import { FilmIcon, ArrowLongLeftIcon } from "react-native-heroicons/solid";
import { useRouter } from "expo-router";

interface Video {
    id: string;
    title: string;
    video_path: string;
}

const IndexVideos = () => {
    const router = useRouter();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
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

    const fetchVideos = async () => {
        try {
            const response = await getVideos();
            setVideos(response);
        } catch (error) {
            console.error("Error fetching videos:", error);
            setError("Error al cargar los videos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const openVideo = (url: string) => {
        setError(null);
        if (user?.is_premium) {
            Linking.openURL(url).catch((err) => {
                console.error("Error al abrir el video:", err);
                setError("No se pudo reproducir el video");
            });
        } else {
            setError("Debes ser usuario premium para acceder a este contenido");
        }
    };

    if (loading) {
        return <Text>Cargando...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <ArrowLongLeftIcon
                        size={30}
                        color="#FEFEFE"
                        style={{ marginRight: 20 }}
                    />
                </Pressable>
                <Text style={styles.headerTitle}>Videos Educativos</Text>
            </View>
            
            <FlatList
                data={videos}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => openVideo(item.video_path)}
                        style={styles.card}
                    >
                        <View style={styles.cardContent}>
                            <FilmIcon size={20} color="#3B82F6" />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.details}>Video educativo • Google Drive</Text>
                            </View>
                        </View>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay videos disponibles</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        marginBottom: 20,
        backgroundColor: "#F392BE",
        paddingHorizontal: 20,
        paddingTop: "10%",
        paddingBottom: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#FEFEFE",
    },
    card: {
        padding: 12,  // Reducir padding
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 0,  // Eliminar padding interno
    },
    title: {
        fontSize: 14,  // Tamaño de fuente reducido
        fontWeight: '500',
    },
    details: {
        fontSize: 12,
        color: '#64748B',
    },
    textContainer: {
        flex: 1,
    },
    emptyText: {
        textAlign: 'center',
        color: '#718096',
        marginTop: 20,
        fontSize: 16,
    },
});

export default IndexVideos;