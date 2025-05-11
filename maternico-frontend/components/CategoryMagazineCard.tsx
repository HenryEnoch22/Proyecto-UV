import { Image, StyleSheet, Text, View } from "react-native";

interface CategoryMagazineCardProps {
    category: string,
    // publications: number,
    cover: string,
}

const CategoryMagazineCard = ({ category, cover  }: CategoryMagazineCardProps) => {
	return (
		<View style={styles.container}>
            <Image source={cover} style={styles.header} />
			<View style={styles.footer}>
                <Text style={styles.category}>{category}</Text>
                {/* <Text style={styles.publications}>{publications} publicaciones</Text> */}
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
        height: 70, // TODO: medidas de portadas 
        width: 175,
        marginBottom: 10,
    },
    footer: {
        justifyContent: "flex-start",
        gap: 8,
    },
    category: {
        fontSize: 16,
        fontWeight: "200",
    },
    publications: {
        backgroundColor: "#F4D18AA0",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4
    }
});

export default CategoryMagazineCard;
