import { View, StyleSheet, Pressable, Text, ScrollView, Alert, Switch, Modal, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { PrimaryButton, FormTextField } from "@/components";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { register, getProfile, getStates, getMunicipalitiesByState, getLocalitiesByMunicipality } from "@/services/api";
import { ArrowLongLeftIcon } from "react-native-heroicons/outline";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        mother_last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        locality_state: "",
        locality_municipality: "",
        locality: "",
        is_rural: false,
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [states, setStates] = useState<string[]>([]);
    const [municipalities, setMunicipalities] = useState<string[]>([]);
    const [localities, setLocalities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { setUser } = useAuth();
    const router = useRouter();

    const getCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            throw new Error("Permiso de ubicación denegado");
        }

        const location = await Location.getCurrentPositionAsync({});
        console.log("Ubicación actual:", location.coords.latitude, location.coords.longitude);
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    };

    useEffect(() => {
        if (formData.is_rural) {
            loadStates();
        }
    }, [formData.is_rural]);

    const loadStates = async () => {
        const res = await getStates();
        if (res.success) {
            setStates(res.data);
        }
    };

    const loadMunicipalities = async (state: string) => {
        const res = await getMunicipalitiesByState(state);
        if (res.success) {
            setMunicipalities(res.data);
        }
    };

    const loadLocalities = async (state: string, municipality: string) => {
        const res = await getLocalitiesByMunicipality(state, municipality);
        if (res.success) {
            setLocalities(res.data);
        }
    };

    const handleRegister = async () => {
        setErrors({});
        const newErrors: Record<string, string[]> = {};
        
        // Validaciones existentes...
        if (!formData.name.trim()) {
            newErrors.name = ["Por favor ingresa tu nombre"];
        } else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(formData.name)) {
            newErrors.name = ["El nombre solo debe contener letras"];
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = ["Por favor ingresa tu apellido paterno"];
        } else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(formData.last_name)) {
            newErrors.last_name = ["El apellido solo debe contener letras"];
        }

        if (formData.mother_last_name && !/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(formData.mother_last_name)) {
            newErrors.mother_last_name = ["El apellido materno solo debe contener letras"];
        }

        if (!formData.email.trim()) {
            newErrors.email = ["Por favor ingresa tu correo electrónico"];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = ["Ingresa un correo electrónico válido"];
        }

        if (!formData.password) {
            newErrors.password = ["Por favor crea una contraseña"];
        } else {
            if (formData.password.length < 8) {
                newErrors.password = ["La contraseña debe tener al menos 8 caracteres"];
            }
            if (!/[0-9]/.test(formData.password) || !/[A-Za-z]/.test(formData.password)) {
                newErrors.password = [...(newErrors.password || []), "Debe contener letras y números"];
            }
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = ["Las contraseñas no coinciden"];
        }

        // Validaciones para zona rural
        if (formData.is_rural) {
            if (!formData.locality_state) {
                newErrors.locality_state = ["Por favor selecciona un estado"];
            }
            if (!formData.locality_municipality) {
                newErrors.locality_municipality = ["Por favor selecciona un municipio"];
            }
            if (!formData.locality) {
                newErrors.locality = ["Por favor selecciona una localidad"];
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Obtener ubicación actual
            const { latitude, longitude } = await getCurrentLocation();

            // Preparar datos para el registro
            const registerData = {
                name: formData.name,
                last_name: formData.last_name,
                mother_last_name: formData.mother_last_name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
                is_rural: formData.is_rural,
                user_lat: latitude,
                user_lng: longitude,
            };

            // Si es zona rural, agregar datos de localidad
            if (formData.is_rural) {
                Object.assign(registerData, {
                    locality_state: formData.locality_state,
                    locality_municipality: formData.locality_municipality,
                    locality_name: formData.locality,
                });
            }

            await register(registerData);

            const user = await getProfile();
            if (user?.user)  {
                setUser(user.user);
                Alert.alert("¡Bienvenida a MaterniCo!", "Tu cuenta ha sido creada con éxito.");
                router.push("/(tabs)/home");
            } else {
                Alert.alert("Error", "No se pudo obtener el perfil del usuario. Por favor, intenta más tarde.");
            }
        } catch (e: any) {
            if (e.response?.status === 422) {
                setErrors(e.response.data.errors);
            } else {
                Alert.alert("Error de registro", e.message || "Hubo un problema al crear tu cuenta. Por favor intenta más tarde.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            {/* Modal de carga */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={isLoading}
                onRequestClose={() => {}}>
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingContent}>
                        <ActivityIndicator size="large" color="#F283B5" />
                        <Text style={styles.loadingText}>Creando tu cuenta...</Text>
                    </View>
                </View>
            </Modal>

            <View style={styles.topSection}>
                <Text style={styles.greet}>¡Únete!</Text>
                <Text style={styles.greetFoot}>Crea tu cuenta en MaterniCo</Text>
            </View>

            <View style={styles.bottomSection}>
                <Pressable onPress={() => router.push("/screens/LoginScreen")} style={styles.loginContainer}>
                    <ArrowLongLeftIcon size={24} color="#666666" />
                    <Text style={styles.loginText}>¿Ya tienes una cuenta? <Text style={styles.loginLink}>¡Inicia sesión!</Text> </Text>
                </Pressable>
                <Text style={styles.title}>Regístrate</Text>

                <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                    <FormTextField
                        label="Nombre"
                        value={formData.name}
                        onChangeText={(text: string) => setFormData({ ...formData, name: text })}
                        errors={errors.name || []}
                        style={styles.customInput}
                        placeholder="Maria Isabel"
                    />

                    <FormTextField
                        label="Apellido Paterno"
                        value={formData.last_name}
                        onChangeText={(text: string) => setFormData({ ...formData, last_name: text })}
                        errors={errors.last_name || []}
                        style={styles.customInput}
                        placeholder="Garcia"
                    />

                    <FormTextField
                        label="Apellido Materno"
                        value={formData.mother_last_name}
                        onChangeText={(text: string) => setFormData({ ...formData, mother_last_name: text })}
                        errors={errors.mother_last_name || []}
                        style={styles.customInput}
                        placeholder="Jimenez"
                    />

                    {/* 🔽 Switch para zona rural */}
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>¿Vives en una zona rural?</Text>
                        <Switch
                            value={formData.is_rural}
                            onValueChange={(val) => setFormData({ ...formData, is_rural: val })}
                            thumbColor={formData.is_rural ? "#F283B5" : "#f4f3f4"}
                            trackColor={{ false: "#767577", true: "#F7BFD7" }}
                        />
                    </View>

                    {formData.is_rural && (
                        <>
                            {/* Estados */}
                            <View style={styles.pickerWrapper}>
                                <Text style={styles.pickerLabel}>Estado</Text>
                                <Picker
                                    selectedValue={formData.locality_state}
                                    onValueChange={(value) => {
                                        setFormData({ ...formData, locality_state: value, locality_municipality: "", locality: "" });
                                        setMunicipalities([]);
                                        setLocalities([]);
                                        if (value) {
                                            loadMunicipalities(value);
                                        }
                                    }}
                                >
                                    <Picker.Item label="Selecciona un estado" value="" />
                                    {states.map((s) => (
                                        <Picker.Item key={s} label={s} value={s} />
                                    ))}
                                </Picker>
                                {errors.locality_state && (
                                    <Text style={styles.errorText}>{errors.locality_state[0]}</Text>
                                )}
                            </View>

                            {/* Municipios */}
                            <View style={styles.pickerWrapper}>
                                <Text style={styles.pickerLabel}>Municipio</Text>
                                <Picker
                                    enabled={!!formData.locality_state}
                                    selectedValue={formData.locality_municipality}
                                    onValueChange={(value) => {
                                        setFormData({ ...formData, locality_municipality: value, locality: "" });
                                        setLocalities([]);
                                        if (value && formData.locality_state) {
                                            loadLocalities(formData.locality_state, value);
                                        }
                                    }}
                                >
                                    <Picker.Item label="Selecciona un municipio" value="" />
                                    {municipalities.map((m) => (
                                        <Picker.Item key={m} label={m} value={m} />
                                    ))}
                                </Picker>
                                {errors.locality_municipality && (
                                    <Text style={styles.errorText}>{errors.locality_municipality[0]}</Text>
                                )}
                            </View>

                            {/* Localidades */}
                            <View style={styles.pickerWrapper}>
                                <Text style={styles.pickerLabel}>Localidad</Text>
                                <Picker
                                    enabled={!!formData.locality_municipality}
                                    selectedValue={formData.locality}
                                    onValueChange={(value) => setFormData({ ...formData, locality: value })}
                                >
                                    <Picker.Item label="Selecciona una localidad" value="" />
                                    {localities.map((l) => (
                                        <Picker.Item key={l.id} label={l.locality_name} value={l.locality_name} />
                                    ))}
                                </Picker>
                                {errors.locality && (
                                    <Text style={styles.errorText}>{errors.locality[0]}</Text>
                                )}
                            </View>
                        </>
                    )}

                    <FormTextField
                        label="Correo Electrónico"
                        value={formData.email}
                        onChangeText={(text: string) => setFormData({ ...formData, email: text })}
                        keyboardType="email-address"
                        errors={errors.email || []}
                        style={styles.customInput}
                        placeholder="ejemplo@correo.com"
                    />

                    <FormTextField
                        label="Contraseña"
                        value={formData.password}
                        onChangeText={(text: string) => setFormData({ ...formData, password: text })}
                        secureTextEntry
                        errors={errors.password || []}
                        style={styles.customInput}
                        placeholder="Crea una contraseña segura"
                    />

                    <FormTextField
                        label="Confirmar Contraseña"
                        value={formData.password_confirmation}
                        onChangeText={(text: string) => setFormData({ ...formData, password_confirmation: text })}
                        secureTextEntry
                        errors={errors.password_confirmation || []}
                        style={styles.customInput}
                        placeholder="Vuelve a escribir tu contraseña"
                    />

                    <Text style={styles.passwordTip}>
                        Usa una contraseña de al menos 8 caracteres que incluya letras y números.
                    </Text>

                    <PrimaryButton 
                        onPress={handleRegister} 
                        text='Crear cuenta'
                        disabled={isLoading}
                    />
                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#F283B5",
    },
    topSection: {
        height: "25%",
        paddingHorizontal: 30,
        paddingTop: 50,
        position: "relative",
    },
    greet: {
        color: "white",
        fontWeight: "bold",
        fontSize: 48,
        marginBottom: 4,
    },
    greetFoot: {
        color: "white",
        fontSize: 22,
        marginBottom: 20,
    },
    bottomSection: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        paddingTop: 30,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    formContainer: {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 20,
    },
    customInput: {
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E5E5",
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 16,
        marginVertical: 8,
    },
    inputText: {
        fontSize: 16,
        color: "#333333",
    },
    placeholderText: {
        fontSize: 16,
        color: "#AAAAAA",
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 12,
        marginTop: 4,
        marginLeft: 5,
    },
    passwordTip: {
        fontSize: 14,
        color: "#666666",
        marginTop: 4,
        marginBottom: 24,
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        paddingBottom: 30,
    },
    loginText: {
        color: "#666666",
        fontSize: 16,
    },
    loginLink: {
        color: "#F283B5",
        fontWeight: "bold",
        fontSize: 16,
    },
    bottomSpacing: {
        height: 50,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12,
    },
    switchLabel: { fontSize: 16, color: "#333333" },
    pickerWrapper: { 
        marginVertical: 10, 
        borderWidth: 1, 
        borderColor: "#ccc", 
        borderRadius: 8,
        padding: 5,
    },
    pickerLabel: { fontSize: 14, fontWeight: "bold", margin: 5 },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        minWidth: 200,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});