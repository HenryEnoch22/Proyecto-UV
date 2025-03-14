import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔹 URL base del backend Laravel (ajústala según la IP de tu servidor)
const API_URL = 'http://192.168.100.16:8000/api'; 

export const register = async (name: string, lastName: string, motherLastName: string, email: string, password: string) => {
    try {

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, last_name: lastName, mother_last_name: motherLastName, email, password }),
        });

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
type Baby = {
    id: string;
    user_id: number;
    name: string;
    last_name: string;
    mother_last_name: string;
    birth_date: string;
    height: string;
    weight: string;
    blood_type: string;
}

type User = {
  id: number;
  name: string;
  email: string;
  last_name: string;
  mother_last_name: string;
  birth_date: string;
  profile_photo: string;
  baby: Baby;
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

export const getMagazines = async () => {
    try {
        const token = await AsyncStorage.getItem('token'); // Añadir
        const response = await fetch(`${API_URL}/magazines`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Añadir header
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {throw new Error('Error al obtener revistas');}
        
        const { data } = await response.json();
        console.log('magazines data en api', data);
        return data;
    } catch (error) {
        return [];
    }
}

export const getMagazine = async (magazineID: number): Promise<{ magazine: Magazine }> => {
    try {
        const response = await fetch(`${API_URL}/magazine/${magazineID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al obtener las revistas');

        const { data } = await response.json(); // Extraer data
        return data;
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

export const getVideos = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_URL}/videos`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al obtener videos');
        const { data } = await response.json(); // Extraer data
        console.log('videos data en api', data);
        return data;
    } catch (error) {
        return [];
    }
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

export const createEvent = async (userID: number, eventTitle: string, date: string, time: string, notifiable: boolean, type: number) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const types = {
            1: 'Vacunación',
            2: 'Alimentación',
            3: 'Desarrollo',
            4: 'Cita médica',
            5: 'Cumpleaños'
        };
        
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userID, event_title: eventTitle, date: date, time: time, notifiable: notifiable, type: types[type] }),
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

export const getForum = async (forumID: string) => {
    try {
        const response = await fetch(`${API_URL}/forums/${forumID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al obtener el foro');

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo foro:', error);
        return { forum: { id: '', title: '', text: '' } };
    }
}

export const getForums = async () => {
    try {
        const response = await fetch(`${API_URL}/forums`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Error al obtener los foros');

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error obteniendo foros apits:', error);
        return [];
    }
}

export const createForum = async (userID: number, title: string, text: string) => {
    try {
        const response = await fetch(`${API_URL}/forums`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'user_id': userID, 'title': title, 'text': text }),
        });
        if (!response.ok) throw new Error('Error al crear el foro');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creando foro:', error);
        return [];
    }
}

export const createComment = async (userID: number, forumID: number, comment: string) => {
    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'user_id': userID , 'forum_id': forumID, 'text': comment }),
        });
        if (!response.ok) throw new Error('Error al crear el comentario');

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error creando comentario:', error);
        return [];
    }
}

export const getForumComments = async (forumID: number) => {
    try {
        
        const response = await fetch(`${API_URL}/forums/${forumID}/comments`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al obtener los comentarios');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error obteniendo comentarios:', error);
        return [];
    }
}

export const getHealthCenters = async () => {
    try {
        const response = await fetch(`${API_URL}/health-centers`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al obtener los centros de salud');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error obteniendo centros de salud:', error);
        return [];
    }
}

export const getBaby = async (babyID: number) => {
    try {
        const response = await fetch(`${API_URL}/babies/${babyID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al obtener el bebé');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error obteniendo bebé:', error);
        return [];
    }
}