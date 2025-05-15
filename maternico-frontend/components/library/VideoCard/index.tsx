import { Image, StyleSheet, Text, View } from "react-native";

interface VideoCardProps {
    title: string,
    cover: string,
}

export const VideoCard = ({ title, cover  }: VideoCardProps) => {
	return (
		<View style={styles.container}>
            <Image source={cover} style={styles.header} />
			<View style={styles.footer}>
                <Text style={styles.title}>{title}</Text>
            </View>
		</View>
	);
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 10,
        borderRadius: 10,
        borderLeftColor: "#F283B5",
        borderLeftWidth: 5,
        backgroundColor: "#FEFEFE",
        width: 200,
        maxWidth: 200,
    },
    header: {
        height: 70,
        width: 175,
        marginBottom: 10,
    },
    footer: {
        justifyContent: "flex-start",
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "200",
    },
});
