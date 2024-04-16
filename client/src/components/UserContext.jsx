import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState({ email: '', name: '', _id: '' });
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Run only once when component mounts
        if (!ready) {
            axios.get(`/users/profile`, { withCredentials: true })
            .then(({ data }) => {
                setUser(data);
                setReady(true);
            })
            .catch(error => {
                setUser({ email: '', name: '', _id: '' });
                setReady(true);
                console.log(error);
            });
        }
        
    }, []); // Empty dependency array means it runs only once

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
