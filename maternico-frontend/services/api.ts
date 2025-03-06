import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔹 URL base del backend Laravel (ajústala según la IP de tu servidor)
const API_URL = 'http://IP:8000/api'; 

// 🔹 Función para manejar el login
export const login = async (email: string, password: string) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Error en la autenticación');

        const data = await response.json();
        if (!data.token) throw new Error('No se recibió el token');

        await AsyncStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
};


// 🔹 Función para obtener el perfil del usuario autenticado
export const getProfile = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No hay token almacenado');

        const response = await fetch(`${API_URL}/perfil`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo el perfil:', error);
        return null;
    }
};

// 🔹 Función para cerrar sesión
export const logout = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        await AsyncStorage.removeItem('token'); // Eliminamos el token guardado
    } catch (error) {
        console.error('Error en logout:', error);
    }
};
