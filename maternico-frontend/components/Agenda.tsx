import { deleteEvent } from "@/services/api";
import { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import {
    BellAlertIcon,
    CalendarDaysIcon,
    ClockIcon,
} from "react-native-heroicons/outline";

interface Event {
    id: number;
    event_title: string;
    date: string;
    isDone: boolean;
    notifiable: boolean;
    time?: string;
}

interface AgendaProps {
    events: Event[];
}

const Agenda = ({ events }: AgendaProps) => {
    const groupedEvents = useMemo(() => {
        const eventMap = new Map<string, Event[]>();

        events.forEach(event => {
            if (!event.date) return;

            if (!eventMap.has(event.date)) {
                eventMap.set(event.date, []);
            }

            eventMap.get(event.date)?.push(event);
        });

        eventMap.forEach((dateEvents) => {
            dateEvents.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
        });

        return Array.from(eventMap.entries())
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
    }, [events]);

    const renderEvent = (event: Event) => (
        <Pressable 
            style={styles.eventCard}
            key={event.id}
        >
            <View style={styles.eventCardHeader}>
                <Text style={styles.eventTitle}>{event.event_title}</Text>
                {event.notifiable && <BellAlertIcon color="#E74C3C" size={20} />}
            </View>

            <View style={styles.eventCardDetails}>
                <View style={styles.eventDetailRow}>
                    <CalendarDaysIcon color="#8E44AD" size={20} />
                    <Text style={styles.eventDetailText}>Fecha: {event.date}</Text>
                </View>
                
                {event.time && (
                    <View style={styles.eventDetailRow}>
                        <ClockIcon color="#3498DB" size={20} />
                        <Text style={styles.eventDetailText}>Hora: {event.time}</Text>
                    </View>
                )}
            </View>
        </Pressable>
    );

    if (!events.length) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Mi Agenda</Text>
                <Text style={styles.emptyText}>No hay eventos registrados este mes</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.listContainer}
        >
            <Text style={styles.screenTitle}>Mi Agenda</Text>
            
            {groupedEvents.map(([date, eventsForDate]) => (
                <View 
                    style={styles.dateGroup}
                    key={date}
                >
                    <Text style={styles.dateGroupTitle}>{date}</Text>
                    {eventsForDate.map(renderEvent)}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#343434",
        paddingTop: 20,
        marginBottom: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F4F4",
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#343434",
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: "#343434",
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    dateGroup: {
        marginBottom: 20,
    },
    dateGroupTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#343434",
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    eventCard: {
        backgroundColor: "#FEFEFE",
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        marginTop: 10,
        borderLeftColor: "#F392BE",
        borderLeftWidth: 5,
        shadowColor: "#343434",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 20,
    },
    eventCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    eventTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        color: "#343434",
        marginLeft: 10,
    },
    eventCardDetails: {
        paddingLeft: 20,
    },
    eventDetailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    eventDetailText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#343434",
    },
});

export default Agenda;