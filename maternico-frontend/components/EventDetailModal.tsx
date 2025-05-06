import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Switch, TextInput, Alert } from 'react-native';
import { XCircleIcon, TrashIcon } from 'react-native-heroicons/solid';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { updateEvent, deleteEvent } from '@/services/api';
import DatePicker from './DatePicker';

type EventType = {
    id?: string;
    event_title: string;
    date: Date;
    time: string;
    notifiable: boolean;
    type: number;
};


interface EventDetailModalProps {
    visible: boolean;
    onClose: () => void;
    event: EventType;
}

const types = {
    1: 'Vacunación',
    2: 'Alimentación',
    3: 'Desarrollo',
    4: 'Cita médica',
    5: 'Cumpleaños'
};

const EventDetailModal = ({ visible, onClose, event }: EventDetailModalProps) => {
    const [eventName, setEventName] = useState(event.event_title);
    const [selectedDate, setSelectedDate] = useState(new Date(event.date));
    const [time, setTime] = useState(event.time);
    const [notifiable, setNotifiable] = useState(event.notifiable);
    const [type, setType] = useState<number>(event.type);

    useEffect(() => {
        setEventName(event.event_title);
        setSelectedDate(new Date(event.date));
        setTime(event.time);
        setNotifiable(event.notifiable);
        setType(event.type);
    }, [event]);

    const handleSave = () => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
        
        if (!eventName.trim()) {
            alert('Por favor ingresa un nombre para el evento');
            return;
        }

        if (!timeRegex.test(time)) {
            console.log('Invalid time format:', time);
            alert('Formato de hora inválido (HH:MM)');
            return;
        }

        
        updateEvent(
            event.id,
            eventName,
            selectedDate.toISOString().split('T')[0],
            time,
            notifiable,
            type
        );
        
        onClose();
    };

    const confirmDelete = () => {
        Alert.alert(
            'Eliminar Evento',
            '¿Estás segura de que quieres eliminar este evento?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', onPress: () => {
                    deleteEvent(event.id);
                    onClose();
                }, style: 'destructive' }
            ]
        );
    };

    const formatTime = (text: string) => {
        let cleaned = text.replace(/[^0-9]/g, '');
        if (cleaned.length > 4) cleaned = cleaned.slice(0,4);
        if (cleaned.length > 2) {
            return `${cleaned.slice(0,2)}:${cleaned.slice(2)}`;
        }
        return cleaned;
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Pressable style={styles.closeIcon} onPress={onClose}>
                        <XCircleIcon size={24} color="#F392BE" />
                    </Pressable>

                    <View style={styles.headerContainer}>
                        <Text style={styles.modalTitle}>Detalle del evento</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del evento"
                            value={eventName}
                            onChangeText={setEventName}
                            autoFocus
                        />

                        <DatePicker
                            label="Fecha"
                            value={selectedDate}
                            onChange={(date: Date) => setSelectedDate(date)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="HH:MM (24h)"
                            value={time}
                            onChangeText={(text) => setTime(formatTime(text))}
                            keyboardType="number-pad"
                            maxLength={5}
                        />

                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Notificaciones</Text>
                            <Switch
                                trackColor={{ false: "#E2E8F0", true: "#9061F9" }}
                                thumbColor="#FFF"
                                value={notifiable}
                                onValueChange={setNotifiable}
                            />
                        </View>
                        
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={type}
                                onValueChange={setType}
                                style={styles.picker}
                                dropdownIconColor="#9061F9"
                            >
                                {Object.entries(types).map(([key, value]) => (
                                    <Picker.Item 
                                        key={key} 
                                        label={value} 
                                        value={parseInt(key)} 
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.actionsContainer}>
                        <Pressable
                            style={[styles.actionButton, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <Text style={styles.actionButtonText}>Guardar Cambios</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={confirmDelete}
                        >
                            <TrashIcon size={18} color="#FFF" />
                            <Text style={styles.actionButtonText}>Eliminar Evento</Text>
                        </Pressable>
                    </View>
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
        width: '90%',
        borderRadius: 16,
        padding: 24,
        maxHeight: '90%',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2D3748',
        textAlign: 'center',
    },
    closeIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
    },
    formContainer: {
        marginBottom: 16,
    },
    input: {
        height: 48,
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#F8FAFC',
        fontSize: 16,
    },
    dateInput: {
        height: 48,
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
    },
    dateText: {
        color: '#4A5568',
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingVertical: 8,
    },
    label: {
        color: '#4A5568',
        fontSize: 16,
    },
    actionsContainer: {
        gap: 12,
    },
    actionButton: {
        borderRadius: 8,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    saveButton: {
        backgroundColor: '#F392BE',
    },
    deleteButton: {
        backgroundColor: '#EF4444',
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    calendar: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    pickerContainer: {
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#F8FAFC',
    },
    picker: {
        height: 52,
        color: '#4A5568',
    },
});

export default EventDetailModal;