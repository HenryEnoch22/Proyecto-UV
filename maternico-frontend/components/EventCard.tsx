import {StyleSheet, Text, View} from "react-native";
import {CalendarDaysIcon} from "react-native-heroicons/solid";
import {ClipboardDocumentCheckIcon, ShieldCheckIcon, ShoppingCartIcon, AcademicCapIcon, PlusCircleIcon, CakeIcon} from "react-native-heroicons/outline"

interface EventCardProps{
    text: string;
    days: number;
    type: string;
}
const EventCard = ({text, days, type}: EventCardProps) => {

    const typeConfig = {
			1: {
				// Vacunación
				icon: ShieldCheckIcon,
				color: "#2ECC71", // Verde
				label: "Vacunación",
			},
			2: {
				// Alimentación
				icon: ShoppingCartIcon,
				color: "#E67E22", // Naranja
				label: "Alimentación",
			},
			3: {
				// Desarrollo
				icon: AcademicCapIcon,
				color: "#3498DB", // Azul
				label: "Desarrollo",
			},
			4: {
				// Cita médica
				icon: PlusCircleIcon,
				color: "#E74C3C", // Rojo
				label: "Cita Médica",
			},
			5: {
				// Cumpleaños
				icon: CakeIcon,
				color: "#F392BE", // Rosa
				label: "Cumpleaños",
			},
		};

		const eventTypeConfig =
			Object.values(typeConfig).find(
				(item) => item.label === type
			) || typeConfig[1];
		const IconComponent = eventTypeConfig.icon;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <IconComponent color="#fefefe" size="24" />
                </View>
                <Text style={styles.textStyle}>{text}</Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.daysStyles}>{`${days} días restantes`}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 10,
        borderStyle: "solid",
        borderLeftColor: "#f392be",
        borderLeftWidth: 2,
        marginHorizontal: 4,
        borderRadius: 4,
        minWidth: 180,
        maxWidth: 250,
        minHeight: 72,
        backgroundColor: "#fff",
        marginRight: 8,
        elevation: 2,
        shadowColor: "#676767",
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        overflow: "hidden",
        marginVertical: 4,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        fontSize: 12,
        gap: 8,
        marginBottom: 12,
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f392be",
        padding: 2,
        borderRadius: 4,
        alignContent: "flex-start",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: "#F4D18Aa0",
        borderRadius: 4,
        paddingHorizontal: 4
    },
    textStyle: {
        color: "#f392be",
        fontWeight: "500",
        fontSize: 16
    },
    daysStyles: {
        color: "#343434",
        fontWeight: "400"
    }
})

export default EventCard;