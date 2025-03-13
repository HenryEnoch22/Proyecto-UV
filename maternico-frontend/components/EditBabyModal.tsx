import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable, TextInput } from 'react-native';
import { XCircleIcon } from 'react-native-heroicons/solid';

interface EditBabyModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { weight: string; height: string }) => void;
  weight: string;
  height: string;
}

const EditBabyModal = ({ visible, onClose, onSubmit, weight: initialWeight, height: initialHeight }: EditBabyModalProps) => {
  const [weight, setWeight] = useState(initialWeight);
  const [height, setHeight] = useState(initialHeight);

  const handleSubmit = () => {
    if (!weight || !height) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    if (isNaN(Number(weight)) || isNaN(Number(height))) {
      alert('Los valores deben ser numéricos');
      return;
    }

    onSubmit({ weight, height });
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

          <Text style={styles.modalTitle}>Editar datos médicos</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 3.5"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                autoFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Altura (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 52"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSubmit}
          >
            <Text style={styles.actionButtonText}>Guardar cambios</Text>
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8FAFC',
    fontSize: 16,
    color: '#4A5568',
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
});

export default EditBabyModal;