import { View, Text, StyleSheet, ScrollView, Image, Pressable, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowLongLeftIcon, PencilIcon } from "react-native-heroicons/solid";
import { useRouter } from "expo-router";
import { getProfile, logout, UserResponse } from "@/services/api";
import { useEffect, useState } from "react";

const Profile = () => {
    const { user, setUser } = useAuth();
    const router = useRouter();
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
            const checkAuthStatus = async () => {
              try {
                const userData: UserResponse | null = await getProfile();
        
                if (userData?.user) {
                  const { user } = userData;
                  setUser({...user});
                } else {
                  setUser(null);
                }
              } catch (error) {
                console.error("Error verificando autenticación:", error);
                setUser(null);
              } finally {
                setIsLoading(false);
              }
            };
        
            checkAuthStatus();
          }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            router.push('/screens/LoginScreen');
        } catch (e) {
            console.error("Error al cerrar sesión:", e);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f283b5" />
                <Text style={styles.loadingText}>Cargando usuario...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Pressable 
                    onPress={() => router.back()} 
                    style={styles.backButton}
                >
                    <ArrowLongLeftIcon size={24} color="#FEFEFE" />
                </Pressable>
                
                <Image
                    source={{ uri: "https://randomuser.me/api/portraits/lego/6.jpg" }}
                    style={styles.profileImage}
                />
                
                <Pressable 
                    style={styles.editIcon}
                    onPress={() => router.push('/profiles/edit')}
                >
                    <PencilIcon size={20} color="#FEFEFE" />
                </Pressable>
                <Text style={styles.name}>
                    {user?.name} {user?.last_name} {user?.mother_last_name}
                </Text>
                <Text style={styles.role}>Mamá primeriza</Text>
            </View>

            <View style={styles.contentContainer}>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información personal</Text>
                    <InfoRow label="Nombre completo" value={`${user?.name} ${user?.last_name} ${user?.mother_last_name}`} />
                    <InfoRow label="Correo electrónico" value={user?.email || ""} />
                </View>

            </View>

            {
                (user?.role_id === 2 && user.is_premium !== 1) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>¿Aún no eres premium?</Text>
                        <Text style={{ fontSize: 16, color: "#4A5568", marginBottom: 16 }}>
                            Conviértete en premium y disfruta de contenido exclusivo.
                        </Text>
                        <Pressable
                            onPress={() => router.push('/premium/card-data')}
                            style={{
                                backgroundColor: "#F392BE",
                                padding: 10,
                                borderRadius: 8,
                                marginTop: 10,
                            }}
                        >
                            <Text style={{ color: "#fff", textAlign: "center" }}>
                                Convertirme en premium
                            </Text>
                        </Pressable>
                    </View>
                )
            }
                <Pressable onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={{color: "#fefefe", fontWeight: "700", fontSize: 18}}>Cerrar sesión</Text>
                </Pressable>
        </ScrollView>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'No especificado'}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FEFEFE",
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
    header: {
        backgroundColor: "#F392BE",
        paddingBottom: 20,
        alignItems: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        justifyContent: "space-evenly"
    },
    backButton: {
        position: "absolute",
        left: 20,
        top: 50,
        zIndex: 1,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginTop: 60,
        borderWidth: 3,
        borderColor: "#FEFEFE",
    },
    editIcon: {
        position: "absolute",
        right: 20,
        top: 50,
        backgroundColor: "#f283b5",
        padding: 10,
        borderRadius: 20,
    },
    contentContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FEFEFE",
        textAlign: "center",
        marginBottom: 8,
    },
    role: {
        fontSize: 18,
        color: "#E4E4E4",
        textAlign: "center",
        marginBottom: 24,
    },
    section: {
        marginBottom: 32,
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#F392BE",
        marginBottom: 16,
        paddingBottom: 8,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    infoLabel: {
        fontSize: 16,
        color: "#4A5568",
        width: "50%",
    },
    infoValue: {
        fontSize: 16,
        color: "#343434",
        fontWeight: "500",
        flex: 1,
        textAlign: "right",
    },
    logoutButton: {
        alignSelf: "center",
        backgroundColor: "#Da4c3b",
        width: 250,
        borderRadius: 50,
        height: 64,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default Profile;