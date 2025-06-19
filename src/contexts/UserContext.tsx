import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type UserContextType = {
    username: string | null;
    customerId: string | null;
    setUsername: (username: string | null) => void;
    setCustomerId: (customerId: string | null) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [customerId, setCustomerId] = useState<string | null>(null);

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedCustomerId = localStorage.getItem('customerId');
        if (savedUsername) setUsername(savedUsername);
        if (savedCustomerId) setCustomerId(savedCustomerId);
    }, []);

    const handleSetUsername = (username: string | null) => {
        if (username) {
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('username');
        }
        setUsername(username);
    };

    const handleSetCustomerId = (customerId: string | null) => {
        if (customerId) {
            localStorage.setItem('customerId', customerId);
        } else {
            localStorage.removeItem('customerId');
        }
        setCustomerId(customerId);
    };

    const logout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('customerId');
        setUsername(null);
        setCustomerId(null);
    };

    return (
        <UserContext.Provider value={{ username, customerId, setUsername: handleSetUsername, setCustomerId: handleSetCustomerId, logout }}>
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
