import { getForumResponses } from "@/services/api";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ChatBubbleLeftEllipsisIcon, ChevronRightIcon } from "react-native-heroicons/solid";
import { useAuth } from "@/contexts/AuthContext";

const ResponseCard = () => {

    const { user, setUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [responses, setResponses] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                user && setUser({...user});
                const response = await getForumResponses(Number(user?.id));
                setResponses(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (responses > 1) {
        return (
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <ChatBubbleLeftEllipsisIcon color="#f283b5" size={32} />
                </View>

                <View style={styles.info}>
                    <Text style={styles.infoTitle}>Tienes {responses} nuevas respuestas</Text>
                    <View>
                        <Text style={styles.infoText}>Revisa tus foros</Text>
                    </View>
                </View>

                <ChevronRightIcon color="#f392be" size={20} />
            </View>
        );
    }

    if (responses === 1) {
        return (
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <ChatBubbleLeftEllipsisIcon color="#f283b5" size={32} />
                </View>

                <View style={styles.info}>
                    <Text style={styles.infoTitle}>Tienes {responses} nueva respuesta</Text>
                    <View>
                        <Text style={styles.infoText}>Revisa tu foro</Text>
                    </View>
                </View>

                <ChevronRightIcon color="#f392be" size={20} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <ChatBubbleLeftEllipsisIcon color="#f283b5" size={32} />
            </View>

            <View style={styles.info}>
                <Text style={styles.infoTitle}>No tienes nuevas respuestas</Text>
                <View>
                    <Text style={styles.infoText}>Crea un foro y compare con la comunidad</Text>
                </View>
            </View>

            <ChevronRightIcon color="#f392be" size={20} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    iconContainer: {
        padding: 8,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#f392be",
        backgroundColor: "#f392be50",
    },
    info: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        marginTop: 12,
        marginLeft: 12,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: "#343434",
    },
    infoText: {
        backgroundColor: "#f4d18aa0",
        paddingHorizontal: 12,
        paddingVertical: 4,
        fontSize: 12,
        borderRadius: 4,
        color: "#343434",
        fontWeight: "400",
    },
});

export default ResponseCard;
