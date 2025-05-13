import { getForumResponses } from "@/services/api";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ChatBubbleLeftEllipsisIcon, ChevronRightIcon } from "react-native-heroicons/solid";
import { useAuth } from "@/contexts/AuthContext";

const ResponseCard = () => {
    const { user, setUser } = useAuth();
    const [responses, setResponses] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                user && setUser({...user});
                const response = await getForumResponses(Number(user?.id));
                setResponses(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    let infoText = "";
    let infoTitle = "";

    if (responses > 1) {
        infoText = "Revisa tus foros";
        infoTitle = `Tienes ${responses} nuevas respuestas`;
    } else if (responses === 1) {
        infoText = "Revisa tu foro";
        infoTitle = `Tienes ${responses} nueva respuesta`;
    } else {
        infoText = "No tienes nuevas respuestas";
        infoTitle = "Crea un foro y comparte con la comunidad";
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <ChatBubbleLeftEllipsisIcon color="#f283b5" size={32} />
            </View>

            <View style={styles.info}>
                <Text style={styles.infoTitle}>{infoTitle}</Text>
                <View>
                    <Text style={styles.infoText}>{infoText}</Text>
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
        marginRight: 16, // Margen añadido aquí
    },
    info: {
        flex: 1, // Añade esto para ocupar espacio disponible
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
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
