import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable, Switch, TextInput } from 'react-native';
import { XCircleIcon } from 'react-native-heroicons/solid';
import { Calendar } from 'react-native-calendars';

interface AddEventModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        date: Date;
        notify: boolean;
    }) => void;
}

const AddEventModal = ({ visible, onClose, onSubmit }: AddEventModalProps) => {
    const [eventName, setEventName] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState('');
    const [notify, setNotify] = useState(true);

    const handleSubmit = () => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
        
        if (!eventName.trim()) {
            alert('Por favor ingresa un nombre para el evento');
            return;
        }

        if (!timeRegex.test(time)) {
            alert('Formato de hora inválido (HH:MM)');
            return;
        }

        const [hours, minutes] = time.split(':').map(Number);
        const finalDate = new Date(selectedDate);
        finalDate.setHours(hours);
        finalDate.setMinutes(minutes);

        console.log({
            name: eventName,
            date: finalDate,
            notify
        })
        
        onSubmit({
            name: eventName,
            date: finalDate,
            notify
        });
        
        resetForm();
    };

    const resetForm = () => {
        setEventName('');
        setTime('');
        setSelectedDate(new Date());
        setShowDatePicker(false);
        onClose();
    };

    const formatTime = (text: string) => {
        // Eliminar caracteres no numéricos
        let cleaned = text.replace(/[^0-9]/g, '');
        
        // Limitar a 4 dígitos
        if (cleaned.length > 4) cleaned = cleaned.slice(0,4);
        
        // Aplicar formato HH:MM
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
            onRequestClose={resetForm}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Pressable style={styles.closeIcon} onPress={resetForm}>
                        <XCircleIcon size={24} color="#9061F9" />
                    </Pressable>

                    <Text style={styles.modalTitle}>Nuevo Evento</Text>

                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del evento"
                            value={eventName}
                            onChangeText={setEventName}
                            autoFocus
                        />

                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowDatePicker(!showDatePicker)}
                        >
                            <Text style={styles.dateText}>
                                {selectedDate.toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <Calendar
                                current={selectedDate.toISOString().split('T')[0]}
                                onDayPress={(day: {dateString: string}) => {
                                    const localDate = new Date(day.dateString + 'T12:00:00'); // Hora fija para evitar cambios
                                    setSelectedDate(localDate);
                                    setShowDatePicker(false);
                                }}
                                markedDates={{
                                    [selectedDate.toISOString().split('T')[0]]: {
                                        selected: true,
                                        selectedColor: '#9061F9'
                                    }
                                }}
                                theme={{
                                    todayTextColor: '#9061F9',
                                    arrowColor: '#9061F9',
                                    'stylesheet.calendar.main': {
                                        weekContainer: {
                                            paddingHorizontal: 4,
                                        }
                                    }
                                }}
                                style={styles.calendar}
                            />
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="HH:MM (24h)"
                            value={time}
                            onChangeText={(text) => setTime(formatTime(text))}
                            keyboardType="number-pad"
                            maxLength={5}
                        />

                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Enviar notificación</Text>
                            <Switch
                                trackColor={{ false: "#E2E8F0", true: "#9061F9" }}
                                thumbColor="#FFF"
                                value={notify}
                                onValueChange={setNotify}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.actionButtonText}>Crear Evento</Text>
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
        width: '90%',
        borderRadius: 16,
        padding: 24,
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 20,
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
    actionButton: {
        backgroundColor: '#9061F9',
        borderRadius: 8,
        paddingVertical: 14,
        marginTop: 16,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    calendar: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    }
});

export default AddEventModal;