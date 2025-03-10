import { View, Text, StyleSheet } from "react-native";
import { Image } from "react-native";

interface MagazineCardProps {
    title: string;
    date: string;
}
// TODO: Organizar con foto de portada y datos como footer
const MagazineCard = ({ title, date } : MagazineCardProps) => {
    return (
        <View style={styles.container}>
            <Image style={styles.cover} source={require('../assets/images/portada.png')} />
            <View style={styles.footer}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 10,
        borderRadius: 10,
        borderLeftColor: "#F283B5",
        borderLeftWidth: 5,
        backgroundColor: "#FEFEFE",
        width: 170,
        maxWidth: 170,
        minHeight: 72,
    },
    cover: {
        width: 150,
        height: 100,
    },
    footer: {
        marginTop: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "300",
        color: "#343434",
    },
    date: {
        fontSize: 16,
        color: "#888",
    },
})

export default MagazineCard;