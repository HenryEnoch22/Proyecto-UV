import {StyleSheet, Text, View} from "react-native";
import {CakeIcon, CalendarDaysIcon} from "react-native-heroicons/solid";
import {ClipboardDocumentCheckIcon} from "react-native-heroicons/outline"

interface EventCardProps{
    text: string;
    days: number;
    typeEvent: "vaccine" | "appointment" | "birthday";
}
const EventCard = ({text, days, typeEvent}: EventCardProps) => {

    let Icon = CalendarDaysIcon;

    if (typeEvent === "birthday") {
        Icon = CakeIcon
    } else if (typeEvent === "vaccine") {
        Icon = ClipboardDocumentCheckIcon
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Icon color="#fefefe" size="24" />
                </View>
                <Text style={styles.textStyle}>{text}</Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.daysStyles}>Agrega eventos al calendario</Text>
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
        width: 250,
        maxWidth: 250,
        minHeight: 72,
        backgroundColor: "#fff",
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