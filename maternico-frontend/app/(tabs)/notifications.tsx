import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { ArrowLongLeftIcon, BellIcon, ChevronRightIcon } from "react-native-heroicons/solid";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const notifications = [
  {
    id: 1,
    title: "Recordatorio de vacuna",
    message: "La próxima vacuna de Luna es en 6 días",
    date: "2025-03-09",
    time: "10:00",
    unread: true,
    type: "vaccine"
  },
  {
    id: 2,
    title: "Nuevo artículo",
    message: "5 consejos para la alimentación complementaria",
    date: "2025-03-8",
    time: "15:30",
    unread: false,
    type: "article"
  },
  {
    id: 3,
    title: "Cita confirmada",
    message: "Pediatría - 15 de febrero a las 10:00 AM",
    date: "2025-02-15",
    time: "10:00",
    unread: false,
    type: "appointment"
  },
];

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
            <ArrowLongLeftIcon size={24} color="#FEFEFE" />
        </Pressable>
        <Text style={styles.title}>Notificaciones</Text>
      </View>

      {/* Lista de notificaciones */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={[styles.notificationCard, item.unread && styles.unread]}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
            <ChevronRightIcon size={20} color="#666" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#F392BE",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FEFEFE",
  },
  listContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#343434",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: "#f283b5",
    backgroundColor: "#fdf2f8",
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#343434",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
});