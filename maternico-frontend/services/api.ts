import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔹 URL base del backend Laravel (ajústala según la IP de tu servidor)
const API_URL = 'http://148.226.202.216:8000/api'; 

export const register = async (name: string, lastName: string, motherLastName: string, email: string, password: string) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, lastName, motherLastName, email, password }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Error en el registro');

        const data = await response.json();
        if (!data.token) throw new Error('No se recibió el token');

        await AsyncStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        console.error("Error en registro:", error);
        throw error;
    }
};
// 🔹 Función para manejar el login
export const login = async (email: string, password: string) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

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
type User = {
  id: number;
  name: string;
  email: string;
  last_name: string;
  mother_last_name: string;
  birth_date: string;
  profile_photo: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export const getProfile = async (): Promise<UserResponse | null> => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No hay token almacenado');

        const response = await fetch(`${API_URL}/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) return null;
        const data = response.json();
        return await data as UserResponse;
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

        await AsyncStorage.removeItem('token');
    } catch (error) {
        console.error('Error en logout:', error);
    }
};

interface Magazine {
    id: string;
    title: string;
    magazine_path: string;
}

export const getMagazine = async (magazineID: number): Promise<{ magazine: Magazine }> => {
    try {
        const response = await fetch(`${API_URL}/magazine/${magazineID}`);
        if (!response.ok) throw new Error('Error al obtener las revistas');

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo revistas:', error);
        return { magazine: { id: '', title: '', magazine_path: '' } };
    }
}

interface Video {
    id: string;
    title: string;
    video_path: string;
}

export const getVideo = async (videoID: string): Promise<{ video: Video }> => {
    try {
        const response = await fetch(`${API_URL}/video/${videoID}`);
        if (!response.ok) throw new Error('Error al obtener el video');

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo video:', error);
        return { video: { id: '', title: '', video_path: '' } };
    }
}

export const getEvents = async (userID: number, year: number, month: number) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${API_URL}/get-events`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userID, year, month }),
        });
        if (!response.ok) throw new Error('Error al obtener los eventos');
    
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo eventos:', error);
        return [];
    }
}

export const createEvent = async (userID: number, eventTitle: string, date: string, time: string, notifiable: boolean, type: string) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userID, event_title: eventTitle, date: date, time: time, notifiable: notifiable, type: type }),
        });
        if (!response.ok) throw new Error('Error al crear evento');
    
        return await response.json();
    } catch (error) {
        console.error('Error creando evento:', error);
        return [];
    }
}

export const deleteEvent = async (eventID: number) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${API_URL}/events/${eventID}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Error al eliminar el evento');
    
        return await response.json();
    } catch (error) {
        console.error('Error eliminando evento:', error);
        return [];
    }
}
