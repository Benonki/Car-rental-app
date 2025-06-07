import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type UserContextType = {
    username: string | null;
    setUsername: (username: string | null) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    const handleSetUsername = (username: string | null) => {
        if (username) {
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('username');
        }
        setUsername(username);
    };

    const logout = () => {
        localStorage.removeItem('username');
        setUsername(null);
    };

    return (
        <UserContext.Provider value={{ username, setUsername: handleSetUsername, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};