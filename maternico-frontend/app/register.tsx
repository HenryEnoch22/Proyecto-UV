import { View, StyleSheet, Pressable, Text, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { PrimaryButton, FormTextField } from "@/components";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { register, getProfile } from "@/services/api";
import { ArrowLongLeftIcon } from "react-native-heroicons/outline";

export default function RegisterScreen() {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [motherLastName, setMotherLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const { setUser } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        setErrors({});
        const newErrors: Record<string, string[]> = {};
        if (!name) newErrors.name = ["Por favor ingresa tu nombre"];
        if (!lastName) newErrors.last_name = ["Por favor ingresa tu apellido paterno"];
        if (!email) newErrors.email = ["Por favor ingresa tu correo electrónico"];
        if (!password) newErrors.password = ["Por favor crea una contraseña"];
        if (password !== confirmPassword) newErrors.password_confirmation = ["Las contraseñas no coinciden"];

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await register(
                name,
                lastName,
                motherLastName,
                email,
                password,
                confirmPassword
            );

            const user = await getProfile();
            setUser(user?.user);
            Alert.alert("¡Bienvenida a MaterniCo!", "Tu cuenta ha sido creada con éxito.");
            router.push("/(tabs)/home");
        } catch (e: any) {
            if (e.response?.status === 422) {
                setErrors(e.response.data.errors);
            } else {
                Alert.alert("Error de registro", "Hubo un problema al crear tu cuenta. Por favor intenta más tarde.");
            }
        }
    };

    return (
        <View style={styles.mainContainer}>
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
                        value={name}
                        onChangeText={setName}
                        errors={errors.name || []}
                        style={styles.customInput}
                        placeholder="Maria Isabel"
                    />

                    <FormTextField
                        label="Apellido Paterno"
                        value={lastName}
                        onChangeText={setLastName}
                        errors={errors.last_name || []}
                        style={styles.customInput}
                        placeholder="Garcia"
                    />

                    <FormTextField
                        label="Apellido Materno"
                        value={motherLastName}
                        onChangeText={setMotherLastName}
                        errors={errors.mother_last_name || []}
                        style={styles.customInput}
                        placeholder="Jimenez"
                    />

                    <FormTextField
                        label="Correo Electrónico"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        errors={errors.email || []}
                        style={styles.customInput}
                        placeholder="ejemplo@correo.com"
                    />

                    <FormTextField
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        errors={errors.password || []}
                        style={styles.customInput}
                        placeholder="Crea una contraseña segura"
                    />

                    <FormTextField
                        label="Confirmar Contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
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
});