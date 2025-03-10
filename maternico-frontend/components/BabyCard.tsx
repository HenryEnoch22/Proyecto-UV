import { StyleSheet, Text, View } from "react-native";
import { UserCircleIcon } from "react-native-heroicons/solid";

const BabyCard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <UserCircleIcon size={30} color="#f392be" />
                <Text style={styles.name}>Moisés</Text>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.data}>
                    <Text style={styles.label}>Edad</Text>
                    <Text style={styles.dataText}>8 meses</Text>
                </View>
                <View style={styles.data}>
                    <Text style={styles.label}>Próxima vacuna</Text>
                    <Text style={styles.dataText}>Lopiteramida</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        borderRadius: 6,
        backgroundColor: "#fefefe",
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowColor: "#f392be",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
        borderLeftColor: "#f392be",
        borderLeftWidth: 4,
        borderStyle: "solid",
    },
    header: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        marginBottom: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: "600",
        color: "#343434",
    },
    infoContainer: {
        flexDirection: "row",
        gap: 12,
    },
    data: {
        flexDirection: "column",
        gap: 8,
    },
    label: {
        fontSize: 20,
        fontWeight: "400",
        color: "#343434",
    },
    dataText: {
        backgroundColor: "#f4d18aa0",
        color: "#343434",
        fontWeight: "400",
        fontSize: 12,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
});

export default BabyCard;
