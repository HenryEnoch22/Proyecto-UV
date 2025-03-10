import { useLocalSearchParams } from "expo-router";
import WebView from "react-native-webview";
import { useEffect, useState } from "react";
import { getVideo } from "../../services/api";
import { ActivityIndicator, View, Text } from "react-native";

const VideoView = () => {
    const { id } = useLocalSearchParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const data = await getVideo(id);
                if (data.video) {
                    setVideo(data.video);
                } else {
                    setError("Video no encontrado");
                }
            } catch (err) {
                setError("Error al cargar el video");
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
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
            source={{ uri: video.video_path }}
            startInLoadingState={true}
            renderLoading={() => (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <ActivityIndicator size="large" color="#F283B5" />
                </View>
            )}
        />
    );
};

export default VideoView;