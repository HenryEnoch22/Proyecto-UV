import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, logout, UserResponse } from "@/services/api";
import { BellIcon, UserCircleIcon } from "react-native-heroicons/solid";
import BabyCard from "../../components/BabyCard";
import ResponseCard from "../../components/ResponseCard";
import EventCard from "../../components/EventCard";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

interface Event {
    id: number;
    name: string;
    leftDays: number;
    typeEvent: "vaccine" | "appointment" | "birthday";
}

const data: Event[] = [
    { id: 1, name: "Vacuna", leftDays: 6, typeEvent: "vaccine" },
    { id: 2, name: "Cita médica", leftDays: 8, typeEvent: "appointment" },
    { id: 3, name: "Cita médica", leftDays: 11, typeEvent: "appointment" },
    { id: 4, name: "Cita médica", leftDays: 18, typeEvent: "appointment" },
    { id: 5, name: "Cumpleaños", leftDays: 83, typeEvent: "birthday" },
];

export default function HomeScreen() {
    const { user, setUser } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    
      useEffect(() => {
        const checkAuthStatus = async () => {
          try {
            const userData: UserResponse | null = await getProfile();
    
            if (userData?.user) {
              const { user } = userData;
              setUser({
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                last_name: user.last_name,
                mother_last_name: user.mother_last_name,
                birth_date: user.birth_date,
                profile_photo: user.profile_photo,
                baby: user.baby ? {
                  id: user.baby.id.toString(),
                  user_id: user.baby.user_id,
                  name: user.baby.name,
                  last_name: user.baby.last_name,
                  mother_last_name: user.baby.mother_last_name,
                  birth_date: user.baby.birth_date,
                  height: user.baby.height,
                  weight: user.baby.weight,
                  blood_type: user.baby.blood_type,
              }: null});
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
    const router = useRouter();

    return (
        <ScrollView>
            <View style={styles.topView}>
                <View style={styles.iconsContainer}>
                    <Pressable onPress={() => router.push('/notifications')}>
                        <BellIcon size='32' color="#fefefe" />
                    </Pressable>
                    <Pressable onPress={() => router.push('/profiles/profile')}>
                        <UserCircleIcon size='32' color="#fefefe" />
                    </Pressable>
                </View>
                <View style={styles.greetContainer}>
                    <Text style={styles.greetTitle}>Hola, <Text style={{ fontWeight: "bold" }}>{user?.name || "Usuario"}!</Text></Text>
                    <Text style={styles.greetFoot}>Bienvenida</Text>
                </View>
            </View>

            <View style={styles.bottomView}>
                <View style={styles.eventsContainer}>
                    <Text style={styles.sectionTitle}>Próximos Eventos</Text>
                    <View style={styles.events}>
                        <FlatList
                            data={data}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => router.push('/calendar')}>
                                    <EventCard text={item.name} days={item.leftDays} typeEvent={item.typeEvent} />
                                </Pressable>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Respuestas</Text>
                    <Pressable onPress={() => router.push('/forum')}>
                        <ResponseCard />
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tu bebé</Text>
                    <Pressable onPress={() => router.push(`/baby/1`)}> 
                    <BabyCard 
                        name={user?.baby?.name || 'Nombre no disponible'} 
                        birthDate={user?.baby?.birth_date || 'Fecha no disponible'} 
                        height={user?.baby?.height ? parseFloat(user.baby.height) : 0} 
                        weight={user?.baby?.weight ? parseFloat(user.baby.weight) : 0} 
                        />
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    topView: {
        backgroundColor: "#f283b5",
        color: "#fefefe",
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        height: "30%",
        justifyContent: "flex-end",
        marginBottom: 30,
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20,
    },
    greetContainer: {
        flexDirection: "column",
    },
    greetTitle: {
        fontSize: 32,
        color: "#fefefe",
    },
    greetFoot: {
        fontSize: 20,
        fontWeight: "200",
        color: "#fefefe",
    },
    bottomView: {
        justifyContent: "space-evenly",
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    eventsContainer: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#343434",
    },
    events: {
        marginBottom: 40,
    },
    section: {
        marginBottom: 40,
    }
});
