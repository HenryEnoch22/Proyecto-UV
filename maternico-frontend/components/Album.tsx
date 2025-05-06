import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import AlbumEventModal from "./AlbumEventModal";
import { getAlbumEvents, createAlbumEvent } from "@/services/api";
import * as ImagePicker from "expo-image-picker";

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

const Album = ({ babyId }: AlbumProps) => {
    const [events, setEvents] = useState<AlbumEvent[]>([]);
    const fetchEvents = async () => {
        try {
            const response = await getAlbumEvents(babyId);
            console.log("Fetched events:", response.data);
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

    
    const [showModal, setShowModal] = useState(false);

    const getImage = (title: string) => {
        if (title.toLowerCase().includes("gatear")) {
            return require("../assets/images/babyEvents/gateando.jpg");
        } else if (title.toLowerCase().includes("palabra")) {
            return require("../assets/images/babyEvents/hablando.jpg");
        }
        return require("../assets/images/babyEvents/jugando.png");
    }

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
                            
                            { event.photo_path
                                ? (
                                    <Image
                                    source={{ uri: `http://192.168.100.6:8000/storage/${event.photo_path}` }}
                                    style={styles.eventImage}
                                    />
                                )
                                : (
                                    <Image
                                    source={getImage(event.event_title)}
                                    style={styles.eventImage}
                                    />
                                )
                            }
                        </View>
                    </View>
                ))
            ) : (
                <Text style={{ color: '#888', fontSize: 16 }}>No hay eventos disponibles.</Text>
            )}

            <AlbumEventModal 
                visible={showModal} 
                onClose={() => setShowModal(false)} 
                onSubmit={(newEvent) => onAddEvent({ ...newEvent, baby_id: babyId })} />

            
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

export default Album;