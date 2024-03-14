import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if(!user) {
            axios.get(`${import.meta.env.VITE_SERVER_URL}/profile`).then(({data}) => {
                console.log('ahahah', data)
                setUser(data);
                setReady(true);
            }).catch(error => {
                console.log(error)
            });
        }
    }, []);
    return (
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    )
}
