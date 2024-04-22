import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState({ email: '', name: '', _id: '' });
    const [ready, setReady] = useState(false);

    useEffect(() => {
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
        } else {
            setReady(true);
        }
    }, [ready]);

    

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
