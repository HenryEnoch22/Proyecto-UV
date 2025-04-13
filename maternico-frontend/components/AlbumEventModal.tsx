import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable, TextInput } from 'react-native';
import { XCircleIcon } from 'react-native-heroicons/solid';
import { Calendar } from 'react-native-calendars';

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { event_title: string; description?: string; date: string }) => void;
  initialData?: AlbumEvent;
}

const AlbumEventModal = ({ visible, onClose, onSubmit, initialData }: EventModalProps) => {
  const [eventTitle, setEventTitle] = useState(initialData?.event_title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedDate, setSelectedDate] = useState(initialData?.date || '');
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = () => {
    if (!eventTitle.trim() || !selectedDate) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    onSubmit({
      event_title: eventTitle,
      description: description.trim(),
      date: selectedDate
    });
    
    onClose();
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

          <Text style={styles.modalTitle}>{initialData ? 'Editar Evento' : 'Nuevo Evento'}</Text>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Título del evento*"
              value={eventTitle}
              onChangeText={setEventTitle}
              autoFocus
            />

            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descripción (opcional)"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowCalendar(!showCalendar)}
            >
              <Text style={selectedDate ? styles.dateText : styles.placeholderText}>
                {selectedDate || 'Seleccionar fecha*'}
              </Text>
            </TouchableOpacity>

            {showCalendar && (
              <Calendar
                current={selectedDate}
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                  setShowCalendar(false);
                }}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: '#F392BE'
                  }
                }}
                theme={{
                  todayTextColor: '#F392BE',
                  arrowColor: '#F392BE',
                  textDayFontWeight: '500',
                  textMonthFontWeight: '600',
                }}
                style={styles.calendar}
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSubmit}
          >
            <Text style={styles.actionButtonText}>
              {initialData ? 'Guardar cambios' : 'Crear Evento'}
            </Text>
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
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#343434',
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
    color: '#343434',
  },
  dateInput: {
    height: 48,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  dateText: {
    color: '#343434',
    fontSize: 16,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  actionButton: {
    backgroundColor: '#F392BE',
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
  },
});

export default AlbumEventModal;