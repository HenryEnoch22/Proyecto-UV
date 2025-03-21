import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { ArrowLongLeftIcon, CameraIcon } from "react-native-heroicons/solid";
import PrimaryButton from "../../components/PrimaryButton";
import {useEffect, useState} from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { updateProfile } from "@/services/api";

const EditProfileScreen = () => {
    const { user, setUser } = useAuth();
    const navigation = useNavigation();

    console.log(user?.profile_photo_path);
    const [formData, setFormData] = useState({
        id: user?.id || "",
        name: user?.name || "",
        last_name: user?.last_name || "",
        mother_last_name: user?.mother_last_name || "",
        email: user?.email || "",
        birth_date: user?.birth_date || "",
        password: "",
        profile_photo_path: user?.profile_photo_path || "https://randomuser.me/api/portraits/lego/6.jpg",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id || "",
                name: user.name || "",
                last_name: user.last_name || "",
                mother_last_name: user.mother_last_name || "",
                email: user.email || "",
                birth_date: user.birth_date || "",
                password: "", // Si no se está modificando, podemos dejarlo vacío
                profile_photo_path: user.profile_photo_path || "https://randomuser.me/api/portraits/lego/6.jpg",
            });
        }
    }, [user]);  // Dependemos de user, cuando cambie, el formulario se actualizará


    const handleSubmit = async () => {
        if(!user?.id) {
            console.log("No se puede actualizar el perfil sin un usuario");
            return;
        }
        try{
            const updateProfileResponse = await updateProfile(Number(user.id), formData);
            if(updateProfileResponse){
                setUser(updateProfileResponse);
                navigation.goBack();
            }else{
                alert("Error al actualizar perfil");
            }
        }catch (e) {
            console.error("Error al cerrar sesión:", e);
        }
    }

    const handleImagePicker = async () => {
        console.log('handleImagePicker');
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        });

        if (!result.didCancel && result.assets?.[0]?.uri) {
            setFormData({...formData, profile_photo_path: result.assets[0].uri});
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLongLeftIcon size={24} color="#FEFEFE" />
                </Pressable>
                <Text style={styles.title}>Editar perfil</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Foto de perfil</Text>
                <Pressable onPress={handleImagePicker} style={styles.imageContainer}>
                    <Image
                        source={{ uri: formData.profile_photo_path }}
                        style={styles.profileImage}
                    />
                    <View style={styles.cameraIcon}>
                        <CameraIcon size={20} color="#FEFEFE" />
                    </View>
                </Pressable>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Datos personales</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre(s)"
                    value={formData.name}
                    onChangeText={(text) => setFormData({...formData, name: text})}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Apellido paterno"
                    value={formData.last_name}
                    onChangeText={(text) => setFormData({...formData, last_name: text})}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Apellido materno"
                    value={formData.mother_last_name}
                    onChangeText={(text) => setFormData({...formData, mother_last_name: text})}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChangeText={(text) => setFormData({...formData, email: text})}
                    keyboardType="email-address"
                />

                {/*<Text style={styles.sectionTitle}>Datos del bebé</Text>*/}
                {/*<TextInput*/}
                {/*    style={styles.input}*/}
                {/*    placeholder="Nombre del bebé"*/}
                {/*    value={formData.name}*/}
                {/*    onChangeText={(text) => setFormData({...formData, name: text})}*/}
                {/*/>*/}
                <TextInput
                    style={styles.input}
                    placeholder="Fecha de nacimiento (DD/MM/AAAA)"
                    value={formData.password}
                    onChangeText={(text) => setFormData({...formData, password: text})}
                />

                <PrimaryButton
                    text="Guardar cambios"
                    onPress={handleSubmit}
                    style={{ marginTop: 24 }}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FEFEFE",
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 16,
        alignItems: "center",
        backgroundColor: "#F392BE",
        paddingTop: "10%",
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#FEFEFE",
    },
    saveButton: {
        padding: 8,
    },
    formContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#F392BE",
        marginVertical: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: "#F8FAFC",
        marginBottom: 12,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: "center",
        marginBottom: 20,
    },
    imageContainer: {
        position: 'relative',
        alignSelf: 'center',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#f283b5',
        borderRadius: 20,
        padding: 8,
    },
});

export default EditProfileScreen;