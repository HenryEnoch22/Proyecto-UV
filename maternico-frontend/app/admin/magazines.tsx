import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { getMagazines, deleteMagazine } from "@/services/api";
import FileCard from "@/components/ui/admin/FileCard";

interface Magazine {
    id: number;
    title: string;
    magazine_path: string;
}

const Magazines = () => {
    const [magazines, setMagazines] = useState<Magazine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const fetchMagazines = async () => {
        try {
            setLoading(true);
            const response = await getMagazines();
            if (response) {
                setMagazines(response);
                setError('');
            } else {
                setError("No se encontraron revistas.");
            }
        } catch (error) {
            console.error("Error fetching magazines:", error);
            setError('Error al cargar las revistas.');
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const success = await deleteMagazine(id);
            if (success) {
                setSuccess('Revista eliminada correctamente');
                setTimeout(() => setSuccess(''), 3000);
                fetchMagazines();
            }
        } catch (error) {
            console.error("Error deleting magazine:", error);
            setError('Error al eliminar la revista');
        }
    }

    useEffect(() => {
        fetchMagazines();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F392BE" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestión de Revistas</Text>
            
            {error !== '' && <Text style={styles.error}>{error}</Text>}
            {success !== '' && <Text style={styles.success}>{success}</Text>}

            <FlatList
                data={magazines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <FileCard
                        item={{...item, file_path: item.magazine_path}}
                        handleDelete={handleDelete}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay revistas disponibles</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8FAFC',
        marginTop: "10%",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#343434',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    documentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    documentText: {
        color: '#F392BE',
        marginLeft: 8,
        fontWeight: '500',
    },
    magazineTitle: {
        fontSize: 16,
        color: '#343434',
        marginBottom: 10,
    },
    deleteButton: {
        alignSelf: 'flex-end',
        padding: 8,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    success: {
        color: 'green',
        textAlign: 'center',
        marginBottom: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#64748B',
        marginTop: 20,
    }
});

export default Magazines;