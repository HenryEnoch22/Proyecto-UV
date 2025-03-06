import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../services/api';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const userData = await login(email, password);
            console.log("Token recibido:", userData.token); // Verifica el token en la consola
            await AsyncStorage.setItem("token", userData.token);
            const savedToken = await AsyncStorage.getItem("token");
            console.log("Token guardado en AsyncStorage:", savedToken); // Verifica si se guardó
            router.replace('/home');
        } catch (error) {
            console.error("Error en login:", error);
            Alert.alert("Error", "No se pudo iniciar sesión");
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Iniciar Sesión</Text>
            <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={{ borderBottomWidth: 1, marginBottom: 10, padding: 8 }}
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                style={{ borderBottomWidth: 1, marginBottom: 10, padding: 8 }}
                secureTextEntry
            />
            <Button title="Iniciar Sesión" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        justifyContent: 'center',
    },
});

export default LoginScreen;
