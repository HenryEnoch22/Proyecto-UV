import { getBaby } from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { ArrowLongLeftIcon, PencilSquareIcon} from "react-native-heroicons/solid";
import Album from "../../components/Album";
import EditBabyModal from "@/components/EditBabyModal";

const Baby = () => {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState<{ id: number; baby_id: number; event_title: string; description?: string; date: string; photo_path?: string }[]>([
        {
            "id": 1,
            "baby_id": 1,
            "event_title": "Aprendió a gatear",
            "description": "Gateo del sillon a la mesa de centro",
            "date": "2025-02-09",
        },
        {
            "id": 2,
            "baby_id": 1,
            "event_title": "Dijo su primera palabra",
            "description": "Dijo mamá mientras se despertaba de una siesta",
            "date": "2025-03-10",
        },
        {
            "id": 3,
            "baby_id": 1,
            "event_title": "Empezó a jugar con sus juguetes",
            "description": "Se mantuvo jugando con su pelotita durante toda la tarde",
            "date": "2025-03-11",
        }
    ]);

    type BabyData = {
        id: number;
        name: string;
        last_name: string;
        mother_last_name: string;
        birth_date: string;
        weight: number;
        height: number;
        blood_type: string;
        created_at: string;
    };

    const [data, setData] = useState<BabyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getBaby(Number(id));
                setData(response.data);
            } catch (err: Error | any) {
                setError(err.message || "Error al cargar los datos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f283b5" />
                <Text style={styles.loadingText}>Cargando información...</Text>
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error || "Bebé no encontrado"}</Text>
            </View>
        );
    }

    const babyFullName = `${data.name} ${data.last_name} ${data.mother_last_name}`;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <ArrowLongLeftIcon size={32} color="#fff" />
                </Pressable>
                <Text style={[styles.title, { flex: 1 }]}>{babyFullName || "Sin nombre"}</Text>
                
                <Pressable
                    onPress={() => {
                        setShowModal(true);
                    }}
                    style={styles.editButton}
                    accessibilityLabel="Editar información del bebé"
                >
                    <PencilSquareIcon color={"#FEFEFE"} size={20} />
                </Pressable>
                </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información Personal</Text>
                <View style={styles.infoContainer}>
                    <InfoRow label="Apellido paterno:" value={data.last_name ?? "N/A"} />
                    <InfoRow label="Apellido materno:" value={data.mother_last_name ?? "N/A"} />
                    <InfoRow label="Fecha de nacimiento:" value={data.birth_date ?? "Desconocida"} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Datos Médicos</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.row}>
                        <InfoCard label="Peso" value={`${data.weight ?? "N/A"} kg`} />
                        <InfoCard label="Talla" value={`${data.height ?? "N/A"} cm`} />
                    </View>
                    <InfoRow 
                        label="Tipo de sangre:" 
                        value={
                            <View style={styles.bloodTypeContainer}>
                                <Text style={styles.bloodTypeText}>{data.blood_type ?? "N/A"}</Text>
                            </View>
                        } 
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Registrado el: {data.created_at ? new Date(data.created_at).toLocaleDateString("es-MX") : "Fecha desconocida"}
                </Text>
            </View>

            <Album 
                events={events} 
                onAddEvent={({event_title, description, date, photo_path}) => {
                    setEvents([
                        ...events,
                        {
                            id: events.length + 1,
                            baby_id: 2,
                            event_title,
                            ...(description && { description }),
                            date,
                            ...(photo_path && { photo_path }),
                        },
                    ]);
                }} 
            />

            <EditBabyModal
				visible={showModal}
				onClose={() => setShowModal(false)}
				onSubmit={() => setShowModal(false)}
                weight={data.weight.toString()}
                height={data.height.toString()}
			/>
        </ScrollView>
    );
};

const InfoRow = ({ label, value }: { label: string, value: string}) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const InfoCard = ({ label, value }: { label: string, value: string}) => (
    <View style={styles.infoCard}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
    },
    errorText: {
        color: "#e74c3c",
        fontSize: 18,
        textAlign: "center",
    },
    header: {
        marginBottom: 30,
        paddingTop: "10%",
        paddingBottom: 20,
        backgroundColor: "#f283b5",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    editButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    section: {
        marginBottom: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#343434",
        marginBottom: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    infoContainer: {
        backgroundColor: "#f8f8f8",
        borderRadius: 12,
        padding: 15,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    label: {
        fontSize: 15,
        color: "#666",
        flex: 1,
    },
    value: {
        fontSize: 15,
        color: "#343434",
        fontWeight: "500",
        flex: 1,
        textAlign: "right",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 15,
    },
    infoCard: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        flex: 1,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
    cardValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#343434",
    },
    bloodTypeContainer: {
        backgroundColor: "#f283b5",
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
        alignSelf: "flex-end",
    },
    bloodTypeText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    footer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 15,
    },
    footerText: {
        textAlign: "center",
        color: "#888",
        fontSize: 12,
    },
});

export default Baby;
