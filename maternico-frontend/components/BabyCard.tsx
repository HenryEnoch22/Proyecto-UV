import { StyleSheet, Text, View } from "react-native";
import { UserCircleIcon } from "react-native-heroicons/solid";

interface BabyCardProps {
    name: string;
    birthDate: string;
    height: number;
    weight: number;
}

const BabyCard = ({name, birthDate, height, weight}: BabyCardProps) => {
    const calculateAge = (birthDateString: string) => {
        const currentDate = new Date();
        const babyBirthDate = new Date(birthDateString);
        
        if (isNaN(babyBirthDate.getTime())) {
            return { formattedAge: 'Fecha inválida', totalDays: 0 };
        }

        const timeDiff = currentDate.getTime() - babyBirthDate.getTime();
        const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));

        let formattedAge = '';
        if (totalDays < 30) {
            formattedAge = `${totalDays} día${totalDays !== 1 ? 's' : ''}`;
        } else if (totalDays < 360) {
            const months = Math.floor(totalDays / 30);
            formattedAge = `${months} mes${months !== 1 ? 'es' : ''}`;
        } else {
            const years = Math.floor(totalDays / 360);
            const remainingDays = totalDays % 360;
            const months = Math.floor(remainingDays / 30);
            
            formattedAge = `${years} año${years !== 1 ? 's' : ''}`;
            if (months > 0) {
                formattedAge += ` ${months} mes${months !== 1 ? 'es' : ''}`;
            }
        }

        return { formattedAge, totalDays };
    };

    const { formattedAge, totalDays } = calculateAge(birthDate);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <UserCircleIcon size={30} color="#f392be" />
                <Text style={styles.name}>{name}</Text>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.data}>
                    <Text style={styles.label}>Edad</Text>
                    <Text style={styles.dataText}>
                        {formattedAge}
                    </Text>
                </View>
                <View style={styles.data}>
                    <Text style={styles.label}>Altura</Text>
                    <Text style={styles.dataText}>{height} cm</Text>
                </View>
                <View style={styles.data}>
                    <Text style={styles.label}>Peso</Text>
                    <Text style={styles.dataText}>{weight} kg</Text>
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
        shadowRadius: 8,
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
        fontSize: 20,
        fontWeight: "600",
        color: "#343434",
    },
    infoContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    data: {
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        color: "#343434",
    },
    dataText: {
        backgroundColor: "#f4d18aa0",
        color: "#343434",
        fontWeight: "400",
        fontSize: 14,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
});

export default BabyCard;
