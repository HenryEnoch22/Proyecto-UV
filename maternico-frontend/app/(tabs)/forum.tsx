import { useState } from "react";
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from "react-native";
import FormTextField from "../../components/FormTextField";
import PrimaryButton from "@/components/PrimaryButton";

interface Forum {
  id: number;
  user_id: number;
  title: string;
  text: string;
}

const Forum = () => {
  const [inputText, setInputText] = useState("");
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [forumTitle, setForumTitle] = useState("");
  
  // Datos de ejemplo (mientras conectas con tu backend)
  const mockForums: Forum[] = [
    {
      id: 1,
      user_id: 1,
      title: "¿Cómo meser al bebé?",
      text: "Estoy teniendo problemas con..."
    },
    {
      id: 2,
      user_id: 2,
      title: "Consejos para cuidado al dormir",
      text: "Quisiera compartir algunas técnicas..."
    }
  ];

  const handleCreateForum = () => {
    setShowTitleModal(true);
  };

  const handleSubmitForum = () => {
    // Lógica para enviar a tu backend
    console.log("Creando foro:", { title: forumTitle, text: inputText });
    setInputText("");
    setForumTitle("");
    setShowTitleModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comunidad</Text>
      </View>

      {/* Campo de texto principal */}
      <View style={styles.inputContainer}>
        <FormTextField
            placeholder="¿Qué quieres contar hoy?"
            multiline
            numberOfLines={4}
            value={inputText}
            onChangeText={setInputText}
            style={styles.mainInput}
        />

        {/* Botón flotante cuando hay texto */}
        {inputText.length > 0 && (
            <PrimaryButton 
            style={styles.floatingButton}
            onPress={handleCreateForum}
            text="Agregar foro"
            />
        )}
      </View>

      {/* Listado de foros existentes */}
      <ScrollView style={styles.forumList}>
        {mockForums.map((forum) => (
          <Pressable 
            key={forum.id}
            style={styles.forumCard}
            onPress={() => console.log("Navegar a detalle", forum.id)}
          >
            <Text style={styles.forumTitle}>{forum.title}</Text>
            <Text 
              style={styles.forumText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {forum.text}
            </Text>
            <Text style={styles.responses}>3 respuestas</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Modal para título */}
      <Modal
        visible={showTitleModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agrega un título</Text>
            <FormTextField
              placeholder="Título del foro"
              value={forumTitle}
              onChangeText={setForumTitle}
              style={styles.modalInput}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowTitleModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitForum}
              >
                <Text style={styles.modalButtonText}>Publicar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#F392BE',
    padding: 16,
    paddingVertical: "10%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FEFEFE',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 16,
  },
  mainInput: {
    margin: 16,
    borderRadius: 12,
    borderColor: "#666666",
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  floatingButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,

  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  forumList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  forumCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  forumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  forumText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  responses: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 20,
    borderColor: '#666666',
    borderWidth: 1,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  modalButtonText: {
    fontWeight: '500',
  },
});

export default Forum;