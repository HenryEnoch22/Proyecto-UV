import { createContext, useContext, useState, ReactNode } from "react";

// 1️⃣ Define el tipo de usuario
type User = {
    id: string;
    name: string;
    email: string;
    last_name: string,
    mother_last_name: string,
    birth_date: string,
    profile_photo: string,
} | null;

// 2️⃣ Define el tipo del contexto
type AuthContextType = {
    user: User;
    setUser: (user: User) => void;
    logout: () => void;
};

// 3️⃣ Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4️⃣ Crea el proveedor de autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 5️⃣ Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};
