import { StyleSheet, Text, View } from "react-native";
import { ChatBubbleLeftEllipsisIcon, ChevronRightIcon } from "react-native-heroicons/solid";

const ResponseCard: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <ChatBubbleLeftEllipsisIcon color="#f283b5" size={32} />
            </View>

            <View style={styles.info}>
                <Text style={styles.infoTitle}>Alguien hizo un comentario en tu foro</Text>
                <View>
                    <Text style={styles.infoText}>1 comentario nuevo</Text>
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
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 4,
        marginTop: 12,
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
