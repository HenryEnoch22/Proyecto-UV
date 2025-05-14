import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { PlusCircleIcon, TrashIcon } from "react-native-heroicons/solid";
import { getAlbumEvents, createAlbumEvent, deleteAlbumEvent } from "@/services/api";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "@/constants/env";
import { ConfirmDeleteModal, AlbumEventModal } from "@/components";

type AlbumEvent = {
    id: number;
    baby_id: number;
    event_title: string;
    description?: string;
    date: string;
    photo_path?: string;
  }

interface AlbumProps {
    babyId: number;
}

export const Album = ({ babyId }: AlbumProps) => {
    const [events, setEvents] = useState<AlbumEvent[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const LOCAL_API_URL = API_URL?.split("/api")[0];

    const fetchEvents = async () => {
        try {
            const response = await getAlbumEvents(babyId);
            setEvents(response);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);


    const onAddEvent = async (newEvent: Omit<AlbumEvent, 'id'>) => {
        try {
          if (!newEvent.photo_path) {
            throw new Error("Debes seleccionar una imagen");
          }
          
          await createAlbumEvent(
            babyId,
            newEvent.event_title,
            newEvent.description || "",
            newEvent.date,
            newEvent.photo_path
          );
          fetchEvents();
        } catch (error) {
          console.error("Error:", error);
        }
      };

      const handleDeleteEvent = async () => {
        if (!selectedEventId) return;
        
        try {
            const success = await deleteAlbumEvent(selectedEventId);
            if (success) {
                fetchEvents();
                setSelectedEventId(null);
            }
        } catch (error) {
            console.error("Error eliminando evento:", error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.headerTitle}>Álbum</Text>
                <Pressable onPress={() => setShowModal(true)}>
                    <PlusCircleIcon color={'#F392BE'} size={32} />
                </Pressable>
            </View>
            
            {events ? (
                events.map((event) => (
                        <View key={event.id} style={styles.eventItem}>
                            <View style={styles.eventContent}>
                                <Text style={styles.eventTitle}>{event.event_title}</Text>
                                
                                {event.description && (
                                    <Text style={styles.descriptionText}>{event.description}</Text>
                                )}
                                
                                <Image
                                    source={{ uri: `${LOCAL_API_URL}/storage/${event.photo_path}` }}
                                    style={styles.eventImage}
                                />
                            </View>
                            <Pressable
                                onPress={() => setSelectedEventId(event.id)}
                            >
                                <TrashIcon color="#FF4444" size={20} />
                            </Pressable>
                        </View>
                ))
            ) : (
                <Text style={{ color: '#888', fontSize: 16 }}>No hay eventos disponibles.</Text>
            )}

            <AlbumEventModal 
                visible={showModal} 
                onClose={() => setShowModal(false)} 
                onSubmit={(newEvent) => onAddEvent({ ...newEvent, baby_id: babyId })}
            />

            <ConfirmDeleteModal
                visible={!!selectedEventId}
                onClose={() => setSelectedEventId(null)}
                onConfirm={handleDeleteEvent}
                title="Eliminar evento del álbum"
                description="¿Estás seguro de eliminar este evento? Todos los datos asociados se perderán permanentemente."
            />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#343434',
        marginBottom: 20,
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingVertical: 15,
    },
    checkboxContainer: {
        marginRight: 15,
    },
    eventContent: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#343434',
        marginBottom: 4,
    },
    timeText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#888',
        lineHeight: 20,
    },
    eventImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginTop: 10,
    },
});