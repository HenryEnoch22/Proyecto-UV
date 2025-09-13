import { View, StyleSheet, Pressable, Text, Image } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '@/services/api';
import { FormTextField, PrimaryButton } from "@/components";
import { Alert } from 'react-native';
import logo from "../../assets/images/logo/MaternicoLogo.png";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({});
    const router = useRouter();

    const handleLogin = async () => {
        try {
            setErrors({});
            const newErrors: { email?: string[]; password?: string[] } = {};

            // Validar correo
            if (!email.trim()) {
                newErrors.email = ["Por favor ingresa tu correo electrónico"];
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                newErrors.email = ["El correo electrónico no es válido"];
            }

            // Validar contraseña
            if (!password) {
                newErrors.password = ["Por favor ingresa tu contraseña"];
            } else if (password.length < 8) {
                newErrors.password = ["La contraseña debe tener al menos 8 caracteres"];
            }

            // Mostrar errores y evitar envío si existen
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            
            const userData = await login(email, password);
            
            await AsyncStorage.setItem("token", userData.token);
            router.replace('/home');
        } catch (error: any) {
            console.error("Error en login:", error);
            if (error.status === 422) {
                setErrors(error.errors || {});
            } else if (error.status === 401) {
                setErrors({ email: ["Credenciales incorrectas"] });
            } else {
                Alert.alert("Error", "No se pudo iniciar sesión");
            }
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.topSection}>
                <Text style={styles.greet}>Hola!</Text>
                <Text style={styles.greetFoot}>Bienvenida a MaterniCo</Text>
            </View>

            <View style={styles.bottomSection}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={logo}
                    />
                </View>

                <Text style={styles.title}>Iniciar sesión</Text>

                <View style={styles.formContainer}>
                    <FormTextField
                        label="Correo Electrónico"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        errors={errors.email || []}
                        style={styles.customInput}
                    />

                    <FormTextField
                        label="Contraseña"
                        placeholder="********"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        errors={errors.password || []}
                        style={styles.customInput}
                    />

                    <PrimaryButton 
                        onPress={handleLogin} 
                        text='Iniciar sesión' 
                    />

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
                        <Pressable onPress={() => router.push('/register')}>
                            <Text style={styles.registerLink}>Regístrate!</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#F283B5",
    },
    topSection: {
        height: "40%",
        paddingHorizontal: 30,
        paddingTop: 60,
        position: "relative",
    },
    greet: {
        color: "white",
        fontWeight: "bold",
        fontSize: 52,
        marginBottom: 4,
    },
    greetFoot: {
        color: "white",
        fontSize: 24,
        marginBottom: 20,
    },
    logoContainer: {
        position: "absolute",
        right: 30,
        top: -40,
        zIndex: 10000,
    },
    logo: {
        width: 90,
        height: 90,
        zIndex: 10000,
        objectFit: "scale-down",
    },
    bottomSection: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        paddingTop: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 24,
    },
    formContainer: {
        paddingTop: 10,
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
    forgotPassword: {
        textAlign: "right",
        color: "#666666",
        marginTop: 4,
        marginBottom: 30,
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
        paddingBottom: 30,
    },
    registerText: {
        color: "#666666",
        fontSize: 15,
    },
    registerLink: {
        color: "#F283B5",
        fontWeight: "bold",
        fontSize: 15,
    }
});

export default LoginScreen;