import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState({ email: '', name: '', _id: '' });
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/users/profile`, { withCredentials: true });
                setUser(data);
                setReady(true);
            } catch (error) {
                setUser({ email: '', name: '', _id: '' });
                setReady(true);
                navigate(`/login`);
            }
        };

        if (!ready) {
            fetchData();
        }
    }, [ready, navigate]);
    
    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
