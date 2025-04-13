import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';

interface EventModalProps {
    visible: boolean;
    onClose: () => void;
    event: any;
    selectedDate: string;
}

const EventModal = ({ visible, onClose, event, selectedDate }: EventModalProps) => {
    if (!event) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity
                        style={styles.closeIcon}
                        onPress={onClose}
                    >
                        <XCircleIcon size={24} color="#9061F9" />
                    </TouchableOpacity>

                    <Text style={styles.modalTitle}>
                        {event.description || "Detalle del evento"}
                    </Text>

                    <View style={styles.eventDetails}>
                        <Text style={styles.eventDate}>{selectedDate}</Text>

                        <View style={styles.eventItem}>
                            <CheckCircleIcon size={20} color="#34D399" />
                            <Text style={styles.eventItemText}>
                                {event.description === "Vacuna del bebé"
                                    ? "Vacuna contra: Hepatitis B, Polio"
                                    : event.description === "Control prenatal"
                                        ? "Control mensual: Peso, presión arterial, crecimiento del bebé"
                                        : "Detalles del evento"}
                            </Text>
                        </View>

                        <View style={styles.eventItem}>
                            <CheckCircleIcon size={20} color="#34D399" />
                            <Text style={styles.eventItemText}>
                                Hora: 10:00 AM
                            </Text>
                        </View>

                        <View style={styles.eventItem}>
                            <CheckCircleIcon size={20} color="#34D399" />
                            <Text style={styles.eventItemText}>
                                Lugar: Centro de Salud
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={onClose}
                    >
                        <Text style={styles.actionButtonText}>Ver indicaciones</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        width: '85%',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A5568',
        marginBottom: 16,
        textAlign: 'center',
    },
    closeIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    eventDetails: {
        width: '100%',
        marginBottom: 16,
    },
    eventDate: {
        fontSize: 16,
        color: '#718096',
        marginBottom: 12,
        textAlign: 'center',
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    eventItemText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#4A5568',
    },
    actionButton: {
        backgroundColor: '#9061F9',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EventModal;