import { useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { HeartIcon } from 'react-native-heroicons/solid'

const CardNoBaby = () => {
    const router = useRouter();

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <HeartIcon size={30} color="#f392be" style={styles.icon} />
                <Text style={styles.title}>Registra a tu bebé!</Text>
            </View>
            <Text style={styles.description}>
                Completa su registro para acceder a todos los beneficios y seguimiento
                de su crecimiento
            </Text>
            <Pressable
                onPress={() => router.push("/baby/register")}
                style={styles.button}
            >
                <Text style={styles.cardText}>Registrar ahora!</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
		backgroundColor: "#fefefe",
		borderRadius: 12,
		padding: 20,
		marginVertical: 10,
		shadowColor: "#676767",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderLeftColor: "#f392be",
		borderLeftWidth: 4,
		borderStyle: "solid",
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		gap: 10,
	},
	icon: {
		marginRight: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#343434",
	},
	description: {
		fontSize: 16,
		color: "#343434",
		marginBottom: 10,
	},
	button: {
		backgroundColor: "#f392be",
		width: 160,
		height: 30,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
		color: "#fefefe",
		fontSize: 16,
		fontWeight: "bold",
	},
	cardText: {
		color: "#fefefe",
		fontSize: 14,
		fontWeight: "bold",
	},
})

export default CardNoBaby;