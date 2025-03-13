import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from "react-native";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import AlbumEventModal from "./AlbumEventModal";

interface AlbumEvent {
    id: number;
    baby_id: number;
    event_title: string;
    description?: string;
    date: string;
    photo_path?: string;
}

interface AlbumProps {
    events: AlbumEvent[];
    onAddEvent: (newEvent: AlbumEvent) => void;
}

const Album = ({ events, onAddEvent }: AlbumProps) => {
    
    const [showModal, setShowModal] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.headerTitle}>Álbum</Text>
                <Pressable onPress={() => setShowModal(true)}>
                    <PlusCircleIcon color={'#F392BE'} size={32} />
                </Pressable>
            </View>
            
            {events.map((event) => (
                <View key={event.id} style={styles.eventItem}>
                    
                    <View style={styles.eventContent}>
                        <Text style={styles.eventTitle}>{event.event_title}</Text>
                        
                        {event.description && (
                            <Text style={styles.descriptionText}>{event.description}</Text>
                        )}
                        
                        {event.photo_path && (
                            <Image 
                                source={{ uri: event.photo_path || require('../assets/images/portada.png') }}
                                style={styles.eventImage}
                            />
                        )}
                    </View>
                </View>
            ))}

            <AlbumEventModal 
                visible={showModal} 
                onClose={() => setShowModal(false)} 
                onSubmit={(newEvent) => onAddEvent(newEvent)} />

            
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