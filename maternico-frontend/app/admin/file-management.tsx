import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { PrimaryButton, FormTextField } from "@/components";
import { createMagazine, createVideo } from "@/services/api";
import { UserCircleIcon } from "react-native-heroicons/solid";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const FileManagement = () => {
    const router = useRouter()
    const [magazineData, setMagazineData] = useState({
        title: '',
        magazinePath: '',
        category: ''
    });
    const [errors, setErrors] = useState<string[]>([])

    const [videoData, setVideoData] = useState({
        title: '',
        videoPath: '',
    });

    const handleMagazineSubmit = () => {
        try {
            setErrors([]);
            const { title, magazinePath } = magazineData;
            if (!title && !magazinePath) {
                setErrors(["Por favor, completa todos los campos de la revista."]);
                return;
            }
            if (!title) {
                setErrors(["Por favor, completa el campo de título de la revista."]);
                return;
            }
            if (!magazinePath) {
                setErrors(["Por favor, completa el campo de enlace de la revista."]);
                return;
            }
            if (!magazineData.category) {
                setErrors(["Por favor, selecciona una categoría para la revista."]);
                return;
            }
            createMagazine(title, magazinePath, magazineData.category)
                .then(response => {
                    setMagazineData({
                        title: '',
                        magazinePath: '',
                        category: ''
                    });
                })
                .catch(error => {
                    console.error("Error uploading magazine:", error);
                    setErrors([`Error al subir la revista. ${error.message}`]);
                });
        } catch (error) {
            console.error("Error uploading magazine:", error);
        }
    }

    const handleVideoSubmit = () => {
        try {
            setErrors([]);
            const { title, videoPath } = videoData;
            if (!title && !videoPath) {
                setErrors(["Por favor, completa todos los campos del video."]);
                return;
            }
            if (!title) {
                setErrors(["Por favor, completa el campo de título del video."]);
                return;
            }
            if (!videoPath) {
                setErrors(["Por favor, completa el campo de enlace del video."]);
                return;
            }

            createVideo(title, videoPath)
                .then(response => {
                    setVideoData({
                        title: '',
                        videoPath: '',
                    });
                })
                .catch(error => {
                    console.error("Error uploading video:", error);
                    setErrors([`Error al subir el video. ${error.message}`]);
                });
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    Gestión de Archivos
                </Text>
                <Pressable onPress={() => router.push("/profiles/profile")}>
                    <UserCircleIcon size={32} color="#F392BE" />
                </Pressable>
            </View>
            {errors.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                    {errors.map((error, index) => (
                        <Text key={index} style={{ color: 'red' }}>
                            {error}
                        </Text>
                    ))}
                </View>
            )}

            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subir Nueva Revista</Text>
            
            <View style={styles.inputContainer}>
                <FormTextField
                    label="Título"
                    placeholder="Revista 2-3 años - 2da Edición"
                    value={magazineData.title}
                    onChangeText={(e: string) => setMagazineData({ ...magazineData, title: e })}
                />
            </View>

            <View style={styles.inputContainer}>
                <FormTextField
                    label="Enlace de la Revista"
                    placeholder="https://drive.google.com/..."
                    value={magazineData.magazinePath}
                    onChangeText={(e: string) => setMagazineData({ ...magazineData, magazinePath: e })}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.pickerLabel}>Categoría</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={magazineData.category}
                        onValueChange={(itemValue) => 
                            setMagazineData({...magazineData, category: itemValue})
                        }
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecciona una categoría" value="" />
                        <Picker.Item label="0 a 1 años" value="0 a 1 años" />
                        <Picker.Item label="1 año" value="1 año" />
                        <Picker.Item label="2 años" value="2 años" />
                        <Picker.Item label="3 años" value="3 años" />
                        <Picker.Item label="4 años" value="4 años" />
                        <Picker.Item label="5 años" value="5 años" />
                    </Picker>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <PrimaryButton
                    text="Subir Revista"
                    onPress={handleMagazineSubmit}
                />
            </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subir Nuevo Video</Text>
            
            <View style={styles.inputContainer}>
                <FormTextField
                    label="Título"
                    placeholder="Lactancia temprana"
                    value={videoData.title}
                    onChangeText={(e: string) => setVideoData({ ...videoData, title: e })}
                />
            </View>

            <View style={styles.inputContainer}>
                <FormTextField
                    label="Enlace del Video"
                    placeholder="https://drive.google.com/..."
                    value={videoData.videoPath}
                    onChangeText={(e: string) => setVideoData({ ...videoData, videoPath: e })}
                />
            </View>

            <View style={styles.buttonContainer}>
                <PrimaryButton
                    text="Subir Video"
                    onPress={handleVideoSubmit}
                />
            </View>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F8FAFC',
        padding: 16,
        marginTop: "10%",
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 20 
    },
    headerTitle: { 
        fontSize: 24, 
        fontWeight: 'bold' 
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#343434',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#343434',
        marginBottom: 16,
    },
    separator: {
        height: 1,
        backgroundColor: '#EDEDED',
        marginVertical: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 8,
    },
    pickerLabel: {
        fontSize: 16,
        color: '#4a5568',
        marginBottom: 8,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        backgroundColor: 'white',
    },
    picker: {
        height: 52,
        color: '#4A5568',

    },
});

export default FileManagement;