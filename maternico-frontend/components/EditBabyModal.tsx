import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { XCircleIcon } from 'react-native-heroicons/solid';
import FormTextField from './FormTextField';
import DatePicker from './DatePicker';

type BabyData = {
  id: number;
  name: string;
  lastName: string;
  motherLastName: string;
  birthDate: string;
  bloodType: string;
  weight: number;
  height: number;
};

interface EditBabyModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: BabyData) => void;
  baby: BabyData;
}

const EditBabyModal = ({ visible, onClose, onSubmit, baby }: EditBabyModalProps) => {
  const [babyData, setBabyData] = useState<BabyData>(baby);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setBabyData(baby);
  }, [baby]);

  const handleChange = (field: keyof BabyData, value: string) => {
    setErrors({});
    setBabyData(prev => ({
      ...prev,
      [field]: field === 'weight' || field === 'height' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string[]> = {};

    if (!babyData.weight) newErrors.weight = ["Por favor ingresa el peso"];
    if (!babyData.height) newErrors.height = ["Por favor ingresa la altura"];
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(babyData);
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
            <FormTextField
              label="Nombre"
              placeholder="Alexis"
              value={babyData.name}
              onChangeText={(text: string) => handleChange('name', text)}
              errors={errors.name}
              style={styles.customInput}
              autoFocus
            />

            <FormTextField
              label="Apellido paterno"
              placeholder="Moreno"
              value={babyData.lastName}
              onChangeText={(text: string) => handleChange('lastName', text)}
              errors={errors.lastName}
              style={styles.customInput}
            />

            <FormTextField
              label="Apellido materno"
              placeholder="Amaro"
              value={babyData.motherLastName}
              onChangeText={(text: string) => handleChange('motherLastName', text)}
              errors={errors.height}
              style={styles.customInput}
            />

            <DatePicker
              label="Fecha de nacimiento"
              value={new Date(babyData.birthDate)}
              onChange={(date: Date) => handleChange('birthDate', date.toISOString())}
            />

            <FormTextField
              label="Tipo de sangre"
              placeholder="Ej: O+"
              value={babyData.bloodType}
              onChangeText={(text: string) => handleChange('bloodType', text)}
              errors={errors.height}
              style={styles.customInput}
            />

            <FormTextField
              label="Peso (kg)"
              placeholder="Ej: 4.75"
              value={babyData.weight.toString()}
              onChangeText={(text: string) => handleChange('weight', text)}
              keyboardType="numeric"
              errors={errors.weight}
              style={styles.customInput}
            />

            <FormTextField
              label="Altura (cm)"
              placeholder="Ej: 52"
              value={babyData.height.toString()}
              onChangeText={(text) => handleChange('height', text)}
              keyboardType="numeric"
              errors={errors.height}
              style={styles.customInput}
            />
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
  customInput: {
    height: 48,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8FAFC',
    fontSize: 16,
    color: '#4A5568',
    marginVertical: 8,
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