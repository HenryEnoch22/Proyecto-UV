import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const router = useRouter();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                try {
                    const response = await fetch("http://IP:8000/api/user", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setUserName(data.name);
                    } else {
                        console.error("Error al obtener usuario:", data);
                    }
                } catch (error) {
                    console.error("Error de red al obtener usuario:", error);
                }
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token"); // Elimina el token de sesión
        router.replace("/"); // Redirige al Login
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido, {userName}</Text>
            <Button title="Cerrar Sesión" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default HomeScreen;