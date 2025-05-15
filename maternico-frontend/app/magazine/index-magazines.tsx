import { useEffect, useState } from "react";
import { getMagazines, getProfile, } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { View, Text, SectionList, Pressable, StyleSheet, Linking } from "react-native";
import { DocumentTextIcon, ArrowLongLeftIcon } from "react-native-heroicons/solid";
import { useRouter } from "expo-router";

interface Magazine {
    id: string;
    title: string;
    magazine_path: string;
    category: string;
}

interface Section {
    title: string;
    data: Magazine[];
}

const IndexMagazines = () => {
    const router = useRouter();
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, setUser } = useAuth();

    useEffect(() => {
        setError(null);
        const fetchUser = async () => {
            try {
                const userData = await getProfile();

                if (userData?.user) {
                    const { user } = userData;
                    setUser({...user});
                }
            } catch (error) {
                console.error("Error al cargar el usuario:", error);
            }
        };
        fetchUser();
    }, []);

    const fetchMagazines = async () => {
        try {
            const response = await getMagazines();
            
            const formattedSections = Object.entries(response).map(([category, magazines]) => ({
                title: category.replace("o a 1 año", "0 a 1 año"),
                data: (magazines as Magazine[]).map(magazine => ({
                    ...magazine,
                    category: category
                }))
            }));
            
            setSections(formattedSections);
        } catch (error) {
            console.error("Error fetching magazines:", error);
            setError("Error al cargar las revistas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMagazines();
    }, []);

    const openDocument = (url: string) => {
        setError(null);
        if (user?.is_premium) {
            Linking.openURL(url).catch((err) => {
                console.error("Error al abrir el enlace:", err);
                setError("No se pudo abrir el documento");
            });
        } else {
            setError("Debes ser usuario premium para acceder a este contenido");
        }
    };

    if (loading) {
        return <Text>Cargando...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
				<Pressable onPress={() => router.back()}>
					<ArrowLongLeftIcon
						size={30}
						color="#FEFEFE"
						style={{ marginRight: 20 }}
					/>
				</Pressable>
				<Text style={styles.headerTitle}>Revistas por Categoría</Text>
			</View>
            
            <SectionList
                sections={sections}
                style={{ paddingHorizontal: 20 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => {openDocument(item.magazine_path)}}
                        style={styles.card}
                    >
                        <View style={styles.cardContent}>
                            <View style={styles.iconContainer}>
                                <DocumentTextIcon size={28} color="#3B82F6" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.details}>
                                    {item.category} • 15 páginas
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
	header: {
		flexDirection: "row",
		marginBottom: 20,
		backgroundColor: "#F392BE",
		paddingHorizontal: 20,
		paddingTop: "10%",
		paddingBottom: 15,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#FEFEFE",
    },
    sectionHeader: {
        backgroundColor: "#e2e8f0",
        padding: 10,
        borderRadius: 6,
        marginVertical: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#4a5568",
    },
    card: {
        padding: 16,
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    }, 
    link: {
        fontSize: 12,
        color: "#718096",
        marginTop: 4,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    iconContainer: {
        backgroundColor: '#EFF6FF',
        borderRadius: 8,
        padding: 10,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 4,
    },
    details: {
        fontSize: 14,
        color: '#64748B',
    },
});

export default IndexMagazines;