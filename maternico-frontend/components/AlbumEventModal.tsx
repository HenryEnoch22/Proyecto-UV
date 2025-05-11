import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, TextInput } from 'react-native';
import { XCircleIcon } from 'react-native-heroicons/solid';
import DatePicker from './DatePicker';
import * as ImagePicker from 'expo-image-picker';
import PrimaryButton from './PrimaryButton';

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { event_title: string; description?: string; date: string, photo_path: ImagePicker.ImagePickerAsset }) => void;
}

const AlbumEventModal = ({ visible, onClose, onSubmit }: EventModalProps) => {
  const [eventTitle, setEventTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [imagePickerText, setImagePickerText] = useState<string>('Seleccionar imagen');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0]);
      setImagePickerText('Imagen seleccionada');
    } else {
      setImage(null);
      setImagePickerText('Seleccionar imagen');
    }
  };

  const handleSubmit = () => {
    if (!eventTitle.trim() || !selectedDate) {
      alert('Campos requeridos faltantes');
      return;
    }
  
    if (!image) {
      alert('¡Selecciona una imagen primero!');
      return;
    }
  
    onSubmit({
      event_title: eventTitle,
      description: description.trim(),
      date: selectedDate,
      photo_path: image,
    });

    setEventTitle('');
    setDescription('');
    setSelectedDate('');
    setImage(null);
    setImagePickerText('Seleccionar imagen');
    
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

          <Text style={styles.modalTitle}>Nuevo Evento</Text>

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
              placeholder="Descripción"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <DatePicker
              value={selectedDate ? new Date(selectedDate) : new Date()}
              onChange={(date) => {
                setSelectedDate(date.toISOString().split('T')[0]);
                setShowCalendar(false);
              }}
              />

              <Pressable
                style={styles.imagePicker}
                onPress={pickImage}
              >
                <Text>{imagePickerText}</Text>
              </Pressable>
          </View>

          <PrimaryButton
            text='Crear Evento'
            onPress={handleSubmit}
          >
          </PrimaryButton>
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
  imagePicker: {
    height: 48,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
});

export default AlbumEventModal;