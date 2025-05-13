import { useState, useEffect } from "react";
import { View, Text, Pressable, Modal, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { createForum, getForums } from "@/services/api";
import { PrimaryButton, FormTextField } from "@/components";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

interface Forum {
  id: number;
  user_id: number;
  title: string;
  text: string;
}

const Forum = () => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [forumTitle, setForumTitle] = useState("");
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const data = await getForums();
        setForums(data.forums);
      } catch (err) {
        setError("Error al cargar los foros");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchForums();
  }, []);

  const handleCreateForum = () => {
    setShowTitleModal(true);
  };

  const handleSubmitForum = async () => {
    try {
      await createForum(user.id, forumTitle, inputText);
      
      const updatedForums = await getForums();
      setForums(updatedForums.forums);
      
      setInputText("");
      setForumTitle("");
      setShowTitleModal(false);
    } catch (err) {
      console.error("Error al crear foro:", err);
      setError("Error al publicar el foro");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F392BE" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comunidad</Text>
      </View>

      <View style={styles.inputContainer}>
        <FormTextField
          placeholder="¿Qué experiencia nueva tienes para compartir?"
          multiline
          numberOfLines={4}
          value={inputText}
          onChangeText={setInputText}
          style={styles.mainInput}
        />

        {inputText.length > 0 && (
          <PrimaryButton 
            style={styles.floatingButton}
            onPress={handleCreateForum}
            text="Agregar foro"
          />
        )}
      </View>

      <ScrollView style={styles.forumList}>
        {forums.length === 0 ? (
          <Text style={styles.emptyText}>No hay foros disponibles</Text>
        ) : (
          forums.map((forum) => (
            <Pressable 
              key={forum.id}
              style={styles.forumCard}
              onPress={() => router.push(`/forumDetail/${forum.id}`)}
            >
              <Text style={styles.forumTitle}>{forum.title}</Text>
              <Text 
                style={styles.forumText}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {forum.text}
              </Text>
              <Text style={styles.responses}>{forum.comments.length} respuestas</Text>
            </Pressable>
          ))
        )}
      </ScrollView>

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
                <Text style={styles.modalSubmitText}>Publicar</Text>
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
    paddingTop: "10%",
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
    backgroundColor: '#F392BE',
  },
  modalButtonText: {
    fontWeight: '500',
  },
  modalSubmitText: {
    color: '#fefefe',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Forum;