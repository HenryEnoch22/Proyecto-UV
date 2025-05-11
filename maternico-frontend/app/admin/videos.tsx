import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { getVideos, deleteVideo } from "@/services/api";
import FileCard from "@/components/ui/admin/FileCard";

interface Video {
    id: number;
    title: string;
    video_path: string;
}

const Videos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await getVideos();
            if (response) {
                setVideos(response);
                setError('');
            } else {
                setError("No se encontraron revistas.");
            }
        } catch (error) {
            console.error("Error fetching magazines:", error);
            setError('Error al cargar las revistas.');
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const success = await deleteVideo(id);
            if (success) {
                setSuccess('Video eliminado correctamente');
                setTimeout(() => setSuccess(''), 3000);
                fetchVideos();
            }
        } catch (error) {
            console.error("Error deleting video:", error);
            setError('Error al eliminar el video');
        }
    }

    useEffect(() => {
        fetchVideos();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F392BE" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestión de Videos</Text>
            
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}

            <FlatList
                data={videos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <FileCard
                        item={{...item, file_path: item.video_path}}
                        handleDelete={handleDelete}
                    />
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
        padding: 16,
        backgroundColor: '#F8FAFC',
        marginTop: "10%",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#343434',
        marginBottom: 20,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    success: {
        color: 'green',
        textAlign: 'center',
        marginBottom: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#64748B',
        marginTop: 20,
    }
});

export default Videos;